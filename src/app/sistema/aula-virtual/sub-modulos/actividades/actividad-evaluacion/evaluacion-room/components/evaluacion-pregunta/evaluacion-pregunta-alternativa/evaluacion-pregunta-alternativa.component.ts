import { PrimengModule } from '@/app/primeng.module';
import { EditorOnlyViewDirective } from '@/app/shared/directives/editor-only-view.directive';
import { IconComponent } from '@/app/shared/icon/icon.component';
import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-evaluacion-pregunta-alternativa',
  standalone: true,
  imports: [CommonModule, PrimengModule, EditorOnlyViewDirective, IconComponent],
  templateUrl: './evaluacion-pregunta-alternativa.component.html',
  styleUrl: './evaluacion-pregunta-alternativa.component.scss',
})
export class EvaluacionPreguntaAlternativaComponent implements OnChanges {
  @Input({ required: true }) alternativa;
  @Input({ required: true }) pregunta;

  ngOnChanges(changes) {
    if (changes.pregunta.currentValue) {
      this.pregunta = changes.pregunta.currentValue;
      if (typeof this.pregunta.jEvalRptaEstudiante === 'object') {
        const parsed = this.pregunta.jEvalRptaEstudiante;
        switch (this.pregunta.iTipoPregId) {
          case 1:
            this.pregunta.respuestaEstudiante = parsed.rptaUnica;
            break;
          case 2:
            this.pregunta.respuestaEstudiante = parsed.rptaMultiple || []; // 👈 Array
            break;
          case 3:
            this.pregunta.respuestaEstudiante = parsed.rptaAbierta;
            break;
        }
      }
    }
    if (changes.alternativa.currentValue) {
      this.alternativa = changes.alternativa.currentValue;
    }
  }

  esCorrecta(pregunta: any, letra: string): boolean {
    const correcta = pregunta.alternativaCorrecta;
    if (Array.isArray(correcta)) {
      return correcta.includes(letra);
    }
    return correcta === letra;
  }
}
