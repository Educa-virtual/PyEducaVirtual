import { Component, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { AdmStepGradoSeccionService } from '@/app/servicios/adm/adm-step-grado-seccion.service'
import { Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MessageService } from 'primeng/api'
import { GeneralService } from '@/app/servicios/general.service'
import { StepConfirmationService } from '@/app/servicios/confirm.service'
import { CalendarModule } from 'primeng/calendar'
import { IActionTable } from '@/app/shared/table-primeng/table-primeng.component'
import {
    ContainerPageComponent,
    IActionContainer,
} from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { LocalStoreService } from '@/app/servicios/local-store.service'

@Component({
    selector: 'app-config-fechas',
    standalone: true,
    imports: [
        PrimengModule,
        ContainerPageComponent,
        TablePrimengComponent,
        CalendarModule,
    ],
    templateUrl: './config-fechas.component.html',
    styleUrl: './config-fechas.component.scss',
})
export class ConfigFechasComponent implements OnInit {
    form: FormGroup
    yearCalendarios: []
    fechas: []
    tipo_feriado: []
    iSedeId: number
    iCalAcadId: number
    iYAcadId: number
    visible: boolean = false
    caption: string
    option: string

    constructor(
        private stepService: AdmStepGradoSeccionService,
        private router: Router,
        private fb: FormBuilder,
        private messageService: MessageService,
        private store: LocalStoreService,
        private query: GeneralService,
        private msg: StepConfirmationService
    ) {
        const perfil = this.store.getItem('dremoPerfil')
        console.log(perfil, 'perfil dremo', this.store)

        this.iYAcadId = this.store.getItem('dremoiYAcadId')

        this.iSedeId = perfil.iSedeId
        this.iCalAcadId = perfil.iCalAcadId
    }

    ngOnInit(): void {
        try {
            this.form = this.fb.group({
                iFechaImpId: [0],
                iTipoFerId: [0, Validators.required],
                iCalAcadId: [0, Validators.required],
                bFechaImpSeraLaborable: [0],
                cFechaImpNombre: [''],
                dtFechaImpFecha: [''],
                cFechaImpURLDocumento: [''],
                cFechaImpInfoAdicional: [''],
            })
        } catch {
            console.log('error')
        }
        this.getfechasAcademico()
        this.getCalendarioAcademico()
        this.getTipoFeriado()
    }

    accionBtnItemTable({ accion, item }) {
        if (accion === 'editar') {
            console.log(item, 'btnTable')
        }
        if (accion === 'agregar') {
            this.visible = true
            this.caption = 'Registro para agregar fechas especiales'
            this.option = 'crear'
        }
    }
    accionBtnItem(accion) {
        switch (accion) {
            case 'guardar':
                console.log('grabar')
                break
        }
    }

    getCalendarioAcademico() {
        this.query
            .searchCalendario({
                json: JSON.stringify({
                    iSedeId: this.iSedeId,
                    iYAcadId: this.iYAcadId,
                }),
                _opcion: 'getCalendarioSedeYear',
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

    getfechasAcademico() {
        this.query
            .searchCalendario({
                json: JSON.stringify({
                    iSedeId: this.iSedeId,
                    iYAcadId: this.iYAcadId,
                }),
                _opcion: 'getCalendarioFechas',
            })
            .subscribe({
                next: (data: any) => {
                    this.fechas = data.data

                    console.log(this.fechas, 'fechas')
                },
                error: (error) => {
                    console.error('Error fetching Años Académicos:', error)
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }
    getTipoFeriado() {
        this.query
            .searchCalAcademico({
                esquema: 'acad',
                tabla: 'tipo_fechas',
                campos: 'iTipoFerId, cTipoFechaNombre',
                condicion: '1=1',
            })
            .subscribe({
                next: (data: any) => {
                    this.tipo_feriado = data.data

                    console.log(this.tipo_feriado)
                },
                error: (error) => {
                    console.error('Error fetching Años Académicos:', error)
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    selectedItems = []
    accionesPrincipal: IActionContainer[] = [
        {
            labelTooltip: 'Crear fechas',
            text: 'Crear fechas especiales',
            icon: 'pi pi-plus',
            accion: 'agregar',
            class: 'p-button-primary',
        },
    ]
    // ESTRUCTURA DE TABLA
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

    // recordset de Year
    columns = [
        {
            type: 'item',
            width: '5rem',
            field: '',
            header: 'Item',
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
            field: 'cFechaImpNombre',
            header: 'Descripción',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'date',
            width: '5rem',
            field: 'dtFechaImpFecha',
            header: 'Fecha',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cTipoFechaNombre',
            header: 'tipo',
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
