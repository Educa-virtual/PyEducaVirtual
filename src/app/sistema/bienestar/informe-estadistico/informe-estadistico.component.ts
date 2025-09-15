import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { MenuItem, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatosInformeBienestarService } from '../services/datos-informe-bienestar.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { TabMenu } from 'primeng/tabmenu';
import {
  ADMINISTRADOR_DREMO,
  ESPECIALISTA_DREMO,
  ESPECIALISTA_UGEL,
} from '@/app/servicios/seg/perfiles';
import { Router } from '@angular/router';

@Component({
  selector: 'app-informe-estadistico',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './informe-estadistico.component.html',
  styleUrl: './../gestionar-encuestas/gestionar-encuestas.component.scss',
})
export class InformeEstadisticoComponent implements OnInit, AfterViewInit {
  @ViewChild('tabMenu', { static: false }) tabMenu: TabMenu;
  title: string = 'Informes y estadística';
  activeItem: any;

  perfil: any;
  iYAcadId: number;
  formReportes: FormGroup;
  cantidad_personas: number;
  cantidad_fichas: number;
  cantidad_personas_nombre: string = 'Estudiantes matriculados';

  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;

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
  tipos_personas: any;

  TIPO_PERSONA_ESTUDIANTE: number = 1;
  TIPO_PERSONA_DOCENTE: number = 2;
  TIPO_PERSONA_ADMINISTRATIVO: number = 3;

  es_estudiante_apoderado: boolean = false;
  ocultar_grado: boolean = false;
  ocultar_seccion: boolean = false;
  ocultar_area: boolean = true;

  perfiles_especialista: Array<number> = [
    ESPECIALISTA_DREMO,
    ESPECIALISTA_UGEL,
    ADMINISTRADOR_DREMO,
  ];
  es_especialista: boolean = false;
  es_especialista_ugel: boolean = false;

