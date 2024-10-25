import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { ButtonModule } from 'primeng/button'
import { TicketService } from '../../service/ticketservice'
import { Router } from '@angular/router'
import { httpService } from '../../../http/httpService'


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
    resumen
    resumenInformation
    
    constructor(private httpService: httpService, public ticketService: TicketService,
        private router: Router) {}

    nextPage() {
        this.ticketService.registroInformation.stepTurnos = this.resumenInformation;
        this.router.navigate([
            'configuracion/configuracion/registro/periodos',
        ])
    }

    prevPage() {
        this.router.navigate(['configuracion/configuracion/registro/periodosAcademicos'])
    }

    ngOnInit() {
        this.httpService
            .postData('acad/calendarioAcademico/addCalAcademico', {
                json: JSON.stringify({
                    jmod: 'acad',
                    jtable: 'turnos',
                }),
                _opcion: 'getConsulta',
            })
            .subscribe({
                next: (data: any) => {
                    this.resumen = data.data

                    console.log(this.resumen);
                    
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
