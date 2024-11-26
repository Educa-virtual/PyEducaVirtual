import { Routes } from '@angular/router'

import { LoginComponent } from './shared/login/login.component'

import { VerificacionComponent } from './shared/verificacion/verificacion.component'
import { InicioComponent } from './sistema/inicio/inicio.component'
import { NotfoundComponent } from './shared/notfound/notfound.component'
import { RecoverPasswordComponent } from './shared/recover-password/recover-password.component'

export const routes: Routes = [
    { path: '', component: InicioComponent },
    {
        path: '',

        children: [
            {
                path: 'docente',

                loadChildren: () =>
                    import('./sistema/docente/docente.module').then(
                        (m) => m.DocenteModule
                    ),
            },

            {
                path: 'aula-virtual',

                loadChildren: () =>
                    import('./sistema/aula-virtual/aula-virtual.routes'),
            },

            {
                path: 'evaluaciones',
                loadChildren: () =>
                    import('./sistema/evaluaciones/evaluaciones.routes'),
            },
            // Ruta de Especialista
            {
                path: 'especialista-ugel',

                loadChildren: () =>
                    import(
                        './sistema/especialista-ugel/especialista-ugel.routes'
                    ),
            },
        ],
    },
    {
        path: 'especialista-ugel',

        loadChildren: () =>
            import('./sistema/especialista-ugel/especialista-ugel.routes'),
    },

    { path: 'login', component: LoginComponent },

    { path: 'verificacion', component: VerificacionComponent },

    { path: 'recover-password', component: RecoverPasswordComponent },

    {
        path: 'configuracion',

        loadChildren: () =>
            import('./sistema/configuracion/configuracion.module').then(
                (m) => m.ConfiguracionModule
            ),
    },
    {
        path: 'gestion-institucional',

        loadChildren: () =>
            import(
                './sistema/gestion-institucional/gestion-institucional.module'
            ).then((m) => m.GestionInstitucionalModule),
    },

    { path: 'notfound', component: NotfoundComponent },

    { path: '**', redirectTo: '/notfound' },
]
