import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { ButtonModule } from 'primeng/button'
import { TicketService } from '../../service/ticketservice'
import { Router } from '@angular/router'
import { httpService } from '../../../http/httpService'
import { Calendar } from '@fullcalendar/core'


@Component({
    selector: 'app-resumen',
    standalone: true,
    imports: [
        TablePrimengComponent,
        ButtonModule,
    ],
    templateUrl: './resumen.component.html',
    styleUrl: './resumen.component.scss',
})
export class ResumenComponent implements OnInit, OnChanges {
    resumenInformation: {
        calendar: any,
        diasLaborales: any,
        formasAtencion: any,
        periodosAcademicos: any,
    } = {
        calendar: {},
        diasLaborales: [],
        formasAtencion: [],
        periodosAcademicos: [],
    }
    
    constructor(private httpService: httpService, public ticketService: TicketService,
        private router: Router) {}

    nextPage() {
        this.router.navigate([
            'configuracion/configuracion/registro/periodos',
        ])
    }

    prevPage() {
        this.router.navigate(['configuracion/configuracion/registro/periodosAcademicos'])
    }

    ngOnInit() {
        const { iSedeId, iYAcadId, iCalAcadId } = this.ticketService.registroInformation.calendar;
        
    }


    columnsFormasAtencion = [
        {
            type: 'text',
            width: '5rem',
            field: 'index',
            header: 'Nro',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cTurnoNombre',
            header: 'Turno',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cModalServNombre',
            header: 'Modalidad',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'dtAperTurnoInicio',
            header: 'Hora inicio',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'dtAperTurnoFin',
            header: 'Hora fin',
            text_header: 'center',
            text: 'center',
        },

    ]


    columnsPeriodosAcademicos = [
        {
            type: 'text',
            width: '5rem',
            field: 'index',
            header: 'Nro',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'iPeriodoEvalNombre',
            header: 'Periodo de evaluación',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'dtPeriodoEvalAperInicio',
            header: 'Fecha inicio',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'dtPeriodoEvalAperFin',
            header: 'Fecha fin',
            text_header: 'center',
            text: 'center',
        },

    ]

    ngOnChanges(changes) {}
}
