import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core'
import { AccordionModule } from 'primeng/accordion'
import { CommonModule } from '@angular/common'
import {
    IColumn,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { Subject, takeUntil } from 'rxjs'
import { ApiEvaluacionesService } from '@/app/sistema/aula-virtual/services/api-evaluaciones.service'
import { ActivatedRoute } from '@angular/router'

@Component({
    selector: 'app-rubrica-calificar',
    standalone: true,
    imports: [AccordionModule, CommonModule, TablePrimengComponent],

    templateUrl: './rubrica-calificar.component.html',
    styleUrl: './rubrica-calificar.component.scss',
})
export class RubricaCalificarComponent implements OnInit, OnDestroy {

    @Input() enableCellSelection = false
    columns: IColumn[] = [
        {
            type: 'text',
            width: '5rem',
            field: 'cCriterioNombre',
            header: 'Nivel 1',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cNivel2',
            header: 'Nivel 2',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cNivel3',
            header: 'Nivel 3',
            text_header: 'left',
            text: 'left',
        },
    ]

    rubrica
    params = {
        iInstrumentoId: undefined,
    }
    data

    _unsubscribe$ = new Subject<boolean>()

    private _evaluacionApiService = inject(ApiEvaluacionesService)

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.queryParamMap.subscribe((params) => {
            this.params.iInstrumentoId = params.get('iInstrumentoId')

            this.getRubrica()
        })
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
      const nivelesMap = niveles.map((nivel, index) => ({
        [`cNivelEvaDescripcion${index}`]: nivel.cNivelEvaDescripcion,
        iNivelEvaId: nivel.iNivelEvaId,
      }));
    
      const merged = nivelesMap.reduce((acc, curr, index) => {
        const descriptionKey = `cNivelEvaDescripcion${index}`;
        
        // Agregar descripciones al acumulador
        if (!acc[descriptionKey]) {
          acc[descriptionKey] = [curr[descriptionKey]];
        }
    
        // Agregar valores al objeto "values"
        if (!acc['values']) {
          acc['values'] = {};
        }
        acc['values'][descriptionKey] = { iNivelEvaId: curr.iNivelEvaId };
    
        return acc;
      }, {});
    
      return [merged];
    }
    

    selection(data) {
        console.log(data)
    }

    getRubrica() {
        if (this.params?.iInstrumentoId) {
            this._evaluacionApiService
                .obtenerRubrica(this.params)
                .pipe(takeUntil(this._unsubscribe$))
                .subscribe({
                    next: (data) => {
                        this.data = Array.isArray(
                            this._evaluacionApiService.rubrica
                        )
                            ? this._evaluacionApiService.rubrica[0]
                            : undefined

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
