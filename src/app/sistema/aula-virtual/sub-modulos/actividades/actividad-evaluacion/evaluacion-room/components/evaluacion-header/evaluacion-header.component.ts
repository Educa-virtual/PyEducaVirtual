import { PrimengModule } from '@/app/primeng.module';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormCalificarEvaluacionComponent } from '../form-calificar-evaluacion/form-calificar-evaluacion.component';

@Component({
  selector: 'app-evaluacion-header',
  standalone: true,
  imports: [PrimengModule, FormCalificarEvaluacionComponent],
  templateUrl: './evaluacion-header.component.html',
  styleUrl: './evaluacion-header.component.scss',
})
export class EvaluacionHeaderComponent implements OnChanges {
  @Output() accionBtnItem = new EventEmitter();

  @Input() selectedEstudianteValue;
  @Input() showListaEstudiantes: boolean = true;

  showFormCalificarEvaluacion: boolean = false;
  name: string = '';
  ngOnChanges(changes) {
    if (changes.selectedEstudianteValue?.currentValue) {
      this.selectedEstudianteValue = changes.selectedEstudianteValue.currentValue;
    }
    if (changes.showListaEstudiantes?.currentValue) {
      this.showListaEstudiantes = changes.showListaEstudiantes.currentValue;
    }
  }

  accionEvntBtn(accion, item) {
    const data = {
      accion,
      item,
    };
    this.accionBtnItem.emit(data);
  }

  accionBtn(elemento): void {
    const { accion } = elemento;
    //const { item } = elemento
    switch (accion) {
      case 'close-modal-preguntas-form':
        this.showFormCalificarEvaluacion = false;
        this.accionEvntBtn('recargar-lista-estudiantes', null);
        break;
      case 'abrir-form-calificar-evaluacion':
        this.name =
          this.selectedEstudianteValue?.cPersNombre +
          ' ' +
          this.selectedEstudianteValue?.cPersPaterno +
          ' ' +
          this.selectedEstudianteValue?.cPersMaterno;
        this.showFormCalificarEvaluacion = true;
        break;
    }
  }
}