  private _messageService = inject(MessageService);

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private datosInformes: DatosInformeBienestarService,
    private store: LocalStoreService,
    private cf: ChangeDetectorRef
  ) {
    this.perfil = this.store.getItem('dremoPerfil');
    this.iYAcadId = this.store.getItem('dremoiYAcadId');

    this.es_especialista = this.perfiles_especialista.includes(Number(this.perfil.iPerfilId));
    this.es_especialista_ugel = Number(this.perfil.iPerfilId) == ESPECIALISTA_UGEL;

    this.breadCrumbItems = [
      {
        label: 'Bienestar Social',
      },
      {
        label: this.title,
      },
    ];
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
  }

  ngOnInit(): void {
    this.formReportes = this.fb.group({
      iCredEntPerfId: [this.perfil.iCredEntPerfId],
      iYAcadId: [this.iYAcadId],
      iTipoPersId: [this.TIPO_PERSONA_ESTUDIANTE],
      iCursoId: [null],
      iNivelTipoId: [null],
      iNivelGradoId: [null],
      iTipoSectorId: [null],
      iZonaId: [null],
      iUgelId: [null],
      iDsttId: [null],
      iIieeId: [null],
      iSeccionId: [null],
      cPersSexo: [null],
    });

    this.datosInformes
      .obtenerParametros({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iYAcadId: this.iYAcadId,
      })
      .subscribe((data: any) => {
        this.distritos = this.datosInformes.getDistritos(data?.distritos);
        this.secciones = this.datosInformes.getSecciones(data?.secciones);
        this.zonas = this.datosInformes.getZonas(data?.zonas);
        this.tipo_sectores = this.datosInformes.getTipoSectores(data?.tipo_sectores);
        this.ugeles = this.datosInformes.getUgeles(data?.ugeles);
        this.nivel_tipos = this.datosInformes.getNivelesTipos(data?.nivel_tipos);
        this.ies = this.datosInformes.getInstitucionesEducativas(data?.instituciones_educativas);
        this.distritos = this.datosInformes.getDistritos(data?.distritos);
        this.tipos_personas = this.datosInformes.getTiposPersonas(data?.tipos_personas);
        this.areas = this.datosInformes.getAreas(data?.areas);
        this.sexos = this.datosInformes.getSexos();
        this.datosInformes.getNivelesGrados(data?.nivel_grados);

        if (this.nivel_tipos && this.nivel_tipos.length === 1) {
          const nivel_tipo = this.nivel_tipos[0]['value'];
          this.formReportes.get('iNivelTipoId')?.setValue(nivel_tipo);
        }
        if (this.ugeles && this.ugeles.length === 1) {
          const ugel = this.ugeles[0]['value'];
          this.formReportes.get('iUgelId')?.setValue(ugel);
        }
        if (this.ies && this.ies.length === 1) {
          const ie = this.ies[0]['value'];
          this.formReportes.get('iIieeId')?.setValue(ie);
        }
        this.verReporte();
      });

    this.formReportes.get('iNivelTipoId').valueChanges.subscribe(value => {
      this.formReportes.get('iNivelGradoId')?.setValue(null);
      this.nivel_grados = null;
      this.filterNivelesGrados(value);

      this.formReportes.get('iIieeId')?.setValue(null);
      this.ies = null;
      this.filterInstitucionesEducativas();
    });
    this.formReportes.get('iDsttId').valueChanges.subscribe(() => {
      this.formReportes.get('iIieeId')?.setValue(null);
      this.ies = null;
      this.filterInstitucionesEducativas();
    });
    this.formReportes.get('iZonaId').valueChanges.subscribe(() => {
      this.formReportes.get('iIieeId')?.setValue(null);
      this.ies = null;
      this.filterInstitucionesEducativas();
    });
    this.formReportes.get('iTipoSectorId').valueChanges.subscribe(() => {
      this.formReportes.get('iIieeId')?.setValue(null);
      this.ies = null;
      this.filterInstitucionesEducativas();
    });
    this.formReportes.get('iUgelId').valueChanges.subscribe(value => {
      this.formReportes.get('iDsttId')?.setValue(null);
      this.formReportes.get('iIieeId')?.setValue(null);
      this.ies = null;
      this.distritos = null;
      this.filterInstitucionesEducativas();
      this.filterDistritos(value);
    });
    this.formReportes.get('iTipoPersId').valueChanges.subscribe(value => {
      this.ocultar_grado = false;
      this.ocultar_seccion = false;
      this.ocultar_area = false;
      if (value == this.TIPO_PERSONA_ADMINISTRATIVO) {
        this.ocultar_grado = true;
        this.ocultar_seccion = true;
        this.ocultar_area = true;
      }
      if (value == this.TIPO_PERSONA_ESTUDIANTE) {
        this.ocultar_area = true;
      }
    });
  }

  getCantidadPersonasNombre(iTipoPersId: number) {
    if (iTipoPersId == this.TIPO_PERSONA_ESTUDIANTE) {
      return 'Estudiantes matriculados';
    }
    if (iTipoPersId == this.TIPO_PERSONA_DOCENTE) {
      return 'Docentes registrados';
    }
    if (iTipoPersId == this.TIPO_PERSONA_ADMINISTRATIVO) {
      return 'Administrativos registrados';
    }
    return '';
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
    const iNivelTipoId = this.formReportes.get('iNivelTipoId')?.value;
    const iDsttId = this.formReportes.get('iDsttId')?.value;
    const iZonaId = this.formReportes.get('iZonaId')?.value;
    const iTipoSectorId = this.formReportes.get('iTipoSectorId')?.value;
    const iUgelId = this.formReportes.get('iUgelId')?.value;
    this.ies = this.datosInformes.filterInstitucionesEducativas(
      iNivelTipoId,
      iDsttId,
      iZonaId,
      iTipoSectorId,
      iUgelId
    );
  }

  verReporte() {
    const forzar_consulta = true;
    this.datosInformes.verReporte(this.formReportes.value, forzar_consulta).subscribe({
      next: data => {
        const reportes = data?.data;
        if (!reportes) {
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo obtener los datos',
          });
          return;
        }
        this.cantidad_personas_nombre = this.getCantidadPersonasNombre(
          this.formReportes.value.iTipoPersId
        );
        this.cantidad_personas = reportes?.cantidad_personas;
        this.cantidad_fichas = reportes?.cantidad_fichas;
        // this.router.navigate([`/bienestar/informe-estadistico/familia`])
      },
      error: error => {
        console.log(error);
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  ngAfterViewInit() {
    this.datosInformes.getActiveIndex().subscribe(value => {
      this.activeItem = value;
      this.cf.detectChanges();
    });
  }

  /**
   * Mover scrool a la pestaña seleccionada
   * @param event
   */
  scrollToActiveTab(activeIndex: any) {
    activeIndex = activeIndex || 0;
    if (this.tabMenu) {
      const navContainer = this.tabMenu.content.nativeElement.querySelector('.p-tabmenu-nav');
      const activeTabElement = navContainer.querySelector(
        `.p-tabmenuitem:nth-child(${activeIndex + 1})`
      );
      if (activeTabElement) {
        activeTabElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }

  tabItems = [
    {
      label: 'Familia',
      icon: 'pi pi-fw pi-users',
      route: '/bienestar/informe-estadistico/familia',
    },
    {
      label: 'Económico',
      icon: 'pi pi-fw pi-wallet',
      route: '/bienestar/informe-estadistico/economico',
    },
    {
      label: 'Vivienda',
      icon: 'pi pi-fw pi-home',
      route: '/bienestar/informe-estadistico/vivienda',
    },
    {
      label: 'Alimentación',
      icon: 'pi pi-fw pi-shopping-cart',
      route: '/bienestar/informe-estadistico/alimentacion',
    },
    {
      label: 'Discapacidad',
      icon: 'pi pi-fw pi-heart-fill',
      route: '/bienestar/informe-estadistico/discapacidad',
    },
    {
      label: 'Salud',
      icon: 'pi pi-fw pi-heart',
      route: '/bienestar/informe-estadistico/salud',
    },
    {
      label: 'Recreación',
      icon: 'pi pi-fw pi-image',
      route: '/bienestar/informe-estadistico/recreacion',
    },
    {
      label: 'Demográfico',
      icon: 'pi pi-fw pi-globe',
      route: '/bienestar/informe-estadistico/demografico',
    },
  ];
}
