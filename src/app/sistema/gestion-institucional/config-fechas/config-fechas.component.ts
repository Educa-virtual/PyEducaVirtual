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
import { ApiService } from '@/app/servicios/api.service'
import { UtilService } from '@/app/servicios/utils.service'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'

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
    yearCalendarios: any = []
    fechas: []
    tipo_feriado: []
    iSedeId: number
    iCalAcadId: number
    iYAcadId: number
    visible: boolean = false
    caption: string
    option: string
    datePipe: any

    constructor(
        private stepService: AdmStepGradoSeccionService,
        private router: Router,
        private fb: FormBuilder,
        private messageService: MessageService,
        private store: LocalStoreService,
        private query: GeneralService,
        private msg: StepConfirmationService,
        private apiService: ApiService,
        private utils: UtilService,
        private dialog: ConfirmationModalService
    ) {
        const perfil = this.store.getItem('dremoPerfil')
        console.log(perfil, 'perfil dremo', this.store)

        this.iYAcadId = this.store.getItem('dremoiYAcadId')

        this.iSedeId = perfil.iSedeId
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

        this.form.valueChanges.subscribe((value) => {
            console.log(value)
        })
    }

    accionBtnItemTable({ accion, item }) {
        if (accion === 'editar') {
            this.updateForm(item)
            this.visible = true
            this.caption = 'Registro para editar fechas especiales'
            this.option = 'editar'
        }
        if (accion === 'agregar') {
            this.visible = true
            this.caption = 'Registro para agregar fechas especiales'
            this.option = 'crear'
        }
        if (accion === 'editar') {
            this.visible = true
            this.caption = 'Registro para editar fechas especiales'
            this.option = 'editar'

            this.form.patchValue({
                iFechaImpId: item.iFechaImpId,
                iTipoFerId: item.iTipoFerId,
                iCalAcadId: item.iCalAcadId,
                bFechaImpSeraLaborable: Number(item.bFechaImpSeraLaborable),
                cFechaImpNombre: item.cFechaImpNombre,
                dtFechaImpFecha: new Date(item.dtFechaImpFecha),
                cFechaImpURLDocumento: item.cFechaImpURLDocumento,
                cFechaImpInfoAdicional: item.cFechaImpInfoAdicional,
            })
        }

        if (accion === 'eliminar') {
            this.dialog.openConfirm({
                header: 'Eliminar Registro',
                accept: () => {
                    this.option = 'eliminar'

                    this.apiService.deleteData({
                        esquema: 'acad',
                        tabla: 'fechas_importantes',
                        campoId: 'iFechaImpId',
                        valorId: item.iFechaImpId,
                    })
                },
                reject: () => {
                    this.option = 'cancelar'
                },
            })
        }
    }
    accionBtnItem(accion) {
        switch (accion) {
            case 'guardar':
                this.AddFechaImportante()
                break

            case 'editar':
                this.apiService.updateData({
                    esquema: 'acad',
                    tabla: 'fechas_importantes',
                    campos: {
                        iTipoFerId: this.form.value.iTipoFerId,
                        iCalAcadId: this.form.value.iCalAcadId,
                        cFechaImpNombre: this.form.value.cFechaImpNombre,
                        dtFechaImpFecha: this.utils.convertToSQLDateTime(
                            this.form.value.dtFechaImpFecha
                        ),
                        bFechaImpSeraLaborable:
                            this.form.value.bFechaImpSeraLaborable,
                        cFechaImpURLDocumento:
                            this.form.value.cFechaImpURLDocumento,
                        cFechaImpInfoAdicional:
                            this.form.value.cFechaImpInfoAdicional,
                    },
                    where: {
                        COLUMN_NAME: 'iFechaImpId',
                        VALUE: this.form.value.iFechaImpId,
                    },
                })

                this.getfechasAcademico()
                break

            case 'eliminar':
                console.log('eliminar fecha importante??')

                break
        }

        this.visible = false
    }

    AddFechaImportante() {
        alert(this.iCalAcadId)
        this.query
            .addCalAcademico({
                json: JSON.stringify({
                    iFechaImpId: this.form.value.iFechaImpId,
                    iTipoFerId: this.form.value.iTipoFerId,
                    iCalAcadId: this.form.value.iCalAcadId,
                    bFechaImpSeraLaborable:
                        this.form.value.bFechaImpSeraLaborable,
                    cFechaImpNombre: this.form.value.cFechaImpNombre,
                    dtFechaImpFecha: new Date(this.form.value.dtFechaImpFecha),
                    cFechaImpURLDocumento:
                        this.form.value.cFechaImpURLDocumento,
                    cFechaImpInfoAdicional:
                        this.form.value.cFechaImpInfoAdicional,
                }),
                _opcion: 'addFechasEspeciales',
            })
            .subscribe({
                next: (data: any) => {
                    // let periodosAcademicos: Array<any> = JSON.parse(
                    //     data.data[0]['calPeriodos']
                    // )
                    console.log(data, 'addHorarioSede')
                },
                error: (error) => {
                    console.error('Error fetching modalidades:', error)
                },
                complete: () => {
                    console.log('Request completed')
                    this.visible = false
                    this.getfechasAcademico() // refresca los registros
                },
            })
    }
    getCalendarioAcademico() {
        this.query
            .searchCalendario({
                json: JSON.stringify({
                    iSedeId: this.iSedeId,
                    iYAcadId: this.iYAcadId,
                }),
                _opcion: 'getCalendarioIESede2', //getCalendarioSedeYear,
            })
            .subscribe({
                next: (data: any) => {
                    //  this.iCalAcadId = Number(data.data[0]['iCalAcadId'])
                    this.yearCalendarios = data.data

                    console.log(this.yearCalendarios, 'yearCalendarios')
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

    updateForm(item) {
        const fecha = new Date(item.dtFechaImpFecha)

        this.form.patchValue({
            iFechaImpId: item.iFechaImpId,
            iTipoFerId: item.iTipoFerId,
            iCalAcadId: item.iCalAcadId,
            bFechaImpSeraLaborable: item.bFechaImpSeraLaborable,
            cFechaImpNombre: item.cFechaImpNombre,
            dtFechaImpFecha: fecha,
            cFechaImpURLDocumento: item.cFechaImpURLDocumento,
            cFechaImpInfoAdicional: item.cFechaImpInfoAdicional,
        })
        this.iCalAcadId = item.iCalAcadId
        this.visible = true
        this.caption = 'Registro para editar fechas especiales'
        this.option = 'editar'
    }

    // ESTRUCTURA DE ACCIONES

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
