import { Component, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { AdmStepGradoSeccionService } from '@/app/servicios/adm/adm-step-grado-seccion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { IActionContainer } from '@/app/shared/container-page/container-page.component';
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';

@Component({
  selector: 'app-config-seccion',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent],
  templateUrl: './config-seccion.component.html',
  styleUrl: './config-seccion.component.scss',
  providers: [],
})
export class ConfigSeccionComponent implements OnInit {
  items: MenuItem[];
  caption: string;
  visible: boolean = false;

  form: FormGroup;
  formBusqueda: FormGroup;

  iConfigId: number;
  perfil: any;

  grados_secciones: any[] = [];
  grados_secciones_filtrados: any[] = [];

  nivel_grados: any[] = [];
  secciones: any[] = [];
  turnos: any[] = [];
  modalidades_servicio: any[] = [];
  ambientes: any[] = [];

  bActualizar: boolean = false;

  constructor(
    private confirmService: ConfirmationModalService,
    private stepService: AdmStepGradoSeccionService,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private store: LocalStoreService
  ) {
    this.stepService.setActiveIndex(2);
    this.perfil = this.store.getItem('dremoPerfil');
    this.route.parent?.paramMap.subscribe(params => {
      this.iConfigId = params.get('id') ? Number(params.get('id')) : null;
    });
  }

