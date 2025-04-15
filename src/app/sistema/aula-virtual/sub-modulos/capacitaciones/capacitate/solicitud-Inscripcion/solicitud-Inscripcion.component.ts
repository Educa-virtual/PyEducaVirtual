import { PrimengModule } from '@/app/primeng.module'
import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component'
import { BadgeModule } from 'primeng/badge'
import { TabViewModule } from 'primeng/tabview'
import { Component, OnInit } from '@angular/core'
import {
    TablePrimengComponent,
    IColumn,
    IActionTable,
} from '@/app/shared/table-primeng/table-primeng.component'
import { AperturaCursoComponent } from '../apertura-curso/apertura-curso.component'
import { MenuItem } from 'primeng/api'

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
        BadgeModule,
        TabViewModule,
    ],
})
export class SolicitudInscripcionComponent implements OnInit {
    activeIndex: number = 0
    breadCrumbItems: MenuItem[]
    breadCrumbHome: MenuItem
    alumnos = [
        {
            nombreApellido: 'Flores Caguana Miguel',
            docente: 'SI',
            dni: '76543621',
            telefono: '943567892',
            modalidad: 'Virtual',
        },
        {
            nombreApellido: 'Flores Caguana Maria',
            docente: 'NO',
            dni: '76543634',
            telefono: '943567692',
            modalidad: 'Presencial',
        },
    ]
    constructor() {}

    ngOnInit() {
        this.breadCrumbItems = [
            { label: 'Aula virtual' },
            { label: 'Capacitaciones' },
        ]
        this.breadCrumbHome = { icon: 'pi pi-home', routerLink: '/' }
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
