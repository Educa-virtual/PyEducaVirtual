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
import { CheckboxModule } from 'primeng/checkbox'
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
        CheckboxModule,
    ],
    templateUrl: './year.component.html',
    styleUrl: './year.component.scss',
})
export class YearComponent implements OnInit, OnChanges {
    form: FormGroup

    fechas: {
        fechaVigente: string
        fechaInicio: string
        fechaFin: string
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
    ) {
        this.form = this.fb.group({
            fechaVigente: [''],
            fechaInicio: [''],
            fechaFin: [''],
            fechaMatriculaInicio: [''],
            fechaMatriculaFin: [''],
            regular: false,
            recuperacion: false,
        })
    }
    ngOnInit() {
        if (this.ticketService.registroInformation?.mode === 'create') {
            this.httpService
                .postData('acad/calendarioAcademico/addCalAcademico', {
                    json: JSON.stringify({}),
                    _opcion: 'getCalendarioAno',
                })
                .subscribe({
                    next: (data: any) => {
                        let filterYearActive = JSON.parse(
                            data.data[0][
                                'JSON_F52E2B61-18A1-11d1-B105-00805F49916B'
                            ]
                        )[0]

                        this.ticketService.setTicketInformation(
                            {
                                fechaVigente: filterYearActive.cYAcadNombre,
                                fechaInicio: new Date(
                                    filterYearActive.dtYAcadInicio
                                ),
                                fechaFin: new Date(filterYearActive.dYAcadFin),
                            },
                            'stepYear'
                        )
                    },
                    error: (error) => {
                        console.error('Error fetching turnos:', error)
                    },
                    complete: () => {
                        console.log('Request completed')

                        this.form.patchValue({
                            fechaVigente:
                                this.ticketService.registroInformation.stepYear
                                    .fechaVigente,
                            fechaInicio:
                                this.ticketService.registroInformation.stepYear
                                    .fechaInicio,
                            fechaFin:
                                this.ticketService.registroInformation.stepYear
                                    .fechaFin,
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
                            data.data[0]['calendarioAcademico']
                        ).find(
                            (calendario) =>
                                calendario.iCalAcadId ==
                                this.ticketService.registroInformation.calendar
                                    .iCalAcadId
                        )

                        console.log(filterCalendar)

                        this.ticketService.setTicketInformation(
                            {
                                fechaVigente:
                                    this.ticketService.toVisualFechasFormat(
                                        filterCalendar.dtCalAcadInicio,
                                        'YYYY'
                                    ),
                                fechaInicio: new Date(
                                    filterCalendar.dtCalAcadInicio
                                ),
                                fechaFin: new Date(filterCalendar.dtCalAcadFin),
                                matriculaInicio: new Date(
                                    filterCalendar.dtCalAcadMatriculaInicio
                                ),
                                matriculaFin: new Date(
                                    filterCalendar.dtCalAcadMatriculaFin
                                ),
                                // fasesPromocionales: filterCalendar.bCalAcadFaseRegular,
                            },
                            'stepYear'
                        )
                    },
                    error: (error) => {
                        console.error('Error fetching turnos:', error)
                    },
                    complete: () => {
                        console.log('Request completed')

                        this.form.patchValue({
                            fechaVigente:
                                this.ticketService.registroInformation.stepYear
                                    .fechaVigente,
                            fechaInicio:
                                this.ticketService.registroInformation.stepYear
                                    .fechaInicio,
                            fechaFin:
                                this.ticketService.registroInformation.stepYear
                                    .fechaFin,
                            fechaMatriculaInicio:
                                this.ticketService.registroInformation.stepYear
                                    .matriculaInicio,
                            fechaMatriculaFin:
                                this.ticketService.registroInformation.stepYear
                                    .matriculaFin,
                            // regular:
                            //     this.ticketService.registroInformation.stepYear
                            //         .faseRegular,
                            // recuperacion:
                            //     this.ticketService.registroInformation.stepYear
                            //         .faseRecuperacion,
                        })

                        this.form.get('fechaVigente').disable()
                    },
                })


            this.httpService
                .postData('acad/calendarioAcademico/addCalAcademico', {
                    json: JSON.stringify({
                        jmod: 'acad',
                        jtable: 'fases_promocionales',
                    }),
                    _opcion: 'getConsulta',
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

                        // this.form.patchValue({
                        //     regular:
                        //         this.ticketService.registroInformation.stepYear
                        //             .faseRegular,
                        //     recuperacion:
                        //         this.ticketService.registroInformation.stepYear
                        //             .faseRecuperacion,
                        // })

                        this.form.get('fechaVigente').disable()
                    },
                })
        }

        // Suscribirse a los cambios del formulario después de la inicialización
        this.form.valueChanges.subscribe((value) => {
            this.ticketService.registroInformation.stepYear = {
                ...this.ticketService.registroInformation.stepYear,
                fechaInicio: value.fechaInicio,
                fechaFin: value.fechaFin,
                // faseRecuperacion: value.recuperacion,
                // faseRegular: value.regular,
                matriculaFin: value.fechaMatriculaFin,
                matriculaInicio: value.fechaMatriculaInicio,
            }
            console.log(value)
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
        if (this.ticketService.registroInformation.mode == 'create') {
            this.createCalendario()
        }

        if (this.ticketService.registroInformation.mode == 'edit') {
            this.updateCalendario()
        }
    }

    createCalendario() {
        this.httpService
            .postData('acad/calendarioAcademico/addCalAcademico', {
                json: JSON.stringify({
                    iSedeId: this.localService.getItem('dremoPerfil').iSedeId,
                    iYAcadId:
                        this.ticketService.registroInformation.calendar
                            .iYAcadId,
                    dtCalAcadInicio:
                        this.ticketService.registroInformation.stepYear
                            .fechaInicio,
                    dtCalAcadFin:
                        this.ticketService.registroInformation.stepYear
                            .fechaFin,
                    bCalAcadFaseRegular: 1,
                    bCalAcadFaseRecuperacion: 1,
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

    updateCalendario() {
        console.log(this.ticketService.registroInformation.stepYear)
        console.log(this.ticketService.registroInformation)

        this.httpService
            .postData('acad/calendarioAcademico/addCalAcademico', {
                json: JSON.stringify({
                    iSedeId: this.localService.getItem('dremoPerfil').iSedeId,
                    iCalAcadId:
                        this.ticketService.registroInformation.calendar
                            .iCalAcadId,
                    iYAcadId:
                        this.ticketService.registroInformation.calendar
                            .iYAcadId,
                    dtCalAcadInicio: this.ticketService.toSQLDatetimeFormat(
                        this.ticketService.registroInformation.stepYear
                            .fechaInicio
                    ),
                    dtCalAcadFin:
                        this.ticketService.registroInformation.stepYear
                            .fechaFin,
                    dtCalAcadMatriculaInicio:
                        this.ticketService.registroInformation.stepYear
                            .matriculaInicio,
                    dtCalAcadMatriculaFin:
                        this.ticketService.registroInformation.stepYear
                            .matriculaFin,
                    // bCalAcadFaseRegular:
                    //     this.ticketService.registroInformation.stepYear
                    //         .faseRegular,
                    // bCalAcadFaseRecuperacion:
                    //     this.ticketService.registroInformation.stepYear
                    //         .faseRecuperacion,
                }),
                _opcion: 'updateCalAcademico',
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
