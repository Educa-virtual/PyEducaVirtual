import { RoleGuard } from '@/app/shared/_guards/role.guard'
import { Routes } from '@angular/router'
import { DOCENTE, ESTUDIANTE } from '@/app/servicios/seg/perfiles'

const routes: Routes = [
    {
        path: '',
        redirectTo: 'areas-curriculares',
        pathMatch: 'full',
    },
    {
        path: 'areas-curriculares',
        loadChildren: () => import('./sub-modulos/cursos/cursos.routes'),
        canActivate: [RoleGuard],
        data: {
            expectedRole: [DOCENTE, ESTUDIANTE],
            breadcrumb: 'Áreas Curriculares',
            icon: 'pi pi-book',
        },
    },

    {
        path: 'recursos',
        loadChildren: () => import('./sub-modulos/recursos/recursos.routes'),
    },
    {
        path: 'calendario',
        loadChildren: () =>
            import('./sub-modulos/calendario/calendario.routes'),
    },
    {
        path: 'notificaciones',
        loadChildren: () =>
            import('./sub-modulos/notificaciones/notificaciones.routes'),
    },
    {
        path: 'banco-preguntas',
        loadComponent: () =>
            import(
                './sub-modulos/aula-banco-preguntas/aula-banco-pregunta-page/aula-banco-pregunta-page.component'
            ).then((m) => m.AulaBancoPreguntaPageComponent),
    },
]

export default routes
