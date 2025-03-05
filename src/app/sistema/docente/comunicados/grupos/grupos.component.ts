import { Component } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { FormsModule } from '@angular/forms'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
@Component({
    selector: 'app-grupos',
    standalone: true,
    imports: [PrimengModule, FormsModule, TablePrimengComponent],
    templateUrl: './grupos.component.html',
    styleUrl: './grupos.component.scss',
})
export class GruposComponent {
    visible = false
    grupo: string
    columnas = [
        {
            type: 'item-checkbox',
            width: '1rem',
            field: 'cItem',
            header: 'Elegir',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'item',
            width: '1rem',
            field: 'cItem',
            header: '#',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'item',
            width: '1rem',
            field: 'cItem',
            header: 'Apellidos y Nombres',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'item',
            width: '1rem',
            field: 'cItem',
            header: 'Numero Telf. del Contacto',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'item',
            width: '1rem',
            field: 'cItem',
            header: 'Direccion Domiciliaria',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'item',
            width: '1rem',
            field: 'cItem',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ]
    data = []
    cities = [
        { grupo: 'Padres', codigo: 1 },
        { grupo: 'Docentes', codigo: 2 },
        { grupo: 'Estudiantes', codigo: 3 },
        // { grupo: 'Personal Ugel', codigo: 4 },
    ]

    mostrarMdoal() {
        this.visible = true
    }
}
