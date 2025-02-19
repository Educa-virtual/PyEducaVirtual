import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { Component } from '@angular/core'
import { ContainerPageComponent } from '../../../../shared/container-page/container-page.component'
import { BtnLoadingComponent } from '../../../../shared/btn-loading/btn-loading.component'
import { Router } from '@angular/router'
/**
 * Componente que muestra el detalle de asistencia de los docentes.
 */
@Component({
    selector: 'app-detalle-asistencia',
    standalone: true,
    imports: [
        TablePrimengComponent,
        ContainerPageComponent,
        BtnLoadingComponent,
    ],
    templateUrl: './detalle-asistencia.component.html',
    styleUrl: './detalle-asistencia.component.scss',
})
export class DetalleAsistenciaComponent {
    /**
     * Configuración de las columnas para la tabla de asistencia.
     */
    constructor(private router: Router) {}
    columnsAsistencia = [
        {
            type: 'item',
            width: '2rem',
            field: 'id',
            header: 'Orden',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'cNombres',
            header: 'Nombres y Apellidos',
            text_header: 'center',
            text: 'justify',
        },
        // Columnas dinámicas para los días de asistencia (del 1 al 19)
        {
            type: 'text',
            width: '1rem',
            field: 'cDia1',
            header: '1',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '1rem',
            field: 'cDia2',
            header: '2',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '1rem',
            field: 'cDia3',
            header: '3',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '1rem',
            field: 'cDia4',
            header: '4',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '1rem',
            field: 'cDia5',
            header: '5',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '1rem',
            field: 'cDia6',
            header: '6',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '1rem',
            field: 'cDia7',
            header: '7',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '1rem',
            field: 'cDia8',
            header: '8',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '1rem',
            field: 'cDia9',
            header: '9',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '1rem',
            field: 'cDia10',
            header: '10',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '1rem',
            field: 'cDia11',
            header: '11',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '1rem',
            field: 'cDia12',
            header: '12',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '1rem',
            field: 'cDia13',
            header: '13',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '1rem',
            field: 'cDia14',
            header: '14',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '1rem',
            field: 'cDia15',
            header: '15',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '1rem',
            field: 'cDia16',
            header: '16',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '1rem',
            field: 'cDia17',
            header: '17',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '1rem',
            field: 'cDia18',
            header: '18',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '1rem',
            field: 'cDia19',
            header: '19',
            text_header: 'center',
            text: 'center',
        },
    ]
    /**
     * Datos de asistencia de los docentes.
     */
    data = [
        {
            cNombres: 'Jhoand Velasquez Ticona',
            cDia1: 'J',
            cDia2: 'X',
            cDia3: 'X',
            cDia4: 'I',
            cDia5: 'X',
            cDia6: 'P',
            cDia7: 'P',
            cDia8: 'P',
            cDia9: 'X',
            cDia10: 'X',
            cDia11: 'X',
            cDia12: 'X',
            cDia13: 'X',
            cDia14: 'P',
            cDia15: 'X',
            cDia16: 'X',
            cDia17: 'X',
            cDia18: 'X',
            cDia19: 'P',
        },
        {
            cNombres: 'Luis Figueroa Marca',
            cDia1: 'I',
            cDia2: 'P',
            cDia3: 'X',
            cDia4: 'P',
            cDia5: 'P',
            cDia6: 'X',
            cDia7: 'P',
            cDia8: 'P',
            cDia9: 'X',
            cDia10: 'X',
            cDia11: 'P',
            cDia12: 'X',
            cDia13: 'X',
            cDia14: 'P',
            cDia15: 'X',
            cDia16: 'X',
            cDia17: 'X',
            cDia18: 'X',
            cDia19: 'P',
        },
    ]
    /**
     * Redirige al usuario a la página de asistencia de docentes.
     */
    goBack() {
        this.router.navigate(['./docente/asistencia'])
    }
}
