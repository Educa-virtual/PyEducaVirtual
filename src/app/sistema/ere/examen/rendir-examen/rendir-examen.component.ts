import { PrimengModule } from '@/app/primeng.module'
import { GeneralService } from '@/app/servicios/general.service'
import { Component, inject, Input, OnInit } from '@angular/core'
import { MessageService } from 'primeng/api'
import { ProgressBarModule } from 'primeng/progressbar'
import { RadioButtonModule } from 'primeng/radiobutton'
import { RemoveHTMLCSSPipe } from '@/app/shared/pipes/remove-html-style.pipe'
import { TruncatePipe } from '@/app/shared/pipes/truncate-text.pipe'
import { DomSanitizer } from '@angular/platform-browser'

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

    totalPregunta: number = 0

    preguntas = [
        // {
        //     title: 'Pregunta N°1: Si tienes 48 caramelos y regalas 23, ¿Cuántos te quedan?',
        //     tipo: 'unica',
        //     opciones: ['Opción A', 'Opción B', 'Opción C'],
        // },
        // {
        //     title: 'Pregunta N°2: Si en cada caja hay 5 lápices y tienes 4 cajas, ¿cuántos lápices tienes en total?  ',
        //     tipo: 'múltiple',
        //     enunciado:
        //         'Selecciona las respuestas correctas según el siguiente enunciado:',
        //     opciones: ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4'],
        // },
        // { title: 'Title 3', content: 'Content 3' },
    ]

    subPreguntas = [
        { title: 'pregunta 1' },
        { title: 'pregunta 2' },
        { title: 'pregunta 3' },
    ]
    subAlternativas: string[] = ['23', 'ya 24', '30?', 'N/A']
    alternativas: string[] = ['no se tu dime', 'ya 24', '30?', 'N/A']

    activeIndex = 0
    seleccion: string | null = null

    constructor() {}

    ngOnInit() {
        this.obtenerPreguntaxiEvaluacionId()
    }
    // meto de al seleccionar una opción
    seleccionarOpcion(opcion: string) {
        this.seleccion = opcion
    }
    // como convertir el (id) en letras y poder listar
    getLetra(index: number): string {
        return String.fromCharCode(65 + index)
        // Convierte 0 → A, 1 → B, 2 → C, etc.
    }
    siguientePregunta(index: number) {
        if (index < this.preguntas.length - 1) {
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
            ruta: 'handleCrudOperation',
            data: {
                opcion: 'CONSULTAR-PREGUNTAS-ESTUDIANTExiEvaluacionIdxiCursoNivelGradId',
                iEvaluacionId: this.iEvaluacionId,
                valorBusqueda: this.iCursoNivelGradId,
            },
        }
        this.getInformation(params, params.data.opcion)
    }

    getInformation(params, accion) {
        this._GeneralService.getGralPrefix(params).subscribe({
            next: (response) => {
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

    accionBtnItem(elemento): void {
        const { accion } = elemento
        const { item } = elemento
        switch (accion) {
            case 'CONSULTAR-PREGUNTAS-ESTUDIANTExiEvaluacionIdxiCursoNivelGradId':
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
                            })
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
                        //pregunta.pregunta.alternativas = pregunta.pregunta.alternativas ? JSON.stringify(pregunta.pregunta.alternativas) : pregunta.pregunta.alternativas
                    }
                })

                //console.log(this.preguntas)
                break
        }
    }
}
