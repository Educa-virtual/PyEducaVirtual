import {
    Component,
    EventEmitter,
    inject,
    Output,
    Input,
    OnChanges,
} from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { DisponibilidadFormComponent } from '../../components/disponibilidad-form/disponibilidad-form.component'
import { GeneralService } from '@/app/servicios/general.service'
import { FileUploadPrimengComponent } from '../../../../../../shared/file-upload-primeng/file-upload-primeng.component'
import { PrimengModule } from '@/app/primeng.module'
import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component'
import { Message } from 'primeng/api'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete'
import { DatePipe } from '@angular/common'
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component'
import { TypesFilesUploadPrimengComponent } from '../../../../../../shared/types-files-upload-primeng/types-files-upload-primeng.component'

@Component({
    selector: 'app-tarea-form',
    standalone: true,
    imports: [
        CommonInputComponent,
        PrimengModule,
        DisponibilidadFormComponent,
        FileUploadPrimengComponent,
        ModalPrimengComponent,
        TypesFilesUploadPrimengComponent,
    ],
    templateUrl: './tarea-form.component.html',
    styleUrl: './tarea-form.component.scss',
})
export class TareaFormComponent implements OnChanges {
    pipe = new DatePipe('es-ES')
    date = new Date()

    typesFiles = {
        file: true,
        url: true,
        youtube: true,
        repository: false,
        image: false,
    }
    @Output() submitEvent = new EventEmitter<any>()
    @Output() cancelEvent = new EventEmitter<void>()

    @Input() contenidoSemana
    @Input() tarea

    semana: Message[] = []
    tareas = []
    filteredTareas: any[] | undefined
    nameEnlace: string = ''
    titleFileTareas: string = ''

    private _formBuilder = inject(FormBuilder)
    private GeneralService = inject(GeneralService)
    private ConstantesService = inject(ConstantesService)

    ngOnChanges(changes): void {
        if (changes.contenidoSemana?.currentValue) {
            this.contenidoSemana = changes.contenidoSemana.currentValue
            this.semana = [
                {
                    severity: 'info',
                    detail:
                        this.contenidoSemana.cContenidoSemNumero +
                        ' SEMANA - ' +
                        this.contenidoSemana.cContenidoSemTitulo,
                },
            ]
        }
        if (changes.tarea?.currentValue) {
            this.tarea = changes.tarea.currentValue
            this.formTareas.patchValue(this.tarea)
            this.filesUrl = this.formTareas.value.cTareaArchivoAdjunto
                ? JSON.parse(this.formTareas.value.cTareaArchivoAdjunto)
                : []
            if (this.tarea.iTareaId) {
                this.formTareas.controls.dtFin.setValue(
                    new Date(this.formTareas.value.dtTareaFin)
                )
                this.formTareas.controls.dtInicio.setValue(
                    new Date(this.formTareas.value.dtTareaInicio)
                )
            }
        }
    }
    onToggleChange(event: any) {
        console.log('Estado del ToggleButton:', event)
    }

    onTareaSelected(event: any) {
        const selectedTarea = event.value
        if (selectedTarea) {
            this.showModalDialog9(selectedTarea)
        }
    }
    showModalDialog9(tarea: any) {
        console.log('Mostrando modal para la tarea:', tarea)
        // Aquí puedes implementar la lógica para mostrar el modal, como usar un servicio de PrimeNG o ng-bootstrap
        // por ejemplo, puedes activar un modal o caja de diálogo si ya lo tienes implementado.
    }

    public formTareas = this._formBuilder.group({
        bReutilizarTarea: [false],
        dtInicio: [this.date, Validators.required],
        dtFin: [this.date, Validators.required],

        iTareaId: [],
        cTareaTitulo: ['', [Validators.required]],
        cTareaDescripcion: ['', [Validators.required]],

        dtTareaInicio: ['', [Validators.required]],
        dtTareaFin: ['', [Validators.required]],

        //
        cTareaArchivoAdjunto: [],
        cTareaIndicaciones: [''],
        dFechaEvaluacionPublicacion: [''],
        tHoraEvaluacionPublicacion: [''],
        dFechaEvaluacionPublicacionInicio: [],
        tHoraEvaluacionPublicacionInicio: [''],
        dFechaEvaluacionPublicacionFin: [],
        tHoraEvaluacionPublicacionFin: [''],

        //TABLA: PROGRACION_ACTIVIDADES
        iProgActId: [],
        iContenidoSemId: [],
        iActTipoId: [],
        dtProgActInicio: [],
        dtProgActFin: [],
        cProgActTituloLeccion: [''],
        cProgActDescripcion: [''],
        dtProgActPublicacion: [],
    })

