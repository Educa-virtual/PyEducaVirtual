import { Routes } from '@angular/router'
import { RolesComponent } from './roles/roles.component'

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: RolesComponent,
    },
]

export default routes
