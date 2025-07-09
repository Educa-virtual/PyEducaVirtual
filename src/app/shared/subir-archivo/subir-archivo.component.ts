import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { CommonModule, formatDate, NgFor, NgIf } from '@angular/common';
import { provideIcons } from '@ng-icons/core';
import { matCloudUpload } from '@ng-icons/material-icons/baseline';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { GeneralService } from '@/app/servicios/general.service';
import { catchError, map, of } from 'rxjs';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { PrimengModule } from '@/app/primeng.module';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-subir-archivo',
  standalone: true,
  imports: [IconComponent, NgFor, NgIf, CommonModule, PrimengModule],
  templateUrl: './subir-archivo.component.html',
  styleUrl: './subir-archivo.component.scss',
  viewProviders: [provideIcons({ matCloudUpload })],
})
export class SubirArchivoComponent {
  private _DomSanitizer = inject(DomSanitizer);
  private _GeneralService = inject(GeneralService);
  private _MessageService = inject(MessageService);

  @Output() obtenerArchivo = new EventEmitter<any>();
  @Input() carpeta: string = '';
  @Input() archivos = [];

  tipos: any[] = ['.pdf', 'application/pdf'];
  unidades = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  seleccionarArchivo(event) {
    const { files } = event.target;
    const { type } = files[0];

    const archivoValido = this.tipos.includes(type);

    if (archivoValido) {
      const archivo = {
        id: this.generarIdUnico(),
        archivo: files[0],
        nombre: files[0].name,
        progreso: 0,
        url: this.generarURLArchivo(files[0], type),
        peso: this.calcularPeso(files[0].size),
      };
      if (this.archivos.length) {
        this.removerArchivo(this.archivos[0]);
      }
      this.archivos.push(archivo);

      /* subir archivo a carpeta temporales */
      this.subirArchivoCarpetaTemporal(archivo);
    } else {
      this.mostrarMensajeToast({
        severity: 'info',
        summary: 'Archivo no válido',
        detail: 'Revise el archivo',
      });
    }

    event.target.value = '';
  }

  generarIdUnico(): number {
    const id = Math.floor(Math.random() * (999 - 1));

    const valid = this.archivos.every(archivo => archivo.id !== id);

    if (valid) {
      return id;
    } else {
      return this.generarIdUnico(); // ← aquí estaba el error
    }
  }

  generarURLArchivo(archivo, tipo) {
    let url: SafeUrl;

    if (tipo == 'application/pdf' || tipo == '.pdf') {
      url = 'assets/images/isPDF.png';
    } else {
      url = this._DomSanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(archivo));
    }

    return url;
  }

  calcularPeso(pesoBytes) {
    let i;
    for (i = 0; pesoBytes > 1000; i++) {
      pesoBytes /= 1000;
    }
    return pesoBytes.toFixed(1) + ' ' + this.unidades[i];
  }

  async subirArchivoCarpetaTemporal(archivo: any): Promise<void> {
    const indice = this.archivos.findIndex(el => el.id === archivo.id);
    if (indice === -1) {
      console.warn('Archivo no encontrado para subir');
      return;
    }

    const formData = await this.objectToFormData({
      file: this.archivos[indice].archivo,
      nameFile: `${this.carpeta}/${formatDate(new Date(), 'yyyy-MM-dd', 'es')}`,
    });

    this._GeneralService
      .subirArchivoProgreso(formData)
      .pipe(
        map((event: HttpEvent<any>) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              const porcentaje = Math.round((event.loaded * 100) / (event.total || 1));
              this.archivos[indice].progreso = porcentaje;
              return null; // Para que no dispare `subscribe` aún

            case HttpEventType.Response:
              return event;

            default:
              return null;
          }
        }),
        catchError((error: HttpErrorResponse) => {
          const nombre = this.archivos[indice]?.nombre ?? 'archivo';
          this.archivos.splice(indice, 1);
          console.error('Error al subir archivo:', error);
          this.mostrarMensajeToast({
            severity: 'warning',
            summary: 'Archivo no subido',
            detail: 'El servidor no lo permite',
          });
          return of({ error: true, message: `${nombre} no se pudo subir.` });
        })
      )
      .subscribe((event: any) => {
        if (event?.body) {
          this.archivos[indice].path = event.body;
          this.obtenerArchivo.emit(this.archivos);
        } else if (event?.error) {
          console.warn(event.message);
        }
      });
  }
  removerArchivo(archivo) {
    const indice = this.archivos.findIndex(el => el.id === archivo.id);
    if (indice === -1) return;
    if (archivo.path) {
      const ruta = archivo.path;

      this._GeneralService
        .removerArchivo(ruta)
        .pipe(
          catchError((error: any) => {
            console.log(error);
            this.mostrarMensajeToast({
              severity: 'warn',
              summary: 'No se pudo eliminar del servidor',
              detail: archivo.nombre,
            });
            return of(null);
          })
        )
        .subscribe(res => {
          if (res) {
            this.mostrarMensajeToast({
              severity: 'success',
              summary: 'Archivo eliminado del servidor',
              detail: archivo.nombre,
            });
          }
        });
    }

    // Eliminar del array local
    this.archivos.splice(indice, 1);
  }

  objectToFormData(obj: any) {
    const formData = new FormData();
    Object.keys(obj).forEach(key => {
      if (obj[key] !== '') {
        formData.append(key, obj[key]);
      }
    });

    return formData;
  }

  mostrarMensajeToast(message) {
    this._MessageService.add(message);
  }
}
