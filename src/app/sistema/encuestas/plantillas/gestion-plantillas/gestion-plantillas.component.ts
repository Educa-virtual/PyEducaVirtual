import { PrimengModule } from '@/app/primeng.module';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EncuestasService } from '../../services/encuestas.services';
import { MenuItem, MessageService } from 'primeng/api';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { SlicePipe } from '@angular/common';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-gestion-plantillas',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent],
  templateUrl: './gestion-plantillas.component.html',
  styleUrl: './gestion-plantillas.component.scss',
  providers: [SlicePipe],
})
export class GestionPlantillasComponent implements OnInit {
  @ViewChild('filtro') filtro: ElementRef;

  active: number = 0;

  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;

  formEncuestaPlantilla: FormGroup;
  iCateId: number;
  categoria: any;

  perfil: any;
  iYAcadId: number;

  selectedItem: any;
  plantillas: any[] = [];
  plantillas_filtradas: any[] = [];

  plantilla: any;

  tiempos_duracion: Array<object>;

  visibleDialog: boolean = false;

  ESTADO_BORRADOR: number = this.encuestasService.ESTADO_BORRADOR;
  ESTADO_APROBADA: number = this.encuestasService.ESTADO_APROBADA;

  constructor(
    private route: ActivatedRoute,
    private encuestasService: EncuestasService,
    private messageService: MessageService,
    private store: LocalStoreService,
    private router: Router,
    private slicePipe: SlicePipe,
    private confirmService: ConfirmationModalService,
    private fb: FormBuilder
  ) {
    this.route.params.subscribe(params => {
      this.iCateId = params['iCateId'];
    });
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.perfil = this.store.getItem('dremoPerfil');
  }

  ngOnInit(): void {
    try {
      this.formEncuestaPlantilla = this.fb.group({
        iYAcadId: [this.iYAcadId, Validators.required],
        iCateId: [this.iCateId, Validators.required],
        iPlanId: [null, Validators.required],
        cPlanNombre: [{ value: '', disabled: true }],
        cEncuNombre: [''],
        cEncuSubtitulo: [''],
        dEncuInicio: ['', Validators.required],
        dEncuFin: ['', Validators.required],
        iTiemDurId: [null, Validators.required],
        bCopiarPoblacion: [true],
        bCopiarAccesos: [true],
        bCopiarPreguntas: [true],
      });

      this.encuestasService
        .crearEncuesta({
          iCredEntPerfId: this.perfil.iCredEntPerfId,
          iYAcadId: this.iYAcadId,
          iCateId: this.iCateId,
        })
        .subscribe((data: any) => {
          this.tiempos_duracion = this.encuestasService.getTiemposDuracion(data?.tiempos_duracion);
        });
    } catch (error) {
      console.error('Error creando formulario:', error);
    }

    if (this.iCateId) {
      this.verCategoria();
      this.listarPlantillas();
    }
  }

