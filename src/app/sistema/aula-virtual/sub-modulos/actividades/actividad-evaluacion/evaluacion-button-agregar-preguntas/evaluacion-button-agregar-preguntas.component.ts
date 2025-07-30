import { PrimengModule } from '@/app/primeng.module';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AulaBancoPreguntasService } from '../../../aula-banco-preguntas/aula-banco-preguntas/aula-banco-.preguntas.service';
import { AulaBancoPreguntasComponent } from '../../../aula-banco-preguntas/aula-banco-preguntas/aula-banco-preguntas.component';

@Component({
  selector: 'app-evaluacion-button-agregar-preguntas',
  standalone: true,
  imports: [PrimengModule, AulaBancoPreguntasComponent],
  templateUrl: './evaluacion-button-agregar-preguntas.component.html',
  styleUrl: './evaluacion-button-agregar-preguntas.component.scss',
})
export class EvaluacionButtonAgregarPreguntasComponent {
  @Output() preguntasSeleccionadasChange = new EventEmitter();

  @Input() menu: boolean = false;
  @Input() iCursoId;
  @Input() iEvaluacionId;

  preguntas = [];
  mode: 'EDIT' | 'VIEW' = 'EDIT';

  private _aulaBancoPreguntasService = inject(AulaBancoPreguntasService);

  tiposAgrecacionPregunta: MenuItem[] = [
    {
      label: 'Nueva Pregunta',
      icon: 'pi pi-plus',
      command: () => {
        this.handleNuevaPregunta();
      },
    },
    {
      label: 'Del banco de preguntas',
      icon: 'pi pi-plus',
      command: () => {
        this.handleBancopregunta();
      },
    },
  ];
  handleNuevaPregunta() {
    this.agregarEditarPregunta({
      iPreguntaId: 0,
      preguntas: [],
      iEncabPregId: -1,
    });
  }

  showModalPreguntas: boolean = false;
  showModalBancoPreguntas: boolean = false;

  preguntasSeleccionadas = [];

  agregarEditarPregunta(pregunta) {
    // this.showModalPreguntas = true
    // console.log(pregunta)
    const refModal = this._aulaBancoPreguntasService.openPreguntaModal({
      pregunta,
      iCursoId: this.iCursoId,
      tipoPreguntas: [],
      iEvaluacionId: this.iEvaluacionId,
      padreComponente: null,
    });
    refModal.onClose.subscribe(result => {
      if (result) {
        const pregunta = this.mapLocalPregunta(result);
        this.preguntas.push(pregunta);
        this.preguntasSeleccionadasChange.emit(this.preguntas);
      }
    });
  }

  mapLocalPregunta(pregunta) {
    if (pregunta.iEncabPregId == -1) {
      pregunta.isLocal = true;
      pregunta.iEvalPregId = 0;
    } else {
      pregunta.preguntas = this.addLocalPreguntas(pregunta.preguntas);
    }
    return pregunta;
  }

  addLocalPreguntas = preguntas => {
    return preguntas.map(item => {
      item.isLocal = true;
      item.iEvalPregId = 0;
      return item;
    });
  };

  handleBancopregunta() {
    this.showModalBancoPreguntas = true;
  }

  selectedRowDataChange(event) {
    this.preguntasSeleccionadas = [...event];
  }
  closeModalBancoPreguntas() {
    this.showModalBancoPreguntas = false;
  }
  agregarPreguntas() {
    this.preguntasSeleccionadas.map(item => {
      item = this.mapLocalPregunta(item);
      return item;
    });
    this.closeModalBancoPreguntas();
    this.preguntas.push(...this.preguntasSeleccionadas);
    this.preguntasSeleccionadasChange.emit(this.preguntas);
  }
}
