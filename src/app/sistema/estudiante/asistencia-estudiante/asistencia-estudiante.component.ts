import { Component } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { AulaBancoPreguntasModule } from '../../aula-virtual/sub-modulos/aula-banco-preguntas/aula-banco-preguntas.module';
import { MenuItem } from 'primeng/api';
import { AsistenciaComponent } from '../../asistencia/asistencia.component';

@Component({
  selector: 'app-asistencia-estudiante',
  standalone: true,
  imports: [PrimengModule, AulaBancoPreguntasModule, AsistenciaComponent],
  templateUrl: './asistencia-estudiante.component.html',
  styleUrl: './asistencia-estudiante.component.scss',
})
export class AsistenciaEstudianteComponent {
  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;

  constructor() {
    this.breadCrumbItems = [{ label: 'Asistencia' }];
    this.breadCrumbHome = { icon: 'pi pi-home', routerLink: '/' };
  }
}
