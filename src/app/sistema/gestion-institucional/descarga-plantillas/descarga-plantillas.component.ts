import { Component } from '@angular/core';
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-descarga-plantillas',
  standalone: true,
  imports: [ContainerPageComponent, ToastModule],
  templateUrl: './descarga-plantillas.component.html',
  styleUrl: './descarga-plantillas.component.scss',
})
export class DescargaPlantillasComponent {
  descargarArchivo(nombreArchivo: string) {
    // Suponiendo que están en assets/plantillas/
    const url = `assets/plantillas/${nombreArchivo}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    link.click();
  }
}
