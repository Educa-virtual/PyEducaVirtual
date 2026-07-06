import { Component, inject, OnInit } from '@angular/core';
import { IColumn, TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component';
import { MenuItem, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from '@/app/servicios/general.service';
import { StepConfirmationService } from '@/app/servicios/confirm.service';
import { PrimengModule } from '@/app/primeng.module';
import { YearService } from './config/service/year.service';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { distribucionBloques } from './config/table/distribucion-bloque.table';
import { DistribucionBloquesService } from './config/service/distribucion-bloques.service';
import { DatePipe } from '@angular/common';
import { PeriodoEvaluacionesService } from './config/service/periodoEvaluaciones.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { GlobalStateService } from 'src/app/servicios/global-state.service';

@Component({
  selector: 'app-years',
  standalone: true,
  imports: [TablePrimengComponent, PrimengModule],
  providers: [MessageService, GeneralService, StepConfirmationService, DatePipe],
  templateUrl: './years.component.html',
  styleUrl: './years.component.scss',
}) //, OnChanges, OnDestroy
export class YearsComponent implements OnInit {
  formYear: FormGroup;
  years: any;
  forms: {
    distribucionBloque: FormGroup;
    procesarPeriodos: FormGroup;
  } = {
    distribucionBloque: new FormGroup({}),
    procesarPeriodos: new FormGroup({}),
  };

  bEditar: boolean = false;

  private _LocalStoreService = inject(LocalStoreService);
  perfil = this._LocalStoreService.getItem('dremoPerfil');

  dialogYear = {
    title: '',
    visible: false,
  };
  dialogs = {
    distribucionBloques: {
      title: '',
      visible: false,
    },
    distribucionBloque: {
      title: '',
      visible: false,
    },
    procesarPeriodo: {
      title: '',
      visible: false,
    },
  };

  periodoEvaluaciones = {
    types: [],
    processData: () => {
      const iPeriodoEvalId = this.forms.procesarPeriodos.get('iPeriodoEvalId').value;
      const iYAcadId = this.formYear.get('iYAcadId').value;

      if (!iPeriodoEvalId || !iYAcadId) {
        this.messageService.add({
          severity: 'error',
          summary: 'Calendario académico',
          detail: 'Falta información para procesar el calendario',
          life: 3000,
        });

        return;
      }

      this.periodoEvaluacionesService
        .processConfigCalendario({
          iCredEntPerfId: this.perfil.iCredEntPerfId ?? null,
          iCredId: this.perfil.iCredId ?? null,
          iPerioEvalId: iPeriodoEvalId,
          iYAcadId: iYAcadId,
        })
        .subscribe({
          next: (res: any) => {
            const result = res.data[0];
            const isSuccess = result.Message === 'true';

            this.messageService.add({
              severity: isSuccess ? 'success' : 'warn',
              summary: 'Calendario académico',
              detail: result.resultado,
              life: 3000,
            });

            this.dialogs.procesarPeriodo.visible = !isSuccess;
          },
        });
    },
  };

  distribucionBloques = {
    types: [],
    accionBtnItem: distribucionBloques.accionBtnItem.bind(this),
    table: {
      columns: distribucionBloques.table.columns,
      data: [],
      actions: distribucionBloques.table.actions.call(this),
    },
    saveData: distribucionBloques.saveData.bind(this),
  };

  tiposDistribucion = [
    {
      iTipoDistribucionId: 1,
      cBloqueNombre: 'Semana lectiva',
    },
    {
      iTipoDistribucionId: 2,
      cBloqueNombre: 'Semana de gestión',
    },
  ];

  breadCrumbHome: MenuItem = { label: 'Inicio', icon: 'pi pi-house' };
  breadCrumbItems: MenuItem[] = [{ label: 'Años académicos' }];

  constructor(
    public messageService: MessageService,
    public query: GeneralService,
    private fb: FormBuilder,
    public yearsService: YearService,
    public distribucionBloquesService: DistribucionBloquesService,
    public dialogConfirm: ConfirmationModalService,
    public datePipe: DatePipe,
    public periodoEvaluacionesService: PeriodoEvaluacionesService,
    private globalState: GlobalStateService
  ) {}

  ngOnInit(): void {
    try {
      this.formYear = this.fb.group({
        iYearId: [''],
        cYearNombre: [new Date().getFullYear(), [Validators.required]],
        cYearOficial: ['', [Validators.required]],
        iYearEstado: [''],
        dtYAcadInicio: ['', [Validators.required]],
        dYAcadFin: ['', [Validators.required]],
        iYAcadId: [''],
      });

      this.forms.distribucionBloque = this.fb.group({
        iDistribucionBloqueId: [''],
        iYAcadId: [''],
        iTipoDistribucionId: [''],
        iSesionId: [''],
        dtInicioBloque: [''],
        dtFinBloque: [''],
        iEstado: [''],
      });

      this.forms.procesarPeriodos = this.fb.group({
        iPeriodoEvalId: [''],
      });
    } catch (error) {
      console.log(error);
    }
    this.listarYears();

    this.distribucionBloquesService.getTipoDistribucion().subscribe({
      next: (res: any) => {
        this.distribucionBloques.types = res.data.map(item => ({
          code: item.iTipoDistribucionId,
          name: item.cBloqueNombre,
        }));
      },
    });

    this.periodoEvaluacionesService.getPeriodosEvaluaciones().subscribe({
      next: (res: any) => {
        this.periodoEvaluaciones.types = res.data.map(item => ({
          code: item.iPeriodoEvalId,
          name: item.cPeriodoEvalNombre,
        }));
      },
    });
  }

  actualizarTolbarAnio(data: any) {
    // O eliminar todo
    // localStorage.clear();
    // sessionStorage.clear();

    /* para leer reactivamente
    this.globalState.years$.subscribe(years => {
    console.log('Años disponibles:', years);
  });

  this.globalState.selectedYear$.subscribe(year => {
    console.log('Año seleccionado:', year);
  });
   
   */
    //Se asignan los nuevos años
    this.globalState.updateYears(data);

    //Asigna el año agregado
    const year_actual = data.find(year => year.iYearEstado === '1');

    this.globalState.setSelectedYear(year_actual);
    return;
    //return;
    // Mostrar el diálogo de confirmación
    /* this.dialogConfirm.openAlert({
      header: 'Se reiniciará  para aplicar los cambios del nuevo año',
    
      });
    // Esperar 5 segundos (5000 ms)
      setTimeout(() => {
        window.location.reload();
        /*   const user = localStorage.getItem('dremoToken')

        const accessToken = localStorage.getItem('auth-token')
        const refreshToken = localStorage.getItem('auth-refreshtoken')
        if (user) {
            this.tokenStorageService.saveUser(user.replaceAll('"', ''))
            this.tokenStorageService.saveToken(accessToken)
            this.tokenStorageService.saveRefreshToken(refreshToken)
        } else {
            localStorage.clear()
            this.tokenStorageService.signOut()
        }
    }, 2000);*/
  }

  agregarYear() {
    this.bEditar = false;
    this.dialogYear.title = 'Agregar año académico';
    this.dialogYear.visible = true;
    this.setFormYear({
      iYearEstado: true,
      iYearId: new Date().getFullYear(),
    });
  }

  listarYears() {
    this.yearsService.listarYears({}).subscribe({
      next: (res: any) => {
        this.years = res.data;
      },
      error: (error: any) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  guardarYear() {
    this.yearsService.guardarYear(this.formYear.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Se guardó con éxito',
        });
        this.dialogYear.visible = false;
        this.listarYears();
      },
      error: error => {
        console.error('Error guardando año académico:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  actualizarYear() {
    this.yearsService.actualizarYear(this.formYear.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Se actualizó con éxito',
        });
        this.dialogYear.visible = false;
        this.listarYears();
      },
      error: error => {
        console.error('Error actualizando año académico:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  eliminarYear(item: any) {
    this.yearsService.borrarYear(item).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Eliminado con éxito',
        });
        this.listarYears();
      },
      error: (error: any) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  setFormYear(data: any) {
    this.formYear.reset(data);
    this.yearsService.formatearFormControl(
      this.formYear,
      'dtYAcadInicio',
      data.dtYAcadInicio,
      'date'
    );
    this.yearsService.formatearFormControl(this.formYear, 'dYAcadFin', data.dYAcadFin, 'date');
  }

  accionBtnItem({ accion, item }) {
    switch (accion) {
      case 'ver':
        this.formYear.disable();
        this.dialogYear = {
          title: 'Año académico',
          visible: true,
        };
        this.setFormYear(item);
        break;
      case 'editar':
        this.bEditar = true;
        this.dialogYear = {
          title: 'Editar año académico',
          visible: true,
        };
        this.formYear.get('iYearEstado').disable();
        this.setFormYear(item);

        break;
      case 'eliminar':
        this.dialogConfirm.openConfirm({
          header: 'Eliminar año',
          message: `¿Realmente desea eliminar el año: ${item.iYearId} ?`,
          accept: () => {
            this.eliminarYear(item);
          },
        });
        break;
      case 'semanasLectivas':
        this.dialogs.distribucionBloques = {
          title: `Semanas lectivas del año: ${item.iYearId}`,
          visible: true,
        };

        this.formYear.patchValue({
          iYearId: item.iYearId,
          cYearNombre: item.cYearNombre,
          cYearOficial: item.cYearOficial,
          iYearEstado: item.iYearEstado,
        });

        this.distribucionBloquesService.getDistribucionBloques(item.iYearId).subscribe({
          next: (res: any) => {
            console.log('res');
            console.log(res.data);

            this.distribucionBloques.table.data = res.data.map(item => {
              const tipoDistribucion = this.tiposDistribucion.find(
                tipo => tipo.iTipoDistribucionId == item.iTipoDistribucionId
              );

              return {
                ...item,
                cBloqueNombre: tipoDistribucion.cBloqueNombre,
                dtInicioBloque: this.datePipe.transform(item.dtInicioBloque, 'dd/MM/yyyy'),
                dtFinBloque: this.datePipe.transform(item.dtFinBloque, 'dd/MM/yyyy'),
              };
            });
          },
        });

        break;
      case 'procesarPeriodos':
        this.dialogs.procesarPeriodo = {
          title: `Generar periodos del calendario académico para el año: ${item.iYearId}`,
          visible: true,
        };

        this.formYear.patchValue({
          iYearId: item.iYearId,
          cYearNombre: item.cYearNombre,
          cYearOficial: item.cYearOficial,
          iYearEstado: item.iYearEstado,
          iYAcadId: item.iYAcadId,
        });

        console.log('this.formYear');
        console.log(this.formYear.value);

        break;
      case 'verSemanasLectivas':
        this.dialogs.distribucionBloques = {
          title: `Semanas lectivas del año: ${item.iYearId}`,
          visible: true,
        };

        this.formYear.disable();
        this.forms.distribucionBloque.disable();

        this.formYear.patchValue({
          iYearId: item.iYearId,
          cYearNombre: item.cYearNombre,
          cYearOficial: item.cYearOficial,
          iYearEstado: item.iYearEstado,
        });

        this.distribucionBloquesService.getDistribucionBloques(item.iYearId).subscribe({
          next: (res: any) => {
            this.distribucionBloques.table.data = res.data.map(item => {
              const tipoDistribucion = this.tiposDistribucion.find(
                tipo => tipo.iTipoDistribucionId == item.iTipoDistribucionId
              );

              return {
                ...item,
                cBloqueNombre: tipoDistribucion.cBloqueNombre,
                dtInicioBloque: this.datePipe.transform(item.dtInicioBloque, 'dd/MM/yyyy'),
                dtFinBloque: this.datePipe.transform(item.dtFinBloque, 'dd/MM/yyyy'),
              };
            });
          },
        });
        break;
    }
  }

  /* Datos de tabla */
  columns: IColumn[] = [
    {
      type: 'item',
      width: '5%',
      field: 'item',
      header: 'Item',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '10%',
      field: 'cYearNombre',
      header: 'Año',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '35%',
      field: 'cYearOficial',
      header: 'Nombre oficial',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'estado-activo',
      width: '5%',
      field: 'iYearEstado',
      header: 'Activo',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'date',
      width: '10%',
      field: 'dtYAcadInicio',
      header: 'Inicio',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'date',
      width: '10%',
      field: 'dYAcadFin',
      header: 'Fin',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'dropdown-actions',
      width: '5%',
      field: 'actions',
      header: 'Acciones',
      text_header: 'right',
      text: 'right',
    },
  ];

  actions = [
    {
      labelTooltip: 'Gestionar semanas lectivas',
      icon: 'pi pi-calendar',
      accion: 'semanasLectivas',
      type: 'item',
      class: 'p-menuitem-link text-primary',
      isVisible: rowData => Number(rowData.iYearEstado) == 1,
    },
    {
      labelTooltip: 'Ver semanas lectivas',
      icon: 'pi pi-calendar',
      accion: 'verSemanasLectivas',
      type: 'item',
      class: 'p-menuitem-link text-primary',
      isVisible: rowData => Number(rowData.iYearEstado) == 0,
    },
    {
      labelTooltip: 'Procesar periodos',
      icon: 'pi pi-sync',
      accion: 'procesarPeriodos',
      type: 'item',
      class: 'p-menuitem-link text-purple-500',
      isVisible: rowData => Number(rowData.iYearEstado) == 1,
    },
    {
      labelTooltip: 'Ver',
      icon: 'pi pi-eye',
      accion: 'ver',
      type: 'item',
      class: 'p-menuitem-link text-gray-500',
      isVisible: rowData => Number(rowData.iYearEstado) == 0,
    },
    {
      labelTooltip: 'Editar',
      icon: 'pi pi-pencil',
      accion: 'editar',
      type: 'item',
      class: 'p-menuitem-link text-orange-500',
      isVisible: rowData => Number(rowData.iYearEstado) == 1,
    },
    {
      labelTooltip: 'Eliminar',
      icon: 'pi pi-trash',
      accion: 'eliminar',
      type: 'item',
      class: 'p-menuitem-link text-red-500',
      isVisible: rowData => Number(rowData.iYearEstado) == 1,
    },
  ];
}
