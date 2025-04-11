import { PrimengModule } from '@/app/primeng.module'
import { GeneralService } from '@/app/servicios/general.service'
import { Component, inject, Input, OnInit } from '@angular/core'
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api'
import { ProgressBarModule } from 'primeng/progressbar'
import { RadioButtonModule } from 'primeng/radiobutton'
import { RemoveHTMLCSSPipe } from '@/app/shared/pipes/remove-html-style.pipe'
import { TruncatePipe } from '@/app/shared/pipes/truncate-text.pipe'
import { DomSanitizer } from '@angular/platform-browser'
import { NgxDocViewerModule } from 'ngx-doc-viewer'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { environment } from '@/environments/environment'
import { ModalEvaluacionFinalizadaComponent } from '../modal-evaluacion-finalizada/modal-evaluacion-finalizada.component'
import { ImagePreviewComponent } from '@/app/shared/image-preview/image-preview.component'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { TimeComponent } from '@/app/shared/time/time.component'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'

@Component({
    selector: 'app-rendir-examen',
    standalone: true,
    templateUrl: './rendir-examen.component.html',
    styleUrls: ['./rendir-examen.component.scss'],
    imports: [
        PrimengModule,
        ProgressBarModule,
        RadioButtonModule,
        TruncatePipe,
        RemoveHTMLCSSPipe,
        NgxDocViewerModule,
        ModalEvaluacionFinalizadaComponent,
        ImagePreviewComponent,
        TimeComponent,
    ],
})
export class RendirExamenComponent implements OnInit {
    @Input() iEvaluacionId: string
    @Input() iCursoNivelGradId: string
    /*@Input() cEvaluacionNombre: string
    @Input() cCursoNombre: string
    @Input() cGradoNombre: string*/
    evaluacion: any
    tiempoActual = new Date()
    tiempoFin = new Date()

    private _GeneralService = inject(GeneralService)
    private _MessageService = inject(MessageService)
    private _DomSanitizer = inject(DomSanitizer)
    private _ConstantesService = inject(ConstantesService)
    private _ConfirmationModalService = inject(ConfirmationModalService)

    totalPregunta: number = 0

    preguntas = []

    activeIndex: number = 0
    seleccion: string | null = null
    backend = environment.backend

    breadCrumbItems: MenuItem[]
    breadCrumbHome: MenuItem

    constructor(
        private store: LocalStoreService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        //this.evaluacion = this.store.getItem('evaluacion')
        this.obtenerEvaluacionxiEvaluacionId()
        this.obtenerPreguntaxiEvaluacionId()
    }

    obtenerEvaluacionxiEvaluacionId() {
        const params = {
            petition: 'post',
            group: 'ere',
            prefix: 'evaluacion',
            ruta: 'obtenerEvaluacionxiEvaluacionIdxiCursoNivelGradIdxiIieeId',
            data: {
                opcion: 'CONSULTARxiEvaluacionIdxiCursoNivelGradIdxiIieeId',
                iEvaluacionId: this.iEvaluacionId,
                iCursoNivelGradId: this.iCursoNivelGradId,
                iIieeId: this._ConstantesService.iIieeId,
            },
        }
        this.getInformation(params, params.data.opcion)
    }

    seleccionarOpcion(opcion: string) {
        this.seleccion = opcion
    }
    anteriorPregunta(index: number) {
        if (index <= this.preguntas.length - 1) {
            this.activeIndex = index - 1
        }
    }
    siguientePregunta(index: number) {
        if (index <= this.preguntas.length - 1) {
            this.activeIndex = index + 1
        }
    }
    tiempoRestante: number = 60
    getTiempoFormateado(): string {
        const minutos = Math.floor(this.tiempoRestante / 60)
        const segundos = this.tiempoRestante % 60
        return `${minutos}:${segundos < 10 ? '0' + segundos : segundos}`
    }

