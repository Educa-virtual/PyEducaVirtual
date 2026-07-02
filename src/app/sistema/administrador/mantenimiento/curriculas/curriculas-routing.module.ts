import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurriculasComponent } from './curriculas.component';
import { AreasListComponent } from './areas-list/areas-list.component';
import { CompetenciasListComponent } from './competencias-list/competencias-list.component';

const routes: Routes = [
  {
    path: '',
    component: CurriculasComponent,
  },
  {
    path: ':iCurrId/areas',
    component: AreasListComponent,
  },
  {
    path: ':iCurrId/competencias',
    component: CompetenciasListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CurriculasRoutingModule {}
