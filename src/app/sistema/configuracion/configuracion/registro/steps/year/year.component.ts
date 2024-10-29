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
import { LocalStoreService } from '@/app/servicios/local-store.service'

import { FormControl } from '@angular/forms'
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

    fechas: {
        fechaVigente: string,
        fechaInicio: string,
        fechaFin: string,
    }

    minDate: Date
    visible: boolean = false
    fechaVigenteFetch

    maxDate: Date


    constructor(
        public ticketService: TicketService,
        private router: Router,
        private httpService: httpService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private fb: FormBuilder,
        private localService: LocalStoreService
    ) {}
    ngOnInit() {
        if (this.ticketService.registroInformation?.mode === 'create') {
            this.httpService
                .postData('acad/calendarioAcademico/addCalAcademico', {
                    json: JSON.stringify({}),
                    _opcion: 'getCalendarioAno',
                })
                .subscribe({
                    next: (data: any) => {
                        let filterYearActive = JSON.parse(data.data[0][
                            'JSON_F52E2B61-18A1-11d1-B105-00805F49916B'
                        ][0])

                        console.log(filterYearActive)

                        let fechaCurrent = filterYearActive.map(
                            (fecha) => ({
                                fechaVigente: fecha.cYAcadNombre,
                                fechaInicio: new Date(fecha.dtYAcadInicio),
                                fechaFin: new Date(fecha.dYAcadFin),
                            })
                        )

                        // this.ticketService.setTicketInformation(
                        //     ,
                        //     'stepYear'
                        // )
                    },
                    error: (error) => {
                        console.error('Error fetching turnos:', error)
                    },
                    complete: () => {
                        console.log('Request completed')

                        this.form.setValue({
                            fechaVigente: this.ticketService.registroInformation.stepYear.fechaVigente,
                            fechaInicio: this.ticketService.registroInformation.stepYear.fechaInicio,
                            fechaFin: this.ticketService.registroInformation.stepYear.fechaFin,
                        })

                        this.form.get('fechaVigente').disable()
                    },
                })
        }
        if (this.ticketService.registroInformation?.mode == 'edit') {
            this.httpService
                .postData('acad/calendarioAcademico/addCalAcademico', {
                    json: JSON.stringify({
                        iSedeId:
                            this.localService.getItem('dremoPerfil').iSedeId,
                        // iYAcadId: this.ticketService.registroInformation.stepYear.,
                        iCalAcadId:
                            this.ticketService.registroInformation.calendar
                                .iCalAcadId,
                    }),
                    _opcion: 'getCalendarioIESede',
                })
                .subscribe({
                    next: (data: any) => {

                        let filterCalendar = JSON.parse(
                            data.data[0]['calendarioAcademico']).find((calendario) => 
                                calendario.iYAcadId == 3
                            )

                        this.ticketService.setTicketInformation({
                            fechaVigente: this.ticketService.formatFechas(filterCalendar.dtCalAcadInicio, 'YY'),
                            fechaInicio: new Date(filterCalendar.dtCalAcadInicio),
                            fechaFin: new Date(filterCalendar.dtCalAcadFin),
                        }, "stepYear")

                    },
                    error: (error) => {
                        console.error('Error fetching turnos:', error)
                    },
                    complete: () => {
                        console.log('Request completed')

                        this.form.setValue({
                            fechaVigente: this.ticketService.registroInformation.stepYear.fechaVigente,
                            fechaInicio: this.ticketService.registroInformation.stepYear.fechaInicio,
                            fechaFin: this.ticketService.registroInformation.stepYear.fechaFin,
                        })

                        this.form.get('fechaVigente').disable()
                    },
                })
        }

        this.form = this.fb.group({
            fechaVigente: [''],
            fechaInicio: [''],
            fechaFin: [''],
        })

        // Suscribirse a los cambios del formulario después de la inicialización
        this.form.valueChanges.subscribe((value) => {
            this.ticketService.registroInformation.stepYear = {
                ...this.ticketService.registroInformation.stepYear,
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
        // Verifica la existencia de `stepYear` y continúa con `stepTurnos`
            
        this.httpService
            .postData('acad/calendarioAcademico/addCalAcademico', {
                json: JSON.stringify({
                    iSedeId: this.localService.getItem('dremoPerfil').iSedeId,
                    iYAcadId: this.ticketService.registroInformation.calendar.iCalAcadId,
                    dtCalAcadInicio: this.ticketService.registroInformation.stepYear.fechaInicio,
                    dtCalAcadFin: this.ticketService.registroInformation.stepYear.fechaFin,
                }),
                _opcion: 'addCalAcademico',
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

    nextPage() {
        this.router.navigate([
            'configuracion/configuracion/registro/diasLaborales',
        ])
    }
    // prevPage() {
    //     this.router.navigate(['steps/year'])
    // }
    ngOnChanges() {}
}
