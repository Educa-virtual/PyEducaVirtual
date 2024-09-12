import { Routes } from '@angular/router'
//import { CursoDetalleComponent } from './curso-detalle/curso-detalle.component'
import { RecursosComponent } from './recursos/recursos.component'

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: RecursosComponent,
    },
    /*{
        path: ':id',
        component: CursoDetalleComponent,
    },*/
]

export default routes
