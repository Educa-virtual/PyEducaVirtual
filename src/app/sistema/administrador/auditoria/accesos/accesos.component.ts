import { Component, OnInit } from '@angular/core'
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
import { optionsDropdownConfig } from './config/dropdown/dropdown'
import { UtilService } from '@/app/servicios/utils.service'

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
export class AccesosComponent implements OnInit {
    form: FormGroup
    data
    selectRowData
    isExpand = false
    options = optionsDropdownConfig

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

    columns

    dataExport

    constructor(
        private router: Router,
        private auditoria: AuditoriaService,
        private fb: FormBuilder,
        private utils: UtilService
    ) {
        this.form = this.fb.group({
            selectedTable: [this.options[0]],
            filtroFecha: [[new Date(), new Date()]],
        })
    }

    ngOnInit() {
        this.getData(this.form.value)

        this.form.valueChanges.subscribe((curr) => {
            this.getData(curr)
        })
    }

    getData(curr) {
        const option = curr.selectedTable.value
        this.auditoria.endpoint = option.endPoint
        this.isExpand = option?.expand ?? false

        if (curr.filtroFecha[0] != null && curr.filtroFecha[1] != null) {
            this.auditoria
                .getData({
                    filtroFechaInicio: this.utils.convertToSQLDateTime(
                        this.form.value.filtroFecha[0]
                    ),
                    filtroFechaFin: this.utils.convertToSQLDateTime(
                        this.form.value.filtroFecha[1]
                    ),
                })
                .subscribe({
                    next: (res) => {
                        this.data = option.response(res)
                    },

                    complete: () => {
                        this.columns = option.columns

                        console.log('this.columns')
                        console.log(this.columns)
                        console.log(this.data)
                    },
                })
        }
    }

    selectRow(data) {
        this.selectRowData = data
    }

    generarExcel() {
        const worksheet = XLSX.utils.json_to_sheet(this.data)

        // Crear un libro de trabajo y añadir la hoja
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos')

        // Exportar el archivo Excel
        XLSX.writeFile(workbook, 'exportacion.xlsx')
    }
}
