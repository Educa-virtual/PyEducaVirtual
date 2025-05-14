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
        path: 'gestion-usuarios',
        loadComponent: () =>
            import(
                './gestion-usuarios/lista-usuarios/lista-usuarios.component'
            ).then((m) => m.ListaUsuariosComponent),
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdministradorModule {}
