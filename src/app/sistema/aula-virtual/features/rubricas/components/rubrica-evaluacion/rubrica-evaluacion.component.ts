import { Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core'
import { AccordionModule } from 'primeng/accordion'
import { CommonModule } from '@angular/common'
import { ActivatedRoute } from '@angular/router'
import { Subject, takeUntil } from 'rxjs'
import { ApiEvaluacionesService } from '@/app/sistema/aula-virtual/services/api-evaluaciones.service'
import { MenuModule } from 'primeng/menu'
import { MenuItem } from 'primeng/api'

@Component({
    selector: 'app-rubrica-evaluacion',
    standalone: true,
    imports: [AccordionModule, CommonModule, MenuModule],

    templateUrl: './rubrica-evaluacion.component.html',
    styleUrl: './rubrica-evaluacion.component.scss',
})
export class RubricaEvaluacionComponent implements OnInit, OnDestroy {
    items: MenuItem[] = [
        {
            label: 'Opciones',
            items: [
                {
                    label: 'Eliminar',
                    icon: 'pi pi-trash',
                    command: () => this.deleteRubricaEvaluacion(),
                },
            ],
        },
    ]
    rubrica
    params = {
        iInstrumentoId: undefined,
    }

    data

    @Output() clickNameRubrica = new EventEmitter()

    _unsubscribe$ = new Subject<boolean>()

    private _evaluacionApiService = inject(ApiEvaluacionesService)

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.queryParamMap.subscribe((params) => {
            this.params.iInstrumentoId = params.get('iInstrumentoId')

            this.getRubrica()
        })
    }

    deleteRubricaEvaluacion() {
        this.params.iInstrumentoId = null
    }

    getRubrica() {
        if (this.params?.iInstrumentoId) {
            this._evaluacionApiService
                .obtenerRubrica(this.params)
                .pipe(takeUntil(this._unsubscribe$))
                .subscribe({
                    next: (data) => {
                        this.data = Array.isArray(this._evaluacionApiService.rubrica) ? this._evaluacionApiService.rubrica[0] : undefined
                        console.log(this.data)
                    },
                })
        }
    }

    maxPuntaje(criterios) {
        if (criterios) {
            const sumaMaximos = criterios.reduce((acumulador, criterio) => {
                // Obtener el valor máximo en el array "niveles"
                const maxValor = Math.max(
                    ...criterio.niveles.map((nivel) => nivel.iNivelEvaValor)
                )
                return acumulador + maxValor
            }, 0)

            return sumaMaximos
        }
    }

    ngOnDestroy() {
        this._unsubscribe$.next(true)
        this._unsubscribe$.complete()
    }
}
