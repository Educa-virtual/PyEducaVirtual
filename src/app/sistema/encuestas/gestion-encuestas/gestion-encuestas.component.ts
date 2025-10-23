import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { IColumn, TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component';
import { IActionTable } from '@/app/shared/table-primeng/table-primeng.component';
import { MenuItem, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { EncuestasService } from '../services/encuestas.services';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { SlicePipe } from '@angular/common';
import { DIRECTOR_IE } from '@/app/servicios/seg/perfiles';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TutorialEncuestasComponent } from '../tutoriales/tutorial-encuestas/tutorial-encuestas.component';

@Component({
  selector: 'app-gestion-encuestas',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent, TutorialEncuestasComponent],
  templateUrl: './gestion-encuestas.component.html',
  styleUrl: './gestion-encuestas.component.scss',
  providers: [SlicePipe],
})
export class GestionEncuestasComponent implements OnInit {
  @ViewChild('filtro') filtro: ElementRef;

  visibleDialogDuplicar: boolean = false;
  visibleDialogPlantilla: boolean = false;
  visibleDialogTutorial: boolean = false;

  iCateId: number = null;
  categoria: any = null;
  selectedItem: any;
  iYAcadId: number;
  perfil: any;
  cCateNombre: string;

  formEncuesta: FormGroup;
  formPlantilla: FormGroup;
  tiempos_duracion: Array<object>;

  encuestas: Array<any> = [];
  encuestas_filtradas: Array<any> = [];

  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;

  ESTADO_BORRADOR: number = this.encuestasService.ESTADO_BORRADOR;
  ESTADO_APROBADA: number = this.encuestasService.ESTADO_APROBADA;

  USUARIO_ENCUESTADOR: number = this.encuestasService.USUARIO_ENCUESTADOR;

  CATEGORIA_SATISFACCION: number = this.encuestasService.CATEGORIA_SATISFACCION;
  CATEGORIA_AUTOEVALUACION: number = this.encuestasService.CATEGORIA_AUTOEVALUACION;

  puede_generar_fija: boolean = false;

  constructor(
    private messageService: MessageService,
    private encuestasService: EncuestasService,
    private confirmService: ConfirmationModalService,
    private route: ActivatedRoute,
    private store: LocalStoreService,
    private router: Router,
    private slicePipe: SlicePipe,
    private fb: FormBuilder
  ) {
    this.route.params.subscribe(params => {
      this.iCateId = params['iCateId'];
    });
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.perfil = this.store.getItem('dremoPerfil');
    this.setBreadCrumbs();
  }

