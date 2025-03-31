import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

const routes: Routes = [
    {
        path: 'auditoria',
        loadChildren: () =>
            import('./auditoria/auditoria.module').then(
                (module) => module.AuditoriaModule
            ),
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
