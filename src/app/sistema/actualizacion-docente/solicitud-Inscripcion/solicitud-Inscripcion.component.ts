import { PrimengModule } from '@/app/primeng.module'
import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component'
import { Component } from '@angular/core'
import {
    IColumn,
    IActionTable,
} from '@/app/shared/table-primeng/table-primeng.component'
import { TabsPrimengComponent } from '@/app/shared/tabs-primeng/tabs-primeng.component'
import { CardCapacitacionesComponent } from './card-capacitaciones/card-capacitaciones.component'

@Component({
    selector: 'app-solicitud-inscripcion',
    standalone: true,
    templateUrl: './solicitud-Inscripcion.component.html',
    styleUrls: ['./solicitud-Inscripcion.component.scss'],
    imports: [
        PrimengModule,
        ToolbarPrimengComponent,
        TabsPrimengComponent,
        CardCapacitacionesComponent,
    ],
})
export class SolicitudInscripcionComponent {
    activeIndex: number = 0
    cursoSeleccionado
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

    data = [
        {
            iCapacitacionId:
                'BL5XB8NQmabwA3zDlgW710Jn0bPxMYeRVory4jKZvpGEkq2d90',
            iTipoCapId: '2jdp2ERVe0QYG8agql5J1ybONbOMzW93KvLNZ7okAmD4xXBrwe',
            iNivelPedId: '2jdp2ERVe0QYG8agql5J1ybONbOMzW93KvLNZ7okAmD4xXBrwe',
            iTipoPubId: '2jdp2ERVe0QYG8agql5J1ybONbOMzW93KvLNZ7okAmD4xXBrwe',
            cCapTitulo: 'Título 1',
            cCapDescripcion: 'Descripción 1',
            iTotalHrs: '5',
            dFechaInicio: '2025-05-05',
            dFechaFin: '2025-05-05',
            iInstId: '2jdp2ERVe0QYG8agql5J1ybONbOMzW93KvLNZ7okAmD4xXBrwe',
            iCosto: '1',
            nCosto: '1.00',
            iImageAleatorio: '1',
            cImagenUrl:
                '[{"id":2,"name":"Miss Lesson","url":"/images/recursos/miss-lesson-animate.svg"}]',
            iEstado: '1',
            cTipoCapNombre: 'Diplomando',
            cNivelPedNombre: 'Educación Inicial',
            cTipoPubNombre: 'General',
            cPersNombre: 'MITWAR KENYO',
            cPersPaterno: 'HUACAN',
            cPersMaterno: 'QUISPE',
        },
        {
            iCapacitacionId:
                'ZMDNgoXjdk9Qz0ZyWKra3B1PQ3nRG54pY2lwq78vEAeVbmLJx1',
            iTipoCapId: '2jdp2ERVe0QYG8agql5J1ybONbOMzW93KvLNZ7okAmD4xXBrwe',
            iNivelPedId: '2jdp2ERVe0QYG8agql5J1ybONbOMzW93KvLNZ7okAmD4xXBrwe',
            iTipoPubId: '2jdp2ERVe0QYG8agql5J1ybONbOMzW93KvLNZ7okAmD4xXBrwe',
            cCapTitulo: 'Título 1',
            cCapDescripcion: 'Descripción 1',
            iTotalHrs: '5',
            dFechaInicio: '2025-05-05',
            dFechaFin: '2025-05-05',
            iInstId: '2jdp2ERVe0QYG8agql5J1ybONbOMzW93KvLNZ7okAmD4xXBrwe',
            iCosto: '1',
            nCosto: '1.00',
            iImageAleatorio: '1',
            cImagenUrl:
                '[{"id":2,"name":"Miss Lesson","url":"/images/recursos/miss-lesson-animate.svg"}]',
            iEstado: '1',
            cTipoCapNombre: 'Diplomando',
            cNivelPedNombre: 'Educación Inicial',
            cTipoPubNombre: 'General',
            cPersNombre: 'MITWAR KENYO',
            cPersPaterno: 'HUACAN',
            cPersMaterno: 'QUISPE',
        },
        {
            iCapacitacionId:
                'G1NzYXA5kg23LdaMq480mDQPj8nlGJrBV7Kb9yeowpWxvjRZER',
            iTipoCapId: 'zR0lYAQJLx4e3jZ2wW7GrMN6obPomB89bqz5EdavkXpDy1KgVV',
            iNivelPedId: '37A3j9KEx1GNyJV82MqekXwn3APbY4LvRpr0QdaWzlmg5DZBoZ',
            iTipoPubId: '2jdp2ERVe0QYG8agql5J1ybONbOMzW93KvLNZ7okAmD4xXBrwe',
            cCapTitulo: 'WebFlow University: Ultimate Web Design Course',
            cCapDescripcion:
                'El Ultimate Web Design Course es un curso gratuito ofrecido por la universidad de WebFlow, una plataforma de aprendizaje en línea alojada y desarrollada por el CMS y la herramienta de diseño WebFlow.',
            iTotalHrs: '129',
            dFechaInicio: '2025-05-14',
            dFechaFin: '2025-05-28',
            iInstId: '2jdp2ERVe0QYG8agql5J1ybONbOMzW93KvLNZ7okAmD4xXBrwe',
            iCosto: '1',
            nCosto: '120.00',
            iImageAleatorio: '1',
            cImagenUrl:
                '{"id":3,"name":"Miss Student","url":"http://127.0.0.1:8000/images/recursos/miss-student-animate.svg"}',
            iEstado: '1',
            cTipoCapNombre: 'Capacitación',
            cNivelPedNombre: 'Educación Secundaria',
            cTipoPubNombre: 'General',
            cPersNombre: 'MITWAR KENYO',
            cPersPaterno: 'HUACAN',
            cPersMaterno: 'QUISPE',
        },
    ]
}