    getTareasxiCursoId() {
        if (this.formTareas.value.bReutilizarTarea) {
            const params = {
                petition: 'post',
                group: 'aula-virtual',
                prefix: 'tareas',
                ruta: 'getTareasxiCursoId',
                data: {
                    opcion: 'CONSULTAR-TAREASxiCursoId',
                    iCredId: this.ConstantesService.iCredId,
                    iCursoId: this.contenidoSemana.iCursoId,
                },
                params: { skipSuccessMessage: true },
            }
            this.getInformation(params, 'get_tareas_reutilizadas')
        } else {
            this.formTareas.controls.cTareaTitulo.setValue(null)
        }
    }

    filterTareas(event: AutoCompleteCompleteEvent) {
        const filtered: any[] = []
        const query = event.query
        for (let i = 0; i < (this.tareas as any[]).length; i++) {
            const tareas = (this.tareas as any[])[i]
            if (
                tareas.cTareaTitulo
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) == 0
            ) {
                filtered.push(tareas)
            }
        }
        this.filteredTareas = filtered
    }

    getFilterIndicaciones(event) {
        if (event) {
            this.formTareas.controls.cTareaDescripcion.setValue(
                event.cTareaDescripcion ? event.cTareaDescripcion : ''
            )
            this.formTareas.controls.iProgActId.setValue(
                event.iProgActId ? event.iProgActId : null
            )
        }
    }

    getInformation(params, accion) {
        this.GeneralService.getGralPrefix(params).subscribe({
            next: (response) => {
                this.accionBtnItem({ accion, item: response?.data })
            },
            complete: () => {},
            error: (error) => {
                console.log(error)
            },
        })
    }
    filesUrl = []
    accionBtnItem(elemento): void {
        const { accion } = elemento
        const { item } = elemento
        // let params
        switch (accion) {
            case 'get_tareas_reutilizadas':
                this.tareas = item
                this.filteredTareas = item
                break
            case 'close-modal':
                this.showModal = false
                break
            case 'subir-file-tareas':
                this.filesUrl.push({
                    type: 1, //1->file
                    nameType: 'file',
                    name: item.file.name,
                    size: item.file.size,
                    ruta: item.name,
                })
                break
            case 'url-tareas':
                this.filesUrl.push({
                    type: 2, //2->url
                    nameType: 'url',
                    name: item.name,
                    size: '',
                    ruta: item.ruta,
                })
                break
            case 'youtube-tareas':
                this.filesUrl.push({
                    type: 3, //3->youtube
                    nameType: 'youtube',
                    name: item.name,
                    size: '',
                    ruta: item.ruta,
                })
                break
        }
    }

    submit() {
        let horaInicio = this.formTareas.value.dtInicio.toLocaleString(
            'en-GB',
            { timeZone: 'America/Lima' }
        )
        let horaFin = this.formTareas.value.dtFin.toLocaleString('en-GB', {
            timeZone: 'America/Lima',
        })
        horaInicio = horaInicio.replace(',', '')
        horaFin = horaFin.replace(',', '')
        this.formTareas.controls.dtTareaInicio.setValue(horaInicio)
        this.formTareas.controls.dtTareaFin.setValue(horaFin)
        this.formTareas.controls.dtProgActInicio.setValue(horaInicio)
        this.formTareas.controls.dtProgActFin.setValue(horaFin)
        this.formTareas.controls.cProgActTituloLeccion.setValue(
            this.formTareas.value.cTareaTitulo
        )
        this.formTareas.controls.cProgActDescripcion.setValue(
            this.formTareas.value.cTareaDescripcion
        )
        this.formTareas.controls.dtProgActPublicacion.setValue(horaFin)
        this.formTareas.controls.cTareaArchivoAdjunto.setValue(
            JSON.stringify(this.filesUrl)
        )
        const value = this.formTareas.value

        if (this.formTareas.invalid) {
            this.formTareas.markAllAsTouched()
            return
        }
        this.submitEvent.emit(value)
    }
    showModal: boolean = false
    typeUpload: string
    openUpload(type) {
        this.showModal = true
        this.typeUpload = type
        this.titleFileTareas = ''
        switch (type) {
            case 'file':
                this.titleFileTareas = 'Añadir Archivo Local'
                break
            case 'url':
                this.titleFileTareas = 'Añadir Enlace URL'
                break
            case 'youtube':
                this.titleFileTareas = 'Añadir Enlace de Youtube'
                break
            case 'recursos':
                this.titleFileTareas = 'Añadir Archivo de mis Recursos'
                break
            default:
                this.showModal = false
                this.typeUpload = null
                break
        }
    }

    // cancel() {
    //     this.formTareas.reset()
    //     this.cancelEvent.emit()
    // }
    // guardarDatos() {
    //     this.formTareas.reset()
    //     this.cancelEvent.emit()
    // }
}
