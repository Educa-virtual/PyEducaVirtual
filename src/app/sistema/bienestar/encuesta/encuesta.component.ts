import { PrimengModule } from '@/app/primeng.module';
import { ChangeDetectorRef, Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { DatosEncuestaService } from '../services/datos-encuesta.service';
import {
  IActionTable,
  IColumn,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FuncionesBienestarService } from '../services/funciones-bienestar.service';
import { ESPECIALISTA_DREMO, ESPECIALISTA_UGEL } from '@/app/servicios/seg/perfiles';

@Component({
  selector: 'app-encuesta',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent],
  templateUrl: './encuesta.component.html',
  styleUrl: './../gestionar-encuestas/gestionar-encuestas.component.scss',
})
export class EncuestaComponent implements OnInit {
  @Output() es_visible = new EventEmitter<any>();
  active: number = 0;
  iYAcadId: number;
  perfil: any;
  iEncuId: number;
  encuesta: any;

  columns_poblacion: IColumn[];
  columns_permisos: IColumn[];

  ultima_fecha_anio: Date = new Date(new Date().getFullYear(), 11, 31);
  fecha_actual: Date = new Date();
  es_especialista: boolean = false;
  es_especialista_ugel: boolean = false;

  formEncuesta: FormGroup;
  formPoblacion: FormGroup;
  formPermisos: FormGroup;

  categorias: Array<object>;
  opciones: Array<object>;
  distritos: Array<object>;
  nivel_tipos: Array<object>;
  nivel_grados: Array<object>;
  areas: Array<object>;
  secciones: Array<object>;
  zonas: Array<object>;
  tipo_sectores: Array<object>;
  ugeles: Array<object>;
  ies: Array<object>;
  sexos: Array<object>;
  estados: Array<object>;
  perfiles: Array<object>;

  poblacion: Array<object> = [];
  permisos: Array<object> = [];

  cantidad_poblacion: any = 0;

  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;

  puede_editar: boolean = true;
  encuesta_registrada: boolean = false;
  encuesta_bloqueada: boolean = false;

  ESTADO_BORRADOR: number = this.datosEncuestas.ESTADO_BORRADOR;
  ESTADO_TERMINADA: number = this.datosEncuestas.ESTADO_TERMINADA;
  ESTADO_APROBADA: number = this.datosEncuestas.ESTADO_APROBADA;

  private _messageService = inject(MessageService);

  constructor(
    private fb: FormBuilder,
    private datosEncuestas: DatosEncuestaService,
    private funcionesBienestar: FuncionesBienestarService,
    private store: LocalStoreService,
    private route: ActivatedRoute,
    private router: Router,
    private cf: ChangeDetectorRef
  ) {
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.perfil = this.store.getItem('dremoPerfil');
    this.es_especialista = [ESPECIALISTA_DREMO, ESPECIALISTA_UGEL].includes(
      Number(this.perfil.iPerfilId)
    );
    this.es_especialista_ugel = ESPECIALISTA_UGEL === Number(this.perfil.iPerfilId);
    this.route.paramMap.subscribe((params: any) => {
      this.iEncuId = params.params.id || null;
    });
    this.breadCrumbItems = [
      {
        label: 'Bienestar social',
      },
      {
        label: 'Gestionar encuestas',
        routerLink: '/bienestar/gestionar-encuestas',
      },
      {
        label: 'Encuesta',
      },
    ];
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
  }

