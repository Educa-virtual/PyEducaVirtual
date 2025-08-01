import { PrimengModule } from '@/app/primeng.module';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { GeneralService } from '@/app/servicios/general.service';
import { Component, inject, OnInit } from '@angular/core';
import { CardCapacitacionesComponent } from '../solicitud-Inscripcion/card-capacitaciones/card-capacitaciones.component';
import { DropdownChangeEvent } from 'primeng/dropdown';

@Component({
  selector: 'app-capacitaciones',
  standalone: true,
  templateUrl: './capacitaciones.component.html',
  styleUrls: ['./capacitaciones.component.scss'],
  imports: [PrimengModule, CardCapacitacionesComponent],
})
export class CapacitacionesComponent implements OnInit {
  private GeneralService = inject(GeneralService);
  private _ConstantesService = inject(ConstantesService);

  data: any[] = [];
  capacitaciones: any[] = [];
  idPerfil: number;
  capacitacionFiltrado: any[] = [];

  constructor() {}

  ngOnInit() {
    this.obtenerCapacitaciones();
    this.idPerfil = this._ConstantesService.iPerfilId;
  }
  // obtener y listar las capacitaciones
  obtenerCapacitaciones() {
    const data = {
      petition: 'get',
      group: 'cap',
      prefix: 'capacitaciones',
      ruta: 'listarCapacitaciones',
      params: {
        iCredId: this._ConstantesService.iCredId, // Asignar el ID del crédito
      },
    };
    this.GeneralService.getGralPrefixx(data).subscribe({
      next: resp => {
        this.data = resp['data'];
        // console.log('Capacitaciones:', this.data);
        this.capacitaciones = [...this.data]; // cargar desde servicio o mock
      },
      error: err => {
        console.error('Error al obtener capacitaciones:', err);
      },
    });
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
