import { Component } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
@Component({
  selector: 'app-reporte-asistencias',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './reporte-asistencias.component.html',
  styleUrl: './reporte-asistencias.component.scss',
})
export class ReporteAsistenciasComponent {}
