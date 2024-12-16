import { PrimengModule } from '@/app/primeng.module'
import {
    Component,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    Output,
} from '@angular/core'
import { MenuItem, MessageService } from 'primeng/api'
import { AulaBancoPreguntasComponent } from '../../../../aula-banco-preguntas/aula-banco-preguntas/aula-banco-preguntas.component'
import { PreguntasFormComponent } from '../../evaluacion-form/preguntas-form/preguntas-form.component'
import { ApiAulaBancoPreguntasService } from '@/app/sistema/aula-virtual/services/api-aula-banco-preguntas.service'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { FormBuilder, Validators } from '@angular/forms'
import { HttpClient } from '@angular/common/http'
import { environment } from '@/environments/environment'
import { catchError, map, throwError } from 'rxjs'
import { GeneralService } from '@/app/servicios/general.service'
import { BancoPreguntaListaComponent } from '@/app/sistema/evaluaciones/sub-evaluaciones/banco-preguntas/components/banco-pregunta-lista/banco-pregunta-lista.component'
import { columnsBancoPreguntas } from '../../evaluacion-form/evaluacion-form-preguntas/evaluacion-form-preguntas'
import { removeHTML } from '@/app/shared/utils/remove-html'

@Component({
    selector: 'app-list-preguntas',
    standalone: true,
    imports: [
        PrimengModule,
        AulaBancoPreguntasComponent,
        PreguntasFormComponent,
        BancoPreguntaListaComponent,
    ],
    templateUrl: './list-preguntas.component.html',
    styleUrl: './list-preguntas.component.scss',
})
export class ListPreguntasComponent implements OnChanges {
    @Output() accionBtnItem = new EventEmitter()
    private _ApiAulaBancoPreguntasService = inject(ApiAulaBancoPreguntasService)
    private _ConstantesService = inject(ConstantesService)
    private _FormBuilder = inject(FormBuilder)
    private http = inject(HttpClient)
    private _GeneralService = inject(GeneralService)
    private _MessageService = inject(MessageService)

    @Input() data
    @Input() curso
    @Input() iEvaluacionId: string