  ngOnInit(): void {
    this.formEncuesta = this.fb.group({
      iYAcadId: [this.iYAcadId],
      iCredEntPerfId: [this.perfil.iCredEntPerfId],
      iEncuId: [null],
      cEncuNombre: ['', Validators.required],
      cEncuDescripcion: ['', Validators.required],
      iEncuCateId: [null, Validators.required],
      iEstado: [1, Validators.required],
      dEncuDesde: [null, Validators.required],
      dEncuHasta: [null, Validators.required],
      poblacion: [null],
      permisos: [null],
      jsonPoblacion: [null],
      jsonPermisos: [null],
    });

    this.formPoblacion = this.fb.group({
      iEncuPobId: [null],
      iNivelTipoId: [null],
      iTipoSectorId: [null],
      iZonaId: [null],
      iUgelId: [null],
      iDsttId: [null],
      iIieeId: [null],
      iNivelGradoId: [null],
      iSeccionId: [null],
      cPersSexo: [null],
      poblacion: [''],
    });

    this.formPermisos = this.fb.group({
      iEncuPermId: [null],
      iPerfilId: [null],
      cPerfilNombre: [''],
      iEncuOpcId: [null],
      cEncuOpcNombre: [''],
      cantidad: [0],
    });

    this.datosEncuestas
      .getEncuestaParametros({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
      })
      .subscribe((data: any) => {
        this.perfiles = this.datosEncuestas.getPerfiles(data?.perfiles);
        this.categorias = this.datosEncuestas.getCategorias(data?.categorias);
        this.opciones = this.datosEncuestas.getOpciones(data?.opciones);
        this.distritos = this.datosEncuestas.getDistritos(data?.distritos);
        this.secciones = this.datosEncuestas.getSecciones(data?.secciones);
        this.zonas = this.datosEncuestas.getZonas(data?.zonas);
        this.tipo_sectores = this.datosEncuestas.getTipoSectores(data?.tipo_sectores);
        this.ugeles = this.datosEncuestas.getUgeles(data?.ugeles);
        this.nivel_tipos = this.datosEncuestas.getNivelesTipos(data?.nivel_tipos);
        this.ies = this.datosEncuestas.getInstitucionesEducativas(data?.instituciones_educativas);
        this.distritos = this.datosEncuestas.getDistritos(data?.distritos);
        this.sexos = this.datosEncuestas.getSexos();
        this.estados = this.datosEncuestas.getEstados();
        this.datosEncuestas.getNivelesGrados(data?.nivel_grados);
        if (this.nivel_tipos && this.nivel_tipos.length == 1) {
          const nivel_tipo = this.nivel_tipos[0]['value'];
          this.formPoblacion.get('iNivelTipoId')?.setValue(nivel_tipo);
          this.filterNivelesGrados(nivel_tipo);
          this.filterInstitucionesEducativas();
        }
        if (this.ugeles && this.ugeles.length === 1) {
          const ugel = this.ugeles[0]['value'];
          this.formPoblacion.get('iUgelId')?.setValue(ugel);
          this.filterInstitucionesEducativas();
        }
      });

    this.formPoblacion.get('iNivelTipoId').valueChanges.subscribe(value => {
      this.formPoblacion.get('iNivelGradoId')?.setValue(null);
      this.nivel_grados = null;
      this.filterNivelesGrados(value);

      this.formPoblacion.get('iIieeId')?.setValue(null);
      this.filterInstitucionesEducativas();
    });
    this.formPoblacion.get('iDsttId').valueChanges.subscribe(() => {
      this.formPoblacion.get('iIieeId')?.setValue(null);
      this.filterInstitucionesEducativas();
    });
    this.formPoblacion.get('iZonaId').valueChanges.subscribe(() => {
      this.formPoblacion.get('iIieeId')?.setValue(null);
      this.filterInstitucionesEducativas();
    });
    this.formPoblacion.get('iTipoSectorId').valueChanges.subscribe(() => {
      this.formPoblacion.get('iIieeId')?.setValue(null);
      this.filterInstitucionesEducativas();
    });
    this.formPoblacion.get('iUgelId').valueChanges.subscribe(value => {
      this.formPoblacion.get('iDsttId')?.setValue(null);
      this.formPoblacion.get('iIieeId')?.setValue(null);
      this.distritos = null;
      this.filterInstitucionesEducativas();
      this.filterDistritos(value);
    });

    if (this.iEncuId) {
      this.verEncuesta();
    }

    this.inicializarColumnas();
  }

  filterNivelesTipos() {
    this.nivel_tipos = this.datosEncuestas.filterNivelesTipos();
  }

  filterNivelesGrados(iNivelTipoId: number) {
    this.nivel_grados = this.datosEncuestas.filterNivelesGrados(iNivelTipoId);
  }

