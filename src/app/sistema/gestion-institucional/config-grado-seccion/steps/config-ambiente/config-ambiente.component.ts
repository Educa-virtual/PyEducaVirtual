import { AdmStepGradoSeccionService } from '@/app/servicios/adm/adm-step-grado-seccion.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { PrimengModule } from '@/app/primeng.module';
import { MenuItem } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';

@Component({
  selector: 'app-config-ambiente',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent],
  templateUrl: './config-ambiente.component.html',
  styleUrl: './config-ambiente.component.scss',
})
export class ConfigAmbienteComponent implements OnInit {
  form: FormGroup;
  formBusqueda: FormGroup;
  iConfigId: number;

  items: MenuItem[];
  caption: string;
  visible: boolean = false;
  mensaje: string;
  option: string;
  anio: [];

  tipos_ambientes: Array<object>;
  estados_ambientes: Array<object>;
  pisos_ambientes: Array<object>;
  usos_ambientes: Array<object>;
  ubicaciones_ambientes: Array<object>;
  estados: Array<object> = [
    { label: 'ACTIVO', value: 1 },
    { label: 'INACTIVO', value: 0 },
  ];

  configuracion: any[];
  perfil: any = [];

  ambientes: any[];
  ambientes_filtrados: any[];

  constructor(
    private stepService: AdmStepGradoSeccionService,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private store: LocalStoreService,
    private confirmService: ConfirmationModalService
  ) {
    this.stepService.setActiveIndex(1);
    this.perfil = this.store.getItem('dremoPerfil');
    this.route.parent?.paramMap.subscribe(params => {
      this.iConfigId = params.get('id') ? Number(params.get('id')) : null;
    });
  }

  ngOnInit() {
    try {
      this.form = this.fb.group({
        iConfigId: [this.iConfigId],
        iIieeAmbienteId: [null],
        iTipoAmbienteId: [null],
        iEstadoAmbId: [null],
        iUbicaAmbId: [null],
        iUsoAmbId: [null],
        iPisoAmbid: [null],
        bAmbienteEstado: [null, [Validators.required]],
        cAmbienteNombre: ['', [Validators.required]],
        cAmbienteDescripcion: [''],
        iAmbienteArea: [null],
        iAmbienteAforo: ['', [Validators.required]],
        cAmbienteObs: [''],
        cImagen: [''],
      });

      this.formBusqueda = this.fb.group({
        textoBusqueda: [''],
        bAmbienteEstado: [null],
      });
    } catch (error) {
      console.error(error, 'Error al inicializar el formulario');
    }

    this.stepService
      .crearConfiguracion({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iConfigId: this.iConfigId,
      })
      .subscribe((data: any) => {
        this.tipos_ambientes = this.stepService.getTiposAmbientes(data?.tipos_ambientes);
        this.estados_ambientes = this.stepService.getEstadosAmbientes(data?.estados_ambientes);
        this.pisos_ambientes = this.stepService.getPisosAmbientes(data?.pisos_ambientes);
        this.usos_ambientes = this.stepService.getUsosAmbientes(data?.usos_ambientes);
        this.ubicaciones_ambientes = this.stepService.getUbicacionesAmbientes(
          data?.ubicaciones_ambientes
        );
      });

    this.listarAmbientes();
  }

