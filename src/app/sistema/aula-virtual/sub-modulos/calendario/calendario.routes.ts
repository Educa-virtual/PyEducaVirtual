import { Routes } from '@angular/router'
//import { CursoDetalleComponent } from './curso-detalle/curso-detalle.component'
import { CalendarioComponent } from './calendario/calendario.component'

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: CalendarioComponent,
    },
    /*{
        path: ':id',
        component: CursoDetalleComponent,
    },*/
]

export default routes
