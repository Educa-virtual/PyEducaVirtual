import { PrimengModule } from '@/app/primeng.module';
import { ChangeDetectorRef, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EvaluacionExclusionesService } from '../../../services/evaluacion-exclusiones.service';
import { MenuItem, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { DIRECTOR_IE } from '@/app/servicios/seg/perfiles';
import { TextFieldModule } from '@angular/cdk/text-field';
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { DatosInformesService } from '@/app/sistema/ere/services/datos-informes.service';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-evaluacion-exclusiones',
  standalone: true,
  imports: [PrimengModule, TextFieldModule, TablePrimengComponent],
  templateUrl: './evaluacion-exclusiones.component.html',
  styleUrl: './evaluacion-exclusiones.component.scss',
})
export class EvaluacionExclusionesComponent implements OnInit {
  @ViewChild('filtro') filtro: any;
  @ViewChild('filtros') filtros: OverlayPanel;
  @ViewChild('overlayAnchor') overlayAnchorRef: ElementRef;
  cEvaluacionKey: string;
  evaluacion: any;
  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;
  perfil: any;
  iYAcadId: number;

  formFiltros: FormGroup;
  filtros_aplicados: number = 0;

  formExclusion: FormGroup;
  exclusiones: Array<any>;
  exclusiones_filtradas: Array<any>;
  exclusion_registrada: boolean = false;
  exclusion_bloqueada: boolean = false;

  dialog_header: string;
  dialog_visible: boolean;

  es_director: boolean = false;

  longitud_documento = 7;
  formato_documento = '99999999';
  tipos_documentos: Array<object>;

  nivel_tipos: Array<object>;
  nivel_grados: Array<object>;
  distritos: Array<object>;
  ies: Array<object>;
  secciones: Array<object>;
  sexos: Array<object>;
  zonas: Array<object>;
  tipo_sectores: Array<object>;
  ugeles: Array<object>;

  private _messageService = inject(MessageService);
  private _confirmService = inject(ConfirmationModalService);

  constructor(
    private exclusionesService: EvaluacionExclusionesService,
    private datosInformes: DatosInformesService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private store: LocalStoreService,
    private cf: ChangeDetectorRef
  ) {
    this.perfil = this.store.getItem('dremoPerfil');
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.es_director = Number(this.perfil.iPerfilId) === Number(DIRECTOR_IE);
    this.route.paramMap.subscribe(params => {
      this.cEvaluacionKey = params.get('iEvaluacionId');
    });
    this.setBreadCrumbs();
  }

  setBreadCrumbs(evaluacion: any | null = null) {
    this.breadCrumbItems = [
      { label: 'ERE' },
      { label: 'Evaluaciones', routerLink: ['/ere/evaluaciones'] },
      {
        label: this.evaluacion
          ? this.evaluacion.cEvaluacionNombre + ' - ' + evaluacion.cNivelEvalNombre
          : 'EVALUACION',
      },
      { label: 'Gestionar exclusiones' },
    ];
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
  }

