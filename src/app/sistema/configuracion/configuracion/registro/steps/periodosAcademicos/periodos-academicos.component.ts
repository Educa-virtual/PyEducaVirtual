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
import { TicketService, type ArrayElement } from '../../service/ticketservice'
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

    ciclosAcademicos

    cicloAcademicoModal: ArrayElement<
        typeof this.ticketService.registroInformation.stepPeriodosAcademicos
    >

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
                        cPeriodoEvalNombre: '',
                    })
                )
        }

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

    nextPage() {
        this.router.navigate(['configuracion/configuracion/registro/resumen'])
    }

    prevPage() {
        this.router.navigate(['configuracion/configuracion/registro/turnos'])
    }

    saveInformation() {
        if (Array.isArray(this.ticketService.registroInformation.stepPeriodosAcademicos)) {
            this.ticketService.updPeriodosFormativos()
        }else{
            this.ticketService.insPeriodosFormativos(this.ciclosAcademicos, this.faseCurrent)
        }
    }

    // createPeriodosAcademicos() {
    //     let periodosAcademicos = this.cicloAcademicoModal.ciclosAcademicos.map(
    //         (ciclo) => ({
    //             // iFaseId: this.ticketService.registroInformation.stepYear.fases_promocionales.iFaseId,
    //             iPeriodoEvalId: ciclo.iPeriodoEvalId,
    //             dtPeriodoEvalAperInicio: this.ticketService.toSQLDatetimeFormat(
    //                 ciclo.StartDate
    //             ),
    //             dtPeriodoEvalAperFin: this.ticketService.toSQLDatetimeFormat(
    //                 ciclo.EndDate
    //             ),
    //         })
    //     )

    //     console.log(periodosAcademicos)

    //     this.httpService
    //         .postData('acad/calendarioAcademico/addCalAcademico', {
    //             json: JSON.stringify(periodosAcademicos),
    //             _opcion: 'addCalPeriodoEval',
    //         })
    //         .subscribe({
    //             next: (data: any) => {},
    //             error: (error) => {
    //                 console.error('Error fetching modalidades:', error)
    //             },
    //             complete: () => {
    //                 console.log('Request completed')
    //             },
    //         })
    // }

    // updatePeriodosAcademicos() {
    //     this.periodosInformation.map((periodo) => {
    //         this.httpService
    //             .postData('acad/calendarioAcademico/addCalAcademico', {
    //                 json: JSON.stringify({
    //                     iPeriodoEvalAperId: periodo.iPeriodoEvalAperId,
    //                 }),
    //                 _opcion: 'deleteCalPeriodo',
    //             })
    //             .subscribe({
    //                 next: () => {},
    //                 error: (error) => {
    //                     console.error('Error fetching modalidades:', error)
    //                 },
    //                 complete: () => {
    //                     console.log('Request completed')
    //                 },
    //             })
    //     })

    //     this.createPeriodosAcademicos()
    //     this.getCalendarioPeriodosAcademicos()
    //     this.hiddenDialog()
    // }

    // updatePeriodosAcademicos() {

    //     let periodosAcademicos = this.cicloAcademicoModal.ciclosAcademicos.map((ciclo) => ({
    //         iFaseId: this.ticketService.registroInformation.stepYear.fases_promocional.iFaseId,
    //         iPeriodoEvalId: ciclo.iPeriodoEvalId,
    //         dtPeriodoEvalAperInicio: ciclo.StartDate,
    //         dtPeriodoEvalAperFin: ciclo.EndDate,

    //     }))

    //     console.log('Editando')
    //     console.log(this.cicloAcademicoModal)
    //     this.httpService
    //     .postData('acad/calendarioAcademico/addCalAcademico', {
    //         json: JSON.stringify({
    //             iCalAcadId:
    //                 this.ticketService.registroInformation.calendar
    //                     .iCalAcadId,
    //         }),
    //         _opcion: 'updateCalPeriodoEval',
    //     })
    //     .subscribe({
    //         next: (data: any) => {

    //         },
    //         error: (error) => {
    //             console.error('Error fetching modalidades:', error)
    //         },
    //         complete: () => {
    //             console.log('Request completed')
    //         },
    //     })
    // }

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
        const fechas = this.ticketService.calculandoPeriodosFormativos(
            periodo,
            this.faseCurrent
        )
        let periodoType

        switch (periodo.iPeriodoEvalCantidad) {
            case "2":
                periodoType = 'semestre'
                break
            case "3":
                periodoType = 'trimestre'
                break
            case "6":
                periodoType = 'bimestre'
                break
            default:
                periodoType = ''
                break
        }

        this.ciclosAcademicos = fechas.map((fecha, index) => ({
            index: index + 1,
            periodoType: `${index + 1}° ${periodoType}`,
            startDateVisual: this.ticketService.toVisualFechasFormat(
                fecha.inicio,
                'DD/MM/YYYY'
            ),
            starDate: fecha.inicio,
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

                    let filterFasePeriodo = data.data[0]

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

    handleActionFase(row) {
        const actions = {
            editar: () => {
                console.log('Editando')
                // this.visible = true


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
            ver: () => {
                // Lógica para la acción "ver"
                console.log('Viendo')
            },
            editar: () => {
                // Lógica para la acción "editar"
                console.log('Editando')
                console.log(row.item)
                this.showDialogEditPeriodo()
                this.formPeriodo.patchValue({
                    id: row.item.iPeriodoEvalAperId,
                    periodo: row.item.PeriodType,
                    fechaInicio: new Date(row.item.StartDate),
                    fechaFin: new Date(row.item.EndDate),
                })

                this.formPeriodo.get('periodo').disable()
            },
            eliminar: () => {
                // Lógica para la acción "eliminar"
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
    }

    saveInformationEdit() {
        this.httpService
            .postData('acad/calendarioAcademico/addCalAcademico', {
                json: JSON.stringify({
                    // iFaseId: this.ticketService.registroInformation.stepYear.fases_promocionales.iFaseId,
                    iPeriodoEvalAperId: String(
                        this.formPeriodo.get('id').value
                    ),
                    dtPeriodoEvalAperInicio:
                        this.ticketService.toSQLDatetimeFormat(
                            this.formPeriodo.get('fechaInicio').value
                        ),
                    dtPeriodoEvalAperFin:
                        this.ticketService.toSQLDatetimeFormat(
                            this.formPeriodo.get('fechaFin').value
                        ),
                }),
                _opcion: 'updateCalPeriodoEval',
            })
            .subscribe({
                next: (data: any) => {},
                error: (error) => {
                    console.error('Error fetching turnos:', error)
                    this.getCalendarioPeriodosAcademicos()
                    this.handleActionFase('')
                },
                complete: () => {
                    console.log('Request completed')
                },
            })

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