  ngOnInit() {
    try {
      this.form = this.fb.group({
        iConfigId: [this.iConfigId],
        iDetConfId: [null],
        iTurnoId: [null, [Validators.required]],
        iModalServId: [null, [Validators.required]],
        iIieeAmbienteId: [null, Validators.required],
        iSeccionId: [null, Validators.required],
        iNivelGradoId: [null, Validators.required],
        cDetConfNombreSeccion: ['', Validators.required],
        iDetConfCantEstudiantes: [1, Validators.required],
        cDetConfObs: [''],
      });
      this.formBusqueda = this.fb.group({
        textoBusqueda: [''],
        iNivelGradoId: [null],
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
        this.nivel_grados = this.stepService.getNivelGrados(data?.nivel_grados);
        this.secciones = this.stepService.getSecciones(data?.secciones);
        this.turnos = this.stepService.getTurnos(data?.turnos);
        this.modalidades_servicio = this.stepService.getModalidades(data?.modalidades_servicio);
      });
    this.getAmbientes();
    this.listarGradosSecciones();
  }

  getAmbientes() {
    this.stepService
      .listarAmbientes({
        iConfigId: this.iConfigId,
      })
      .subscribe({
        next: (data: any) => {
          if (data.data) {
            this.ambientes = data.data.map(ambiente => {
              return {
                value: Number(ambiente.iIieeAmbienteId),
                label:
                  ambiente.cAmbienteNombre + ' (AFORO: ' + (ambiente.iAmbienteAforo ?? 'S/N') + ')',
              };
            });
          }
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

  listarGradosSecciones() {
    this.stepService
      .listarGradosSecciones({
        iConfigId: this.iConfigId,
      })
      .subscribe({
        next: (data: any) => {
          this.grados_secciones = data.data;
          this.grados_secciones_filtrados = this.grados_secciones;
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

  agregarGradoSeccion() {
    this.visible = true;
    this.bActualizar = false;
    this.caption = 'Configurar grados y secciones';
  }

  editarGradoSeccion(item: any) {
    this.visible = true;
    this.bActualizar = true;
    this.caption = 'Actualizar grados y secciones';
    this.setFormGradoSeccion(item);
  }

  setFormGradoSeccion(item: any) {
    this.form.patchValue(item);
    this.form
      .get('iNivelGradoId')
      ?.setValue(item.iNivelGradoId ? Number(item.iNivelGradoId) : null);
    this.form.get('iSeccionId')?.setValue(item.iSeccionId ? Number(item.iSeccionId) : null);
    this.form.get('iTurnoId')?.setValue(item.iTurnoId ? Number(item.iTurnoId) : null);
    this.form.get('iModalServId')?.setValue(item.iModalServId ? Number(item.iModalServId) : null);
    this.form
      .get('iIieeAmbienteId')
      ?.setValue(item.iIieeAmbienteId ? Number(item.iIieeAmbienteId) : null);
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsDirty();
    });
    this.form.updateValueAndValidity();
  }

  accionBtnItemTable({ accion, item }) {
    switch (accion) {
      case 'editar':
        this.editarGradoSeccion(item);
        break;
      case 'eliminar':
        this.confirmService.openConfiSave({
          header: 'Confirmación',
          message: '¿Realmente desea eliminar este elemento?',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.borrarGradoSeccion(item.iDetConfId);
          },
        });
        break;
    }
  }

  guardarGradoSeccion() {
    if (this.form.invalid) {
      this.messageService.add({
        severity: 'warning',
        summary: 'Advertencia',
        detail: 'Complete todos los campos requeridos',
      });
      return;
    }

    this.stepService.guardarGradoSeccion(this.form.value).subscribe({
      next: () => {
        this.cerrarDialogo();
        this.messageService.add({
          severity: 'success',
          summary: 'Registrado',
          detail: 'Grado seccion registrado exitosamente',
        });
        this.listarGradosSecciones();
      },
      error: error => {
        console.error('Error al registrar grado seccion:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  actualizarGradoSeccion() {
    if (this.form.invalid) {
      this.messageService.add({
        severity: 'warning',
        summary: 'Advertencia',
        detail: 'Complete todos los campos requeridos',
      });
      return;
    }

    this.stepService.actualizarGradoSeccion(this.form.value).subscribe({
      next: () => {
        this.cerrarDialogo();
        this.messageService.add({
          severity: 'success',
          summary: 'Actualizado',
          detail: 'Grado seccion actualizado exitosamente',
        });
        this.listarGradosSecciones();
      },
      error: error => {
        console.error('Error al actualizar grado seccion:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  borrarGradoSeccion(id: number) {
    this.stepService
      .borrarGradoSeccion({
        iDetConfigId: id,
      })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminado',
            detail: 'Registro eliminado exitosamente',
          });
          this.listarGradosSecciones();
        },
        error: error => {
          console.error('Error al eliminar grado seccion:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  filtrarTabla() {
    const textoBusqueda = this.formBusqueda.get('textoBusqueda')?.value.toLowerCase();
    const iNivelGradoId = this.formBusqueda.get('iNivelGradoId')?.value;
    this.grados_secciones_filtrados = this.grados_secciones.filter(grado_seccion => {
      if (
        iNivelGradoId == null ||
        (grado_seccion.iNivelGradoId &&
          Number(grado_seccion.iNivelGradoId) === Number(iNivelGradoId))
      ) {
        if (
          grado_seccion.cGradoNombre &&
          grado_seccion.cGradoNombre.toLowerCase().includes(textoBusqueda)
        )
          return grado_seccion;
        if (
          grado_seccion.cSeccionNombre &&
          grado_seccion.cSeccionNombre.toLowerCase().includes(textoBusqueda)
        )
          return grado_seccion;
        if (
          grado_seccion.cAmbienteNombre &&
          grado_seccion.cAmbienteNombre.toLowerCase().includes(textoBusqueda)
        )
          return grado_seccion;
        if (
          grado_seccion.cTurnoNombre &&
          grado_seccion.cTurnoNombre.toLowerCase().includes(textoBusqueda)
        )
          return grado_seccion;
        if (
          grado_seccion.cModalServNombre &&
          grado_seccion.cModalServNombre.toLowerCase().includes(textoBusqueda)
        )
          return grado_seccion;
        if (
          grado_seccion.cDetConfNombreSeccion &&
          grado_seccion.cDetConfNombreSeccion.toLowerCase().includes(textoBusqueda)
        )
          return grado_seccion;
        if (
          grado_seccion.iDetConfCantEstudiantes &&
          grado_seccion.iDetConfCantEstudiantes.toLowerCase().includes(textoBusqueda)
        )
          return grado_seccion;
      } else {
        return null;
      }
    });
  }

  siguienteTab() {
    this.router.navigate([`/gestion-institucional/config/${this.iConfigId}/ambiente`]);
  }

  cerrarDialogo() {
    this.visible = false;
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.form.reset();
    this.form.get('iConfigId')?.setValue(this.iConfigId);
  }

  accionesPrincipal: IActionContainer[] = [
    {
      labelTooltip: 'Retornar',
      text: 'Retornar',
      icon: 'pi pi-arrow-circle-left',
      accion: 'retornar',
      class: 'p-button-warning',
    },
    {
      labelTooltip: 'Agregar sección',
      text: 'Agregar Sección',
      icon: 'pi pi-plus',
      accion: 'agregar',
      class: 'p-button-primary',
    },
  ];

  accionesTable: IActionContainer[] = [];

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

  actionsLista: IActionTable[];
  columns = [
    {
      type: 'text',
      width: '15%',
      field: 'cGradoNombre',
      header: 'Grado',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '10%',
      field: 'cSeccionNombre',
      header: 'Sección',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '20%',
      field: 'cDetConfNombreSeccion',
      header: 'Nombre',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '20%',
      field: 'cAmbienteNombre',
      header: 'Ambiente',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '10%',
      field: 'iDetConfCantEstudiantes',
      header: 'Vacantes',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '10%',
      field: 'cTurnoNombre',
      header: 'Turno',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '10%',
      field: 'cModalServNombre',
      header: 'Modalidad',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'actions',
      width: '5%',
      field: 'actions',
      header: 'Acciones',
      text_header: 'center',
      text: 'center',
    },
  ];
}
