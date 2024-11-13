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
    ) {
        this.form = this.fb.group({
            fechaVigente: ['', Validators.required],
            fechaInicio: ['', Validators.required],
            fechaFin: ['', Validators.required],
            fechaMatriculaInicio: ['', Validators.required],
            fechaMatriculaFin: ['', Validators.required],
            fechaFaseRegularInicio: [''],
            fechaFaseRegularFin: [''],
            fechaMatriculaRezagados: [''],
            fechaFaseRecuperacionInicio: [''],
            fechaFaseRecuperacionFin: [''],
            regular: [[], Validators.required],
            recuperacion: [[], Validators.required],
            
        }
    )
    }
    async ngOnInit() {
        // this.fasesPromocionales = await this.ticketService.getFasesFechas()

        await this.ticketService.setCalendar(
            { iYAcadId: '', iCalAcadId: '' },
            {
                onCompleteCallbacks: [
                    (data) => this.setValuesFormCalendar(data),
                ],
            }
        )

        const { iCalAcadId = '' } =
            this.ticketService.registroInformation?.calendar

        // if (!this.ticketService.registroInformation?.calendar) {
        //     this.router.navigate(['configuracion/configuracion/years'])
        //     return
        // }

        // if (iCalAcadId) {
        //     this.ticketService.setCalFasesProm()
        // }

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
            console.log(value)
        })
    }

    setValuesFormCalendar(data) {
        if (this.ticketService.registroInformation.calendar.iCalAcadId) {
            const {
                fechaVigente,
                fechaInicio,
                fechaFin,
                matriculaInicio,
                matriculaFin,
                matriculaResagados,
                bCalAcadFaseRegular,
                bCalAcadFaseRecuperacion,
                fases_promocionales,
            } = this.ticketService.registroInformation.stepYear

            const fasePromocional =  data.fasesProm.reduce((acc, item) => {
                acc[item.iFasePromId
                ] = item;
                return acc;
            }, {});

            
            const existFaseRegular = Array.isArray(fases_promocionales) && fases_promocionales.find(fase => fase.iFasePromId == fasePromocional[1].iFasePromId)
            console.log(existFaseRegular)
            
            const existFaseRecuperacion = Array.isArray(fases_promocionales) && fases_promocionales.find(fase => fase.iFasePromId == fasePromocional[2].iFasePromId)
            console.log(existFaseRecuperacion)
            
            this.form.patchValue({
                fechaVigente: fechaVigente,
                fechaInicio: fechaInicio,
                fechaFin: fechaFin,
                fechaMatriculaInicio: matriculaInicio,
                fechaMatriculaFin: matriculaFin,
                fechaFaseRegularInicio: new Date (existFaseRegular.dtFaseFin),
                fechaFaseRegularFin: new Date(existFaseRegular.dtFaseFin),
                fechaFaseRecuperacionInicio: new Date(existFaseRecuperacion.dtFaseInicio),
                fechaFaseRecuperacionFin: new Date(existFaseRecuperacion.dtFaseFin),
                fechaMatriculaRezagados: matriculaResagados,
                regular: existFaseRegular ? [existFaseRegular,true] : [data.fasesProm[0]],
                recuperacion: existFaseRecuperacion ? [existFaseRecuperacion,true] : [data.fasesProm[1]],
            })
        } else {
            this.form.patchValue({
                fechaVigente: data.yearAcad.cYAcadNombre,
                fechaInicio: new Date(data.yearAcad.dtYAcadInicio),
                fechaFin: new Date(data.yearAcad.dYAcadFin),
                regular: [data.fasesProm[0]],
                recuperacion: [data.fasesProm[1]],
            })
        }

        this.form.get('fechaVigente').disable()
    }

    confirm() {
        const message: informationMessage = {
            header: '¿Desea guardar información?',
            message: 'Por favor, confirme para continuar.',
            accept: {
                severity: 'success',
                summary: 'Fechas',
                detail: 'Se ha guardado correctamente.',
                life: 6000,
            },
            reject: {
                severity: 'error',
                summary: 'Fechas',
                detail: 'Se ha cancelado guardar la información.',
                life: 3000,
            },
        }

        this.stepConfirmationService.confirmAction(
            [() => this.saveInformation(), () => this.nextPage()],
            message
        )
    }

    async saveInformation() {
        if (!this.ticketService.registroInformation.calendar.iCalAcadId) {
            await this.ticketService.insCalAcademico(this.form.value)
        } else {
            await this.ticketService.updCalAcademico(this.form.value)
        }
        console.log(this.ticketService.registroInformation.calendar.iCalAcadId)

        const checkRegular = this.form.get('regular').value
        const checkRecuperacion = this.form.get('recuperacion').value

        if (checkRegular.includes(true)) {
            const { fechaFaseRegularInicio, fechaFaseRegularFin } =
                this.form.value
            await this.ticketService.insCalFasesProm({
                form: {
                    faseInicio: fechaFaseRegularInicio,
                    faseFinal: fechaFaseRegularFin,
                },
                insFase: checkRegular[0],
            })
        } else {
            await this.ticketService.deleteCalFasesProm(checkRegular[0])
        }
        if (checkRecuperacion.includes(true)) {
            const { fechaFaseRecuperacionInicio, fechaFaseRecuperacionFin } =
                this.form.value
            await this.ticketService.insCalFasesProm({
                form: {
                    faseInicio: fechaFaseRecuperacionInicio,
                    faseFinal: fechaFaseRecuperacionFin,
                },
                insFase: checkRecuperacion[0],
            })
        } else {
            await this.ticketService.deleteCalFasesProm(checkRecuperacion[0])
        }

        await this.ticketService.setCalendar()
    }

    nextPage() {
        this.router.navigate([
            'configuracion/configuracion/registro/dias-laborales',
        ])
    }
}
