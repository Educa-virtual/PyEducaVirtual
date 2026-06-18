import { Component, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { AdmStepGradoSeccionService } from '@/app/servicios/adm/adm-step-grado-seccion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';

@Component({
  selector: 'app-config-hora-docente',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent],
  templateUrl: './config-hora-docente.component.html',
  styleUrls: ['./config-hora-docente.component.scss'],
})
export class ConfigHoraDocenteComponent implements OnInit {
  form: FormGroup;
  formBusqueda: FormGroup;

  docentes: any[];
  docentes_filtrados: any[];

  caption: string = 'Registrar Docente en IE';
  visible = false;
  bEditar: boolean = false;

  perfil: any[] = [];
  iYAcadId: number;
  iConfigId: number;

  longitud_documento: number = 8;
  formato_documento: string = '99999999';

  estados = [
    { label: 'ACTIVO', value: 1 },
    { label: 'INACTIVO', value: 0 },
  ];

  sexos = [
    { label: 'MASCULINO', value: 'M' },
    { label: 'FEMENINO', value: 'F' },
  ];

  constructor(
    private stepService: AdmStepGradoSeccionService,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private store: LocalStoreService,
    private route: ActivatedRoute,
    private confirmService: ConfirmationModalService
  ) {
    this.stepService.setActiveIndex(4);
    this.perfil = this.store.getItem('dremoPerfil');
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.route.parent?.paramMap.subscribe(params => {
      this.iConfigId = params.get('id') ? Number(params.get('id')) : null;
    });
  }

  ngOnInit(): void {
    try {
      this.formBusqueda = this.fb.group({
        bActivo: [null],
        cTextoBusqueda: [''],
      });
      this.form = this.fb.group({
        iPersIeId: [null],
        iConfigId: [this.iConfigId],
        iDocenteId: [null],
        iPersId: [null, [Validators.required]],
        iTipoIdentId: [1],
        cPersDocumento: ['', [Validators.required]],
        cPersNombre: ['', [Validators.required]],
        cPersPaterno: ['', [Validators.required]],
        cPersMaterno: [''],
        cPersSexo: ['M', [Validators.required]],
        cPersCorreo: [''],
        cPersTelefono: [''],
        dPersNacimiento: [null],
        iYAcadId: [this.iYAcadId, [Validators.required]],
        iPersCargoId: [3, [Validators.required]],
        iHorasLabora: [null, [Validators.required, Validators.min(6), Validators.max(48)]],
        dtPersIeInicio: [null],
        dtPersIeFin: [null],
        cCodigoPlaza: [null],
      });
    } catch (error) {
      console.error(error, 'Error al inicializar el formulario');
    }

    this.listarDocentes();
  }

