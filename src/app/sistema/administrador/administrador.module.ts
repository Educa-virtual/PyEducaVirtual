import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'auditoria',
    loadChildren: () =>
      import('./auditoria/auditoria.module').then(module => module.AuditoriaModule),
  },
  {
    path: 'componentes',
    loadChildren: () =>
      import('./componentes/componentes.module').then(module => module.AuditoriaModule),
  },
  {
    path: 'backup-bd',
    loadComponent: () => import('./backup-bd/backup-bd.component').then(m => m.BackupBdComponent),
    /*loadChildren: () =>
            import('./backu/componentes.module').then(
                (module) => module.BackupBdComponent
            ),*/
  },
  //REACTIVAR PORQUE ES EL NUEVO MODULO DE GESTION DE USUARIOS
  {
    path: 'gestion-usuarios',
    loadComponent: () =>
      import('./gestion-usuarios/lista-usuarios/lista-usuarios.component').then(
        m => m.ListaUsuariosComponent
      ),
  },

  {
    path: 'mantenimiento-curricula',
    loadComponent: () =>
      import('./mantenimiento/curriculas/curriculas.component').then(m => m.CurriculasComponent),
  },
  /*{
        path: 'gestion-usuarios',
        loadComponent: () =>
            import('./usuario/usuario.component').then(
                (m) => m.UsuarioComponent
            ),
    },*/
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministradorModule {}
