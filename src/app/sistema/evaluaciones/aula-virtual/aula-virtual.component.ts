import { Component, inject, Input, OnChanges } from '@angular/core';
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component';
import { EVALUACION, FORO, TAREA } from '@/app/sistema/aula-virtual/interfaces/actividad.interface';
import { PrimengModule } from '@/app/primeng.module';
import { CardOrderListComponent } from '@/app/shared/card-orderList/card-orderList.component';
import { MostrarErrorComponent } from '@/app/shared/components/mostrar-error/mostrar-error.component';
import { NoDataComponent } from '@/app/shared/no-data/no-data.component';

import { GeneralService } from '@/app/servicios/general.service';

@Component({
  selector: 'app-aula-virtual',
  standalone: true,
  imports: [TablePrimengComponent, PrimengModule, CardOrderListComponent, NoDataComponent],
  templateUrl: './aula-virtual.component.html',
  styleUrl: './aula-virtual.component.scss',
})
export class AulaVirtualComponent extends MostrarErrorComponent implements OnChanges {
  @Input() contenidoSemanas: any;
  @Input() detalleActividades: any[] = [];
  @Input() competencia: string;

  actividadSeleccionado: any;
  semanaSeleccionado: any;

  evaluacion: any[] = [];
  foro: any[] = [];
  tarea: any[] = [];

  public query = inject(GeneralService);

  ngOnChanges(changes) {
    // Si el valor de 'showModalEvaluacion' cambia, se actualiza y se obtiene el tipo de evaluaciones
    if (changes.contenidoSemanas?.currentValue) {
      this.contenidoSemanas = changes.contenidoSemanas.currentValue;

      console.log(this.contenidoSemanas, 'this.contenidoSemanas');
    }
    if (changes.detalleActividades?.currentValue) {
      this.detalleActividades = changes.detalleActividades.currentValue;
      this.buscarResultados();
      console.log(this.detalleActividades, 'this.detalleActividades');
    }
  }

  listarActividades = [
    { label: 'Actividad de Aprendizaje', value: TAREA, styleClass: 'btn-success' },
    { label: 'Foro', value: FORO, styleClass: 'btn-success' },
    { label: 'Evaluación', value: EVALUACION, styleClass: 'btn-danger' },
  ];

  // mostrar(){
  //   this.obteneSemanasxiPeriodoEvalAperId()
  // }
  // obteneSemanasxiPeriodoEvalAperId(): any[] {
  //   if (!this.iPeriodo) return [];
  //   return this.contenidoSemanas.filter(
  //     semana =>
  //       semana.iContenidoSemId === 0 || semana.iPeriodoEvalAperId === this.periodoSeleccionado
  //   );
  // }

  obtenerActividadesxiActTipoId() {
    switch (this.actividadSeleccionado) {
      case TAREA:
        return this.tarea;
      case FORO:
        return this.foro;
      case EVALUACION:
        return this.evaluacion;
      default:
        return [];
    }
  }

  cambiarSemana() {
    if (!this.semanaSeleccionado || this.semanaSeleccionado === 0) {
      this.buscarResultados();
      return;
    }
    // const semana = this.contenidoSemanas.find(
    //   semana => semana.iProgActId === semanaId
    // );

    const jTarea = this.detalleActividades[0].tarea.filter(
      tarea => tarea.iContenidoSemId === this.semanaSeleccionado
    );
    this.tarea = JSON.parse(jTarea);

    const jForo = this.detalleActividades[0].foro.filter(
      foro => foro.iContenidoSemId === this.semanaSeleccionado
    );
    this.foro = JSON.parse(jForo);
    const jEvaluacion = this.detalleActividades[0].evaluacion.filter(
      evaluacion => evaluacion.iContenidoSemId === this.semanaSeleccionado
    );
    this.evaluacion = JSON.parse(jEvaluacion);
  }
  obtenerStyleActividad() {
    const colores = {
      [TAREA]: '--green-500',
      [FORO]: '--yellow-500',
      [EVALUACION]: '--red-500',
    };
    const color = colores[this.actividadSeleccionado];
    return `border-left:15px solid var(${color});`;
  }

  buscarResultados() {
    this.evaluacion = JSON.parse(this.detalleActividades[0].evaluacion ?? []);
    this.foro = JSON.parse(this.detalleActividades[0].foro ?? []);
    this.tarea = JSON.parse(this.detalleActividades[0].tarea ?? []);
  }
}
