import { ApoderadoService } from './../../apoderado.service';
import { Component, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { MenuItem, MessageService } from 'primeng/api';
import { TablaReporteProgresoComponent } from '@/app/sistema/estudiante/reportes-academicos/tabla-reporte-progreso/tabla-reporte-progreso.component';
import { ReporteProgresoService } from './services/reporte-progreso.service';
import { HorarioEstudianteComponent } from '@/app/sistema/estudiante/horario-estudiante/horario-estudiante.component';
import { TabViewModule } from 'primeng/tabview';
import { CalendarioComponent } from '@/app/sistema/estudiante/calendario-estudiante/calendario-estudiante.component';
import { LocalStoreService } from '@/app/servicios/local-store.service';

@Component({
  selector: 'app-reporte-progreso',
  standalone: true,
  imports: [
    TabViewModule,
    PrimengModule,
    TablaReporteProgresoComponent,
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
  estudianteSeleccionado: any;
  matriculaSeleccionada: any;

  visibleHorario: boolean = false;
  captionHorario: string = 'Horario de estudiante';
  horarioEstudiante: any = [];
  opcion: string = null;
  activeTab = 0;

  constructor(
    private reporteProgresoService: ReporteProgresoService,
    private messageService: MessageService,
    private apoderadoService: ApoderadoService,
    private store: LocalStoreService
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
    this.apoderadoService
      .obtenerEstudiantesApoderado({
        iYAcadId: this.store.getItem('dremoiYAcadId'),
      })
      .subscribe({
        next: (response: any) => {
          this.dataEstudiantes = response.data ? response.data : [];
        },
        error: err => {
          this.messageService.add({
            severity: 'error',
            summary: 'Problema al obtener estudiantes',
            detail: err.error.message || 'Error desconocido',
          });
          this.dataEstudiantes = [];
        },
      });
  }

  obtenerReporteAcademicoEstudiante() {
    if (!this.matriculaSeleccionada || !this.matriculaSeleccionada.iMatrId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Selección inválida',
        detail: 'Por favor seleccione un estudiante válido',
      });
      return;
    }

    this.reporteProgresoService
      .obtenerReporteProgreso(this.matriculaSeleccionada.iMatrId)
      .subscribe({
        next: (response: any) => {
          this.courses = Array.isArray(response.data) ? response.data : [];
          if (this.courses.length === 0) {
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
    this.obtenerHorario(this.matriculaSeleccionada.iMatrId);
  }
  obtenerHorario(id: any) {
    this.horarioEstudiante = {};

    this.horarioEstudiante = this.dataEstudiantes.find(item => item.iMatrId === id);
    console.log(this.horarioEstudiante, 'horarioEstudiante');
  }

  mostrarHorario(opcion: string) {
    this.opcion = null;
    this.opcion = opcion;
    this.visibleHorario = true;
  }
  onTabChange(event: any) {
    this.activeTab = event.index;

    // Ejemplo: si el calendario está en el tab 2
    if (this.activeTab === 2) {
      setTimeout(() => {
        this.obtenerHorario(this.matriculaSeleccionada); // updateSize / today / changeView
      });
    }
  }
}
