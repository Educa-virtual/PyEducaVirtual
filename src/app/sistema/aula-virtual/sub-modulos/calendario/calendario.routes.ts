import { Routes } from '@angular/router'
//import { CursoDetalleComponent } from './curso-detalle/curso-detalle.component'
import { CursosComponent } from './calendario/calendario.component'

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: CursosComponent,
    },
]

export default routes
