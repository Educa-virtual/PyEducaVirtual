import { PrimengModule } from '@/app/primeng.module';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-imagen-select',
  standalone: true,
  templateUrl: './imagen-select.component.html',
  styleUrls: ['./imagen-select.component.scss'],
  imports: [PrimengModule],
})
export class ImagenSelectComponent implements OnInit {
  // para las imagenes seleccionadas al padre
  @Output() imagenSeleccionada = new EventEmitter<any>();

  products = [
    {
      id: '1',
      name: 'Capaciaciones',
      image: 'assets/demo/images/matemit/800_imagen.jpg',
      description: 'Product Description',
      price: 65,
      quantity: 1,
      status: 'INSTOCK',
    },
    {
      id: '2',
      name: 'Especilizaciones',
      image: 'assets/demo/images/product/black-watch.jpg',
      description: 'Product Description',
      price: 72,
      quantity: 1,
      status: 'INSTOCK',
    },
    {
      id: '3',
      name: 'Diplamados',
      image:
        'http://www.thebusinessofsports.com/wp-content/uploads/2010/10/facebook-icon-200x200.png',
      description: 'Product Description',
      price: 79,
      quantity: 1,
      status: 'INSTOCK',
    },
    {
      id: '4',
      name: 'Especilizaciones',
      image:
        'http://townandcountryremovals.com/wp-content/uploads/2013/10/firefox-logo-200x200.png',
      description: 'Product Description',
      price: 72,
      quantity: 1,
      status: 'INSTOCK',
    },
    // {
    //     name: 'Diplamados',
    //     image: 'http://www.thebusinessofsports.com/wp-content/uploads/2010/10/facebook-icon-200x200.png',
    //     description: 'Product Description',
    //     price: 79,
    //     quantity: 1,
    //     status: 'INSTOCK',
    // },
  ];

  responsiveOptions: any[] | undefined;

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
    ];
  }
  selectedProducts: any[] = [];

  isSelected(product: any): boolean {
    return this.selectedProducts.some(p => p.id === product.id);
  }

  toggleSelection(product: any) {
    const index = this.selectedProducts.findIndex(p => p.id === product.id);
    if (index > -1) {
      // Ya estaba seleccionado, lo quitamos
      this.selectedProducts.splice(index, 1);
    } else {
      // Lo agregamos
      this.selectedProducts.push(product);
    }
  }
  guardarImagenes() {
    const data = this.selectedProducts.map(product => ({
      id: product.id,
      name: product.name,
      image: product.image,
      inventoryStatus: product.inventoryStatus,
    }));

    console.log(data);
    //   console.log('Productos seleccionados para guardar:', JSON.stringify(data));

    // Aquí podrías hacer un POST al backend si lo necesitas:
    // this.miServicio.enviarSeleccion(dataToSend).subscribe(...)

    this.imagenSeleccionada.emit(data);
  }

  //     getSeverity(status: string) {
  //         switch (status) {
  //             case 'INSTOCK':
  //                 return 'success';
  //             case 'LOWSTOCK':
  //                 return 'warning';
  //             case 'OUTOFSTOCK':
  //                 return 'danger';
  //             default:
  //                 throw new Error("Estado no reconocido");
  //         }
  //     }
}
