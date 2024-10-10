import { Routes } from '@angular/router'
import { CursoDetalleComponent } from './curso-detalle/curso-detalle.component'
import { ActividadComponent } from './actividad/actividad.component'
import { CursosComponent } from './cursos.component'

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
        path: 'actividad/:actividadId/:iActTopId',
        component: ActividadComponent,
    },
]

export default routes
