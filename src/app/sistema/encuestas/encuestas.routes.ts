import { ADMINISTRADOR_DREMO } from '@/app/servicios/seg/perfiles'
import { RoleGuard } from '@/app/shared/_guards/role.guard'
import { Routes } from '@angular/router'
import { CategoriasEncuestaComponent } from './categorias/categorias-encuestas.component'

const routes: Routes = [
    {
        path: 'categorias',
        component: CategoriasEncuestaComponent,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [ADMINISTRADOR_DREMO],
            breadcrumb: 'Categorias',
            icon: 'pi pi-check-square',
        },
    },
]

export class AppRoutingModule {}
export default routes
