import { PrimengModule } from '@/app/primeng.module';
import {
  IActionTable,
  IColumn,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { EncuestasService } from '../services/encuestas.services';
import { SlicePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OverlayPanel } from 'primeng/overlaypanel';
import {
  ADMINISTRADOR_DREMO,
  APODERADO,
  DIRECTOR_IE,
  DOCENTE,
  ESPECIALISTA_DREMO,
  ESPECIALISTA_UGEL,
} from '@/app/servicios/seg/perfiles';
import { ESTUDIANTE } from '@/app/servicios/perfilesConstantes';

@Component({
  selector: 'app-respuestas-encuesta',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent],
  templateUrl: './respuestas-encuesta.component.html',
  styleUrl: './respuestas-encuesta.component.scss',
  providers: [SlicePipe],
})
export class RespuestasEncuestaComponent implements OnInit {
  @ViewChild('filtro') filtro: ElementRef;
  @ViewChild('filtros') filtros: OverlayPanel;
  @ViewChild('overlayAnchor') overlayAnchorRef: ElementRef;

  iEncuId: number;
  cEncuNombre: string;
  encuesta: any;
  iCateId: number;

  es_especialista: boolean = false;
  es_especialista_ugel: boolean = false;

  perfil: any;
  iYAcadId: number;
  respuestas: Array<object>;
  respuestas_filtradas: Array<object>;

  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;

  formFiltros: FormGroup;
  nivel_tipos: Array<object>;
  nivel_grados: Array<object>;
  tipo_sectores: Array<object>;
  zonas: Array<object>;
  ugeles: Array<object>;
  distritos: Array<object>;
  ies: Array<object>;
  secciones: Array<object>;
  sexos: Array<object>;
  participantes: Array<object>;
  areas: Array<object>;
  filtros_aplicados: number = 0;

  USUARIO_ENCUESTADO: number = this.encuestasService.USUARIO_ENCUESTADO;

  ocultar_nivel: boolean = false;
  ocultar_gestion: boolean = false;
  ocultar_zona: boolean = false;
  ocultar_ugel: boolean = false;
  ocultar_distrito: boolean = false;
  ocultar_ie: boolean = false;
  ocultar_grado: boolean = false;
  ocultar_seccion: boolean = false;
  ocultar_area: boolean = false;

  constructor(
    private encuestasService: EncuestasService,
    private store: LocalStoreService,
    private route: ActivatedRoute,
    private router: Router,
    private slicePipe: SlicePipe,
    private _messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.perfil = this.store.getItem('dremoPerfil');
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.es_especialista = [ESPECIALISTA_DREMO, ESPECIALISTA_UGEL, ADMINISTRADOR_DREMO].includes(
      Number(this.perfil.iPerfilId)
    );
    this.es_especialista_ugel = ESPECIALISTA_UGEL === Number(this.perfil.iPerfilId);
    this.route.paramMap.subscribe((params: any) => {
      this.iEncuId = params.params.iEncuId || 0;
      this.iCateId = params.params.iCateId || 0;
    });
    this.setBreadCrumbs();
    console.log(this.es_especialista, 'es_especialista');
  }

