import { Component, inject, OnInit } from '@angular/core';

import { ChartOptions } from 'chart.js';

import { PrimengModule } from '@/app/primeng.module';
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component';
import { GeneralService } from '@/app/servicios/general.service';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { MessageService } from 'primeng/api';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { FormBuilder } from '@angular/forms';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { NoDataComponent } from '@/app/shared/no-data/no-data.component';

@Component({
  selector: 'app-dashboard-indicadores',
  standalone: true,
  imports: [PrimengModule, ContainerPageComponent, NoDataComponent],
  templateUrl: './dashboard-indicadores.component.html',
  styleUrl: './dashboard-indicadores.component.scss',
})
export class DashboardIndicadoresComponent implements OnInit {
  gradosSecciones: any[] = [];
  grados: any[] = [];
  secciones: any[] = [];
  cursos: any[] = [];
  iGradoId: string = '';
  iSeccionId: string = '';
  iCursosNivelGradId: string = '';

  iSedeId: number;
  dremoYear: number;
  dremoiYAcadId: number;
  iCredId: number;
  iConfigId: number;

  visible: boolean = false;

  indicadores: {
    titulo: string;
    chartType: 'bar' | 'line' | 'scatter' | 'bubble' | 'pie' | 'doughnut' | 'polarArea' | 'radar';
    chartData: any;
    chartOptions: any;
  }[] = [
    {
      titulo: 'Indicador de Desempeño',
      chartType: 'doughnut',
      chartData: {
        labels: ['Destacado(AD)', 'Esperado(A)', 'En desarrollo(B)', 'No satisfactorio(C)'],
        datasets: [
          {
            label: 'Estudiantes',
            data: [25, 30, 20, 25],
            backgroundColor: ['#2801ea', '#4caf50', '#ffc107', '#f44336'],
          },
        ],
      },
      chartOptions: this.getDefaultOptions('Desempeño Académico'),
    },
    {
      titulo: 'Indicador de Faltas y Tardanzas',
      chartType: 'doughnut',
      chartData: {
        labels: ['Faltas', 'Tardanzas'],
        datasets: [
          {
            data: [70, 30],
            backgroundColor: ['#f44336', '#ff9800'],
          },
        ],
      },
      chartOptions: this.getDefaultOptions('Faltas y Tardanzas'),
    },

    {
      titulo: 'Indicador de Deserción',
      chartType: 'pie',
      chartData: {
        labels: ['Matriculados', 'Desertores'],
        datasets: [
          {
            data: [95, 5],
            backgroundColor: ['#2196f3', '#e91e63'],
          },
        ],
      },
      chartOptions: this.getDefaultOptions('Deserción Escolar'),
    },
    {
      titulo: 'Indicador de Rendimiento',
      chartType: 'line',
      chartData: {
        labels: ['Periodo 1', 'Periodo 2', 'Periodo 3', 'Periodo 4'],
        datasets: [
          {
            label: 'Promedio General',
            data: [13.5, 14.2, 14.8, 15.1],
            fill: false,
            borderColor: '#42A5F5',
            tension: 0.4,
          },
        ],
      },
      chartOptions: this.getDefaultOptions('Rendimiento Académico'),
    },
    {
      titulo: 'Indicador de Matriculados',
      chartType: 'bar',
      chartData: {
        labels: ['Masculino', 'Femenino'],
        datasets: [
          {
            label: 'Estudiantes',
            data: [20, 5],
            backgroundColor: ['#009688', '#8bc34a'],
          },
        ],
      },
      chartOptions: this.getDefaultOptions('Estudiantes Matriculados'),
    },
  ];

  private _GeneralService = inject(GeneralService);
  private _ConstantesService = inject(ConstantesService);
  private messageService = inject(MessageService);
  private _confirmService = inject(ConfirmationModalService);

  constructor(
    public query: GeneralService,
    private fb: FormBuilder,
    private store: LocalStoreService
  ) {
    const perfil = this.store.getItem('dremoPerfil');
    console.log(perfil, 'perfil dremo', this.store);
    this.iSedeId = perfil.iSedeId;
    this.dremoYear = this.store.getItem('dremoYear');
    this.dremoiYAcadId = this.store.getItem('dremoiYAcadId');
    this.iCredId = perfil.iCredId;
  }

