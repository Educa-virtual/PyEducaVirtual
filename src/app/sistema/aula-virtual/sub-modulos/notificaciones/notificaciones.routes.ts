import { Routes } from '@angular/router'
import { NotificacionesComponent } from './notificaciones/notificaciones.component'

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: NotificacionesComponent,
    },
]

export default routes