    obtenerPreguntaxiEvaluacionId() {
        const params = {
            petition: 'post',
            group: 'ere',
            prefix: 'evaluacion',
            ruta: 'ConsultarPreguntasxiEvaluacionIdxiCursoNivelGradIdxiEstudianteId',
            data: {
                opcion: 'ConsultarPreguntasxiEvaluacionIdxiCursoNivelGradIdxiEstudianteId',
                iEvaluacionId: this.iEvaluacionId,
                iCursoNivelGradId: this.iCursoNivelGradId,
                iEstudianteId: this._ConstantesService.iEstudianteId,
                iIieeId: this._ConstantesService.iIieeId,
                iYAcadId: this._ConstantesService.iYAcadId,
            },
        }
        this.getInformation(params, params.data.opcion)
    }

    marcarPaginadorPregunta() {
        const cantidadPreguntas =
            this.preguntas[this.activeIndex].pregunta.length
        let cantidadPreguntasMarcadas = 0
        this.preguntas[this.activeIndex].pregunta.forEach((item) => {
            item.alternativas.forEach((alter) => {
                if (alter.iMarcado == 1) {
                    cantidadPreguntasMarcadas++
                }
            })
        })

        if (cantidadPreguntas == cantidadPreguntasMarcadas) {
            this.preguntas[this.activeIndex].iMarcado = 1
        } else {
            this.preguntas[this.activeIndex].iMarcado = 0
        }
    }

    calcularPreguntasPendientes() {
        //let cantidadPreguntas = 0
        //let cantidadPreguntasSinMarcar = 0
        let cantidadPreguntasPendientes = 0
        this.preguntas.forEach((pregunta) => {
            //cantidadPreguntas += pregunta.pregunta.length

            pregunta.pregunta.forEach((item) => {
                let pendienteResponder = true
                item.alternativas.forEach((alter) => {
                    if (alter.iMarcado == 1) {
                        pendienteResponder = false
                    }
                })
                if (pendienteResponder) {
                    cantidadPreguntasPendientes++
                }
            })
        })
        return cantidadPreguntasPendientes
        //console.log("Ctd. preguntas: "+cantidadPreguntas)
        //console.log("Ctd. preguntas sin marcar: "+cantidadPreguntasSinMarcar)
        //this.cantidadPreguntasPendientes
        /*const cantidadPreguntas =
            this.preguntas[this.activeIndex].pregunta.length
        let cantidadPreguntasMarcadas = 0

        this.preguntas[this.activeIndex].pregunta.forEach((item) => {
            item.alternativas.forEach((alter) => {
                if (alter.iMarcado == 1) {
                    cantidadPreguntasMarcadas++
                }
            })
        })

        if (cantidadPreguntas == cantidadPreguntasMarcadas) {
            this.preguntas[this.activeIndex].iMarcado = 1
        } else {
            this.preguntas[this.activeIndex].iMarcado = 0
        }*/
    }

    guardarPregunta(alternativas, alternativa, marcado) {
        alternativas.forEach((i) => {
            if (i.iAlternativaId !== alternativa.iAlternativaId) {
                i.iMarcado = false
            }
        })
        alternativa.iMarcado = marcado
        /*this.preguntas.forEach((pregunta) => {
            pregunta.pregunta.forEach((i) => {
                if (i.iPreguntaId === Number(alternativa.iPreguntaId)) {
                    i.iMarcado = true
                }
            })
        })*/
        // alternativa.iMarcado = 1
        this.marcarPaginadorPregunta()
        const params = {
            petition: 'post',
            group: 'ere',
            prefix: 'resultados',
            ruta: 'guardarResultadosxiEstudianteIdxiResultadoRptaEstudiante',
            data: {
                opcion: 'guardarResultadosxiEstudianteIdxiResultadoRptaEstudiante',
                iResultadoId: alternativa.iResultadoId,
                iEstudianteId: this._ConstantesService.iEstudianteId,
                iResultadoRptaEstudiante: alternativa.iAlternativaId,
                iIieeId: this._ConstantesService.iIieeId,
                iEvaluacionId: this.iEvaluacionId,
                iYAcadId: this._ConstantesService.iYAcadId,
                iPreguntaId: alternativa.iPreguntaId,
                iCursoNivelGradId: this.iCursoNivelGradId,
                iMarcado: alternativa.iMarcado,
            },
        }
        this.getInformation(params, params.data.opcion)
    }

