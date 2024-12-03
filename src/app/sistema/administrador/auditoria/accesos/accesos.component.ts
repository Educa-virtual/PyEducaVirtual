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
import { AccordionModule } from 'primeng/accordion';

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
        { name: 'Accesos autorizados', table: 'auditoria_accesos' },
        { name: 'Accesos fallidos', table: 'auditoria_accesos_fallidos' },
        { name: 'Consultas database', table: 'auditoria' },
        { name: 'Consultas backend', table: 'auditoria_backend' },
    ]

    columnsDetail = [
        {
            type: 'text',
            width: '5rem',
            field: 'property',
            header: 'Propiedad',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'oldValue',
            header: 'Datos antiguos',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'newValue',
            header: 'Datos nuevos',
            text_header: 'center',
            text: 'center',
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

    constructor(
        private router: Router,
        private auditoria: AuditoriaService,
        private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            selectedTable: [
                { name: 'Accesos autorizados', table: 'auditoria_accesos' },
            ],
        })
    }
    async ngOnInit() {
        this.data = await this.auditoria.get_auditoria_accesos(this.form.value)

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
            this.data = await this.auditoria.get_auditoria_accesos(
                this.form.value
            )

            console.log(this.form.value.selectedTable.table)
            this.isExpand = false

            if (this.form.value.selectedTable.table == 'auditoria_accesos') {
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

            if (
                this.form.value.selectedTable.table ==
                'auditoria_accesos_fallidos'
            ) {
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

            if (this.form.value.selectedTable.table == 'auditoria') {
                this.isExpand = true



                this.data = this.data.map((acceso, index) => {
                    const datosAntiguos = JSON.parse(
                        acceso.cAudDatosAntiguos
                    )[0]
                    const datosNuevos = JSON.parse(acceso.cAudDatosNuevos)[0]

                    const transformData: Record<
                        string,
                        { property: any; oldValue: any; newValue: any, operation: any }
                    > = {}
                    const keys = new Set([
                        ...Object.keys(datosAntiguos),
                        ...Object.keys(datosNuevos),
                    ])

                    keys.forEach((key) => {


                        transformData[key] = {
                            operation: datosAntiguos[key] == datosNuevos[key] ? undefined : acceso.cAudTipoOperaion,
                            property: key,
                            oldValue: datosAntiguos[key] ?? null,
                            newValue: datosNuevos[key] ?? null,
                        }
                    })

                    return {
                        index: index + 1,
                        cAudUsuario: acceso.cAudUsuario,
                        cAudTabla: acceso.cAudTabla,
                        cAudTipoOperaion: acceso.cAudTipoOperaion,
                        dtFecha: this.auditoria.toVisualFechasFormat(
                            acceso.dtFecha
                        ),
                        cAudOperacion: JSON.parse(acceso.cAudOperacion)[0]['event_info'],
                        cAudEsquema: acceso.cAudEsquema,
                        cAudDatos: Object.values(transformData),
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

            if (this.form.value.selectedTable.table == 'auditoria_backend') {
                this.isExpand = true

                this.data = this.data.map((acceso, index) => {
                    const transformData: Record<
                        string,
                        { property: any; oldValue: any; newValue: any }
                    > = {}
                    const keys = new Set([
                        ...Object.keys(this.selectRowData.cAudDatosAntiguos),
                        ...Object.keys(this.selectRowData.cAudDatosNuevos),
                    ])

                    keys.forEach((key) => {
                        transformData[key] = {
                            property: key,
                            oldValue:
                                this.selectRowData.cAudDatosAntiguos[key] ??
                                null,
                            newValue:
                                this.selectRowData.cAudDatosNuevos[key] ?? null,
                        }
                    })

                    return {
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
                    }
                })
            }

            console.log(this.data)
            console.log(this.columns)
        })



    }

    selectRow(data) {

        this.selectRowData = data
        console.log(this.selectRowData)
    }

    ngOnChanges(changes) {}

    ngOnDestroy() {}
}
