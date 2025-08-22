import { ADMINISTRADOR_DREMO } from '@/app/servicios/seg/perfiles';
import { RoleGuard } from '@/app/shared/_guards/role.guard';
import { Routes } from '@angular/router';
import { CategoriasEncuestaComponent } from './lista-categorias/lista-categorias.component';
import { ListaEncuestasComponent } from './lista-encuestas/lista-encuestas.component';

const routes: Routes = [
  {
    path: 'categorias',
    component: CategoriasEncuestaComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [ADMINISTRADOR_DREMO],
      breadcrumb: 'Categorías',
    },
  },
  {
    path: 'categorias/:iCatEncId/encuestas',
    component: ListaEncuestasComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [ADMINISTRADOR_DREMO],
      breadcrumb: 'Encuestas',
    },
  },
];

export class AppRoutingModule {}
export default routes;
