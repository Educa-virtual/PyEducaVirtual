import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { Component, OnChanges, OnInit } from '@angular/core'

import { Router } from '@angular/router'
import { TicketService } from '../../service/ticketservice'

import { FormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { CalendarModule } from 'primeng/calendar'
import { httpService } from '../../../http/httpService'

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'

import {
    StepConfirmationService,
    type informationMessage,
} from '@/app/servicios/confirm.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { CheckboxModule } from 'primeng/checkbox'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { FloatLabelModule } from 'primeng/floatlabel'
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

    fasesPromocionales: {
        iFasePromId: string
        cFasePromNombre: string
    }[] = []

    fasesPromocionalesSelected: {
        iFasePromId: string
        cFasePromNombre: string
    }[] = []

    minDate: Date
    visible: boolean = false
    fechaVigenteFetch

    maxDate: Date

    constructor(
        public ticketService: TicketService,
        private router: Router,
        private httpService: httpService,
        private stepConfirmationService: StepConfirmationService,
        private fb: FormBuilder,
        private localService: LocalStoreService
    ) {
        this.form = this.fb.group({
            fechaVigente: ['', Validators.required],
            fechaInicio: ['', Validators.required],
            fechaFin: ['', Validators.required],
            fechaMatriculaInicio: ['', Validators.required],
            fechaMatriculaFin: ['', Validators.required],
            fechaFaseInicio: ['', Validators.required],
            fechaFaseFin: ['', Validators.required],
            regular: [[]],
            recuperacion: [[]],
        })
    }
    ngOnInit() {
        // this.getFasesPromocionales()

        // console.log('Objeto')
        // console.log(this.ticketService.registroInformation)

        if (!this.ticketService.registroInformation?.calendar){
            this.router.navigate([
                'configuracion/configuracion/years',
            ])   
            return;
        }

        const { iSedeId = "", iYAcadId = "", iCalAcadId = ""} =
                this.ticketService.registroInformation?.calendar

        // this.ticketService.getCalendarioIESede()

        /**
         *  * Verificamos que exista un id de un calendario exista en el servicio
         **/
        if (iCalAcadId) {
            this.ticketService.getCalendar({ iSedeId, iYAcadId, iCalAcadId })
        } else {
            this.ticketService.setFasesYear({
                onCompleteCallbacks: [() => this.setValuesFormCalendar()],
            })
        }

        if (this.ticketService.registroInformation.mode === 'create') {
            // this.ticketService.setFechaVigente([
            //     () =>
            //         this.form.patchValue({
            //             fechaVigente:
            //                 this.ticketService.registroInformation.stepYear
            //                     .fechaVigente,
            //             fechaInicio:
            //                 this.ticketService.registroInformation.stepYear
            //                     .fechaInicio,
            //             fechaFin:
            //                 this.ticketService.registroInformation.stepYear
            //                     .fechaFin,
            //         }),
            //     () => this.form.get('fechaVigente').disable()
            // ])
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

                        this.ticketService.setTicketInformation(
                            {
                                ...this.ticketService.registroInformation
                                    .stepYear,
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
                                // fases_promocionales: {
                                //     ...(this.ticketService.registroInformation
                                //         .stepYear?.fases_promocionales || {}),
                                //     bCalAcadFaseRegular:
                                //         filterCalendar.bCalAcadFaseRegular,
                                //     bCalAcadFaseRecuperacion:
                                //         filterCalendar.bCalAcadFaseRecuperacion,
                                // },

                                // fasesPromocionales: filterCalendar.bCalAcadFaseRegular,
                            },
                            'stepYear'
                        )
                    },
                    error: (error) => {
                        console.error('Error fetching turnos:', error)
                    },
                    complete: () => {
                        console.log(
                            this.ticketService.registroInformation.stepYear
                        )

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

            // this.getCalendarioFasesPromocionales()
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
                // fases_promocionales: {
                //     ...this.ticketService.registroInformation.stepYear
                //         .fases_promocionales,
                //     dtFaseInicio: value.fechaFaseInicio,
                //     dtFaseFin: value.fechaFaseFin,
                // },
            }
            console.log(value)
        })

        console.log('Form')
        console.log(this.form)
    }

    // getFasesPromocionales() {
    //     this.httpService
    //         .postData('acad/calendarioAcademico/addCalAcademico', {
    //             json: JSON.stringify({
    //                 jmod: 'acad',
    //                 jtable: 'fases_promocionales',
    //             }),
    //             _opcion: 'getConsulta',
    //         })
    //         .subscribe({
    //             next: (data: any) => {
    //                 this.fasesPromocionales.push(...data.data)
    //             },
    //             error: (error) => {
    //                 console.error('Error fetching turnos:', error)
    //             },
    //             complete: () => {
    //                 console.log('Request completed')
    //             },
    //         })
    // }

    setValuesFormCalendar() {

        const { fechaVigente, fechaInicio, fechaFin, matriculaInicio, matriculaFin, bCalAcadFaseRegular, bCalAcadFaseRecuperacion, fases_promocionales } = this.ticketService.registroInformation.stepYear

        this.form.patchValue({
            fechaVigente: fechaVigente,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin,
            fechaMatriculaInicio: matriculaInicio,
            fechaMatriculaFin: matriculaFin,
            fechaFaseInicio: bCalAcadFaseRegular,
            fechaFaseFin: bCalAcadFaseRecuperacion,
            regular: bCalAcadFaseRegular,
            recuperacion: bCalAcadFaseRecuperacion,
        })
    }

    // getCalendarioFasesPromocionales() {
    //     this.httpService
    //         .postData('acad/calendarioAcademico/addCalAcademico', {
    //             json: JSON.stringify({
    //                 iCalAcadId:
    //                     this.ticketService.registroInformation.calendar
    //                         .iCalAcadId,
    //             }),
    //             _opcion: 'getCalendarioFases',
    //         })
    //         .subscribe({
    //             next: (data: any) => {
    //                 console.log(JSON.parse(data.data[0]['calFases'])[0])
    //                 let calendarioFases = JSON.parse(
    //                     data.data[0]['calFases']
    //                 )[0]

    //                 this.ticketService.registroInformation.stepYear.fases_promocionales =
    //                     {
    //                         ...this.ticketService.registroInformation.stepYear
    //                             .fases_promocionales,

    //                         iFaseId: calendarioFases.iFaseId,
    //                         iFasePromId: calendarioFases.iFasePromId,
    //                         cFasePromNombre: calendarioFases.cFasePromNombre,
    //                         dtFaseInicio: new Date(
    //                             calendarioFases.dtFaseInicio
    //                         ),
    //                         dtFaseFin: new Date(calendarioFases.dtFaseFin),
    //                     }
    //             },
    //             error: (error) => {
    //                 console.error('Error fetching turnos:', error)
    //             },
    //             complete: () => {
    //                 console.log('regular')
    //                 console.log(this.ticketService.registroInformation.stepYear)

    //                 this.form.patchValue({
    //                     fechaFaseInicio:
    //                         this.ticketService.registroInformation.stepYear
    //                             .fases_promocionales.dtFaseInicio,
    //                     fechaFaseFin:
    //                         this.ticketService.registroInformation.stepYear
    //                             .fases_promocionales.dtFaseFin,
    //                 })

    //                 if (
    //                     this.ticketService.registroInformation.stepYear
    //                         .fases_promocionales.bCalAcadFaseRegular
    //                 ) {
    //                     this.form.patchValue({
    //                         regular: [
    //                             {
    //                                 iFasePromId: String(
    //                                     this.ticketService.registroInformation
    //                                         .stepYear.fases_promocionales
    //                                         .iFasePromId
    //                                 ),
    //                                 cFasePromNombre:
    //                                     this.ticketService.registroInformation
    //                                         .stepYear.fases_promocionales
    //                                         .cFasePromNombre,
    //                             },
    //                         ],
    //                     })
    //                 }

    //                 if (
    //                     this.ticketService.registroInformation.stepYear
    //                         .fases_promocionales.bCalAcadFaseRecuperacion
    //                 ) {
    //                     this.form.patchValue({
    //                         recuperacion: [this.fasesPromocionales[1]],
    //                     })
    //                 }
    //             },
    //         })
    // }

    toggleCheckboxRegular(value) {
        console.log(value)
        if (value.length === 1 && value[0].cFasePromNombre == 'FASE REGULAR') {
            // this.ticketService.registroInformation.stepYear.fases_promocionales.bCalAcadFaseRegular =
        } else {
            // this.ticketService.registroInformation.stepYear.fases_promocionales.bCalAcadFaseRegular =
        }
    }

    toggleCheckboxRecuperacion(value: Array<any>) {
        if (
            value.length === 1 &&
            value[0].cFasePromNombre == 'FASE DE RECUPERACIÓN'
        ) {
            // this.ticketService.registroInformation.stepYear.fases_promocionales.bCalAcadFaseRecuperacion =
        } else {
            // this.ticketService.registroInformation.stepYear.fases_promocionales.bCalAcadFaseRecuperacion =
        }
    }

    confirm() {
        const message: informationMessage = {
            header: '¿Desea guardar información?',
            message: 'Por favor, confirme para continuar.',
            accept: {
                severity: 'contrast',
                summary: 'Año',
                detail: 'Se ha guardado correctamente.',
                life: 6000,
            },
            reject: {
                severity: 'warn',
                summary: 'Año',
                detail: 'Se ha cancelado guardar la información.',
                life: 3000,
            },
        }

        this.stepConfirmationService.confirmAction(
            [() => this.saveInformation(), () => this.nextPage()],
            message
        )
    }

    saveInformation() {
        if (this.ticketService.registroInformation.mode == 'create') {
            this.createCalendario()
        }

        if (this.ticketService.registroInformation.mode == 'edit') {
            // this.updateCalendario()
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

    // updateCalendario() {
    //     this.httpService
    //         .postData('acad/calendarioAcademico/addCalAcademico', {
    //             json: JSON.stringify({
    //                 iSedeId: this.localService.getItem('dremoPerfil').iSedeId,
    //                 iCalAcadId:
    //                     this.ticketService.registroInformation.calendar
    //                         .iCalAcadId,
    //                 iYAcadId:
    //                     this.ticketService.registroInformation.calendar
    //                         .iYAcadId,
    //                 dtCalAcadInicio: this.ticketService.toSQLDatetimeFormat(
    //                     this.ticketService.registroInformation.stepYear
    //                         .fechaInicio
    //                 ),
    //                 dtCalAcadFin:
    //                     this.ticketService.registroInformation.stepYear
    //                         .fechaFin,
    //                 dtCalAcadMatriculaInicio:
    //                     this.ticketService.registroInformation.stepYear
    //                         .matriculaInicio,
    //                 dtCalAcadMatriculaFin:
    //                     this.ticketService.registroInformation.stepYear
    //                         .matriculaFin,
    //                 bCalAcadFaseRegular:
    //                     this.ticketService.registroInformation.stepYear
    //                         .fases_promocionales.bCalAcadFaseRegular,
    //                 bCalAcadFaseRecuperacion:
    //                     this.ticketService.registroInformation.stepYear
    //                         .fases_promocionales.bCalAcadFaseRecuperacion,
    //             }),
    //             _opcion: 'updateCalAcademico',
    //         })
    //         .subscribe({
    //             next: (data: any) => {
    //                 console.log(data)
    //             },
    //             error: (error) => {
    //                 console.error('Error fetching turnos:', error)
    //             },
    //             complete: () => {
    //                 console.log('Request completed')
    //             },
    //         })

    //     this.httpService
    //         .postData('acad/calendarioAcademico/addCalAcademico', {
    //             json: JSON.stringify({
    //                 iFaseId:
    //                     this.ticketService.registroInformation.stepYear
    //                         .fases_promocionales.iFaseId,
    //                 iCalAcadId:
    //                     this.ticketService.registroInformation.calendar
    //                         .iCalAcadId,
    //                 iFasePromId:
    //                     this.ticketService.registroInformation.stepYear
    //                         .fases_promocionales.iFasePromId,
    //                 dtFaseInicio: this.ticketService.toSQLDatetimeFormat(
    //                     this.ticketService.registroInformation.stepYear
    //                         .fases_promocionales.dtFaseInicio
    //                 ),
    //                 dtFaseFin: this.ticketService.toSQLDatetimeFormat(
    //                     this.ticketService.registroInformation.stepYear
    //                         .fases_promocionales.dtFaseFin
    //                 ),
    //             }),
    //             _opcion: 'updateCalFase',
    //         })
    //         .subscribe({
    //             next: (data: any) => {
    //                 console.log(data)
    //             },
    //             error: (error) => {
    //                 console.error('Error fetching turnos:', error)
    //             },
    //             complete: () => {
    //                 console.log('Request completed')
    //             },
    //         })
    // }

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
