import { MenuItem, MessageService } from 'primeng/api';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { YearService } from '../year.service';
import { PrimengModule } from '@/app/primeng.module';
import { TabMenu } from 'primeng/tabmenu';
import { Router, ActivatedRoute } from '@angular/router';
import { ADMINISTRADOR_DREMO } from '@/app/servicios/seg/perfiles';

@Component({
  selector: 'app-year-config',
  standalone: true,
  imports: [PrimengModule],
  providers: [MessageService],
  templateUrl: './year-config.component.html',
  styleUrl: './year-config.component.scss',
})
export class YearConfigComponent implements OnInit, AfterViewInit {
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

  year: any;
  perfil: any;
  iSedeId: number;
  iYAcadId: number;
  configuracion: any;
  iConfigId: number = 0;

  breadCrumbHome: MenuItem = { label: '', icon: 'pi pi-home' };
  breadCrumbItems: MenuItem[] = [];

  constructor(
    private store: LocalStoreService,
    private yearService: YearService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private cf: ChangeDetectorRef
  ) {
    this.perfil = this.store.getItem('dremoPerfil');
    this.iSedeId = this.perfil.iSedeId;
    this.route.paramMap.subscribe(params => {
      this.iYAcadId = params.get('iYAcadId') ? Number(params.get('iYAcadId')) : this.iYAcadId;
    });
  }

  ngOnInit(): void {
    this.verYear();
    this.items = [
      {
        label: 'Calendario',
        icon: 'pi pi-fw pi-calendar',
        route: `/gestion-institucional/years-academicos/${this.iYAcadId}/config/calendario`,
      },
      {
        label: 'Periodos',
        icon: 'pi pi-fw pi-cog',
        route: `/gestion-institucional/years-academicos/${this.iYAcadId}/config/periodos`,
      },
      {
        label: 'Turno y días',
        icon: 'pi pi-fw pi-clock',
        route: `/gestion-institucional/years-academicos/${this.iYAcadId}/config/dias`,
      },
    ];

    // Obtener la ruta actual del usuario
    const urlSegments = this.router.url.split('/');
    const currentSegment = urlSegments[urlSegments.length - 1];

    // Validar que el segment sea una ruta válida
    const validSegments = ['calendario', 'periodos', 'dias'];
    const targetSegment = validSegments.includes(currentSegment) ? currentSegment : 'calendario';

    // Navegar a la ruta actual o a calendario como default
    this.router.navigate([
      `/gestion-institucional/years-academicos/${this.iYAcadId}/config/${targetSegment}`,
    ]);
  }

  verYear() {
    this.yearService
      .verYear({
        iYAcadId: this.iYAcadId,
      })
      .subscribe({
        next: (data: any) => {
          this.year = data.data;
          this.setBreadCrumbItems();
        },
      });
  }

  setBreadCrumbItems() {
    this.breadCrumbItems = [
      {
        label: 'Años académicos',
        routerLink:
          Number(this.perfil.iPerfilId) == ADMINISTRADOR_DREMO
            ? '/gestion-institucional/years-academicos'
            : '',
      },
      { label: this.year?.cYearNombre },
      { label: 'Calendario académico' },
    ];
  }

  ngAfterViewInit() {
    this.yearService.getActiveIndex().subscribe(value => {
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
