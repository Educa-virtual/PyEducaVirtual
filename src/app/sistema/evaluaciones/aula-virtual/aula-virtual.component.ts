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
  @Input() iDetMatrId: any;
  @Input() iPeriodo: number;

  contenidoSemanas: any;
  actividadSeleccionado: any;
  semanaSeleccionado: any;
  detalleActividades: any[] = [];

  evaluacion: any[] = [];
  foro: any[] = [];
  tarea: any[] = [];

  public query = inject(GeneralService);

  ngOnChanges(changes) {
    // Si el valor de 'showModalEvaluacion' cambia, se actualiza y se obtiene el tipo de evaluaciones
    if (changes.iDetMatrId?.currentValue) {
      this.iDetMatrId = changes.iDetMatrId.currentValue;
    }
    if (changes.iPeriodo?.currentValue) {
      this.iPeriodo = changes.iPeriodo.currentValue;
    }

    if (this.iDetMatrId > 0 && this.iPeriodo > 0) {
      this.buscarResultados();
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
    this.query
      .searchCalendario({
        json: JSON.stringify({
          iDetMatrId: this.iDetMatrId,
          iPeriodo: Number(this.iPeriodo),
        }),
        _opcion: 'competenciaXiDetMatrId',
      })
      .subscribe({
        next: (data: any) => {
          this.evaluacion = data.data.evaluacion ?? [];
          this.foro = data.data.foro ?? [];
          this.tarea = data.data.tarea ?? [];

          // 1. Unimos los 3 arreglos en uno solo
          const combinado = [...this.evaluacion, ...this.foro, ...this.tarea];

          // 2. Eliminamos duplicados por iContenidoSemId
          this.contenidoSemanas = combinado.filter(
            (item, index, self) =>
              index === self.findIndex(t => t.iContenidoSemId === item.iContenidoSemId)
          );

          this.detalleActividades = data.data;
        },
        error: error => {
          this.messageService.add({
            summary: 'Mensaje de sistema',
            detail: 'Error al cargar secciones de IE.' + error.error.message,
            life: 3000,
            severity: 'error',
          });
        },
      });
  }
}
