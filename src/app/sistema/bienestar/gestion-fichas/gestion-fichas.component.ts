import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { PrimengModule } from '@/app/primeng.module';
import { Router } from '@angular/router';
import {
  TablePrimengComponent,
  IColumn,
  IActionTable,
} from '@/app/shared/table-primeng/table-primeng.component';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { DatosFichaBienestarService } from '../services/datos-ficha-bienestar.service';
import { MenuItem, MessageService } from 'primeng/api';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { ESPECIALISTA_DREMO, ESPECIALISTA_UGEL } from '@/app/servicios/perfilesConstantes';
import { OverlayPanel } from 'primeng/overlaypanel';
import { DatosInformeBienestarService } from '../services/datos-informe-bienestar.service';

@Component({
  selector: 'app-gestion-fichas',
  standalone: true,
  imports: [
    TablePrimengComponent,
    ReactiveFormsModule,
    ButtonModule,
    PanelModule,
    InputTextModule,
    InputGroupModule,
    PrimengModule,
  ],
  templateUrl: './gestion-fichas.component.html',
  styleUrls: ['./../ficha/ficha.component.scss'],
})
export class GestionFichasComponent implements OnInit {
  @ViewChild('filtro') filtro: ElementRef;
  @ViewChild('filtros') filtros: OverlayPanel;
  @ViewChild('overlayAnchor') overlayAnchorRef: ElementRef;

  fichas: Array<object>;
  fichas_filtradas: Array<object>;
  form: FormGroup;
  iIieeId: number;

  perfil: any;
  iYAcadId: any;
  es_especialista: boolean = false;
  es_especialista_ugel: boolean = false;
  perfiles_especialista: Array<number> = [ESPECIALISTA_DREMO, ESPECIALISTA_UGEL];

  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;

  formFiltros: FormGroup;
  filtros_aplicados: number = 0;
  nivel_tipos: any;
  nivel_grados: any;
  areas: any;
  secciones: any;
  zonas: any;
  tipo_sectores: any;
  ugeles: any;
  ies: any;
  sexos: any;
  distritos: any;
  estados: any;
  tipos_personas: any;

  TIPO_PERSONA_ESTUDIANTE: number = 1;
  TIPO_PERSONA_DOCENTE: number = 2;
  TIPO_PERSONA_ADMINISTRATIVO: number = 3;

  ocultar_grado: boolean = false;
  ocultar_seccion: boolean = false;

