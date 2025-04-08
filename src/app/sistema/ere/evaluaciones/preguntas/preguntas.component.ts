import { PrimengModule } from '@/app/primeng.module'
import { GeneralService } from '@/app/servicios/general.service'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { ApiEvaluacionesRService } from '@/app/sistema/ere/evaluaciones/services/api-evaluaciones-r.service'
import { NgIf } from '@angular/common'
import { Component, inject, Input, OnInit } from '@angular/core'
import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular'
import { MenuItem, MessageService } from 'primeng/api'
import { abecedario } from '@/app/sistema/aula-virtual/constants/aula-virtual'
import { HttpClient } from '@angular/common/http'
import { environment } from '@/environments/environment'
import { catchError, map, throwError } from 'rxjs'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { RemoveHTMLCSSPipe } from '@/app/shared/pipes/remove-html-style.pipe'
import { TruncatePipe } from '@/app/shared/pipes/truncate-text.pipe'
import { ESPECIALISTA_DREMO } from '@/app/servicios/seg/perfiles'
import { BancoPreguntasComponent } from '../banco-preguntas/banco-preguntas-ere.component'
import { PreguntasEreService } from '../services/preguntas-ere.service'

@Component({
    selector: 'app-preguntas',
    standalone: true,
    imports: [
        PrimengModule,
        ContainerPageComponent,
        EditorComponent,
        NgIf,
        RemoveHTMLCSSPipe,
        TruncatePipe,
        BancoPreguntasComponent,
    ],
    templateUrl: './preguntas.component.html',
    styleUrl: './preguntas.component.scss',
    providers: [
        { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
    ],
})
export class PreguntasComponent implements OnInit {
    private _GeneralService = inject(GeneralService)
    private _MessageService = inject(MessageService)
    private _preguntasService = inject(PreguntasEreService)
    private _apiEre = inject(ApiEvaluacionesRService)
    private _ConfirmationModalService = inject(ConfirmationModalService)
    private http = inject(HttpClient)
    private _ConstantesService = inject(ConstantesService)

    private backendApi = environment.backendApi
    backend = environment.backend
    breadCrumbItems: MenuItem[]
    breadCrumbHome: MenuItem

    private enunciadosCache = new Map<number, string>()

    @Input() iEvaluacionId
    @Input() iCursoNivelGradId
    data
    matrizCompetencia = []
    matrizCapacidad = []
    matrizCapacidadFiltrado = []
    nIndexAcordionTab: number = null
    isSecundaria: boolean = false
    isDisabled: boolean =
        this._ConstantesService.iPerfilId === ESPECIALISTA_DREMO
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
        placeholder: 'Escriba aquí...',
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
    alternativas = []
    showModalBancoPreguntas: boolean = false
    totalPregunta: number = 0

    tiposAgregarPregunta: MenuItem[] = [
        {
            label: 'Pregunta simple',
            icon: 'pi pi-plus',
            command: () => {
                this.handleNuevaPregunta(false)
            },
        },
        {
            label: 'Pregunta múltiple',
            icon: 'pi pi-plus',
            command: () => {
                this.handleNuevaPregunta(true)
            },
        },
        {
            label: 'Del banco de preguntas',
            icon: 'pi pi-plus',
            command: () => {
                this.showModalBancoPreguntas = true
            },
        },
    ]

    handleNuevaPregunta(enunciado) {
        if (!enunciado) {
            this.guardarPreguntaSinEnunciadoSinData()
        } else {
            this.guardarPreguntaConEnunciadoSinData()
        }
    }

    ngOnInit() {
        this.obtenerMatrizCompetencias()
        this.obtenerMatrizCapacidad()
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

    obtenerMatrizCompetencias(): void {
        this._apiEre.obtenerMatrizCompetencias({}).subscribe({
            next: (resp: any) => {
                this.matrizCompetencia = resp.data.fullData
            },
            error: (err) => {
                console.error('Error al cargar datos:', err)
            },
        })
    }

    obtenerMatrizCapacidad() {
        this._apiEre.obtenerMatrizCapacidades({}).subscribe({
            next: (resp: any) => {
                this.matrizCapacidad = resp.data.fullData
                this.obtenerPreguntasxiEvaluacionIdxiCursoNivelGradId()
            },
            error: (err) => {
                console.error('Error al cargar datos:', err)
            },
        })
    }

    confirmarEliminarPregunta(pregunta) {
        if (!this.isDisabled) {
            return
        }

        const removeHtml = new RemoveHTMLCSSPipe()
        const truncateText = new TruncatePipe()
        //truncateText.transform(removeHtml.transform(pregunta.title), 40)
        const cabeceraPregunta = truncateText.transform(
            removeHtml.transform(pregunta.title),
            40
        )
        let headerConfirmarEliminar = '¿Está seguro de eliminar '
        if (cabeceraPregunta.substring(0, 9) == 'Preguntas') {
            headerConfirmarEliminar += 'las '
        } else {
            headerConfirmarEliminar += 'la '
        }
        headerConfirmarEliminar += cabeceraPregunta + '?'
        this._ConfirmationModalService.openConfirm({
            header: headerConfirmarEliminar,
            accept: () => {
                if (
                    Object.prototype.hasOwnProperty.call(pregunta, 'pregunta')
                ) {
                    if (pregunta.iEncabPregId == null) {
                        this.eliminarPreguntaSimple(pregunta.pregunta[0])
                    } else {
                        this.eliminarPreguntaMultiple(pregunta)
                    }
                    /*if (Array.isArray(pregunta.pregunta)) {

                        this.eliminarPreguntaMultiple(pregunta)
                    } else if (typeof pregunta.pregunta === 'object' && pregunta.pregunta !== null) {

                        this.eliminarPreguntaSimple(pregunta)
                    }*/
                } else {
                    this.eliminarPreguntaSimple(pregunta)
                }
            },
        })
    }

    eliminarPreguntaSimple(pregunta) {
        this._preguntasService
            .eliminarPreguntaSimple({
                iPreguntaId: pregunta.iPreguntaId,
                //iEncabPregId: pregunta.iEncabPregId,
                iEvaluacionId: this.iEvaluacionId,
            })
            .subscribe({
                next: (response) => {
                    this._MessageService.add({
                        severity: 'success',
                        detail: response['message'],
                    })
                    this.obtenerPreguntasxiEvaluacionIdxiCursoNivelGradId()
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

    eliminarPreguntaMultiple(pregunta) {
        this._preguntasService
            .eliminarPreguntaMultiple({
                iEncabPregId: pregunta.iEncabPregId,
                iEvaluacionId: this.iEvaluacionId,
            })
            .subscribe({
                next: (response) => {
                    this._MessageService.add({
                        severity: 'success',
                        detail: response['message'],
                    })
                    this.obtenerPreguntasxiEvaluacionIdxiCursoNivelGradId()
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

    handleNuevaPreguntaConEnunciadoSinData(item) {
        if (!this.isDisabled) {
            return
        }

        if (item.iEncabPregId && item.cEncabPregContenido) {
            this.enunciadosCache.set(
                item.iEncabPregId,
                item.cEncabPregContenido
            )
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
                cEncabPregContenido: item.iEncabPregContenido,
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
        //Resulta que las preguntas para primaria también tienen peso
        /*if (!this.isSecundaria && !encabezado) {
            preguntas.forEach((item) => (item.iPreguntaPeso = 1))
        }
        if (!this.isSecundaria && encabezado) {
            pregunta.iPreguntaPeso = 1
        }*/

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
                this.breadCrumbItems = [
                    {
                        label: 'ERE',
                    },
                    {
                        label: 'Evaluaciones',
                        routerLink: '/ere/evaluaciones',
                    },
                    {
                        label: `${item[0].cEvaluacionNombre} - ${item[0].cNivelEvalNombre}`,
                    },
                    {
                        label: 'Lista de áreas',
                        routerLink: `/ere/evaluaciones/${item[0].iEvaluacionId}/areas`,
                    },
                    {
                        label: `${item[0].cCursoNombre.charAt(0).toUpperCase() + item[0].cCursoNombre.slice(1).toLowerCase()} - ${item[0].cGradoAbreviacion} - ${item[0].cNivelTipoNombre.replace('Educación ', '')}`,
                    },
                    { label: 'Gestionar preguntas' },
                ]
                this.breadCrumbHome = { icon: 'pi pi-home', routerLink: '/' }

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

                for (const key in evaluaciones) {
                    if (evaluaciones[key]['iCompetenciaId']) {
                        evaluaciones[key]['iCompetenciaId'] =
                            evaluaciones[key]['iCompetenciaId'].toString()
                    }
                    if (evaluaciones[key]['iCapacidadId']) {
                        evaluaciones[key]['iCapacidadId'] =
                            evaluaciones[key]['iCapacidadId'].toString()
                    }

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
                    }
                    const itemConEncabezado = evaluaciones.filter(
                        (i) =>
                            i.iEncabPregId &&
                            i.iEncabPregId === evaluaciones[key]['iEncabPregId']
                    )
                    if (itemConEncabezado.length) {
                        this.preguntas.push({
                            pregunta: itemConEncabezado,
                            title: 'Preguntas',
                            iEncabPregId: evaluaciones[key]['iEncabPregId'],
                            iOrden: key,
                        })
                    }
                }

                this.preguntas = this.preguntas.filter(
                    (value, index, self) =>
                        value.iEncabPregId === null ||
                        index ===
                            self.findIndex(
                                (t) => t.iEncabPregId === value.iEncabPregId
                            )
                )
                this.totalPregunta = 0
                this.preguntas.forEach((pregunta) => {
                    {
                        if (pregunta.pregunta.length) {
                            pregunta.pregunta.forEach((item) => {
                                this.totalPregunta = this.totalPregunta + 1
                                if (item.iEncabPregId != null) {
                                    const preguntaMultiple =
                                        this.preguntas.find(
                                            (o) =>
                                                o.iEncabPregId ==
                                                item.iEncabPregId
                                        )
                                    if (preguntaMultiple) {
                                        preguntaMultiple.title +=
                                            ' #' + this.totalPregunta
                                    }
                                }
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
                    }
                })

                this.preguntas.forEach((pregunta) => {
                    if (
                        pregunta.iEncabPregId &&
                        this.enunciadosCache.has(pregunta.iEncabPregId)
                    ) {
                        // Restauramos el contenido desde el caché
                        pregunta.cEncabPregContenido = this.enunciadosCache.get(
                            pregunta.iEncabPregId
                        )

                        // También lo aplicamos a todas las preguntas dentro del grupo
                        if (pregunta.pregunta && pregunta.pregunta.length) {
                            pregunta.pregunta.forEach((subPregunta) => {
                                subPregunta.cEncabPregContenido =
                                    pregunta.cEncabPregContenido
                            })
                        }
                    }
                })
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

    guardarEnunciadoEnCache(id: number, contenido: string): void {
        // Solo almacenamos en caché si es un ID válido y está relacionado con preguntas
        if (id && this.preguntas.some((p) => p.iEncabPregId === id)) {
            this.enunciadosCache.set(id, contenido)
        }
    }

    limpiarCacheEnunciados(): void {
        this.enunciadosCache.clear()
    }
}
