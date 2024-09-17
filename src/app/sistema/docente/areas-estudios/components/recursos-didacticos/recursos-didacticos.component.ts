import { Component } from '@angular/core'
import { TablePrimengComponent } from '../../../../../shared/table-primeng/table-primeng.component'
import { FormRecursosDidacticosComponent } from '../form-recursos-didacticos/form-recursos-didacticos.component'
import { ContainerPageComponent } from '../../../../../shared/container-page/container-page.component'

@Component({
    selector: 'app-recursos-didacticos',
    standalone: true,
    imports: [
        TablePrimengComponent,
        FormRecursosDidacticosComponent,
        ContainerPageComponent,
    ],
    templateUrl: './recursos-didacticos.component.html',
    styleUrl: './recursos-didacticos.component.scss',
})
export class RecursosDidacticosComponent {
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
    data = [
        {
            cTipoRecurso: 'Recurso Virtual Asincrono',
            cDescripción: 'Foros',
        },
        {
            cTipoRecurso: 'Recurso Virtual Asincrono',
            cDescripción: 'Correos',
        },
        {
            cTipoRecurso: 'Recurso Virtual Asincrono',
            cDescripción: 'electrónicos',
        },
        {
            cTipoRecurso: 'Recurso Virtual Sincrono',
            cDescripción: 'Wathsapp',
        },
        {
            cTipoRecurso: 'Recurso Virtual Sincrono',
            cDescripción: 'chat',
        },
        {
            cTipoRecurso: 'Recurso Virtual Sincrono',
            cDescripción: 'aula virtual',
        },
    ]
    columns = [
        {
            type: 'text',
            width: '5rem',
            field: 'cTipoRecurso',
            header: 'Tipo de Recurso',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '10rem',
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