    showModal = true
    showModalPreguntas: boolean = false
    showModalBancoPreguntas: boolean = false
    showModalEncabezadoPreguntas: boolean = false
    preguntasSeleccionadas = []
    jEnunciadoUrl: any = ''
    idEncabPregId
    preguntas = []
    columnas = columnsBancoPreguntas
    acciones = [
        {
            labelTooltip: 'Agregar Preguntas',
            icon: 'pi pi-plus',
            accion: 'agregar_preguntas',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
            isVisible: (row) => row.idEncabPregId,
        },
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-pencil',
            accion: 'actualizar',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
        {
            labelTooltip: 'Eliminar',
            icon: 'pi pi-trash',
            accion: 'eliminar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
    ]

    private backendApi = environment.backendApi

    formEncabezadoPreguntas = this._FormBuilder.group({
        opcion: [''],
        valorBusqueda: [''],

        idEncabPregId: [],
        iDocenteId: [],
        iNivelCicloId: [],
        iCursoId: [],
        cEncabPregTitulo: [],
        cEncabPregContenido: ['', Validators.required],
    })
    ngOnChanges(changes) {
        if (changes.data?.currentValue) {
            this.data = changes.data.currentValue
        }
        if (changes.iEvaluacionId?.currentValue) {
            this.iEvaluacionId = changes.iEvaluacionId.currentValue
            this.obtenerBancoPreguntas()
        }
    }

    tiposAgrecacionPregunta: MenuItem[] = [
        {
            label: 'Nueva Pregunta sin Enunciado',
            icon: 'pi pi-plus',
            command: () => {
                this.handleNuevaPregunta(false)
            },
        },
        {
            label: 'Nueva Pregunta con Enunciado',
            icon: 'pi pi-plus',
            command: () => {
                this.handleNuevaPregunta(true)
            },
        },
        {
            label: 'Agregar del banco de preguntas',
            icon: 'pi pi-plus',
            command: () => {
                this.handleBancopregunta()
            },
        },
    ]

    accionBtn(elemento): void {
        const { accion } = elemento
        const { item } = elemento
        switch (accion) {
            case 'close-modal':
                this.accionBtnItem.emit({ accion, item })
                break
            case 'close-modal-preguntas-form':
                this.obtenerBancoPreguntas()
                this.showModalPreguntas = false
                this.idEncabPregId = null
                break
            case 'GUARDARxEncabezadoPreguntas':
                this.idEncabPregId = item.length
                    ? item[0]['idEncabPregId']
                    : null
                this.jEnunciadoUrl = ''
                this.showModalEncabezadoPreguntas = false
                if (this.idEncabPregId) {
                    this.showModalPreguntas = true
                }
                this.obtenerBancoPreguntas()
                break
            case 'CONSULTARxiEvaluacionId':
                this.preguntas = item
                this.preguntas.forEach((i) => {
                    i.json_alternativas = i.json_alternativas
                        ? JSON.parse(i.json_alternativas)
                        : i.json_alternativas
                    i.cPreguntaNoHTML = removeHTML(i.cBancoPregunta)
                })
                break
        }
    }

    handleBancopregunta() {
        this.showModalBancoPreguntas = true
    }

    selectedRowDataChange(event) {
        this.preguntasSeleccionadas = [...event]
    }

    handleNuevaPregunta(encabezado) {
        if (encabezado) {
            this.showModalEncabezadoPreguntas = true
        } else {
            this.showModalPreguntas = true
        }
    }

    guardarActualizarPreguntaConAlternativas(data) {
        console.log(data)
        this._ApiAulaBancoPreguntasService
            .guardarActualizarPreguntaConAlternativas(data)
            .subscribe({
                next: (response) => {
                    console.log(response)
                },
                complete: () => {},
                error: (error) => {
                    console.log(error)
                },
            })
    }

    async onUploadChange(evt: any, tipo: any) {
        const file = evt.target.files[0]

        if (file) {
            const dataFile = await this.objectToFormData({
                file: file,
                nameFile: tipo,
            })
            this.http
                .post(
                    `${this.backendApi}/general/subir-archivo?` +
                        'skipSuccessMessage=true',
                    dataFile
                )
                .pipe(
                    map((event: any) => {
                        if (event.validated) {
                            switch (tipo) {
                                case 'enunciado':
                                    this.jEnunciadoUrl = event.data
                                    this.formEncabezadoPreguntas.controls.cEncabPregContenido.setValue(
                                        this.jEnunciadoUrl
                                    )

                                    break
                            }
                        }
                    }),
                    catchError((err: any) => {
                        return throwError(err.message)
                    })
                )
                .toPromise()
        }
    }

    objectToFormData(obj: any) {
        const formData = new FormData()
        Object.keys(obj).forEach((key) => {
            if (obj[key] !== '') {
                formData.append(key, obj[key])
            }
        })

        return formData
    }

    openLink(item) {
        if (!item) return
        const ruta = environment.backend + '/' + item
        window.open(ruta, '_blank')
    }

    guardarEncabezadoPreguntas() {
        this.formEncabezadoPreguntas.controls.opcion.setValue(
            'GUARDARxEncabezadoPreguntas'
        )
        this.formEncabezadoPreguntas.controls.iDocenteId.setValue(
            this._ConstantesService.iDocenteId
        )
        this.formEncabezadoPreguntas.controls.iNivelCicloId.setValue(
            this.curso?.iNivelCicloId
        )
        this.formEncabezadoPreguntas.controls.iCursoId.setValue(
            this.curso?.iCursoId
        )
        const params = {
            petition: 'post',
            group: 'evaluaciones',
            prefix: 'encabezado-preguntas',
            ruta: 'handleCrudOperation',
            valorBusqueda: this.iEvaluacionId,
            data: this.formEncabezadoPreguntas.value,
        }
        this.getInformation(params, this.formEncabezadoPreguntas.value.opcion)
    }
    obtenerBancoPreguntas() {
        const params = {
            petition: 'post',
            group: 'evaluaciones',
            prefix: 'banco-preguntas',
            ruta: 'handleCrudOperation',
            data: {
                opcion: 'CONSULTARxiEvaluacionId',
                valorBusqueda: this.iEvaluacionId, //iEvaluacionId
            },
        }
        this.getInformation(params, 'CONSULTARxiEvaluacionId')
    }
    getInformation(params, accion) {
        this._GeneralService.getGralPrefix(params).subscribe({
            next: (response) => {
                this.accionBtn({ accion, item: response?.data })
            },
            complete: () => {},
            error: (error) => {
                console.log(error)
                this._MessageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error,
                })
            },
        })
    }
}
