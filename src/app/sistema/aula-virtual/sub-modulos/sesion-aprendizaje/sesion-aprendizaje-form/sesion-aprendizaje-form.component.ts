import { PrimengModule } from '@/app/primeng.module';
import { IconComponent } from '@/app/shared/icon/icon.component';
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component';
import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { matCloudUpload } from '@ng-icons/material-icons/baseline';

@Component({
  selector: 'app-sesion-aprendizaje-form',
  standalone: true,
  imports: [ModalPrimengComponent, NgIf, PrimengModule, IconComponent],
  templateUrl: './sesion-aprendizaje-form.component.html',
  styleUrl: './sesion-aprendizaje-form.component.scss',
  viewProviders: [provideIcons({ matCloudUpload })],
})
export class SesionAprendizajeFormComponent implements OnChanges {
  @Output() accionCloseForm = new EventEmitter<void>();
  @Input() showModal: boolean = false;

  archivos = [
    {
      id: 0,
      url: '',
      progreso: 5,
      nombre: '',
    },
  ];

  tipos: any[] = ['image/jpeg', 'image/jpg', 'image/png', '.pdf', 'application/pdf'];

  seleccionarArchivo(event) {
    console.log(event);
  }
  ngOnChanges(changes) {
    if (changes['showModal']) {
      this.showModal = changes['showModal'].currentValue;
    }
  }

  loadImage(url) {
    URL.revokeObjectURL(url);
  }

  removerArchivo(archivo) {
    console.log('remover archivo');
    //this.archivos = [];
    const indice = this.archivos.findIndex(el => el.id === archivo.id);
    console.log(indice);
    // const data = this.swal2Service.objectToFormData({
    //   path: this.archivos[indice].path,
    // });

    // this.subirArchivoService
    //   .removerArchivoTemporal(data)
    //   .toPromise()
    //   .then(tm => {
    //     this.archivos.splice(indice, 1);
    //     this.obtenerArchivo.emit(this.archivos);
    //   })
    //   .catch(err => {
    //     // this.toastr.error('Error: ' + err.error.message, 'Error!');
    //     console.log(err);
    //     this.swal2Service.alertaToast('Archivo no removido', 'Revisar archivo', 'warning');
    //   });
  }
}