  filterDistritos(iUgelId: number) {
    this.distritos = this.datosEncuestas.filterDistritos(iUgelId);
  }

  filterInstitucionesEducativas() {
    this.ies = null;
    const iNivelTipoId = this.formPoblacion.get('iNivelTipoId')?.value;
    const iDsttId = this.formPoblacion.get('iDsttId')?.value;
    const iZonaId = this.formPoblacion.get('iZonaId')?.value;
    const iTipoSectorId = this.formPoblacion.get('iTipoSectorId')?.value;
    const iUgelId = this.formPoblacion.get('iUgelId')?.value;
    this.ies = this.datosEncuestas.filterInstitucionesEducativas(
      iNivelTipoId,
      iDsttId,
      iZonaId,
      iTipoSectorId,
      iUgelId
    );
    if (this.ies && this.ies.length === 1) {
      this.formPoblacion.get('iIieeId')?.setValue(this.ies[0]['value']);
    }
  }

  handlePanelClick(onClick: any, active: number) {
    if (active === 0) {
      this.handleNextEncuestaPoblacion(onClick);
    } else if (active === 1) {
      this.handleNextPoblacionPermisos(onClick);
    }
  }

  handleNextEncuestaPoblacion(nextCallback: any) {
    this._messageService.clear();
    if (this.formEncuesta.invalid) {
      this._messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe completar los campos requeridos',
      });
      this.funcionesBienestar.formMarkAsDirty(this.formEncuesta);
      return;
    }
    nextCallback.emit();
  }

  handleNextPoblacionPermisos(nextCallback: any) {
    if (this.poblacion.length === 0) {
      this._messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe especificar la población objetivo',
      });
      return;
    }
    nextCallback.emit();
  }

  verEncuesta() {
    this.datosEncuestas
      .verEncuesta({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iEncuId: this.iEncuId,
      })
      .subscribe({
        next: (data: any) => {
          if (data.data) {
            this.encuesta_registrada = true;
            this.setFormEncuesta(data.data);
            this.inicializarColumnas();
          } else {
            this.router.navigate(['/bienestar/gestionar-encuestas']);
          }
        },
        error: error => {
          console.error('Error obteniendo encuesta:', error);
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
          this.router.navigate(['/bienestar/gestionar-encuestas']);
        },
      });
  }

  setFormEncuesta(data: any) {
    if (Number(data.iEstado) !== this.ESTADO_BORRADOR || Number(data.puede_editar) !== 1) {
      data.iEstado = this.ESTADO_TERMINADA;
      this.formEncuesta.disable();
      this.puede_editar = false;
    }

    this.formEncuesta.reset();
    this.formEncuesta.patchValue(data);
    this.funcionesBienestar.formatearFormControl(
      this.formEncuesta,
      'iEncuCateId',
      data.iEncuCateId,
      'number'
    );
    this.funcionesBienestar.formatearFormControl(
      this.formEncuesta,
      'iEstado',
      data.iEstado,
      'number'
    );
    this.formEncuesta
      .get('dEncuDesde')
      .patchValue(this.funcionesBienestar.formaterarFormFecha(data.dEncuDesde));
    this.formEncuesta
      .get('dEncuHasta')
      .patchValue(this.funcionesBienestar.formaterarFormFecha(data.dEncuHasta));

    const poblacion = JSON.parse(data.poblacion);
    if (poblacion && poblacion.length) {
      for (let i = 0; i < poblacion.length; i++) {
        this.agregarPoblacion(poblacion[i]);
      }
    }
    const permisos = JSON.parse(data.permisos);
    if (permisos && permisos.length) {
      for (let i = 0; i < permisos.length; i++) {
        this.agregarPermiso(permisos[i]);
      }
    }
    this.formEncuesta.get('iYAcadId')?.setValue(this.iYAcadId);
    this.formEncuesta.get('iCredEntPerfId')?.setValue(this.perfil.iCredEntPerfId);

    this.encuesta = data;
  }

  actualizarPoblacion(item: any) {
    const nivel_tipo: any = this.nivel_tipos
      ? this.nivel_tipos.find((nivel: any) => nivel.value == item.iNivelTipoId)
      : null;
    const tipo_sector: any = this.tipo_sectores
      ? this.tipo_sectores.find((sector: any) => sector.value == item.iTipoSectorId)
      : null;
    const tipo_zona: any = this.zonas
      ? this.zonas.find((zona: any) => zona.value == item.iZonaId)
      : null;
    const ugel: any = this.ugeles
      ? this.ugeles.find((ugel: any) => ugel.value == item.iUgelId)
      : null;
    const distrito: any = this.distritos
      ? this.distritos.find((distrito: any) => distrito.value == item.iDsttId)
      : null;
    const ie: any = this.ies ? this.ies.find((ie: any) => ie.value == item.iIieeId) : null;
    const nivel_grado: any = this.nivel_grados
      ? this.nivel_grados.find((nivel: any) => nivel.value == item.iNivelGradoId)
      : null;
    const seccion: any = this.secciones
      ? this.secciones.find((seccion: any) => seccion.value == item.iSeccionId)
      : null;
    const sexo: any = this.sexos
      ? this.sexos.find((sexo: any) => sexo.value == item.cPersSexo)
      : null;

    let poblacion: any = [
      nivel_tipo?.label,
      tipo_sector?.label,
      tipo_zona?.label,
      ugel ? 'UGEL ' + ugel.label : null,
      distrito ? 'DISTRITO ' + distrito.label : null,
      ie?.label,
      nivel_grado?.label,
      seccion ? 'SECCIÓN ' + seccion.label : null,
      sexo ? 'GENERO ' + sexo.label : null,
    ];
    poblacion = poblacion.filter((item: any) => item != null);
    this.formPoblacion.get('poblacion')?.setValue(poblacion.join(', '));
    this.formEncuesta.get('poblacion')?.setValue(poblacion);
    this.formPoblacion.get('iEncuPobId')?.setValue(item.iEncuPobId ?? new Date().getTime());
  }

  actualizarPermisos(item: any) {
    const perfil: any = this.perfiles.find((perfil: any) => perfil.value == item.iPerfilId);
    const opcion: any = this.opciones.find((opcion: any) => opcion.value == item.iEncuOpcId);
    this.formPermisos.get('cPerfilNombre')?.setValue(perfil ? perfil.label : '');
    this.formPermisos.get('cEncuOpcNombre')?.setValue(opcion ? opcion.label : '');
    this.formPermisos.get('iEncuPermId')?.setValue(item.iEncuPermId ?? new Date().getTime());
  }

  guardarEncuesta() {
    this.formEncuesta.get('iYAcadId')?.setValue(this.iYAcadId);
    this.formEncuesta.get('iCredEntPerfId')?.setValue(this.perfil.iCredEntPerfId);

    this._messageService.clear();
    if (this.formEncuesta.invalid) {
      this._messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe llenar todos los campos de la primera sección: Información General',
      });
      return;
    }
    if (this.poblacion.length == 0) {
      this._messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe especificar al menos una población objetivo',
      });
      return;
    }

    this.funcionesBienestar.formControlJsonStringify(
      this.formEncuesta,
      'jsonPoblacion',
      'poblacion',
      ''
    );
    this.funcionesBienestar.formControlJsonStringify(
      this.formEncuesta,
      'jsonPermisos',
      'permisos',
      ''
    );
    this.datosEncuestas.guardarEncuesta(this.formEncuesta.value).subscribe({
      next: (data: any) => {
        this._messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: 'Se registraron los datos',
        });
        const iEncuId = data.data[0].iEncuId;
        this.router.navigate([`/bienestar/encuesta/${iEncuId}/preguntas`]);
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

  actualizarEncuesta() {
    this.formEncuesta.get('iYAcadId')?.setValue(this.iYAcadId);
    this.formEncuesta.get('iCredEntPerfId')?.setValue(this.perfil.iCredEntPerfId);

    this._messageService.clear();
    if (this.formEncuesta.invalid) {
      this._messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe llenar todos los campos de la primera sección: Información General',
      });
      return;
    }
    if (this.poblacion.length == 0) {
      this._messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe especificar la población objetivo',
      });
      return;
    }

    this.funcionesBienestar.formControlJsonStringify(
      this.formEncuesta,
      'jsonPoblacion',
      'poblacion',
      ''
    );
    this.funcionesBienestar.formControlJsonStringify(
      this.formEncuesta,
      'jsonPermisos',
      'permisos',
      ''
    );
    this.datosEncuestas.actualizarEncuesta(this.formEncuesta.getRawValue()).subscribe({
      next: () => {
        this._messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: 'Se registraron los datos',
        });
        this.router.navigate([`/bienestar/encuesta/${this.iEncuId}/preguntas`]);
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

  agregarPoblacion(item: any = null) {
    this._messageService.clear();
    if (item) {
      this.formPoblacion.patchValue(item);
    }
    if (
      this.formPoblacion.value.iNivelTipoId === null &&
      this.formPoblacion.value.iTipoSectorId === null &&
      this.formPoblacion.value.iZonaId === null &&
      this.formPoblacion.value.iUgelId === null &&
      this.formPoblacion.value.iDsttId === null &&
      this.formPoblacion.value.iIieeId === null &&
      this.formPoblacion.value.iNivelGradoId === null &&
      this.formPoblacion.value.iSeccionId === null &&
      this.formPoblacion.value.cPersSexo === null
    ) {
      this.funcionesBienestar.formMarkAsDirty(this.formPoblacion);
      this._messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'No puede agregar un registro en blanco',
      });
      return;
    }
    const duplicados = this.poblacion.filter(
      (pob: any) =>
        Number(pob.iNivelTipoId) === Number(this.formPoblacion.value.iNivelTipoId) &&
        Number(pob.iTipoSectorId) === Number(this.formPoblacion.value.iTipoSectorId) &&
        Number(pob.iZonaId) === Number(this.formPoblacion.value.iZonaId) &&
        Number(pob.iUgelId) === Number(this.formPoblacion.value.iUgelId) &&
        Number(pob.iDsttId) === Number(this.formPoblacion.value.iDsttId) &&
        Number(pob.iIieeId) === Number(this.formPoblacion.value.iIieeId) &&
        Number(pob.iNivelGradoId) === Number(this.formPoblacion.value.iNivelGradoId) &&
        Number(pob.iSeccionId) === Number(this.formPoblacion.value.iSeccionId) &&
        Number(pob.cPersSexo) === Number(this.formPoblacion.value.cPersSexo)
    );
    if (duplicados.length) {
      this.funcionesBienestar.formMarkAsDirty(this.formPoblacion);
      this._messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Ya existe un registro con estos datos',
      });
      return;
    }
    this.actualizarPoblacion(this.formPoblacion.value);
    const form: Array<object> = this.formPoblacion.value;
    this.poblacion = [...this.poblacion, form];
    this.formEncuesta.get('poblacion')?.setValue(this.poblacion);
    this.formPoblacion.reset();
    if (!this.es_especialista && this.nivel_tipos) {
      this.formPoblacion.get('iNivelTipoId')?.setValue(this.nivel_tipos[0]['value']);
    }
    this.obtenerPoblacionObjetivo();
  }

  agregarPermiso(item: any = null) {
    if (item) {
      this.formPermisos.patchValue(item);
    }
    if (this.formPermisos.value.iPerfilId === null || this.formPermisos.value.iEncuOpcId === null) {
      this.funcionesBienestar.formMarkAsDirty(this.formPermisos);
      this._messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'No puede agregar un permiso en blanco',
      });
      return;
    }
    const duplicados = this.permisos.filter(
      (permiso: any) =>
        permiso.iPerfilId === this.formPermisos.value.iPerfilId &&
        permiso.iEncuOpcId === this.formPermisos.value.iEncuOpcId
    );
    if (duplicados.length) {
      this.funcionesBienestar.formMarkAsDirty(this.formPermisos);
      this._messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Ya existe un permiso con ese perfil y opción',
      });
      return;
    }
    this.actualizarPermisos(this.formPermisos.value);
    const form: Array<object> = this.formPermisos.value;
    this.permisos = [...this.permisos, form];
    this.formEncuesta.get('permisos')?.setValue(this.permisos);
    this.formPermisos.reset();
  }

  obtenerPoblacionObjetivo() {
    this.funcionesBienestar.formControlJsonStringify(
      this.formEncuesta,
      'jsonPoblacion',
      'poblacion',
      ''
    );

    this.datosEncuestas
      .obtenerPoblacionObjetivo({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iYAcadId: this.iYAcadId,
        jsonPoblacion: this.formEncuesta.get('jsonPoblacion')?.value,
      })
      .subscribe({
        next: (data: any) => {
          this._messageService.clear();
          if (data.data) {
            if (
              this.poblacion.length > 0 &&
              Number(data.data.iPoblacionObjetivo) === Number(this.cantidad_poblacion)
            ) {
              this._messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail:
                  'La última población objetivo indicada es cero, quítela y agregue una nueva',
              });
            }
            this.cantidad_poblacion = data.data.iPoblacionObjetivo;
          } else {
            this._messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se ha encontrado la población objetivo',
            });
            this.cantidad_poblacion = 0;
          }
        },
        error: error => {
          console.error('Error obteniendo cantidad poblacion:', error);
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  salir() {
    this.router.navigate(['/bienestar/gestionar-encuestas']);
  }

  verPreguntas() {
    this.router.navigate(['/bienestar/encuesta/' + this.iEncuId + '/preguntas']);
  }

  accionBtnItemTablePoblacion({ accion, item }) {
    if (accion == 'eliminar') {
      this.poblacion = this.poblacion.filter(
        (poblacion: any) => item.iEncuPobId != poblacion.iEncuPobId
      );
      this.formEncuesta.get('poblacion')?.setValue(this.poblacion);
      this.obtenerPoblacionObjetivo();
    }
  }

  accionBtnItemTablePermisos({ accion, item }) {
    if (accion == 'eliminar') {
      this.permisos = this.permisos.filter(
        (permiso: any) => item.iEncuPermId != permiso.iEncuPermId
      );
      this.formEncuesta.get('permisos')?.setValue(this.permisos);
    }
  }

  actions_poblacion: IActionTable[] = [
    {
      labelTooltip: 'Eliminar',
      icon: 'pi pi-trash',
      accion: 'eliminar',
      type: 'item',
      class: 'p-button-rounded p-button-danger p-button-text',
    },
  ];

  actions_permisos: IActionTable[] = [
    {
      labelTooltip: 'Eliminar',
      icon: 'pi pi-trash',
      accion: 'eliminar',
      type: 'item',
      class: 'p-button-rounded p-button-danger p-button-text',
    },
  ];

  inicializarColumnas() {
    this.columns_poblacion = [
      {
        type: 'item',
        width: '10%',
        field: '',
        header: 'N°',
        text_header: 'center',
        text: 'center',
      },
      {
        type: 'text',
        width: '70%',
        field: 'poblacion',
        header: 'Población',
        text_header: 'left',
        text: 'left',
      },
    ];

    if (!this.encuesta || Number(this.encuesta?.iEstado) === this.ESTADO_BORRADOR) {
      this.columns_poblacion.push({
        type: 'actions',
        width: '20%',
        field: '',
        header: 'Acciones',
        text_header: 'right',
        text: 'right',
      });
    }

    this.columns_permisos = [
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
        width: '20%',
        field: 'cPerfilNombre',
        header: 'Perfil',
        text_header: 'left',
        text: 'left',
      },
      {
        type: 'text',
        width: '10%',
        field: 'cEncuOpcNombre',
        header: 'Permiso',
        text_header: 'left',
        text: 'left',
      },
    ];

    if (!this.encuesta || Number(this.encuesta?.iEstado) === this.ESTADO_BORRADOR) {
      this.columns_permisos.push({
        type: 'actions',
        width: '20%',
        field: '',
        header: 'Acciones',
        text_header: 'right',
        text: 'right',
      });
    }
  }
}
