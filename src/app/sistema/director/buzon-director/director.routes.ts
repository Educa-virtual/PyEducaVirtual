import { DIRECTOR_IE } from '@/app/servicios/seg/perfiles'
import { RoleGuard } from '@/app/shared/_guards/role.guard'
import { Routes } from '@angular/router'
import { BuzonDirectorComponent } from './buzon-director.component'

const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },
    {
        path: 'buzon-sugerencias',
        component: BuzonDirectorComponent,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [DIRECTOR_IE],
            breadcrumb: 'Buzón de Sugerencias',
            icon: 'pi pi-envelope',
        },
    },
]

export class DirectorRoutingModule {}
export default routes
