import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { Component, OnInit } from '@angular/core'

import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms'
import { Router } from '@angular/router'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { DropdownModule } from 'primeng/dropdown'
import { httpService } from '../../../http/httpService'
import { TicketService } from '../../service/ticketservice'
import { FloatLabelModule } from 'primeng/floatlabel'
import { IActionTable } from '@/app/shared/table-primeng/table-primeng.component'
import { InputTextModule } from 'primeng/inputtext'
import { CalendarModule } from 'primeng/calendar'

@Component({
    selector: 'app-periodos-academicos',
    standalone: true,
    imports: [
        TablePrimengComponent,
        ButtonModule,
        ReactiveFormsModule,
        FormsModule,
        DialogModule,
        DropdownModule,
        FloatLabelModule,
        InputTextModule,
        CalendarModule,
    ],
    templateUrl: './periodos-academicos.component.html',
    styleUrl: './periodos-academicos.component.scss',
})
export class PeriodosAcademicosComponent implements OnInit {
    periodosAcademicos: {
        iPeriodoEvalId: string
        cPeriodoEvalNombre: string
        cPeriodoEvalLetra: string
        cPeriodoEvalCantidad: string
    }[]

    fasesPromocionales

    faseCurrent

    periodoCurrent

    ciclosAcademicos

    fechasCalculadas

    form: FormGroup

    visibleEditPeriodo: boolean = false
    formPeriodo: FormGroup
    visible: boolean = false

