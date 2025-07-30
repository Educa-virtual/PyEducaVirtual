import { PrimengModule } from '@/app/primeng.module';
import { PreguntaAlternativasRespuestasService } from '@/app/servicios/aula/pregunta-alternativas-respuestas.service';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { Component, inject, Input, OnChanges } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-cuestionario-resultados',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './cuestionario-resultados.component.html',
  styleUrl: './cuestionario-resultados.component.scss',
})
export class CuestionarioResultadosComponent implements OnChanges {
  private _ConstantesService = inject(ConstantesService);
  private _PreguntaAlternativasRespuestasService = inject(PreguntaAlternativasRespuestasService);

  @Input() iCuestionarioId: string | number;

  chartData: { pregunta: string; chartData: ChartData<'bar'> }[] = [];
  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Respuestas por pregunta' },
    },
  };

  ngOnChanges(changes) {
    if (changes.iCuestionarioId?.currentValue) {
      this.iCuestionarioId = changes.iCuestionarioId?.currentValue;
      if (!this.iCuestionarioId) return;
      const params = {
        iCredId: this._ConstantesService.iCredId,
      };
      this._PreguntaAlternativasRespuestasService
        .obtenerResultadosxiCuestionarioId(this.iCuestionarioId, params)
        .subscribe(data => {
          this.chartData = this.armarGraficosPorPregunta(data.data);
        });
    }
  }

  armarGraficosPorPregunta(data: any[]): { pregunta: string; chartData: ChartData<'bar'> }[] {
    const agrupado = new Map<number, { pregunta: string; labels: string[]; data: number[] }>();

    data
      .filter(item => Number(item.iTipoPregId) !== 1)
      .forEach(item => {
        if (!agrupado.has(item.iPregId)) {
          agrupado.set(item.iPregId, {
            pregunta: item.cPregunta,
            labels: [],
            data: [],
          });
        }

        agrupado.get(item.iPregId)!.labels.push(item.cAlternativa);
        agrupado.get(item.iPregId)!.data.push(item.cantidad);
      });

    return Array.from(agrupado.values()).map(g => ({
      pregunta: g.pregunta,
      chartData: {
        labels: g.labels,
        datasets: [
          {
            label: 'Cantidad de respuestas',
            data: g.data,
            backgroundColor: '#42A5F5',
          },
        ],
      },
    }));
  }
}
