import { Component } from '@angular/core'

import { Button } from 'primeng/button'
import { CardModule } from 'primeng/card'
import { DividerModule } from 'primeng/divider'
import { TableModule } from 'primeng/table'
import { DropdownModule } from 'primeng/dropdown'
import { FormsModule } from '@angular/forms'

// interface Column {
//     field: string
//     header: string
// }
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
export class EstadoArchivosComponent {}
