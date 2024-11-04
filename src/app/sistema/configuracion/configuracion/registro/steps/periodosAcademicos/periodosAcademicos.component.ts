import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'

import { httpService } from '../../../http/httpService'
import { ButtonModule } from 'primeng/button'
import { TicketService, type ArrayElement } from '../../service/ticketservice'
import { Router } from '@angular/router'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { DialogModule } from 'primeng/dialog'
import { DropdownModule } from 'primeng/dropdown'
import { FormsModule } from '@angular/forms'

import { IActionTable } from '@/app/shared/table-primeng/table-primeng.component'
import { CheckboxModule } from 'primeng/checkbox'
import { IColumn } from '@/app/shared/table-primeng/table-primeng.component'

@Component({
    selector: 'app-periodosAcademicos',
    standalone: true,
    imports: [
        TablePrimengComponent,
        ButtonModule,
        ReactiveFormsModule,
        FormsModule,
        DialogModule,
        DropdownModule,
    ],
    templateUrl: './periodosAcademicos.component.html',
    styleUrl: './periodosAcademicos.component.scss',
})
export class PeriodosAcademicosComponent implements OnInit, OnChanges {
    periodosAcademicos: {
        iPeriodoEvalId: string
        cPeriodoEvalNombre: string
        cPeriodoEvalLetra: string
        cPeriodoEvalCantidad: string
    }[]

    fasesPromocionales = [
        {
            iFaseId:
                this.ticketService.registroInformation.stepYear
                    .fases_promocional.iFaseId,
            cFasePromNombre:
                this.ticketService.registroInformation.stepYear
                    .fases_promocional.cFasePromNombre,
            dtFaseInicio: this.ticketService.toVisualFechasFormat(
                this.ticketService.registroInformation.stepYear
                    .fases_promocional.dtFaseInicio,
                'DD/MM/YYYY'
            ),
            dtFaseFin: this.ticketService.toVisualFechasFormat(
                this.ticketService.registroInformation.stepYear
                    .fases_promocional.dtFaseFin,
                'DD/MM/YYYY'
            ),
            iPeriodoEvalId: '',
            cPeriodoEvalNombre: null,
        },
    ]

    ciclosAcademicos

    cicloAcademicoModal: ArrayElement<
        typeof this.ticketService.registroInformation.stepPeriodosAcademicos
    >

