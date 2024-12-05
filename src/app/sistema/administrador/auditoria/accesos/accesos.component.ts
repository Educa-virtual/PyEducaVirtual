import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { AuditoriaService } from '../services/auditoria.service'
import { InputGroupModule } from 'primeng/inputgroup'
import { DropdownModule } from 'primeng/dropdown'
import { InputGroupAddonModule } from 'primeng/inputgroupaddon'
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms'
import { TableModule } from 'primeng/table'
import { CommonModule } from '@angular/common'
import { AccordionModule } from 'primeng/accordion'
import { CalendarModule } from 'primeng/calendar'
import * as XLSX from 'xlsx'

@Component({
    selector: 'app-accesos',
    standalone: true,
    imports: [
        TablePrimengComponent,
        TableModule,
        CommonModule,
        InputGroupModule,
        DropdownModule,
        InputGroupAddonModule,
        FormsModule,
        ReactiveFormsModule,
        AccordionModule,
        CalendarModule,
    ],
    templateUrl: './accesos.component.html',
    styleUrl: './accesos.component.scss',
    providers: [],
})
export class AccesosComponent implements OnInit, OnChanges, OnDestroy {
    form: FormGroup
    data
    selectRowData
    isExpand = false
    options = [
        { name: 'Accesos autorizados' },
        { name: 'Accesos fallidos' },
        { name: 'Consultas database' },
        { name: 'Consultas backend' },
    ]

    columnsDetail = [
        {
            type: 'text',
            width: '5rem',
            field: 'property',
            header: 'Propiedad',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'oldValue',
            header: 'Datos antiguos',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'newValue',
            header: 'Datos nuevos',
            text_header: 'left',
            text: 'left',
        },
    ]

    columns = [
        {
            type: 'text',
            width: '1rem',
            field: 'index',
            header: 'N°',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cCredUsuario',
            header: 'Usuario',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cNombre',
            header: 'Nombre',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cIpCliente',
            header: 'IP cliente',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'dtFecha',
            header: 'Fecha',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cNavegador',
            header: 'Navegador',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cDispositivo',
            header: 'Dispositivo',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cSistmaOperativo',
            header: 'Sistema operativo',
            text_header: 'center',
            text: 'center',
        },
    ]

    dataExport

