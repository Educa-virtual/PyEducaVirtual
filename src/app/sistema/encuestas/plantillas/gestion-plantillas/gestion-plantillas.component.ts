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
import { TutorialPlantillasComponent } from '../../tutoriales/tutorial-plantillas/tutorial-plantillas.component';
import { ADMINISTRADOR_DREMO, DIRECTOR_IE } from '@/app/servicios/seg/perfiles';

@Component({
  selector: 'app-gestion-plantillas',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent, TutorialPlantillasComponent],
  templateUrl: './gestion-plantillas.component.html',
  styleUrl: './gestion-plantillas.component.scss',
  providers: [SlicePipe],
})
export class GestionPlantillasComponent implements OnInit {
  @ViewChild('filtro') filtro: ElementRef;

  active: number = 0;

  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;

  formPlantillas: FormGroup;
  formEncuestaPlantilla: FormGroup;
  formPlantilla: FormGroup;
  formEncuestaFija: FormGroup;

  iCateId: number;
  categoria: any;

  perfil: any;
  iYAcadId: number;
  es_director: boolean = false;

  selectedItem: any;
  plantillas: any[] = [];
  plantillas_filtradas: any[] = [];

  plantilla: any;

  tiempos_duracion: Array<object>;
  tipos_reportes_plantillas: Array<object>;

  visibleDialogEncuesta: boolean = false;
  visibleDialogDuplicar: boolean = false;
  visibleDialogTutorial: boolean = false;
  visibleDialogGenerar: boolean = false;

  cursos: Array<object> = [];
  periodos: Array<object> = [];

  ESTADO_BORRADOR: number = this.encuestasService.ESTADO_BORRADOR;
  ESTADO_APROBADA: number = this.encuestasService.ESTADO_APROBADA;

