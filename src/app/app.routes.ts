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
import { SimpleListaAreasComponent } from './sistema/ere/evaluaciones/areas/simple-lista-areas/simple-lista-areas.component'
import { EspecialistaSimpleAreaComponent } from './sistema/ere/evaluaciones/areas/especialista-simple-area/especialista-simple-area.component'
import { AsignarRolPersonalComponent } from './sistema/gestion-institucional/new-mantenimiento-usuario/asignar-rol-personal/asignar-rol-personal.component'
import { AgregarPersonalPlataformaComponent } from './sistema/gestion-institucional/new-mantenimiento-usuario/agregar-personal-plataforma/agregar-personal-plataforma.component'
import { AuxiliarComponent } from './sistema/administrativo/auxiliar/auxiliar.component'
import { CategoriasEncuestaComponent } from './sistema/encuestas/categorias/categorias-encuestas.component'
import { ListaCategoriasComponent } from './sistema/encuestas/lista-categorias/lista-categorias.component'
import { AccesoEncuestaComponent } from './sistema/encuestas/lista-categorias/acceso-encuesta/acceso-encuesta.component'
import { InformacionGeneralComponent } from './sistema/encuestas/lista-categorias/gestion-encuesta-configuracion/informacion-general/informacion-general.component'
import { EstudianteEncuestaComponent } from './sistema/encuestas/estudiante-encuesta/estudiante-encuesta.component'
import { LlenadoPreguntasEncuestaComponent } from './sistema/encuestas/encuestas-por-categoria/llenado-preguntas-encuesta/llenado-preguntas-encuesta.component'
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
                        './sistema/usuarios/sin-rol-asignado/sin-rol-asignado.routes'
                    ),
            },
            {
                path: 'encuestas',
                loadChildren: () =>
                    import('./sistema/encuestas/encuestas.routes'),
            },
            {
                path: 'actualizacion-docente',
                loadChildren: () =>
                    import(
                        './sistema/actualizacion-docente/actualizacion-docente.routes'
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
                component: AuxiliarComponent,
            },
            // encuestas
            {
                path: 'categorias-encuesta',
                component: CategoriasEncuestaComponent,
            },
            {
                path: 'lista-categoria',
                component: ListaCategoriasComponent,
            },
            // informacion general
            {
                path: 'informacion-general',
                component: InformacionGeneralComponent,
            },
            // llnado preguntas encuesta
            {
                path: 'llenado-pregunta-encuesta',
                component: LlenadoPreguntasEncuestaComponent,
            },
            // encuestas por categoria
            //{
            //  path: 'encuesta-por-categoria',
            //component: EncuestasPorCategoriaComponent,
            //},
            // lista de encuestas

            // llenado pregunta encuesta

            /*
            // Gestion-encuesta-configuacion
            {
                path: 'gestion-encuesta-configuacion',
                component: GestionEncuestaConfiguracionComponent,
            },
            ,*/
            {
                path: 'acceso-encuesta',
                component: AccesoEncuestaComponent,
            },
            {
                path: 'estudiante-encuesta',
                component: EstudianteEncuestaComponent,
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
        path: 'bienestar',

        loadChildren: () => import('./sistema/bienestar/bienestar.routes'),
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
