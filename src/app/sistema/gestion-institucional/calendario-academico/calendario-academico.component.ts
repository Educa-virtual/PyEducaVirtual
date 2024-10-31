import { Component, OnInit } from '@angular/core' //OnChanges, OnDestroy
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { ButtonModule } from 'primeng/button'
import { InputNumberModule } from 'primeng/inputnumber'
import { InputTextModule } from 'primeng/inputtext'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { CalendarModule } from 'primeng/calendar'
import { ChipsModule } from 'primeng/chips'
import { TagModule } from 'primeng/tag'

import { InputSwitchModule } from 'primeng/inputswitch'

import { MessageService } from 'primeng/api'
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'
import { DialogModule } from 'primeng/dialog'

import { FormsModule } from '@angular/forms'

import { IActionTable } from '@/app/shared/table-primeng/table-primeng.component'

import { GeneralService } from '@/app/servicios/general.service'
import {
    IActionContainer,
    ContainerPageComponent,
} from '@/app/shared/container-page/container-page.component'

@Component({
    selector: 'app-calendario-academico',
    standalone: true,
    imports: [
        TablePrimengComponent,
        ButtonModule,
        ReactiveFormsModule,
        FormsModule,
        DialogModule,
        InputSwitchModule,
        InputNumberModule,
        InputTextModule,
        ContainerPageComponent,
        CalendarModule,
        ChipsModule,
        TagModule,
        InputTextareaModule,
    ],
    providers: [MessageService, GeneralService],
    templateUrl: './calendario-academico.component.html',
    styleUrl: './calendario-academico.component.scss',
}) //, OnChanges, OnDestroy
export class CalendarioAcademicoComponent implements OnInit {
    years: {
        iYearId: number
        cYearNombre: string
        cYearOficial: string
        iYearEstado: number
    }[]

    yearCalendarios: {
        iYAcadId: number
        iYearId: number
        dtYAcadInicio: Date
        dYAcadFin: Date
        cYAcadNombre: string
        cYAcadDescripcion: string
        iEstado: number
    }[]

    form: FormGroup

    formCalendario: FormGroup

    visible: boolean = false
    datos: any = []
    showCaption: string
    caption: string
    mensaje: string
    anio: string
    lema: string

    constructor(
        public messageService: MessageService,
        public query: GeneralService,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.form = this.fb.group({
            iYearId: [''],
            cYearNombre: [null, Validators.required], // Control para "Descripcion año"
            cYearOficial: ['', Validators.required], // Control para "Año Oficial"
            iYearEstado: [false], // Control para el switch "Estado"
        })

        this.formCalendario = this.fb.group({
            iYAcadId: [''],
            iYearId: ['', Validators.required],
            dtYAcadInicio: ['', Validators.required],
            dYAcadFin: ['', Validators.required],
            cYAcadNombre: ['', Validators.required],
            cYAcadDescripcion: ['', Validators.required],
            iEstado: [''],
        })

        // peticiones al api
        this.getYears()
    }

    getYears() {
        this.query.getYear().subscribe({
            next: (data: any) => {
                this.years = data.data

                console.log(this.years)
            },
            error: (error) => {
                console.error('Error fetching Años Académicos:', error)
            },
            complete: () => {
                console.log('Request completed')
            },
        })
    }