  async ngOnInit() {
    this.obtenerGradoSeccion();
    this.getConfiguracion();
  }

  getDefaultOptions(title: string): ChartOptions {
    return {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        title: {
          display: true,
          text: title,
          font: {
            size: 16,
          },
        },
      },
    };
  }

  obtenerGradoSeccion() {
    this._GeneralService
      .searchCalendario({
        json: JSON.stringify({
          iSedeId: this._ConstantesService.iSedeId,
          iYAcadId: this._ConstantesService.iYAcadId,
        }),
        _opcion: 'getGradoSeccionXiSedeIdXiYAcadId',
      })
      .subscribe({
        next: (data: any) => {
          this.gradosSecciones = data.data;
          this.grados = this.removeDuplicatesByiGradoId(this.gradosSecciones);
        },
        error: error => {
          console.error(
            'Error fetching Servicios de Atención:',
            error.mensage || error.error.message || error.error.mensaje
          );
        },
        complete: () => {
          console.log('Request completed');
        },
      });
  }

  obtenerSecciones() {
    this.secciones = this.gradosSecciones.filter(item => item.iGradoId === this.iGradoId);
  }

  removeDuplicatesByiGradoId(array: any[]): any[] {
    const seen = new Set<number>();
    return array.filter(item => {
      if (seen.has(item.iGradoId)) {
        return false;
      }
      seen.add(item.iGradoId);
      return true;
    });
  }
  obtenerCursosxiGradoIdxiSeccionId() {
    this.visible = true;
    /*
    
    const data = {
        iSedeId: this._ConstantesService.iSedeId,
        iYAcadId: this._ConstantesService.iYAcadId,
        iGradoId: this.iGradoId,
        iSeccionId: this.iSeccionId,
    }
    this._GeneralService.obtenerCursosDiasHorarios(data).subscribe({
        next: (data: any) => {
            const horarioIe = data.data
            console.log(horarioIe, 'horarioIe')
        },
        error: (error) => {
            console.error('Error fetching Servicios de Atención:', error)
        },
        complete: () => {
            //   console.log('Request completed')
        },
    })*/
  }

  getConfiguracion() {
    const params = JSON.stringify({
      iSedeId: this.iSedeId,
      iYAcadId: this.dremoiYAcadId,
    });
    this.query
      .searchCalendario({
        json: params,
        _opcion: 'getConfiguracion', //'listarAreasModalidadTurnoSeccion',
      })
      .subscribe({
        next: (data: any) => {
          this.iConfigId = Number(data.data[0].iConfigId);
        },
        error: error => {
          this.messageService.add({
            severity: 'warn',
            summary: 'Advertencia',
            detail:
              'No cuenta con configuración para este año.' + error.mensage ||
              error.error.message ||
              error.error.mensaje,
          });
        },
      });
  }

  searchListarAsignaturas() {
    const iSeccionId = Number(this.iSeccionId); //
    const iGradoId = Number(this.iGradoId); //
    const iConfigId = this.iConfigId;

    if (iSeccionId > 0 && iGradoId > 0 && iConfigId > 0) {
      const params = JSON.stringify({
        iSeccionId: iSeccionId,
        iConfigId: iConfigId,
        iGradoId: iGradoId,
      });

      this.query
        .searchAmbienteAcademico({
          json: params,
          _opcion: 'getCurriculaXgradosIes', //'listarAreasModalidadTurnoSeccion', getAreasXiSeccionIdXiGradoId
        })
        .subscribe({
          next: (data: any) => {
            this.cursos = data.data;
            console.log(data.data);
          },
          error: error => {
            console.error('Error fetching  seccionesAsignadas:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error de conexión',
              detail: 'Se registro error en el procedimiento',
            });
          },
          complete: () => {
            console.log(this.cursos, 'cursos');
          },
        });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe seleccionar un grado y sección para listar las asignaturas',
      });
      this.cursos = [];
      //  this.form.get('iSeccionId').setValue(0)
      //  this.form.get('iGradoId').setValue(0)
    }
  }
}