  listarAmbientes() {
    this.stepService
      .listarAmbientes({
        iConfigId: this.iConfigId,
      })
      .subscribe({
        next: (data: any) => {
          this.ambientes = data.data;
          this.ambientes_filtrados = this.ambientes;
        },
        error: error => {
          console.error('Error al obtener datos:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  siguienteTab() {
    this.router.navigate([`/gestion-institucional/config/${this.iConfigId}/seccion`]);
  }

  filtrarTabla() {
    const textoBusqueda = this.formBusqueda.get('textoBusqueda')?.value.toLowerCase();
    const bAmbienteEstado = this.formBusqueda.get('bAmbienteEstado')?.value;
    this.ambientes_filtrados = this.ambientes.filter(ambiente => {
      if (
        bAmbienteEstado == null ||
        (ambiente.bAmbienteEstado && Number(ambiente.bAmbienteEstado) == Number(bAmbienteEstado))
      ) {
        if (
          ambiente.cAmbienteNombre &&
          ambiente.cAmbienteNombre.toLowerCase().includes(textoBusqueda)
        )
          return ambiente;
        if (
          ambiente.iAmbienteAforo &&
          ambiente.iAmbienteAforo.toLowerCase().includes(textoBusqueda)
        )
          return ambiente;
        if (
          ambiente.cTipoAmbienteNombre &&
          ambiente.cTipoAmbienteNombre.toLowerCase().includes(textoBusqueda)
        )
          return ambiente;
        if (
          ambiente.cPisoAmbNombre &&
          ambiente.cPisoAmbNombre.toLowerCase().includes(textoBusqueda)
        )
          return ambiente;
        if (
          ambiente.cAmbienteEstado &&
          ambiente.cAmbienteEstado.toLowerCase().includes(textoBusqueda)
        )
          return ambiente;
      } else {
        return null;
      }
    });
  }

  agregarAmbiente() {
    this.limpiarFormulario();
    this.visible = true;
    this.caption = 'Registrar ambientes';
    this.option = 'crear';
    this.setFormAmbiente({});
  }

  setFormAmbiente(item: any) {
    this.form.patchValue(item);
    this.form
      .get('iTipoAmbienteId')
      ?.setValue(item.iTipoAmbienteId ? Number(item.iTipoAmbienteId) : null);
    this.form.get('iEstadoAmbId')?.setValue(item.iEstadoAmbId ? Number(item.iEstadoAmbId) : null);
    this.form.get('iUbicaAmbId')?.setValue(item.iUbicaAmbId ? Number(item.iUbicaAmbId) : null);
    this.form.get('iUsoAmbId')?.setValue(item.iUsoAmbId ? Number(item.iUsoAmbId) : null);
    this.form.get('iPisoAmbid')?.setValue(item.iPisoAmbid ? Number(item.iPisoAmbid) : null);
    this.form
      .get('bAmbienteEstado')
      ?.setValue(item.bAmbienteEstado ? Number(item.bAmbienteEstado) : null);
    this.form.get('cAmbienteNombre').markAsDirty();
    this.form.get('iAmbienteAforo').markAsDirty();
  }

  editarAmbiente(item: any) {
    this.limpiarFormulario();
    this.visible = true;
    this.caption = 'Editar ambientes';
    this.option = 'editar';
    this.setFormAmbiente(item);
  }

  eliminarAmbiente(item: any) {
    this.stepService
      .borrarAmbiente({
        iIieeAmbienteId: item.iIieeAmbienteId,
      })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminado',
            detail: 'Ambiente eliminado exitosamente',
          });
          this.listarAmbientes();
        },
        error: error => {
          console.error('Error al eliminar ambiente:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  accionBtnItemTable({ accion, item }) {
    if (accion === 'editar') {
      this.editarAmbiente(item);
    }
    if (accion === 'eliminar') {
      this.confirmService.openConfirm({
        message: '¿Realmente desea eliminar este elemento?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.eliminarAmbiente(item);
        },
      });
    }
  }

  guardarAmbiente() {
    console.log(this.form.value);
    this.stepService.guardarAmbiente(this.form.value).subscribe({
      next: () => {
        this.cerrarDialogo();
        this.messageService.add({
          severity: 'success',
          summary: 'Registrado',
          detail: 'Ambiente registrado exitosamente',
        });
        this.listarAmbientes();
      },
      error: error => {
        console.error('Error al registrar ambiente:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  actualizarAmbiente() {
    this.stepService.actualizarAmbiente(this.form.value).subscribe({
      next: () => {
        this.cerrarDialogo();
        this.messageService.add({
          severity: 'success',
          summary: 'Actualizado',
          detail: 'Ambiente actualizado exitosamente',
        });
        this.listarAmbientes();
      },
      error: error => {
        console.error('Error al actualizar ambiente:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  cerrarDialogo() {
    this.visible = false;
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.form.reset();
    this.form.get('iConfigId')?.setValue(this.iConfigId);
  }

  selectedItems = [];

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
  ];

  columns = [
    {
      type: 'text',
      width: '45%',
      field: 'cAmbienteNombre',
      header: 'Ambiente',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '10%',
      field: 'iAmbienteAforo',
      header: 'Aforo',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '15%',
      field: 'cTipoAmbienteNombre',
      header: 'Tipo',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '10%',
      field: 'cPisoAmbNombre',
      header: 'Piso',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '10%',
      field: 'cAmbienteEstado',
      header: 'Estado',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'actions',
      width: '10%',
      field: 'actions',
      header: 'Acciones',
      text_header: 'center',
      text: 'center',
    },
  ];
}
