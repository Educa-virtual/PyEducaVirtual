import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { MessageService } from 'primeng/api';
import { FormGroup } from '@angular/forms';
import { ApiEvaluacionesRService } from '../../services/api-evaluaciones-r.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { ICurso } from '@/app/sistema/aula-virtual/sub-modulos/cursos/interfaces/curso.interface';
//import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-dialog-generar-cuadernillo',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './dialog-generar-cuadernillo.component.html',
  styleUrl: './dialog-generar-cuadernillo.component.scss',
})
export class DialogGenerarCuadernilloComponent {
  // Evaluacion servicio inject
  private evaluacionesService = inject(ApiEvaluacionesRService);
  private store = new LocalStoreService();
  @Input() iEvaluacionIdHashed: string = '';
  @Input() curso: ICurso;

  // Solo comunicación básica con el padre
  @Input() mostrarDialogoEdicion: boolean = false;
  @Output() mostrarDialogoEdicionChange = new EventEmitter<boolean>();

  // Subir archivo
  @Output() archivoSubidoEvent = new EventEmitter<{ curso: ICurso }>();

  // Propiedades del stepper y archivos
  activeStep: number = 0;
  totalSteps: number = 2;
  cuadernilloFormGroup!: FormGroup;

  // Estados del proceso
  wordDescargado: boolean = false;
  archivoSubido: boolean = false;
  nombreArchivoSubido: string = '';
  archivoSeleccionado: File | null = null;
  loadingActions: { [key: string]: boolean } = {};

  constructor(private messageService: MessageService) {}

  // Descargar word original solo message
  descargarWord() {
    this.loadingActions['download-word'] = true;
    setTimeout(() => {
      this.loadingActions['download-word'] = false;
      this.wordDescargado = true;
      this.messageService.add({
        severity: 'success',
        summary: 'Descarga Exitosa',
        detail: 'El archivo WORD ha sido descargado correctamente',
      });
    }, 2000);
  }

  /* Descomentar metodo actualizado de descargarWord
    descargarWord() {
        if (!this.curso || !this.iEvaluacionIdHashed) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Datos del área no disponibles',
            })
            return
        }

        this.loadingActions['download-word'] = true

        const params = {
            iEvaluacionId: this.iEvaluacionIdHashed,
            iCursosNivelGradId:
                this.curso.iCursosNivelGradId || this.curso.iCursosNivelGradId,
            tipoArchivo: 'word',
        }

        try {
            this.evaluacionesService.descargarArchivoPreguntasPorArea(params)

            // Simular tiempo de descarga
            setTimeout(() => {
                this.loadingActions['download-word'] = false
                this.wordDescargado = true
                this.messageService.add({
                    severity: 'success',
                    summary: 'Descarga Exitosa',
                    detail: `Archivo WORD de ${this.curso.iCursosNivelGradId} descargado correctamente`,
                })
            }, 2000)
        } catch (error) {
            this.loadingActions['download-word'] = false
            this.messageService.add({
                severity: 'error',
                summary: 'Error en descarga',
                detail: 'No se pudo descargar el archivo WORD',
            })
        }
    }
    */

  onFileSelect(event: any) {
    const file = event.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        this.messageService.add({
          severity: 'error',
          summary: 'Archivo Inválido',
          detail: 'Solo se permiten archivos PDF',
        });
        return;
      }
      if (file.size > 10000000) {
        this.messageService.add({
          severity: 'error',
          summary: 'Archivo muy grande',
          detail: 'El archivo no debe superar los 10MB',
        });
        return;
      }
      this.archivoSeleccionado = file;
      this.nombreArchivoSubido = file.name;
      this.archivoSubido = true;
      this.messageService.add({
        severity: 'success',
        summary: 'Archivo Seleccionado',
        detail: `${file.name} ha sido seleccionado correctamente`,
      });
    }
  }

  cambiarArchivo() {
    this.archivoSubido = false;
    this.nombreArchivoSubido = '';
    this.archivoSeleccionado = null;
    this.messageService.add({
      severity: 'info',
      summary: 'Archivo Removido',
      detail: 'Puedes seleccionar un nuevo archivo',
    });
  }

  finalizarProceso() {
    if (!this.archivoSubido || !this.archivoSeleccionado) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Proceso Incompleto',
        detail: 'Debes subir un archivo PDF para continuar',
      });
      return;
    }

    this.loadingActions['finalizar'] = true;
    setTimeout(() => {
      this.loadingActions['finalizar'] = false;

      this.messageService.add({
        severity: 'success',
        summary: 'Proceso Completado',
        detail: 'El cuadernillo ha sido generado exitosamente',
      });

      this.cancelarEdicion();
    }, 3000);
  }

  cancelarEdicion() {
    this.mostrarDialogoEdicion = false;
    this.mostrarDialogoEdicionChange.emit(false);
    this.resetearPanelDosColumnas();
    this.messageService.add({
      severity: 'info',
      summary: 'Proceso Cancelado',
      detail: 'El proceso ha sido cancelado',
    });
  }

  handleNext() {
    if (this.activeStep === 0) {
      if (!this.wordDescargado) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Paso requerido',
          detail: 'Primero debes descargar el archivo WORD',
        });
        return;
      }
    }
    if (this.activeStep < this.totalSteps - 1) {
      this.activeStep++;
    }
  }

  handlePrevious() {
    if (this.activeStep > 0) {
      this.activeStep--;
    }
  }

  get isLastStep(): boolean {
    return this.activeStep === this.totalSteps - 1;
  }

  private resetearPanelDosColumnas() {
    this.wordDescargado = false;
    this.archivoSubido = false;
    this.nombreArchivoSubido = '';
    this.archivoSeleccionado = null;
    this.activeStep = 0;
  }

  onDialogHide() {
    this.mostrarDialogoEdicionChange.emit(false);
    this.resetearPanelDosColumnas();
  }
}