  ngOnInit() {
    try {
      this.formExclusion = this.fb.group({
        iCredEntPerfId: [this.perfil.iCredEntPerfId, Validators.required],
        iEvaluacionId: [null, Validators.required],
        iEvalExcluId: [null],
        cEvalExcluMotivo: [null, Validators.required],
        dEvalExcluArchivo: [null],
        cEstCodigo: [null],
        cIieeDatos: [null],
        cPersDatos: [null, Validators.required],
        iTipoIdentId: [null],
        cPersDocumento: [null],
        iMatrId: [null, Validators.required],
      });
    } catch (error) {
      console.error('Error al crear el formulario:', error);
    }

    this.exclusionesService.getTiposDocumentos().subscribe({
      next: (data: any) => {
        this.tipos_documentos = data.data.map((doc: any) => ({
          value: doc.iTipoIdentId,
          label: doc.cTipoIdentSigla + ' - ' + doc.cTipoIdentNombre,
          longitud: doc.iTipoIdentLongitud,
        }));
        this.tipos_documentos.unshift({
          value: 0,
          label: 'CODIGO DE ESTUDIANTE',
          longitud: 15,
        });
      },
      error: error => {
        console.error('Error obteniendo tipos de documentos:', error);
      },
    });

    if (this.cEvaluacionKey) {
      this.obtenerEvaluacion();
      this.listarExclusiones();
    }

    this.formExclusion.get('iTipoIdentId').valueChanges.subscribe(value => {
      const tipo_doc = this.tipos_documentos.find((item: any) => item.value === value);
      if (tipo_doc) {
        const longitud = this.formExclusion.get('cPersDocumento')?.value;
        if (longitud && longitud.length > tipo_doc['longitud']) {
          this.formExclusion.get('cPersDocumento').setValue(null);
        }
        this.longitud_documento = tipo_doc['longitud'];
        this.formato_documento = '9'.repeat(this.longitud_documento);
      }
    });

    try {
      this.formFiltros = this.fb.group({
        iNivelTipoId: [null],
        iNivelGradoId: [null],
        iZonaId: [null],
        iTipoSectorId: [null],
        iUgelId: [null],
        iDsttId: [null],
        iIieeId: [null],
        iSeccionId: [null],
        cPersSexo: [null],
      });
    } catch (error) {
      console.error(error, 'error de formulario');
    }

    this.sexos = this.datosInformes.getSexos();
    this.datosInformes
      .obtenerParametros({
        iYAcadId: this.iYAcadId,
        iEvaluacionId: this.cEvaluacionKey,
      })
      .subscribe((data: any) => {
        this.distritos = this.datosInformes.getDistritos(data?.distritos);
        this.secciones = this.datosInformes.getSecciones(data?.secciones);
        this.zonas = this.datosInformes.getZonas(data?.zonas);
        this.tipo_sectores = this.datosInformes.getTipoSectores(data?.tipo_sectores);
        this.ugeles = this.datosInformes.getUgeles(data?.ugeles);
        this.nivel_tipos = this.datosInformes.getNivelesTipos(data?.nivel_tipos);
        this.ies = this.datosInformes.getInstitucionesEducativas(data?.instituciones_educativas);
        this.datosInformes.getNivelesGrados(data?.nivel_grados);
        this.datosInformes.getAreas(data?.areas);

        if (this.nivel_tipos.length == 1) {
          this.formFiltros.get('iNivelTipoId')?.setValue(this.nivel_tipos[0]['value']);
        }
        if (this.ugeles.length == 1) {
          this.formFiltros.get('iUgelId')?.setValue(this.ugeles[0]['value']);
        }
        if (this.ies.length == 1) {
          this.formFiltros.get('iIieeId')?.setValue(this.ies[0]['value']);
        }
        this.contarFiltros();
      });

    this.formFiltros.get('iNivelTipoId').valueChanges.subscribe(value => {
      this.formFiltros.get('iNivelGradoId')?.setValue(null);
      this.nivel_grados = null;
      this.filterNivelesGrados(value);

      this.formFiltros.get('iIieeId')?.setValue(null);
      this.ies = null;
      this.filterInstitucionesEducativas();
      if (this.ies.length == 1) {
        this.formFiltros.get('iNiviIieeIdelGradoId')?.setValue(this.ies[0]['value']);
      }
    });
    this.formFiltros.get('iDsttId').valueChanges.subscribe(() => {
      this.formFiltros.get('iIieeId')?.setValue(null);
      this.ies = null;
      this.filterInstitucionesEducativas();
    });
    this.formFiltros.get('iZonaId').valueChanges.subscribe(() => {
      this.formFiltros.get('iIieeId')?.setValue(null);
      this.ies = null;
      this.filterInstitucionesEducativas();
    });
    this.formFiltros.get('iTipoSectorId').valueChanges.subscribe(() => {
      this.formFiltros.get('iIieeId')?.setValue(null);
      this.ies = null;
      this.filterInstitucionesEducativas();
    });
    this.formFiltros.get('iUgelId').valueChanges.subscribe(value => {
      this.formFiltros.get('iDsttId')?.setValue(null);
      this.formFiltros.get('iIieeId')?.setValue(null);
      this.ies = null;
      this.distritos = null;
      this.filterInstitucionesEducativas();
      this.filterDistritos(value);
    });
  }

  filterNivelesTipos() {
    this.nivel_tipos = this.datosInformes.filterNivelesTipos();
  }

  filterNivelesGrados(iNivelTipoId: number) {
    this.nivel_grados = this.datosInformes.filterNivelesGrados(iNivelTipoId);
  }

  filterDistritos(iUgelId: number) {
    this.distritos = this.datosInformes.filterDistritos(iUgelId);
  }