  private _messageService = inject(MessageService);
  private _confirmService = inject(ConfirmationModalService);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private datosFicha: DatosFichaBienestarService,
    private datosInformes: DatosInformeBienestarService,
    private store: LocalStoreService
  ) {
    this.perfil = this.store.getItem('dremoPerfil');
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.es_especialista = this.perfiles_especialista.includes(Number(this.perfil.iPerfilId));
    this.es_especialista_ugel = Number(this.perfil.iPerfilId) == ESPECIALISTA_UGEL;
    this.breadCrumbItems = [
      {
        label: 'Bienestar social',
      },
      {
        label: 'Gestionar fichas socioeconómicas',
      },
    ];
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
  }

  ngOnInit(): void {
    if (this.es_especialista) {
      this.columnasTabla = this.columnasTablaEspecialista;
    }

    try {
      this.form = this.fb.group({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iYAcadId: this.store.getItem('dremoiYAcadId'),
      });
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
        iFichaEstado: [null],
        iTipoPersId: [this.TIPO_PERSONA_ESTUDIANTE],
      });
    } catch (error) {
      console.log(error, 'error de formulario');
    }

    this.datosInformes
      .obtenerParametros({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iYAcadId: this.iYAcadId,
      })
      .subscribe((data: any) => {
        this.secciones = this.datosInformes.getSecciones(data?.secciones);
        this.nivel_tipos = this.datosInformes.getNivelesTipos(data?.nivel_tipos);
        this.ies = this.datosInformes.getInstitucionesEducativas(data?.instituciones_educativas);
        this.tipos_personas = this.datosInformes.getTiposPersonas(data?.tipos_personas);
        this.sexos = this.datosInformes.getSexos();
        this.estados = this.datosInformes.getEstados();
        this.datosInformes.getNivelesGrados(data?.nivel_grados);
        if (this.nivel_tipos && this.nivel_tipos.length === 1) {
          const nivel_tipo = this.nivel_tipos[0]['value'];
          this.formFiltros.get('iNivelTipoId')?.setValue(nivel_tipo);
          this.filterNivelesGrados(nivel_tipo);
        }
        if (this.ies && this.ies.length === 1) {
          const ie = this.ies[0]['value'];
          this.formFiltros.get('iIieeId')?.setValue(ie);
        }
        this.listarFichas();
      });

    this.formFiltros.get('iTipoPersId').valueChanges.subscribe(value => {
      this.ocultar_grado = false;
      this.ocultar_seccion = false;
      if (value == this.TIPO_PERSONA_ADMINISTRATIVO) {
        this.ocultar_grado = true;
        this.ocultar_seccion = true;
      }
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
    this.ies = null;
    const iNivelTipoId = this.formFiltros.get('iNivelTipoId')?.value;
    const iDsttId = this.formFiltros.get('iDsttId')?.value;
    const iZonaId = this.formFiltros.get('iZonaId')?.value;
    const iTipoSectorId = this.formFiltros.get('iTipoSectorId')?.value;
    const iUgelId = this.formFiltros.get('iUgelId')?.value;
    this.ies = this.datosInformes.filterInstitucionesEducativas(
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

  listarFichas() {
    this.datosFicha
      .listarFichas({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iYAcadId: this.store.getItem('dremoiYAcadId'),
        iNivelTipoId: this.formFiltros.value.iNivelTipoId,
        iTipoSectorId: this.formFiltros.value.iTipoSectorId,
        iZonaId: this.formFiltros.value.iZonaId,
        iUgelId: this.formFiltros.value.iUgelId,
        iDsttId: this.formFiltros.value.iDsttId,
        iIieeId: this.formFiltros.value.iIieeId,
        iNivelGradoId: this.formFiltros.value.iNivelGradoId,
        iSeccionId: this.formFiltros.value.iSeccionId,
        cPersSexo: this.formFiltros.value.cPersSexo,
        iFichaEstado: this.formFiltros.value.iFichaEstado,
        iTipoPersId: this.formFiltros.value.iTipoPersId,
      })
      .subscribe({
        next: (data: any) => {
          this.contarFiltros();
          this.fichas = data.data;
          this.filtrarTabla();
        },
        error: error => {
          this.contarFiltros();
          console.error('Error al obtener los estudiantes', error);
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error,
          });
        },
      });
  }

  contarFiltros() {
    this.filtros_aplicados = Object.values(this.formFiltros.value).filter(
      (value: any) => value !== null && value !== ''
    ).length;
  }

  filtrarTabla() {
    const filtro = this.filtro.nativeElement.value.toLowerCase();
    this.fichas_filtradas = this.fichas.filter((ficha: any) => {
      if (ficha.cPersApellidos && ficha.cPersApellidos.toLowerCase().includes(filtro)) return ficha;
      if (ficha.cPersNombre && ficha.cPersNombre.toLowerCase().includes(filtro)) return ficha;
      if (ficha.cGradoNombre && ficha.cGradoNombre.toLowerCase().includes(filtro)) return ficha;
      if (ficha.cSeccionNombre && ficha.cSeccionNombre.toLowerCase().includes(filtro)) return ficha;
      if (ficha.cEstadoNombre && ficha.cEstadoNombre.toLowerCase().includes(filtro)) return ficha;
      if (ficha.cGradoSeccion && ficha.cGradoSeccion.toLowerCase().includes(filtro)) return ficha;
      if (ficha.cIieeNombre && ficha.cIieeNombre.toLowerCase().includes(filtro)) return ficha;
      if (ficha.cPersNombreApellidos && ficha.cPersNombreApellidos.toLowerCase().includes(filtro))
        return ficha;
      return null;
    });
  }

  nuevoIngreso(): void {
    this.router.navigate(['/bienestar/ficha/general']);
  }

  accionBnt({ accion, item }) {
    switch (accion) {
      case 'imprimir':
        this.descargarFicha(item);
        break;
      case 'eliminar':
        this._confirmService.openConfirm({
          message: '¿Está seguro de anular la ficha seleccionada?',
          header: 'Anular ficha',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.borrarFicha(item);
          },
        });
        break;
      default:
        console.warn('Acción no reconocida:', accion);
    }
  }

  descargarFicha(item: any): void {
    this.datosFicha
      .descargarFicha({
        iFichaDGId: item.iFichaDGId,
        iYAcadId: this.iYAcadId,
      })
      .subscribe({
        next: response => {
          // const url = window.URL.createObjectURL(blob)
          // window.open(url, '_blank')
          const blob = new Blob([response], {
            type: 'application/pdf',
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.target = '_blank';
          link.click();
          // window.URL.revokeObjectURL(url)
        },
        error: err => {
          console.error('Error al descargar el PDF:', err);
          alert('No se pudo generar el PDF');
        },
      });
  }

  borrarFicha(item: any): void {
    this.datosFicha
      .borrarFicha({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iFichaDGId: item.iFichaDGId,
      })
      .subscribe({
        next: () => {
          this._messageService.add({
            severity: 'success',
            summary: 'Eliminación exitosa',
            detail: 'Se eliminaron los datos',
          });
          this.fichas = this.fichas.filter((ficha: any) => ficha.iFichaDGId !== item.iFichaDGId);
          this.filtrarTabla();
        },
        error: error => {
          console.error('Error eliminando fichas:', error);
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  public columnasTabla: IColumn[] = [
    {
      field: 'item',
      header: 'N°',
      type: 'item',
      width: '5%',
      text_header: 'center',
      text: 'center',
      class: 'hidden md:table-cell',
    },
    {
      field: 'cPersNombre',
      header: 'Nombres',
      type: 'text',
      width: '25%',
      text_header: 'left',
      text: 'left',
      class: 'hidden md:table-cell',
    },
    {
      field: 'cPersApellidos',
      header: 'Apellidos',
      type: 'text',
      width: '30%',
      text_header: 'left',
      text: 'left',
      class: 'hidden md:table-cell',
    },
    {
      field: 'cPersNombreApellidos',
      header: 'Nombres y Apelidos',
      type: 'text',
      width: '60%',
      text_header: 'left',
      text: 'left',
      class: 'table-cell md:hidden',
    },
    {
      field: 'cGradoNombre',
      header: 'Grado',
      type: 'text',
      width: '10%',
      text_header: 'center',
      text: 'center',
      class: 'hidden md:table-cell',
    },
    {
      field: 'cSeccionNombre',
      header: 'Sección',
      type: 'text',
      width: '10%',
      text_header: 'center',
      text: 'center',
      class: 'hidden md:table-cell',
    },
    {
      field: 'cGradoSeccion',
      header: 'Sección',
      type: 'text',
      width: '20%',
      text_header: 'center',
      text: 'center',
      class: 'table-cell md:hidden',
    },
    {
      field: 'cEstadoNombre',
      header: 'Estado',
      type: 'text',
      width: '10%',
      text_header: 'center',
      text: 'center',
      class: 'hidden md:table-cell',
    },
    {
      type: 'actions',
      width: '10%',
      field: '',
      header: 'Acciones',
      text_header: 'right',
      text: 'right',
    },
  ];

  public columnasTablaEspecialista: IColumn[] = [
    {
      field: 'item',
      header: 'N°',
      type: 'item',
      width: '5%',
      text_header: 'center',
      text: 'center',
      class: 'hidden md:table-cell',
    },
    {
      field: 'cIieeNombre',
      header: 'I.E.',
      type: 'text',
      width: '20%',
      text_header: 'center',
      text: 'center',
    },
    {
      field: 'cPersNombre',
      header: 'Nombres',
      type: 'text',
      width: '20%',
      text_header: 'left',
      text: 'left',
      class: 'hidden md:table-cell',
    },
    {
      field: 'cPersApellidos',
      header: 'Apellidos',
      type: 'text',
      width: '20%',
      text_header: 'left',
      text: 'left',
      class: 'hidden md:table-cell',
    },
    {
      field: 'cPersNombreApellidos',
      header: 'Nombres y Apellidos',
      type: 'text',
      width: '55%',
      text_header: 'left',
      text: 'left',
      class: 'table-cell md:hidden',
    },
    {
      field: 'cGradoNombre',
      header: 'Grado',
      type: 'text',
      width: '10%',
      text_header: 'center',
      text: 'center',
      class: 'hidden md:table-cell',
    },
    {
      field: 'cSeccionNombre',
      header: 'Sección',
      type: 'text',
      width: '10%',
      text_header: 'center',
      text: 'center',
      class: 'hidden md:table-cell',
    },
    {
      field: 'cGradoSeccion',
      header: 'Sección',
      type: 'text',
      width: '20%',
      text_header: 'center',
      text: 'center',
      class: 'table-cell md:hidden',
    },
    {
      field: 'cEstadoNombre',
      header: 'Estado',
      type: 'text',
      width: '10%',
      text_header: 'center',
      text: 'center',
      class: 'hidden md:table-cell',
    },
    {
      type: 'actions',
      width: '5%',
      field: '',
      header: 'Acciones',
      text_header: 'right',
      text: 'right',
    },
  ];

  public accionesTabla: IActionTable[] = [
    {
      labelTooltip: 'Imprimir',
      icon: 'pi pi-print',
      accion: 'imprimir',
      type: 'item',
      class: 'p-button-rounded p-button-secondary p-button-text',
      isVisible(row) {
        return Number(row.iFichaEstado) === 1;
      },
    },
    {
      labelTooltip: 'Eliminar',
      icon: 'pi pi-trash',
      accion: 'eliminar',
      type: 'item',
      class: 'p-button-rounded p-button-primary p-button-text',
      isVisible(row) {
        return Number(row.iFichaEstado) === 1;
      },
    },
  ];
}