  ngOnInit(): void {
    try {
      this.formFiltros = this.fb.group({
        iNivelTipoId: [null],
        iTipoSectorId: [null],
        iZonaId: [null],
        iUgelId: [null],
        iDsttId: [null],
        iIieeId: [null],
        iNivelGradoId: [null],
        iSeccionId: [null],
        cPersSexo: [null],
        iPerfilId: [null],
        iCursoId: [null],
      });

      this.encuestasService
        .crearEncuesta({
          iCredEntPerfId: this.perfil.iCredEntPerfId,
        })
        .subscribe((data: any) => {
          this.distritos = this.encuestasService.getDistritos(data?.distritos);
          this.secciones = this.encuestasService.getSecciones(data?.secciones);
          this.zonas = this.encuestasService.getZonas(data?.zonas);
          this.tipo_sectores = this.encuestasService.getTipoSectores(data?.tipo_sectores);
          this.ugeles = this.encuestasService.getUgeles(data?.ugeles);
          this.nivel_tipos = this.encuestasService.getNivelesTipos(data?.nivel_tipos);
          this.ies = this.encuestasService.getInstitucionesEducativas(
            data?.instituciones_educativas
          );
          this.distritos = this.encuestasService.getDistritos(data?.distritos);
          this.sexos = this.encuestasService.getSexos();
          this.encuestasService.getNivelesGrados(data?.nivel_grados);
          this.participantes = this.encuestasService.getParticipantes(
            data?.participantes,
            Number(this.perfil.iPerfilId)
          );
          this.areas = this.encuestasService.getAreas(data?.areas);
          if (this.nivel_tipos && this.nivel_tipos.length == 1) {
            const nivel_tipo = this.nivel_tipos[0]['value'];
            this.formFiltros.get('iNivelTipoId')?.setValue(nivel_tipo);
            this.filterNivelesGrados(nivel_tipo);
            this.filterInstitucionesEducativas();
          }
          if (this.ugeles && this.ugeles.length === 1) {
            this.formFiltros.get('iUgelId')?.setValue(this.ugeles[0]['value']);
            this.filterInstitucionesEducativas();
          }
        });
    } catch (error) {
      console.error('Error obteniendo parametros:', error);
    }

    this.formFiltros.get('iNivelTipoId').valueChanges.subscribe(value => {
      this.formFiltros.get('iNivelGradoId')?.setValue(null);
      this.nivel_grados = null;
      this.filterNivelesGrados(value);
      this.formFiltros.get('iIieeId')?.setValue(null);
      this.filterInstitucionesEducativas();
    });
    this.formFiltros.get('iDsttId').valueChanges.subscribe(() => {
      this.formFiltros.get('iIieeId')?.setValue(null);
      this.filterInstitucionesEducativas();
    });
    this.formFiltros.get('iZonaId').valueChanges.subscribe(() => {
      this.formFiltros.get('iIieeId')?.setValue(null);
      this.filterInstitucionesEducativas();
    });
    this.formFiltros.get('iTipoSectorId').valueChanges.subscribe(() => {
      this.formFiltros.get('iIieeId')?.setValue(null);
      this.filterInstitucionesEducativas();
    });
    this.formFiltros.get('iUgelId').valueChanges.subscribe(value => {
      this.formFiltros.get('iDsttId')?.setValue(null);
      this.formFiltros.get('iIieeId')?.setValue(null);
      this.distritos = null;
      this.filterInstitucionesEducativas();
      this.filterDistritos(value);
    });

    this.formFiltros.get('iPerfilId').valueChanges.subscribe(value => {
      switch (value) {
        case ESPECIALISTA_DREMO:
          this.ocultar_nivel = false;
          this.ocultar_gestion = true;
          this.ocultar_zona = true;
          this.ocultar_ugel = true;
          this.ocultar_distrito = true;
          this.ocultar_ie = true;
          this.ocultar_grado = false;
          this.ocultar_seccion = false;
          this.ocultar_area = false;
          break;
        case ESPECIALISTA_UGEL:
          this.ocultar_nivel = false;
          this.ocultar_gestion = true;
          this.ocultar_zona = true;
          this.ocultar_ugel = false;
          this.ocultar_distrito = true;
          this.ocultar_ie = true;
          this.ocultar_grado = false;
          this.ocultar_seccion = false;
          this.ocultar_area = false;
          break;
        case DIRECTOR_IE:
          this.ocultar_nivel = false;
          this.ocultar_gestion = false;
          this.ocultar_zona = false;
          this.ocultar_ugel = false;
          this.ocultar_distrito = false;
          this.ocultar_ie = false;
          this.ocultar_grado = true;
          this.ocultar_seccion = true;
          this.ocultar_area = true;
          break;
        case DOCENTE:
          this.ocultar_nivel = false;
          this.ocultar_gestion = false;
          this.ocultar_zona = false;
          this.ocultar_ugel = false;
          this.ocultar_distrito = false;
          this.ocultar_ie = false;
          this.ocultar_grado = false;
          this.ocultar_seccion = false;
          this.ocultar_area = false;
          break;
        case APODERADO:
        case ESTUDIANTE:
          this.ocultar_nivel = false;
          this.ocultar_gestion = false;
          this.ocultar_zona = false;
          this.ocultar_ugel = false;
          this.ocultar_distrito = false;
          this.ocultar_ie = false;
          this.ocultar_grado = false;
          this.ocultar_seccion = false;
          this.ocultar_area = true;
          break;
        default:
          this.ocultar_nivel = false;
          this.ocultar_gestion = false;
          this.ocultar_zona = false;
          this.ocultar_ugel = false;
          this.ocultar_distrito = false;
          this.ocultar_ie = false;
          this.ocultar_grado = false;
          this.ocultar_seccion = false;
          this.ocultar_area = false;
          break;
      }
    });

    if (this.iEncuId) {
      this.verEncuesta();
      this.filtrarRespuestasFormulario();
    }
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
    this.ies = null;
    const iNivelTipoId = this.formFiltros.get('iNivelTipoId')?.value;
    const iDsttId = this.formFiltros.get('iDsttId')?.value;
    const iZonaId = this.formFiltros.get('iZonaId')?.value;
    const iTipoSectorId = this.formFiltros.get('iTipoSectorId')?.value;
    const iUgelId = this.formFiltros.get('iUgelId')?.value;
    this.ies = this.encuestasService.filterInstitucionesEducativas(
      iNivelTipoId,
      iDsttId,
      iZonaId,
      iTipoSectorId,
      iUgelId
    );
    if (this.ies && this.ies.length === 1) {
      this.formFiltros.get('iIieeId')?.setValue(this.ies[0]['value']);
    }
  }

