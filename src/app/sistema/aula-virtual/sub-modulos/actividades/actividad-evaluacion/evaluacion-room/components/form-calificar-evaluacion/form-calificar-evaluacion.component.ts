import { Component, EventEmitter, inject, Input, OnChanges, Output } from '@angular/core';
import { ModalPrimengComponent } from '../../../../../../../../shared/modal-primeng/modal-primeng.component';
import { PrimengModule } from '@/app/primeng.module';
import { MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EvaluacionPromediosService } from '@/app/servicios/eval/evaluacion-promedios.service';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { MostrarErrorComponent } from '@/app/shared/components/mostrar-error/mostrar-error.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-form-calificar-evaluacion',
  standalone: true,
  imports: [ModalPrimengComponent, PrimengModule, FormsModule, ReactiveFormsModule],
  templateUrl: './form-calificar-evaluacion.component.html',
  styleUrl: './form-calificar-evaluacion.component.scss',
})
export class FormCalificarEvaluacionComponent extends MostrarErrorComponent implements OnChanges {
  private _MessageService = inject(MessageService);
  private _EvaluacionPromediosService = inject(EvaluacionPromediosService);
  private _ConstantesService = inject(ConstantesService);

  @Output() accionBtnItem = new EventEmitter();

  @Input() showFormCalificarEvaluacion: boolean = false;
  @Input() name: string = '';
  @Input() estudiante;

  cConclusionDescriptiva;
  bCapacitacion: boolean;
  nEvalPromNota;

  isLoading: boolean = false;

  ngOnChanges(changes) {
    if (changes.showFormCalificarEvaluacion?.currentValue) {
      this.showFormCalificarEvaluacion = changes.showFormCalificarEvaluacion.currentValue;
    }
    if (changes.estudiante?.currentValue) {
      this.estudiante = changes.estudiante.currentValue;
      this.cConclusionDescriptiva = this.estudiante?.cConclusionDescriptiva;
      this.bCapacitacion = this.estudiante?.bCapacitacion === '1' ? true : false;
      this.nEvalPromNota = this.estudiante?.nEvalPromNota;
    }
  }
  accionBtn(elemento): void {
    const { accion } = elemento;
    const { item } = elemento;

    switch (accion) {
      case 'close-modal':
        this.accionBtnItem.emit({
          accion: 'close-modal-preguntas-form',
          item,
        });
        break;
    }
  }

  guardarConclusionxiEvalPromId() {
    if (this.isLoading) return; // evitar doble clic
    this.isLoading = true;
    const data = {
      iEvaluacionId: this.estudiante.iEvaluacionId,
      iEstudianteId: this.estudiante.iEstudianteId,
      cConclusionDescriptiva: this.cConclusionDescriptiva,
      nEvalPromNota: this.nEvalPromNota,
      iCredId: this._ConstantesService.iCredId,
    };
    this._EvaluacionPromediosService
      .guardarConclusionxiEvaluacionIdxiEstudianteId(data)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: resp => {
          if (resp.validated) {
            this.mostrarMensajeToast({
              severity: 'success',
              summary: '¡Genial!',
              detail: resp.message,
            });
            this.cConclusionDescriptiva = null;
            this.accionBtn({ accion: 'close-modal', item: [] });
          }
        },
        error: error => {
          this.mostrarErrores(error);
        },
      });
  }

  validarNota(event: any) {
    let value = event.value;
    if (value < 0) value = 0;
    if (value > 20) value = 20;
    this.nEvalPromNota = value;
  }
}