    getYearCalendarios(item: any) {
        this.showCaption = 'addCalendario'
        this.caption = 'Registrar Calendario Escolar'
        this.query
            .searchCalAcademico({
                esquema: 'acad',
                tabla: 'year_academicos',
                campos: 'iYAcadId, iYearId,dtYAcadInicio, dYAcadFin, cYAcadNombre, cYAcadDescripcion, iEstado',
                condicion: 'iYearId = ' + item.iYearId,
            })
            .subscribe({
                next: (data: any) => {
                    this.yearCalendarios = data.data

                    console.log(this.yearCalendarios)
                },
                error: (error) => {
                    console.error('Error fetching Años Académicos:', error)
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    //Maquetar tablas
    handleActions(actions) {
        console.log(actions)
    }
    accionesPrincipal: IActionContainer[] = [
        {
            labelTooltip: 'Agregar Año Académico',
            text: 'Agregar Año Académico',
            icon: 'pi pi-plus',
            accion: 'agregar',
            class: 'p-button-secondary',
        },
    ]
    selectedItems = []
    actions: IActionTable[] = [
        {
            labelTooltip: 'Calendario',
            icon: 'pi pi-calendar-plus',
            accion: 'calendario',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
        },
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

    actionsCal: IActionTable[] = [
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-pencil',
            accion: 'editarCal',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
        {
            labelTooltip: 'Eliminar',
            icon: 'pi pi-trash',
            accion: 'eliminarCal',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
    ]
    // recordset de Year
    columns = [
        {
            type: 'text',
            width: '5rem',
            field: 'iYearId',
            header: 'Cod',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cYearNombre',
            header: 'Año',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cYearOficial',
            header: 'Nombre oficial',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'estado-activo',
            width: '5rem',
            field: 'iYearEstado',
            header: 'Activo',
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

    columnCalendario = [
        {
            type: 'text',
            width: '5rem',
            field: 'iYAcadId',
            header: 'Cod',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cYAcadNombre',
            header: 'Año',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cYAcadDescripcion',
            header: 'Descripción',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'dtYAcadInicio',
            header: 'Inicio de año',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'dYAcadFin',
            header: 'Fin de año',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'estado-activo',
            width: '5rem',
            field: 'iEstado',
            header: 'Activo',
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
    // Logica de procesamiento
    saveInformation() {}
    //FUNCION PARA REGISTRAR AÑO ESCOLAR
    add(): void {
        if (this.form.valid) {
            console.log(this.form.value)
            //ALMACENAR LA INFORMACION
            this.query
                .addAno({
                    json: JSON.stringify(this.form.value),
                    _opcion: 'addYear',
                })
                .subscribe({
                    next: (data: any) => {
                        console.log(data)
                    },
                    error: (error) => {
                        console.error('Error fetching turnos:', error)
                    },
                    complete: () => {
                        console.log('Request completed')
                        this.visible = false
                        this.form.reset() // Restablece todos los valores a null
                        this.getYears()
                    },
                })
        } else {
            console.log('Formulario no válido', this.form.invalid)
        }
    }
    // FUNCION PARA MODIFICAR AÑO ESCOLAR
    update(): void {
        if (this.form.valid) {
            console.log(this.form.value)
            //ALMACENAR LA INFORMACION
            this.query
                .addAno({
                    json: JSON.stringify(this.form.value),
                    _opcion: 'updateYear',
                })
                .subscribe({
                    next: (data: any) => {
                        console.log(data)
                    },
                    error: (error) => {
                        console.error('Error fetching turnos:', error)
                    },
                    complete: () => {
                        console.log('Request completed')
                        this.visible = false
                        this.form.reset() // Restablece todos los valores a null
                        this.getYears()
                    },
                })
        } else {
            console.log('Formulario no válido', this.form.invalid)
        }
    }
    delete() {
        this.query
            .addAno({
                json: JSON.stringify(this.form.value),
                _opcion: 'deleteYear',
            })
            .subscribe({
                next: (data: any) => {
                    console.log(data)
                },
                error: (error) => {
                    console.error('Error fetching turnos:', error)
                },
                complete: () => {
                    console.log('Request completed')
                    this.visible = false
                    this.getYears()
                },
            })
    }
    close() {
        this.visible = false
    }

    addCalendario(): void {
        if (this.formCalendario.valid) {
            console.log(this.formCalendario.value)
            //ALMACENAR LA INFORMACION
            this.query
                .addAno({
                    json: JSON.stringify(this.formCalendario.value),
                    _opcion: 'addYearCalendario',
                })
                .subscribe({
                    next: (data: any) => {
                        console.log(data)
                    },
                    error: (error) => {
                        console.error('Error fetching turnos:', error)
                    },
                    complete: () => {
                        console.log('Request completed')

                        this.getYearCalendarios(this.formCalendario.value)
                    },
                })
        } else {
            console.log(
                'Formulario no válido - Calendario',
                this.formCalendario.invalid
            )
        }
    }
    updateCalendario(): void {
        if (this.formCalendario.valid) {
            console.log(this.formCalendario.value)
            //ALMACENAR LA INFORMACION
            this.query
                .addAno({
                    json: JSON.stringify(this.formCalendario.value),
                    _opcion: 'updateYearCalendario',
                })
                .subscribe({
                    next: (data: any) => {
                        console.log(data)
                    },
                    error: (error) => {
                        console.error('Error fetching year calendario:', error)
                    },
                    complete: () => {
                        console.log('Request completed')

                        this.getYearCalendarios(this.formCalendario.value)
                        this.lema =
                            this.formCalendario.get('cYAcadDescripcion')?.value
                    },
                })
        } else {
            console.log(this.formCalendario.value)
            console.log(
                'Formulario no válido - Calendario',
                this.formCalendario.invalid
            )
        }
    }
    deleteCalendario() {
        this.query
            .addAno({
                json: JSON.stringify(this.formCalendario.value),
                _opcion: 'deleteYearCalendario',
            })
            .subscribe({
                next: (data: any) => {
                    console.log(data)
                },
                error: (error) => {
                    console.error('Error fetching calendario:', error)
                },
                complete: () => {
                    console.log('Request completed')
                    this.getYearCalendarios(this.formCalendario.value)
                },
            })
    }
    // FUNCIONES DE ANGULAR
    //ngOnChanges(changes) {}

    //ngOnDestroy() {}

    //FUNCINES DE MODAL
    showAdd() {
        this.visible = true
        this.showCaption = 'add'
        this.caption = 'Registro de año'
        this.form.get('iYearId')?.setValue(0)
        console.log(this.form.get('iYearId')?.value)
    }

    showUpdate(datos: any) {
        console.log(datos.iYearId)
        this.visible = true
        this.showCaption = 'update'
        this.caption = 'Editar año'
        console.log(this.form.get('iYearId')?.value)
    }

    showDelete() {
        this.visible = true
        this.showCaption = 'delete'
        this.caption = 'Eliminar Año Escolar'
    }
    showAddCalendario() {
        this.visible = true
        this.showCaption = 'addCalendario'
        this.caption = 'Registrar Calendario Escolar'
    }
    showUpdateCal() {
        this.showCaption = 'updateCalendario'
        this.caption = 'Editar Calendario Escolar'
    }
    showDeleteCal() {
        this.showCaption = 'deleteCalendario'
        this.caption = 'Eliminar Calendario Escolar'
    }

    // manejar las acciones
    accionBtnItem(action) {
        if (action.accion === 'agregar') {
            this.showAdd()
        }
    }

    accionBtnItemTable({ accion, item }) {
        if (accion === 'asignar') {
            this.selectedItems = []
            this.selectedItems = [item]
            // this.asignarPreguntas()
        }
        if (accion === 'editar') {
            this.form.get('iYearId')?.setValue(item.iYearId)
            this.form.get('cYearNombre')?.setValue(item.cYearNombre)
            this.form.get('cYearOficial')?.setValue(item.cYearOficial)
            if (item.iYearEstado == 1) {
                this.form.get('iYearEstado')?.setValue(1)
            } else {
                this.form.get('iYearEstado')?.setValue(0)
            }

            this.showUpdate(item)
        }

        if (accion === 'eliminar') {
            this.form.get('iYearId')?.setValue(item.iYearId)
            this.anio = item.cYearNombre
            this.lema = item.cYearOficial
            this.showDelete()
        }

        if (accion === 'editarCal') {
            this.formCalendario.get('iYAcadId')?.setValue(item.iYAcadId)
            const inicio = new Date(item.dtYAcadInicio)
            const fin = new Date(item.dYAcadFin)
            this.formCalendario.get('dtYAcadInicio')?.setValue(inicio)
            this.formCalendario.get('dYAcadFin')?.setValue(fin)
            this.formCalendario
                .get('cYAcadDescripcion')
                ?.setValue(item.cYAcadDescripcion)

            if (item.iEstado == 1) {
                this.formCalendario.get('iEstado')?.setValue(1)
            } else {
                this.formCalendario.get('iEstado')?.setValue(0)
            }
            this.lema = item.cYAcadDescripcion
            this.showUpdateCal()
        }

        if (accion === 'eliminarCal') {
            this.formCalendario.get('iYAcadId')?.setValue(item.iYAcadId)
            const inicio = new Date(item.dtYAcadInicio)
            const fin = new Date(item.dYAcadFin)
            this.formCalendario.get('dtYAcadInicio')?.setValue(inicio)
            this.formCalendario.get('dYAcadFin')?.setValue(fin)
            this.formCalendario
                .get('cYAcadDescripcion')
                ?.setValue(item.cYAcadDescripcion)

            if (item.iEstado == 1) {
                this.formCalendario.get('iEstado')?.setValue(1)
            } else {
                this.formCalendario.get('iEstado')?.setValue(0)
            }
            this.showDeleteCal()
        }

        if (accion === 'calendario') {
            this.getYearCalendarios(item)
            this.form.get('iYearId')?.setValue(item.iYearId)
            this.formCalendario.get('iYearId')?.setValue(item.iYearId)
            this.formCalendario.get('cYAcadNombre')?.setValue(item.cYearNombre)
            this.formCalendario
                .get('cYAcadDescripcion')
                ?.patchValue(item.cYearOficial)
            this.lema = item.cYearOficial
            this.formCalendario.get('iEstado')?.setValue(0)
            this.showAddCalendario()
        }
    }
}
