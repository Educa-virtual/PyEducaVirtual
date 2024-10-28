import { Component } from '@angular/core'
import { FullCalendarComponent } from '@/app/shared/full-calendar/full-calendar.component'
import { PrimengModule } from '@/app/primeng.module'
import { Message } from 'primeng/api'
import { TablePrimengComponent } from '../../../shared/table-primeng/table-primeng.component'
import { FormActividadesNoLectivasComponent } from './components/form-actividades-no-lectivas/form-actividades-no-lectivas.component'
export type Layout = 'list' | 'grid'
@Component({
    selector: 'app-actividades-no-lectivas',
    standalone: true,
    imports: [
        FullCalendarComponent,
        PrimengModule,
        TablePrimengComponent,
        FormActividadesNoLectivasComponent,
    ],
    templateUrl: './actividades-no-lectivas.component.html',
    styleUrl: './actividades-no-lectivas.component.scss',
})
export class ActividadesNoLectivasComponent {
    mensaje: Message[] = [
        {
            severity: 'info',
            detail: 'En esta sección podrá visualizar sus actividades no lectivas como también gestionar y subir evidencias, con un resumen en el calenario',
        },
    ]
    options = ['list', 'grid']
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
            width: '8rem',
            field: 'cTNombre',
            header: 'Nombre de la Actividad',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'cTNombre2',
            header: 'Descripción',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cTNombre3',
            header: 'Tipo de Actividad',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cFecha',
            header: 'Fecha y Duración',
            text_header: 'center',
            text: 'justify',
        },
        {
            type: 'text',
            width: '6rem',
            field: 'cTNombre4',
            header: 'Lugar',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '6rem',
            field: 'cTNombre5',
            header: 'Evidencias',
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

    fechas = [
        {
            nombre: 'Actividades No Lectivas',
            cantidad: 5,
            color: 'var(--blue-400)',
        },
        {
            nombre: 'Feriados Nacionales',
            cantidad: 5,
            color: 'var(--red-400)',
        },
        {
            nombre: 'Feriados Recuperables',
            cantidad: 5,
            color: 'var(--yellow-400)',
        },
        {
            nombre: 'Fechas de Recuperacion',
            cantidad: 5,
            color: 'var(--green-400)',
        },
        {
            nombre: 'Fechas Especiales I.E.',
            cantidad: 5,
            color: 'var(--bluegray-400)',
        },
        {
            nombre: 'Dias de Gestion',
            cantidad: 5,
            color: 'var(--gray-400)',
        },
        {
            nombre: 'Mis Actividades',
            cantidad: 5,
            color: 'var(--teal-400)',
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
