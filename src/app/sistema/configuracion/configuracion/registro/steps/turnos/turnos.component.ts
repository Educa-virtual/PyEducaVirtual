import {
    StepConfirmationService,
    type informationMessage,
} from '@/app/servicios/confirm.service'
import {
    IActionTable,
    IColumn,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { Component, OnInit } from '@angular/core'
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms'
import { Router } from '@angular/router'
import { ButtonModule } from 'primeng/button'
import { CalendarModule } from 'primeng/calendar'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { DialogModule } from 'primeng/dialog'
import { DropdownModule } from 'primeng/dropdown'
import { FloatLabelModule } from 'primeng/floatlabel'
import { httpService } from '../../../http/httpService'
import { TicketService, type ArrayElement } from '../../service/ticketservice'

@Component({
    selector: 'app-turnos',
    standalone: true,
    imports: [
        TablePrimengComponent,
        ButtonModule,
        DialogModule,
        CalendarModule,
        DropdownModule,
        FloatLabelModule,
        ReactiveFormsModule,
        FormsModule,
        ConfirmDialogModule,
    ],
    templateUrl: './turnos.component.html',
    styleUrl: './turnos.component.scss',
})
export class TurnosComponent implements OnInit {
    turnos: {
        iTurnoId: string
        cTurnoNombre: string
    }[]

    defautTimeInicio = new Date('1900-01-01 07:00:00.000')
    defautTimeFin = new Date('1900-01-01 14:30:00.000')
    modalidadServicio: typeof this.ticketService.registroInformation.stepFormasAtencion

    modalidades: {
        iModalServId: string
        cModalServNombre: string
    }[]
    form: FormGroup

    visible: boolean = false

    formasAtencionModal: ArrayElement<
        typeof this.ticketService.registroInformation.stepFormasAtencion
    >

    formasAtencionInformation

    constructor(
        private httpService: httpService,
        public ticketService: TicketService,
        private stepConfirmationService: StepConfirmationService,

        private router: Router,
        private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            id: [''],
            turno: [''],
            modalidad: [''],
            horaInicio: [''],
            horaFin: [''],
        })
    }

    async ngOnInit() {
        if (!this.ticketService.registroInformation) {
            this.router.navigate(['configuracion/configuracion/years'])

            return
        }

        const data = await this.ticketService.selTurnosModalidades()
        this.turnos = data.data.turnos
        this.modalidades = data.data.modalidades

        await this.ticketService.setCalendar()

        console.log(this.ticketService.registroInformation.stepFormasAtencion)

        await this.setFormasAtencion()

        await this.indexColumns()
    }

    async setFormasAtencion() {
        this.formasAtencionInformation =
            this.ticketService.registroInformation.stepFormasAtencion
    }

    nextPage() {
        this.router.navigate([
            'configuracion/configuracion/registro/periodos-academicos',
        ])
    }

    prevPage() {
        this.router.navigate([
            'configuracion/configuracion/registro/dias-laborales',
        ])
    }

    handleActions(row) {
        console.log(row)
        const actions = {
            ver: () => {
                // Lógica para la acción "ver"
                console.log('Viendo')
            },
            editar: () => {
                // Lógica para la acción "editar"
                console.log('Editando')
                console.log(row.item)

                this.showDialog()

                console.log(this.turnos)
                console.log(this.modalidades)

                this.form.patchValue({
                    id: row.item.iCalTurnoId,
                    turno: {
                        iTurnoId: String(row.item.iTurnoId),
                        cTurnoNombre: row.item.cTurnoNombre,
                    },
                    modalidad: {
                        iModalServId: String(row.item.iModalServId),
                        cModalServNombre: row.item.cModalServNombre,
                    },
                    horaInicio: row.item.dtAperTurnoInicio,
                    horaFin: row.item.dtAperTurnoFin,
                })
                console.log(this.form.value)
            },
            eliminar: () => {
                // Lógica para la acción "eliminar"
                console.log('Eliminando')
                console.log(row.item)
                const message: informationMessage = {
                    header: '¿Esta seguro de eliminar el turno?',
                    message: 'Por favor, confirme para continuar.',
                    accept: {
                        severity: 'success',
                        summary: 'Turno',
                        detail: 'Se ha eliminado correctamente.',
                        life: 3000,
                    },
                    reject: {
                        severity: 'info',
                        summary: 'Turno',
                        detail: 'Se ha cancelado eliminar.',
                        life: 3000,
                    },
                }

                this.stepConfirmationService.confirmAction(
                    {
                        onAcceptPromises: [
                            () =>
                                this.ticketService.deleteFormasAtencion(
                                    row.item
                                ),
                            () => this.ticketService.setCalendar(),
                            () => this.setFormasAtencion(),
                            () => this.indexColumns(),
                        ],
                    },
                    message
                )
            },
        }

        const action = actions[row.accion]
        if (action) {
            action()
        } else {
            console.log(`Acción desconocida: ${row.action}`)
        }
    }

    async indexColumns() {
        if (
            Array.isArray(
                this.ticketService.registroInformation.stepFormasAtencion
            )
        ) {
            this.formasAtencionInformation = this.ticketService
                .getTicketInformation()
                .stepFormasAtencion.map((turno, index) => ({
                    ...turno,
                    index: index + 1,
                    cModalServNombre: turno.cModalServNombre,
                    dtAperTurnoInicio: this.ticketService.toVisualFechasFormat(
                        turno.dtAperTurnoInicio,
                        'hh:mm'
                    ),
                    dtAperTurnoFin: this.ticketService.toVisualFechasFormat(
                        turno.dtAperTurnoFin,
                        'hh:mm'
                    ),
                }))
        }
    }

    async saveInformation() {
        if (this.form.value.id) {
            await this.ticketService.updFormasAtencion(this.form.value)
        } else {
            await this.ticketService.insCalFormasAtencion(this.form.value)
        }

        await this.hiddenDialog()

        await this.ticketService.setCalendar()

        await this.setFormasAtencion()

        await this.indexColumns()

        this.form.reset()
    }

    showModeCreateDialog() {
        this.form.reset()
        this.showDialog()
    }

    updateFormasAtencion() {
        console.log(this.formasAtencionModal)

        const formasAtencion =
            this.ticketService.registroInformation.stepFormasAtencion.map(
                () => ({
                    iCalTurnoId: this.formasAtencionModal.iCalTurnoId,
                    iTurnoId: this.formasAtencionModal.iTurnoId,
                    iModalServId: this.formasAtencionModal.iModalServId,
                    iCalAcadId:
                        this.ticketService.registroInformation.calendar
                            .iCalAcadId,
                    dtAperTurnoInicio: this.ticketService.convertToSQLDateTime(
                        this.formasAtencionModal.dtAperTurnoInicio
                    ),
                    dtAperTurnoFin: this.ticketService.convertToSQLDateTime(
                        this.formasAtencionModal.dtAperTurnoFin
                    ),
                })
            )

        this.httpService
            .postData('acad/calendarioAcademico/addCalAcademico', {
                json: JSON.stringify(formasAtencion),
                _opcion: 'updateCalTurno',
            })
            .subscribe({
                next: () => {
                    // this.modalidades = data.data
                },
                error: (error) => {
                    console.error('Error fetching turnos:', error)
                    // ? Mover cuando la consulta no de errores
                    this.getFormasAtencion()
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    deleteFormasAtencion(iCalTurnoId) {
        this.httpService
            .postData('acad/calendarioAcademico/addCalAcademico', {
                json: JSON.stringify({
                    iCalTurnoId: iCalTurnoId,
                }),
                _opcion: 'deleteCalTurno',
            })
            .subscribe({
                next: () => {
                    // this.modalidades = data.data
                },
                error: (error) => {
                    console.error('Error fetching turnos:', error)
                    // ? Mover cuando la consulta no de errores
                    this.getFormasAtencion()
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    showDialog() {
        this.visible = true
    }

    async hiddenDialog() {
        this.visible = false
    }

    getFormasAtencion() {
        this.httpService
            .postData('acad/calendarioAcademico/addCalAcademico', {
                json: JSON.stringify({
                    iCalAcadId:
                        this.ticketService.registroInformation.calendar
                            .iCalAcadId,
                }),
                _opcion: 'getCalendarioTurnos',
            })
            .subscribe({
                next: (data: any) => {
                    console.log('Formas de atencion')
                    console.log(data)

                    this.ticketService.setTicketInformation(
                        data.data.map((turno) => ({
                            iCalTurnoId: turno.iCalTurnoId,
                            iTurnoId: turno.iTurnoId,
                            iModalServId: turno.iModalServId,
                            iCalAcadId: turno.iCalAcadId,
                            dtTurnoInicia: turno.dtTurnoInicia,
                            dtTurnoFin: turno.dtTurnoFin,
                            cModalServNombre: turno.cModalServNombre,
                            cTurnoNombre: turno.cTurnoNombre,
                            dtAperTurnoInicio: turno.dtAperTurnoInicio,
                            dtAperTurnoFin: turno.dtAperTurnoFin,
                        })),
                        'stepFormasAtencion'
                    )

                    this.indexColumns()

                    console.log(
                        this.ticketService.registroInformation
                            .stepFormasAtencion
                    )
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
            labelTooltip: 'Editar',
            icon: 'pi pi-pencil',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
        {
            labelTooltip: 'Eliminar',
            icon: 'pi pi-trash',
            accion: 'eliminar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
    ]

    columns: IColumn[] = [
        {
            type: 'text',
            width: '5rem',
            field: 'index',
            header: 'Nro',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cTurnoNombre',
            header: 'Turno',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cModalServNombre',
            header: 'Modalidad',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '8rem',
            field: 'dtAperTurnoInicio',
            header: 'Hora inicio',
            text_header: 'Hora inicio',
            text: 'left',
        },
        {
            type: 'text',
            width: '8rem',
            field: 'dtAperTurnoFin',
            header: 'Hora fin',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'actions',
            width: '3rem',
            field: 'actions',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ]
}
