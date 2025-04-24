import { PrimengModule } from '@/app/primeng.module'
import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'app-imagen-select',
    standalone: true,
    templateUrl: './imagen-select.component.html',
    styleUrls: ['./imagen-select.component.scss'],
    imports: [PrimengModule],
})
export class ImagenSelectComponent implements OnInit {
    products = [
        {
            name: 'Capaciaciones',
            image: 'assets/demo/images/product/bamboo-watch.jpg',
            description: 'Product Description',
            price: 65,
            quantity: 1,
            status: 'INSTOCK',
        },
        {
            name: 'Especilizaciones',
            image: 'assets/demo/images/product/black-watch.jpg',
            description: 'Product Description',
            price: 72,
            quantity: 1,
            status: 'INSTOCK',
        },
        {
            name: 'Diplamados',
            image: 'http://www.thebusinessofsports.com/wp-content/uploads/2010/10/facebook-icon-200x200.png',
            description: 'Product Description',
            price: 79,
            quantity: 1,
            status: 'INSTOCK',
        },
        {
            name: 'Especilizaciones',
            image: 'assets/demo/images/product/black-watch.jpg',
            description: 'Product Description',
            price: 72,
            quantity: 1,
            status: 'INSTOCK',
        },
        {
            name: 'Diplamados',
            image: 'http://www.thebusinessofsports.com/wp-content/uploads/2010/10/facebook-icon-200x200.png',
            description: 'Product Description',
            price: 79,
            quantity: 1,
            status: 'INSTOCK',
        },
    ]

    responsiveOptions: any[] | undefined

    constructor() {}

    ngOnInit() {
        // this.productService.getProductsSmall().then((products) => {
        //     this.products = products;
        // });

        this.responsiveOptions = [
            {
                breakpoint: '1199px',
                numVisible: 1,
                numScroll: 1,
            },
            {
                breakpoint: '991px',
                numVisible: 2,
                numScroll: 1,
            },
            {
                breakpoint: '767px',
                numVisible: 1,
                numScroll: 1,
            },
        ]
    }

    // getSeverity(status: string) {
    //     switch (status) {
    //         case 'INSTOCK':
    //             return 'success';
    //         case 'LOWSTOCK':
    //             return 'warning';
    //         case 'OUTOFSTOCK':
    //             return 'danger';
    //     }
    // }
}
