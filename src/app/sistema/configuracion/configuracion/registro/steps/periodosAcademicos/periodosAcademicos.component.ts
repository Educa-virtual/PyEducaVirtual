import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { Component, OnChanges, OnInit } from '@angular/core'

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { DropdownModule } from 'primeng/dropdown'
import { httpService } from '../../../http/httpService'
import { TicketService, type ArrayElement } from '../../service/ticketservice'
import { FloatLabelModule } from 'primeng/floatlabel'
import { IActionTable } from '@/app/shared/table-primeng/table-primeng.component'
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar'

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
        FloatLabelModule,
        InputTextModule,
        CalendarModule
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
        // {
        //     iFaseId:
        //         this.ticketService.registroInformation?.stepYear
        //             .fases_promocionales.iFaseId,
        //     cFasePromNombre:
        //         this.ticketService.registroInformation?.stepYear
        //             .fases_promocionales.cFasePromNombre,
        //     dtFaseInicio: this.ticketService.toVisualFechasFormat(
        //         this.ticketService.registroInformation?.stepYear
        //             .fases_promocionales.dtFaseInicio,
        //         'DD/MM/YYYY'
        //     ),
        //     dtFaseFin: this.ticketService.toVisualFechasFormat(
        //         this.ticketService.registroInformation?.stepYear
        //             .fases_promocionales.dtFaseFin,
        //         'DD/MM/YYYY'
        //     ),
        //     iPeriodoEvalId: '',
        //     cPeriodoEvalNombre: null,
        // },
    ]

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
                // iFaseId: this.ticketService.registroInformation.stepYear.fases_promocionales.iFaseId,
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
            next: () => {

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
    
    showDialogEditPeriodo(){
        this.visibleEditPeriodo = true
    }
    
    hiddenDialogEditPeriodo(){
        this.visibleEditPeriodo = false
    }

    indexColumns() {

    }

    calculandoCicloAcademico(value) {
        console.log('Calculando')
        console.log(value)

        this.fasesPromocionales[0].iPeriodoEvalId = value.iPeriodoEvalId
        this.fasesPromocionales[0].cPeriodoEvalNombre = value.cPeriodoEvalNombre

        // let periodosCalculados = this.ticketService.calcularFechaPeriodos(
        //     this.ticketService.registroInformation.stepYear.fases_promocionales
        //         .dtFaseInicio,
        //     this.ticketService.registroInformation.stepYear.fases_promocionales
        //         .dtFaseFin,
        //     this.cicloAcademicoModal.cPeriodoEvalNombre.toLocaleLowerCase()
        // )

        // this.cicloAcademicoModal = {
        //     ...this.cicloAcademicoModal,
        //     ciclosAcademicos: periodosCalculados.map((periodo, index) => ({
        //         index: index + 1,
        //         StartDate: periodo.fechaInicio,
        //         EndDate: periodo.fechaFin,
        //         EndDateVisual: this.ticketService.toVisualFechasFormat(
        //             periodo.fechaFin,
        //             'DD/MM/YYYY'
        //         ),

        //         StartDateVisual: this.ticketService.toVisualFechasFormat(
        //             periodo.fechaInicio,
        //             'DD/MM/YYYY'
        //         ),
        //         PeriodType: periodo.descripcion,
        //         iPeriodoEvalId: value.iPeriodoEvalId,
        //     })),
        // }
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

        this.formPeriodo.valueChanges.subscribe((value) => {

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

    handleActionFase(actions) {
        console.log(actions)
        const periodTypeMap = {
            'trimestral': 'trimestre',
            'semestral': 'semestre',
            'bimestral': 'bimestre',
            // Agrega más mapeos según sea necesario
        };
        
        console.log('Periodos')
        console.log(this.periodosInformation)
        this.cicloAcademicoModal = {
            ...this.cicloAcademicoModal,
            ciclosAcademicos: this.periodosInformation.map((periodo, index) => ({
                index: index + 1,
                iPeriodoEvalAperId: periodo.iPeriodoEvalAperId,
                StartDate: periodo.dtPeriodoEvalAperInicio,
                EndDate: periodo.dtPeriodoEvalAperFin,
                EndDateVisual: this.ticketService.toVisualFechasFormat(
                    periodo.dtPeriodoEvalAperFin, 
                    'DD/MM/YYYY'
                ),

                StartDateVisual: this.ticketService.toVisualFechasFormat(
                    periodo.dtPeriodoEvalAperInicio,
                    'DD/MM/YYYY'
                ),
                PeriodType: (index + 1) + '° ' + this.ticketService.capitalize(
                    periodTypeMap[
                        this.periodosAcademicos.find((periodoList) => 
                            periodo.iPeriodoEvalId == periodoList.iPeriodoEvalId
                        )?.cPeriodoEvalNombre.toLowerCase() || ''
                    ] || ''
                ),
                
                iPeriodoEvalId: periodo.iPeriodoEvalId,
            })),
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

    saveInformationEdit(){
        this.httpService
        .postData('acad/calendarioAcademico/addCalAcademico', {
            json: JSON.stringify({
                // iFaseId: this.ticketService.registroInformation.stepYear.fases_promocionales.iFaseId,
                iPeriodoEvalAperId: String(this.formPeriodo.get('id').value),
                dtPeriodoEvalAperInicio: this.ticketService.toSQLDatetimeFormat(this.formPeriodo.get('fechaInicio').value),
                dtPeriodoEvalAperFin: this.ticketService.toSQLDatetimeFormat(this.formPeriodo.get('fechaFin').value),
            }),
            _opcion: 'updateCalPeriodoEval',
        })
        .subscribe({
            next: (data: any) => {

            },
            error: (error) => {
                console.error('Error fetching turnos:', error)
                this.getCalendarioPeriodosAcademicos()
                this.handleActionFase("")
            },
            complete: () => {
                console.log('Request completed')
            },
        })

        this.hiddenDialogEditPeriodo()
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
