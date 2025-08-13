import { DIRECTOR_IE } from '@/app/servicios/seg/perfiles';
import { RoleGuard } from '@/app/shared/_guards/role.guard';
import { Routes } from '@angular/router';
import { ListaSugerenciasComponent as DirectorListaSugerenciasComponent } from './director/lista-sugerencias/lista-sugerencias.component';
import { ListaSugerenciasComponent as EstudianteListaSugerenciasComponent } from './estudiante/lista-sugerencias/lista-sugerencias.component';
import { ESTUDIANTE } from '@/app/servicios/perfilesConstantes';

const routes: Routes = [
  {
    path: 'director',
    component: DirectorListaSugerenciasComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [DIRECTOR_IE],
      breadcrumb: 'Buzón de Sugerencias',
      icon: 'pi pi-envelope',
    },
  },
  {
    path: 'estudiante',
    component: EstudianteListaSugerenciasComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: [ESTUDIANTE],
      breadcrumb: 'Buzón de Sugerencias',
      icon: 'pi pi-envelope',
    },
  },
];

export class BuzonSugerenciasRoutingModule {}
export default routes;