    form: FormGroup
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
    }

    nextPage() {
        this.router.navigate(['configuracion/configuracion/registro/resumen'])
    }

    prevPage() {
        this.router.navigate(['configuracion/configuracion/registro/turnos'])
    }


    saveInformation() {
        if (this.ticketService.registroInformation.mode == 'create') {
            this.createPeriodosAcademicos()
        }

        if (this.ticketService.registroInformation.mode == 'edit') {
            this.updatePeriodosAcademicos()
        }
    }

    createPeriodosAcademicos() {
        
        let periodosAcademicos = this.cicloAcademicoModal.ciclosAcademicos.map(
            (ciclo) => ({
                iFaseId: this.ticketService.registroInformation.stepYear.fases_promocional.iFaseId,
                iPeriodoEvalId: ciclo.iPeriodoEvalId,
                dtPeriodoEvalAperInicio: this.ticketService.toSQLDatetimeFormat(ciclo.StartDate),
                dtPeriodoEvalAperFin: this.ticketService.toSQLDatetimeFormat(ciclo.EndDate),
            })
        )

        console.log(periodosAcademicos)

        this.httpService
            .postData('acad/calendarioAcademico/addCalAcademico', {
                json: JSON.stringify(periodosAcademicos),
                _opcion: 'addCalPeriodoEval',
            })
            .subscribe({
                next: (data: any) => {},
                error: (error) => {
                    console.error('Error fetching modalidades:', error)
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    updatePeriodosAcademicos(){

        this.periodosInformation.map((periodo) => {
            this.httpService
        .postData('acad/calendarioAcademico/addCalAcademico', {
            json: JSON.stringify({
                iPeriodoEvalAperId: periodo.iPeriodoEvalAperId,
            }),
            _opcion: 'deleteCalPeriodo',
        })
        .subscribe({
            next: (data: any) => {

            },
            error: (error) => {
                console.error('Error fetching modalidades:', error)
            },
            complete: () => {
                console.log('Request completed')
            },
        })
        })


        this.createPeriodosAcademicos()
        this.getCalendarioPeriodosAcademicos()
        this.hiddenDialog()
    }

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

    hiddenDialog(){
        this.visible = false
    }

    indexColumns() {

    }

    calculandoCicloAcademico(value) {
        console.log('Calculando')
        console.log(value)

        this.fasesPromocionales[0].iPeriodoEvalId = value.iPeriodoEvalId
        this.fasesPromocionales[0].cPeriodoEvalNombre = value.cPeriodoEvalNombre

        let periodosCalculados = this.ticketService.calcularFechaPeriodos(
            this.ticketService.registroInformation.stepYear.fases_promocional
                .dtFaseInicio,
            this.ticketService.registroInformation.stepYear.fases_promocional
                .dtFaseFin,
            this.cicloAcademicoModal.cPeriodoEvalNombre.toLocaleLowerCase()
        )

        this.cicloAcademicoModal = {
            ...this.cicloAcademicoModal,
            ciclosAcademicos: periodosCalculados.map((periodo, index) => ({
                index: index + 1,
                StartDate: periodo.fechaInicio,
                EndDate: periodo.fechaFin,
                EndDateVisual: this.ticketService.toVisualFechasFormat(
                    periodo.fechaFin,
                    'DD/MM/YYYY'
                ),

                StartDateVisual: this.ticketService.toVisualFechasFormat(
                    periodo.fechaInicio,
                    'DD/MM/YYYY'
                ),
                PeriodType: periodo.descripcion,
                iPeriodoEvalId: value.iPeriodoEvalId,
            })),
        }
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
                    console.log('Periodos');

                    let filterFasePeriodo = data.data[0]

                    this.periodosInformation = JSON.parse(filterFasePeriodo["periodo"])
                    
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

    ngOnInit() {
        if (!this.ticketService.registroInformation) {
            this.router.navigate(['configuracion/configuracion/years'])

            return
        }
        if (!this.ticketService.registroInformation.stepPeriodosAcademicos) {
            this.ticketService.registroInformation.stepPeriodosAcademicos = []
        }

        this.form.valueChanges.subscribe((value) => {
            this.cicloAcademicoModal = {
                ...this.cicloAcademicoModal,
                cPeriodoEvalLetra: value.periodo.cPeriodoEvalLetra,
                cPeriodoEvalNombre: value.periodo.cPeriodoEvalNombre,
                iPeriodoEvalCantidad: value.periodo.iPeriodoEvalCantidad,
                iPeriodoEvalId: value.periodo.iPeriodoEvalId,
            }

            console.log(value)
        })

        this.httpService
            .postData('acad/calendarioAcademico/addCalAcademico', {
                json: JSON.stringify({
                    jmod: 'acad',
                    jtable: 'periodo_evaluaciones',
                }),
                _opcion: 'getConsulta',
            })
            .subscribe({
                next: (data: any) => {
                    this.periodosAcademicos = data.data.filter(
                        (periodo) => periodo.iPeriodoEvalCantidad != '0'
                    )

                    console.log(this.periodosAcademicos)
                },
                error: (error) => {
                    console.error('Error fetching modalidades:', error)
                },
                complete: () => {
                    console.log('Request completed')
                },
            })

        if (this.ticketService.registroInformation.mode == 'edit') {
            this.getCalendarioPeriodosAcademicos()
        }
    }

    handleActions(actions) {
        console.log(actions)
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

    columnsPeriodosAcademicos = [
        {
            type: 'text',
            width: '5rem',
            field: 'iFaseId',
            header: 'Nro',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cFasePromNombre',
            header: 'Periodo evaluaciones formativas',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'dtFaseInicio',
            header: 'Fecha inicio',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'dtFaseFin',
            header: 'Fecha fin',
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
            field: 'PeriodType',
            header: 'Periodo de evaluación formativa',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'StartDateVisual',
            header: 'Fecha inicio',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'EndDateVisual',
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
    ngOnChanges(changes) {}
}
