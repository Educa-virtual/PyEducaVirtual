import { ADMINISTRADOR_DREMO } from '@/app/servicios/seg/perfiles'
import { RoleGuard } from '@/app/shared/_guards/role.guard'
import { Routes } from '@angular/router'
import { InstructoresComponent } from './instructores/instructores.component'
import { SolicitudInscripcionComponent } from './solicitud-Inscripcion/solicitud-Inscripcion.component'

const routes: Routes = [
    {
        path: '',
        canActivate: [RoleGuard],
        data: {
            expectedRole: [ADMINISTRADOR_DREMO],
        },
        children: [
            {
                path: 'capacitaciones',
                component: SolicitudInscripcionComponent,
                data: {
                    expectedRole: [ADMINISTRADOR_DREMO],
                    breadcrumb: 'Capacitaciones',
                    icon: 'pi pi-book',
                },
            },
            {
                path: 'instructores',
                component: InstructoresComponent,
                data: {
                    expectedRole: [ADMINISTRADOR_DREMO],
                    breadcrumb: 'Instructores',
                    icon: 'pi pi-user',
                },
            },
        ],
    },
]

export class AppRoutingModule {}
export default routes
