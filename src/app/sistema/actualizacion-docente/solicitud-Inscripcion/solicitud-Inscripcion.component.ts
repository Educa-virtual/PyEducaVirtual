import { PrimengModule } from '@/app/primeng.module';
import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component';
import { Component, inject, OnInit } from '@angular/core';
import { CardCapacitacionesComponent } from './card-capacitaciones/card-capacitaciones.component';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { PaginatorModule } from 'primeng/paginator';
import { DetalleInscripcionComponent } from './detalle-inscripcion/detalle-inscripcion.component';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { TipoCapacitacionesService } from '@/app/servicios/cap/tipo-capacitaciones.service';
import { CapacitacionesService } from '@/app/servicios/cap/capacitaciones.service';
import { MostrarErrorComponent } from '@/app/shared/components/mostrar-error/mostrar-error.component';
@Component({
  selector: 'app-solicitud-inscripcion',
  standalone: true,
  templateUrl: './solicitud-Inscripcion.component.html',
  styleUrls: ['./solicitud-Inscripcion.component.scss'],
  imports: [
    PrimengModule,
    ToolbarPrimengComponent,
    CardCapacitacionesComponent,
    PaginatorModule,
    DetalleInscripcionComponent,
  ],
})
export class SolicitudInscripcionComponent extends MostrarErrorComponent implements OnInit {
  private _ConstantesService = inject(ConstantesService);
  private _TipoCapacitacionesService = inject(TipoCapacitacionesService);
  private _CapacitacionesService = inject(CapacitacionesService);

  detalleVisible = false;
  idSeleccionado!: string;

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

  ngOnInit() {
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
