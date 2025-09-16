import { Component, EventEmitter, Output } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { AulaBancoPreguntasModule } from '@/app/sistema/aula-virtual/sub-modulos/aula-banco-preguntas/aula-banco-preguntas.module';
import { IconComponent } from '@/app/shared/icon/icon.component';

@Component({
  selector: 'app-evaluacion-practica-indicaciones',
  standalone: true,
  imports: [PrimengModule, AulaBancoPreguntasModule, IconComponent],
  templateUrl: './evaluacion-practica-indicaciones.component.html',
  styleUrl: './evaluacion-practica-indicaciones.component.scss',
})
export class EvaluacionPracticaIndicacionesComponent {
  dtExamenFechaInicio: Date = new Date();
  @Output() iniciarEvaluacion = new EventEmitter<boolean>();

  rendirExamen() {
    this.iniciarEvaluacion.emit(true);
  }
}
