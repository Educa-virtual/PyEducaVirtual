import { Component } from '@angular/core';
import { GestionMatriculasComponent } from '../gestionar-matriculas.component';
import { PrimengModule } from '@/app/primeng.module';

@Component({
  selector: 'app-estudiantes-apoderados',
  standalone: true,
  imports: [GestionMatriculasComponent, PrimengModule],
  templateUrl: './estudiantes-apoderados.component.html',
  styleUrl: './estudiantes-apoderados.component.scss',
})
export class EstudiantesApoderadosComponent {}
