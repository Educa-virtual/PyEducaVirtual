import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
//import { MantenimientoComponent } from '../gestion-institucional/mantenimiento/mantenimiento.component'
import { MantenimientoNivelComponent } from './mantenimiento/mantenimiento-nivel/mantenimiento-nivel.component'
import { MantenimientoCicloComponent } from './mantenimiento/mantenimiento-ciclo/mantenimiento-ciclo.component'
import { RegistroNivelesComponent } from './mantenimiento/registro-niveles/registro-niveles.component'
import { RegistroNivelesTiposComponent } from './mantenimiento/registro-niveles-tipos/registro-niveles-tipos.component'
import { RegistroNivelCicloComponent } from './mantenimiento/registro-nivel-ciclo/registro-nivel-ciclo.component'
import { RegistroGradosComponent } from './mantenimiento/registro-grados/registro-grados.component'

const routes: Routes = [
    {
        path: 'auditoria',
        loadChildren: () =>
            import('./auditoria/auditoria.module').then(
                (module) => module.AuditoriaModule
            ),
    },

    {
        path: 'mantenimiento',
        children: [
            { path: 'nivel', component: MantenimientoNivelComponent }, // Ruta directa

            {
                //Rutas hijas
                path: 'ciclo',
                component: MantenimientoCicloComponent,
                children: [
                    { path: '', redirectTo: 'nivel', pathMatch: 'full' },
                    {
                        path: 'registro-niveles',
                        component: RegistroNivelesComponent,
                    },
                    {
                        path: 'registro-niveles-tipos',
                        component: RegistroNivelesTiposComponent,
                    },
                    {
                        path: 'registro-nivel-ciclo',
                        component: RegistroNivelCicloComponent,
                    },
                    {
                        path: 'registro-grados',
                        component: RegistroGradosComponent,
                    },
                ],
            },
        ],
    },

    {
        path: 'componentes',
        loadChildren: () =>
            import('./componentes/componentes.module').then(
                (module) => module.AuditoriaModule
            ),
    },
    {
        path: 'backup-bd',
        loadComponent: () =>
            import('./backup-bd/backup-bd.component').then(
                (m) => m.BackupBdComponent
            ),
        /*loadChildren: () =>
            import('./backu/componentes.module').then(
                (module) => module.BackupBdComponent
            ),*/
    },
    {
        path: 'gestion-usuario',
        loadComponent: () =>
            import('./usuario/usuario.component').then(
                (m) => m.UsuarioComponent
            ),
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdministradorModule {}
