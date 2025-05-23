import { Routes } from '@angular/router'

import { LoginComponent } from './shared/login/login.component'
import { VerificacionComponent } from './shared/verificacion/verificacion.component'
import { InicioComponent } from './sistema/inicio/inicio.component'
import { NotfoundComponent } from './shared/notfound/notfound.component'
import { RecoverPasswordComponent } from './shared/recover-password/recover-password.component'
import { EnlacesAyudaComponent } from './enlaces-ayuda/enlaces-ayuda.component'
import { NewMantenimientoUsuarioComponent } from './sistema/gestion-institucional/new-mantenimiento-usuario/new-mantenimiento-usuario.component'
import { BuzonDirectorComponent } from './sistema/director/buzon-director/buzon-director.component'
import { RecursosComponent } from './sistema/ere/informes-ere/recursos-ere/recursos.component'

export const routes: Routes = [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    { path: 'inicio', component: InicioComponent },
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
            {
                path: 'ere',
                loadChildren: () => import('./sistema/ere/ere.routes'),
            },
            {
                path: 'estudiante',
                loadChildren: () =>
                    import('./sistema/estudiante/estudiante.routes'),
            },
            // Ruta de Especialista
            {
                path: 'especialista-ugel',
                loadChildren: () =>
                    import(
                        './sistema/especialista-ugel/especialista-ugel.routes'
                    ),
            },
            // ruta de rol asignado
            {
                path: 'sin-rol-asignado',
                loadChildren: () =>
                    import(
                        './sistema/sin-rol-asignado/sin-rol-asignado.routes'
                    ),
            },
            {
                path: 'new-mantenimiento-usuario',
                component: NewMantenimientoUsuarioComponent,
            },
            {
                path: 'buzon-director',
                component: BuzonDirectorComponent,
            },
            {
                path: 'recursos',
                component: RecursosComponent,
            },
        ],
    },
    {
        path: 'especialista-ugel',
        loadChildren: () =>
            import('./sistema/especialista-ugel/especialista-ugel.routes'),
    },
    { path: 'login', component: LoginComponent },
    { path: 'ayuda', component: EnlacesAyudaComponent },
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
        path: 'administrador',
        loadChildren: () =>
            import('./sistema/administrador/administrador.module').then(
                (m) => m.AdministradorModule
            ),
    },
    {
        path: 'gestion-institucional',
        loadChildren: () =>
            import(
                './sistema/gestion-institucional/gestion-institucional.module'
            ).then((m) => m.GestionInstitucionalModule),
    },
    {
        path: 'horario',
        loadChildren: () =>
            import(
                './sistema/gestion-institucional/horario/horario.module'
            ).then((m) => m.HorarioModule),
    },
    {
        path: 'apoderado',
        loadChildren: () =>
            import('./sistema/apoderado/apoderado.module').then(
                (m) => m.ApoderadoModule
            ),
    },
    { path: 'notfound', component: NotfoundComponent },
    { path: '**', redirectTo: '/notfound', pathMatch: 'full' },
]
