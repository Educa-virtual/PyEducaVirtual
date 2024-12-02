import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
@Component({
    selector: 'app-accesos',
    standalone: true,
    imports: [TablePrimengComponent
    ],
    templateUrl: './accesos.component.html',
    styleUrl: './accesos.component.scss',
    providers: [],
})
export class AccesosComponent implements OnInit, OnChanges, OnDestroy {

    columns = [
        {
            type: 'text',
            width: '1rem',
            field: 'index',
            header: 'N°',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cYearNombre',
            header: 'Nombre',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'dtCalAcadInicio',
            header: 'Usuario',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'dtCalAcadFin',
            header: 'IP cliente',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'dtCalAcadFin',
            header: 'Navegador',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'dtCalAcadFin',
            header: 'Dispositivo',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'dtCalAcadFin',
            header: 'Sistema operativo',
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
    
    constructor(private router: Router)  {}
    ngOnInit() {

    }

    ngOnChanges(changes) {}

    ngOnDestroy() {}
}
