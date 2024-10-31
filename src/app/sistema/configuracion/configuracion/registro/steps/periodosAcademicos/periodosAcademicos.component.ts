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

    ciclosAcademicos

    cicloAcademicoModal: ArrayElement<typeof this.ticketService.registroInformation.stepPeriodosAcademicos>;

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
        this.router.navigate([
            'configuracion/configuracion/registro/resumen',
        ])
    }

    prevPage() {
        this.router.navigate(['configuracion/configuracion/registro/turnos'])
    }

    saveInformation(){
        
    }

    showDialog() {
        this.visible = true
    }

    indexColumns(){
        this.cicloAcademicoModal.ciclosAcademicos = this.cicloAcademicoModal.ciclosAcademicos.map((ciclo, index) => ({
            index: index + 1,
            ...ciclo,
            StartDate: this.ticketService.toVisualFechasFormat('2024-03-01 00:00:00.000', 'DD/MM/YYYY'),
            EndDate: this.ticketService.toVisualFechasFormat('2024-12-01 00:00:00.000', 'DD/MM/YYYY'),
        }))
    }

    calculandoCicloAcademico(){
        console.log('Calculando');

        this.httpService
            .postData('acad/periodoAcademico/addPerAcademico', {
                json: JSON.stringify({
                    iCalAcadId: this.ticketService.registroInformation.calendar.iCalAcadId
                }),
                _opcion: this.cicloAcademicoModal.cPeriodoEvalNombre,
            })
            .subscribe({
                next: (data: any) => {
                    this.cicloAcademicoModal = {
                        ...this.cicloAcademicoModal,
                        ciclosAcademicos: data.data
                    }

                    this.indexColumns()
                },
                error: (error) => {
                    console.error('Error fetching modalidades:', error)
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    getPeriodosAcademicos(){
        this.httpService
            .postData('acad/calendarioAcademico/addCalAcademico', {
                json: JSON.stringify({
                    iCalAcadId: this.ticketService.registroInformation.calendar.iCalAcadId
                }),
                _opcion: 'getCalendarioPeriodos',
            })
            .subscribe({
                next: (data: any) => {
                    let periodosAcademicos: Array<any> = JSON.parse(data.data[0]["calPeriodos"])

                    console.log(!periodosAcademicos.some((periodo) => periodo.Message === 'false'));
                    
                    if (!periodosAcademicos.some((periodo) => periodo.Message === 'false')) {
                        


                    }

                    console.log(periodosAcademicos)
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
                    this.periodosAcademicos = data.data

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
                this.getPeriodosAcademicos()
            }
    }

    handleActions(actions){
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
            field: 'iPeriodoEvalId',
            header: 'Nro',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cPeriodoEvalNombre',
            header: 'Periodo evaluaciones formativas',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cModalServNombre',
            header: 'Fecha inicio',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cModalServNombre',
            header: 'Fecha fin',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cModalServNombre',
            header: 'Ciclo académico',
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
            field: 'StartDate',
            header: 'Fecha inicio',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'EndDate',
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
