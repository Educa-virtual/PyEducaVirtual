import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { Component, OnInit, HostListener } from '@angular/core'

import {
    Router,
} from '@angular/router'
import { TicketService } from '../../service/ticketservice'

import { FormControl, FormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { CalendarModule } from 'primeng/calendar'
import { InputGroupModule } from 'primeng/inputgroup'
import { InputGroupAddonModule } from 'primeng/inputgroupaddon'
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
import { StepGuardService, type CanComponentDeactivate  } from '@/app/servicios/step.guard'
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
        InputGroupModule,
        InputGroupAddonModule,
    ],
    templateUrl: './year.component.html',
    styleUrl: './year.component.scss',
})
export class YearComponent implements OnInit, CanComponentDeactivate  {
    hasUnsavedChanges  = true
    form: FormGroup
    calFasesFechasInformation: {
        iSedeId: string
        iYAcadId: string
        dtCalAcadInicio: Date
        dtCalAcadFin: Date
        dtCalAcadMatriculaInicio: Date
        dtCalAcadMatriculaFin: Date
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
        private stepGuardService: StepGuardService,
        private stepConfirmationService: StepConfirmationService,
        private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            fechaVigente: ['', Validators.required],
            fechaInicio: ['', Validators.required],
            // fechaFin: ['', Validators.required],
            // fechaMatriculaInicio: ['', Validators.required],
            fechaMatriculaFin: ['', Validators.required],
            fechaMatriculaRezagados: ['', Validators.required],
        })
    }

    @HostListener('window:beforeunload', ['$event'])
    onBeforeUnload(): void {
        // param: event: BeforeUnloadEvent
        sessionStorage.setItem('reloadDetected', 'true')
    }
    async ngOnInit() {
        // this.fasesPromocionales = await this.ticketService.getFasesFechas()
        console.log('reloadDetected')
        console.log(sessionStorage)

        if (
            sessionStorage.getItem('reloadDetected') &&
            sessionStorage.getItem('reloadDetected') == 'true'
        ) {
            this.router.navigate(['configuracion/configuracion/years'])
        }

        // Limpia la marca después de manejarla
        sessionStorage.removeItem('reloadDetected')

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

                dtFaseRegularInicio: value.fechaFaseRegularInicio,
                dtFaseRegularFin: value.fechaFaseRegularFin,
                dtFaserecuperacionInicio: value.fechaFaseRecuperacionInicio,
                dtFaserecuperacionFin: value.fechaFaseRecuperacionFin,
            }
            console.log(value)
        })

    }

    canDeactivate: () => Promise<boolean> = () => {
        // Solo se devuelve el método del servicio de guardia
        return this.stepGuardService.canDeactivate();
      };
    

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

            if (Array.isArray(fases_promocionales)) {
                const idExistsFases = fases_promocionales.map((faseExist) =>
                    String(faseExist.iFasePromId)
                )

                const noExistsFases = data.fasesProm.filter(
                    (fase) => !idExistsFases.includes(fase.iFasePromId)
                )

                console.log('ifo')

                console.log(
                    this.ticketService.registroInformation.stepYear
                        .fases_promocionales
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
                            new FormControl([
                                new Date(fase.dtFaseInicio),
                                new Date(fase.dtFaseFin),
                            ])
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

                    this.form
                        .get('faseInputInicio' + fase.iFasePromId)
                        .disable()
                    this.form.get('faseInputFin' + fase.iFasePromId).disable()
                })
            } else {
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

                    this.form
                        .get('faseInputInicio' + fase.iFasePromId)
                        .disable()
                    this.form.get('faseInputFin' + fase.iFasePromId).disable()
                })
            }

            this.form.patchValue({
                fechaVigente: fechaVigente ?? '',
                fechaInicio: (fechaInicio && [fechaInicio, fechaFin]) ?? '',
                fechaFin: fechaFin ?? '',
                fechaMatriculaInicio: matriculaInicio ?? '',
                fechaMatriculaFin:
                    (matriculaFin && [matriculaInicio, matriculaFin]) ?? '',
                fechaMatriculaRezagados:
                    (matriculaResagados && [
                        matriculaFin,
                        matriculaResagados,
                    ]) ??
                    '',
            })
        } else {
            this.form.patchValue({
                fechaVigente: data.yearAcad.cYAcadNombre,
                fechaInicio: [
                    new Date(data.yearAcad.dtYAcadInicio),
                    new Date(data.yearAcad.dYAcadFin),
                ],
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

    filterInputsByPrefix(obj, prefix) {
        const keysWithPrefix = Object.keys(obj).filter(
            (key) => key.startsWith(prefix) && obj[key].includes(true)
        )

        const faseChecks = keysWithPrefix
            .flatMap((keyFaseCheck) => obj[keyFaseCheck])
            .filter((fase) => typeof fase == 'object')

        const faseInputs = faseChecks.map((faseCheck) => ({
            iFasePromId: faseCheck.iFasePromId,
            dtFaseInicio: obj['faseInputInicio' + faseCheck.iFasePromId],
            dtFaseFin: obj['faseInputFin' + faseCheck.iFasePromId],
        }))

        return faseInputs
    }

    async saveInformation() {
        if (!this.ticketService.registroInformation.calendar.iCalAcadId) {
            await this.ticketService.insCalAcademico(this.form.value)
        } else {
            await this.ticketService.updCalAcademico(this.form.value)
            // await this.ticketService.updCalFasesProm(this.form.value)
        }

        const calFasesProm = this.filterInputsByPrefix(
            this.form.value,
            'faseCheck'
        ).map((fase) => ({
            iFasePromId: fase.iFasePromId,
            dtFaseInicio: fase.dtFaseInicio[0],
            dtFaseFin: fase.dtFaseInicio[1],
        }))

        const idCheckFases = calFasesProm.map((fase) =>
            Number(fase.iFasePromId)
        )

        console.log('Fases Prom')
        console.log(idCheckFases)
        console.log(calFasesProm)

        if (
            Array.isArray(
                this.ticketService.registroInformation.stepYear
                    .fases_promocionales
            )
        ) {
            const deleteCalFasesProm =
                this.ticketService.registroInformation.stepYear.fases_promocionales.filter(
                    (fase) => !idCheckFases.includes(fase.iFasePromId)
                )

            const idExistsFases =
                this.ticketService.registroInformation.stepYear.fases_promocionales.map(
                    (fase) => fase.iFasePromId
                )

            const insCalFasesProm = calFasesProm.filter(
                (fase) => !idExistsFases.includes(fase.iFasePromId)
            )

            const existCalFasesProm = calFasesProm.filter((fase) =>
                idExistsFases.includes(fase.iFasePromId)
            )

            if (insCalFasesProm.length > 0) {
                await this.ticketService.insCalFasesProm(insCalFasesProm)
            }

            if (deleteCalFasesProm.length > 0) {
                await this.ticketService.deleteCalFasesProm(deleteCalFasesProm)
            }

            if (existCalFasesProm.length > 0) {
                console.log('Actualizando')
                const updCalFasesProm =
                    this.ticketService.registroInformation.stepYear.fases_promocionales.map(
                        (fase) => {
                            const obj = existCalFasesProm.find(
                                (existCalFaseProm) =>
                                    existCalFaseProm.iFasePromId ==
                                    fase.iFasePromId
                            )

                            console.log('Fase a actualizar')

                            console.log(fase)

                            return obj
                                ? {
                                      iFaseId: fase.iFaseId,
                                      iFasePromId: obj.iFasePromId,
                                      dtFaseInicio: obj.dtFaseInicio,
                                      dtFaseFin: obj.dtFaseFin,
                                  }
                                : fase
                        }
                    )
                await this.ticketService.updCalFasesProm(updCalFasesProm)
            }
        } else {
            await this.ticketService.insCalFasesProm(calFasesProm)
        }

        await this.ticketService.setCalendar()
    }

    async nextPage() {
        this.router.navigate([
            'configuracion/configuracion/registro/dias-laborales',
        ])
    }
}
