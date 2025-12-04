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
  semanaSeleccionado: any = 0;

  evaluacion: any[] = [];
  foro: any[] = [];
  tarea: any[] = [];

  public query = inject(GeneralService);

  ngOnChanges(changes) {
    // Si el valor de 'showModalEvaluacion' cambia, se actualiza y se obtiene el tipo de evaluaciones
    if (changes.contenidoSemanas?.currentValue) {
      this.contenidoSemanas = [];
      this.contenidoSemanas = changes.contenidoSemanas.currentValue;
    }
    if (changes.detalleActividades?.currentValue) {
      this.detalleActividades = [];

      this.evaluacion = [];
      this.foro = [];
      this.tarea = [];
      this.detalleActividades = changes.detalleActividades.currentValue;

      if (this.detalleActividades.length > 0) {
        this.buscarResultados();
      }
    }
    if (changes.competencia?.currentValue) {
      this.competencia = '';
      this.competencia = changes.competencia.currentValue;
    }
  }

  listarActividades = [
    { label: 'Actividad de Aprendizaje', value: TAREA, styleClass: 'btn-success' },
    { label: 'Foro', value: FORO, styleClass: 'btn-success' },
    { label: 'Evaluación', value: EVALUACION, styleClass: 'btn-danger' },
  ];

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
    if (Number(this.semanaSeleccionado) === 0) {
      this.buscarResultados();
      return;
    }

    // Convertir JSON string → array

    const evaluaciones = JSON.parse(this.detalleActividades[0].evaluacion ?? []);
    const foros = JSON.parse(this.detalleActividades[0].foro ?? []);
    const tareas = JSON.parse(this.detalleActividades[0].tarea ?? []);

    // Filtrar por semana
    this.tarea = tareas.filter(t => Number(t.iContenidoSemId) === Number(this.semanaSeleccionado));
    this.foro = foros.filter(f => Number(f.iContenidoSemId) === Number(this.semanaSeleccionado));
    this.evaluacion = evaluaciones.filter(
      e => Number(e.iContenidoSemId) === Number(this.semanaSeleccionado)
    );
    this.obtenerActividadesxiActTipoId();
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
    const parseOrEmpty = (value: any) => (value ? JSON.parse(value) : []);
    this.evaluacion = parseOrEmpty(this.detalleActividades[0].evaluacion);
    this.foro = parseOrEmpty(this.detalleActividades[0].foro);
    this.tarea = parseOrEmpty(this.detalleActividades[0].tarea);
  }
}
