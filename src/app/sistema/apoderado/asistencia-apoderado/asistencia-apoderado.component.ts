import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { PrimengModule } from '@/app/primeng.module';
import { AsistenciaComponent } from '../../asistencia/asistencia.component';
import { AulaBancoPreguntasModule } from '../../aula-virtual/sub-modulos/aula-banco-preguntas/aula-banco-preguntas.module';
import { ApoderadoService } from '../apoderado.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';

@Component({
  selector: 'app-asistencia-apoderado',
  standalone: true,
  imports: [PrimengModule, AulaBancoPreguntasModule, AsistenciaComponent],
  templateUrl: './asistencia-apoderado.component.html',
  styleUrl: './asistencia-apoderado.component.scss',
})
export class AsistenciaApoderadoComponent {
  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;
  dataEstudiantes: any[] = [];
  dataMatriculas: any[] = [];
  estudianteSeleccionado: any;
  matriculaSeleccionada: any;
  year: any = JSON.parse(localStorage.getItem('dremoYear'));

  constructor(
    private messageService: MessageService,
    private apoderadoService: ApoderadoService,
    private store: LocalStoreService
  ) {
    this.breadCrumbItems = [{ label: 'Asistencia' }];
    this.breadCrumbHome = { icon: 'pi pi-home', routerLink: '/' };
    this.obtenerEstudiantesApoderado();
  }

  obtenerEstudiantesApoderado() {
    this.apoderadoService
      .obtenerEstudiantesApoderado({
        iYAcadId: this.store.getItem('dremoiYAcadId'),
      })
      .subscribe({
        next: (response: any) => {
          this.dataEstudiantes = response.data ? [response.data] : [];
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
}
