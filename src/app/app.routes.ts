import { Routes } from '@angular/router';

import { LoginComponent } from './shared/login/login.component';
import { VerificacionComponent } from './shared/verificacion/verificacion.component';
import { InicioComponent } from './sistema/inicio/inicio.component';
import { NotfoundComponent } from './shared/notfound/notfound.component';
import { RecoverPasswordComponent } from './shared/recover-password/recover-password.component';
import { EnlacesAyudaComponent } from './enlaces-ayuda/enlaces-ayuda.component';
import { NewMantenimientoUsuarioComponent } from './sistema/gestion-institucional/new-mantenimiento-usuario/new-mantenimiento-usuario.component';

import { RecursosComponent } from './sistema/ere/informes-ere/recursos-ere/recursos.component';
import { SimpleListaAreasComponent } from './sistema/ere/evaluaciones/areas/simple-lista-areas/simple-lista-areas.component';
import { EspecialistaSimpleAreaComponent } from './sistema/ere/evaluaciones/areas/especialista-simple-area/especialista-simple-area.component';
import { AsignarRolPersonalComponent } from './sistema/gestion-institucional/new-mantenimiento-usuario/asignar-rol-personal/asignar-rol-personal.component';
import { AgregarPersonalPlataformaComponent } from './sistema/gestion-institucional/new-mantenimiento-usuario/agregar-personal-plataforma/agregar-personal-plataforma.component';
import { AsistenciasComponent } from './sistema/administrativo/auxiliar/asistencias/asistencias.component';
import { ReporteAsistenciasComponent } from './sistema/administrativo/auxiliar/reporte-asistencias/reporte-asistencias.component';
import { EstudiantesApoderadosComponent } from './sistema/gestion-institucional/matriculas/gestionar-matriculas/estudiantes-apoderados/estudiantes-apoderados.component';
import { RoleGuard } from '@/app/shared/_guards/role.guard';
import { ASISTENTE_SOCIAL, DOCENTE } from '@/app/servicios/seg/perfiles';
import { AUXILIAR } from './servicios/perfilesConstantes';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent },
  {
    path: '',
    children: [
      {
        path: 'docente',
        loadChildren: () => import('./sistema/docente/docente.module').then(m => m.DocenteModule),
      },
      {
        path: 'aula-virtual',
        loadChildren: () => import('./sistema/aula-virtual/aula-virtual.routes'),
      },
      {
        path: 'evaluaciones',
        loadChildren: () => import('./sistema/evaluaciones/evaluaciones.routes'),
      },
      {
        path: 'ere',
        loadChildren: () => import('./sistema/ere/ere.routes'),
      },
      {
        path: 'buzon-sugerencias',
        loadChildren: () => import('./sistema/buzon-sugerencias/buzon-sugerencias.routes'),
      },
      {
        path: 'estudiante',
        loadChildren: () => import('./sistema/estudiante/estudiante.routes'),
      },
      // Ruta de Especialista
      {
        path: 'especialista-ugel',
        loadChildren: () => import('./sistema/especialista-ugel/especialista-ugel.routes'),
      },
      // ruta de rol asignado
      {
        path: 'sin-rol-asignado',
        loadChildren: () => import('./sistema/usuarios/sin-rol-asignado/sin-rol-asignado.routes'),
      },
      {
        path: 'encuestas',
        loadChildren: () => import('./sistema/encuestas/encuestas.routes'),
      },
      {
        path: 'actualizacion-docente',
        loadChildren: () => import('./sistema/actualizacion-docente/actualizacion-docente.routes'),
      },
      {
        path: 'new-mantenimiento-usuario',
        component: NewMantenimientoUsuarioComponent,
      },
      {
        path: 'recursos',
        component: RecursosComponent,
      },
      {
        path: 'simple-lista-areas',
        component: SimpleListaAreasComponent,
      },
      {
        path: 'especialista-simple-area',
        component: EspecialistaSimpleAreaComponent,
      },
      {
        path: 'asignar-rol-personal',
        component: AsignarRolPersonalComponent,
      },
      {
        path: 'agregar-personal-platafoma',
        component: AgregarPersonalPlataformaComponent,
      },
      {
        path: 'asistencia-auxiliar',
        component: AsistenciasComponent,
      },
      {
        path: 'reporte-asistencia-auxiliar',
        component: ReporteAsistenciasComponent,
      },
      {
        path: 'estudiantes-apoderados',
        component: EstudiantesApoderadosComponent,
        canActivate: [RoleGuard],
        data: {
          breadcrumb: '',
          icon: 'pi pi-list-check',
          expectedRole: [DOCENTE, AUXILIAR, ASISTENTE_SOCIAL],
        },
      },
    ],
  },
  {
    path: 'especialista-ugel',
    loadChildren: () => import('./sistema/especialista-ugel/especialista-ugel.routes'),
  },
  { path: 'login', component: LoginComponent },
  { path: 'ayuda', component: EnlacesAyudaComponent },
  { path: 'verificacion', component: VerificacionComponent },
  { path: 'recover-password', component: RecoverPasswordComponent },
  {
    path: 'configuracion',
    loadChildren: () =>
      import('./sistema/configuracion/configuracion.module').then(m => m.ConfiguracionModule),
  },
  {
    path: 'administrador',
    loadChildren: () =>
      import('./sistema/administrador/administrador.module').then(m => m.AdministradorModule),
  },
  {
    path: 'gestion-institucional',
    loadChildren: () =>
      import('./sistema/gestion-institucional/gestion-institucional.module').then(
        m => m.GestionInstitucionalModule
      ),
  },
  {
    path: 'horario',
    loadChildren: () =>
      import('./sistema/gestion-institucional/horario/horario.module').then(m => m.HorarioModule),
  },
  {
    path: 'bienestar',

    loadChildren: () => import('./sistema/bienestar/bienestar.routes'),
  },
  {
    path: 'apoderado',
    loadChildren: () => import('./sistema/apoderado/apoderado.module').then(m => m.ApoderadoModule),
  },
  { path: 'notfound', component: NotfoundComponent },
  { path: '**', redirectTo: '/notfound', pathMatch: 'full' },
];
