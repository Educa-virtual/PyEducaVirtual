import { Routes } from '@angular/router'

import { LoginComponent } from './shared/login/login.component'

import { NotfoundComponent } from './demo/components/notfound/notfound.component'

export const routes: Routes = [
    {
        path: '',

        children: [
            {
                path: '',

                loadChildren: () =>
                    import('./demo/components/dashboard/dashboard.module').then(
                        (m) => m.DashboardModule
                    ),
            },

            {
                path: 'uikit',

                loadChildren: () =>
                    import('./demo/components/uikit/uikit.module').then(
                        (m) => m.UIkitModule
                    ),
            },

            {
                path: 'utilities',

                loadChildren: () =>
                    import('./demo/components/utilities/utilities.module').then(
                        (m) => m.UtilitiesModule
                    ),
            },

            {
                path: 'documentation',

                loadChildren: () =>
                    import(
                        './demo/components/documentation/documentation.module'
                    ).then((m) => m.DocumentationModule),
            },

            {
                path: 'blocks',

                loadChildren: () =>
                    import(
                        './demo/components/primeblocks/primeblocks.module'
                    ).then((m) => m.PrimeBlocksModule),
            },

            {
                path: 'pages',

                loadChildren: () =>
                    import('./demo/components/pages/pages.module').then(
                        (m) => m.PagesModule
                    ),
            },

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
        ],
    },

    { path: 'login', component: LoginComponent },

    {
        path: 'configuracion',

        loadChildren: () =>
            import('./sistema/configuracion/configuracion.module').then(
                (m) => m.ConfiguracionModule
            ),
    },

    {
        path: 'auth',

        loadChildren: () =>
            import('./demo/components/auth/auth.module').then(
                (m) => m.AuthModule
            ),
    },

    {
        path: 'landing',

        loadChildren: () =>
            import('./demo/components/landing/landing.module').then(
                (m) => m.LandingModule
            ),
    },

    { path: 'notfound', component: NotfoundComponent },

    { path: '**', redirectTo: '/notfound' },
]
