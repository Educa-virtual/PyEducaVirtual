import { Component, inject, OnInit, Input } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { GeneralService } from '@/app/servicios/general.service'
import { RemoveHTMLCSSPipe } from '@/app/shared/pipes/remove-html-style.pipe'
import { TruncatePipe } from '@/app/shared/pipes/truncate-text.pipe'
import { NgIf } from '@angular/common'

import { EditorComponent } from '@tinymce/tinymce-angular'
import { MenuItem, MessageService } from 'primeng/api'
import { ApiEvaluacionesRService } from '@/app/sistema/evaluaciones/services/api-evaluaciones-r.service'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { HttpClient } from '@angular/common/http'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { environment } from '@/environments/environment'
import { catchError, map, throwError } from 'rxjs'
import { abecedario } from '@/app/sistema/aula-virtual/constants/aula-virtual'
import { NoDataComponent } from '@/app/shared/no-data/no-data.component'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import {
    CdkDragDrop,
    CdkDropList,
    CdkDrag,
    moveItemInArray,
} from '@angular/cdk/drag-drop'

@Component({
    selector: 'app-evaluacion-agregar-preguntas',
    standalone: true,
    templateUrl: './evaluacion-agregar-preguntas.component.html',
    styleUrls: ['./evaluacion-agregar-preguntas.component.scss'],
    imports: [
        PrimengModule,
        EditorComponent,
        NgIf,
        RemoveHTMLCSSPipe,
        TruncatePipe,
        NoDataComponent,
        CdkDropList,
        CdkDrag,
    ],
})
export class EvaluacionAgregarPreguntasComponent implements OnInit {
    private _GeneralService = inject(GeneralService)
    private _MessageService = inject(MessageService)
    private _apiEre = inject(ApiEvaluacionesRService)
    private _ConfirmationModalService = inject(ConfirmationModalService)
    private http = inject(HttpClient)
    private _ConstantesService = inject(ConstantesService)
    private _formBuilder = inject(FormBuilder)

    private backendApi = environment.backendApi
    backend = environment.backend

    @Input() iEvaluacionId
    @Input() iCursoNivelGradId
    data
    matrizCompetencia = []
    matrizCapacidad = []
    matrizCapacidadFiltrado = []
    nIndexAcordionTab: number = null
    isSecundaria: boolean = false
    isDisabled: boolean = true
    showModalSecciones: boolean = false
    accionSeleccionada: number | null = null

    preguntaPeso = [
        {
            iPreguntaPesoId: 1,
            cPreguntaPesoNombre: '1: Baja',
        },
        {
            iPreguntaPesoId: 2,
            cPreguntaPesoNombre: '2: Media',
        },
        {
            iPreguntaPesoId: 3,
            cPreguntaPesoNombre: '3: Alta',
        },
    ]
    init: EditorComponent['init'] = {
        base_url: '/tinymce', // Root for resources
        suffix: '.min', // Suffix to use when loading resources
        menubar: false,
        selector: 'textarea',
        placeholder: 'Escribe aqui...',
        plugins: 'lists image table',
        toolbar:
            'undo redo | forecolor backcolor | bold italic underline strikethrough | ' +
            'alignleft aligncenter alignright alignjustify | bullist numlist | ' +
            'image table',
        height: 400,
        editable_root: this.isDisabled,
    }
    initEnunciado: EditorComponent['init'] = {
        base_url: '/tinymce', // Root for resources
        suffix: '.min', // Suffix to use when loading resources
        menubar: false,
        selector: 'textarea',
        placeholder: 'Escribe aqui...',
        height: 1000,
        plugins: 'lists image table',
        toolbar:
            'undo redo | forecolor backcolor | bold italic underline strikethrough | ' +
            'alignleft aligncenter alignright alignjustify | bullist numlist | ' +
            'image table',
        editable_root: this.isDisabled,
    }
    encabezado = ''
    preguntas = []
    secciones = [
        {
            title: 'Sección 1',
            descripcionSeccion: 'Descripción de la sección 1',
            iSeccionId: 1,
        },
        {
            title: 'Sección 2',
            descripcionSeccion: 'Descripción de la sección 2',
            iSeccionId: 2,
        },
        {
            title: 'Sección 3',
            descripcionSeccion: 'Descripción de la sección 3',
            iSeccionId: 3,
        },
    ]
    acciones = [
        {
            iAccionId: 1,
            label: 'Respuesta corta',
            icon: 'pi pi-pencil',
            command: (pregunta) => {
                this.confirmarEliminarPregunta(pregunta)
            },
        },
        {
            iAccionId: 2,
            label: 'Párrafo',
            icon: 'pi pi-plus',
            command: () => {
                this.mostrarModalSecciones()
            },
        },
        {
            iAccionId: 3,
            label: 'Varias opciones',
            icon: 'pi pi-plus',
        },
    ]

