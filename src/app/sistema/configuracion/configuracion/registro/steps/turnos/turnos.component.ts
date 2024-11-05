import { StepConfirmationService, type informationMessage } from '@/app/servicios/confirm.service'
import { GeneralService } from '@/app/servicios/general.service'
import { IActionTable, IColumn, TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { Component, OnChanges, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
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
export class TurnosComponent implements OnInit, OnChanges {
    turnos: {
        iTurnoId: string
        cTurnoNombre: string
    }[]

    labelSaveModal
    modalidadServicio: typeof this.ticketService.registroInformation.stepFormasAtencion

    modalidades: {
        iModalServId: string
        cModalServNombre: string
    }[]
    form: FormGroup

    visible: boolean = false

    formasAtencionModal: ArrayElement<typeof this.ticketService.registroInformation.stepFormasAtencion>;


    formasAtencionInformation

    constructor(
        private httpService: httpService,
        public ticketService: TicketService,
        private stepConfirmationService: StepConfirmationService,

        private router: Router,
        private fb: FormBuilder,
        private generalService: GeneralService
    ) {
        this.form = this.fb.group({
            turno: [''],
            modalidad: [''],
            horaInicio: [''],
            horaFin: [''],
        })
    }

    nextPage() {
        this.router.navigate([
            'configuracion/configuracion/registro/periodosAcademicos',
        ])
    }

    prevPage() {
        this.router.navigate([
            'configuracion/configuracion/registro/diasLaborales',
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
                this.ticketService.setTicketInformation('edit','modal')

                this.showDialog()

                this.formasAtencionModal = {
                    ...this.formasAtencionModal,
                    iCalTurnoId: row.item.iCalTurnoId,

                }

                this.form.setValue({
                    turno: {
                        iTurnoId: row.item.iTurnoId,
                        cTurnoNombre: row.item.cTurnoNombre,
                    },
                    modalidad: {
                        iModalServId: row.item.iModalServId,
                        cModalServNombre: row.item.cModalServNombre,
                    },
                    horaInicio: row.item.dtAperTurnoInicio,
                    horaFin: row.item.dtAperTurnoFin,
                })
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
                    [() => this.deleteFormasAtencion(row.item.iCalTurnoId), () => this.getFormasAtencion()], message
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

    indexColumns() {
        this.formasAtencionInformation = this.ticketService
            .getTicketInformation()
            .stepFormasAtencion.map((turno, index) => ({
                ...turno,
                index: index + 1,
                cModalServNombre: this.ticketService.capitalize(
                    turno.cModalServNombre
                ),
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

    saveInformation() {
        this.indexColumns()

        if(this.ticketService.registroInformation.modal == 'create'){
            this.createFormasAtencion()
            this.hiddenDialog()
            return;
        }

        if (this.ticketService.registroInformation.mode == 'create') {
            this.createFormasAtencion()
        }

        if (this.ticketService.registroInformation.mode == 'edit') {
            this.updateFormasAtencion()
        }

        this.hiddenDialog()
    }

    showModeCreateDialog(){
        this.ticketService.setTicketInformation('create','modal')

        this.showDialog()
    }

    createFormasAtencion() {
        this.httpService
            .postData('acad/calendarioAcademico/addCalAcademico', {
                json: JSON.stringify({
                    iTurnoId: this.formasAtencionModal.iTurnoId,
                    iModalServId: this.formasAtencionModal.iModalServId,
                    iCalAcadId:
                        this.ticketService.registroInformation.calendar
                            .iCalAcadId,
                    dtAperTurnoInicio:
                        this.ticketService.convertToSQLDateTime(this.formasAtencionModal.dtAperTurnoInicio),
                    dtAperTurnoFin: this.ticketService.convertToSQLDateTime(this.formasAtencionModal.dtAperTurnoFin),
                }),
                _opcion: 'addCalTurno',
            })
            .subscribe({
                next: (data: any) => {
                    // this.modalidades = data.data

                },
                error: (error) => {
                    console.error('Error fetching turnos:', error)
                    // ? Mover hasta que la consulta no de error
                    this.getFormasAtencion()
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    updateFormasAtencion() {

        console.log(this.formasAtencionModal)

        let formasAtencion =
            this.ticketService.registroInformation.stepFormasAtencion.map(
                (formaAtencion) => ({
                    iCalTurnoId: this.formasAtencionModal.iCalTurnoId,
                    iTurnoId: this.formasAtencionModal.iTurnoId,
                    iModalServId: this.formasAtencionModal.iModalServId,
                    iCalAcadId:
                        this.ticketService.registroInformation.calendar
                            .iCalAcadId,
                    dtAperTurnoInicio: this.ticketService.convertToSQLDateTime(this.formasAtencionModal.dtAperTurnoInicio),
                    dtAperTurnoFin: this.ticketService.convertToSQLDateTime(this.formasAtencionModal.dtAperTurnoFin),
                })
            )

        this.httpService
            .postData('acad/calendarioAcademico/addCalAcademico', {
                json: JSON.stringify(formasAtencion),
                _opcion: 'updateCalTurno',
            })
            .subscribe({
                next: (data: any) => {
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

    deleteFormasAtencion(iCalTurnoId){


        this.httpService
            .postData('acad/calendarioAcademico/addCalAcademico', {
                json: JSON.stringify({
                    iCalTurnoId: iCalTurnoId
                }),
                _opcion: 'deleteCalTurno',
            })
            .subscribe({
                next: (data: any) => {
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

    hiddenDialog() {
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

                    console.log(this.ticketService.registroInformation.stepFormasAtencion)
                },

                error: (error) => {
                    console.error('Error fetching turnos:', error)
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    ngOnInit() {
        if (!this.ticketService.registroInformation) {
            this.router.navigate(['configuracion/configuracion/years'])

            return
        }
        if (!this.ticketService.registroInformation.stepFormasAtencion) {
            this.ticketService.registroInformation.stepFormasAtencion = []
        }

        this.form.valueChanges.subscribe((value) => {
            this.formasAtencionModal = {
                ...this.formasAtencionModal,
                iModalServId: value.modalidad.iModalServId,
                cModalServNombre: value.modalidad.cModalServNombre,
                iTurnoId: value.turno.iTurnoId,
                cTurnoNombre: value.turno.cTurnoNombre,
                dtAperTurnoInicio: value.horaInicio,
                dtAperTurnoFin: value.horaFin,
            }

            console.log(value)
        })

        this.generalService.getModalidad().subscribe({
            next: (data: any) => {
                this.modalidades = data.data.map((modalidad) => ({
                    iModalServId: modalidad.iModalServId,
                    cModalServNombre: this.ticketService.capitalize(
                        modalidad.cModalServNombre
                    ),
                }))
            },
            error: (error) => {
                console.error('Error fetching turnos:', error)
            },
            complete: () => {
                console.log('Request completed')
            },
        })

        this.generalService.getTurno().subscribe({
            next: (data: any) => {
                this.turnos = data.data.map((turno) => ({
                    iTurnoId: turno.iTurnoId,
                    cTurnoNombre: this.ticketService.capitalize(
                        turno.cTurnoNombre
                    ),
                }))
                // console.log(this.turnos);
            },
            error: (error) => {
                console.error('Error fetching turnos:', error)
            },
            complete: () => {
                console.log('Request completed')
            },
        })

        if (this.ticketService.registroInformation?.mode == 'edit') {
            this.getFormasAtencion()
        }

        this.indexColumns()
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

    ngOnChanges(changes) {}
}
