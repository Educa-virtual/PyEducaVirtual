import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component';
import { PrimengModule } from '@/app/primeng.module';
import { environment } from '@/environments/environment';
import { MessageService } from 'primeng/api';
import { ComunicadosService } from '../../services/comunicados.services';
@Component({
  selector: 'app-subir-documento',
  standalone: true,
  imports: [PrimengModule, ModalPrimengComponent],
  templateUrl: './subir-documento.component.html',
  styleUrl: './subir-documento.component.scss',
})
export class SubirDocumentoComponent implements OnChanges {
  backend = environment.backend;

  @Output() actionTypesFileUpload = new EventEmitter();
  @Input() nameFile: string;
  @Input() nameOption: string;
  @Input() filesUrl = [];
  @Input() typesFiles = {
    file: true,
    url: true,
    youtube: true,
    repository: true,
    image: false,
  };
  public data = [{}];

  showModal: boolean = false;
  showModalPreview: boolean = false;
  titleFileTareas: string = '';
  typeUpload: string;

  constructor(
    private messageService: MessageService,
    private comunicadosService: ComunicadosService
  ) {}

  ngOnChanges(changes) {
    if (changes.typesFiles?.currentValue) {
      this.typesFiles = changes.typesFiles.currentValue;
    }
    if (changes.filesUrl?.currentValue) {
      this.filesUrl = changes.filesUrl.currentValue;
    }
  }

  urlName: string;
  youtubeName: string;

  openUpload(type) {
    this.typeUpload = type;
    this.titleFileTareas = '';
    switch (type) {
      case 'file':
        this.titleFileTareas = 'Añadir Archivo Local';
        break;
      case 'url':
        this.showModal = true;
        this.titleFileTareas = 'Añadir Enlace URL';
        break;
      case 'youtube':
        this.showModal = true;
        this.titleFileTareas = 'Añadir Enlace de Youtube';
        break;
      case 'repository':
        this.showModalPreview = true;
        this.titleFileTareas = 'Añadir Archivo de mis Recursos';
        break;
      case 'image':
        this.titleFileTareas = 'Añadir Archivo Local';
        break;
      default:
        this.showModal = false;
        this.typeUpload = null;
        break;
    }
  }

  async onUploadChange(evt, tipo) {
    const filesToUpload = evt.target.files;

    if (filesToUpload.length) {
      const archivoFile = filesToUpload[0];

      const dataFile = await this.objectToFormData({
        archivo: archivoFile,
        nombreArchivo: archivoFile.name,
      });

      this.comunicadosService.subirDocumento(dataFile).subscribe({
        next: (respuesta: any) => {
          const data = {
            item: {
              name: respuesta.data.nombreArchivoGuardado,
              file: respuesta.data.rutaArchivoGuardado,
              extension: respuesta.data.extension,
              tipo: tipo,
            },
          };
          this.actionTypesFileUpload.emit(data);
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error al Subir Archivo',
            detail: error.error.message,
          });
        },
      });
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

  accionBtnItem(elemento): void {
    const { accion } = elemento;

    let data;
    switch (accion) {
      case 'close-modal':
        this.showModal = false;
        break;
      case 'subir-url':
        console.log('ver #4');
        const urlName = this.urlName?.trim();
        const regexx = /^(https?:\/\/)/;
        if (!urlName || !regexx.test(urlName)) {
          // Puedes mostrar un mensaje de error aquí si deseas
          this.messageService.add({
            severity: 'error',
            summary: 'Error de validación',
            detail: 'Debe ingresar un enlace válido de URL para continuar.',
          });

          return;
        }
        data = {
          item: {
            name: this.urlName,
            ruta: this.urlName,
            tipo: 'enlace',
          },
        };
        this.actionTypesFileUpload.emit(data);
        this.urlName = null;
        this.showModal = false;
        break;

      case 'subir-youtube':
        const url = this.youtubeName?.trim();
        const regex = /^(https?:\/\/)/;
        if (!url || !regex.test(url)) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error de validación',
            detail: 'Debe ingresar un enlace válido de YouTube para continuar.',
          });

          console.log('Error: URL no válida');
          return;
        }
        data = {
          accion: 'youtube-' + this.nameOption,
          item: {
            name: this.youtubeName,
            ruta: this.youtubeName,
          },
        };
        this.actionTypesFileUpload.emit(data);
        this.youtubeName = null;
        this.showModal = false;
        break;
    }
  }
  validarYoutubeUrl(url: string): boolean {
    const pattern = /^(https:\/\/)(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/;
    return pattern.test(url);
  }

  updateUrl(item) {
    item.ruta = 'users/no-image.png';
  }
}