  verCategoria() {
    this.encuestasService
      .verCategoria({
        iCateId: this.iCateId,
        iYAcadId: this.iYAcadId,
      })
      .subscribe({
        next: (data: any) => {
          this.categoria = data.data;
          this.setBreadCrumbs();
        },
        error: error => {
          console.error('Error obteniendo datos:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message ?? 'Ocurrió un error',
          });
        },
      });
  }

  setBreadCrumbs() {
    this.breadCrumbItems = [
      { label: 'Encuestas' },
      { label: 'Categorías', routerLink: '/encuestas/categorias' },
      {
        label: this.categoria?.cCateNombre
          ? String(this.slicePipe.transform(this.categoria?.cCateNombre, 0, 20))
          : 'Categoría',
      },
      { label: 'Gestionar plantillas' },
    ];
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
  }

  verPlantillas() {
    this.plantilla = null;
  }

  filtrarPlantillas() {
    const filtro = this.filtro.nativeElement.value;
    this.plantillas_filtradas = this.plantillas.filter(plantilla => {
      if (
        plantilla.cPlanNombre &&
        plantilla.cPlanNombre.toLowerCase().includes(filtro.toLowerCase())
      )
        return plantilla;
      if (
        plantilla?.dtUltimaModificacion &&
        plantilla.dtUltimaModificacion.toString().includes(filtro)
      )
        return null;
    });
  }

  listarPlantillas() {
    this.encuestasService
      .listarPlantillas({
        iCateId: this.iCateId,
        iYAcadId: this.iYAcadId,
      })
      .subscribe({
        next: (data: any) => {
          this.plantillas = data.data;
          this.plantillas_filtradas = this.plantillas;
        },
        error: error => {
          console.error('Error obteniendo lista de plantillas:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  agregarPlantilla() {
    this.router.navigate([`/encuestas/categorias/${this.iCateId}/nueva-plantilla`]);
  }

  salir() {
    this.router.navigate([`/encuestas/categorias/${this.iCateId}/gestion-plantillas`]);
  }

  abrirDialogGenerarEncuesta(plantilla: any) {
    this.visibleDialog = true;
    this.formEncuestaPlantilla.get('iYAcadId')?.setValue(this.iYAcadId);
    this.formEncuestaPlantilla.get('iCateId')?.setValue(this.iCateId);
    this.formEncuestaPlantilla.get('iPlanId')?.setValue(plantilla?.iPlanId);
    this.formEncuestaPlantilla.get('cPlanNombre')?.setValue(plantilla?.cPlanNombre);
    this.formEncuestaPlantilla.get('dEncuInicio')?.setValue(new Date());
    this.formEncuestaPlantilla.get('bCopiarPoblacion')?.setValue(true);
    this.formEncuestaPlantilla.get('bCopiarAccesos')?.setValue(true);
    this.formEncuestaPlantilla.get('bCopiarPreguntas')?.setValue(true);
  }

  cerrarDialogGenerarEncuesta() {
    this.visibleDialog = false;
    this.resetForm();
  }

  resetForm() {
    this.formEncuestaPlantilla.reset();
  }

  generarEncuesta() {
    if (this.formEncuestaPlantilla.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe completar los campos requeridos',
      });
      return;
    }
    this.encuestasService
      .guardarEncuestaDesdePlantilla(this.formEncuestaPlantilla.value)
      .subscribe({
        next: (data: any) => {
          const iEncuId = data.data.iEncuId;
          if (!iEncuId) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se ha podido generar la encuesta',
            });
            return;
          } else {
            this.messageService.add({
              severity: 'success',
              summary: 'Generación exitosa',
              detail: 'Redirigiendo a la encuesta generada',
            });
            this.router.navigate([
              `/encuestas/categorias/${this.iCateId}/gestion-encuestas/${iEncuId}`,
            ]);
          }
        },
        error: error => {
          console.error('Error generando encuesta:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  eliminarPlantilla(item: any) {
    this.encuestasService
      .borrarPlantilla({
        iPlanId: item.iPlanId,
      })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Plantilla eliminada',
          });
          this.listarPlantillas();
        },
        error: error => {
          console.error('Error obteniendo lista de plantillas:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  actualizarPlantillaEstado(item: any, iEstado: number) {
    this.encuestasService
      .actualizarPlantillaEstado({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iPlanId: item.iPlanId,
        iEstado: iEstado,
      })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Actualización exitosa',
            detail: 'Se actualizó el estado de la plantilla',
          });
          this.listarPlantillas();
        },
        error: error => {
          console.error('Error actualizando estado de plantilla:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  accionBtnItemTable({ accion, item }) {
    this.selectedItem = item;
    switch (accion) {
      case 'editar':
        this.router.navigate([
          `/encuestas/categorias/${this.iCateId}/gestion-plantillas/${item.iPlanId}`,
        ]);
        break;
      case 'ver':
        this.router.navigate([
          `/encuestas/categorias/${this.iCateId}/gestion-plantillas/${item.iPlanId}`,
        ]);
        break;
      case 'preguntas':
        this.router.navigate([
          `/encuestas/categorias/${this.iCateId}/gestion-plantillas/${item.iPlanId}/preguntas`,
        ]);
        break;
      case 'eliminar':
        this.confirmService.openConfirm({
          header: '¿Está seguro de eliminar la plantilla seleccionada?',
          accept: () => {
            this.eliminarPlantilla(item);
          },
          reject: () => {},
        });
        break;
      case 'aprobar':
        this.confirmService.openConfirm({
          message: '¿Está seguro de aprobar la plantilla seleccionada?',
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.actualizarPlantillaEstado(item, this.ESTADO_APROBADA);
          },
          reject: () => {},
        });
        break;
      case 'generar':
        this.abrirDialogGenerarEncuesta(item);
        break;
      default:
        console.warn('Acción no reconocida:', accion);
    }
  }

  actions_plantillas: IActionTable[] = [
    {
      labelTooltip: 'Editar',
      icon: 'pi pi-file-edit',
      accion: 'editar',
      type: 'item',
      class: 'p-button-rounded p-button-success p-button-text',
      isVisible: (rowData: any) =>
        Number(rowData.iEstado) === this.ESTADO_BORRADOR && Number(rowData.puede_editar) === 1,
    },
    {
      labelTooltip: 'Ver',
      icon: 'pi pi-eye',
      accion: 'ver',
      type: 'item',
      class: 'p-button-rounded p-button-secondary p-button-text',
      isVisible: (rowData: any) =>
        Number(rowData.iEstado) !== this.ESTADO_BORRADOR || Number(rowData.puede_editar) !== 1,
    },
    {
      labelTooltip: 'Ver Preguntas',
      icon: 'pi pi-question',
      accion: 'preguntas',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
    },
    {
      labelTooltip: 'Aprobar',
      icon: 'pi pi-check',
      accion: 'aprobar',
      type: 'item',
      class: 'p-button-rounded p-button-primary p-button-text',
      isVisible: (rowData: any) =>
        Number(rowData.iEstado) === this.ESTADO_BORRADOR && Number(rowData.puede_editar) === 1,
    },
    {
      labelTooltip: 'Eliminar',
      icon: 'pi pi-trash',
      accion: 'eliminar',
      type: 'item',
      class: 'p-button-rounded p-button-danger p-button-text',
      isVisible: (rowData: any) =>
        Number(rowData.iEstado) === this.ESTADO_BORRADOR && Number(rowData.puede_editar) === 1,
    },
    {
      labelTooltip: 'Hacer encuesta',
      icon: 'pi pi-plus',
      accion: 'generar',
      type: 'item',
      class: 'p-button-rounded p-button-success p-button-text',
      isVisible: (rowData: any) => Number(rowData.iEstado) === this.ESTADO_APROBADA,
    },
  ];

  columns_plantillas = [
    {
      type: 'item',
      width: '5%',
      field: '',
      header: '#',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '30%',
      field: 'cPlanNombre',
      header: 'Plantilla',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'text',
      width: '20%',
      field: 'cCreador',
      header: 'Creada por',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'date',
      width: '15%',
      field: 'dtUltimaModificacion',
      header: 'Modificado en',
      text_header: 'left',
      text: 'left',
    },
    {
      field: 'cEstadoNombre',
      type: 'tag',
      width: '15%',
      header: 'Estado',
      text_header: 'center',
      text: 'center',
      styles: {
        BORRADOR: 'danger',
        APROBADA: 'success',
      },
    },
    {
      type: 'actions',
      width: '15%',
      field: '',
      header: 'Acciones',
      text_header: 'right',
      text: 'right',
    },
  ];
}