    preguntarTerminarExamen() {
        const cantidadPreguntasPendientes = this.calcularPreguntasPendientes()
        let mensaje = ''
        switch (cantidadPreguntasPendientes) {
            case 0:
                mensaje = 'El examen se dará por terminado. ¿Desea continuar?'
                break
            case 1:
                mensaje =
                    'Hay 1 pregunta pendiente de responder. ¿Desea continuar?'
                break
            default:
                mensaje =
                    'Hay ' +
                    cantidadPreguntasPendientes +
                    ' preguntas pendientes de responder. ¿Desea continuar?'
                break
        }
        this._ConfirmationModalService.openConfirm({
            header: mensaje,
            accept: () => {
                this.terminarExamen()
            },
        })
    }

    terminarExamen() {
        const params = {
            petition: 'post',
            group: 'ere',
            prefix: 'resultados',
            ruta: 'terminarExamenxiEstudianteId',
            data: {
                opcion: 'terminarExamenxiEstudianteId',
                iEstudianteId: this._ConstantesService.iEstudianteId,
                iIieeId: this._ConstantesService.iIieeId,
                iEvaluacionId: this.iEvaluacionId,
                iYAcadId: this._ConstantesService.iYAcadId,
                iCursoNivelGradId: this.iCursoNivelGradId,
            },
        }
        this.getInformation(params, params.data.opcion)
    }

    getInformation(params, accion) {
        this._GeneralService.getGralPrefix(params).subscribe({
            next: (response) => {
                /*if (
                    response.validated &&
                    accion ==
                        'guardarResultadosxiEstudianteIdxiResultadoRptaEstudiante'
                ) {
                    this._MessageService.add({
                        severity: 'success',
                        detail: response.message,
                    })
                }*/
                this.accionBtnItem({
                    accion,
                    item: response?.data,
                    message: response.message,
                })
            },
            complete: () => {},
            error: (error) => {
                //console.log(error)
                this._MessageService.add({
                    severity: 'error',
                    summary: 'Problema encontrado',
                    detail: error,
                })
            },
        })
    }

    timeEvent($event) {
        if (this.evaluacion == null) {
            return
        }
        const { accion } = $event
        switch (accion) {
            case 'tiempo-finalizado':
                console.log('El tiempo de la evaluación ha finalizado')
                /*this._MessageService.add({
                    severity: 'warn',
                    detail: 'El tiempo de la evaluación ha finalizado.',
                })*/
                this.finalizado = true
                /*this.accionBtnItem({accion: "terminarExamenxiEstudianteId"})*/
                break
            case 'tiempo-1-minuto-restante':
                console.log('Queda 1 minuto para finalizar la evaluación')
                //console.log('Queda 1 minuto para finalizar la evaluación')
                this._MessageService.add({
                    severity: 'warn',
                    detail: 'Queda 1 minuto para finalizar la evaluación',
                })
                break
            default:
                console.log('Esperando...')
                break
        }
    }

