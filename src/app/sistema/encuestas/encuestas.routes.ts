import { ADMINISTRADOR } from '@/app/servicios/seg/perfiles'
import { RoleGuard } from '@/app/shared/_guards/role.guard'
import { Routes } from '@angular/router'
import { ConfiguracionEncuestasComponent } from './configuracion-encuestas/configuracion-encuestas.component'
import { PreguntasCuestionarioComponent } from './preguntas-cuestionario/preguntas-cuestionario.component'
import { ResultadosEncuestasComponent } from './resultados-encuestas/resultados-encuestas.component'

const routes: Routes = [
    {
        path: 'configuracion-encuesta',
        component: ConfiguracionEncuestasComponent,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [ADMINISTRADOR],
            breadcrumb: 'Configuración Encuestas',
            icon: 'pi pi-check-square',
        },
    },

    {
        path: 'preguntas-cuestionario',
        component: PreguntasCuestionarioComponent,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [ADMINISTRADOR],
            breadcrumb: 'Preguntas Cuestionario',
            icon: 'pi pi-check-square',
        },
    },

    {
        path: 'resultados-encuestas',
        component: ResultadosEncuestasComponent,
        canActivate: [RoleGuard],
        data: {
            expectedRole: [ADMINISTRADOR],
            breadcrumb: 'Resultados Encuestas',
            icon: 'pi pi-check-square',
        },
    },
]

export class AppRoutingModule {}
export default routes
