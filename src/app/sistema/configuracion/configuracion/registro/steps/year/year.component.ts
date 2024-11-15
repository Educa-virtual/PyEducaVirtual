import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { Component, OnInit } from '@angular/core'

import { Router } from '@angular/router'
import { TicketService } from '../../service/ticketservice'

import { FormControl, FormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { CalendarModule } from 'primeng/calendar'

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
    fasesPromocionales: {
        iFasePromId: string
        cFasePromNombre: string
    }[]
    constructor(
        public ticketService: TicketService,
        private router: Router,
        private stepConfirmationService: StepConfirmationService,
        private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            fechaVigente: ['', Validators.required],
            fechaInicio: ['', Validators.required],
            fechaFin: ['', Validators.required],
            fechaMatriculaInicio: ['', Validators.required],
            fechaMatriculaFin: ['', Validators.required],
            fechaMatriculaRezagados: [''],
        })
    }
    async ngOnInit() {
        // this.fasesPromocionales = await this.ticketService.getFasesFechas()

        await this.ticketService.setCalendar(
            { iCalAcadId: '' },
            {
                onCompleteCallbacks: [
                    (data) => this.setValuesFormCalendar(data),
                ],
            }
        )

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
        this.fasesPromocionales = data.fasesProm

        if (this.ticketService.registroInformation.calendar.iCalAcadId) {
            const {
                fechaVigente,
                fechaInicio,
                fechaFin,
                matriculaInicio,
                matriculaFin,
                matriculaResagados,
                fases_promocionales,
            } = this.ticketService.registroInformation.stepYear

            const idExistsFases = fases_promocionales.map((faseExist) =>
                String(faseExist.iFasePromId)
            )

            // const existsFases = data.fasesProm.filter((fase) => idExistsFases.includes(fase.iFasePromId))

            const noExistsFases = data.fasesProm.filter(
                (fase) => !idExistsFases.includes(fase.iFasePromId)
            )

            this.ticketService.registroInformation.stepYear.fases_promocionales.forEach(
                (fase) => {
                    this.form.addControl(
                        'faseCheck' + fase.iFasePromId,
                        new FormControl([
                            {
                                iFasePromId: fase.iFasePromId,
                                cFasePromNombre: fase.cFasePromNombre,
                            },
                            true,
                        ])
                    )

                    this.form.addControl(
                        'faseInputInicio' + fase.iFasePromId,
                        new FormControl(new Date(fase.dtFaseInicio))
                    )

                    this.form.addControl(
                        'faseInputFin' + fase.iFasePromId,
                        new FormControl(new Date(fase.dtFaseFin))
                    )
                }
            )

            noExistsFases.forEach((fase) => {
                this.form.addControl(
                    'faseCheck' + fase.iFasePromId,
                    new FormControl([fase])
                )

                this.form.addControl(
                    'faseInputInicio' + fase.iFasePromId,
                    new FormControl('')
                )

                this.form.addControl(
                    'faseInputFin' + fase.iFasePromId,
                    new FormControl('')
                )

                this.form.get('faseInputInicio' + fase.iFasePromId).disable()
                this.form.get('faseInputFin' + fase.iFasePromId).disable()
            })

            this.form.patchValue({
                fechaVigente: fechaVigente ?? '',
                fechaInicio: fechaInicio ?? '',
                fechaFin: fechaFin ?? '',
                fechaMatriculaInicio: matriculaInicio ?? '',
                fechaMatriculaFin: matriculaFin ?? '',
                fechaMatriculaRezagados: matriculaResagados ?? '',
            })
        } else {
            this.form.patchValue({
                fechaVigente: data.yearAcad.cYAcadNombre,
                fechaInicio: new Date(data.yearAcad.dtYAcadInicio),
                fechaFin: new Date(data.yearAcad.dYAcadFin),
            })

            this.fasesPromocionales.forEach((fase) => {
                this.form.addControl(
                    'faseCheck' + fase.iFasePromId,
                    new FormControl([fase])
                )

                this.form.addControl(
                    'faseInputInicio' + fase.iFasePromId,
                    new FormControl('')
                )

                this.form.addControl(
                    'faseInputFin' + fase.iFasePromId,
                    new FormControl('')
                )

                this.form.get('faseInputInicio' + fase.iFasePromId).disable()
                this.form.get('faseInputFin' + fase.iFasePromId).disable()
            })
        }

        this.form.get('fechaVigente').disable()
    }

    isActiveFechasFases(checkId = null) {
        if (
            checkId &&
            this.form.get('faseCheck' + checkId).value.includes(true)
        ) {
            this.form.get('faseInputInicio' + checkId).enable()
            this.form.get('faseInputFin' + checkId).enable()
        } else {
            this.form.get('faseInputInicio' + checkId).disable()
            this.form.get('faseInputFin' + checkId).disable()
            this.form.get('faseInputInicio' + checkId).reset()
            this.form.get('faseInputFin' + checkId).reset()
        }
    }

    async confirm() {
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

        await this.stepConfirmationService.confirmAction(
            {
                onAcceptPromises: [
                    async () => await this.saveInformation(),
                    async () => await this.nextPage(),
                ],
            },
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

    async nextPage() {
        this.router.navigate([
            'configuracion/configuracion/registro/dias-laborales',
        ])
    }
}
