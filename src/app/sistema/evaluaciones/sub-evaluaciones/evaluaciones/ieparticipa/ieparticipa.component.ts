import { Component, ChangeDetectorRef } from '@angular/core'
/*import { Product } from '@domain/product';
import { ProductService } from '@service/productservice';*/
import { Product } from 'src/app/demo/api/product'
import { ProductService } from 'src/app/demo/service/product.service'
import { PickListModule } from 'primeng/picklist'
@Component({
    selector: 'app-ieparticipa',
    standalone: true,
    imports: [PickListModule],
    templateUrl: './ieparticipa.component.html',
    styleUrl: './ieparticipa.component.scss',
    providers: [ProductService],
})
export class IeparticipaComponent {
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
    }
}