  filterInstitucionesEducativas() {
    const iEvaluacionId = this.formFiltros.get('iEvaluacionId')?.value;
    const iNivelTipoId = this.formFiltros.get('iNivelTipoId')?.value;
    const iDsttId = this.formFiltros.get('iDsttId')?.value;
    const iZonaId = this.formFiltros.get('iZonaId')?.value;
    const iTipoSectorId = this.formFiltros.get('iTipoSectorId')?.value;
    const iUgelId = this.formFiltros.get('iUgelId')?.value;
    this.ies = this.datosInformes.filterInstitucionesEducativas(
      iEvaluacionId,
      iNivelTipoId,
      iDsttId,
      iZonaId,
      iTipoSectorId,
      iUgelId
    );
  }

  obtenerEvaluacion() {
    this.exclusionesService.verEvaluacion(this.cEvaluacionKey).subscribe({
      next: (data: any) => {
        if (data.data) {
          this.evaluacion = data.data;
          if (this.evaluacion) {
            this.setBreadCrumbs(this.evaluacion);
          }
        }
      },
      error: error => {
        console.error('Error obteniendo evaluación:', error);
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  listarExclusiones() {
    this.exclusionesService
      .listarExclusiones({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iEvaluacionId: this.cEvaluacionKey,
      })
      .subscribe({
        next: (data: any) => {
          this.exclusiones = data.data;
          this.exclusiones_filtradas = this.exclusiones;
        },
        error: error => {
          console.error('Error obteniendo exclusiones:', error);
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  agregarExclusion() {
    this.dialog_header = 'Registrar exclusión';
    this.dialog_visible = true;
    this.exclusion_bloqueada = false;
  }

  dialogVisible(visible: boolean) {
    this.dialog_visible = visible;
  }

  filtrarExclusiones() {
    const filtro = this.filtro.nativeElement.value.toLowerCase();
    const iNivelTipoId = this.formFiltros.value.iNivelTipoId;
    const iNivelGradoId = this.formFiltros.value.iNivelGradoId;
    const iTipoSectorId = this.formFiltros.value.iTipoSectorId;
    const iZonaId = this.formFiltros.value.iZonaId;
    const iUgelId = this.formFiltros.value.iUgelId;
    const iDsttId = this.formFiltros.value.iDsttId;
    const iIieeId = this.formFiltros.value.iIieeId;
    const iSeccionId = this.formFiltros.value.iSeccionId;
    const cPersSexo = this.formFiltros.value.cPersSexo;

    this.exclusiones_filtradas = this.exclusiones.filter(ex => {
      if (iNivelTipoId && Number(iNivelTipoId) !== Number(ex.iNivelTipoId)) return null;
      if (iNivelGradoId && Number(iNivelGradoId) !== Number(ex.iNivelGradoId)) return null;
      if (iTipoSectorId && Number(iTipoSectorId) !== Number(ex.iTipoSectorId)) return null;
      if (iZonaId && Number(iZonaId) !== Number(ex.iZonaId)) return null;
      if (iUgelId && Number(iUgelId) !== Number(ex.iUgelId)) return null;
      if (iDsttId && Number(iDsttId) !== Number(ex.iDsttId)) return null;
      if (iIieeId && Number(iIieeId) !== Number(ex.iIieeId)) return null;
      if (iSeccionId && Number(iSeccionId) !== Number(ex.iSeccionId)) return null;
      if (cPersSexo && cPersSexo !== ex.cPersSexo) return null;
      if (ex.cPersTipoDocumento.toLowerCase().includes(filtro)) return ex;
      if (ex.cEstCodigo.toLowerCase().includes(filtro)) return ex;
      if (ex.cPersNombreApellidos.toLowerCase().includes(filtro)) return ex;
      if (ex.cGradoNombre.toLowerCase().includes(filtro)) return ex;
      if (ex.cSeccionNombre.toLowerCase().includes(filtro)) return ex;
      if (ex.cIieeCodigoModular.toLowerCase().includes(filtro)) return ex;
      if (ex.cIieeNombre.toLowerCase().includes(filtro)) return ex;
      return null;
    });
    this.contarFiltros();
  }

  contarFiltros() {
    this.filtros_aplicados = Object.values(this.formFiltros.value).filter(
      (value: any) => value !== null && value !== ''
    ).length;
  }

  editarExclusion(data: any) {
    this.dialog_header = 'Editar exclusión';
    this.dialog_visible = true;
    this.obtenerExclusion(data);
    this.exclusion_bloqueada = false;
  }

  verExclusion(data: any) {
    this.dialog_header = 'Ver exclusión';
    this.dialog_visible = true;
    this.obtenerExclusion(data);
    this.exclusion_bloqueada = true;
  }

  obtenerExclusion(data: any) {
    this.exclusionesService
      .verExclusion({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iEvalExcluId: data.iEvalExcluId,
      })
      .subscribe({
        next: (data: any) => {
          if (data.data) {
            this.setFormExclusion(data.data);
          }
        },
        error: error => {
          console.error('Error obteniendo encuesta:', error);
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  handleArchivo(event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    this.formExclusion.patchValue({
      cEvalExcluArchivo: file,
    });
  }

  setFormExclusion(data: any) {
    const es_codigo = this.formExclusion.value.iTipoIdentId === 0;
    this.formExclusion.reset();
    this.formExclusion.patchValue({
      iCredEntPerfId: this.perfil.iCredEntPerfId,
      iEvaluacionId: this.evaluacion.iEvaluacionId,
      iEvalExcluId: data ? data.iEvalExcluId : null,
      cPersDatos: data
        ? data?.cPersNombreApellidos + ' (' + data?.cGradoNombre + ' ' + data?.cSeccionNombre + ')'
        : null,
      cIieeDatos: data ? data?.cIieeCodigoModular + ' ' + data?.cIieeNombre : null,
      cEvalExcluMotivo: data ? data?.cEvalExcluMotivo : null,
      dEvalExcluArchivo: data ? data?.dEvalExcluArchivo : null,
      iMatrId: data ? data?.iMatrId : null,
      iTipoIdentId: data ? (es_codigo ? 0 : data?.iTipoIdentId) : null,
      cPersDocumento: data ? (es_codigo ? data?.cEstCodigo : data?.cPersDocumento) : null,
    });
    console.log(data ? (es_codigo ? data?.cEstCodigo : data?.cPersDocumento) : null);
    this.exclusion_registrada = this.formExclusion.value.iEvalExcluId ? true : false;
    this.exclusionesService.formMarkAsDirty(this.formExclusion);
    if (this.exclusion_bloqueada) {
      this.formExclusion.disable();
    } else {
      this.formExclusion.enable();
    }
    this.cf.detectChanges();
  }

  getFormData() {
    const formData: FormData = new FormData();
    formData.append('cEvalExcluArchivo', this.formExclusion.controls['cEvalExcluArchivo'].value);
    formData.append('iCredEntPerfId', this.perfil.iCredEntPerfId);
    formData.append('iEvaluacionId', this.evaluacion.iEvaluacionId);
    formData.append('iEvalExcluId', this.formExclusion.controls['iEvalExcluId'].value);
    formData.append('cEvalExcluMotivo', this.formExclusion.controls['cEvalExcluMotivo'].value);
    formData.append('dEvalExcluArchivo', this.formExclusion.controls['dEvalExcluArchivo'].value);
    formData.append('iMatrId', this.formExclusion.controls['iMatrId'].value);
    return formData;
  }

  guardarExclusion() {
    if (this.formExclusion.invalid) {
      this._messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe completar todos los campos obligatorios',
      });
      this.exclusionesService.formMarkAsDirty(this.formExclusion);
      return;
    }
    this.exclusionesService.guardarExclusion(this.formExclusion.value).subscribe({
      next: () => {
        this._messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: 'Se registraron los datos',
        });
        this.salir();
        this.listarExclusiones();
      },
      error: error => {
        console.error('Error guardando encuesta:', error);
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  actualizarExclusion() {
    if (this.formExclusion.invalid) {
      this._messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe completar todos los campos obligatorios',
      });
      this.exclusionesService.formMarkAsDirty(this.formExclusion);
      return;
    }
    this.exclusionesService.actualizarExclusion(this.formExclusion.value).subscribe({
      next: () => {
        this._messageService.add({
          severity: 'success',
          summary: 'Actualización exitosa',
          detail: 'Se actualizaron los datos',
        });
        this.salir();
        this.listarExclusiones();
      },
      error: error => {
        console.error('Error actualizando encuesta:', error);
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  buscarMatricula() {
    const tipo_doc = Number(this.formExclusion.value.iTipoIdentId);
    this.exclusionesService
      .buscarMatricula({
        iYAcadId: this.store.getItem('dremoiYAcadId'),
        iSedeId: this.perfil?.iSedeId,
        cEstCodigo: tipo_doc === 0 ? this.formExclusion.value.cPersDocumento : null,
        iTipoIdentId: tipo_doc > 0 ? this.formExclusion.value.iTipoIdentId : null,
        cPersDocumento: tipo_doc > 0 ? this.formExclusion.value.cPersDocumento : null,
      })
      .subscribe({
        next: (data: any) => {
          if (data.data) {
            this.setFormExclusion(data.data);
          } else {
            this.setFormExclusion(null);
            this._messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se encontró la matricula',
            });
          }
        },
        error: error => {
          this.setFormExclusion(null);
          console.error('Error obteniendo matricula:', error);
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  borrarExclusion(data: any) {
    this.exclusionesService
      .eliminarExclusion({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iEvalExcluId: data.iEvalExcluId,
      })
      .subscribe({
        next: () => {
          this._messageService.add({
            severity: 'success',
            summary: 'Eliminación exitosa',
            detail: 'Se eliminaron los datos',
          });
          this.listarExclusiones();
          this.salir();
        },
        error: error => {
          console.error('Error eliminando encuesta:', error);
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  resetear() {
    this.formExclusion.reset();
    this.formExclusion.patchValue({
      iCredEntPerfId: this.perfil.iCredEntPerfId,
      iEvaluacionId: this.evaluacion.iEvaluacionId,
    });
    this.exclusion_registrada = false;
  }

  salir() {
    this.resetear();
    this.dialogVisible(false);
  }

  columnasTabla: any[] = [
    {
      field: 'cEstCodigo',
      type: 'text',
      width: '10%',
      header: 'Código',
      text_header: 'center',
      text: 'center',
      class: 'hidden md:table-cell',
    },
    {
      field: 'cPersTipoDocumento',
      type: 'text',
      width: '10%',
      header: 'Documento',
      text_header: 'center',
      text: 'center',
      class: 'hidden md:table-cell',
    },
    {
      field: 'cPersNombreApellidos',
      type: 'text',
      width: '25%',
      header: 'Estudiante',
      text_header: 'left',
      text: 'left',
    },
    {
      field: 'cGradoNombre',
      type: 'text',
      width: '5%',
      header: 'Grado',
      text_header: 'center',
      text: 'center',
    },
    {
      field: 'cSeccionNombre',
      type: 'text',
      width: '5%',
      header: 'Sección',
      text_header: 'center',
      text: 'center',
    },
    {
      field: 'cIieeCodigoModular',
      type: 'text',
      width: '5%',
      header: 'I.E.',
      text_header: 'center',
      text: 'center',
      class: 'hidden md:table-cell',
    },
    {
      field: 'cIieeNombre',
      type: 'text',
      width: '35%',
      header: 'I.E. Nombre',
      text_header: 'center',
      text: 'left',
      class: 'hidden md:table-cell',
    },
    {
      field: '',
      type: 'actions',
      width: '5%',
      header: 'Acciones',
      text_header: 'right',
      text: 'right',
    },
  ];

  accionesTabla: IActionTable[] = [
    {
      labelTooltip: 'Editar',
      icon: 'pi pi-file-edit',
      accion: 'editar',
      type: 'item',
      class: 'p-button-rounded p-button-success p-button-text',
      isVisible: () => this.es_director,
    },
    {
      labelTooltip: 'Ver',
      icon: 'pi pi-eye',
      accion: 'ver',
      type: 'item',
      class: 'p-button-rounded p-button-primary p-button-text',
      isVisible: () => !this.es_director,
    },
    {
      labelTooltip: 'Borrar',
      icon: 'pi pi-trash',
      accion: 'borrar',
      type: 'item',
      class: 'p-button-rounded p-button-danger p-button-text',
      isVisible: () => this.es_director,
    },
  ];

  accionBnt(event: { accion: string; item: any }) {
    switch (event.accion) {
      case 'editar':
        this.editarExclusion(event.item);
        break;
      case 'ver':
        this.verExclusion(event.item);
        break;
      case 'borrar':
        this._confirmService.openConfirm({
          header: '¿Realmente desea eliminar la exclución seleccionada?',
          accept: () => {
            this.borrarExclusion(event.item);
          },
        });
        break;
    }
  }
}
