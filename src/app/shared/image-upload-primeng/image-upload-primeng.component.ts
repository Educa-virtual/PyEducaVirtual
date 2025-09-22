import { PrimengModule } from '@/app/primeng.module';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { ImageUploadPrimengService } from './image-upload-primeng.service';
import { MessageService } from 'primeng/api';
import { environment } from '@/environments/environment';
@Component({
  selector: 'app-image-upload-primeng',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './image-upload-primeng.component.html',
  styleUrl: './image-upload-primeng.component.scss',
})
export class ImageUploadPrimengComponent {
  @Output() actionImageUpload = new EventEmitter<string>();
  @Input() label: string = 'user.png';
  @Input() urlFoto: string;
  backend: string = environment.backend;
  public iProgress;

  constructor(
    private imageUploadService: ImageUploadPrimengService,
    private messageService: MessageService
  ) {}

  async onUploadChange(evt: any) {
    this.iProgress = 1;

    const file = evt.target.files[0];

    if (file) {
      const dataFile = await this.objectToFormData({
        foto: file,
      });
      this.imageUploadService.subirImagen(dataFile, 'grl/personas/foto-perfil').subscribe({
        next: (event: any) => {
          if (event.body) {
            this.urlFoto = this.backend + '/' + event.body.data.urlFoto;
            this.actionImageUpload.emit(event.body.data.urlFoto);
            this.messageService.add({
              severity: 'success',
              summary: 'Foto subida',
              detail: event.body.message,
            });
          }

          if (event.type === HttpEventType.UploadProgress) {
            this.iProgress = Math.round((100 / event.total) * event.loaded);
          } else if (event.type === HttpEventType.Response) {
            this.iProgress = null;
          }
        },
        error: (err: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Problema al subir el archivo',
            detail: err.error.message,
          });
        },
      });
      /*this.imageUploadService.subirImagen(dataFile, '')
                .pipe(
                    map((event: any) => {
                        if (event.body) {
                            const imagen = event.body
                            const data = {
                                accion: 'subir-archivo-users',
                                item: {
                                    imagen: imagen,
                                },
                            }
                            this.actionImageUpload.emit(data)
                        }
                        if (event.type == HttpEventType.UploadProgress) {
                            this.iProgress = Math.round(
                                (100 / event.total) * event.loaded
                            )
                        } else if (event.type == HttpEventType.Response) {
                            this.iProgress = null
                        }
                    }),
                    catchError((err: any) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Problema al subir el archivo',
                            detail: err.error.message,
                        });
                        return throwError(() => err);
                    })
                )*/
    }
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

  updateUrl() {
    this.urlFoto = 'users/no-image.png';
  }
}
