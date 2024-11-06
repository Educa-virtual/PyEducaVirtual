import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'

import { StepsModule } from 'primeng/steps'
import { ConfirmationService, MessageService } from 'primeng/api'
import { StepConfirmationService } from '@/app/servicios/confirm.service'
import { Router } from '@angular/router'
import { ToastModule } from 'primeng/toast'

@Component({
    selector: 'app-personal',
    standalone: true,
    imports: [
        ContainerPageComponent,
        TablePrimengComponent,
        StepsModule,
        ToastModule,
    ],
    templateUrl: './personal.component.html',
    styleUrl: './personal.component.scss',
    providers: [StepConfirmationService, ConfirmationService, MessageService],
})
export class PersonalComponent implements OnInit, OnChanges, OnDestroy {

    personalInformation

    constructor(private router: Router) {}
    ngOnInit() {}

    handleActions(row) {
        console.log(row)

        const actions = {
            ver: () => {
                // Lógica para la acción "ver"
            },
            editar: () => {
                // Lógica para la acción "editar"

            },
            eliminar: () => {
                // Lógica para la acción "eliminar"
            },
        }


        const action = actions[row.accion]
        if (action) {
            action()
        } else {
            console.log(`Acción desconocida: ${row.action}`)
        }
    }


    actionsContainer = [
        {
            labelTooltip: 'Agregar personal',
            text: 'Registrar año escolar',
            icon: 'pi pi-plus',
            accion: 'agregar',
            class: 'p-button-primary',
        },
    ]

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
            header: 'Documento de identidad',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'dtCalAcadInicio',
            header: 'Apellidos y nombres',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'dtCalAcadFin',
            header: 'Cargo',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'dtCalAcadFin',
            header: 'Cargo',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'dtCalAcadFin',
            header: 'Cargo',
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

    navigateToYears(){}

    ngOnChanges(changes) {}

    ngOnDestroy() {}
}