  CATEGORIA_SATISFACCION: number = this.encuestasService.CATEGORIA_SATISFACCION;
  CATEGORIA_AUTOEVALUACION: number = this.encuestasService.CATEGORIA_AUTOEVALUACION;

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
    this.es_director = [DIRECTOR_IE].includes(Number(this.perfil.iPerfilId));
  }

  ngOnInit(): void {
    try {
      this.formPlantillas = this.fb.group({
        iTipoReporte: [1, Validators.required],
      });

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

      this.formEncuestaFija = this.fb.group({
        iCursoId: [null, Validators.required],
        iPeriodoId: [null, Validators.required],
      });

      this.formPlantilla = this.fb.group({
        iCateId: [this.iCateId, Validators.required],
        iPlanId: [null, Validators.required],
        cPlanOriginalNombre: [{ value: '', disabled: true }],
        cPlanNombre: [''],
        cPlanSubtitulo: [''],
        bCopiarPoblacion: [true],
        bCopiarAccesos: [true],
        bCopiarPreguntas: [true],
      });
    } catch (error) {
      console.error('Error creando formulario:', error);
    }

    this.tipos_reportes_plantillas = this.encuestasService.getTiposReportesPlantillas();
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
          if (Number(this.categoria?.bEsFija) === 1) {
            this.obtenerParametrosFija();
          }
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

  obtenerParametrosFija() {
    this.encuestasService
      .crearEncuestaFija({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iYAcadId: this.iYAcadId,
        iCateId: this.iCateId,
      })
      .subscribe({
        next: (data: any) => {
          if (!data || !data.data) {
            console.error('No se obtuvo datos');
            return;
          }
          if (Number(this.iCateId) === this.CATEGORIA_SATISFACCION) {
            this.cursos = this.encuestasService.getAreasFija(data.data);
          } else if (Number(this.iCateId) === this.CATEGORIA_AUTOEVALUACION) {
            this.periodos = this.encuestasService.getPeriodosFija(data.data);
          }
        },
        error: error => {
          console.error('Error obteniendo datos:', error);
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
      if (plantilla.cCreador && plantilla.cCreador.toLowerCase().includes(filtro.toLowerCase()))
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
        iTipoReporte: this.formPlantillas.value.iTipoReporte,
      })
      .subscribe({
        next: (data: any) => {
          this.plantillas = data.data;
          this.filtrarPlantillas();
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
    if (this.categoria.bEsFija) {
      this.router.navigate([`/encuestas/categorias/${this.iCateId}/nueva-plantilla-fija`]);
    } else {
      this.router.navigate([`/encuestas/categorias/${this.iCateId}/nueva-plantilla`]);
    }
  }

  salir() {
    this.router.navigate([`/encuestas/categorias/${this.iCateId}/gestion-plantillas`]);
  }

  listarEncuestas() {
    this.router.navigate([`/encuestas/categorias/${this.iCateId}/gestion-encuestas`]);
  }

  getParametros() {
    this.encuestasService
      .crearEncuesta({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iCateId: this.iCateId,
        iYAcadId: this.iYAcadId,
      })
      .subscribe((data: any) => {
        this.tiempos_duracion = this.encuestasService.getTiemposDuracion(data?.tiempos_duracion);
      });
  }

  abrirDialogGenerarEncuesta(plantilla: any) {
    if (plantilla) {
      this.getParametros();
    }
    this.visibleDialogEncuesta = true;
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
    this.visibleDialogEncuesta = false;
    this.resetFormEncuesta();
  }

  resetFormEncuesta() {
    this.formEncuestaPlantilla.reset();
  }

  resetFormEncuestaFija() {
    this.formEncuestaFija.reset();
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

  generarEncuestaPlantilla(encuesta_reemplazada: any | null = null, plantilla: any) {
    if (Number(this.iCateId) === this.CATEGORIA_SATISFACCION) {
      this.encuestasService
        .crearEncuestaSatisfaccion({
          iCateId: this.iCateId,
          iYAcadId: this.iYAcadId,
          iPlanId: plantilla?.iPlanId,
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
          iPlanId: plantilla?.iPlanId,
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

  abrirDialogDuplicarPlantilla(plantilla: any) {
    this.visibleDialogDuplicar = true;
    this.formPlantilla.get('iPlanId')?.setValue(plantilla?.iPlanId);
    this.formPlantilla.get('iCateId')?.setValue(this.iCateId);
    this.formPlantilla.get('cPlanOriginalNombre')?.setValue(plantilla?.cPlanNombre);
    this.formPlantilla.get('cPlanSubtitulo')?.setValue(plantilla?.cPlanSubtitulo);
    this.formPlantilla.get('dPlanInicio')?.setValue(new Date());
    this.formPlantilla.get('bCopiarPoblacion')?.setValue(true);
    this.formPlantilla.get('bCopiarAccesos')?.setValue(true);
    this.formPlantilla.get('bCopiarPreguntas')?.setValue(true);
  }

  cerrarDialogDuplicarPlantilla() {
    this.visibleDialogDuplicar = false;
    this.resetFormPlantilla();
  }

  resetFormPlantilla() {
    this.formPlantilla.reset();
  }

  duplicarPlantilla() {
    if (this.formPlantilla.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe completar los campos requeridos',
      });
      return;
    }
    this.encuestasService.guardarPlantillaDesdeDuplicado(this.formPlantilla.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: 'Se registraron los datos',
        });
        this.cerrarDialogDuplicarPlantilla();
        this.listarPlantillas();
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

  archivarPlantilla(item: any, bArchivar: boolean = true) {
    this.encuestasService
      .archivarPlantilla({
        iPlanId: item.iPlanId,
        bArchivar: bArchivar,
      })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Archivado exitoso',
            detail: 'Se ha archivado la plantilla',
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
            `/encuestas/categorias/${this.iCateId}/gestion-plantillas/${item.iPlanId}/fija`,
          ]);
        } else {
          this.router.navigate([
            `/encuestas/categorias/${this.iCateId}/gestion-plantillas/${item.iPlanId}`,
          ]);
        }
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
          header: 'Aprobar plantilla',
          message:
            'Una vez aprobada la plantilla podrá ser usada para generar nuevas encuestas, pero ya no se podrá editar. ¿Está seguro de aprobar la plantilla seleccionada?',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.actualizarPlantillaEstado(item, this.ESTADO_APROBADA);
          },
          reject: () => {},
        });
        break;
      case 'duplicar':
        this.abrirDialogDuplicarPlantilla(item);
        break;
      case 'generar':
        if (Number(this.categoria?.bEsFija) === 1) {
          this.selectedItem = item;
          this.visibleDialogGenerar = true;
        } else {
          this.confirmService.openConfirm({
            header: 'Generar encuesta desde plantilla',
            message: '¿Está seguro de generar la encuesta desde la plantilla seleccionada?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.abrirDialogGenerarEncuesta(item);
            },
          });
        }
        break;
      case 'archivar':
        this.confirmService.openConfirm({
          header: 'Archivar plantilla',
          message:
            'Puede archivar la plantilla para dejar de mostrarla en la lista principal. Este cambio solo es visible para usted. ¿Realmente quiere archivar la plantilla seleccionada?',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.archivarPlantilla(item);
          },
          reject: () => {},
        });
        break;
      case 'desarchivar':
        this.confirmService.openConfirm({
          header: 'Desarchivar plantilla',
          message:
            'Puede desarchivar la plantilla para volver a mostrarla en la lista principal. Este cambio solo es visible para usted. ¿Realmente quiere desarchivar la plantilla seleccionada?',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.archivarPlantilla(item, false);
          },
          reject: () => {},
        });
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
      labelTooltip: 'Duplicar',
      icon: 'pi pi-copy',
      accion: 'duplicar',
      type: 'item',
      class: 'p-menuitem-link text-green-500',
    },
    {
      labelTooltip: 'Hacer encuesta',
      icon: 'pi pi-arrow-right',
      accion: 'generar',
      type: 'item',
      class: 'p-menuitem-link text-primary',
      isVisible: (rowData: any) =>
        Number(rowData.iEstado) === this.ESTADO_APROBADA &&
        (Number(this.categoria?.bEsFija) === 0 ||
          (Number(this.categoria?.bEsFija) === 1 &&
            [ADMINISTRADOR_DREMO, DIRECTOR_IE].includes(Number(this.perfil.iPerfilId)))),
    },
    {
      labelTooltip: 'Archivar',
      icon: 'pi pi-folder',
      accion: 'archivar',
      type: 'item',
      class: 'p-menuitem-link text-gray-500',
      isVisible: (rowData: any) =>
        Number(rowData.iEstado) === this.ESTADO_APROBADA && Number(rowData.esta_archivada) === 0,
    },
    {
      labelTooltip: 'Desarchivar',
      icon: 'pi pi-folder-open',
      accion: 'desarchivar',
      type: 'item',
      class: 'p-menuitem-link text-green-500',
      isVisible: (rowData: any) =>
        Number(rowData.iEstado) === this.ESTADO_APROBADA && Number(rowData.esta_archivada) === 1,
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
      width: '35%',
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
        ARCHIVADA: 'secondary',
      },
    },
    {
      type: 'dropdown-actions',
      width: '10%',
      field: '',
      header: 'Acciones',
      text_header: 'right',
      text: 'right',
    },
  ];
}
