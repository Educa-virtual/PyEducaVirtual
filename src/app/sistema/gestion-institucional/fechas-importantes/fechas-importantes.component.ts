import { PrimengModule } from '@/app/primeng.module';
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component';
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component';
import { Component, OnInit } from '@angular/core';
import { CalendarModule } from 'primeng/calendar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { importantDayService } from './service/important-day.service';
import { importantDay } from './table/important-day.table';
import { DatePipe } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DropdownModule } from 'primeng/dropdown';
import { importantDayRecovery } from './table/important-day-recovery.table';

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
  file: any;
  option: string;
  dialogs = {
    importantDay: {
      title: '',
      visible: false,
    },
    importantDaysRecovery: {
      title: '',
      visible: false,
    },
    importantDayRecovery: {
      title: '',
      visible: false,
    },
  };

  forms: {
    importantDay: FormGroup;
    importantDayRecovery: FormGroup;
  } = {
    importantDay: new FormGroup({}),
    importantDayRecovery: new FormGroup({}),
  };

  constructor(
    private fb: FormBuilder,
    public messageService: MessageService,
    public dialog: ConfirmationModalService,
    public importantDayService: importantDayService,
    public datePipe: DatePipe
  ) {
    this.forms.importantDay = this.fb.group({
      iFechaImpId: [''],
      iTipoFerId: [''],
      cFechaImpNombre: [''],
      iCalAcadId: [''],
      dtFechaImpFecha: [''],
      bFechaImpSeraLaborable: [''],
      cFechaImpURLDocumento: [''],
      cFechaImpInfoAdicional: [''],
    });

    this.forms.importantDayRecovery = this.fb.group({
      iFechaImpId: [''],
      iTipoFerId: [''],
      cFechaImpNombre: [''],
      iCalAcadId: [''],
      dtFechaImpFecha: [''],
      bFechaImpSeraLaborable: [''],
      cFechaImpURLDocumento: [''],
      cFechaImpInfoAdicional: [''],

      iDepFechaImpId: [''],
    });
  }

  ngOnInit(): void {
    this.importantDayService.getFechasImportantes().subscribe({
      next: (res: any) => {
        this.importantDay.table.data.core = res.data.map(item => ({
          ...item,
          dtFechaImpFecha: this.datePipe.transform(item.dtFechaImpFecha, 'dd/MM/yyyy'),
        }));
      },
      error: error => {
        console.error('Error fetching Años Académicos:', error);
      },
      complete: () => {
        console.log('Request completed');
      },
    });

    this.importantDayService.getCalendarioAcademico().subscribe({
      next: (res: any) => {
        this.importantDay.calendar = res.data?.[0];
      },
    });

    this.importantDayService.getTiposFechas().subscribe({
      next: (res: any) => {
        this.importantDay.types = res.data.map(item => ({
          code: item.iTipoFerId,
          name: item.cTipoFechaNombre,
        }));
      },
    });
  }
  // ESTRUCTURA DE TABLA
  importantDay = {
    calendar: null,
    types: null,
    typeActive: undefined,
    table: {
      columns: {
        core: importantDay.columns,
        recovery: importantDayRecovery.columns,
      },
      data: {
        core: [],
        import: [],
        recovery: [],
      },
      actions: {
        core: importantDay.table.actions,
        recovery: importantDayRecovery.table.actions,
      },
      accionBtnItem: {
        core: importantDay.accionBtnItem.bind(this),
        recovery: importantDayRecovery.accionBtnItem.bind(this),
      },
    },
    container: importantDay.container,
    saveData: {
      core: importantDay.saveData.bind(this),
      recovery: importantDayRecovery.saveData.bind(this),
    },
  };
}