    finalizado: boolean = false
    accionBtnItem(elemento): void {
        const { accion } = elemento
        const { item } = elemento
        const { message } = elemento
        //this.cGradoNombre = this.cGradoNombre.toLowerCase()
        switch (accion) {
            case 'CONSULTARxiEvaluacionIdxiCursoNivelGradIdxiIieeId':
                this.evaluacion = item.length ? item[0] : null
                this.tiempoActual = new Date(this.evaluacion.dtHoraActual)
                this.tiempoFin = new Date(this.evaluacion.dtExamenFechaFin)
                this.breadCrumbItems = [
                    {
                        label: 'Evaluación ERE',
                        routerLink: '/ere/evaluacion/areas',
                    },
                    {
                        label: this.evaluacion.cEvaluacionNombre,
                    },
                    {
                        label:
                            this.evaluacion.cGradoAbreviacion +
                            ' ' +
                            this.evaluacion.cCursoNombre +
                            ' ' +
                            this.evaluacion.cNivelTipoNombre,
                    },
                    {
                        label: 'Rendir',
                        routerLink: `/ere/evaluaciones/${this.iEvaluacionId}/areas/${this.iCursoNivelGradId}/rendir`,
                    },
                    { label: 'Iniciar evaluación' },
                ]
                this.breadCrumbHome = {
                    icon: 'pi pi-home',
                    routerLink: '/',
                }
                //this.obtenerPreguntaxiEvaluacionId()
                break
            case 'ConsultarPreguntasxiEvaluacionIdxiCursoNivelGradIdxiEstudianteId':
                this.finalizado = false
                if (
                    item.length &&
                    item[item.length - 1]['iFinalizado'] === '0'
                ) {
                    this.finalizado = true
                    return
                }

                const evaluaciones = item
                for (const key in evaluaciones) {
                    const itemSinEncabezado = evaluaciones.filter(
                        (i) =>
                            !i.iEncabPregId &&
                            i.iPreguntaId === evaluaciones[key]['iPreguntaId']
                    )
                    if (itemSinEncabezado.length) {
                        this.preguntas.push({
                            pregunta: itemSinEncabezado,
                            iEncabPregId: null,
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
                            title: 'Pregunta múltiple',
                            iEncabPregId: evaluaciones[key]['iEncabPregId'],
                        })
                    }
                }
                //Agrupar los encabezados
                this.preguntas = this.preguntas.filter(
                    (value, index, self) =>
                        value.iEncabPregId === null ||
                        index ===
                            self.findIndex(
                                (t) => t.iEncabPregId === value.iEncabPregId
                            )
                )
                this.totalPregunta = 0
                // //console.log(this.preguntas)
                this.preguntas.forEach((pregunta) => {
                    {
                        if (pregunta.pregunta.length) {
                            let iMarcado = 0
                            pregunta.pregunta.forEach((item) => {
                                this.totalPregunta = this.totalPregunta + 1
                                item.title = 'Pregunta #' + this.totalPregunta
                                item.alternativas = item.alternativas
                                    ? JSON.parse(item.alternativas)
                                    : item.alternativas
                                item.cPregunta =
                                    this._DomSanitizer.bypassSecurityTrustHtml(
                                        item.cPregunta
                                    )
                                item.cEncabPregContenido =
                                    this._DomSanitizer.bypassSecurityTrustHtml(
                                        item.cEncabPregContenido
                                    )
                                iMarcado = item.alternativas.find(
                                    (alternativa) =>
                                        Number(alternativa.iMarcado) === 1
                                )
                                    ? 1
                                    : 0
                                // item.alternativas.forEach(alternativa => {
                                //         alternativa.iMarcado = alternativa.iMarcado ? true : false
                                // });
                            })
                            pregunta.iMarcado = iMarcado
                        }

                        if (pregunta.pregunta.length > 1) {
                            pregunta['iEncabPregId'] =
                                pregunta.pregunta[0]['iEncabPregId']
                            pregunta['cEncabPregContenido'] =
                                pregunta.pregunta[0]['cEncabPregContenido']
                            pregunta['cPregunta'] =
                                pregunta.pregunta[0]['cPregunta']
                        } else {
                            pregunta.title = pregunta.pregunta[0]?.title || ''
                        }
                    }
                })
                //console.log(this.preguntas)
                break
            case 'guardarResultadosxiEstudianteIdxiResultadoRptaEstudiante':
                this._MessageService.add({
                    severity: 'success',
                    detail: message,
                })
                break
            case 'terminarExamenxiEstudianteId':
                this.finalizado = false
                if (
                    item.length &&
                    item[item.length - 1]['iFinalizado'] === '0'
                ) {
                    this.finalizado = true
                    //window.location.reload()
                }

                break
            case 'close-modal':
                this.showModalPreview = false
                break
        }
    }
    updateUrl(item) {
        item.cAlternativaImagen = 'users/no-image.png'
    }

    previewImage: string | null = null
    showModalPreview: boolean = false
    onImageClick(event: MouseEvent) {
        const target = event.target as HTMLImageElement

        // Verifica si el clic fue en una imagen
        if (target.tagName.toLowerCase() === 'img') {
            this.previewImage = target.src // Asigna la URL de la imagen al preview
            this.showModalPreview = true
        }
    }
}
