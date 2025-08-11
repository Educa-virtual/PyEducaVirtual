import { PrimengModule } from '@/app/primeng.module';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { GeneralService } from '@/app/servicios/general.service';
import { Component, inject, OnInit } from '@angular/core';
import { CardCapacitacionesComponent } from '../solicitud-Inscripcion/card-capacitaciones/card-capacitaciones.component';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { CapacitacionesService } from '@/app/servicios/cap/capacitaciones.service';

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
  private _CapacitacionesService = inject(CapacitacionesService);

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
    const iCredId = this._ConstantesService.iCredId;
    const params = {
      iCredId: iCredId,
    };
    this._CapacitacionesService.obtenerCapacitacion(params).subscribe((resp: any) => {
      this.data = resp.data;
      this.capacitaciones = [...this.data];
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
