import { PrimengModule } from '@/app/primeng.module'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { Component, OnInit } from '@angular/core'
import { CalendarModule } from 'primeng/calendar'
import { FormBuilder, FormGroup } from '@angular/forms'
import { MessageService } from 'primeng/api'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { importantDayService } from './service/important-day.service'
import { importantDay } from './table/important-day-table-columns'
import { DatePipe } from '@angular/common'
import { editar, eliminar } from '@/app/shared/actions/actions.table'
import { ToastModule } from 'primeng/toast'
import { ToggleButtonModule } from 'primeng/togglebutton'
import { DropdownModule } from 'primeng/dropdown'

@Component({
    selector: 'app-fechas-importantes',
    standalone: true,
    imports: [
        PrimengModule,
        ContainerPageComponent,
        TablePrimengComponent,
        CalendarModule,
        ToastModule,
        DropdownModule,
        ToggleButtonModule,
    ],
    templateUrl: './fechas-importantes.component.html',
    styleUrl: './fechas-importantes.component.scss',
    providers: [DatePipe],
})
export class FechasImportentesComponent implements OnInit {
    file: any
    form: FormGroup
    option: string
    dialogs = {
        importNationalHolyday: {
            title: '',
            visible: false,
        },
        importantDay: {
            title: '',
            visible: false,
        },
    }

    constructor(
        private fb: FormBuilder,
        public messageService: MessageService,
        public dialog: ConfirmationModalService,
        public importantDayService: importantDayService,
        public datePipe: DatePipe
    ) {
        this.form = this.fb.group({
            iFechaImpId: [''],
            iTipoFerId: [''],
            cFechaImpNombre: [''],
            iCalAcadId: [''],
            dtFechaImpFecha: [''],
            bFechaImpSeraLaborable: [''],
            cFechaImpURLDocumento: [''],
            cFechaImpInfoAdicional: [''],
        })
    }

    ngOnInit(): void {
        this.importantDayService.getFechasImportantes().subscribe({
            next: (res: any) => {
                this.importantDay.table.data.core = res.data.map((item) => ({
                    ...item,
                    dtFechaImpFecha: this.datePipe.transform(
                        item.dtFechaImpFecha,
                        'dd/MM/yyyy'
                    ),
                }))
            },
            error: (error) => {
                console.error('Error fetching Años Académicos:', error)
            },
            complete: () => {
                console.log('Request completed')
            },
        })

        this.importantDayService.getCalendarioAcademico().subscribe({
            next: (res: any) => {
                this.importantDay.calendar = res.data?.[0]
            },
        })

        this.importantDayService.getTiposFechas().subscribe({
            next: (res: any) => {
                this.importantDay.types = res.data.map((item) => ({
                    code: item.iTipoFerId,
                    name: item.cTipoFechaNombre,
                }))
            },
        })
    }
    // ESTRUCTURA DE TABLA
    importantDay = {
        calendar: null,
        types: null,
        table: {
            columns: {
                core: importantDay.columns,
            },
            data: {
                core: [],
                import: [],
            },
            actions: [editar, eliminar],
            accionBtnItem: importantDay.accionBtnItem.bind(this),
        },
        container: importantDay.container,
        saveData: importantDay.saveData.bind(this),
    }
}
