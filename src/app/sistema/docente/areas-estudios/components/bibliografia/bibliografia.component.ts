import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { Component } from '@angular/core'
import { FormBibliografiaComponent } from '../form-bibliografia/form-bibliografia.component'

@Component({
    selector: 'app-bibliografia',
    standalone: true,
    imports: [
        ContainerPageComponent,
        TablePrimengComponent,
        FormBibliografiaComponent,
    ],
    templateUrl: './bibliografia.component.html',
    styleUrl: './bibliografia.component.scss',
})
export class BibliografiaComponent {
    showModal: boolean = false
    itemBibliografia = []
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
            cTitulo: 'Diseño de Interfaces en Aplicaciones Moviles',
            cAutor: 'Sebastian Serna, Cesar Pardo',
            cEditorial: 'Ra-Ma',
            cAnio: '2016',
        },
        {
            cTitulo: 'Diseñando apps para móviles',
            cAutor: 'Javier Cuello y José Vittone',
            cEditorial: 'TugaMovil',
            cAnio: '2013',
        },
        {
            cTitulo: 'Desarrollo de Aplicaciones Multiplataforma',
            cAutor: 'Eduardo Revilla Vaquero',
            cEditorial: 'ENI',
            cAnio: '2019',
        },
        {
            cTitulo: 'Begining PhP and MySQL ',
            cAutor: 'Gilmore, W. Jaso',
            cEditorial: 'Apress',
            cAnio: '2010',
        },
        {
            cTitulo: 'Aprenda Desarrollo de Bases de datos Web Ya',
            cAutor: 'Jim Buyens',
            cEditorial: 'McGraw Hill',
            cAnio: '2000',
        },
    ]
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
            width: '10rem',
            field: 'cTitulo',
            header: 'Título de la obra',
            text_header: 'center',
            text: 'justify',
        },
        {
            type: 'text',
            width: '7rem',
            field: 'cAutor',
            header: 'Autor',
            text_header: 'center',
            text: 'justify',
        },
        {
            type: 'text',
            width: '4rem',
            field: 'cEditorial',
            header: 'Editorial',
            text_header: 'center',
            text: 'justify',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'cAnio',
            header: 'Año de Edición',
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
        const { item } = elemento
        console.log(item)
        console.log(accion)
        switch (accion) {
            case 'agregar':
            case 'actualizar':
                this.showModal = true
                this.itemBibliografia = item
                this.option = accion === 'agregar' ? 'Agregar' : 'Actualizar'
                console.log(this.option)
                break
            case 'eliminar':
                //
                break
            case 'close-modal':
                this.showModal = false
                this.itemBibliografia = item
                break
            default:
                break
        }
    }
}
