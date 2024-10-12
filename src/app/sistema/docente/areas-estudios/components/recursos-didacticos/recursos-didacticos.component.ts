import { Component, Input, OnChanges, OnDestroy } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { GeneralService } from '@/app/servicios/general.service'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { Subject, takeUntil } from 'rxjs'
interface Data {
    accessToken: string
    refreshToken: string
    expires_in: number
    msg?
    data?
    validated?: boolean
    code?: number
}
@Component({
    selector: 'app-recursos-didacticos',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './recursos-didacticos.component.html',
    styleUrl: './recursos-didacticos.component.scss',
})
export class RecursosDidacticosComponent implements OnChanges, OnDestroy {
    @Input() iSilaboId: string
    private unsubscribe$ = new Subject<boolean>()

    constructor(
        private GeneralService: GeneralService,
        private ConstantesService: ConstantesService
    ) {}
    ngOnChanges(changes) {
        if (changes.iSilaboId?.currentValue) {
            this.iSilaboId = changes.iSilaboId.currentValue
            this.getRecursoSilabos()
        }
    }
    data = []

    getRecursoSilabos() {
        const params = {
            petition: 'post',
            group: 'docente',
            prefix: 'recurso-silabos',
            ruta: 'list',
            data: {
                opcion: 'CONSULTARxiSilaboId',
                iCredId: this.ConstantesService.iCredId,
                iSilaboId: this.iSilaboId,
            },
            params: { skipSuccessMessage: true },
        }
        this.getInformation(params, false)
    }

    getInformation(params, api) {
        this.GeneralService.getGralPrefix(params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (response: Data) => {
                    if (!api) {
                        this.data = response.data
                        this.data.forEach((item) => {
                            item.iEstado === '1'
                                ? (item.iEstado = true)
                                : (item.iEstado = false)
                        })
                    } else {
                        this.getRecursoSilabos()
                    }
                },
                complete: () => {},
                error: (error) => {
                    console.log(error)
                },
            })
    }
    updateRecursoSilabos(item) {
        item.valorBusqueda = item.iEstado
        item.iSilaboId = this.iSilaboId
        item.opcion = 'GUARDARxiEstado'
        item.iCredId = this.ConstantesService.iCredId

        const params = {
            petition: 'post',
            group: 'docente',
            prefix: 'recurso-silabos',
            ruta: 'store',
            data: item,
            params: { skipSuccessMessage: true },
        }
        //console.log(params)
        this.getInformation(params, true)
    }
    ngOnDestroy() {
        this.unsubscribe$.next(true)
    }
}
