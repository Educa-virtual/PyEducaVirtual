import { Routes } from '@angular/router'
//import { CursoDetalleComponent } from './curso-detalle/curso-detalle.component'
import { dashboardComponent } from './dashboard/dashboard.component'

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: dashboardComponent,
    },
    /*{
        path: ':id',
        component: CursoDetalleComponent,
    },*/
]

export default routes
