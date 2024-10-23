import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core'

import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'

import { httpService } from '../../../http/httpService'
import { ButtonModule } from 'primeng/button'
import { TicketService } from '../../service/ticketservice'
import { Router } from '@angular/router'

@Component({
    selector: 'app-modalidades',
    standalone: true,
    imports: [ButtonModule, TablePrimengComponent],
    templateUrl: './modalidades.component.html',
    styleUrl: './modalidades.component.scss',
})
export class ModalidadesComponent implements OnInit, OnChanges {
    modalidades: {
        iModalServId: string
        cModalServNombre: string
    }[]

    modalidadesInformation
    constructor(
        private httpService: httpService,
        public ticketService: TicketService,
        private router: Router
    ) {}

    nextPage() {
        this.ticketService.registroInformation.stepModalidades =
            this.modalidadesInformation
        this.router.navigate([
            'evaluaciones/configuracion/registro/periodosAcademicos',
        ])
    }

    prevPage() {
        this.router.navigate(['evaluaciones/configuracion/registro/turnos'])
    }

    ngOnInit() {
        this.httpService
            .postData('administracion/dias', {
                json: JSON.stringify({
                    jmod: 'acad',
                    jtable: 'modalidad_servicios',
                }),
                _opcion: 'getConsulta',
            })
            .subscribe({
                next: (data: any) => {
                    this.modalidades = data.data

                    console.log(this.modalidades)
                },
                error: (error) => {
                    console.error('Error fetching modalidades:', error)
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
            field: 'iModalServId',
            header: 'Nro',
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
