import { Component, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { MenuItem, MessageService } from 'primeng/api';
import { EncuestasService } from '../services/encuestas.services';
import { DIRECTOR_IE, SUBDIRECTOR_IE } from '@/app/servicios/seg/perfiles';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AulaBancoPreguntasModule } from '../../aula-virtual/sub-modulos/aula-banco-preguntas/aula-banco-preguntas.module';
import { IActionTable, IColumn } from '@/app/shared/table-primeng/table-primeng.component';
import { SlicePipe } from '@angular/common';
@Component({
  selector: 'app-encuesta',
  standalone: true,
  imports: [PrimengModule, AulaBancoPreguntasModule],
  templateUrl: './encuesta.component.html',
  styleUrl: './encuesta.component.scss',
  providers: [SlicePipe],
})
export class EncuestaComponent implements OnInit {
  categoria: any = null;
  encuesta: any = null;
  active: number = 0;
  iCateId: number;
  iEncuId: number;

  formEncuesta: FormGroup;
  formPoblacion: FormGroup;
  formAccesos: FormGroup;

  poblacion: Array<object> = [];
  accesos: Array<object> = [];
  cantidad_poblacion: any = 0;
  cantidad_accesos: any = 0;
  columns_poblacion: IColumn[];
  columns_accesos: IColumn[];

  perfil: any;
  iYAcadId: number;

  es_director: boolean = false;
  puede_editar: boolean = true;
  encuesta_registrada: boolean = false;

  breadCrumbHome: MenuItem;
  breadCrumbItems: MenuItem[];

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
  permisos: Array<object>;
  tipos_reportes: Array<object>;
  tipos_graficos: Array<object>;
  tiempos_duracion: Array<object>;
  participantes: Array<object>;

