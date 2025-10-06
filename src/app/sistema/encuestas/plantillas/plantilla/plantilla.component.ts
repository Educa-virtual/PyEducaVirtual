import { PrimengModule } from '@/app/primeng.module';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import {
  IColumn,
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { EncuestasService } from '../../services/encuestas.services';
import { SlicePipe } from '@angular/common';
import { DIRECTOR_IE, ESPECIALISTA_UGEL } from '@/app/servicios/seg/perfiles';

@Component({
  selector: 'app-plantilla',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent],
  templateUrl: './plantilla.component.html',
  styleUrl: './plantilla.component.scss',
  providers: [SlicePipe],
})
export class PlantillaComponent implements OnInit {
  categoria: any = null;
  plantilla: any = null;
  active: number = 0;
  iCateId: number;
  iPlanId: number;

  formPlantilla: FormGroup;
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
  es_especialista_ugel: boolean = false;

  puede_editar: boolean = true;
  plantilla_registrada: boolean = false;

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
    this.es_director = [DIRECTOR_IE].includes(Number(this.perfil.iPerfilId));
    this.es_especialista_ugel = [ESPECIALISTA_UGEL].includes(Number(this.perfil.iPerfilId));
    this.route.paramMap.subscribe((params: any) => {
      this.iCateId = params.params.iCateId || null;
      this.iPlanId = params.params.iPlanId || null;
    });
    console.log(this.es_director, 'es director');
    this.setBreadCrumbs();
  }

  ngOnInit() {
    try {
      this.formPlantilla = this.fb.group({
        iPlanId: [],
        cPlanNombre: ['', Validators.required],
        cPlanSubtitulo: [''],
        cPlanDescripcion: [''],
        iEstado: [this.ESTADO_BORRADOR],
        iCateId: [this.iCateId, Validators.required],
        bCompartirMismaIe: [0],
        bCompartirDirectores: [0],
        bCompartirEspUgel: [0],
        bCompartirEspDremo: [0],
        bCompartirMismaUgel: [0],
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
        this.participantes = this.encuestasService.getParticipantes(
          data?.participantes,
          Number(this.perfil.iPerfilId)
        );
        this.areas = this.encuestasService.getAreas(data?.areas);
        this.tiempos_duracion = this.encuestasService.getTiemposDuracion(data?.tiempos_duracion);
        this.permisos = this.encuestasService.getPermisos(data?.permisos);
        this.sexos = this.encuestasService.getSexos();
        this.estados = this.encuestasService.getEstados();
        this.encuestasService.getNivelesGrados(data?.nivel_grados);
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
        if (this.ies && this.ies.length === 1) {
          const ie = this.ies[0]['value'];
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

    if (this.iPlanId) {
      this.verPlantilla();
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
        label: 'Plantillas',
      },
      {
        label: 'Categorias',
        routerLink: `/plantillas/categorias`,
      },
      {
        label: this.categoria?.cCateNombre
          ? String(this.slicePipe.transform(this.categoria?.cCateNombre, 0, 20))
          : 'Categoría',
      },
      {
        label: 'Gestionar plantillas',
        routerLink: `/plantillas/categorias/${this.iCateId}/gestion-plantillas`,
      },
      {
        label: 'Nueva plantilla',
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

  verPlantilla() {
    this.encuestasService
      .verPlantilla({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iPlanId: this.iPlanId,
        iTipoUsuario: this.USUARIO_ENCUESTADOR,
      })
      .subscribe({
        next: (data: any) => {
          if (data.data) {
            this.plantilla = data.data;
            this.plantilla_registrada = true;
            this.setBreadCrumbs();
            this.setFormPlantilla(this.plantilla);
            this.inicializarColumnas();
          } else {
            this.router.navigate(['/plantillas/categorias/']);
          }
        },
        error: error => {
          console.error('Error obteniendo plantilla:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
          this.router.navigate(['/plantillas/categorias/']);
        },
      });
  }

  setFormPlantilla(data: any) {
    if (Number(data.iEstado) !== this.ESTADO_BORRADOR || Number(data.puede_editar) !== 1) {
      data.iEstado = this.ESTADO_APROBADA;
      this.formPlantilla.disable();
      this.puede_editar = false;
    }
    this.formPlantilla.reset();
    this.formPlantilla.patchValue(data);
    this.encuestasService.formatearFormControl(
      this.formPlantilla,
      'iTiemDurId',
      data.iTiemDurId,
      'number'
    );
    this.encuestasService.formatearFormControl(
      this.formPlantilla,
      'iCateId',
      data.iCateId,
      'number'
    );
    this.encuestasService.formatearFormControl(
      this.formPlantilla,
      'iEstado',
      data.iEstado,
      'number'
    );
    this.encuestasService.formatearFormControl(
      this.formPlantilla,
      'dPlanInicio',
      data.dPlanInicio,
      'date'
    );
    this.encuestasService.formatearFormControl(
      this.formPlantilla,
      'dPlanFin',
      data.dPlanFin,
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
    this.formPlantilla.get('iYAcadId')?.setValue(this.iYAcadId);
    this.formPlantilla.get('iCredEntPerfId')?.setValue(this.perfil.iCredEntPerfId);

    this.plantilla = data;
  }

  verPreguntas() {
    this.router.navigate([
      '/plantillas/categorias/' +
        this.iCateId +
        '/gestion-plantillas/' +
        this.iPlanId +
        '/preguntas',
    ]);
  }

  guardarPlantilla() {
    this.formPlantilla.get('iYAcadId')?.setValue(this.iYAcadId);
    this.formPlantilla.get('iCredEntPerfId')?.setValue(this.perfil.iCredEntPerfId);

    this.messageService.clear();
    if (this.formPlantilla.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe llenar todos los campos de la primera sección: Información General',
      });
      return;
    }

    if (this.formPlantilla.get('accesos').value.length == 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe especificar al menos un acceso',
      });
      return;
    }

    if (this.formPlantilla.get('poblacion').value.length == 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe especificar al menos una población objetivo',
      });
      return;
    }

    this.encuestasService.formControlJsonStringify(
      this.formPlantilla,
      'jsonPoblacion',
      'poblacion',
      ''
    );
    this.encuestasService.formControlJsonStringify(
      this.formPlantilla,
      'jsonAccesos',
      'accesos',
      ''
    );
    this.encuestasService.guardarPlantilla(this.formPlantilla.value).subscribe({
      next: (data: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: 'Se registraron los datos',
        });
        const iPlanId = data.data.iPlanId;
        this.router.navigate([
          `/plantillas/categorias/${this.iCateId}/gestion-plantillas/${iPlanId}/preguntas`,
        ]);
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

  actualizarPlantilla() {
    this.formPlantilla.get('iYAcadId')?.setValue(this.iYAcadId);
    this.formPlantilla.get('iCredEntPerfId')?.setValue(this.perfil.iCredEntPerfId);

    this.messageService.clear();
    if (this.formPlantilla.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe llenar todos los campos de la primera sección: Información General',
      });
      return;
    }

    if (this.formPlantilla.get('poblacion').value.length == 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe especificar al menos una población objetivo',
      });
      return;
    }

    if (this.formPlantilla.get('accesos').value.length == 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe especificar al menos un acceso',
      });
      return;
    }

    this.encuestasService.formControlJsonStringify(
      this.formPlantilla,
      'jsonPoblacion',
      'poblacion',
      ''
    );
    this.encuestasService.formControlJsonStringify(
      this.formPlantilla,
      'jsonAccesos',
      'accesos',
      ''
    );
    this.encuestasService.actualizarPlantilla(this.formPlantilla.getRawValue()).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: 'Se registraron los datos',
        });
        this.router.navigate([
          `/plantillas/categorias/${this.iCateId}/gestion-plantillas/${this.iPlanId}/preguntas`,
        ]);
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

  agregarPoblacion(item: any = null) {
    if (item) {
      this.formPoblacion.patchValue(item);
    }
    this.messageService.clear();
    if (this.formPoblacion.value.iPerfilId === null) {
      this.encuestasService.formMarkAsDirty(this.formPoblacion);
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe indicar los participantes de la plantilla',
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
    this.formPlantilla.get('poblacion')?.setValue(this.poblacion);
    this.formPoblacion.reset();
    if (this.es_director && this.nivel_tipos && this.ies) {
      this.formPoblacion.get('iNivelTipoId')?.setValue(this.nivel_tipos[0]['value']);
      this.formPoblacion.get('iIieeId')?.setValue(this.ies[0]['value']);
    }
  }

  agregarAcceso(item: any = null) {
    if (item) {
      this.formAccesos.patchValue(item);
    }
    this.messageService.clear();
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
    this.formPlantilla.get('accesos')?.setValue(this.accesos);
    this.formAccesos.reset();
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
    this.formPlantilla.get('poblacion')?.setValue(poblacion);
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
    this.router.navigate(['/plantillas/categorias/']);
  }

  accionBtnItemTablePoblacion({ accion, item }) {
    if (accion == 'eliminar') {
      this.poblacion = this.poblacion.filter((poblacion: any) => item.iPobId != poblacion.iPobId);
      this.formPlantilla.get('poblacion')?.setValue(this.poblacion);
    }
  }

  accionBtnItemTableAccesos({ accion, item }) {
    if (accion == 'eliminar') {
      this.accesos = this.accesos.filter((acceso: any) => item.iAcceId != acceso.iAcceId);
      this.formPlantilla.get('accesos')?.setValue(this.accesos);
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

    if (!this.plantilla || Number(this.plantilla?.iEstado) === this.ESTADO_BORRADOR) {
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

    if (!this.plantilla || Number(this.plantilla?.iEstado) === this.ESTADO_BORRADOR) {
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
