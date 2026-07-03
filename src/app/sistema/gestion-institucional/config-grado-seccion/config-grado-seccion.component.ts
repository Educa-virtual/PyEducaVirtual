import { MenuItem, MessageService } from 'primeng/api';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { AdmStepGradoSeccionService } from '@/app/servicios/adm/adm-step-grado-seccion.service';
import { PrimengModule } from '@/app/primeng.module';
import { TabMenu } from 'primeng/tabmenu';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-config-grado-seccion',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './config-grado-seccion.component.html',
  styleUrl: './config-grado-seccion.component.scss',
})
export class ConfigGradoSeccionComponent implements OnInit, AfterViewInit {
  @ViewChild('tabMenu', { static: false }) tabMenu: TabMenu;

  activeItem: any;
  previousItem: any;

  items: MenuItem[] = [
    {
      label: 'Configuración',
      icon: 'pi pi-fw pi-cog',
      route: '/',
    },
  ];

  iSedeId: number;
  iYAcadId: number;
  configuracion: any;
  iConfigId: number = 0;

  constructor(
    private store: LocalStoreService,
    private stepService: AdmStepGradoSeccionService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private cf: ChangeDetectorRef
  ) {
    const perfil = this.store.getItem('dremoPerfil');
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.iSedeId = perfil.iSedeId;
  }

  ngOnInit(): void {
    this.stepService
      .guardarConfiguracion({
        iYAcadId: this.iYAcadId,
        iSedeId: this.iSedeId,
      })
      .subscribe((data: any) => {
        this.iConfigId = data.data.iConfigId;
        this.items = [
          {
            label: 'Configuración',
            icon: 'pi pi-fw pi-cog',
            route: `/gestion-institucional/config/${this.iConfigId}/academico`,
          },
          {
            label: 'Ambientes',
            icon: 'pi pi-fw pi-home',
            route: `/gestion-institucional/config/${this.iConfigId}/ambiente`,
          },
          {
            label: 'Secciones',
            icon: 'pi pi-fw pi-user',
            route: `/gestion-institucional/config/${this.iConfigId}/seccion`,
          },
          {
            label: 'Currícula',
            icon: 'pi pi-fw pi-book',
            route: `/gestion-institucional/config/${this.iConfigId}/plan-estudio`,
          },
          {
            label: 'Docentes',
            icon: 'pi pi-fw pi-graduation-cap',
            route: `/gestion-institucional/config/${this.iConfigId}/hora-docente`,
          },
          {
            label: 'Asignaciones',
            icon: 'pi pi-fw pi-clipboard',
            route: `/gestion-institucional/config/${this.iConfigId}/asignar-grado`,
          },
        ];

        // Obtener la ruta actual del usuario
        const urlSegments = this.router.url.split('/');
        const currentSegment = urlSegments[urlSegments.length - 1];

        // Validar que el segment sea una ruta válida
        const validSegments = [
          'academico',
          'ambiente',
          'seccion',
          'plan-estudio',
          'hora-docente',
          'asignar-grado',
        ];
        const targetSegment = validSegments.includes(currentSegment) ? currentSegment : 'academico';

        // Navegar a la ruta actual o a academico como default
        this.router.navigate([`/gestion-institucional/config/${this.iConfigId}/${targetSegment}`]);
      });
  }

  crearConfiguracion() {
    this.stepService
      .crearConfiguracion({
        iYAcadId: this.iYAcadId,
        iSedeId: this.iSedeId,
      })
      .subscribe({
        next: (data: any) => {
          this.iConfigId = data.data.iConfigId;
        },
        error: error => {
          console.error('Error obteniendo datos:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  ngAfterViewInit() {
    this.stepService.getActiveIndex().subscribe(value => {
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
}
