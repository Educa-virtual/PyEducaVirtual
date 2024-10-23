import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'

import { Output, EventEmitter } from '@angular/core';

import { Router } from '@angular/router';


@Component({
    selector: 'app-years',
    standalone: true,
    imports: [
        ContainerPageComponent,
        TablePrimengComponent,
    ],
    templateUrl: './years.component.html',
    styleUrl: './years.component.scss',
})
export class YearsComponent implements OnInit {
    @Output() emitMode = new EventEmitter();
    constructor(private router: Router) {}

    ngOnInit(): void {
        
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

    actionBtn(mode) {
        this.emitMode.emit(mode)
    }

    actions = [
        {
            labelTooltip: 'Ver',
            icon: 'pi pi-eye',
            accion: 'ver',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
        },
    ]

    data = [
        {
            year: '2024',
            fechaInicio: '11/03/2024',
            fechaFin: '20/12/2024',
        },
        {
            year: '2023',
            fechaInicio: '11/03/2023',
            fechaFin: '20/12/2023',
        },
        {
            year: '2022',
            fechaInicio: '11/03/2022',
            fechaFin: '20/12/2022',
        },
    ]


    columns = [
        {
            type: 'text',
            width: '5rem',
            field: 'year',
            header: 'Año vigente',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'fechaInicio',
            header: 'Fecha inicio',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'fechaFin',
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
        this.router.navigate(['evaluaciones/configuracion/registro']);
    }
    
    navigateToResumen(){
        this.router.navigate(['/evaluaciones/configuracion/registro']);
    }
}
