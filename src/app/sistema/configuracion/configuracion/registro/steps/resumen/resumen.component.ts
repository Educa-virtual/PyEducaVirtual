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

        this.ticketService.getCalendar(
            {
                iSedeId: iSedeId,
                iYAcadId: iYAcadId,
                iCalAcadId: iCalAcadId,
            },
            []
        ).subscribe({
            next: (data) => {
                console.log('Data recibida:', data.data[0]);

                this.resumenInformation.calendar = data.data[0]
            },
            error: (error) => {
                console.error('Error en la solicitud:', error);
            },
            complete: () => {
                console.log('Solicitud completada');
            }
        });

        this.ticketService.getDiasLaborales({ iCalAcadId: iCalAcadId }, true).subscribe({
            next: (data) => {
                console.log('Datos de días laborales:', JSON.parse(data.data[0]['calDiasDatos']));

                this.resumenInformation.diasLaborales = JSON.parse(data.data[0]['calDiasDatos']).map((dia) => ({
                    cDiaNombre: this.ticketService.capitalize(dia.cDiaNombre)
                }))
            },
            error: (error) => {
                console.error('Error en la solicitud:', error);
            },
            complete: () => {
                console.log('Solicitud completada');
            }
        });
        
    
        this.ticketService.getFormasAtencion({ iCalAcadId: iCalAcadId }, true).subscribe({
            next: (data) => {
                console.log('Datos de formas de atención:', data.data);

                this.resumenInformation.formasAtencion = data.data.map((turno, index) => ({
                    index: index + 1,
                    cTurnoNombre: turno.cTurnoNombre,
                    cModalServNombre: this.ticketService.capitalize(turno.cModalServNombre),
                    dtAperTurnoInicio: this.ticketService.toVisualFechasFormat(turno.dtAperTurnoInicio, 'hh:mm'),
                    dtAperTurnoFin: this.ticketService.toVisualFechasFormat(turno.dtAperTurnoFin, 'hh:mm')
                }))
            },
            error: (error) => {
                console.error('Error en la solicitud:', error);
            },
            complete: () => {
                console.log('Solicitud completada');
            }
        });
        
        this.ticketService.getPeriodosAcademicos({ iCalAcadId: iCalAcadId }, true).subscribe({
            next: (data) => {
                console.log('Datos de periodos académicos:', JSON.parse(data.data[0]["periodo"]));

                this.resumenInformation.periodosAcademicos = JSON.parse(data.data[0]["periodo"]).map((periodo, index) => ({
                    index: index + 1,
                    dtPeriodoEvalAperInicio: this.ticketService.toVisualFechasFormat(periodo.dtPeriodoEvalAperInicio, 'DD/MM/YYYY'),
                    dtPeriodoEvalAperFin: this.ticketService.toVisualFechasFormat(periodo.dtPeriodoEvalAperFin, 'DD/MM/YYYY'),

                }))
            },
            error: (error) => {
                console.error('Error en la solicitud:', error);
            },
            complete: () => {
                console.log('Solicitud completada');
            }
        });
        
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
