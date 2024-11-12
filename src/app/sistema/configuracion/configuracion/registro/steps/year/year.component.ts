import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { Component, OnInit } from '@angular/core'

import { Router } from '@angular/router'
import { TicketService } from '../../service/ticketservice'

import { FormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { CalendarModule } from 'primeng/calendar'
import { httpService } from '../../../http/httpService'

import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'

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
export class YearComponent implements OnInit {
    form: FormGroup
    calFasesFechasInformation: {
        iSedeId: string
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
    fasesPromocionales: Array<any>
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
            fechaFaseRegularInicio: [''],
            fechaFaseRegularFin: [''],
            fechaFaseRecuperacionInicio: [''],
            fechaFaseRecuperacionFin: [''],
            regular: [[], Validators.required],
            recuperacion: [[], Validators.required],
        })
    }
    ngOnInit() {
        if (!this.ticketService.registroInformation?.calendar) {
            this.router.navigate(['configuracion/configuracion/years'])
            return
        }
        const {
            iSedeId = '',
            iYAcadId = '',
            iCalAcadId = '',
        } = this.ticketService.registroInformation?.calendar

        if (iCalAcadId) {
            this.ticketService.getCalendar({ iSedeId, iYAcadId, iCalAcadId })
            this.ticketService.setCalAcad({
                onNextCallbacks: [(data) => this.setValuesFormCalendar(data)],
            })
            this.ticketService.setCalFasesProm()
        } else {
            this.ticketService.setCalAcad({
                onNextCallbacks: [(data) => this.setValuesFormCalendar(data)],
            })
        }

        // Suscribirse a los cambios del formulario después de la inicialización
        this.form.valueChanges.subscribe((value) => {
            this.calFasesFechasInformation = {
                iSedeId: JSON.parse(localStorage.getItem('dremoPerfil'))
                    .iSedeId,
                iYAcadId:
                    this.ticketService.registroInformation.calendar.iYAcadId,
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
        this.fasesPromocionales = data.fasesProm

        const {
            fechaVigente,
            fechaInicio,
            fechaFin,
            matriculaInicio,
            matriculaFin,
            bCalAcadFaseRegular,
            bCalAcadFaseRecuperacion,
            fases_promocionales,
        } = this.ticketService.registroInformation.stepYear

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
            [() => this.saveInformation()],
            message
        )
    }

    saveInformation() {
        if (!this.ticketService.registroInformation.calendar.iCalAcadId) {
            this.ticketService.insCalAcademico(this.form.value)
        } 
        console.log(this.ticketService.registroInformation.calendar.iCalAcadId);

        const checkRegular = this.form.get('regular').value
        const checkRecuperacion = this.form.get('recuperacion').value

        if (checkRegular.includes(true)) {
            const { dtFaseRegularInicio, dtFaseRegularFin } = this.form.value
            this.ticketService.insCalFasesProm({
                form: {
                    faseInicio: dtFaseRegularInicio,
                    faseFinal: dtFaseRegularFin,
                },
                fase: checkRegular[0],
            })
        } else {
            this.ticketService.deleteCalFasesProm(checkRegular[0])
        }
        if (checkRecuperacion.includes(true)) {
            const { dtFaserecuperacionInicio, dtFaserecuperacionFin } =
                this.form.value
            this.ticketService.insCalFasesProm({
                form: {
                    faseInicio: dtFaserecuperacionInicio,
                    faseFinal: dtFaserecuperacionFin,
                },
                fase: checkRecuperacion[0],
            })
        } else {
            this.ticketService.deleteCalFasesProm(checkRecuperacion[0])
        }

        if (this.ticketService.registroInformation.calendar.iCalAcadId) {
            console.log('Fases')
            this.ticketService.setCalFasesProm()
        }
    }

    nextPage() {
        this.router.navigate([
            'configuracion/configuracion/registro/diasLaborales',
        ])
    }
}
