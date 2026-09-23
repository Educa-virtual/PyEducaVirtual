import { PrimengModule } from '@/app/primeng.module';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { ReactiveFormService } from '@/app/servicios/reactive-form.service';
import {
  IActionTable,
  IColumn,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { LogroAlcanzadoService } from '../../services/logro-alcanzado.service';

@Component({
  selector: 'app-tipo-escala',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent],
  templateUrl: './tipo-escala.component.html',
  styleUrl: './tipo-escala.component.scss',
})
export class TipoEscalaComponent {
  titulo: string = 'Nuevo tipo de escala';

  estados: any[] = [
    { label: 'ACTIVO', value: 1 },
    { label: 'INACTIVO', value: 0 },
  ];

  tipos_escalas: any[] = [];
  iYAcadId: number;

  tipo_escala: any = {};
  bEditar: boolean = false;
  visible: boolean = false;

  formTipoEscala: FormGroup;

  breadCrumbHome: MenuItem = { icon: 'pi pi-home' };
  breadCrumbItems: MenuItem[] = [{ label: 'Tipo de escala' }];

  constructor(
    private formService: ReactiveFormService,
    private store: LocalStoreService,
    private fb: FormBuilder,
    private router: Router,
    private logroService: LogroAlcanzadoService,
    private messageService: MessageService
  ) {
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
  }

  ngOnInit(): void {
    this.formTipoEscala = this.fb.group({
      iTipoEscalaId: [null],
      cTipoEscalaNombre: ['', Validators.required],
      cTipoEscalaResolucion: [''],
      cTipoEscalaAnio: [''],
      bHabilitado: [true],
    });
    this.listarTiposEscala();
  }

  listarTiposEscala() {
    this.logroService.listarTipoEscala({}).subscribe({
      next: (data: any) => {
        this.tipos_escalas = data.data;
      },
      error: error => {
        console.error('Error obteniendo datos:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  limpiarModal() {
    this.bEditar = false;
    this.setFormTipoEscala({});
  }

  crearTipoEscala() {
    this.bEditar = false;
    this.visible = true;
    this.titulo = 'Nuevo tipo de escala';
  }

  editarTipoEscala() {
    this.bEditar = true;
    this.visible = true;
    this.titulo = 'Editar tipo de escala';
  }

  setFormTipoEscala(tipo: any) {
    this.formTipoEscala.patchValue(tipo);
    this.formService.validarFormulario(this.formTipoEscala);
    this.formService.formatearFormControl(
      this.formTipoEscala,
      'bHabilitado',
      tipo.bHabilitado,
      'number'
    );
  }

  actualizarTipoEscala() {
    this.logroService.actualizarTipoEscala(this.formTipoEscala.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Se actualizaron los datos correctamente.',
        });
        this.cerrarModal();
        this.listarTiposEscala();
      },
      error: error => {
        console.error('Error actualizando tipo de escala:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  guardarTipoEscala() {
    this.logroService.guardarTipoEscala(this.formTipoEscala.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Se guardaron los datos correctamente.',
        });
        this.cerrarModal();
        this.listarTiposEscala();
      },
      error: error => {
        console.error('Error guardando tipo de escala:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  cerrarModal() {
    this.visible = false;
    this.limpiarModal();
  }

  /** Datos para la tabla de tipos de escala */

  accionBtnItem({ accion, item }) {
    switch (accion) {
      case 'editar':
        this.editarTipoEscala();
        this.setFormTipoEscala(item);
        break;
      case 'escalas':
        this.router.navigate([`/evaluaciones/tipo-escala/${item.iTipoEscalaId}/escalas`]);
        break;
    }
  }

  acciones: IActionTable[] = [
    {
      labelTooltip: 'Editar tipo de escala',
      icon: 'pi pi-pencil',
      accion: 'editar',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
    },
    {
      labelTooltip: 'Gestionar escalas',
      icon: 'pi pi-list-check',
      accion: 'escalas',
      type: 'item',
      class: 'p-button-rounded p-button-success p-button-text',
    },
  ];

  columns: IColumn[] = [
    {
      type: 'text',
      width: '10%',
      field: 'cTipoEscalaNombre',
      header: 'Nombre',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '10%',
      field: 'cTipoEscalaResolucion',
      header: 'Resolución',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '10%',
      field: 'cTipoEscalaAnio',
      header: 'Año',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'estado-activo',
      width: '10%',
      field: 'bHabilitado',
      header: 'Estado',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'actions',
      width: '15%',
      field: 'actions',
      header: 'Acciones',
      text_header: 'right',
      text: 'right',
    },
  ];
}
