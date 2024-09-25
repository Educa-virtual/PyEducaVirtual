import { Component, ChangeDetectorRef, inject } from '@angular/core'
/*import { Product } from '@domain/product';
import { ProductService } from '@service/productservice';*/
import { Product } from 'src/app/demo/api/product'
import { ProductService } from 'src/app/demo/service/product.service'
import { PickListModule } from 'primeng/picklist'

import { ApiEvaluacionesRService } from '../../../services/api-evaluaciones-r.service'
import { Subject, takeUntil } from 'rxjs'
//import dayjs from 'dayjs'
import { FormsModule } from '@angular/forms'
import { DropdownModule } from 'primeng/dropdown'

import { ButtonModule } from 'primeng/button'

/*interface City {
  name: string;
  code: string;
}*/
interface NivelTipo {
    cNivelTipoNombre: string
    iNivelTipoId: string
}

@Component({
    selector: 'app-ieparticipa',
    standalone: true,
    imports: [PickListModule, ButtonModule, DropdownModule, FormsModule],
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

    private _apiEre = inject(ApiEvaluacionesRService)
    sourceProducts!: Product[]

    targetProducts!: Product[]

    nivelTipo: NivelTipo[] | undefined
    selectedNivelTipo: NivelTipo | undefined

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
        this.obtenerNivelTipo()

        this.nivelTipo = [
            { cNivelTipoNombre: 'Primaria', iNivelTipoId: 'NY' },
            { cNivelTipoNombre: 'Secundaria', iNivelTipoId: 'RM' },
        ]
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
    obtenerNivelTipo() {
        this._apiEre
            .obtenerNivelTipo(this.params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (resp: unknown) => {
                    /*.competencias = resp['data']
                  this.competencias.unshift({
                      iCompentenciaId: 0,
                      cCompetenciaDescripcion: 'Todos',
                  })*/

                    this.nivelTipo = resp['data']
                    alert(JSON.stringify(this.data))
                    this.sourceProducts = this.data
                },
            })
    }
    seleccionados() {
        alert(JSON.stringify(this.targetProducts))
    }
    onChange(event) {
        //alert(v)
        alert(JSON.stringify(event))
        //this.verSeleccion = this.opcionSeleccionado;
    }
}
