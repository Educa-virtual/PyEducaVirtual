import { PrimengModule } from '@/app/primeng.module';
import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component';
import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { TabsPrimengComponent } from '@/app/shared/tabs-primeng/tabs-primeng.component';
import { CardCapacitacionesComponent } from './card-capacitaciones/card-capacitaciones.component';
import { AperturaCursoComponent } from '../apertura-curso/apertura-curso.component';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { PaginatorModule } from 'primeng/paginator';
import { DetalleInscripcionComponent } from './detalle-inscripcion/detalle-inscripcion.component';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { GeneralService } from '@/app/servicios/general.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoCapacitacionesService } from '@/app/servicios/cap/tipo-capacitaciones.service';
import { CapacitacionesService } from '@/app/servicios/cap/capacitaciones.service';
@Component({
  selector: 'app-solicitud-inscripcion',
  standalone: true,
  templateUrl: './solicitud-Inscripcion.component.html',
  styleUrls: ['./solicitud-Inscripcion.component.scss'],
  imports: [
    PrimengModule,
    ToolbarPrimengComponent,
    TabsPrimengComponent,
    CardCapacitacionesComponent,
    AperturaCursoComponent,
    PaginatorModule,
    DetalleInscripcionComponent,
  ],
})
export class SolicitudInscripcionComponent implements OnInit, AfterViewInit {
  private _ConstantesService = inject(ConstantesService);
  private GeneralService = inject(GeneralService);
  private _ActivatedRoute = inject(ActivatedRoute);
  private _Router = inject(Router);
  private _TipoCapacitacionesService = inject(TipoCapacitacionesService);
  private _CapacitacionesService = inject(CapacitacionesService);

  @ViewChild('gridContainer') gridContainer!: ElementRef;

  activeIndex: number = 1;
  cursoSeleccionado;
  detalleVisible = false;
  idSeleccionado!: string;
  tabs = [
    {
      title: 'Apertura de Curso',
      icon: 'pi pi-book',
      tab: 'contenido',
    },
    {
      title: 'Solicitud de Inscripción',
      icon: 'pi pi-home',
      tab: 'inicio',
    },
  ];

  updateTab(tab): void {
    this._Router.navigate([], {
      queryParams: { tab: tab },
      queryParamsHandling: 'merge',
    });
    this.activeIndex = tab;
  }

  data: any[] = [];
  capacitacionFiltrado: any[] = [];
  tipoCapacitacion: any[] = []; // Datos de tipo de capacitación
  tipoCapacitacionSearch: any[] = []; // Datos de tipo de capacitación para búsqueda
  iTipoCapId: any = 0;
  dropdownStyle: boolean = false;
  capacitaciones: any[] = []; // Datos de capacitaciones
  paginator = {
    first: 0,
    rows: 5,
    total: 2,
    rowsPerPage: [],
  };
  onPageChange(event: any): void {
    this.paginator.first = event.first;
    this.paginator.rows = event.rows;
    const start = event.first;
    const end = event.first + event.rows;
    this.data = this.capacitaciones?.slice(start, end);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.gridContainer) {
        this.calculateRows();
        window.addEventListener('resize', () => this.calculateRows());
      }
    }, 0);
  }

  ngOnInit() {
    this._ActivatedRoute.queryParams.subscribe(params => {
      if (params['tab'] !== undefined) {
        this.activeIndex = Number(params['tab']);
      }
    });

    this.obtenerCapacitaciones();
    this.obtenerTipoCapacitacion();
  }
  // obtener y listar las capacitaciones
  // obtener las capacitaciones
  obtenerCapacitaciones() {
    const iCredId = this._ConstantesService.iCredId;
    const params = {
      iCredId: iCredId,
    };
    this._CapacitacionesService.obtenerCapacitacion(params).subscribe((resp: any) => {
      this.data = resp.data;
      this.capacitaciones = [...this.data]; // cargar desde servicio o mock
      this.capacitacionFiltrado = [...this.data]; // Guardar una copia para filtrar
    });
  }

  // metodo para obtener tipo capacitación:
  obtenerTipoCapacitacion() {
    this._TipoCapacitacionesService.obtenerTipoCapacitacion().subscribe(data => {
      this.tipoCapacitacion = data;
      this.tipoCapacitacionSearch = [...this.tipoCapacitacion];
      this.tipoCapacitacionSearch.unshift({
        iTipoCapId: 0,
        cTipoCapNombre: 'Todos los tipos',
      });
    });
  }

  calculateRows(): void {
    const container = this.gridContainer.nativeElement as HTMLElement;
    const containerWidth = container.clientWidth;
    const containerHeight = window.innerHeight - container.getBoundingClientRect().top;

    const cardWidth = 250 + 32; // ancho tarjeta + gap (ajusta según tu CSS)
    const cardHeight = 300 + 32; // alto tarjeta + gap (ajusta también)

    const columns = Math.floor(containerWidth / cardWidth);
    const rows = Math.floor(containerHeight / cardHeight);

    const itemsPerPage = columns * rows || 1; // al menos 1

    this.paginator.rows = itemsPerPage;
    this.paginator.rowsPerPage = [itemsPerPage];
    this.onPageChange({ first: 0, rows: itemsPerPage });
  }

  onVerDetalle(id: any) {
    const seleccionado = this.tipoCapacitacion.find(t => t.iTipoCapId === id.iTipoCapId);
    if (seleccionado && id.cLink) {
      window.open(id.cLink, '_blank');
    } else {
      this.idSeleccionado = id;
      this.detalleVisible = true;
    }
  }

  volverALista() {
    this.detalleVisible = false;
    this.idSeleccionado = '';
  }

  filtrarCapacitaciones(event: DropdownChangeEvent) {
    const iTipoCapId = event.value;
    this.data = [...this.capacitacionFiltrado];
    if (!iTipoCapId || !this.data) return;
    if (iTipoCapId === '0') {
      this.data = [...this.capacitacionFiltrado]; // Mostrar todas las capacitaciones
    } else {
      this.data = this.capacitacionFiltrado.filter(
        (capacitacion: any) => capacitacion.iTipoCapId === iTipoCapId
      );
    }
  }
}
