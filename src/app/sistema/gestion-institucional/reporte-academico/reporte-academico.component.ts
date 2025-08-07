import { Component } from '@angular/core';

@Component({
  selector: 'app-reporte-academico',
  standalone: true,
  imports: [],
  templateUrl: './reporte-academico.component.html',
  styleUrl: './reporte-academico.component.scss',
})
export class ReporteAcademicoComponent {
  descargarArchivo(nombreArchivo: string) {
    // Suponiendo que están en assets/plantillas/
    const url = `assets/reportes/${nombreArchivo}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    link.click();
  }
}
