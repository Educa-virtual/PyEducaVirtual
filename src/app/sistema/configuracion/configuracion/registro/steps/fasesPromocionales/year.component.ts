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
    minDate: Date
    visible: boolean = false
    calFasesFechasInformation: {
      iSedeId: string,
      iYAcadId: string
      dtCalAcadInicio: Date
      dtCalAcadFin: Date
      dtCalAcadMatriculaInicio: Date
      dtCalAcadMatriculaFin: Date
      bCalAcadFaseRegular: boolean
      bCalAcadFaseRecuperacion: boolean

      dtFaseRegularInicio: Date
      dtFaseRegularFin: Date
      dtFaserecuperacionInicio: Date
      dtFaserecuperacionFin: Date
    }
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
            fechaFaseRegularInicio: ['', Validators.required],
            fechaFaseRegularFin: ['', Validators.required],
            fechaFaseRecuperacionInicio: ['', Validators.required],
            fechaFaseRecuperacionFin: ['', Validators.required],
            regular: [[]],
            recuperacion: [[]],
        })
    }
    ngOnInit() {
        if (!this.ticketService.registroInformation?.calendar){
            this.router.navigate([
                'configuracion/configuracion/years',
            ])   
            return;
        }
        const { iSedeId = "", iYAcadId = "", iCalAcadId = ""} =
                this.ticketService.registroInformation?.calendar

        if (iCalAcadId) {
            this.ticketService.getCalendar({ iSedeId, iYAcadId, iCalAcadId })
            this.ticketService.setCalAcad({
                onNextCallbacks: [(data) => this.setValuesFormCalendar(data)],
            })
        } else {
            this.ticketService.setCalAcad({
                onNextCallbacks: [(data) => this.setValuesFormCalendar(data)],
            })
        }

        // Suscribirse a los cambios del formulario después de la inicialización
        this.form.valueChanges.subscribe((value) => {
            this.calFasesFechasInformation = {
              iSedeId: JSON.parse(localStorage.getItem('dremoPerfil')).iSedeId,
              iYAcadId: this.ticketService.registroInformation.calendar.iYAcadId,
              dtCalAcadInicio: value.fechaInicio,
              dtCalAcadFin: value.fechaFin,
              dtCalAcadMatriculaInicio: value.fechaMatriculaInicio,
              dtCalAcadMatriculaFin: value.fechaMatriculaFin,
              bCalAcadFaseRegular: value.regular.includes(true),
              bCalAcadFaseRecuperacion: value.recuperacion.includes(true),

              dtFaseRegularInicio: value.fechaFaseRegularInicio,
              dtFaseRegularFin: value.fechaFaseRegularFin,
              dtFaserecuperacionInicio: value.fechaFaseRecuperacionInicio,
              dtFaserecuperacionFin: value.fechaFaseRecuperacionFin,
            }
            console.log(this.calFasesFechasInformation)
        })

    }

    setValuesFormCalendar(data) {

        const { fechaVigente, fechaInicio, fechaFin, matriculaInicio, matriculaFin, bCalAcadFaseRegular, bCalAcadFaseRecuperacion, fases_promocionales } = this.ticketService.registroInformation.stepYear

        this.form.patchValue({
            fechaVigente: fechaVigente,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin,
            fechaMatriculaInicio: matriculaInicio,
            fechaMatriculaFin: matriculaFin,
            fechaFaseInicio: bCalAcadFaseRegular,
            fechaFaseFin: bCalAcadFaseRecuperacion,
            regular: [data.fasesProm[0]],
            recuperacion: [data.fasesProm[1]],
        })
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
      if(!this.ticketService.registroInformation.calendar.iCalAcadId){
        this.ticketService.insCalAcademico()
      }

      this.ticketService.updCalFasesFechas()
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
