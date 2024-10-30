import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core'
import { TableModule } from 'primeng/table'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import {
    IColumn,
    IActionTable,
} from '@/app/shared/table-primeng/table-primeng.component'
import { httpService } from '../../../http/httpService'
import { ButtonModule } from 'primeng/button'
import { TicketService } from '../../service/ticketservice'
import { Router } from '@angular/router'
import { ConfirmationService, MessageService } from 'primeng/api'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { ToastModule } from 'primeng/toast'
import { GeneralService } from '@/app/servicios/general.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
@Component({
    selector: 'app-diasLaborales',
    standalone: true,
    imports: [
        TableModule,
        TablePrimengComponent,
        ButtonModule,
        ConfirmDialogModule,
        ToastModule,
    ],
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

    diasSelection: {
        iDiaId: string
        iDia: string
        cDiaNombre: string
        cDiaAbreviado: string
    }[]

    diasInformation
    constructor(
        private httpService: httpService,
        public ticketService: TicketService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private router: Router,
        private generalService: GeneralService,
        private localService: LocalStoreService
    ) {}

    nextPage() {
        this.router.navigate(['configuracion/configuracion/registro/turnos'])
    }

    prevPage() {
        this.router.navigate(['configuracion/configuracion/registro/year'])
    }

    ngOnInit() {
        this.generalService.getDias().subscribe({
            next: (data: any) => {
                this.dias = data.data
            },
            error: (error) => {
                console.error('Error fetching dias:', error)
            },
            complete: () => {
                console.log('Request completed')
            },
        })

        if (this.ticketService.registroInformation?.mode == 'edit') {
            this.httpService
                .postData('acad/calendarioAcademico/addCalAcademico', {
                    json: JSON.stringify({
                        iCalAcadId:
                            this.ticketService.registroInformation.calendar
                                .iCalAcadId,
                    }),
                    _opcion: 'getCalendarioDiasLaborables',
                })
                .subscribe({
                    next: (data: any) => {

                        let filterDiasLaborales = JSON.parse(data.data[0]["calDiasDatos"]).map((dia)=> ({
                            iDiaId: String(dia.iDiaId),
                            iDia: String(dia.iDiaId),
                            cDiaNombre: dia.cDiaNombre,
                            cDiaAbreviado: dia.cDiaAbreviado,
                        }))

                        this.ticketService.setTicketInformation(filterDiasLaborales, 'stepDiasLaborales')

                        this.diasSelection = this.ticketService.registroInformation.stepDiasLaborales
                    },
                    error: (error) => {
                        console.error('Error fetching turnos:', error)
                    },
                    complete: () => {
                        console.log('Request completed')
                        
                    },
                })
        }
    }

    confirm() {
        this.confirmationService.confirm({
            header: 'Confirmar',
            message: 'Por favor, confirme para continuar.',
            acceptIcon: 'pi pi-check mr-2',
            rejectIcon: 'pi pi-times mr-2',
            rejectButtonStyleClass: 'p-button-sm',
            acceptButtonStyleClass: 'p-button-outlined p-button-sm',
            accept: () => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Confirmado',
                    detail: 'Usted ha aceptado',
                    life: 3000,
                })

                this.saveInformation()

                this.nextPage()
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rechazado',
                    detail: 'Has rechazado',
                    life: 3000,
                })
            },
        })
    }

    onSelectionChange(columnsChecked: typeof this.ticketService.registroInformation.stepDiasLaborales) {
        console.log(columnsChecked);
        

        this.ticketService.setTicketInformation(columnsChecked, 'stepDiasLaborales')
    }

    saveInformation() {

        if (this.ticketService.registroInformation?.mode == 'create') {
            this.createDiasLaborales()
        }
        if (this.ticketService.registroInformation?.mode == 'edit') {
            this.updateDiasLaborales()
        }
    }

    createDiasLaborales(){
        this.httpService
        .postData('acad/calendarioAcademico/addCalAcademico', {
            json: JSON.stringify(this.ticketService.registroInformation.stepDiasLaborales),
            _opcion: 'addDiasLaborales',
        })
        .subscribe({
            next: (data: any) => {
                console.log(data)
            },
            error: (error) => {
                console.error('Error fetching turnos:', error)
            },
            complete: () => {
                console.log('Request completed')
            },
        })
    }

    updateDiasLaborales(){
        let update = this.ticketService.registroInformation.stepDiasLaborales.map((dia) => ({
            iDiaLabId: dia.iDiaId,
            iCalAcadId: this.ticketService.registroInformation.calendar.iCalAcadId,
            iDiaId: dia.iDiaId,
        }))


        this.httpService
        .postData('acad/calendarioAcademico/addCalAcademico', {
            json: JSON.stringify(update),
            _opcion: 'updateDiasLaborales',
        })
        .subscribe({
            next: (data: any) => {
                console.log(data)
            },
            error: (error) => {
                console.error('Error fetching turnos:', error)
            },
            complete: () => {
                console.log('Request completed')
            },
        })
    }

    actions: IActionTable[] = [
        {
            labelTooltip: 'Asignar Matriz',
            icon: {
                name: 'matGroupWork',
                size: 'xs',
            },
            accion: 'asignar',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
        },
    ]

    columns: IColumn[] = [
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
            header: 'Días',
            text_header: 'center',
            text: 'center',
        },
        {
            field: 'checked',
            header: '',
            type: 'checkbox',
            width: '5rem',
            text: 'left',
            text_header: '',
        },
    ]
    ngOnChanges(changes) {}
}
