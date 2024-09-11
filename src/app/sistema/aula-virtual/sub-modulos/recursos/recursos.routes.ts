import { Routes } from '@angular/router'
//import { CursoDetalleComponent } from './curso-detalle/curso-detalle.component'
import { CursosComponent } from './recursos/recursos.component'

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: CursosComponent,
    },
    /*{
        path: ':id',
        component: CursoDetalleComponent,
    },*/
]

export default routes
