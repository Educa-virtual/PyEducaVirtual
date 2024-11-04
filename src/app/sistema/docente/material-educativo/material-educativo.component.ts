import { PrimengModule } from '@/app/primeng.module'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { Component, Input } from '@angular/core'
import { Message } from 'primeng/api'
import { FormMaterialEducativoComponent } from './components/form-material-educativo/form-material-educativo.component'
export type Layout = 'list' | 'grid'
@Component({
    selector: 'app-material-educativo',
    standalone: true,
    imports: [
        PrimengModule,
        TablePrimengComponent,
        FormMaterialEducativoComponent,
    ],
    templateUrl: './material-educativo.component.html',
    styleUrl: './material-educativo.component.scss',
})
export class MaterialEducativoComponent {
    @Input() cCursoNombre: string
    mensaje: Message[] = [
        {
            severity: 'info',
            detail: 'En esta sección podrá visualizar sus materiales educativos',
        },
    ]
    options = ['list']
    public layout: Layout = 'list'
    date = new Date()
    showModal: boolean = false

    actions = [
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-pencil',
            accion: 'actualizar',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
        {
            labelTooltip: 'Eliminar',
            icon: 'pi pi-trash',
            accion: 'eliminar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
    ]
    data = []
    columns = [
        {
            type: 'item',
            width: '1rem',
            field: 'cItem',
            header: 'Nº',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '15rem',
            field: 'cTNombre',
            header: 'Nombre del Material Educativo',
            text_header: 'left',
            text: 'justify',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cTipo',
            header: 'Tipo de Material Educativo',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'actions',
            width: '3rem',
            field: 'actions',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ]

    accionBtnItem(elemento): void {
        const { accion } = elemento
        //const { item } = elemento
        switch (accion) {
            case 'close-modal':
                this.showModal = false

                break
        }
    }
}
