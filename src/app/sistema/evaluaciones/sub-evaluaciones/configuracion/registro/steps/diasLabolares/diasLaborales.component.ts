import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core'
import { TableModule } from 'primeng/table'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { httpService } from '../../../http/httpService'
import { ButtonModule } from 'primeng/button'
import { TicketService } from '../../service/ticketservice'
import { Router } from '@angular/router'

@Component({
    selector: 'app-diasLaborales',
    standalone: true,
    imports: [TableModule, TablePrimengComponent, ButtonModule],
    templateUrl: './diasLaborales.component.html',
    styleUrl: './diasLaborales.component.scss',
})
export class DiasLaboralesComponent implements OnInit, OnChanges {
    dias: {
        iDiaId: string
        iDia: string
        cDiaNombre: string
        cDiaAbreviado: string
    }[]

    diasInformation
    constructor(private httpService: httpService,         public ticketService: TicketService,
        private router: Router) {}

    nextPage() {
        this.ticketService.registroInformation.stepYear = this.diasInformation;
        this.router.navigate([
            'evaluaciones/configuracion/registro/turnos',
        ])
    }


    prevPage() {
        this.router.navigate(['evaluaciones/configuracion/registro/year'])
    }

    ngOnInit() {
        this.httpService
            .postData('administracion/dias', {
                json: JSON.stringify({
                    jmod: 'grl',
                    jtable: 'dias',
                }),
                _opcion: 'getConsulta',
            })
            .subscribe({
                next: (data: any) => {
                    this.dias = data.data

                    console.log(this.dias);
                    
                },
                error: (error) => {
                    console.error('Error fetching dias:', error)
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    actions = [
        {
            labelTooltip: 'Marcar',
            icon: '',
            accion: 'toogleValue',
            type: 'item',
            class: '',
        },
    ]

    columns = [
        {
            type: 'text',
            width: '5rem',
            field: 'iDiaId',
            header: 'Nro',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cDiaAbreviado',
            header: 'Acrónimo',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cDiaNombre',
            header: 'Día',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'actions',
            width: '3rem',
            field: 'actions',
            header: 'Estado',
            text_header: 'center',
            text: 'center',
        },
    ]
    ngOnChanges(changes) {}
}
