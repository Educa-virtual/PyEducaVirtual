import { Component, OnInit } from '@angular/core'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { CalendarModule } from 'primeng/calendar'
import { InputTextModule } from 'primeng/inputtext'
import { FloatLabelModule } from 'primeng/floatlabel'
import { InputGroupModule } from 'primeng/inputgroup'
import { InputGroupAddonModule } from 'primeng/inputgroupaddon'
import { Router } from '@angular/router'

@Component({
    selector: 'app-datos-personales',
    standalone: true,
    imports: [
        ContainerPageComponent,
        TablePrimengComponent,
        CalendarModule,
        InputTextModule,
        FloatLabelModule,
        InputGroupModule,
        InputGroupAddonModule,
    ],
    templateUrl: './datos-personales.component.html',
    styleUrl: './datos-personales.component.scss',
    providers: [],
})
export class DatosPersonalesComponent implements OnInit {
    fechasAcademicas

    constructor(private router: Router) {}
    ngOnInit(): void {
        throw new Error('Method not implemented.')
    }

    actionsContainer = [
        {
            labelTooltip: 'Registrar año escolar',
            text: 'Registrar año escolar',
            icon: 'pi pi-plus',
            accion: 'agregar',
            class: 'p-button-primary',
        },
    ]

    handleActions(row) {
        console.log(row)

        const actions = {
            ver: () => {
                // Lógica para la acción "ver"
                console.log('Viendo')
            },
            editar: () => {
                // Lógica para la acción "editar"
            },
            eliminar: () => {
                // Lógica para la acción "eliminar"
                console.log('Eliminando')
            },
        }

        const action = actions[row.accion]
        if (action) {
            action()
        } else {
            console.log(`Acción desconocida: ${row.action}`)
        }
    }

    actions = [
        {
            labelTooltip: 'Ver',
            icon: 'pi pi-eye',
            accion: 'ver',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
            // isVisible:(fechasAcademicas)=>{
            //     fechasAcademicas
            //     return fechasAcademicas.iEstado === 0
            // }
        },
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-pencil',
            accion: 'editar',
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

    columns = [
        {
            type: 'text',
            width: '5rem',
            field: 'fechaVigente',
            header: 'Año vigente',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'dtCalAcadInicio',
            header: 'Fecha inicio',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'dtCalAcadFin',
            header: 'Fecha fin',
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

    navigateToRegistro() {
        this.router.navigate(['configuracion/configuracion/registro'])
    }

    navigateToResumen() {
        this.router.navigate(['/configuracion/configuracion/registro'])
    }
}
