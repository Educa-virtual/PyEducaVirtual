import { PrimengModule } from '@/app/primeng.module'
import { GeneralService } from '@/app/servicios/general.service'
import { Component, inject, Input, OnInit } from '@angular/core'
import { MessageService } from 'primeng/api'
import { ProgressBarModule } from 'primeng/progressbar'
import { RadioButtonModule } from 'primeng/radiobutton'
import { RemoveHTMLCSSPipe } from '@/app/shared/pipes/remove-html-style.pipe'
import { TruncatePipe } from '@/app/shared/pipes/truncate-text.pipe'
import { DomSanitizer } from '@angular/platform-browser'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { environment } from '@/environments/environment'
import { ModalEvaluacionFinalizadaComponent } from '../modal-evaluacion-finalizada/modal-evaluacion-finalizada.component'

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
        ModalEvaluacionFinalizadaComponent,
    ],
})
export class RendirExamenComponent implements OnInit {
    @Input() iEvaluacionId: string
    @Input() iCursoNivelGradId: string
    @Input() cEvaluacionNombre: string
    @Input() cCursoNombre: string

    private _GeneralService = inject(GeneralService)
    private _MessageService = inject(MessageService)
    private _DomSanitizer = inject(DomSanitizer)
    private _ConstantesService = inject(ConstantesService)

    totalPregunta: number = 0

    preguntas = []

    activeIndex: number = 0
    seleccion: string | null = null
    backend = environment.backend

    ngOnInit() {
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
            },
        }
        this.getInformation(params, params.data.opcion)
    }

    guardarPregunta(alternativas, alternativa, marcado) {
        // console.log(marcado)
        // console.log(alternativa)
        // console.log(alternativas)
        alternativa.iMarcado = marcado
        this.preguntas.forEach((pregunta) => {
            pregunta.pregunta.forEach((i) => {
                if (i.iPreguntaId === Number(alternativa.iPreguntaId)) {
                    i.iMarcado = true
                }
            })
        })
        // alternativa.iMarcado = 1
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

    getInformation(params, accion) {
        this._GeneralService.getGralPrefix(params).subscribe({
            next: (response) => {
                if (response.validated) {
                    this._MessageService.add({
                        severity: 'success',
                        summary: 'Exitoso',
                        detail: response.message,
                    })
                }
                this.accionBtnItem({ accion, item: response?.data })
            },
            complete: () => {},
            error: (error) => {
                //console.log(error)
                this._MessageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error,
                })
            },
        })
    }
    finalizado: boolean = false
    accionBtnItem(elemento): void {
        const { accion } = elemento
        const { item } = elemento
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
                break
        }
    }
    updateUrl(item) {
        item.cAlternativaImagen = 'users/no-image.png'
    }
}