    periodosInformation
    constructor(
        private httpService: httpService,
        public ticketService: TicketService,
        private router: Router,
        private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            periodo: [''],
            cicloAcademico: [''],
        })

        this.formPeriodo = this.fb.group({
            id: [''],
            periodo: [''],
            fechaInicio: [''],
            fechaFin: [''],
        })
    }

    async ngOnInit() {
        if (!this.ticketService.registroInformation) {
            this.router.navigate(['configuracion/configuracion/years'])

            return
        }

        await this.setFasesPromocionales()

        this.periodosAcademicos = (
            await this.ticketService.selPeriodosFormativos()
        ).data

        this.form.valueChanges.subscribe((value) => {
            console.log(value)
        })

        this.formPeriodo.valueChanges.subscribe((value) => {
            console.log(value)
        })
    }

    async setFasesPromocionales() {
        if (
            Array.isArray(
                this.ticketService.registroInformation.stepYear
                    .fases_promocionales
            )
        ) {
            this.fasesPromocionales =
                this.ticketService.registroInformation.stepYear.fases_promocionales.map(
                    (fase, index) => ({
                        index: index + 1,
                        id: fase.iFaseId,
                        cPeriodoEvalNombre: fase.cPeriodoEvalNombre,
                        cFasePromNombre: fase.cFasePromNombre,
                        dtFaseInicioVisual:
                            this.ticketService.toVisualFechasFormat(
                                fase.dtFaseInicio,
                                'DD/MM/YYYY'
                            ),
                        dtFaseInicio: fase.dtFaseInicio,
                        dtFaseFin: fase.dtFaseFin,
                        dtFaseFinVisual:
                            this.ticketService.toVisualFechasFormat(
                                fase.dtFaseFin,
                                'DD/MM/YYYY'
                            ),
                    })
                )
        }
    }

    nextPage() {
        this.router.navigate(['configuracion/configuracion/registro/resumen'])
    }

    prevPage() {
        this.router.navigate(['configuracion/configuracion/registro/turnos'])
    }

    async saveInformation() {
        let periodo
        if (
            Array.isArray(
                this.ticketService.registroInformation.stepPeriodosAcademicos
            )
        ) {
            periodo =
                this.ticketService.registroInformation.stepPeriodosAcademicos.filter(
                    (periodo) => periodo.iFaseId == this.faseCurrent.id
                )
        }

        if (periodo && periodo.length > 0) {
            await this.ticketService.deleteCalPeriodosFormativos(periodo)
        }

        await this.ticketService.insPeriodosFormativos(
            this.ciclosAcademicos,
            this.faseCurrent,
            this.periodoCurrent
        )

        await this.ticketService.setCalendar()

        await this.setFasesPromocionales()

        this.hiddenDialog()
    }
    showDialog() {
        this.visible = true
    }

    hiddenDialog() {
        this.visible = false
    }

    showDialogEditPeriodo() {
        this.visibleEditPeriodo = true
    }

    hiddenDialogEditPeriodo() {
        this.visibleEditPeriodo = false
    }

    indexColumns() {}

    setPeriodoFormativo(periodo) {
        this.fechasCalculadas = this.ticketService.calculandoPeriodosFormativos(
            periodo,
            this.faseCurrent
        )
        this.periodoCurrent = periodo

        let periodoType

        console.log(this.fechasCalculadas)

        switch (periodo.iPeriodoEvalCantidad) {
            case '6':
                periodoType = 'semestre'
                break
            case '3':
                periodoType = 'trimestre'
                break
            case '2':
                periodoType = 'bimestre'
                break
            default:
                periodoType = ''
                break
        }

        this.ciclosAcademicos = this.fechasCalculadas.map((fecha, index) => ({
            index: index + 1,
            periodoType: `${index + 1}° ${periodoType}`,
            startDateVisual: this.ticketService.toVisualFechasFormat(
                fecha.inicio,
                'DD/MM/YYYY'
            ),
            startDate: fecha.inicio,
            endDateVisual: this.ticketService.toVisualFechasFormat(
                fecha.fin,
                'DD/MM/YYYY'
            ),
            endDate: fecha.fin,
        }))
    }

    getCalendarioPeriodosAcademicos() {
        this.httpService
            .postData('acad/calendarioAcademico/addCalAcademico', {
                json: JSON.stringify({
                    iCalAcadId:
                        this.ticketService.registroInformation.calendar
                            .iCalAcadId,
                }),
                _opcion: 'getCalendarioPeriodos',
            })
            .subscribe({
                next: (data: any) => {
                    // let periodosAcademicos: Array<any> = JSON.parse(
                    //     data.data[0]['calPeriodos']
                    // )
                    console.log('Periodos')

                    const filterFasePeriodo = data.data[0]

                    this.periodosInformation = JSON.parse(
                        filterFasePeriodo['periodo']
                    )

                    console.log(this.periodosInformation)

                    // this.fasesPromocionales[0].cPeriodoEvalNombre = ""
                },
                error: (error) => {
                    console.error('Error fetching modalidades:', error)
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    setPeriodosFormativos() {
        let periodo

        if (
            Array.isArray(
                this.ticketService.registroInformation.stepPeriodosAcademicos
            )
        ) {
            console.log('Ciclos academicos')
            console.log(
                this.ticketService.registroInformation.stepPeriodosAcademicos
            )
            console.log('Fase actual')
            console.log(this.faseCurrent)

            periodo =
                this.ticketService.registroInformation.stepPeriodosAcademicos.filter(
                    (periodo) => periodo.iFaseId == this.faseCurrent.id
                )

            console.log('periodos a setear')
            console.log(periodo)

            this.ciclosAcademicos = periodo.map((fase, index) => {
                let nombrePeriodo = ''

                switch (fase.iPeriodoEvalCantidad) {
                    case 6:
                        nombrePeriodo = 'Semestre'
                        break
                    case 3:
                        nombrePeriodo = 'Trimestre'
                        break
                    case 2:
                        nombrePeriodo = 'Bimestre'
                        break
                    default:
                        nombrePeriodo = 'Otro' // O algún valor por defecto si el número no coincide
                        break
                }

                return {
                    index: index + 1,
                    periodoType: `${index + 1}° ${nombrePeriodo}`,
                    startDateVisual: this.ticketService.toVisualFechasFormat(
                        fase.dtPeriodoEvalAperInicio,
                        'DD/MM/YYYY'
                    ),
                    startDate: new Date(fase.dtPeriodoEvalAperInicio),
                    endDateVisual: this.ticketService.toVisualFechasFormat(
                        fase.dtPeriodoEvalAperFin,
                        'DD/MM/YYYY'
                    ),
                    endDate: new Date(fase.dtPeriodoEvalAperFin),
                }
            })
        }
    }

    handleActionFase(row) {
        const actions = {
            editar: () => {
                console.log('Editando')
                console.log(row.item)

                this.faseCurrent = row.item

                this.setPeriodosFormativos()

                console.log(this.ticketService.registroInformation)
            },
            eliminar: () => {
                console.log('Eliminando')
                console.log(row.item)
            },
        }

        const action = actions[row.accion]
        if (action) {
            action()
        } else {
            console.log(`Acción desconocida: ${row.action}`)
        }

        this.showDialog()
    }

    handleActionPeriodos(row) {
        console.log(row)
        const actions = {
            editar: () => {
                console.log('Editando periodo')
                console.log(row.item)
                this.showDialogEditPeriodo()
                this.formPeriodo.patchValue({
                    id: row.item.index,
                    periodo: row.item.periodoType,
                    fechaInicio: row.item.startDate,
                    fechaFin: row.item.endDate,
                })

                this.formPeriodo.get('periodo').disable()
            },
        }

        const action = actions[row.accion]
        if (action) {
            action()
        } else {
            console.log(`Acción desconocida: ${row.action}`)
        }
    }

    saveInformationEdit() {
        console.log('A editar:')
        console.log(this.ciclosAcademicos)
        console.log(this.formPeriodo.value)

        const index = this.ciclosAcademicos.findIndex(
            (ciclo) => ciclo.index == this.formPeriodo.value.id
        )

        if (index !== -1) {
            this.ciclosAcademicos[index].startDate = new Date(
                this.formPeriodo.value.fechaInicio
            )
            this.ciclosAcademicos[index].startDateVisual =
                this.ticketService.toVisualFechasFormat(
                    this.formPeriodo.value.fechaInicio,
                    'DD/MM/YYYY'
                )
            this.ciclosAcademicos[index].endDateVisual =
                this.ticketService.toVisualFechasFormat(
                    this.formPeriodo.value.fechaFin,
                    'DD/MM/YYYY'
                )
            this.ciclosAcademicos[index].endDate = new Date(
                this.formPeriodo.value.fechaFin
            )
        }
        console.log('cambio en el objeto')
        console.log(this.ciclosAcademicos)

        this.hiddenDialogEditPeriodo()
    }

    actionsFase: IActionTable[] = [
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

    actionPeriodo: IActionTable[] = [
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-pencil',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
    ]

    columnsPeriodosAcademicos = [
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
            field: 'cPeriodoEvalNombre',
            header: 'Periodo académico',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'dtFaseInicioVisual',
            header: 'Fecha inicio',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'dtFaseFinVisual',
            header: 'Fecha fin',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cFasePromNombre',
            header: 'Fase promocional',
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

    columnasCicloAcademico = [
        {
            type: 'text',
            width: '3rem',
            field: 'index',
            header: 'Nro',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'periodoType',
            header: 'Periodo de evaluación formativa',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'startDateVisual',
            header: 'Fecha inicio',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'endDateVisual',
            header: 'Fecha fin',
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
