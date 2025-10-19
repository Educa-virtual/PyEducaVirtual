import { Component, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { MenuItem, MessageService } from 'primeng/api';
import { DIRECTOR_IE, ESPECIALISTA_UGEL, SUBDIRECTOR_IE } from '@/app/servicios/seg/perfiles';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  IActionTable,
  IColumn,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { SlicePipe } from '@angular/common';
import { ComunicadosService } from '../services/comunicados.services';

@Component({
  selector: 'app-comunicado',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent],
  templateUrl: './comunicado.component.html',
  styleUrl: './comunicado.component.scss',
  providers: [SlicePipe],
})
export class ComunicadoComponent implements OnInit {
  active: number = 0;
  comunicado: any = null;
  iComunicadoId: number;

  formComunicado: FormGroup;
  formGrupo: FormGroup;

  grupo: Array<object> = [];
  cantidad_grupo: any = 0;
  columns_grupo: IColumn[];

  perfil: any;
  iYAcadId: number;

  es_director: boolean = false;
  es_especialista_ugel: boolean = false;
  puede_editar: boolean = true;
  comunicado_registrado: boolean = false;

  breadCrumbHome: MenuItem;
  breadCrumbItems: MenuItem[];

  tipos_comunicados: Array<object>;
  prioridades: Array<object>;
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
  recipientes: Array<object>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private store: LocalStoreService,
    private comunicadosService: ComunicadosService,
    private messageService: MessageService
  ) {
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.perfil = this.store.getItem('dremoPerfil');
    this.es_director = [DIRECTOR_IE, SUBDIRECTOR_IE].includes(Number(this.perfil.iPerfilId));
    this.es_especialista_ugel = [ESPECIALISTA_UGEL].includes(Number(this.perfil.iPerfilId));
    this.route.paramMap.subscribe((params: any) => {
      this.iComunicadoId = params.params.iComunicadoId || null;
    });
    this.setBreadCrumbs();
  }

  ngOnInit() {
    try {
      this.formComunicado = this.fb.group({
        iComunicadoId: [0],
        iTipoComId: [null, Validators.required],
        iPrioridadId: [null, Validators.required],
        cComunicadoTitulo: ['', Validators.required],
        cComunicadoDescripcion: [''],
        dtComunicadoEmision: ['', Validators.required],
        dtComunicadoHasta: ['', Validators.required],
        iYAcadId: [this.store.getItem('dremoiYAcadId')],
        grupo: [null],
        jsonGrupo: [null],
      });

      this.formGrupo = this.fb.group({
        iGrupoId: [null],
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
        grupo: [''],
      });
    } catch (error) {
      console.error('Error al inicializar el formulario', error);
    }

    this.comunicadosService
      .crearComunicado({
        iYAcadId: this.iYAcadId,
      })
      .subscribe((data: any) => {
        this.tipos_comunicados = this.comunicadosService.getTiposComunicados(
          data?.tipos_comunicados
        );
        this.prioridades = this.comunicadosService.getPrioridades(data?.prioridades);
        this.distritos = this.comunicadosService.getDistritos(data?.distritos);
        this.zonas = this.comunicadosService.getZonas(data?.zonas);
        this.tipo_sectores = this.comunicadosService.getTipoSectores(data?.tipo_sectores);
        this.ugeles = this.comunicadosService.getUgeles(data?.ugeles);
        this.nivel_tipos = this.comunicadosService.getNivelesTipos(data?.nivel_tipos);
        this.ies = this.comunicadosService.getInstitucionesEducativas(
          data?.instituciones_educativas
        );
        this.distritos = this.comunicadosService.getDistritos(data?.distritos);
        this.recipientes = this.comunicadosService.getRecipientes(
          data?.recipientes,
          Number(this.perfil.iPerfilId)
        );
        this.areas = this.comunicadosService.getAreas(data?.areas);
        this.sexos = this.comunicadosService.getSexos();
        this.comunicadosService.getNivelesGrados(data?.nivel_grados);
        if (this.nivel_tipos && this.nivel_tipos.length == 1) {
          const nivel_tipo = this.nivel_tipos[0]['value'];
          this.formGrupo.get('iNivelTipoId')?.setValue(nivel_tipo);
          this.filterNivelesGrados(nivel_tipo);
          this.filterInstitucionesEducativas();
        }
        if (this.ugeles && this.ugeles.length === 1) {
          const ugel = this.ugeles[0]['value'];
          this.formGrupo.get('iUgelId')?.setValue(ugel);
          this.filterInstitucionesEducativas();
        }
        if (this.ies && this.ies.length === 1) {
          const ie = this.ies[0]['value'];
          this.formGrupo.get('iIieeId')?.setValue(ie);
        }
      });

    this.formGrupo.get('iNivelTipoId').valueChanges.subscribe(value => {
      this.formGrupo.get('iNivelGradoId')?.setValue(null);
      this.nivel_grados = null;
      this.filterNivelesGrados(value);

      this.formGrupo.get('iIieeId')?.setValue(null);
      this.ies = null;
      this.filterInstitucionesEducativas();
    });
    this.formGrupo.get('iDsttId').valueChanges.subscribe(() => {
      this.formGrupo.get('iIieeId')?.setValue(null);
      this.ies = null;
      this.filterInstitucionesEducativas();
    });
    this.formGrupo.get('iZonaId').valueChanges.subscribe(() => {
      this.formGrupo.get('iIieeId')?.setValue(null);
      this.ies = null;
      this.filterInstitucionesEducativas();
    });
    this.formGrupo.get('iTipoSectorId').valueChanges.subscribe(() => {
      this.formGrupo.get('iIieeId')?.setValue(null);
      this.ies = null;
      this.filterInstitucionesEducativas();
    });
    this.formGrupo.get('iUgelId').valueChanges.subscribe(value => {
      this.formGrupo.get('iDsttId')?.setValue(null);
      this.formGrupo.get('iIieeId')?.setValue(null);
      this.ies = null;
      this.distritos = null;
      this.filterInstitucionesEducativas();
      this.filterDistritos(value);
    });

    if (this.iComunicadoId) {
      this.verComunicado();
    }

    this.inicializarColumnas();
  }

  setBreadCrumbs() {
    this.breadCrumbItems = [
      {
        label: 'Comunicados',
      },
      {
        label: 'Gestionar comunicados',
        routerLink: `/comunicados/gestion-comunicados`,
      },
      {
        label: 'Nuevo comunicado',
      },
    ];
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
  }

  filterNivelesTipos() {
    this.nivel_tipos = this.comunicadosService.filterNivelesTipos();
  }

  filterNivelesGrados(iNivelTipoId: number) {
    this.nivel_grados = this.comunicadosService.filterNivelesGrados(iNivelTipoId);
  }

  filterDistritos(iUgelId: number) {
    this.distritos = this.comunicadosService.filterDistritos(iUgelId);
  }

  filterInstitucionesEducativas() {
    const iNivelTipoId = this.formGrupo.get('iNivelTipoId')?.value;
    const iDsttId = this.formGrupo.get('iDsttId')?.value;
    const iZonaId = this.formGrupo.get('iZonaId')?.value;
    const iTipoSectorId = this.formGrupo.get('iTipoSectorId')?.value;
    const iUgelId = this.formGrupo.get('iUgelId')?.value;
    this.ies = this.comunicadosService.filterInstitucionesEducativas(
      iNivelTipoId,
      iDsttId,
      iZonaId,
      iTipoSectorId,
      iUgelId
    );
  }

  handlePanelClick(onClick: any, active: number) {
    if (active === 0) {
      this.handleNextComunicadoGrupo(onClick);
    } else {
      onClick.emit();
    }
  }

  handleNextComunicadoGrupo(nextCallback: any) {
    this.messageService.clear();
    if (this.formComunicado.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe completar los campos requeridos',
      });
      this.comunicadosService.formMarkAsDirty(this.formComunicado);
      return;
    }
    nextCallback.emit();
  }

  verComunicado() {
    this.comunicadosService
      .verComunicado({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iComunicadoId: this.iComunicadoId,
      })
      .subscribe({
        next: (data: any) => {
          if (data.data) {
            this.comunicado = data.data;
            this.comunicado_registrado = true;
            this.setBreadCrumbs();
            this.setformComunicado(this.comunicado);
            this.inicializarColumnas();
          } else {
            this.router.navigate(['/comunicado/gestion-comunicados/']);
          }
        },
        error: error => {
          console.error('Error obteniendo comunicado:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
          this.router.navigate(['/comunicados/gestion-comunicados/']);
        },
      });
  }

  setformComunicado(data: any) {
    if (Number(data.puede_editar) !== 1) {
      this.formComunicado.disable();
      this.puede_editar = false;
    }
    this.formComunicado.reset();
    this.formComunicado.patchValue(data);
    this.comunicadosService.formatearFormControl(
      this.formComunicado,
      'iTipoComId',
      data.iTipoComId,
      'number'
    );
    this.comunicadosService.formatearFormControl(
      this.formComunicado,
      'iPrioridadId',
      data.iPrioridadId,
      'number'
    );
    this.comunicadosService.formatearFormControl(
      this.formComunicado,
      'dtComunicadoEmision',
      data.dtComunicadoEmision,
      'date'
    );
    this.comunicadosService.formatearFormControl(
      this.formComunicado,
      'dtComunicadoHasta',
      data.dtComunicadoHasta,
      'date'
    );

    const grupo = JSON.parse(data.grupo);
    if (grupo && grupo.length) {
      for (let i = 0; i < grupo.length; i++) {
        this.agregarGrupo(grupo[i]);
      }
    }
    this.formComunicado.get('iYAcadId')?.setValue(this.iYAcadId);

    this.comunicado = data;
  }

  guardarComunicado() {
    this.formComunicado.get('iYAcadId')?.setValue(this.iYAcadId);
    this.formComunicado.get('iCredEntPerfId')?.setValue(this.perfil.iCredEntPerfId);

    this.messageService.clear();
    if (this.formComunicado.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe llenar todos los campos de la primera sección: Información General',
      });
      return;
    }

    if (this.formComunicado.get('grupo').value.length == 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe especificar al menos una población objetivo',
      });
      return;
    }

    this.comunicadosService.formControlJsonStringify(this.formComunicado, 'jsonGrupo', 'grupo', '');
    this.comunicadosService.guardarComunicado(this.formComunicado.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: 'Se registraron los datos',
        });
        this.router.navigate([`/comunicado/gestion-comunicados`]);
      },
      error: error => {
        console.error('Error guardando comunicado:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  actualizarComunicado() {
    this.formComunicado.get('iYAcadId')?.setValue(this.iYAcadId);

    this.messageService.clear();
    if (this.formComunicado.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe llenar todos los campos de la primera sección: Información General',
      });
      return;
    }

    if (this.formComunicado.get('grupo').value.length == 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe especificar al menos un grupo o persona',
      });
      return;
    }

    this.comunicadosService.formControlJsonStringify(this.formComunicado, 'jsonGrupo', 'grupo', '');
    this.comunicadosService.actualizarComunicado(this.formComunicado.getRawValue()).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: 'Se registraron los datos',
        });
        this.router.navigate([`/comunicados/gestion-comunicados`]);
      },
      error: error => {
        console.error('Error guardando comunicado:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  agregarGrupo(item: any = null) {
    if (item) {
      this.formGrupo.patchValue(item);
    }
    this.messageService.clear();
    if (this.formGrupo.value.iPerfilId === null) {
      this.comunicadosService.formMarkAsDirty(this.formGrupo);
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe indicar los recipientes del comunicado',
      });
      return;
    }
    const duplicados = this.grupo.filter(
      (item: any) =>
        Number(item.iNivelTipoId) === Number(this.formGrupo.value.iNivelTipoId) &&
        Number(item.iPerfilId) === Number(this.formGrupo.value.iPerfilId) &&
        Number(item.iCursoId) === Number(this.formGrupo.value.iCursoId) &&
        Number(item.iTipoSectorId) === Number(this.formGrupo.value.iTipoSectorId) &&
        Number(item.iZonaId) === Number(this.formGrupo.value.iZonaId) &&
        Number(item.iUgelId) === Number(this.formGrupo.value.iUgelId) &&
        Number(item.iDsttId) === Number(this.formGrupo.value.iDsttId) &&
        Number(item.iIieeId) === Number(this.formGrupo.value.iIieeId) &&
        Number(item.iNivelGradoId) === Number(this.formGrupo.value.iNivelGradoId) &&
        Number(item.iSeccionId) === Number(this.formGrupo.value.iSeccionId) &&
        Number(item.cPersSexo) === Number(this.formGrupo.value.cPersSexo)
    );
    if (duplicados.length) {
      this.comunicadosService.formMarkAsDirty(this.formGrupo);
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Ya existe un registro con estos datos',
      });
      return;
    }
    this.actualizarGrupo(this.formGrupo.value);
    const form: Array<object> = this.formGrupo.value;
    this.grupo = [...this.grupo, form];
    this.formComunicado.get('grupo')?.setValue(this.grupo);
    this.formGrupo.reset();
    if (this.es_director && this.nivel_tipos && this.ies) {
      this.formGrupo.get('iNivelTipoId')?.setValue(this.nivel_tipos[0]['value']);
      this.formGrupo.get('iIieeId')?.setValue(this.ies[0]['value']);
    }

    this.obtenerGrupoCantidad(form);
  }

  obtenerGrupoCantidad(ultima_grupo: any = []) {
    this.comunicadosService.formControlJsonStringify(this.formComunicado, 'jsonGrupo', 'grupo', '');

    this.comunicadosService
      .obtenerGrupoCantidad({
        iYAcadId: this.iYAcadId,
        jsonGrupo: this.formComunicado.get('jsonGrupo')?.value,
      })
      .subscribe({
        next: (data: any) => {
          if (data.data) {
            /**
             * Si esta editando comunicado y el último grupo es cero,
             * entonces quitarlo y mostrar advertencia
             */
            if (
              this.puede_editar &&
              this.grupo.length > 0 &&
              Number(data.data.iGrupoObjetivo) === Number(this.cantidad_grupo)
            ) {
              this.grupo = this.grupo.filter(
                (grupo: any) => ultima_grupo.iGrupoId != grupo.iGrupoId
              );
              this.formComunicado.get('grupo')?.setValue(this.grupo);
              this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: `La población objetivo indicada (${ultima_grupo.grupo}) es cero, seleccione otra`,
              });
            }
            /** Luego cargar cantidad acumulada de población objetivo */
            this.cantidad_grupo = data.data.iGrupoObjetivo;
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo calcular la cantidad de población objetivo',
            });
            this.cantidad_grupo = 0;
          }
        },
        error: error => {
          console.error('Error obteniendo cantidad grupo:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  actualizarGrupo(item: any) {
    const nivel_tipo: any = this.nivel_tipos
      ? this.nivel_tipos.find((nivel: any) => nivel.value == item.iNivelTipoId)
      : null;
    const recipiente: any = this.recipientes
      ? this.recipientes.find((recipiente: any) => recipiente.value == item.iPerfilId)
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

    let grupo: any = [
      recipiente?.label,
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
    grupo = grupo.filter((item: any) => item != null);
    this.formGrupo.get('grupo')?.setValue(grupo.join(', '));
    this.formComunicado.get('grupo')?.setValue(grupo);
    this.formGrupo.get('iGrupoId')?.setValue(item.iGrupoId ?? new Date().getTime());
  }

  salir() {
    this.router.navigate(['/comunicados/gestion-comunicados/']);
  }

  accionBtnItemTableGrupo({ accion, item }) {
    if (accion == 'eliminar') {
      this.grupo = this.grupo.filter((grupo: any) => item.iGrupoId != grupo.iGrupoId);
      this.formComunicado.get('grupo')?.setValue(this.grupo);
      this.obtenerGrupoCantidad();
    }
  }

  actions_grupo: IActionTable[] = [
    {
      labelTooltip: 'Eliminar',
      icon: 'pi pi-trash',
      accion: 'eliminar',
      type: 'item',
      class: 'p-button-rounded p-button-danger p-button-text',
    },
  ];

  inicializarColumnas() {
    this.columns_grupo = [
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
        field: 'grupo',
        header: 'Población',
        text_header: 'left',
        text: 'left',
      },
    ];

    if (!this.comunicado) {
      this.columns_grupo.push({
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