    alternativas = []
    showModalBancoPreguntas: boolean = false
    totalPregunta: number = 0

    tiposAgregarPregunta: MenuItem[] = [
        {
            label: 'Nueva Pregunta simple',
            icon: 'pi pi-plus',
            command: () => {
                this.handleNuevaPregunta(false)
            },
        },
        {
            label: 'Nueva Pregunta múltiple',
            icon: 'pi pi-plus',
            command: () => {
                this.handleNuevaPregunta(true)
            },
        },
        {
            label: 'Agregar del banco de preguntas',
            icon: 'pi pi-plus',
            command: () => {
                this.showModalBancoPreguntas = true
            },
        },
    ]
    // Formulario para crear nuva sección
    public formSeccion: FormGroup = this._formBuilder.group({
        title: ['', [Validators.required]],
        descripcionSeccion: ['', [Validators.required]],
        iSeccionId: ['', [Validators.required]],
    })
    // form group para crear nueva pregunta
    public formAccion: FormGroup = this._formBuilder.group({
        iAccionId: [null],
    })
    handleNuevaPregunta(enunciado) {
        if (!enunciado) {
            this.guardarPreguntaSinEnunciadoSinData()
        } else {
            this.guardarPreguntaConEnunciadoSinData()
        }
    }

    ngOnInit() {
        console.log('Iniciando el componente')
        this.formAccion.get('iAccionId').valueChanges.subscribe((value) => {
            console.log(value)
        })
    }
    // mostrar el modal de agregar secciones a la encuesta
    mostrarModalSecciones() {
        this.showModalSecciones = true
    }
    // guardar sección y listar
    guardarSeccion() {
        const value = this.formSeccion.value
        console.log(value)
        value.pregunta = [
            {
                cPregunta: '',
                alternativas: [],
            },
        ]
        this.preguntas.push(value)
        console.log(this.preguntas)
        this.showModalSecciones = false
    }
    // dar color al card
    obtenerStyleActividad(iEstadoActividad) {
        let styleActividad = ''
        switch (Number(iEstadoActividad)) {
            case 1: //PROCESO
                styleActividad = 'border-left:5px solid var(--green-500);'
                break
            case 2: //NO PUBLICADO
                styleActividad = 'border-left:15px solid var(--yellow-500);'
                break
            case 0: //CULMINADO
                styleActividad = 'border-left:15px solid var(--red-500);'
                break
        }
        return styleActividad
    }
    // drag and drop para mover las preguntas
    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.preguntas, event.previousIndex, event.currentIndex)
    }

    obtenerPreguntasxiEvaluacionIdxiCursoNivelGradId() {
        const params = {
            petition: 'post',
            group: 'ere',
            prefix: 'evaluacion',
            ruta: 'handleCrudOperation',
            data: {
                opcion: 'CONSULTARxiEvaluacionIdxiCursoNivelGradId',
                iEvaluacionId: this.iEvaluacionId,
                valorBusqueda: this.iCursoNivelGradId,
            },
        }
        this.getInformation(params, params.data.opcion)
    }

    confirmarEliminarPregunta(pregunta) {
        if (!this.isDisabled) {
            return
        }
        const removeHtml = new RemoveHTMLCSSPipe()
        const truncateText = new TruncatePipe()
        truncateText.transform(removeHtml.transform(pregunta.title), 40)
        this._ConfirmationModalService.openConfirm({
            header:
                '¿Esta seguro de eliminar  la ' +
                truncateText.transform(
                    removeHtml.transform(pregunta.title),
                    80
                ) +
                ' ?',
            accept: () => {
                if (pregunta.iEncabPregId > 0) {
                    this.eliminarPreguntaConEncabezado(pregunta)
                } else {
                    this.eliminarPregunta(pregunta?.pregunta)
                }
            },
        })
    }

    eliminarPregunta(pregunta) {
        if (!this.isDisabled) {
            return
        }
        const itemPregunta = pregunta.length ? pregunta[0] : null
        if (!itemPregunta) return

        const params = {
            petition: 'post',
            group: 'ere',
            prefix: 'preguntas',
            ruta: 'handleCrudOperation',
            data: {
                opcion: 'ACTUALIZARxiPreguntaIdxbPreguntaEstado',
                iPreguntaId: itemPregunta.iPreguntaId,
                iEncabPregId: itemPregunta.iEncabPregId,
            },
        }
        this.getInformation(params, params.data.opcion)
    }

    eliminarPreguntaConEncabezado(pregunta) {
        if (pregunta.iEncabPregId > 0) {
            const params = {
                petition: 'post',
                group: 'ere',
                prefix: 'preguntas',
                ruta: 'handleCrudOperation',
                data: {
                    opcion: 'ACTUALIZARxiPreguntaIdxbPreguntaEstado',
                    iEncabPregId: pregunta.iEncabPregId,
                },
            }
            this.getInformation(params, params.data.opcion)
        } else {
            const params = {
                petition: 'post',
                group: 'ere',
                prefix: 'preguntas',
                ruta: 'handleCrudOperation',
                data: {
                    opcion: 'ACTUALIZARxiPreguntaIdxbPreguntaEstado',
                    iPreguntaId: pregunta.iPreguntaId,
                },
            }
            this.getInformation(params, params.data.opcion)
        }
    }
    handleNuevaPreguntaConEnunciadoSinData(item) {
        if (!this.isDisabled) {
            return
        }
        const params = {
            petition: 'post',
            group: 'ere',
            prefix: 'preguntas',
            ruta: 'handleCrudOperation',
            data: {
                opcion: 'GUARDAR-PREGUNTAS',
                valorBusqueda: this.iEvaluacionId,
                iCursosNivelGradId: this.iCursoNivelGradId,
                iEncabPregId: item.iEncabPregId,
            },
        }
        this.getInformation(params, params.data.opcion)
    }

    guardarPreguntaSinEnunciadoSinData() {
        if (!this.isDisabled) {
            return
        }
        const params = {
            petition: 'post',
            group: 'ere',
            prefix: 'preguntas',
            ruta: 'handleCrudOperation',
            data: {
                opcion: 'GUARDAR-PREGUNTAS',
                valorBusqueda: this.iEvaluacionId,
                iCursosNivelGradId: this.iCursoNivelGradId,
            },
        }
        this.getInformation(params, params.data.opcion)
    }
    guardarPreguntaConEnunciadoSinData() {
        if (!this.isDisabled) {
            return
        }
        const params = {
            petition: 'post',
            group: 'ere',
            prefix: 'encabezado-preguntas',
            ruta: 'handleCrudOperation',
            data: {
                opcion: 'GUARDAR-ENCABEZADO-PREGUNTAS',
                valorBusqueda: this.iEvaluacionId,
                iCursosNivelGradId: this.iCursoNivelGradId,
                iCredId: this._ConstantesService.iCredId,
            },
        }
        this.getInformation(params, params.data.opcion)
    }
    guardarPreguntaConData(encabezado, pregunta, contenido) {
        if (!this.isDisabled) {
            return
        }
        const preguntas = pregunta.pregunta

        if (!this.isSecundaria && !encabezado) {
            preguntas.forEach((item) => (item.iPreguntaPeso = 1))
        }
        if (!this.isSecundaria && encabezado) {
            pregunta.iPreguntaPeso = 1
        }

        const data = !encabezado
            ? preguntas.length
                ? preguntas[0]
                : null
            : pregunta
        let error = false
        data.opcion = !encabezado
            ? 'ACTUALIZARxiDesempenoId'
            : 'ACTUALIZARxiEncabPregId'
        data.cEncabPregContenido = !encabezado ? '' : contenido
        data.iEvaluacionId = this.iEvaluacionId
        data.iCursosNivelGradId = this.iCursoNivelGradId
        if (!data.alternativas) {
            this._MessageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No hay alternativas ingresadas',
            })
            return
        }
        data.alternativas.forEach((alternativa) => {
            {
                if (
                    alternativa.cAlternativaDescripcion == '' ||
                    alternativa.cAlternativaDescripcion == null
                ) {
                    error = true
                }
            }
        })
        if (error) {
            this._MessageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Todas las alternativas debe tener una descripción y/o contenido',
            })
            return
        }
        error = true
        data.alternativas.forEach((alternativa) => {
            {
                if (alternativa.bAlternativaCorrecta) {
                    error = false
                }
                alternativa.cAlternativaImagen === 'users/no-image.png'
                    ? (alternativa.cAlternativaImagen = '')
                    : ''
            }
        })
        if (error) {
            this._MessageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No indicó la alternativa correcta, revise por favor.',
            })
            return
        }
        data.json_alternativas = JSON.stringify(data.alternativas)

        const params = {
            petition: 'post',
            group: 'ere',
            prefix: !encabezado ? 'desempenos' : 'encabezado-preguntas',
            ruta: 'handleCrudOperation',
            data: data,
        }
        this.getInformation(params, params.data.opcion)
    }

    cambiarEstadoCheckbox(iAlternativaId, alternativas) {
        if (!this.isDisabled) {
            return
        }
        alternativas.forEach((alternativa) => {
            {
                if (alternativa.iAlternativaId != iAlternativaId) {
                    alternativa.bAlternativaCorrecta = false
                    alternativa.cAlternativaExplicacion = null
                }
            }
        })
    }
    agregarAlternativa(preguntas) {
        if (!this.isDisabled) {
            return
        }
        if (!preguntas['alternativas']) {
            preguntas['alternativas'] = []
        }
        preguntas.alternativas.push({
            bAlternativaCorrecta: false,
            cAlternativaDescripcion: null,
            cAlternativaExplicacion: null,
            cAlternativaLetra: null,
            iAlternativaId: null,
        })
        this.ordenarAlternativaLetra(preguntas.alternativas)
    }

    eliminarAlternativa(index: number, alternativas) {
        if (!this.isDisabled) {
            return
        }
        // Eliminar la alternativa en la posición indicada por index
        alternativas.splice(index, 1)
        this.ordenarAlternativaLetra(alternativas)
    }

    getInformation(params, accion) {
        this._GeneralService.getGralPrefix(params).subscribe({
            next: (response) => {
                this.accionBtnItem({ accion, item: response?.data })
            },
            complete: () => {},
            error: (error) => {
                this._MessageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error,
                })
            },
        })
    }

    ordenarAlternativaLetra(alternativas) {
        if (!alternativas) {
            return
        }
        alternativas.forEach((alternativa, i) => {
            const letra = abecedario[i] // Obtiene la letra según el índice
            alternativa.cAlternativaLetra = letra ? letra.code : '' // Asigna la nueva letra
        })
    }

    accionBtnItem(elemento): void {
        const { accion } = elemento
        const { item } = elemento
        switch (accion) {
            case 'CONSULTARxiEvaluacionIdxiCursoNivelGradId':
                this.data = item.length ? item[0] : []
                this.isSecundaria =
                    this.data.iNivelTipoId === '4' ? true : false
                this.preguntas = []
                const evaluaciones = item.length
                    ? JSON.parse(item[0]['evaluaciones'])
                    : []

                if (!evaluaciones) {
                    return
                }
                evaluaciones.forEach((evaluacion) => {
                    this.ordenarAlternativaLetra(evaluacion.alternativas)
                })

                // let total = 0
                for (const key in evaluaciones) {
                    if (evaluaciones[key]['iCompetenciaId']) {
                        evaluaciones[key]['iCompetenciaId'] =
                            evaluaciones[key]['iCompetenciaId'].toString()
                    }
                    if (evaluaciones[key]['iCapacidadId']) {
                        evaluaciones[key]['iCapacidadId'] =
                            evaluaciones[key]['iCapacidadId'].toString()
                    }

                    // if (total == 0) {
                    const itemSinEncabezado = evaluaciones.filter(
                        (i) =>
                            !i.iEncabPregId &&
                            i.iPreguntaId === evaluaciones[key]['iPreguntaId']
                    )
                    if (itemSinEncabezado.length) {
                        this.preguntas.push({
                            pregunta: itemSinEncabezado,
                            iEncabPregId: null,
                            iOrden: key,
                        })
                        // total = 0
                    }
                    // console.log(itemSinEncabezado)
                    const itemConEncabezado = evaluaciones.filter(
                        (i) =>
                            i.iEncabPregId &&
                            i.iEncabPregId === evaluaciones[key]['iEncabPregId']
                    )
                    if (itemConEncabezado.length) {
                        this.preguntas.push({
                            pregunta: itemConEncabezado,
                            title: 'Pregunta Múltiple',
                            iEncabPregId: evaluaciones[key]['iEncabPregId'],
                            iOrden: key,
                        })
                        // total = total + 1
                    }
                    // }
                }
                //console.log(this.preguntas)

                this.preguntas = this.preguntas.filter(
                    (value, index, self) =>
                        value.iEncabPregId === null ||
                        index ===
                            self.findIndex(
                                (t) => t.iEncabPregId === value.iEncabPregId
                            )
                )
                this.totalPregunta = 0
                //console.log(this.preguntas)
                this.preguntas.forEach((pregunta) => {
                    {
                        if (pregunta.pregunta.length) {
                            pregunta.pregunta.forEach((item) => {
                                this.totalPregunta = this.totalPregunta + 1
                                item.title =
                                    'Pregunta #' +
                                    this.totalPregunta +
                                    ': ' +
                                    (item.cPregunta || '')
                            })
                        }

                        if (pregunta.pregunta.length > 1) {
                            pregunta['iEncabPregId'] =
                                pregunta.pregunta[0]['iEncabPregId']
                            pregunta['cEncabPregContenido'] =
                                pregunta.pregunta[0]['cEncabPregContenido']
                            pregunta['iCompetenciaId'] =
                                pregunta.pregunta[0]['iCompetenciaId']
                            pregunta['iCapacidadId'] =
                                pregunta.pregunta[0]['iCapacidadId']
                            pregunta['cDesempenoDescripcion'] =
                                pregunta.pregunta[0]['cDesempenoDescripcion']
                            pregunta['cPregunta'] =
                                pregunta.pregunta[0]['cPregunta']
                        } else {
                            pregunta.title = pregunta.pregunta[0]?.title || ''
                        }

                        // pregunta.pregunta.forEach((item) => {
                        //     this.totalPregunta = this.totalPregunta +1
                        //     item.title = 'Pregunta #'+this.totalPregunta+': '+item.cPregunta
                        //     this.obtenerCapacidades(item)
                        // });
                    }
                })
                console.log(this.preguntas)
                break
            case 'ACTUALIZARxiPreguntaIdxbPreguntaEstado':
                this._MessageService.add({
                    severity: 'success',
                    summary: 'Eliminado',
                    detail: 'Se eliminó correctamente la pregunta',
                })
                this.obtenerPreguntasxiEvaluacionIdxiCursoNivelGradId()
                break
            case 'ACTUALIZARxiDesempenoId':
            case 'ACTUALIZARxiEncabPregId':
                this._MessageService.add({
                    severity: 'success',
                    summary: 'Actualizado',
                    detail: 'Se actualizó correctamente la pregunta',
                })
                this.obtenerPreguntasxiEvaluacionIdxiCursoNivelGradId()
                break
            case 'GUARDAR':
                this._MessageService.add({
                    severity: 'success',
                    summary: 'Guardado',
                    detail: 'Se guardó correctamente la pregunta',
                })
                break
            case 'GUARDAR-PREGUNTAS':
            case 'GUARDAR-ENCABEZADO-PREGUNTAS':
                this.obtenerPreguntasxiEvaluacionIdxiCursoNivelGradId()
                break
        }
    }

    async onUploadChange(evt: any, alternativa) {
        if (!this.isDisabled) {
            return
        }
        const file = evt.target.files[0]
        if (file) {
            const dataFile = await this.objectToFormData({
                file: file,
                nameFile: 'alternativas',
            })
            this.http
                .post(`${this.backendApi}/general/subir-archivo`, dataFile)
                .pipe(
                    map((event: any) => {
                        if (event.validated) {
                            alternativa.cAlternativaImagen = event.data
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
    updateUrl(item) {
        item.cAlternativaImagen = 'users/no-image.png'
    }

    obtenerCapacidades(item) {
        this.matrizCapacidadFiltrado = this.matrizCapacidad.filter(
            (i) => i.iCompetenciaId === item.iCompetenciaId
        )
    }
}
