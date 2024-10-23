import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { httpService } from '../../../http/httpService'
import { ButtonModule } from 'primeng/button'
import { TicketService } from '../../service/ticketservice'
import { Router } from '@angular/router'


@Component({
    selector: 'app-turnos',
    standalone: true,
    imports: [
        TablePrimengComponent,
        ButtonModule
    ],
    templateUrl: './turnos.component.html',
    styleUrl: './turnos.component.scss',
})
export class TurnosComponent implements OnInit, OnChanges {

    turnos: {
        iTurnoId: string
        cTurnoNombre: string
    }[]

    turnosInformation
    constructor(private httpService: httpService,         public ticketService: TicketService,
        private router: Router) {}

    nextPage() {
        this.ticketService.registroInformation.stepTurnos = this.turnosInformation;
        this.router.navigate([
            'evaluaciones/configuracion/registro/modalidades',
        ])
    }

    prevPage() {
        this.router.navigate(['evaluaciones/configuracion/registro/diasLaborales'])
    }

    ngOnInit() {
        this.httpService
            .postData('administracion/dias', {
                json: JSON.stringify({
                    jmod: 'acad',
                    jtable: 'turnos',
                }),
                _opcion: 'getConsulta',
            })
            .subscribe({
                next: (data: any) => {
                    this.turnos = data.data

                    console.log(this.turnos);
                    
                },
                error: (error) => {
                    console.error('Error fetching turnos:', error)
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    actions = [
        {
            labelTooltip: 'Ver',
            icon: '',
            accion: 'checkbox',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
        },
    ]

    columns = [
        {
            type: 'text',
            width: '5rem',
            field: 'iTurnoId',
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
            type: 'actions',
            width: '3rem',
            field: 'actions',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ]

    ngOnChanges(changes) {}
}
