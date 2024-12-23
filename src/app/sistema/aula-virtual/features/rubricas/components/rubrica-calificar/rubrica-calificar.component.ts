import {
    Component,
    ElementRef,
    inject,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core'
import { AccordionModule } from 'primeng/accordion'
import { CommonModule } from '@angular/common'
import {
    IColumn,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { firstValueFrom, Subject, Subscription, takeUntil } from 'rxjs'
import { ApiEvaluacionesService } from '@/app/sistema/aula-virtual/services/api-evaluaciones.service'
import { ActivatedRoute } from '@angular/router'
import { CommunicationService } from '@/app/servicios/communication.service'
import { httpService } from '@/app/servicios/httpService'

@Component({
    selector: 'app-rubrica-calificar',
    standalone: true,
    imports: [AccordionModule, CommonModule, TablePrimengComponent],

    templateUrl: './rubrica-calificar.component.html',
    styleUrl: './rubrica-calificar.component.scss',
})
export class RubricaCalificarComponent implements OnInit, OnDestroy {
    @Input() enableCellSelection = false
    @Input() enableViewSelections = false
    columns: IColumn[] = []

    rubrica

    @Input() showSortIcon = false
    params = {
        iEvaluacionId: undefined,
        iEstudianteId: undefined,
    }
    data

    _unsubscribe$ = new Subject<boolean>()

    private _evaluacionApiService = inject(ApiEvaluacionesService)

    private printSubscription: Subscription

    @ViewChild('contenidoImprimible', { static: true })
    contenidoImprimible!: ElementRef

    constructor(
        private route: ActivatedRoute,
        private communicationService: CommunicationService,
        private httpService: httpService
    ) {
        this.printSubscription =
            this.communicationService.printRequest$.subscribe(() =>
                this.imprimir()
            )
    }

    ngOnInit(): void {
        if (this.route.queryParams['_value'].iEvaluacionId) {
            this.params.iEvaluacionId =
                this.route.queryParams['_value'].iEvaluacionId
            this.params.iEstudianteId =
                this.route.queryParams['_value']?.iEstudianteId ?? undefined
        }
        this.route.queryParamMap.subscribe((params) => {
            this.params.iEvaluacionId = params.get('iEvaluacionId')
            this.params.iEstudianteId = params.get('iEstudianteId') ?? undefined
            this.getRubrica()
        })
    }

    imprimir() {
        console.log('imprimiendo')

        // const elemento = this.contenidoImprimible.nativeElement

        const contenido = this.contenidoImprimible.nativeElement.innerHTML

        // Convertir los estilos a inline
        // this.communicationService.convertToInlineStyles(elemento)

        // Generar el contenido a imprimir
        // const contenido = elemento.outerHTML

        const styleSheets = Array.from(document.styleSheets)
            .map((styleSheet) => {
                try {
                    return Array.from(styleSheet.cssRules || [])
                        .map((rule) => rule.cssText)
                        .join('\n')
                } catch (e) {
                    console.warn(
                        'No se pudo cargar un stylesheet:',
                        styleSheet.href
                    )
                    return ''
                }
            })
            .join('\n')

        const iframe = document.createElement('iframe')
        document.body.appendChild(iframe)
        iframe.style.position = 'absolute'
        iframe.style.left = '-9999px'
        const doc = iframe.contentDocument || iframe.contentWindow?.document

        if (doc) {
            doc.open()
            doc.write(`
                <html>
                    <head>
                    <style>${styleSheets}</style>
                    </head>
                    <body>
                        <h1 style='font-family:"Inter var", sans-serif;font-weight: 700; padding: 0.5rem;color :#4b5563; font-size: 1.25rem; background: #e6e6ee'>Rubrica - ${this.data.cInstrumentoNombre}</h1>
                        ${contenido}
                    </body>
                </html>
            `)
            doc.close()
            iframe.contentWindow?.focus()
            iframe.contentWindow?.print()
            document.body.removeChild(iframe)
        }
    }

    dataExample = [
        {
            iNivelEvaId: 57,
            iCriterioId: 27,
            iEscalaCalifId: 1,
            cNivelEvaNombre: 'Excelente',
            iNivelEvaValor: 5,
            cNivelEvaDescripcion:
                'El estudiante presenta un análisis profundo y reflexivo de los temas abordados en el examen, demostrando un pensamiento crítico sólido.',
        },
    ]

    structuredColumns(niveles: Array<any>) {
        let columns = []

        if(!Array.isArray(niveles)){
            return [
                {
                    type: 'text',
                    width: '5rem',
                    field: 'n/a',
                    header: `Sin niveles`,
                    text_header: 'left',
                    text: 'left',
                }
            ]
        }

        niveles.forEach((nivel, index) => {
            columns.push({
                type: 'text',
                width: '5rem',
                field: 'cNivelEvaDescripcion' + index,
                header: `${nivel.cNivelEvaNombre}(${nivel.iNivelEvaValor})`,
                text_header: 'left',
                text: 'left',
            })
        })

        return columns
    }

    structuredRows(niveles: Array<any>) {

        if(!Array.isArray(niveles)){
            return [
                {
                    'n/a': 'Sin niveles existentes',
                }
            ]
        }


        const nivelesMap = niveles.map((nivel, index) => ({
            [`cNivelEvaDescripcion${index}`]: nivel.cNivelEvaDescripcion,
            iNivelEvaId: nivel.iNivelEvaId,
            iCriterioId: nivel.iCriterioId,
            logros: nivel.logros,
        }))

        const merged = nivelesMap.reduce((acc, curr, index) => {
            const descriptionKey = `cNivelEvaDescripcion${index}`

            // Agregar descripciones al acumulador
            if (!acc[descriptionKey]) {
                acc[descriptionKey] = [curr[descriptionKey]]
            }

            // Agregar valores al objeto "values"
            if (!acc['values']) {
                acc['values'] = {}
            }
            acc['values'][descriptionKey] = {
                iNivelEvaId: curr.iNivelEvaId,
                iCriterioId: curr.iCriterioId,
                logros: curr.logros,
            }

            return acc
        }, {})

        return [merged]
    }

    async selection(data) {
        console.log('data')
        console.log(data)

        if (this.params?.iEvaluacionId) {

            await firstValueFrom(this.httpService.postData('evaluaciones/evaluacion/guardarActualizarCalificacionRubricaEvaluacion', {
                ...this.params,
                ...data[1],
            })) 
            
            this.data =  (await firstValueFrom(this.httpService.getData('evaluaciones/instrumento-evaluaciones/obtenerRubricaEvaluacion', this.params))).data[0]

        }
    }

    getRubrica() {
        if (this.params?.iEvaluacionId) {
            this._evaluacionApiService
                .obtenerRubricaEvaluacion(this.params)
                .pipe(takeUntil(this._unsubscribe$))
                .subscribe({
                    next: (data) => {
                        this.data = Array.isArray(data) ? data[0] : undefined
                        console.log('Cargando rubrica')
                        console.log(this.data)
                    },
                })
        }
    }

    ngOnDestroy() {
        this._unsubscribe$.next(true)
        this._unsubscribe$.complete()
    }
}
