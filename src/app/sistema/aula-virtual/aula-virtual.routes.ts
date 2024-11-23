import { Routes } from '@angular/router'

const routes: Routes = [
    {
        path: '',
        redirectTo: 'areas-curriculares',
        pathMatch: 'full',
    },
    {
        path: 'areas-curriculares',
        loadChildren: () => import('./sub-modulos/cursos/cursos.routes'),
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
        path: 'banco-preguntas',
        loadComponent: () =>
            import(
                './sub-modulos/aula-banco-preguntas/aula-banco-pregunta-page/aula-banco-pregunta-page.component'
            ).then((m) => m.AulaBancoPreguntaPageComponent),
    },
]

export default routes