    constructor(
        private router: Router,
        private auditoria: AuditoriaService,
        private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            selectedTable: [this.options[0]],
            filtroFecha: [[new Date(), new Date()]],
        })
    }
    async ngOnInit() {
        if (
            this.form.value.filtroFecha[0] != null &&
            this.form.value.filtroFecha[1] != null
        ) {
            this.data = await this.auditoria.getAuditoriaAccesos({
                filtroFechaInicio: this.auditoria.convertToSQLDateTime(
                    this.form.value.filtroFecha[0]
                ),
                filtroFechaFin: this.auditoria.convertToSQLDateTime(
                    this.form.value.filtroFecha[1]
                ),
            })
        }

        this.dataExport = this.data
        

        this.data = this.data.map((acceso, index) => ({
            index: index + 1,
            cCredUsuario: acceso.cCredUsuario,
            cNombre: acceso.cNombre,
            cDispositivo: acceso.cDispositivo,
            cIpCliente: acceso.cIpCliente,
            cNavegador: acceso.cNavegador,
            cSistmaOperativo: acceso.cSistmaOperativo,
            dtFecha: this.auditoria.toVisualFechasFormat(acceso.dtFecha),
        }))

        this.form.valueChanges.subscribe(async (value) => {
            this.isExpand = false

            if (this.form.value.selectedTable.name == 'Accesos autorizados') {
                if (
                    this.form.value.filtroFecha[0] != null &&
                    this.form.value.filtroFecha[1] != null
                ) {
                    this.data = await this.auditoria.getAuditoriaAccesos({
                        filtroFechaInicio: this.auditoria.convertToSQLDateTime(
                            this.form.value.filtroFecha[0]
                        ),
                        filtroFechaFin: this.auditoria.convertToSQLDateTime(
                            this.form.value.filtroFecha[1]
                        ),
                    })
                }

        this.dataExport = this.data


                this.data = this.data.map((acceso, index) => ({
                    index: index + 1,
                    cCredUsuario: acceso.cCredUsuario,
                    cNombre: acceso.cNombre,
                    cDispositivo: acceso.cDispositivo,
                    cIpCliente: acceso.cIpCliente,
                    cNavegador: acceso.cNavegador,
                    cSistmaOperativo: acceso.cSistmaOperativo,
                    dtFecha: this.auditoria.toVisualFechasFormat(
                        acceso.dtFecha
                    ),
                }))

                this.columns = [
                    {
                        type: 'text',
                        width: '1rem',
                        field: 'index',
                        header: 'N°',
                        text_header: 'center',
                        text: 'center',
                    },
                    {
                        type: 'text',
                        width: '5rem',
                        field: 'cCredUsuario',
                        header: 'Usuario',
                        text_header: 'center',
                        text: 'center',
                    },
                    {
                        type: 'text',
                        width: '5rem',
                        field: 'cNombre',
                        header: 'Nombre',
                        text_header: 'center',
                        text: 'center',
                    },
                    {
                        type: 'text',
                        width: '5rem',
                        field: 'cIpCliente',
                        header: 'IP cliente',
                        text_header: 'center',
                        text: 'center',
                    },
                    {
                        type: 'text',
                        width: '5rem',
                        field: 'dtFecha',
                        header: 'Fecha',
                        text_header: 'center',
                        text: 'center',
                    },
                    {
                        type: 'text',
                        width: '5rem',
                        field: 'cNavegador',
                        header: 'Navegador',
                        text_header: 'center',
                        text: 'center',
                    },
                    {
                        type: 'text',
                        width: '5rem',
                        field: 'cDispositivo',
                        header: 'Dispositivo',
                        text_header: 'center',
                        text: 'center',
                    },
                    {
                        type: 'text',
                        width: '5rem',
                        field: 'cSistmaOperativo',
                        header: 'Sistema operativo',
                        text_header: 'center',
                        text: 'center',
                    },
                ]
            }

            if (this.form.value.selectedTable.name == 'Accesos fallidos') {
                if (
                    this.form.value.filtroFecha[0] != null &&
                    this.form.value.filtroFecha[1] != null
                ) {
                    this.data =
                        await this.auditoria.getAuditoriaAccesosFallidos({
                            filtroFechaInicio:
                                this.auditoria.convertToSQLDateTime(
                                    this.form.value.filtroFecha[0]
                                ),
                            filtroFechaFin: this.auditoria.convertToSQLDateTime(
                                this.form.value.filtroFecha[1]
                            ),
                        })
                }

                this.data = this.data.map((acceso, index) => ({
                    index: index + 1,
                    cLogin: acceso.cLogin,
                    cPassword: acceso.cPassword,
                    cMotivo: acceso.cMotivo,
                    cDispositivo: acceso.cDispositivo,
                    cIpCliente: acceso.cIpCliente,
                    cNavegador: acceso.cNavegador,
                    cSistmaOperativo: acceso.cSistmaOperativo,
                    dtFecha: this.auditoria.toVisualFechasFormat(
                        acceso.dtFecha
                    ),
                }))

                this.columns = [
                    {
                        type: 'text',
                        width: '1rem',
                        field: 'index',
                        header: 'N°',
                        text_header: 'center',
                        text: 'center',
                    },
                    {
                        type: 'text',
                        width: '5rem',
                        field: 'cLogin',
                        header: 'Usuario',
                        text_header: 'center',
                        text: 'center',
                    },
                    {
                        type: 'text',
                        width: '5rem',
                        field: 'cPassword',
                        header: 'Contraseña',
                        text_header: 'center',
                        text: 'center',
                    },
                    {
                        type: 'text',
                        width: '5rem',
                        field: 'cMotivo',
                        header: 'Motivo',
                        text_header: 'center',
                        text: 'center',
                    },
                    {
                        type: 'text',
                        width: '5rem',
                        field: 'cIpCliente',
                        header: 'IP cliente',
                        text_header: 'center',
                        text: 'center',
                    },
                    {
                        type: 'text',
                        width: '5rem',
                        field: 'dtFecha',
                        header: 'Fecha',
                        text_header: 'center',
                        text: 'center',
                    },
                    {
                        type: 'text',
                        width: '5rem',
                        field: 'cNavegador',
                        header: 'Navegador',
                        text_header: 'center',
                        text: 'center',
                    },
                    {
                        type: 'text',
                        width: '5rem',
                        field: 'cDispositivo',
                        header: 'Dispositivo',
                        text_header: 'center',
                        text: 'center',
                    },
                    {
                        type: 'text',
                        width: '5rem',
                        field: 'cSistmaOperativo',
                        header: 'Sistema operativo',
                        text_header: 'center',
                        text: 'center',
                    },
                ]
            }

            if (this.form.value.selectedTable.name == 'Consultas database') {
                if (
                    this.form.value.filtroFecha[0] != null &&
                    this.form.value.filtroFecha[1] != null
                ) {
                    this.data = await this.auditoria.getAuditoria({
                        filtroFechaInicio: this.auditoria.convertToSQLDateTime(
                            this.form.value.filtroFecha[0]
                        ),
                        filtroFechaFin: this.auditoria.convertToSQLDateTime(
                            this.form.value.filtroFecha[1]
                        ),
                    })
                }
        this.dataExport = this.data


                this.isExpand = true

                this.data = this.data.map((acceso, index) => {
                    const datosAntiguos = Array.isArray(
                        JSON.parse(acceso.cAudDatosAntiguos)
                    )
                        ? JSON.parse(acceso.cAudDatosAntiguos)[0]
                        : {}
                    const datosNuevos = Array.isArray(
                        JSON.parse(acceso.cAudDatosNuevos)
                    )
                        ? JSON.parse(acceso.cAudDatosNuevos)[0]
                        : {}

                    const transformData: Record<
                        string,
                        {
                            property: any
                            oldValue: any
                            newValue: any
                            class: any
                        }
                    > = {}

                    const keys = new Set([
                        ...Object.keys(datosAntiguos ?? {}),
                        ...Object.keys(datosNuevos ?? {}),
                    ])

                    const matchingKeys: string[] = []
                    const differingKeys: string[] = []

                    keys.forEach((key) => {
                        const oldValue = datosAntiguos[key] ?? ''
                        const newValue = datosNuevos[key] ?? ''

                        const isMatching = oldValue == newValue

                        const formatDataAntiguo =
                            this.auditoria.toVisualFechasFormat(
                                datosAntiguos[key]
                            )
                        const formatDataNuevo =
                            this.auditoria.toVisualFechasFormat(
                                datosNuevos[key]
                            )

                        const entry = {
                            class: isMatching
                                ? undefined
                                : acceso.cAudTipoOperaion,
                            property: key,
                            oldValue: formatDataAntiguo ?? null,
                            newValue: formatDataNuevo ?? null,
                        }

                        if (isMatching) {
                            matchingKeys.push(key)
                        } else {
                            differingKeys.push(key)
                        }

                        transformData[key] = entry
                    })

                    const reorderedTransformData: Record<
                        string,
                        {
                            property: any
                            oldValue: any
                            newValue: any
                            class: any
                        }
                    > = {}

                    differingKeys.forEach((key) => {
                        reorderedTransformData[key] = transformData[key]
                    })

                    matchingKeys.forEach((key) => {
                        reorderedTransformData[key] = transformData[key]
                    })

                    return {
                        index: index + 1,
                        class: acceso.cAudTipoOperaion,
                        cAudUsuario: acceso.cAudUsuario,
                        cAudTabla: acceso.cAudTabla,
                        cAudTipoOperaion: acceso.cAudTipoOperaion,
                        dtFecha: this.auditoria.toVisualFechasFormat(
                            acceso.dtFecha
                        ),
                        cAudOperacion: JSON.parse(acceso.cAudOperacion)[0][
                            'event_info'
                        ].replace(/,/g, ', '),
                        cAudEsquema: acceso.cAudEsquema,
                        cAudDatos: Object.values(reorderedTransformData),
                    }
                })

                this.selectRowData = this.data[0]

                this.columns = [
                    {
                        type: 'text',
                        width: '1rem',
                        field: 'index',
                        header: 'N°',
                        text_header: 'center',
                        text: 'center',
                    },
                    {
                        type: 'text',
                        width: '5rem',
                        field: 'cAudUsuario',
                        header: 'Usuario',
                        text_header: 'center',
                        text: 'center',
                    },
                    {
                        type: 'text',
                        width: '5rem',
                        field: 'cAudTipoOperaion',
                        header: 'Operacion',
                        text_header: 'center',
                        text: 'center',
                    },
                    {
                        type: 'text',
                        width: '5rem',
                        field: 'dtFecha',
                        header: 'Fecha',
                        text_header: 'center',
                        text: 'center',
                    },
                ]
            }

            if (this.form.value.selectedTable.name == 'Consultas backend') {
                this.data = await this.auditoria.getAuditoriaMiddleware({
                    filtroFechaInicio: this.auditoria.convertToSQLDateTime(
                        this.form.value.filtroFecha[0]
                    ),
                    filtroFechaFin: this.auditoria.convertToSQLDateTime(
                        this.form.value.filtroFecha[1]
                    ),
                })

                this.isExpand = true
        this.dataExport = this.data


                this.data = this.data.map((acceso, index) => {
                    const datosAntiguos = Array.isArray(
                        JSON.parse(acceso.cAudDatosAntiguos)
                    )
                        ? JSON.parse(acceso.cAudDatosAntiguos)[0]
                        : {}
                    const datosNuevos = Array.isArray(
                        JSON.parse(acceso.cAudDatosNuevos)
                    )
                        ? JSON.parse(acceso.cAudDatosNuevos)[0]
                        : {}

                    const transformData: Record<
                        string,
                        {
                            property: any
                            oldValue: any
                            newValue: any
                            class: any
                        }
                    > = {}

                    const keys = new Set([
                        ...Object.keys(datosAntiguos ?? {}),
                        ...Object.keys(datosNuevos ?? {}),
                    ])

                    const matchingKeys: string[] = []
                    const differingKeys: string[] = []

                    keys.forEach((key) => {
                        const oldValue = datosAntiguos[key] ?? ''
                        const newValue = datosNuevos[key] ?? ''

                        const isMatching = oldValue == newValue

                        const formatDataAntiguo =
                            this.auditoria.toVisualFechasFormat(
                                datosAntiguos[key]
                            )
                        const formatDataNuevo =
                            this.auditoria.toVisualFechasFormat(
                                datosNuevos[key]
                            )

                        const entry = {
                            class: isMatching
                                ? undefined
                                : acceso.cAudTipoOperacion,
                            property: key,
                            oldValue: formatDataAntiguo ?? null,
                            newValue: formatDataNuevo ?? null,
                        }

                        if (isMatching) {
                            matchingKeys.push(key)
                        } else {
                            differingKeys.push(key)
                        }

                        transformData[key] = entry
                    })

                    const reorderedTransformData: Record<
                        string,
                        {
                            property: any
                            oldValue: any
                            newValue: any
                            class: any
                        }
                    > = {}

                    differingKeys.forEach((key) => {
                        reorderedTransformData[key] = transformData[key]
                    })

                    matchingKeys.forEach((key) => {
                        reorderedTransformData[key] = transformData[key]
                    })

                    return {
                        index: index + 1,
                        class: acceso.cAudTipoOperacion,
                        cCredUsuario: acceso.cCredUsuario,
                        cAudTabla: acceso.cAudTabla,
                        cAudTipoOperacion: acceso.cAudTipoOperacion,
                        dtFecha: this.auditoria.toVisualFechasFormat(
                            acceso.dtFecha
                        ),
                        cAudOperacion: JSON.parse(acceso.cAudOperacion)[0][
                            'event_info'
                        ].replace(/,/g, ', '),
                        cAudEsquema: acceso.cAudEsquema,
                        cAudDatos: Object.values(reorderedTransformData),
                    }
                })

                this.selectRowData = this.data[0]

                this.columns = [
                    {
                        type: 'text',
                        width: '1rem',
                        field: 'index',
                        header: 'N°',
                        text_header: 'center',
                        text: 'center',
                    },
                    {
                        type: 'text',
                        width: '5rem',
                        field: 'cCredUsuario',
                        header: 'Usuario',
                        text_header: 'center',
                        text: 'center',
                    },
                    {
                        type: 'text',
                        width: '5rem',
                        field: 'cAudTipoOperacion',
                        header: 'Operacion',
                        text_header: 'center',
                        text: 'center',
                    },
                    {
                        type: 'text',
                        width: '5rem',
                        field: 'dtFecha',
                        header: 'Fecha',
                        text_header: 'center',
                        text: 'center',
                    },
                ]
            }

            console.log(this.data)
            console.log(this.columns)
        })
    }

    selectRow(data) {
        this.selectRowData = data
    }

    generarExcel() {
           
        const worksheet = XLSX.utils.json_to_sheet(this.dataExport)

        // Crear un libro de trabajo y añadir la hoja
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos')

        // Exportar el archivo Excel
        XLSX.writeFile(workbook, 'exportacion.xlsx')
    }

    ngOnChanges(changes) {}

    ngOnDestroy() {}
}
