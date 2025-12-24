import { ApoderadoService } from './../../apoderado.service';
import { Component, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { MenuItem, MessageService } from 'primeng/api';
import { TablaReporteProgresoComponent } from '@/app/sistema/estudiante/reportes-academicos/tabla-reporte-progreso/tabla-reporte-progreso.component';
import { ReporteProgresoService } from './services/reporte-progreso.service';
import { CalendarioAcademicoComponent } from '@/app/sistema/gestion-institucional/calendario-academico/calendario-academico.component';
import { FullCalendarioComponent } from '@/app/shared/full-calendario/full-calendario.component';
import { CalendarioService } from '@/app/sistema/estudiante/calendario/services/calendario.service';
import { HorarioEstudianteComponent } from '@/app/sistema/estudiante/horario-estudiante/horario-estudiante.component';
import { TabViewModule } from 'primeng/tabview';
import { CalendarioComponent } from '@/app/sistema/estudiante/calendario-estudiante/calendario-estudiante.component';

@Component({
  selector: 'app-reporte-progreso',
  standalone: true,
  imports: [
    TabViewModule,
    PrimengModule,
    TablaReporteProgresoComponent,
    CalendarioAcademicoComponent,
    FullCalendarioComponent,
    HorarioEstudianteComponent,
    CalendarioComponent,
  ],
  templateUrl: './reporte-progreso.component.html',
  styleUrl: './reporte-progreso.component.scss',
})
export class ReporteProgresoComponent implements OnInit {
  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;
  //iYAcadId: number;
  courses: any[] = [];
  year: any = JSON.parse(localStorage.getItem('dremoYear'));
  dataEstudiantes: any[] = [];
  dataMatriculas: any[] = [];
  estudianteSeleccionado: any;
  matriculaSeleccionada: any;

  visibleHorario: boolean = false;
  captionHorario: string = 'Horario de estudiante';
  horarioEstudiante: any = [];
  opcion: string = null;

  constructor(
    private reporteProgresoService: ReporteProgresoService,
    private messageService: MessageService,
    private apoderadoService: ApoderadoService,
    private calendarioService: CalendarioService
  ) {}

  ngOnInit() {
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
    this.breadCrumbItems = [
      {
        label: 'Reportes académicos',
      },
      {
        label: 'Progreso',
      },
    ];

    this.obtenerEstudiantesApoderado();
  }

  obtenerEstudiantesApoderado() {
    this.apoderadoService.obtenerEstudiantesApoderado().subscribe({
      next: (response: any) => {
        this.dataEstudiantes = response.data;
      },
      error: err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Problema al obtener estudiantes',
          detail: err.error.message || 'Error desconocido',
        });
      },
    });
  }

  obtenerMatriculasEstudiante() {
    this.apoderadoService
      .obtenerMatriculasEstudiante(this.estudianteSeleccionado, this.year)
      .subscribe({
        next: (response: any) => {
          this.dataMatriculas = response.data.map((matricula: any) => ({
            ...matricula,
            cMatriculaMostrar:
              `${matricula.iYearId} - ${matricula.cGradoAbreviacion} ${matricula.cSeccionNombre} - ${matricula.cNivelTipoNombre.replace('Educación ', '')} - I.E. ${matricula.cIieeNombre}`.trim(),
          }));
        },
        error: err => {
          this.messageService.add({
            severity: 'error',
            summary: 'Problema al obtener matrículas',
            detail: err.error.message || 'Error desconocido',
          });
        },
      });
  }

  obtenerReporteAcademicoEstudiante() {
    this.reporteProgresoService.obtenerReporteProgreso(this.matriculaSeleccionada).subscribe({
      next: (response: any) => {
        this.courses = response.data;
        if (this.courses.length == 0) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Sin datos',
            detail: 'No hay datos para la matrícula seleccionada',
          });
        }
      },
      error: err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Problema al obtener reportes',
          detail: err.error.message || 'Error desconocido',
        });
      },
    });
    this.obtenerHorario(this.matriculaSeleccionada);
  }
  obtenerHorario(id: any) {
    this.horarioEstudiante = {};

    this.horarioEstudiante = this.dataMatriculas.find(item => item.iMatrId === id);
    console.log(this.horarioEstudiante, 'horarioEstudiante');
  }

  mostrarHorario(opcion: string) {
    this.opcion = null;
    this.opcion = opcion;
    this.visibleHorario = true;

    console.log(
      this.horarioEstudiante,
      ' horio this.horarioEstudiante',
      this.opcion,
      'this.opcion'
    );
  }
}
