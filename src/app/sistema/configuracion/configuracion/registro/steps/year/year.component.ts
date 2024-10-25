import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'

import { TicketService } from '../../service/ticketservice'
import { Router } from '@angular/router'

import { ButtonModule } from 'primeng/button'
import { CalendarModule } from 'primeng/calendar'
import { FormsModule } from '@angular/forms'
import { httpService } from '../../../http/httpService'

import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'

import { FloatLabelModule } from 'primeng/floatlabel'
import { ConfirmationService, MessageService } from 'primeng/api'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { ToastModule } from 'primeng/toast'
@Component({
    selector: 'app-year',
    standalone: true,
    imports: [
        ContainerPageComponent,
        TablePrimengComponent,
        CalendarModule,
        ButtonModule,
        FloatLabelModule,
        FormsModule,
        ReactiveFormsModule,
        ConfirmDialogModule,
        ToastModule,
    ],
    templateUrl: './year.component.html',
    styleUrl: './year.component.scss',
})
export class YearComponent implements OnInit, OnChanges {
    form: FormGroup
    minDate: Date
    visible: boolean = false

    maxDate: Date

    yearInformation

    constructor(
        public ticketService: TicketService,
        private router: Router,
        private httpService: httpService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private fb: FormBuilder
    ) {}
    ngOnInit() {
        let service = this.ticketService.getTicketInformation()?.stepYear

        if(this.ticketService.registroInformation?.stepYear){
            this.form = this.fb.group({
                fechaVigente: [service.fechaVigente ||''],
                fechaInicio: [service.fechaFin || ''],
                fechaFin: [service.fechaFin || ''],
            })
        } else {
            this.form = this.fb.group({
                fechaVigente: [''],
                fechaInicio: [ ''],
                fechaFin: [ ''],
            })
        }


        this.form.valueChanges.subscribe((value) => {
            // this.ticketService.setTicketInformation(value, "stepYear")
            this.yearInformation = {
                fechaVigente: value.fechaVigente,
                fechaInicio: value.fechaInicio,
                fechaFin: value.fechaFin,
            }
        })
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

    saveInformation() {
        let yearCurrent

        if (!this.ticketService.registroInformation) {
            this.ticketService.registroInformation = {}
        }

        // Verifica la existencia de `stepYear` y continúa con `stepTurnos`
        if ('stepYear' in this.ticketService.registroInformation) {
            yearCurrent = this.ticketService.getTicketInformation().stepYear
        }

        yearCurrent = this.yearInformation

        this.ticketService.setTicketInformation(yearCurrent, 'stepYear')

        console.log(this.ticketService.registroInformation.stepYear)
        console.log('Guardando informacion')

        // this.httpService
        //     .postData('acad/calendarioAcademico/addCalAcademico', {
        //         json: JSON.stringify({
        //             jmod: 'grl',
        //             jtable: 'dias',
        //         }),
        //         _opcion: 'getConsulta',
        //     })
        //     .subscribe({
        //         next: (data: any) => {
        //             this.dias = data.data

        //             console.log(this.dias)
        //         },
        //         error: (error) => {
        //             console.error('Error fetching dias:', error)
        //         },
        //         complete: () => {
        //             console.log('Request completed')
        //         },
        //     })
    }

    nextPage() {
        this.ticketService.registroInformation.stepYear = this.yearInformation
        this.router.navigate([
            'configuracion/configuracion/registro/diasLaborales',
        ])
    }
    // prevPage() {
    //     this.router.navigate(['steps/year'])
    // }
    ngOnChanges() {
        // this.form.valueChanges.subscribe(value => {
        //     this.ticketService.setTicketInformation(value, "stepYear")
        //     console.log(this.ticketService.getTicketInformation().stepYear);
        //     this.minDate = new Date(Number(this.yearInformation.fechaVigente), 0, 1); // 0 es enero y 1 es el primer día
        //     console.log(new Date(Number(this.yearInformation.fechaVigente), 0, 1));
        //     this.maxDate = new Date(Number(this.yearInformation.fechaVigente), 11, 31);
        //     console.log(new Date(Number(this.yearInformation.fechaVigente), 11, 31));
        // });
        // Definir el último día del año
    }
}
