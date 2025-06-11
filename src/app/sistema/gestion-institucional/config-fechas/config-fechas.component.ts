import { PrimengModule } from '@/app/primeng.module'
import { BtnFileUploadComponent } from '@/app/shared/btn-file-upload/btn-file-upload.component'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { Component, OnInit } from '@angular/core'
import { CalendarModule } from 'primeng/calendar'
import { nationalHolidayStructureImport } from './config/date-special-import'
import { FormBuilder, FormGroup } from '@angular/forms'
import { MessageService } from 'primeng/api'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { nationalHolidayService } from './service/national-holiday.service'
import { nationalHoliday } from './table/national-holiday-table-columns'
import { DatePipe } from '@angular/common'
import { editar, eliminar } from '@/app/shared/actions/actions.table'
import { ToastModule } from 'primeng/toast'
import { ToggleButtonModule } from 'primeng/togglebutton'

@Component({
    selector: 'app-config-fechas',
    standalone: true,
    imports: [
        PrimengModule,
        ContainerPageComponent,
        TablePrimengComponent,
        CalendarModule,
        BtnFileUploadComponent,
        ToastModule,
        ToggleButtonModule,
    ],
    templateUrl: './config-fechas.component.html',
    styleUrl: './config-fechas.component.scss',
    providers: [DatePipe],
})
export class ConfigFechasComponent implements OnInit {
    collection = nationalHolidayStructureImport
    file: any
    form: FormGroup
    option: string
    dialogs = {
        importNationalHolyday: {
            title: '',
            visible: false,
        },
        nationalHoliday: {
            title: '',
            visible: false,
        },
    }

    constructor(
        private fb: FormBuilder,
        public messageService: MessageService,
        public dialog: ConfirmationModalService,
        public nationalHolidayService: nationalHolidayService,
        public datePipe: DatePipe
    ) {
        this.form = this.fb.group({
            iFeriadoId: [''],
            cFeriadoNombre: [''],
            iYAcadId: [''],
            dtFeriado: [''],
            bFeriadoEsRecuperable: [''],
            cDocumento: [''],
        })
    }

    ngOnInit(): void {
        this.nationalHolidayService.getFeriadosNacionales().subscribe({
            next: (data: any) => {
                this.nationalHolyday.table.data.core = data.data.map(
                    (item) => ({
                        ...item,
                        dtFeriado: this.datePipe.transform(
                            item.dtFeriado,
                            'dd/MM/yyyy'
                        ),
                    })
                )
            },
            error: (error) => {
                console.error('Error fetching Años Académicos:', error)
            },
            complete: () => {
                console.log('Request completed')
            },
        })
    }
    // ESTRUCTURA DE TABLA
    nationalHolyday = {
        table: {
            columns: {
                core: nationalHoliday.columns.map((column) => ({
                    ...column,
                    field: column.field.split('/')[1] || column.field,
                })),
                import: nationalHoliday.columns.slice(0, -1),
            },
            data: {
                core: [],
                import: [],
            },
            actions: [editar, eliminar],
            accionBtnItem: nationalHoliday.accionBtnItem.bind(this),
        },
        container: nationalHoliday.container,
        saveData: nationalHoliday.saveData.bind(this),
        import: {
            loading: false,
            downloadTemplate: this.nationalHolidayService.downloadTemplate.bind(
                this.nationalHolidayService
            ),
            saveData: nationalHoliday.importData.bind(this),
            fileChange: nationalHoliday.fileChange.bind(this),
        },
    }
}
