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
    selector: 'app-estado-archivos',
    standalone: true,
    imports: [
        Button,
        CardModule,
        DividerModule,
        TableModule,
        DropdownModule,
        FormsModule,
        TableModule,
    ],

    templateUrl: './estado-archivos.component.html',
    styleUrl: './estado-archivos.component.scss',
})
export class EstadoArchivosComponent {
    cities: City[] | undefined

    selectedCity: City | undefined

    ngOnInit() {
        this.cities = [{ name: 'Primaria' }, { name: 'Secundaria' }]
    }

    products = [
        {
            code: '1',
            name: 'Product 1',
            category: 'Electronics',
            quantity: 100,
        },
        { code: '2', name: 'Product 2', category: 'Apparel', quantity: 50 },
        { code: '3', name: 'Product 2', category: 'Apparel', quantity: 50 },
        { code: '4', name: 'Product 2', category: 'Apparel', quantity: 50 },
    ]
    leyendas = [
        {
            name: 'Total:',
            category: 'Total de IIEEs.',
        },
        {
            name: 'IEs. No Subieron:',
            category: 'Cant. de IIEEs que NO SUBIERON ningún archivo excel',
        },
        {
            name: 'IEs. Subieron:',
            category:
                'Cant de IIEEs. que subieron POR LO MENOS UN archivo Excel (Considerando que no toas las IIEEs abrieron todos los grados)',
        },
        {
            name: 'Validados:',
            category: 'Cantidad de Archivos Excel VALIDADOS por la UGEL.',
        },
    ]
}