  ngOnInit() {
    try {
      this.formEncuesta = this.fb.group({
        iYAcadId: [this.iYAcadId, Validators.required],
        iCateId: [this.iCateId, Validators.required],
        iEncuId: [null],
        cEncuOriginalNombre: [{ value: '', disabled: true }],
        cEncuNombre: [''],
        cEncuSubtitulo: [''],
        dEncuInicio: ['', Validators.required],
        dEncuFin: ['', Validators.required],
        iTiemDurId: [null, Validators.required],
        bCopiarPoblacion: [true],
        bCopiarAccesos: [true],
        bCopiarPreguntas: [true],
      });

      this.formPlantilla = this.fb.group({
        iCateId: [this.iCateId, Validators.required],
        iEncuId: [null],
        cEncuOriginalNombre: [{ value: '', disabled: true }],
        cPlanNombre: [''],
        cPlanSubtitulo: [''],
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
      console.error('Error al inicializar el formulario', error);
    }
    if (this.iCateId) {
      this.verCategoria();
      this.listarEncuestas();
    }
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
      { label: 'Gestionar encuestas' },
    ];
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
  }

  agregarEncuesta() {
    if (Number(this.categoria.bEsFija) === 1) {
      this.router.navigate([`/encuestas/categorias/${this.iCateId}/nueva-encuesta-fija`]);
    } else {
      this.router.navigate([`/encuestas/categorias/${this.iCateId}/nueva-encuesta`]);
    }
  }

  confirmarGenerarEncuestasMasivo() {
    this.confirmService.openConfirm({
      header: '¿Desea ir al listado de plantillas?',
      message:
        'Para generar encuestas de forma masiva ingrese al "Listado de plantillas", seleccione la plantilla que desee utilizar y haga clic en "Hacer encuestas".' +
        (Number(this.perfil.iPerfilId) === DIRECTOR_IE
          ? ' Esta acción reeemplazará, para su I.E., las encuestas existentes registradas por el Administrador que aún no han sido respondidas por sus estudiantes. Solo usted podrá editar las nuevas encuestas.'
          : ''),
      accept: () => {
        this.listarPlantillas();
      },
      reject: () => {},
    });
  }

  generarEncuestaPlantilla(encuesta_reemplazada: any | null = null) {
    this.messageService.clear();
    if (Number(this.iCateId) === this.CATEGORIA_SATISFACCION) {
      this.encuestasService
        .crearEncuestaSatisfaccion({
          iCateId: this.iCateId,
          iYAcadId: this.iYAcadId,
          iEncuId: encuesta_reemplazada?.iEncuId,
        })
        .subscribe({
          next: () => {
            this.listarEncuestas();
          },
          error: error => {
            console.error('Error obteniendo lista de encuestas:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error.message,
            });
          },
        });
    } else if (Number(this.iCateId) === this.CATEGORIA_AUTOEVALUACION) {
      this.encuestasService
        .crearEncuestaAutoevaluacion({
          iCateId: this.iCateId,
          iYAcadId: this.iYAcadId,
          iEncuId: encuesta_reemplazada?.iEncuId,
        })
        .subscribe({
          next: () => {
            this.listarEncuestas();
          },
          error: error => {
            console.error('Error obteniendo lista de encuestas:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error.message,
            });
          },
        });
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
          this.puede_generar_fija = Number(this.categoria?.bEsFija) === 1;
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

  listarEncuestas() {
    this.encuestasService
      .listarEncuestas({
        iCateId: this.iCateId,
        iYAcadId: this.iYAcadId,
        iTipoUsuario: this.USUARIO_ENCUESTADOR,
      })
      .subscribe({
        next: (data: any) => {
          this.encuestas = data.data;
          this.filtrarTabla();
        },
        error: error => {
          console.error('Error obteniendo lista de encuestas:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  filtrarTabla() {
    const filtro = this.filtro.nativeElement.value;
    this.encuestas_filtradas = this.encuestas.filter(encuesta => {
      if (encuesta.cEncuNombre && encuesta.cEncuNombre.toLowerCase().includes(filtro.toLowerCase()))
        return encuesta;
      if (encuesta.cCateNombre && encuesta.cCateNombre.toLowerCase().includes(filtro.toLowerCase()))
        return encuesta;
      if (
        encuesta.cTiemDurNombre &&
        encuesta.cTiemDurNombre.toLowerCase().includes(filtro.toLowerCase())
      )
        return encuesta;
      if (encuesta.dEncuInicio && encuesta.dEncuInicio.toLowerCase().includes(filtro.toLowerCase()))
        return encuesta;
      if (encuesta.dEncuFin && encuesta.dEncuFin.toLowerCase().includes(filtro.toLowerCase()))
        return encuesta;
      return null;
    });
  }

  eliminarEncuesta(item: any) {
    this.encuestasService
      .borrarEncuesta({
        iEncuId: item.iEncuId,
      })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Encuesta eliminada',
          });
          this.listarEncuestas();
        },
        error: error => {
          console.error('Error obteniendo lista de encuestas:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  actualizarEncuestaEstado(item: any, iEstado: number) {
    this.encuestasService
      .actualizarEncuestaEstado({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iEncuId: item.iEncuId,
        iEstado: iEstado,
      })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Actualización exitosa',
            detail: 'Se actualizó el estado de la encuesta',
          });
          this.listarEncuestas();
        },
        error: error => {
          console.error('Error actualizando estado de encuesta:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  listarPlantillas() {
    this.router.navigate([`/encuestas/categorias/${this.iCateId}/gestion-plantillas`]);
  }

  abrirDialogoDuplicarEncuesta(encuesta: any) {
    this.visibleDialogDuplicar = true;
    this.formEncuesta.get('iYAcadId')?.setValue(this.iYAcadId);
    this.formEncuesta.get('iCateId')?.setValue(this.iCateId);
    this.formEncuesta.get('iEncuId')?.setValue(encuesta?.iEncuId);
    this.formEncuesta.get('cEncuOriginalNombre')?.setValue(encuesta?.cEncuNombre);
    this.formEncuesta.get('dEncuInicio')?.setValue(new Date());
    this.formEncuesta.get('bCopiarPoblacion')?.setValue(true);
    this.formEncuesta.get('bCopiarAccesos')?.setValue(true);
    this.formEncuesta.get('bCopiarPreguntas')?.setValue(true);
  }

  cerrarDialogDuplicarEncuesta() {
    this.visibleDialogDuplicar = false;
    this.resetFormEncuesta();
  }

  resetFormEncuesta() {
    this.formEncuesta.reset();
  }

  duplicarEncuesta() {
    if (this.formEncuesta.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe completar los campos requeridos',
      });
      this.encuestasService.formMarkAsDirty(this.formEncuesta);
      return;
    }
    this.encuestasService.guardarEncuestaDesdeDuplicado(this.formEncuesta.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: 'Se registraron los datos',
        });
        this.cerrarDialogDuplicarEncuesta();
        this.listarEncuestas();
      },
      error: error => {
        console.error('Error guardando encuesta:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  resetFormPlantilla() {
    this.formPlantilla.reset();
  }

  abrirDialogoCrearPlantilla(encuesta: any) {
    this.visibleDialogPlantilla = true;
    console.log(encuesta, 'encuesta');
    this.formPlantilla.get('iCateId')?.setValue(this.iCateId);
    this.formPlantilla.get('iEncuId')?.setValue(encuesta?.iEncuId);
    this.formPlantilla.get('cEncuOriginalNombre')?.setValue(encuesta?.cEncuNombre);
    this.formPlantilla.get('bCopiarPoblacion')?.setValue(true);
    this.formPlantilla.get('bCopiarAccesos')?.setValue(true);
    this.formPlantilla.get('bCopiarPreguntas')?.setValue(true);
  }

  cerrarDialogCrearPlantilla() {
    this.visibleDialogPlantilla = false;
    this.resetFormPlantilla();
  }

  crearPlantilla() {
    if (this.formPlantilla.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe completar los campos requeridos',
      });
      this.encuestasService.formMarkAsDirty(this.formPlantilla);
      return;
    }
    this.encuestasService.guardarPlantillaDesdeEncuesta(this.formPlantilla.value).subscribe({
      next: (data: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: 'Se registraron los datos, redirigiendo a la plantilla generada...',
        });
        this.cerrarDialogCrearPlantilla();
        const iPlanId = data.data.iPlanId;
        setTimeout(() => {
          this.router.navigate([
            `/encuestas/categorias/${this.iCateId}/gestion-plantillas/${iPlanId}`,
          ]);
        }, 1000);
      },
      error: error => {
        console.error('Error guardando plantilla:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  verTutorial(visible: boolean) {
    this.visibleDialogTutorial = visible;
  }

  accionBtnItemTable({ accion, item }) {
    this.selectedItem = item;
    switch (accion) {
      case 'editar':
      case 'ver':
        if (Number(this.categoria.bEsFija) === 1) {
          this.router.navigate([
            `/encuestas/categorias/${this.iCateId}/gestion-encuestas/${item.iEncuId}/fija`,
          ]);
        } else {
          this.router.navigate([
            `/encuestas/categorias/${this.iCateId}/gestion-encuestas/${item.iEncuId}`,
          ]);
        }
        break;
      case 'preguntas':
        this.router.navigate([
          `/encuestas/categorias/${this.iCateId}/gestion-encuestas/${item.iEncuId}/preguntas`,
        ]);
        break;
      case 'eliminar':
        this.confirmService.openConfirm({
          header: '¿Está seguro de eliminar la encuesta seleccionada?',
          accept: () => {
            this.eliminarEncuesta(item);
          },
          reject: () => {},
        });
        break;
      case 'aprobar':
        this.confirmService.openConfirm({
          header: 'Aprobar encuesta',
          message: '¿Está seguro de aprobar la encuesta seleccionada?',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.actualizarEncuestaEstado(item, this.ESTADO_APROBADA);
          },
          reject: () => {},
        });
        break;
      case 'desaprobar':
        this.confirmService.openConfirm({
          header: 'Volver encuesta a borrador',
          message: '¿Está seguro de cambiar el estado de la encuesta seleccionada?',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.actualizarEncuestaEstado(item, this.ESTADO_BORRADOR);
          },
          reject: () => {},
        });
        break;
      case 'respuestas':
        this.router.navigate([
          `/encuestas/categorias/${this.iCateId}/gestion-encuestas/${item.iEncuId}/respuestas`,
        ]);
        break;
      case 'resumen':
        this.router.navigate([
          `/encuestas/categorias/${this.iCateId}/gestion-encuestas/${item.iEncuId}/resumen`,
        ]);
        break;
      case 'reemplazar':
        this.confirmService.openConfirm({
          header: 'Reemplazar encuesta',
          message:
            'Se creará una copia de esta encuesta en estado Borrador (podrá editarla) que reemplazará, solo para los estudiantes de su I.E., la creada por el Administrador ¿Está seguro de reemplazar la encuesta seleccionada?',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.generarEncuestaPlantilla(item);
          },
        });
        break;
      case 'duplicar':
        this.confirmService.openConfirm({
          header: 'Duplicar encuesta',
          message:
            'Se creará una copia de esta encuesta en estado Borrador (podrá editarla). ¿Está seguro de duplicar la encuesta seleccionada?',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.abrirDialogoDuplicarEncuesta(item);
          },
        });
        break;
      case 'plantilla':
        this.abrirDialogoCrearPlantilla(item);
        break;
      default:
        console.warn('Acción no reconocida:', accion);
    }
  }

  actions: IActionTable[] = [
    {
      labelTooltip: 'Editar',
      icon: 'pi pi-file-edit',
      accion: 'editar',
      type: 'item',
      class: 'p-menuitem-link text-green-500',
      isVisible: (rowData: any) =>
        Number(rowData.iEstado) === this.ESTADO_BORRADOR && Number(rowData.puede_editar) === 1,
    },
    {
      labelTooltip: 'Ver',
      icon: 'pi pi-eye',
      accion: 'ver',
      type: 'item',
      class: 'p-menuitem-link text-gray-500',
      isVisible: (rowData: any) =>
        Number(rowData.iEstado) !== this.ESTADO_BORRADOR || Number(rowData.puede_editar) !== 1,
    },
    {
      labelTooltip: 'Ver Preguntas',
      icon: 'pi pi-question',
      accion: 'preguntas',
      type: 'item',
      class: 'p-menuitem-link text-yellow-500',
    },
    {
      labelTooltip: 'Aprobar',
      icon: 'pi pi-check',
      accion: 'aprobar',
      type: 'item',
      class: 'p-menuitem-link text-primary',
      isVisible: (rowData: any) =>
        Number(rowData.iEstado) === this.ESTADO_BORRADOR && Number(rowData.puede_editar) === 1,
    },
    {
      labelTooltip: 'Eliminar',
      icon: 'pi pi-trash',
      accion: 'eliminar',
      type: 'item',
      class: 'p-menuitem-link text-red-500',
      isVisible: (rowData: any) =>
        Number(rowData.iEstado) === this.ESTADO_BORRADOR && Number(rowData.puede_editar) === 1,
    },
    {
      labelTooltip: 'Ver respuestas',
      icon: 'pi pi-users',
      accion: 'respuestas',
      type: 'item',
      class: 'p-menuitem-link text-primary',
      isVisible: (rowData: any) =>
        Number(rowData.iEstado) === this.ESTADO_APROBADA &&
        Number(rowData.puede_ver_respuestas) === 1,
    },
    {
      labelTooltip: 'Ver resumen',
      icon: 'pi pi-chart-pie',
      accion: 'resumen',
      type: 'item',
      class: 'p-menuitem-link p-button-primary',
      isVisible: (rowData: any) =>
        Number(rowData.iEstado) == this.ESTADO_APROBADA && Number(rowData.puede_ver_resumen) === 1,
    },
    {
      labelTooltip: 'Reemplazar',
      icon: 'pi pi-sync',
      accion: 'reemplazar',
      type: 'item',
      class: 'p-menuitem-link text-green-500',
      isVisible: (rowData: any) =>
        Number(this.categoria.bEsFija) === 1 &&
        Number(this.perfil.iPerfilId) === DIRECTOR_IE &&
        !rowData.iSedeId &&
        new Date() < new Date(rowData.dEncuInicio),
    },
    {
      labelTooltip: 'Duplicar',
      icon: 'pi pi-copy',
      accion: 'duplicar',
      type: 'item',
      class: 'p-menuitem-link text-green-500',
      isVisible: () => Number(this.categoria.bEsFija) !== 1,
    },
    {
      labelTooltip: 'Hacer plantilla',
      icon: 'pi pi-arrow-up',
      accion: 'plantilla',
      type: 'item',
      class: 'p-menuitem-link text-primary',
    },
  ];

  columns: IColumn[] = [
    {
      type: 'item',
      width: '5%',
      field: 'item',
      header: '#',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '30%',
      field: 'cEncuNombre',
      header: 'Título de encuesta',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'text',
      width: '15%',
      field: 'cTiemDurNombre',
      header: 'Tiempo',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'date',
      width: '15%',
      field: 'dEncuInicio',
      header: 'Desde',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'date',
      width: '15%',
      field: 'dEncuFin',
      header: 'Hasta',
      text_header: 'center',
      text: 'center',
    },
    {
      field: 'cEstadoNombre',
      type: 'tag',
      width: '10%',
      header: 'Estado',
      text_header: 'center',
      text: 'center',
      styles: {
        BORRADOR: 'danger',
        APROBADA: 'success',
      },
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