  ESTADO_BORRADOR: number = this.encuestasService.ESTADO_BORRADOR;
  ESTADO_APROBADA: number = this.encuestasService.ESTADO_APROBADA;
  USUARIO_ENCUESTADOR: number = this.encuestasService.USUARIO_ENCUESTADOR;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private store: LocalStoreService,
    private encuestasService: EncuestasService,
    private slicePipe: SlicePipe,
    private messageService: MessageService
  ) {
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.perfil = this.store.getItem('dremoPerfil');
    this.es_director = [DIRECTOR_IE, SUBDIRECTOR_IE].includes(this.perfil.iPerfilId);
    this.route.paramMap.subscribe((params: any) => {
      this.iCateId = params.params.iCateId || null;
      this.iEncuId = params.params.iEncuId || null;
    });
    this.setBreadCrumbs();
  }

  ngOnInit() {
    try {
      this.formEncuesta = this.fb.group({
        iEncuId: [0],
        cEncuNombre: ['', Validators.required],
        cEncuSubtitulo: [''],
        cEncuDescripcion: [''],
        iEstado: [this.ESTADO_BORRADOR],
        dEncuInicio: ['', Validators.required],
        dEncuFin: ['', Validators.required],
        iTiemDurId: ['', Validators.required],
        iCateId: [this.iCateId, Validators.required],
        iYAcadId: [this.store.getItem('dremoiYAcadId')],
        poblacion: [null],
        accesos: [null],
        jsonPoblacion: [null],
        jsonAccesos: [null],
      });

      this.formPoblacion = this.fb.group({
        iPobId: [null],
        iPerfilId: [null],
        iCursoId: [null],
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

      this.formAccesos = this.fb.group({
        iAcceId: [null],
        iPerfilId: [null],
        cPerfilNombre: [''],
        iPermId: [null],
        cPermNombre: [''],
        cantidad: [0],
      });
    } catch (error) {
      console.error('Error al inicializar el formulario', error);
    }

    this.verCategoria();

    this.encuestasService
      .crearEncuesta({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iYAcadId: this.iYAcadId,
        iCateId: this.iCateId,
      })
      .subscribe((data: any) => {
        this.perfiles = this.encuestasService.getPerfiles(data?.perfiles);
        this.distritos = this.encuestasService.getDistritos(data?.distritos);
        this.zonas = this.encuestasService.getZonas(data?.zonas);
        this.tipo_sectores = this.encuestasService.getTipoSectores(data?.tipo_sectores);
        this.ugeles = this.encuestasService.getUgeles(data?.ugeles);
        this.nivel_tipos = this.encuestasService.getNivelesTipos(data?.nivel_tipos);
        this.ies = this.encuestasService.getInstitucionesEducativas(data?.instituciones_educativas);
        this.distritos = this.encuestasService.getDistritos(data?.distritos);
        this.participantes = this.encuestasService.getParticipantes(data?.participantes);
        this.areas = this.encuestasService.getAreas(data?.areas);
        this.tiempos_duracion = this.encuestasService.getTiemposDuracion(data?.tiempos_duracion);
        this.permisos = this.encuestasService.getPermisos(data?.permisos);
        this.sexos = this.encuestasService.getSexos();
        this.estados = this.encuestasService.getEstados();
        this.encuestasService.getNivelesGrados(data?.nivel_grados);
        if (this.es_director) {
          const nivel_tipo =
            this.nivel_tipos && this.nivel_tipos.length > 0 ? this.nivel_tipos[0]['value'] : null;
          const ie = this.ies && this.ies.length > 0 ? this.ies[0]['value'] : null;
          this.formPoblacion.get('iNivelTipoId')?.setValue(nivel_tipo);
          this.filterNivelesGrados(nivel_tipo);
          this.formPoblacion.get('iIieeId')?.setValue(ie);
        }
      });

    this.formPoblacion.get('iNivelTipoId').valueChanges.subscribe(value => {
      this.formPoblacion.get('iNivelGradoId')?.setValue(null);
      this.nivel_grados = null;
      this.filterNivelesGrados(value);

      this.formPoblacion.get('iIieeId')?.setValue(null);
      this.ies = null;
      this.filterInstitucionesEducativas();
    });
    this.formPoblacion.get('iDsttId').valueChanges.subscribe(() => {
      this.formPoblacion.get('iIieeId')?.setValue(null);
      this.ies = null;
      this.filterInstitucionesEducativas();
    });
    this.formPoblacion.get('iZonaId').valueChanges.subscribe(() => {
      this.formPoblacion.get('iIieeId')?.setValue(null);
      this.ies = null;
      this.filterInstitucionesEducativas();
    });
    this.formPoblacion.get('iTipoSectorId').valueChanges.subscribe(() => {
      this.formPoblacion.get('iIieeId')?.setValue(null);
      this.ies = null;
      this.filterInstitucionesEducativas();
    });
    this.formPoblacion.get('iUgelId').valueChanges.subscribe(value => {
      this.formPoblacion.get('iDsttId')?.setValue(null);
      this.formPoblacion.get('iIieeId')?.setValue(null);
      this.ies = null;
      this.distritos = null;
      this.filterInstitucionesEducativas();
      this.filterDistritos(value);
    });

    if (this.iEncuId) {
      this.verEncuesta();
    }

    this.inicializarColumnas();
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
      {
        label: 'Encuestas',
      },
      {
        label: 'Categorias',
        routerLink: `/encuestas/categorias`,
      },
      {
        label: this.categoria?.cCateNombre
          ? String(this.slicePipe.transform(this.categoria?.cCateNombre, 0, 20))
          : 'Categoría',
      },
      {
        label: 'Gestionar encuestas',
        routerLink: `/encuestas/categorias/${this.iCateId}/gestion-encuestas`,
      },
      {
        label: 'Nueva encuesta',
      },
    ];
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
  }

  filterNivelesTipos() {
    this.nivel_tipos = this.encuestasService.filterNivelesTipos();
  }

  filterNivelesGrados(iNivelTipoId: number) {
    this.nivel_grados = this.encuestasService.filterNivelesGrados(iNivelTipoId);
  }

  filterDistritos(iUgelId: number) {
    this.distritos = this.encuestasService.filterDistritos(iUgelId);
  }

  filterInstitucionesEducativas() {
    const iNivelTipoId = this.formPoblacion.get('iNivelTipoId')?.value;
    const iDsttId = this.formPoblacion.get('iDsttId')?.value;
    const iZonaId = this.formPoblacion.get('iZonaId')?.value;
    const iTipoSectorId = this.formPoblacion.get('iTipoSectorId')?.value;
    const iUgelId = this.formPoblacion.get('iUgelId')?.value;
    this.ies = this.encuestasService.filterInstitucionesEducativas(
      iNivelTipoId,
      iDsttId,
      iZonaId,
      iTipoSectorId,
      iUgelId
    );
  }

  verEncuesta() {
    this.encuestasService
      .verEncuesta({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iEncuId: this.iEncuId,
        iTipoUsuario: this.USUARIO_ENCUESTADOR,
      })
      .subscribe({
        next: (data: any) => {
          if (data.data) {
            this.encuesta = data.data;
            this.encuesta_registrada = true;
            this.setBreadCrumbs();
            this.setFormEncuesta(this.encuesta);
            this.inicializarColumnas();
          } else {
            this.router.navigate(['/encuestas/categorias/']);
          }
        },
        error: error => {
          console.error('Error obteniendo encuesta:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
          this.router.navigate(['/encuestas/categorias/']);
        },
      });
  }

  setFormEncuesta(data: any) {
    if (Number(data.iEstado) !== this.ESTADO_BORRADOR || Number(data.puede_editar) !== 1) {
      data.iEstado = this.ESTADO_APROBADA;
      this.formEncuesta.disable();
      this.puede_editar = false;
    }
    this.formEncuesta.reset();
    this.formEncuesta.patchValue(data);
    this.encuestasService.formatearFormControl(
      this.formEncuesta,
      'iTiemDurId',
      data.iTiemDurId,
      'number'
    );
    this.encuestasService.formatearFormControl(
      this.formEncuesta,
      'iCateId',
      data.iCateId,
      'number'
    );
    this.encuestasService.formatearFormControl(
      this.formEncuesta,
      'iEstado',
      data.iEstado,
      'number'
    );
    this.encuestasService.formatearFormControl(
      this.formEncuesta,
      'dEncuInicio',
      data.dEncuInicio,
      'date'
    );
    this.encuestasService.formatearFormControl(
      this.formEncuesta,
      'dEncuFin',
      data.dEncuFin,
      'date'
    );

    const poblacion = JSON.parse(data.poblacion);
    if (poblacion && poblacion.length) {
      for (let i = 0; i < poblacion.length; i++) {
        this.agregarPoblacion(poblacion[i]);
      }
    }
    const accesos = JSON.parse(data.accesos);
    if (accesos && accesos.length) {
      for (let i = 0; i < accesos.length; i++) {
        this.agregarAcceso(accesos[i]);
      }
    }
    this.formEncuesta.get('iYAcadId')?.setValue(this.iYAcadId);
    this.formEncuesta.get('iCredEntPerfId')?.setValue(this.perfil.iCredEntPerfId);

    this.encuesta = data;
  }

  verPreguntas() {
    this.router.navigate([
      '/encuestas/categorias/' + this.iCateId + '/gestion-encuestas/' + this.iEncuId + '/preguntas',
    ]);
  }

  guardarEncuesta() {
    this.formEncuesta.get('iYAcadId')?.setValue(this.iYAcadId);
    this.formEncuesta.get('iCredEntPerfId')?.setValue(this.perfil.iCredEntPerfId);

    if (this.formEncuesta.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe llenar todos los campos de la primera sección: Información General',
      });
      return;
    }

    if (this.poblacion.length == 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe especificar al menos una población objetivo',
      });
      return;
    }

    this.encuestasService.formControlJsonStringify(
      this.formEncuesta,
      'jsonPoblacion',
      'poblacion',
      ''
    );
    this.encuestasService.formControlJsonStringify(this.formEncuesta, 'jsonAccesos', 'accesos', '');
    this.encuestasService.guardarEncuesta(this.formEncuesta.value).subscribe({
      next: (data: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: 'Se registraron los datos',
        });
        const iEncuId = data.data.iEncuId;
        this.router.navigate([
          `/encuestas/categorias/${this.iCateId}/gestion-encuestas/${iEncuId}/preguntas`,
        ]);
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

  actualizarEncuesta() {
    this.formEncuesta.get('iYAcadId')?.setValue(this.iYAcadId);
    this.formEncuesta.get('iCredEntPerfId')?.setValue(this.perfil.iCredEntPerfId);

    if (this.formEncuesta.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe llenar todos los campos de la primera sección: Información General',
      });
      return;
    }

    if (this.poblacion.length == 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe especificar al menos una población objetivo',
      });
      return;
    }

    this.encuestasService.formControlJsonStringify(
      this.formEncuesta,
      'jsonPoblacion',
      'poblacion',
      ''
    );
    this.encuestasService.formControlJsonStringify(this.formEncuesta, 'jsonAccesos', 'accesos', '');
    this.encuestasService.actualizarEncuesta(this.formEncuesta.getRawValue()).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: 'Se registraron los datos',
        });
        this.router.navigate([
          `/encuestas/categorias/${this.iCateId}/gestion-encuestas/${this.iEncuId}/preguntas`,
        ]);
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

  agregarPoblacion(item: any = null) {
    if (item) {
      this.formPoblacion.patchValue(item);
    }
    if (this.formPoblacion.value.iPerfilId === null) {
      this.encuestasService.formMarkAsDirty(this.formPoblacion);
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe indicar los participantes de la encuesta',
      });
      return;
    }
    const duplicados = this.poblacion.filter(
      (item: any) =>
        Number(item.iNivelTipoId) === Number(this.formPoblacion.value.iNivelTipoId) &&
        Number(item.iPerfilId) === Number(this.formPoblacion.value.iPerfilId) &&
        Number(item.iCursoId) === Number(this.formPoblacion.value.iCursoId) &&
        Number(item.iTipoSectorId) === this.formPoblacion.value.iTipoSectorId &&
        Number(item.iZonaId) === Number(this.formPoblacion.value.iZonaId) &&
        Number(item.iUgelId) === Number(this.formPoblacion.value.iUgelId) &&
        Number(item.iDsttId) === Number(this.formPoblacion.value.iDsttId) &&
        Number(item.iIieeId) === Number(this.formPoblacion.value.iIieeId) &&
        Number(item.iNivelGradoId) === Number(this.formPoblacion.value.iNivelGradoId) &&
        Number(item.iSeccionId) === Number(this.formPoblacion.value.iSeccionId) &&
        Number(item.cPersSexo) === Number(this.formPoblacion.value.cPersSexo)
    );
    if (duplicados.length) {
      this.encuestasService.formMarkAsDirty(this.formPoblacion);
      this.messageService.add({
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
    if (this.es_director && this.nivel_tipos && this.ies) {
      this.formPoblacion.get('iNivelTipoId')?.setValue(this.nivel_tipos[0]['value']);
      this.formPoblacion.get('iIieeId')?.setValue(this.ies[0]['value']);
    }

    this.obtenerPoblacionObjetivo();
  }

  agregarAcceso(item: any = null) {
    if (item) {
      this.formAccesos.patchValue(item);
    }
    if (this.formAccesos.value.iPerfilId === null || this.formAccesos.value.iPermId === null) {
      this.encuestasService.formMarkAsDirty(this.formAccesos);
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'No puede agregar un acceso en blanco',
      });
      return;
    }
    const duplicados = this.accesos.filter(
      (acceso: any) =>
        acceso.iPerfilId === this.formAccesos.value.iPerfilId &&
        acceso.iPermId === this.formAccesos.value.iPermId
    );
    if (duplicados.length) {
      this.encuestasService.formMarkAsDirty(this.formAccesos);
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Ya existe un acceso con ese perfil y permiso',
      });
      return;
    }
    this.actualizarAccesos(this.formAccesos.value);
    const form: Array<object> = this.formAccesos.value;
    this.accesos = [...this.accesos, form];
    this.formEncuesta.get('accesos')?.setValue(this.accesos);
    this.formAccesos.reset();
  }

  obtenerPoblacionObjetivo() {
    this.encuestasService.formControlJsonStringify(
      this.formEncuesta,
      'jsonPoblacion',
      'poblacion',
      ''
    );

    this.encuestasService
      .obtenerPoblacionObjetivo({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iYAcadId: this.iYAcadId,
        jsonPoblacion: this.formEncuesta.get('jsonPoblacion')?.value,
      })
      .subscribe({
        next: (data: any) => {
          if (data.data) {
            this.cantidad_poblacion = data.data.iPoblacionObjetivo;
          } else {
            this.cantidad_poblacion = 0;
          }
        },
        error: error => {
          console.error('Error obteniendo cantidad poblacion:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  actualizarPoblacion(item: any) {
    const nivel_tipo: any = this.nivel_tipos
      ? this.nivel_tipos.find((nivel: any) => nivel.value == item.iNivelTipoId)
      : null;
    const participante: any = this.participantes
      ? this.participantes.find((participante: any) => participante.value == item.iPerfilId)
      : null;
    const area: any = this.areas
      ? this.areas.find((area: any) => area.value == item.iCursoId)
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
      participante?.label,
      nivel_tipo?.label,
      tipo_sector?.label,
      tipo_zona?.label,
      ugel ? 'UGEL ' + ugel.label : null,
      distrito ? 'DISTRITO ' + distrito.label : null,
      ie?.label,
      nivel_grado?.label,
      area?.label,
      seccion ? 'SECCIÓN ' + seccion.label : null,
      sexo ? 'GENERO ' + sexo.label : null,
    ];
    poblacion = poblacion.filter((item: any) => item != null);
    this.formPoblacion.get('poblacion')?.setValue(poblacion.join(', '));
    this.formEncuesta.get('poblacion')?.setValue(poblacion);
    this.formPoblacion.get('iPobId')?.setValue(item.iPobId ?? new Date().getTime());
  }

  actualizarAccesos(item: any) {
    const perfil: any = this.perfiles.find((perfil: any) => perfil.value == item.iPerfilId);
    const permiso: any = this.permisos.find((permiso: any) => permiso.value == item.iPermId);
    this.formAccesos.get('cPerfilNombre')?.setValue(perfil ? perfil.label : '');
    this.formAccesos.get('cPermNombre')?.setValue(permiso ? permiso.label : '');
    this.formAccesos.get('iAcceId')?.setValue(item.iAcceId ?? new Date().getTime());
  }

  salir() {
    this.router.navigate(['/encuestas/categorias/']);
  }

  accionBtnItemTablePoblacion({ accion, item }) {
    if (accion == 'eliminar') {
      this.poblacion = this.poblacion.filter((poblacion: any) => item.iPobId != poblacion.iPobId);
      this.formEncuesta.get('poblacion')?.setValue(this.poblacion);
      this.obtenerPoblacionObjetivo();
    }
  }

  accionBtnItemTableAccesos({ accion, item }) {
    if (accion == 'eliminar') {
      this.accesos = this.accesos.filter((acceso: any) => item.iAcceId != acceso.iAcceId);
      this.formEncuesta.get('accesos')?.setValue(this.accesos);
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

  actions_accesos: IActionTable[] = [
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

    this.columns_accesos = [
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
        field: 'cPermNombre',
        header: 'Permiso',
        text_header: 'left',
        text: 'left',
      },
    ];

    if (!this.encuesta || Number(this.encuesta?.iEstado) === this.ESTADO_BORRADOR) {
      this.columns_accesos.push({
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
