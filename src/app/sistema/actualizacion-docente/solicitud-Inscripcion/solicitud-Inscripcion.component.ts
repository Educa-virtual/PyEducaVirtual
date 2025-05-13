import { PrimengModule } from '@/app/primeng.module'
import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component'
import { Component } from '@angular/core'
import {
    TablePrimengComponent,
    IColumn,
    IActionTable,
} from '@/app/shared/table-primeng/table-primeng.component'
import { AperturaCursoComponent } from '../apertura-curso/apertura-curso.component'
import { TabsPrimengComponent } from '@/app/shared/tabs-primeng/tabs-primeng.component'

@Component({
    selector: 'app-solicitud-inscripcion',
    standalone: true,
    templateUrl: './solicitud-Inscripcion.component.html',
    styleUrls: ['./solicitud-Inscripcion.component.scss'],
    imports: [
        PrimengModule,
        ToolbarPrimengComponent,
        TablePrimengComponent,
        AperturaCursoComponent,
        TabsPrimengComponent,
    ],
})
export class SolicitudInscripcionComponent {
    activeIndex: number = 0

    tabs = [
        {
            title: 'Apertura de Curso',
            icon: 'pi pi-book',
            tab: 'contenido',
        },
        {
            title: 'Solicitud de Inscripción',
            icon: 'pi pi-home',
            tab: 'inicio',
        },
    ]

    updateTab(tab): void {
        this.activeIndex = tab
    }

    public columnasTabla: IColumn[] = [
        {
            type: 'item',
            width: '1rem',
            field: 'index',
            header: 'Nro',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'nombreApellido',
            header: 'Apellido y Nombre',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '1rem',
            field: 'docente',
            header: '¿Es Docente?',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'dni',
            header: 'DNI/CE',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'telefono',
            header: 'Celular',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'modalidad',
            header: 'Modalidad',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'actions',
            width: '1rem',
            field: '',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ]
    public accionesTabla: IActionTable[] = [
        {
            labelTooltip: 'Agregar Conclusión descriptiva',
            icon: 'pi pi-check',
            accion: 'agregarConclusion',
            type: 'item',
            class: 'p-button-rounded p-button-success p-button-text',
        },
        {
            labelTooltip: 'Agregar Conclusión descriptiva',
            icon: 'pi pi-times',
            accion: 'agregarConclusion',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
        {
            labelTooltip: 'Agregar Conclusión descriptiva',
            icon: 'pi pi-file-pdf',
            accion: 'agregarConclusion',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
    ]
}
