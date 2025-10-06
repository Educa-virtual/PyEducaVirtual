import { PrimengModule } from '@/app/primeng.module';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { TokenStorageService } from '@/app/servicios/token.service';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatosInformesService } from '../../../services/datos-informes.service';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { MessageService } from 'primeng/api';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';

@Component({
  selector: 'app-modal-evaluacion-finalizada',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './modal-evaluacion-finalizada.component.html',
  styleUrl: './modal-evaluacion-finalizada.component.scss',
})
export class ModalEvaluacionFinalizadaComponent implements OnInit {
  @Input() grado: string;
  @Input() puedeCerrarSesion: boolean = false;
  @Input() iEvaluacionId: string;
  @Input() iCursoNivelGradId: string;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  visible: boolean = true;
  mostrarBotonEncuesta: boolean = false;
  archivoSubido: boolean = false;

  constructor(
    private store: LocalStoreService,
    private router: Router,
    private tokenStorageService: TokenStorageService,
    private datosInformesService: DatosInformesService,
    private constantesService: ConstantesService,
    private messageService: MessageService,
    private dialogConfirm: ConfirmationModalService
  ) {}

  ngOnInit() {
    this.mostrarBotonEncuesta = false;
  }

  irEncuesta() {
    switch (this.grado) {
      case '2do.':
        window.open(
          'https://docs.google.com/forms/d/e/1FAIpQLSd1g5gBdZRKrtOs8ct5JRgt5Rq2VusvHn10pjtxgUjrLA3LzQ/viewform',
          '_blank'
        );
        break;
      case '4to.':
        window.open(
          'https://docs.google.com/forms/d/e/1FAIpQLSfLd84JJWdx6fZhUdW7TBGEs7uGFOQaX_JPTyI2hhwzzkDK6w/viewform',
          '_blank'
        );
        break;
    }
  }

  logout(): void {
    if (this.puedeCerrarSesion) {
      this.store.clear();
      this.tokenStorageService.signOut();
      window.location.reload();
    } else {
      this.router.navigate(['/']);
    }
  }

  openFileDialogHojaDesarrollo() {
    this.fileInput.nativeElement.click();
  }

  onFileSelectedHojaDesarrollo(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('archivo', file);

      this.datosInformesService
        .guardarHojaDesarrolloEstudiante(
          formData,
          this.iEvaluacionId,
          this.iCursoNivelGradId,
          this.constantesService.iEstudianteId
        )
        .subscribe({
          next: (data: any) => {
            this.archivoSubido = true;
            this.messageService.add({
              severity: 'success',
              summary: 'Archivo subido',
              detail: data.message,
            });
          },
          error: error => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error al subir archivo',
              detail: error.error.message || 'Error desconocido',
            });
          },
        });
    }
  }

  descargarHojaDesarrolloEstudiante() {
    this.datosInformesService
      .descargarHojaDesarrolloEstudiante(
        this.iEvaluacionId,
        this.iCursoNivelGradId,
        this.constantesService.iEstudianteId
      )
      .subscribe({
        next: (response: Blob) => {
          let filename = `Hoja desarrollo - ${this.constantesService.iEstudianteId}`;
          if (!filename.includes('.') && response.type) {
            const ext = response.type.split('/')[1];
            filename += '.' + ext;
          }
          const url = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Problema al descargar el archivo',
            detail: error.error?.message || 'No se pudo descargar el archivo',
          });
        },
      });
  }

  preguntarEliminarArchivoHojaDesarrollo() {
    this.dialogConfirm.openConfirm({
      header: `Se va a eliminar el archivo subido`,
      message: '¿Desea continuar?',
      accept: () => {
        this.eliminarHojaDesarrolloEstudiante();
      },
    });
  }

  eliminarHojaDesarrolloEstudiante() {
    this.datosInformesService
      .eliminarHojaDesarrolloEstudiante(
        this.iEvaluacionId,
        this.iCursoNivelGradId,
        this.constantesService.iEstudianteId
      )
      .subscribe({
        next: (response: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Archivo eliminado',
            detail: response.message,
          });
          this.archivoSubido = false;
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Problema al descargar el archivo',
            detail: error.error?.message || 'No se pudo descargar el archivo',
          });
        },
      });
  }
}
