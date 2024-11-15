import { Component, OnInit } from '@angular/core'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { ButtonModule } from 'primeng/button'
import { TicketService } from '../../service/ticketservice'
import { Router } from '@angular/router'

@Component({
    selector: 'app-resumen',
    standalone: true,
    imports: [TablePrimengComponent, ButtonModule],
    templateUrl: './resumen.component.html',
    styleUrl: './resumen.component.scss',
})
export class ResumenComponent implements OnInit {
    resumenInformation: {
        calendar: any
        diasLaborales: any
        formasAtencion: any
        periodosAcademicos: any
    } = {
        calendar: {},
        diasLaborales: [],
        formasAtencion: [],
        periodosAcademicos: [],
    }

    faseRegular

    faseRecuperacion

    constructor(
        public ticketService: TicketService,
        private router: Router
    ) {}

    nextPage() {
        this.router.navigate([
            'configuracion/configuracion/registro/periodos-academicos',
        ])
    }

    prevPage() {
        this.router.navigate([
            'configuracion/configuracion/registro/periodos-academicos',
        ])
    }

    ngOnInit() {
        if (!this.ticketService.registroInformation) {
            this.router.navigate(['configuracion/configuracion/years'])

            return
        }

        this.resumenInformation.calendar =
            this.ticketService.registroInformation.stepYear

        this.resumenInformation.diasLaborales =
            this.ticketService.registroInformation.stepDiasLaborales
                .map((dia) => dia.cDiaNombre)
                .join(',')

        this.resumenInformation.formasAtencion =
            this.ticketService.registroInformation.stepFormasAtencion.map(
                (formaAtencion, index) => ({
                    index: index + 1,
                    cTurnoNombre: formaAtencion.cTurnoNombre,
                    cModalServNombre: formaAtencion.cModalServNombre,
                    dtAperTurnoInicio: this.ticketService.toVisualFechasFormat(
                        formaAtencion.dtAperTurnoInicio,
                        'hh:mm'
                    ),
                    dtAperTurnoFin: this.ticketService.toVisualFechasFormat(
                        formaAtencion.dtAperTurnoFin,
                        'hh:mm'
                    ),
                })
            )

        this.resumenInformation.periodosAcademicos =
            this.ticketService.registroInformation.stepPeriodosAcademicos.map(
                (periodo, index) => ({
                    index: index + 1,
                    // iPeriodoEvalAperId: 251,
                    // iFaseId: 256,
                    iPeriodoEvalId: periodo.iPeriodoEvalId,
                    iPeriodoEvalCantidad: periodo.iPeriodoEvalCantidad,
                    dtPeriodoEvalAperInicio:
                        this.ticketService.toVisualFechasFormat(
                            periodo.iPeriodoEvalAperId
                        ),
                    dtPeriodoEvalAperFin:
                        this.ticketService.toVisualFechasFormat(
                            periodo.dtPeriodoEvalAperFin
                        ),
                })
            )

        this.faseRegular =
            this.ticketService.registroInformation.stepYear.fases_promocionales[0]
        this.faseRecuperacion =
            this.ticketService.registroInformation.stepYear.fases_promocionales[1]

        console.log(this.resumenInformation)
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
}
