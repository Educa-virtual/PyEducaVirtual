import { Routes } from '@angular/router'
import { CursosComponent } from './cursos/cursos.component'
import { ActividadComponent } from './actividad/actividad.component'
import { CursoDetalleComponent } from './curso-detalle/curso-detalle.component'

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: CursosComponent,
    },
    {
        path: ':iSilaboId',
        component: CursoDetalleComponent,
    },
    {
        path: 'actividad/:iProgActId/:ixActivadadId/:iActTopId/:iIeCursoId/:iSeccionId/:iNivelGradoId',
        component: ActividadComponent,
    },
]

export default routes
