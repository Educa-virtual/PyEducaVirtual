import { PrimengModule } from '@/app/primeng.module'
import { GeneralService } from '@/app/servicios/general.service'
import { Component, inject, Input, OnInit } from '@angular/core'
import { ConfirmationService, MessageService } from 'primeng/api'
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
    @Input() cEvaluacionNombre: string
    @Input() cCursoNombre: string
    @Input() cGradoNombre: string
    tiempoActual = new Date()
    tiempoFin = new Date()

    private _GeneralService = inject(GeneralService)
    private _MessageService = inject(MessageService)
    private _DomSanitizer = inject(DomSanitizer)
    private _ConstantesService = inject(ConstantesService)

    totalPregunta: number = 0

    preguntas = []

    activeIndex: number = 0
    seleccion: string | null = null
    backend = environment.backend

    constructor(
        private store: LocalStoreService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        const evaluacion = this.store.getItem('evaluacion')
        this.tiempoFin = new Date(evaluacion.dtExamenFechaFin)
        //console.log(evaluacion.dtExamenFechaFin)
        this.obtenerPreguntaxiEvaluacionId()
    }
    // meto de al seleccionar una opción
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
            /*for (const i of this.preguntas[this.activeIndex].pregunta) {
                if (i.iPreguntaId == alternativa.iPreguntaId) {
                    this.preguntas[this.activeIndex].iMarcado = 1
                    break
                }
            }*/
            this.preguntas[this.activeIndex].iMarcado = 1
        } else {
            this.preguntas[this.activeIndex].iMarcado = 0
        }
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

    preguntarTerminarExamen(event: Event) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'El examen se dará por terminado. ¿Desea continuar?',
            header: 'Terminar examen',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon: 'none',
            rejectIcon: 'none',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                //this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
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
    finalizado: boolean = false
    accionBtnItem(elemento): void {
        const { accion } = elemento
        const { item } = elemento
        const { message } = elemento
        this.cGradoNombre = this.cGradoNombre.toLowerCase()
        switch (accion) {
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
                            title: 'Pregunta Múltiple',
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
                                item.title =
                                    'Pregunta #' +
                                    this.totalPregunta +
                                    ': ' +
                                    (item.cPregunta || '')
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
                    this._MessageService.add({
                        severity: 'success',
                        detail: message,
                    })
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
