import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { Component, Input } from '@angular/core'
import { FormMetodologiaComponent } from '../form-metodologia/form-metodologia.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'

@Component({
    selector: 'app-metodologia',
    standalone: true,
    imports: [
        TablePrimengComponent,
        FormMetodologiaComponent,
        ContainerPageComponent,
    ],
    templateUrl: './metodologia.component.html',
    styleUrl: './metodologia.component.scss',
})
export class MetodologiaComponent {
    @Input() iSilaboId: string
    @Input() tipoMetodologias: []

    showModal: boolean = false
    itemRecursos = []
    option: string

    actionsContainer = [
        {
            labelTooltip: 'Agregar',
            text: 'Agregar',
            icon: 'pi pi-plus',
            accion: 'agregar',
            class: 'p-button-primary',
        },
    ]
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
            type: 'text',
            width: '3rem',
            field: 'cTipoRecurso',
            header: 'Tipo de Recurso',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cDescripción',
            header: 'Descripción',
            text_header: 'center',
            text: 'justify',
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
        const { item } = elemento
        console.log(item)
        console.log(accion)
        switch (accion) {
            case 'agregar':
            case 'actualizar':
                this.showModal = true
                this.itemRecursos = item
                this.option = accion === 'agregar' ? 'Agregar' : 'Actualizar'
                console.log(this.option)
                break
            case 'eliminar':
                //
                break
            case 'close-modal':
                this.showModal = false
                this.itemRecursos = item
                break
            default:
                break
        }
    }
}
