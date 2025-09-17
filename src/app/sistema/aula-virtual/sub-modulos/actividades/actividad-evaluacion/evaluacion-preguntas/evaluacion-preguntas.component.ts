import { PrimengModule } from '@/app/primeng.module';
import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component';
import { Component, inject, Input, OnChanges } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { NoDataComponent } from '@/app/shared/no-data/no-data.component';
import { PreguntasFormComponent } from '../evaluacion-form/preguntas-form/preguntas-form.component';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { EvaluacionPreguntasService } from '@/app/servicios/eval/evaluacion-preguntas.service';
import { EvaluacionListPreguntasComponent } from '../evaluacion-room/components/evaluacion-list-preguntas/evaluacion-list-preguntas.component';
import { FormEncabezadoComponent } from '../evaluacion-room/components/form-encabezado/form-encabezado.component';
import { ImportarBancoPreguntasComponent } from '../importar-banco-preguntas/importar-banco-preguntas.component';
import { MostrarErrorComponent } from '@/app/shared/components/mostrar-error/mostrar-error.component';
export interface IEvaluacion {
  cTitle: string;
  cHeader: string;
  iEstado?: number;
  iEvaluacionId?: string | number;
  iNivelCicloId?: string | number;
  iCursoId?: string | number;

  idEncabPregId?: string | number;
  cEncabPregTitulo?: string;

  cFormulario: any;
}
@Component({
  selector: 'app-evaluacion-preguntas',
  standalone: true,
  imports: [
    ToolbarPrimengComponent,
    PrimengModule,
    NoDataComponent,
    PreguntasFormComponent,
    EvaluacionListPreguntasComponent,
    FormEncabezadoComponent,
    ImportarBancoPreguntasComponent,
  ],
  templateUrl: './evaluacion-preguntas.component.html',
  styleUrl: './evaluacion-preguntas.component.scss',
})
export class EvaluacionPreguntasComponent extends MostrarErrorComponent implements OnChanges {
  @Input() data: IEvaluacion;

  private _ConstantesService = inject(ConstantesService);
  private _EvaluacionPreguntasService = inject(EvaluacionPreguntasService);

  showModalPreguntas: boolean = false;
  showModalEncabezado: boolean = false;
  showModalBancoPreguntas: boolean = false;

  preguntas: any = [];
  tiposAgregarPregunta: MenuItem[] = [
    {
      label: 'Pregunta',
      icon: 'pi pi-plus',
      command: () => {
        this.accionBtn({ accion: 'agregar-pregunta', item: [] });
      },
    },
    {
      label: 'Pregunta Múltiple',
      icon: 'pi pi-plus',
      command: () => {
        this.showModalEncabezado = true;
        this.showModalPreguntas = false;
      },
    },
    {
      label: 'Agregar del banco de preguntas',
      icon: 'pi pi-plus',
      command: () => {
        this.showModalBancoPreguntas = true;
      },
    },
  ];

  accionForm(evento: boolean) {
    if (evento) {
      this.obtenerEvaluacionPreguntas(this.data.iEvaluacionId);
    }
    this.showModalPreguntas = !evento;
    this.showModalEncabezado = !evento;
    this.showModalBancoPreguntas = !evento;
    this.data.cFormulario = null;
  }

  accionCloseForm() {
    this.showModalPreguntas = false;
    this.showModalEncabezado = false;
    this.showModalBancoPreguntas = false;
    this.data.cFormulario = null;
  }

  accionBtn(elemento: any) {
    const { accion, item } = elemento;

    switch (accion) {
      case 'agregar-pregunta-encabezado':
        this.data.idEncabPregId = item.idEncabPregId;
        this.data.cEncabPregTitulo = item.cEncabPregTitulo;
        this.data.cFormulario = null;
        this.showModalPreguntas = true;
        this.showModalEncabezado = false;
        break;
      case 'agregar-pregunta':
        this.data.idEncabPregId = null;
        this.data.cEncabPregTitulo = null;
        this.data.cFormulario = null;
        this.showModalPreguntas = true;
        this.showModalEncabezado = false;
        break;
      case 'actualizar-pregunta-encabezado':
        this.data.cFormulario = item;
        this.showModalPreguntas = false;
        this.showModalEncabezado = true;
        break;
      case 'actualizar-pregunta':
        this.data.cFormulario = item;
        this.showModalPreguntas = true;
        this.showModalEncabezado = false;
        break;
    }
  }

  ngOnChanges(changes) {
    if (changes.data.currentValue) {
      this.data = changes.data.currentValue;
      this.obtenerEvaluacionPreguntas(this.data.iEvaluacionId);
    }
  }

  obtenerEvaluacionPreguntas(iEvaluacionId) {
    if (!iEvaluacionId) return;
    const params = {
      iCredId: this._ConstantesService.iCredId,
    };
    this._EvaluacionPreguntasService
      .obtenerEvaluacionPreguntasxiEvaluacionId(iEvaluacionId, params)
      .subscribe({
        next: resp => {
          if (resp.validated) {
            this.preguntas = resp.data;
          }
        },
        error: error => {
          this.mostrarErrores(error);
        },
      });
  }

  generarWordEvaluacion() {
    if (!this.preguntas.length) {
      this.mostrarMensajeToast({
        severity: 'info',
        summary: '¡Atención!',
        detail: 'No hay preguntas para generar el word',
      });
      return;
    }
    const iEvaluacionId = this.data.iEvaluacionId;
    if (!iEvaluacionId) return;
    const params = {
      iCredId: this._ConstantesService.iCredId,
    };
    this._EvaluacionPreguntasService.generarWordxiEvaluacionId(iEvaluacionId, params);
  }
}
