import { PrimengModule } from '@/app/primeng.module';
import {
  IActionTable,
  IColumn,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatosRecordatorioService } from '../services/datos-recordatorio.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { MenuItem, MessageService } from 'primeng/api';
import { DIRECTOR_IE, DOCENTE } from '@/app/servicios/seg/perfiles';

@Component({
  selector: 'app-recordatorio-fechas',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent],
  templateUrl: './recordatorio-fechas.component.html',
  styleUrl: './recordatorio-fechas.component.scss',
})
export class RecordatorioFechasComponent implements OnInit {
  @ViewChild('filtro') filtro: ElementRef;

  cumpleanios: Array<object> = [];
  cumpleanios_filtrados: Array<object> = [];
  form: FormGroup;
  perfil: any;
  iYAcadId: any;
  periodos: Array<object>;
  recordatorio_activo: boolean = false;
  visibleDialog: boolean = false;

  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;

  es_director_docente: boolean = false;
  tipos_relaciones: Array<object> = [
    { value: 'ESTUDIANTE', label: 'ESTUDIANTE' },
    { value: 'DOCENTE', label: 'DOCENTE' },
    { value: 'PERSONAL', label: 'PERSONAL' },
    { value: 'ESPECIALISTA', label: 'ESPECIALISTA' },
  ];

  private _messageService = inject(MessageService);

  constructor(
    private fb: FormBuilder,
    private datosRecordatorio: DatosRecordatorioService,
    private store: LocalStoreService
  ) {
    this.perfil = this.store.getItem('dremoPerfil');
    this.es_director_docente = [DIRECTOR_IE, DOCENTE].includes(Number(this.perfil.iPerfilId));
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.breadCrumbItems = [
      {
        label: 'Bienestar Social',
      },
      {
        label: 'Recordatorio de cumpleaños',
      },
    ];
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
  }

  ngOnInit(): void {
    try {
      this.form = this.fb.group({
        iCredEntPerfId: [this.perfil.iCredEntPerfId],
        iRecorPeriodoId: [null],
        iPersId: [null],
        iYAcadId: [this.iYAcadId],
      });
    } catch (error) {
      console.error('Error creando formulario:', error);
    }

    this.datosRecordatorio.verRecordatorioPeriodos().subscribe((data: any) => {
      this.periodos = this.datosRecordatorio.getPeriodos(data);
    });

    this.verCumpleanios();
  }

  verCumpleanios() {
    this.datosRecordatorio
      .verFechasEspeciales({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iYAcadId: this.iYAcadId,
      })
      .subscribe({
        next: (data: any) => {
          this.cumpleanios = data.data;
          this.cumpleanios_filtrados = this.cumpleanios;
        },
        error: error => {
          console.error('Error al obtener cumpleanos:', error);
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  editarRecordatorio(item: any) {
    this.visibleDialog = true;
    this.verRecordatorio(item?.iPersId);
  }

  verRecordatorio(iPersId: any) {
    this.datosRecordatorio
      .verConfRecordatorio({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iPersId: iPersId,
        iYAcadId: this.iYAcadId,
      })
      .subscribe({
        next: (data: any) => {
          if (data.data.length) {
            this.setFormRecordatorio(data.data[0]);
          } else {
            this.setFormRecordatorio({
              iCredEntPerfId: this.perfil.iCredEntPerfId,
              iRecorPeriodoId: null,
              iPersId: iPersId,
              iYAcadId: this.iYAcadId,
            });
          }
        },
        error: error => {
          console.error('Error al obtener recordatorio:', error);
        },
      });
  }

  setFormRecordatorio(data: any) {
    this.form.reset();
    if (data) {
      this.form.patchValue(data);
      this.datosRecordatorio.formatearFormControl(
        this.form,
        'iRecorPeriodoId',
        +data.iRecorPeriodoId,
        'number'
      );
    }
  }

  actualizarConfRecordatorio() {
    this.datosRecordatorio.actualizarConfReordatorio(this.form.value).subscribe({
      next: () => {
        this._messageService.add({
          severity: 'success',
          summary: 'Actualización exitosa',
          detail: 'Se actualizaron los datos',
        });
        this.visibleDialog = false;
        this.verCumpleanios();
      },
      error: error => {
        console.error('Error actualizando recordatorio:', error);
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  clearForm() {
    this.form.reset();
  }

  /* Filtrar tabla según búsqueda */
  filtrarTabla() {
    if (!this.cumpleanios) {
      return null;
    }
    const filtro = this.filtro.nativeElement.value.toLowerCase();
    this.cumpleanios_filtrados = this.cumpleanios.filter((cumple: any) => {
      if (cumple.iCumpleaniosDiff && cumple.iCumpleaniosDiff.toLowerCase().includes(filtro)) {
        return cumple;
      }
      if (
        cumple.cCumpleaniosFormateado &&
        cumple.cCumpleaniosFormateado.toLowerCase().includes(filtro)
      ) {
        return cumple;
      }
      if (
        cumple.cPersNombreApellidos &&
        cumple.cPersNombreApellidos.toLowerCase().includes(filtro)
      ) {
        return cumple;
      }
      if (cumple.cRelacionNombre && cumple.cRelacionNombre.toLowerCase().includes(filtro)) {
        return cumple;
      }
      if (cumple.cGradoNombre && cumple.cGradoNombre.toLowerCase().includes(filtro)) return cumple;
      if (cumple.cSeccionNombre && cumple.cSeccionNombre.toLowerCase().includes(filtro))
        return cumple;
      if (cumple.cRecorPeriodoNombre && cumple.cRecorPeriodoNombre.toLowerCase().includes(filtro))
        return cumple;
    });
    return null;
  }

  accionBnt({ accion, item }): void {
    switch (accion) {
      case 'editar':
        this.editarRecordatorio(item);
        break;
      default:
        console.warn('Acción no reconocida:', accion);
    }
  }

  public columnasTabla: IColumn[] = [
    {
      field: 'iCumpleaniosDiff',
      type: 'text',
      width: '15%',
      header: 'Días restantes',
      text_header: 'center',
      text: 'center',
    },
    {
      field: 'cCumpleaniosFormateado',
      type: 'text',
      width: '25%',
      header: 'Cumpleaños',
      text_header: 'left',
      text: 'left',
    },
    {
      field: 'cPersNombreApellidos',
      type: 'text',
      width: '40%',
      header: 'Nombre',
      text_header: 'left',
      text: 'left',
    },
    {
      field: 'cRelacionNombre',
      type: 'text',
      width: '20%',
      header: 'Relación',
      text_header: 'center',
      text: 'center',
      class: 'hidden md:table-cell',
    },
    {
      field: 'cGradoNombre',
      type: 'text',
      width: '10%',
      header: 'Grado',
      text_header: 'center',
      text: 'center',
      class: () => {
        if (this.es_director_docente) {
          return 'hidden md:table-cell';
        }
        return 'hidden';
      },
    },
    {
      field: 'cSeccionNombre',
      type: 'text',
      width: '10%',
      header: 'Sección',
      text_header: 'center',
      text: 'center',
      class: () => {
        if (this.es_director_docente) {
          return 'hidden md:table-cell';
        }
        return 'hidden';
      },
    },
    {
      field: 'cRecorPeriodoNombre',
      type: 'text',
      width: '20%',
      header: 'Recordatorio',
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
  ];

  public accionesTabla: IActionTable[] = [
    {
      labelTooltip: 'Editar',
      icon: 'pi pi-bell',
      accion: 'editar',
      type: 'item',
      class: 'p-button-rounded p-button-primary p-button-text',
    },
  ];
}
