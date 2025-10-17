import { Component } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { GestionMatriculasComponent } from '../gestionar-matriculas.component';

@Component({
  selector: 'app-gestionar-matriculas-director',
  standalone: true,
  imports: [PrimengModule, GestionMatriculasComponent],
  templateUrl: './gestionar-matriculas-director.component.html',
  styleUrl: './gestionar-matriculas-director.component.scss',
})
export class GestionarMatriculasDirectorComponent {}
