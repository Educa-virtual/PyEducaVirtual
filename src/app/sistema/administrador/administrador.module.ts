import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdministradorModule {}

