import {
    Component,
    EventEmitter,
    inject,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core'
import { AccordionModule } from 'primeng/accordion'
import { CommonModule } from '@angular/common'
import { ActivatedRoute } from '@angular/router'
import { Subject, takeUntil } from 'rxjs'
import { ApiEvaluacionesService } from '@/app/sistema/aula-virtual/services/api-evaluaciones.service'
import { MenuModule } from 'primeng/menu'
import { MenuItem } from 'primeng/api'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { CommunicationService } from '@/app/servicios/communication.service'
import { DOCENTE } from '@/app/servicios/perfilesConstantes'

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
                    visible:
                        this.constantesService.iPerfilId == DOCENTE
                            ? true
                            : false,
                },
                {
                    label: 'Descargar',
                    icon: 'pi pi-download',
                    command: () => this.communicationService.requestPrint(),
                },
            ],
        },
    ]
    private communicationService = inject(CommunicationService)

    rubrica
    params = {
        iEvaluacionId: undefined,
    }

    data

    @Output() clickNameRubrica = new EventEmitter()

    _unsubscribe$ = new Subject<boolean>()

    private _evaluacionApiService = inject(ApiEvaluacionesService)

    constructor(
        private route: ActivatedRoute,
        private constantesService: ConstantesService
    ) {}

    ngOnInit(): void {
        console.log('constantesService')
        console.log(this.constantesService)

        this.route.queryParamMap.subscribe((params) => {
            this.params.iEvaluacionId = params.get('iEvaluacionId')

            this.getRubrica()
        })
    }

    downloadRubrica() {}
    isMenuVisible(): boolean {
        return this.items.some((group) =>
            group.items?.some((item) => item.visible !== false)
        )
    }
    deleteRubricaEvaluacion() {
        if (this.params?.iEvaluacionId) {
            this._evaluacionApiService
                .deleteRubricaEvaluacion(this.params)
                .pipe(takeUntil(this._unsubscribe$))
                .subscribe({
                    next: (data) => {
                        this.data = Array.isArray(data) ? data[0] : undefined
                        console.log(this.data)
                    },
                })
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
