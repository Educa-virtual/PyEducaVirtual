import { Product } from '@/app/demo/api/product'
import { Component, OnInit } from '@angular/core'
import { DialogModule } from 'primeng/dialog'
import { NgFor, NgIf, CurrencyPipe } from '@angular/common'
import { InputTextModule } from 'primeng/inputtext'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { InputIconModule } from 'primeng/inputicon'
import { ToastModule } from 'primeng/toast'
import { ButtonModule } from 'primeng/button' /* botones */
import { DropdownModule } from 'primeng/dropdown'
import { TreeTableModule } from 'primeng/treetable'
import { IconFieldModule } from 'primeng/iconfield'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { CarouselModule } from 'primeng/carousel'
import { ImageModule } from 'primeng/image'
import { GalleriaModule } from 'primeng/galleria'
import { ProductService } from 'src/app/demo/service/product.service'
import { OrderListModule } from 'primeng/orderlist'

@Component({
    selector: 'app-roles',
    standalone: true,
    templateUrl: './roles.component.html',
    styleUrls: ['./roles.component.css'],
    imports: [
        DialogModule,
        NgFor,
        NgIf,
        CurrencyPipe,
        InputTextModule,
        InputTextareaModule,
        GalleriaModule,
        InputIconModule,
        CarouselModule,
        ToastModule,
        ImageModule,
        ButtonModule,
        DropdownModule,
        TreeTableModule,
        IconFieldModule,
        OrderListModule,
        ContainerPageComponent,
    ],
})
export class RolesComponent implements OnInit {
    products: Product[] = []
    product: Product = {}
    submitted: boolean = false
    productDialog: boolean = false
    images = []

    galleriaResponsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 5,
        },
        {
            breakpoint: '960px',
            numVisible: 4,
        },
        {
            breakpoint: '768px',
            numVisible: 3,
        },
        {
            breakpoint: '560px',
            numVisible: 1,
        },
    ]
    carouselResponsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 3,
        },
        {
            breakpoint: '768px',
            numVisible: 2,
            numScroll: 2,
        },
        {
            breakpoint: '560px',
            numVisible: 1,
            numScroll: 1,
        },
    ]
    constructor(private productService: ProductService) {}
    ngOnInit() {
        this.productService.getProductsSmall().then((products) => {
            this.products = products
        })
    }
    openNew() {
        this.product = {}
        this.submitted = false
        this.productDialog = true
    }
    hideDialog() {
        this.productDialog = false
        this.submitted = false
    }
}
