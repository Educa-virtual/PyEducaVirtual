import { PrimengModule } from '@/app/primeng.module';
import { BancoPreguntasService } from '@/app/servicios/eval/banco-preguntas.service';
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component';
import { Component, EventEmitter, inject, Input, OnChanges, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ViewPreguntasComponent } from '../../../aula-banco-preguntas/aula-banco-preguntas/components/view-preguntas/view-preguntas.component';
import { GeneralService } from '@/app/servicios/general.service';

@Component({
  selector: 'app-importar-banco-preguntas',
  standalone: true,
  imports: [ModalPrimengComponent, PrimengModule, ViewPreguntasComponent],
  templateUrl: './importar-banco-preguntas.component.html',
  styleUrl: './importar-banco-preguntas.component.scss',
})
export class ImportarBancoPreguntasComponent implements OnChanges {
  @Input() showModal: boolean = false;
  @Input() data;

  @Output() accionForm = new EventEmitter();

  preguntas: any[] = [];
  showDetallePregunta: boolean = false;

  private _BancoPreguntasService = inject(BancoPreguntasService);
  private _MessageService = inject(MessageService);
  private _GeneralService = inject(GeneralService);

  ngOnChanges(changes) {
    if (changes.showModal.currentValue) {
      this.showModal = changes.showModal.currentValue;
    }
    if (changes.data.currentValue) {
      this.data = changes.data.currentValue;
      this.obtenerBancoPreguntas(this.data?.iCursoId, this.data?.iEvaluacionId);
    }
  }

  obtenerBancoPreguntas(iCursoId, iEvaluacionId) {
    if (!iCursoId || !iEvaluacionId) return;

    this._BancoPreguntasService
      .obtenerBancoPreguntasxiCursoIdxiDocenteId(iEvaluacionId, iCursoId)
      .subscribe({
        next: resp => {
          if (resp.validated) {
            this.preguntas = resp.data;
            this.preguntas = this.preguntas.map(pregunta => ({
              ...pregunta,
              isSeleccionado: false,
            }));
            this.preguntas.forEach(pregunta => {
              // Primero: parsear jsonPreguntas si viene como string
              if (typeof pregunta.jsonPreguntas === 'string') {
                try {
                  pregunta.jsonPreguntas = JSON.parse(pregunta.jsonPreguntas);
                } catch (e) {
                  console.error('Error al parsear jsonPreguntas:', e, pregunta.jsonPreguntas);
                  pregunta.jsonPreguntas = {};
                }
              }

              // Segundo: parsear jsonAlternativas dentro de jsonPreguntas si viene como string
              if (
                pregunta.jsonPreguntas &&
                typeof pregunta.jsonPreguntas.jsonAlternativas === 'string'
              ) {
                try {
                  pregunta.jsonPreguntas.jsonAlternativas = JSON.parse(
                    pregunta.jsonPreguntas.jsonAlternativas
                  );
                } catch (e) {
                  console.error(
                    'Error al parsear jsonAlternativas (dentro de jsonPreguntas):',
                    e,
                    pregunta.jsonPreguntas.jsonAlternativas
                  );
                  pregunta.jsonPreguntas.jsonAlternativas = [];
                }
              }
              // Tercero (opcional): parsear también el jsonAlternativas raíz, si existe como string
              if (typeof pregunta.jsonAlternativas === 'string') {
                try {
                  pregunta.jsonAlternativas = JSON.parse(pregunta.jsonAlternativas);
                } catch (e) {
                  console.error(
                    'Error al parsear jsonAlternativas (raíz):',
                    e,
                    pregunta.jsonAlternativas
                  );
                  pregunta.jsonAlternativas = [];
                }
              }
            });
          }
        },
        error: error => {
          const errores = error?.error?.errors;
          if (error.status === 422 && errores) {
            // Recorre y muestra cada mensaje de error
            Object.keys(errores).forEach(campo => {
              errores[campo].forEach((mensaje: string) => {
                this.mostrarMensajeToast({
                  severity: 'error',
                  summary: 'Error de validación',
                  detail: mensaje,
                });
              });
            });
          } else {
            // Error genérico si no hay errores específicos
            this.mostrarMensajeToast({
              severity: 'error',
              summary: 'Error',
              detail: error?.error?.message || 'Ocurrió un error inesperado',
            });
          }
        },
      });
  }

  mostrarMensajeToast(message) {
    this._MessageService.add(message);
  }

  accionBtn(elemento): void {
    const { accion } = elemento;
    const { item } = elemento;

    switch (accion) {
      case 'close-modal':
        console.log(item);
        // this.accionBtnItem.emit({ accion, item })
        break;
    }
  }

  detallePreguntas = [];
  tituloDetallePregunta: string;
  handleVerPregunta(item, index) {
    this.showDetallePregunta = true;
    this.tituloDetallePregunta = 'PREGUNTA #' + index;
    this.detallePreguntas = item;
  }

  isLoading: boolean = false;
  importarBancoPreguntas() {
    if (!this.data?.iCursoId || !this.data?.iEvaluacionId) return;

    if (this.isLoading) return; // evitar doble clic
    this.isLoading = true;

    const jsonSeleccionado = this.preguntas.filter(i => i.isSeleccionado);
    const jsonData: any[] = [];

    jsonSeleccionado.forEach(item => {
      // Si el iBancoId existe directamente
      if (item.iBancoId) {
        jsonData.push({
          iBancoId: item.iBancoId,
        });
      }

      // Si hay preguntas internas en jsonPreguntas
      if (Array.isArray(item.jsonPreguntas)) {
        item.jsonPreguntas.forEach(p => {
          if (p.iBancoId) {
            jsonData.push({
              iBancoId: p.iBancoId,
            });
          }
        });
      }
    });

    const data = {
      iCursoId: this.data?.iCursoId,
      iEvaluacionId: this.data?.iEvaluacionId,
      jsonData: JSON.stringify(jsonData),
    };
    this._BancoPreguntasService.importarBancoPreguntas(data).subscribe({
      next: resp => {
        if (resp.validated) {
          this.mostrarMensajeToast({
            severity: 'success',
            summary: '¡Genial!',
            detail: resp.message,
          });
          this.accionForm.emit(true);
        }
        this.isLoading = false;
      },
      error: error => {
        const errores = error?.error?.errors;
        if (error.status === 422 && errores) {
          // Recorre y muestra cada mensaje de error
          Object.keys(errores).forEach(campo => {
            errores[campo].forEach((mensaje: string) => {
              this.mostrarMensajeToast({
                severity: 'error',
                summary: 'Error de validación',
                detail: mensaje,
              });
            });
          });
        } else {
          // Error genérico si no hay errores específicos
          this.mostrarMensajeToast({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.message || 'Ocurrió un error inesperado',
          });
        }
        this.isLoading = false;
      },
    });
  }
}
