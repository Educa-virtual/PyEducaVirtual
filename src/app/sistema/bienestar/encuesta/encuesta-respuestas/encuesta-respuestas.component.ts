import { PrimengModule } from '@/app/primeng.module';
import {
  IActionTable,
  IColumn,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { DatosEncuestaService } from '../../services/datos-encuesta.service';
import { FuncionesBienestarService } from '../../services/funciones-bienestar.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { ESPECIALISTA_DREMO, ESPECIALISTA_UGEL } from '@/app/servicios/perfilesConstantes';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-encuesta-respuestas',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent],
  templateUrl: './encuesta-respuestas.component.html',
  styleUrl: './../../gestionar-encuestas/gestionar-encuestas.component.scss',
})
export class EncuestaRespuestasComponent implements OnInit {
  @ViewChild('filtro') filtro: ElementRef;
  @ViewChild('filtros') filtros: OverlayPanel;
  @ViewChild('overlayAnchor') overlayAnchorRef: ElementRef;

  iEncuId: number;
  cEncuNombre: string;
  perfil: any;
  respuestas: Array<object>;
  respuestas_filtradas: Array<object>;
  es_especialista: boolean = false;

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
  filtros_aplicados: number = 0;

  private _messageService = inject(MessageService);
  private _confirmService = inject(ConfirmationModalService);

  constructor(
    private datosEncuestas: DatosEncuestaService,
    private funcionesBienestar: FuncionesBienestarService,
    private store: LocalStoreService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.perfil = this.store.getItem('dremoPerfil');
    this.es_especialista = [ESPECIALISTA_DREMO, ESPECIALISTA_UGEL].includes(this.perfil.iPerfilId);
    this.route.paramMap.subscribe((params: any) => {
      this.iEncuId = params.params.id || 0;
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
        routerLink: `/bienestar/encuesta/${this.iEncuId}`,
      },
      {
        label: 'Respuestas',
      },
    ];
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
  }

  ngOnInit(): void {
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
    });

    this.datosEncuestas
      .getEncuestaParametros({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
      })
      .subscribe((data: any) => {
        this.distritos = this.datosEncuestas.getDistritos(data?.distritos);
        this.secciones = this.datosEncuestas.getSecciones(data?.secciones);
        this.zonas = this.datosEncuestas.getZonas(data?.zonas);
        this.tipo_sectores = this.datosEncuestas.getTipoSectores(data?.tipo_sectores);
        this.ugeles = this.datosEncuestas.getUgeles(data?.ugeles);
        this.nivel_tipos = this.datosEncuestas.getNivelesTipos(data?.nivel_tipos);
        this.ies = this.datosEncuestas.getInstitucionesEducativas(data?.instituciones_educativas);
        this.distritos = this.datosEncuestas.getDistritos(data?.distritos);
        this.sexos = this.datosEncuestas.getSexos();
        this.datosEncuestas.getNivelesGrados(data?.nivel_grados);
        if (this.nivel_tipos && this.nivel_tipos.length == 1) {
          const nivel_tipo = this.nivel_tipos[0]['value'];
          this.formFiltros.get('iNivelTipoId')?.setValue(nivel_tipo);
          this.filterInstitucionesEducativas();
        }
      });

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

    if (this.iEncuId) {
      this.verEncuesta();
      this.filtrarRespuestasFormulario();
    }
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
    const iNivelTipoId = this.formFiltros.get('iNivelTipoId')?.value;
    const iDsttId = this.formFiltros.get('iDsttId')?.value;
    const iZonaId = this.formFiltros.get('iZonaId')?.value;
    const iTipoSectorId = this.formFiltros.get('iTipoSectorId')?.value;
    const iUgelId = this.formFiltros.get('iUgelId')?.value;
    this.ies = this.datosEncuestas.filterInstitucionesEducativas(
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

  verEncuesta() {
    this.datosEncuestas
      .verEncuesta({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iEncuId: this.iEncuId,
      })
      .subscribe({
        next: (data: any) => {
          if (data.data) {
            this.cEncuNombre = data.data.cEncuNombre;
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
    this.datosEncuestas
      .listarRespuestas({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iEncuId: this.iEncuId,
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
    this.respuestas_filtradas = this.respuestas.filter((respuesta: any) => {
      if (respuesta.cEstCodigo.toLowerCase().includes(filtro.toLowerCase())) return respuesta;
      if (respuesta.cPersNombreApellidos.toLowerCase().includes(filtro.toLowerCase()))
        return respuesta;
      if (respuesta.cGradoNombre.toLowerCase().includes(filtro.toLowerCase())) return respuesta;
      if (respuesta.cSeccionNombre.toLowerCase().includes(filtro.toLowerCase())) return respuesta;
      if (respuesta.cIieeCodigoModular.toLowerCase().includes(filtro.toLowerCase()))
        return respuesta;
      if (respuesta.cIieeNombre.toLowerCase().includes(filtro.toLowerCase())) return respuesta;
      return null;
    });
  }

  filtrarRespuestasFormulario() {
    this.datosEncuestas
      .listarRespuestas({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
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

  exportarExcel(iMatrId: number = null) {
    this.datosEncuestas
      .printRespuestas({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iEncuId: this.iEncuId,
        iMatrId: iMatrId,
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
        this.router.navigate([`/bienestar/encuesta/${this.iEncuId}/ver/${item.iMatrId}`]);
        break;
      case 'exportar':
        this.exportarExcel(item.iMatrId);
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
      field: 'cEstCodigo',
      type: 'text',
      width: '15%',
      header: 'Código',
      text_header: 'center',
      text: 'center',
    },
    {
      field: 'cPersNombreApellidos',
      type: 'text',
      width: '35%',
      header: 'Estudiante',
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
      width: '20%',
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
      width: '10%',
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
