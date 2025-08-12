import { PrimengModule } from '@/app/primeng.module';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { Component, inject, OnInit } from '@angular/core';
import { CardCapacitacionesComponent } from '../solicitud-Inscripcion/card-capacitaciones/card-capacitaciones.component';
import { CapacitacionesService } from '@/app/servicios/cap/capacitaciones.service';
import { NoDataComponent } from '@/app/shared/no-data/no-data.component';
import { INSTRUCTOR, PARTICIPANTE } from '@/app/servicios/seg/perfiles';
import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component';
import { MostrarErrorComponent } from '@/app/shared/components/mostrar-error/mostrar-error.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-capacitaciones',
  standalone: true,
  templateUrl: './capacitaciones.component.html',
  styleUrls: ['./capacitaciones.component.scss'],
  imports: [PrimengModule, CardCapacitacionesComponent, NoDataComponent, ToolbarPrimengComponent],
})
export class CapacitacionesComponent extends MostrarErrorComponent implements OnInit {
  private _ConstantesService = inject(ConstantesService);
  private _CapacitacionesService = inject(CapacitacionesService);
  private _Router = inject(Router);

  data: any[] = [];
  capacitaciones: any[] = [];
  rows = 1;
  first = 0;
  pagedData: any[] = [];

  iPerfilId: number;
  ngOnInit() {
    this.iPerfilId = this._ConstantesService.iPerfilId;
    this.obtenerCapacitaciones();
  }

  obtenerCapacitaciones() {
    const cPerfil =
      this.iPerfilId === INSTRUCTOR
        ? 'INSTRUCTOR'
        : this.iPerfilId === PARTICIPANTE
          ? 'PARTICIPANTE'
          : null;
    const iCredId = this._ConstantesService.iCredId;
    if (!cPerfil || !iCredId) return;
    this._CapacitacionesService.obtenerCapacitacionxiCredId(cPerfil, iCredId).subscribe({
      next: (resp: any) => {
        this.data = resp.data;
        this.capacitaciones = [...this.data];
        this.capacitaciones.forEach(capacitacion => {
          capacitacion.jsonHorario = capacitacion.jsonHorario
            ? JSON.parse(capacitacion.jsonHorario)
            : [];
        });
        this.updatePagedData();
      },
      complete: () => {},
      error: error => {
        this.mostrarErrores(error);
      },
    });
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.updatePagedData();
  }

  updatePagedData() {
    const start = this.first;
    const end = this.first + this.rows;
    this.pagedData = this.data.slice(start, end);
  }

  onVerDetalle(capacitacion: any) {
    this._Router.navigate(['/aula-virtual/areas-curriculares', capacitacion.iSilaboId || 0], {
      queryParams: {
        cCursoNombre: capacitacion.cCapTitulo,
        cNivelNombreCursos: '',
        iCapacitacionId: capacitacion.iCapacitacionId,
        cantidad: capacitacion.cantidad,
      },
    });
  }
}
