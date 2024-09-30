import { Routes } from '@angular/router'
//import { Recurso1Component } from './recursos/recurso1.component'
import { RecursoComponent } from './recursos/recursos.component'

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: RecursoComponent,
    },
    /*{
        path: ':id',
        component: Recurso1Component,
    },*/
]

export default routes
