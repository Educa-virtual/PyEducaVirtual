import { PrimengModule } from '@/app/primeng.module';
import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component';
import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { TabsPrimengComponent } from '@/app/shared/tabs-primeng/tabs-primeng.component';
import { CardCapacitacionesComponent } from './card-capacitaciones/card-capacitaciones.component';
import { AperturaCursoComponent } from '../apertura-curso/apertura-curso.component';
import { ApiAulaService } from '../../aula-virtual/services/api-aula.service';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { PaginatorModule } from 'primeng/paginator';
import { DetalleInscripcionComponent } from './detalle-inscripcion/detalle-inscripcion.component';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { GeneralService } from '@/app/servicios/general.service';
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
  private _aulaService = inject(ApiAulaService);
  private _ConstantesService = inject(ConstantesService);
  private GeneralService = inject(GeneralService);
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
    setTimeout(() => this.calculateRows(), 0); // Esperar renderizado
    window.addEventListener('resize', () => this.calculateRows());
  }

  ngOnInit() {
    this.obtenerCapacitaciones();
    this.obtenerTipoCapacitacion();
  }
  // obtener y listar las capacitaciones
  obtenerCapacitaciones() {
    const data = {
      petition: 'get',
      group: 'cap',
      prefix: 'capacitaciones',
      params: {
        iCredId: this._ConstantesService.iCredId, // Asignar el ID del crédito
      },
    };
    this.GeneralService.getGralPrefixx(data).subscribe({
      next: resp => {
        this.data = resp['data'];
        console.log('Capacitaciones:', this.data);
        this.capacitaciones = [...this.data]; // cargar desde servicio o mock
      },
      error: err => {
        console.error('Error al obtener capacitaciones:', err);
      },
    });
  }

  // metodo para obtener tipo capacitación:
  obtenerTipoCapacitacion() {
    const userId = 1;
    this._aulaService.obtenerTipoCapacitacion(userId).subscribe(Data => {
      this.tipoCapacitacion = Data['data'];
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
    // console.log('onVerDetalle', id)
    this.idSeleccionado = id;
    this.detalleVisible = true;
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
    // const fechasFiltradas = this.data.fechas
    //     .map((fecha: any) => {
    //         const actividadesFiltradas = fecha.actividades.filter(
    //             (actividad: any) =>
    //                 Number(actividad.iActTipoId) === iActTipoId
    //         )

    //         if (actividadesFiltradas.length > 0) {
    //             return {
    //                 ...fecha,
    //                 actividades: actividadesFiltradas,
    //             }
    //         }

    //         return null
    //     })
    //     .filter((fecha: any) => fecha !== null)

    // this.data.fechas = fechasFiltradas
  }
}
