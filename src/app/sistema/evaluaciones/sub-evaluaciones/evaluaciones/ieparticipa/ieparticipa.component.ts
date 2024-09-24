import { Component, ChangeDetectorRef, inject } from '@angular/core'
/*import { Product } from '@domain/product';
import { ProductService } from '@service/productservice';*/
import { Product } from 'src/app/demo/api/product'
import { ProductService } from 'src/app/demo/service/product.service'
import { PickListModule } from 'primeng/picklist'

import { ApiEreService } from '../../../services/api-ere.service'
import { Subject, takeUntil } from 'rxjs'
//import dayjs from 'dayjs'

import { ButtonModule } from 'primeng/button'
@Component({
    selector: 'app-ieparticipa',
    standalone: true,
    imports: [PickListModule, ButtonModule],
    templateUrl: './ieparticipa.component.html',
    styleUrl: './ieparticipa.component.scss',
    providers: [ProductService],
})
export class IeparticipaComponent {
    private unsubscribe$: Subject<boolean> = new Subject()
    public params = {
        iCompentenciaId: 0,
        iCapacidadId: 0,
        iDesempenioId: 0,
        bPreguntaEstado: -1,
    }
    public data = []

    private _apiEre = inject(ApiEreService)
    sourceProducts!: Product[]

    targetProducts!: Product[]

    constructor(
        private carService: ProductService,
        private cdr: ChangeDetectorRef
    ) {}
    ngOnInit() {
        this.carService.getProductsSmall().then((products) => {
            this.sourceProducts = products
            this.cdr.markForCheck()
        })
        this.targetProducts = []
        this.obtenerIE()
    }

    obtenerIE() {
        this._apiEre
            .obtenerIE(this.params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (resp: unknown) => {
                    /*.competencias = resp['data']
                    this.competencias.unshift({
                        iCompentenciaId: 0,
                        cCompetenciaDescripcion: 'Todos',
                    })*/

                    this.data = resp['data']
                    //alert(JSON.stringify(this.data))
                    this.sourceProducts = this.data
                },
            })
    }
    seleccionados() {
        alert(JSON.stringify(this.targetProducts))
    }
}