  setBreadCrumbs() {
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
    this.breadCrumbItems = [
      { label: 'Encuestas' },
      { label: 'Categorias', routerLink: `/encuestas/categorias` },
      {
        label: this.encuesta?.cCateNombre
          ? String(this.slicePipe.transform(this.encuesta?.cCateNombre, 0, 20))
          : 'Categoría',
      },
      {
        label: 'Gestionar encuestas',
        routerLink: `/encuestas/categorias/${this.iCateId}/gestion-encuestas`,
      },
      {
        label: this.encuesta?.cEncuNombre
          ? String(this.slicePipe.transform(this.encuesta?.cEncuNombre, 0, 20))
          : 'Encuesta',
      },
      { label: 'Gestionar respuestas' },
    ];
  }

  verEncuesta() {
    this.encuestasService
      .verEncuesta({
        iEncuId: this.iEncuId,
        iTipoUsuario: this.USUARIO_ENCUESTADO,
      })
      .subscribe({
        next: (data: any) => {
          if (data.data) {
            this.encuesta = data.data;
            this.cEncuNombre = this.encuesta.cEncuNombre;
            this.setBreadCrumbs();
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

  listarRespuestas() {
    this.encuestasService
      .listarRespuestas({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iEncuId: this.iEncuId,
        iYAcadId: this.iYAcadId,
      })
      .subscribe({
        next: (data: any) => {
          if (data.data.length) {
            this.respuestas = data.data;
            this.respuestas_filtradas = this.respuestas;
          }
        },
        error: error => {
          console.error('Error obteniendo respuestas:', error);
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  filtrarRespuestas() {
    const filtro = this.filtro.nativeElement.value;
    if (!this.respuestas || this.respuestas.length === 0) return;
    this.respuestas_filtradas = this.respuestas.filter((respuesta: any) => {
      if (
        respuesta.cPersNombreApellidos &&
        respuesta.cPersNombreApellidos.toLowerCase().includes(filtro.toLowerCase())
      )
        return respuesta;
      if (
        respuesta.cGradoNombre &&
        respuesta.cGradoNombre.toLowerCase().includes(filtro.toLowerCase())
      )
        return respuesta;
      if (
        respuesta.cSeccionNombre &&
        respuesta.cSeccionNombre.toLowerCase().includes(filtro.toLowerCase())
      )
        return respuesta;
      if (
        respuesta.cIieeCodigoModular &&
        respuesta.cIieeCodigoModular.toLowerCase().includes(filtro.toLowerCase())
      )
        return respuesta;
      if (
        respuesta.cIieeNombre &&
        respuesta.cIieeNombre.toLowerCase().includes(filtro.toLowerCase())
      )
        return respuesta;
      return null;
    });
  }

  filtrarRespuestasFormulario() {
    this.encuestasService
      .listarRespuestas({
        iYAcadId: this.iYAcadId,
        iEncuId: this.iEncuId,
        iNivelTipoId: this.formFiltros.get('iNivelTipoId')?.value,
        iTipoSectorId: this.formFiltros.get('iTipoSectorId')?.value,
        iZonaId: this.formFiltros.get('iZonaId')?.value,
        iUgelId: this.formFiltros.get('iUgelId')?.value,
        iDsttId: this.formFiltros.get('iDsttId')?.value,
        iIieeId: this.formFiltros.get('iIieeId')?.value,
        iNivelGradoId: this.formFiltros.get('iNivelGradoId')?.value,
        iSeccionId: this.formFiltros.get('iSeccionId')?.value,
        cPersSexo: this.formFiltros.get('cPersSexo')?.value,
        iPerfilId: this.formFiltros.get('iPerfilId')?.value,
        iCursoId: this.formFiltros.get('iCursoId')?.value,
      })
      .subscribe({
        next: (data: any) => {
          this.contarFiltros();
          this.respuestas = data.data;
          this.respuestas_filtradas = this.respuestas;
          this.filtrarRespuestas();
          this.filtros.hide();
        },
        error: error => {
          this.contarFiltros();
          console.error('Error obteniendo respuestas:', error);
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  contarFiltros() {
    this.filtros_aplicados = Object.values(this.formFiltros.value).filter(
      (value: any) => value !== null && value !== ''
    ).length;
  }

  exportarExcel(iPersId: number = null) {
    this.encuestasService
      .imprimirRespuestas({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iEncuId: this.iEncuId,
        iPersId: iPersId,
        iNivelTipoId: this.formFiltros.get('iNivelTipoId')?.value,
        iTipoSectorId: this.formFiltros.get('iTipoSectorId')?.value,
        iZonaId: this.formFiltros.get('iZonaId')?.value,
        iUgelId: this.formFiltros.get('iUgelId')?.value,
        iDsttId: this.formFiltros.get('iDsttId')?.value,
        iIieeId: this.formFiltros.get('iIieeId')?.value,
        iNivelGradoId: this.formFiltros.get('iNivelGradoId')?.value,
        iSeccionId: this.formFiltros.get('iSeccionId')?.value,
        cPersSexo: this.formFiltros.get('cPersSexo')?.value,
        iPerfilId: this.formFiltros.get('iPerfilId')?.value,
        iCursoId: this.formFiltros.get('iCursoId')?.value,
      })
      .subscribe({
        next: (response: any) => {
          const blob = new Blob([response], {
            type: 'application/vnd.ms-excel',
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'RESPUESTAS-ENCUESTA.xlsx';
          link.target = '_blank';
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: error => {
          console.error('Error exportando respuestas:', error);
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  accionBnt({ accion, item }) {
    switch (accion) {
      case 'ver':
        this.router.navigate([
          `/encuestas/categorias/${this.iCateId}/gestion-encuestas/${this.iEncuId}/ver/${item.iPersId}`,
        ]);
        break;
      case 'exportar':
        this.exportarExcel(item.iPersId);
        break;
      default:
        console.warn('Acción no reconocida:', accion);
    }
  }

  public columnasTabla: IColumn[] = [
    {
      field: 'item',
      type: 'item',
      width: '5%',
      header: 'N°',
      text_header: 'center',
      text: 'center',
      class: 'hidden md:table-cell',
    },
    {
      field: 'perfiles',
      type: 'text',
      width: '15%',
      header: 'Tipo de Persona',
      text_header: 'left',
      text: 'left',
    },
    {
      field: 'cPersNombreApellidos',
      type: 'text',
      width: '45%',
      header: 'Nombres y Apellidos',
      text_header: 'left',
      text: 'left',
    },
    {
      field: 'cGradoNombre',
      type: 'text',
      width: '10%',
      header: 'Grado',
      text_header: 'center',
      text: 'center',
    },
    {
      field: 'cSeccionNombre',
      type: 'text',
      width: '10%',
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
      class: () => {
        if (this.es_especialista) {
          return 'hidden md:table-cell';
        }
        return 'hidden';
      },
    },
    {
      field: 'cIieeNombre',
      type: 'text',
      width: '15%',
      header: 'I.E. Nombre',
      text_header: 'center',
      text: 'center',
      class: () => {
        if (this.es_especialista) {
          return 'hidden md:table-cell';
        }
        return 'hidden';
      },
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

  public accionesTabla: IActionTable[] = [
    {
      labelTooltip: 'Ver respuesta',
      icon: 'pi pi-eye',
      accion: 'ver',
      type: 'item',
      class: 'p-button-rounded p-button-primary p-button-text',
    },
    {
      labelTooltip: 'Exportar',
      icon: 'pi pi-download',
      accion: 'exportar',
      type: 'item',
      class: 'p-button-rounded p-button-success p-button-text',
    },
  ];
}
