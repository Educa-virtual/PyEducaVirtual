import { Component } from '@angular/core'

import { Button } from 'primeng/button'
import { CardModule } from 'primeng/card'
import { DividerModule } from 'primeng/divider'
import { TableModule } from 'primeng/table'
import { DropdownModule } from 'primeng/dropdown'
import { FormsModule } from '@angular/forms'

interface City {
    name: string
}
@Component({
    selector: 'app-distritos-informe',
    standalone: true,
    imports: [
        DividerModule,
        CardModule,
        Button,
        TableModule,
        DropdownModule,
        FormsModule,
    ],
    templateUrl: './distritos-informe.component.html',
    styleUrl: './distritos-informe.component.scss',
})
export class DistritosInformeComponent {
    cities: City[] | undefined

    selectedCity: City | undefined

    // ngOnInit() {
    //     this.cities = [
    //         { name: 'New York' },
    //         { name: 'Rome' },
    //         { name: 'London' },
    //         { name: 'Istanbul' },
    //         { name: 'Paris' },
    //     ]
    // }
    products = [
        {
            code: '1',
            name: 'Product 1',
            category: 'Electronics',
            quantity: 100,
        },
        { code: '2', name: 'Product 2', category: 'Apparel', quantity: 50 },
        { code: '3', name: 'Product 2', category: 'Apparel', quantity: 50 },
    ]
}
