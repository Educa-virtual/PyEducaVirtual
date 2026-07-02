import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurriculasComponent } from './curriculas.component';
import { CurriculaCursoComponent } from './curricula-curso/curricula-curso.component';
import { CurriculaCompetenciaComponent } from './curricula-competencia/curricula-competencia.component';

const routes: Routes = [
  {
    path: '',
    component: CurriculasComponent,
  },
  {
    path: ':iCurrId/areas',
    component: CurriculaCursoComponent,
  },
  {
    path: ':iCurrId/competencias',
    component: CurriculaCompetenciaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CurriculasRoutingModule {}
