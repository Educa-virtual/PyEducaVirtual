import { PrimengModule } from '@/app/primeng.module'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { Component } from '@angular/core'
import { Router } from '@angular/router'

@Component({
    selector: 'app-asistencia',
    standalone: true,
    imports: [ContainerPageComponent, PrimengModule, TablePrimengComponent],
    templateUrl: './asistencia.component.html',
    styleUrl: './asistencia.component.scss',
})
export class AsistenciaComponent {
    constructor(private router: Router) {}
    columnsAsistencia = [
        {
            type: 'item',
            width: '2rem',
            field: 'id',
            header: 'N°',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cCurso',
            header: 'Curso',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'cTurno',
            header: 'Turno',
            text_header: 'center',
            text: 'justify',
        },
        {
            type: 'text',
            width: '4rem',
            field: 'cFasePeriodo',
            header: 'Fase/Periodo',
            text_header: 'center',
            text: 'justify',
        },
        {
            type: 'text',
            width: '4rem',
            field: 'cCiclo',
            header: 'Ciclo',
            text_header: 'center',
            text: 'justify',
        },
        {
            type: 'text',
            width: '4rem',
            field: 'cGrado',
            header: 'Grado',
            text_header: 'center',
            text: 'justify',
        },
        {
            type: 'text',
            width: '4rem',
            field: 'cSeccion',
            header: 'Sección',
            text_header: 'center',
            text: 'justify',
        },
        {
            type: 'text',
            width: '4rem',
            field: 'cMes',
            header: 'Mes',
            text_header: 'center',
            text: 'justify',
        },
        {
            type: 'text',
            width: '4rem',
            field: 'cEstado',
            header: 'Estado',
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

    actions = [
        {
            labelTooltip: 'Ingresar',
            icon: 'pi pi-caret-right',
            accion: 'ingresar',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
        },
        {
            labelTooltip: 'Ver',
            icon: 'pi pi-eye',
            accion: 'ver_silabo',
            type: 'item',
            class: 'p-button-rounded p-button-success p-button-text',
        },
    ]

    data = [
        {
            cCurso: 'Matemáticas',
            cTurno: 'Mañana',
            cFasePeriodo: 'Fase Regular',
            cCiclo: 'Ciclo II',
            cGrado: 'Cuarto',
            cSeccion: 'B',
            cMes: 'Enero',
            cEstado: '',
        },
    ]

    accionBtnItem(elemento): void {
        const { accion } = elemento
        const { item } = elemento
        console.log(item)
        console.log(accion)
        switch (accion) {
            case 'ingresar':
                this.router.navigate(['./docente/detalle-asistencia'])
                break
            default:
                break
        }
    }
}