  listarDocentes() {
    this.stepService
      .listarDocentes({
        iConfigId: this.iConfigId,
      })
      .subscribe({
        next: (data: any) => {
          this.docentes = data.data;
          this.docentes_filtrados = this.docentes;
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

  siguiente() {
    this.router.navigate([`/gestion-institucional/config/${this.iConfigId}/asignar-grado`]);
  }

  agregarDocente() {
    this.bEditar = false;
    this.visible = true;
    this.caption = 'Registrar Docente en IE';
    this.form.reset({
      iConfigId: this.iConfigId,
      iTipoIdentId: 1,
      iYAcadId: this.iYAcadId,
      iPersCargoId: 3,
    });
  }

  filtrarTabla() {
    const textoBusqueda = this.formBusqueda.get('cTextoBusqueda')?.value.toLowerCase();
    const bActivo = this.formBusqueda.get('bActivo')?.value;
    this.docentes_filtrados = this.docentes.filter(item => {
      if (bActivo == null || (item.bActivo && Number(item.bActivo) == Number(bActivo))) {
        if (
          item.cPersNombreCompleto &&
          item.cPersNombreCompleto.toLowerCase().includes(textoBusqueda)
        )
          return item;
        if (
          item.cPersTipoDocumento &&
          item.cPersTipoDocumento.toLowerCase().includes(textoBusqueda)
        )
          return item;
        if (item.iHorasLabora && item.iHorasLabora.includes(textoBusqueda)) return item;
      } else {
        return null;
      }
    });
  }

  accionBtnItemTable({ accion, item }) {
    switch (accion) {
      case 'editar':
        this.bEditar = true;
        this.visible = true;
        this.caption = 'Editar Docente en IE';
        this.setForm(item);
        break;
      case 'usuario':
        this.actualizarDocenteEstado(item, 1);
        break;
      case 'habilitar':
        this.confirmService.openConfirm({
          message: '¿Realmente desea habilitar este elemento?',
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.actualizarDocenteEstado(item, 1);
          },
        });
        break;
      case 'deshabilitar':
        this.confirmService.openConfirm({
          message: '¿Realmente desea deshabilitar este elemento?',
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.actualizarDocenteEstado(item, 0);
          },
        });
        break;
      case 'eliminar':
        this.confirmService.openConfirm({
          message: '¿Realmente desea eliminar este elemento?',
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.eliminarDocente(item);
          },
        });
        break;
    }
  }

  reiniciarFormulario() {
    this.form.get('iPersId')?.setValue('');
    this.form.get('cPersNombre')?.setValue('');
    this.form.get('cPersPaterno')?.setValue('');
    this.form.get('cPersMaterno')?.setValue('');
  }

  setForm(item): void {
    if (this.form) {
      this.form.patchValue(item);
      this.stepService.formatearFormControl(
        this.form,
        'dPersNacimiento',
        item.dPersNacimiento,
        'date'
      );
      this.stepService.formatearFormControl(
        this.form,
        'dtPersIeInicio',
        item.dtPersIeInicio,
        'date'
      );
      this.stepService.formatearFormControl(this.form, 'dtPersIeFin', item.dtPersIeFin, 'date');
      this.form.patchValue({
        iTipoIdentId: 1,
        iConfigId: this.iConfigId,
        iYAcadId: this.iYAcadId,
        iPersCargoId: 3,
      });
      console.log(this.form.value, 'form');
    }
  }

  buscarPersonaPorDocumento() {
    this.reiniciarFormulario();
    this.stepService
      .buscarDocente({
        iTipoIdentId: this.form.get('iTipoIdentId')?.value,
        cPersDocumento: this.form.get('cPersDocumento')?.value,
      })
      .subscribe({
        next: (data: any) => {
          this.setForm(data.data);
          this.messageService.add({
            severity: 'success',
            summary: 'Datos encontrados',
            detail: 'Se obtuvo la información de la persona',
          });
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Problema al obtener datos',
            detail:
              'No se pudo obtener la información de la persona. Por favor ingrese los datos manualmente.',
          });
          this.form.reset({
            iTipoIdentId: 1,
            cPersSexo: 'M',
          });
          console.error('Error obteniendo datos:', error);
        },
      });
  }

  cerrarDialogo() {
    this.visible = false;
    this.bEditar = false;
    this.setForm({
      iConfigId: this.iConfigId,
      iTipoIdentId: 1,
      iYAcadId: this.iYAcadId,
      iPersCargoId: 3,
    });
  }

  guardarDocente() {
    this.stepService.guardarDocente(this.form.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Registro guardado exitosamente',
        });
        this.cerrarDialogo();
        this.listarDocentes();
      },
      error: error => {
        console.error('Error al guardar:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  actualizarDocente() {
    this.stepService.actualizarDocente(this.form.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Registro actualizado exitosamente',
        });
        this.cerrarDialogo();
        this.listarDocentes();
      },
      error: error => {
        console.error('Error al actualizar estado:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  actualizarDocenteEstado(item: any, estado: number) {
    this.stepService
      .actualizarDocenteEstado({
        iPersIeId: item.iPersIeId,
        bActivo: estado,
      })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Registro actualizado exitosamente',
          });
          this.listarDocentes();
        },
        error: error => {
          console.error('Error al actualizar estado:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  eliminarDocente(item: any) {
    this.stepService.borrarDocente(item).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Docente eliminado exitosamente',
        });
        this.listarDocentes();
      },
      error: error => {
        console.error('Error al eliminar docente:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  selectedItems = [];
  actions: IActionTable[] = [
    {
      labelTooltip: 'Reactivar usuario',
      icon: 'pi pi-sync',
      type: 'item',
      accion: 'usuario',
      class: 'p-menuitem-link text-primary',
      isVisible: rowData => {
        return Number(rowData.bTienePerfil) === 0 && Number(rowData.bActivo) === 1;
      },
    },
    {
      labelTooltip: 'Editar',
      icon: 'pi pi-pen-to-square',
      type: 'item',
      accion: 'editar',
      class: 'p-menuitem-link text-orange-500',
    },
    {
      labelTooltip: 'Habilitar',
      icon: 'pi pi-check-circle',
      accion: 'habilitar',
      type: 'item',
      class: 'p-menuitem-link text-green-500',
      isVisible: rowData => {
        return Number(rowData.bActivo) === 0 || rowData.bActivo === null;
      },
    },
    {
      labelTooltip: 'Deshabilitar',
      icon: 'pi pi-ban',
      accion: 'deshabilitar',
      type: 'item',
      class: 'p-menuitem-link text-secondary',
      isVisible: rowData => {
        return Number(rowData.bActivo) === 1;
      },
    },
    {
      labelTooltip: 'Eliminar',
      icon: 'pi pi-trash',
      accion: 'eliminar',
      type: 'item',
      class: 'p-menuitem-link text-red-500',
    },
  ];

  actionsLista: IActionTable[];

  columns = [
    {
      type: 'text',
      width: '15%',
      field: 'cPersTipoDocumento',
      header: 'Documento',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '25%',
      field: 'cPersNombreCompleto',
      header: 'Docente',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '10%',
      field: 'iHorasLabora',
      header: 'Horas',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'estado-activo',
      width: '10%',
      field: 'bTienePerfil',
      header: 'Estado de perfil',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'estado-activo',
      width: '10%',
      field: 'bActivo',
      header: 'Estado',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'dropdown-actions',
      width: '10%',
      field: 'actions',
      header: 'Acciones',
      text_header: 'center',
      text: 'center',
    },
  ];
}
