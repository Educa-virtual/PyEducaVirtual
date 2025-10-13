import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PrimengModule } from '@/app/primeng.module';
import { AsistenciaComponent } from '../../asistencia/asistencia.component';
import { AulaBancoPreguntasModule } from '../../aula-virtual/sub-modulos/aula-banco-preguntas/aula-banco-preguntas.module';

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

  constructor() {
    this.breadCrumbItems = [{ label: 'Asistencia' }];
    this.breadCrumbHome = { icon: 'pi pi-home', routerLink: '/' };
  }
}
