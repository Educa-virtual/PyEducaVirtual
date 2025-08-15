const inicio = {
  label: 'Inicio',
  icon: 'pi pi-fw pi-home',
  routerLink: [''],
};

/*export const evaluacionesEre = {
    label: 'Evaluaciones ERE',
    icon: 'pi pi-fw pi-check-square',
    routerLink: ['/ere/evaluaciones'],
}*/

export const reportesEre = {
  label: 'Reportes ERE',
  icon: 'pi pi-fw pi-file-pdf',
  routerLink: ['/ere/reportes'],
};

export const administradorDremo = [
  {
    items: [
      inicio,
      /*{
                label: 'Sincronizar SIAGIE',
                icon: 'pi pi-fw pi-sync',
                routerLink: ['/evaluaciones'],
            },*/
      {
        label: 'ERE',
        icon: 'pi pi-pen-to-square',
        items: [
          {
            label: 'Resultados',
            icon: 'pi pi-chart-bar',
            routerLink: ['/ere/informes-ere'],
          },
          {
            label: 'Comparar resultados',
            icon: 'pi pi-chart-bar',
            routerLink: ['/ere/informes-comparar-ere'],
          },
          {
            label: 'Evaluaciones',
            icon: 'pi pi-list-check',
            routerLink: ['/ere/evaluaciones'],
          },
        ],
      },

      {
        label: 'Especialistas DREMO',
        icon: 'pi pi-user',
        //routerLink: ['/ere/especialista-dremo'],
        items: [
          {
            label: 'Asignar áreas',
            icon: 'pi pi-fw pi-circle',
            routerLink: ['./ere/especialistas-dremo/asignar-areas'],
          },
        ],
      },
      {
        label: 'Especialistas UGEL',
        icon: 'pi pi-sitemap',
        //routerLink: ['/ere/administrar'],
        items: [
          {
            label: 'Asignar áreas',
            icon: 'pi pi-fw pi-circle',
            routerLink: ['./ere/especialistas-ugel/asignar-areas'],
          },
        ],
      },
      // {
      //     label: 'Mantenimiento',
      //     icon: 'pi pi-sitemap',
      //     //routerLink: ['/ere/administrar'],
      //     items: [
      //         {
      //             label: 'Curriculas',
      //             icon: 'pi pi-fw pi-circle',
      //             routerLink: [
      //                 './administrador/mantenimiento/curriculas',
      //             ],
      //         },
      //     ],
      // },

      {
        label: 'Actualizacion Docente',
        icon: 'pi pi-id-card',
        items: [
          {
            label: 'Capacitaciones',
            icon: 'pi pi-book',
            routerLink: ['/actualizacion-docente/capacitaciones'],
          },
          {
            label: 'Instructores',
            icon: 'pi pi-user',
            routerLink: ['/actualizacion-docente/instructores'],
          },
          {
            label: 'Resultados del curso',
            icon: 'pi pi-user',
            routerLink: ['/actualizacion-docente/resultados'],
          },
        ],
      },
      {
        label: 'Bienestar Social',
        icon: 'pi pi-fw pi-check-square',
        items: [
          {
            label: 'Recordatorios de cumpleaños',
            icon: 'pi pi-fw pi-bell',
            routerLink: ['/bienestar/recordario-fechas'],
          },
          {
            label: 'Seguimiento de bienestar',
            icon: 'pi pi-fw pi-eye',
            routerLink: ['/bienestar/seguimiento-bienestar'],
          },
          {
            label: 'Informes y estadística',
            icon: 'pi pi-fw pi-chart-line',
            routerLink: ['/bienestar/informe-estadistico'],
          },
        ],
      },
      {
        label: 'Mantenimiento I.E.',
        icon: 'pi pi-wrench',
        routerLink: ['/mantenimiento-ie'],
      },
      {
        label: 'Enlaces de ayuda',
        icon: 'pi pi-fw pi-share-alt',
        routerLink: ['ayuda'],
      },
    ],
  },
];

export const especialistaDremo = [
  {
    items: [
      inicio,
      {
        label: 'ERE',
        icon: 'pi pi-pen-to-square',
        items: [
          {
            label: 'Resultados',
            icon: 'pi pi-chart-bar',
            routerLink: ['/ere/informes-ere'],
          },
          {
            label: 'Comparar resultados',
            icon: 'pi pi-chart-bar',
            routerLink: ['/ere/informes-comparar-ere'],
          },
          {
            label: 'Evaluaciones',
            icon: 'pi pi-list-check',
            routerLink: ['/ere/evaluaciones'],
          },
        ],
      },
      {
        label: 'Bienestar Social',
        icon: 'pi pi-fw pi-check-square',
        items: [
          {
            label: 'Gestionar encuestas',
            icon: 'pi pi-fw pi-list-check',
            routerLink: ['/bienestar/gestionar-encuestas'],
          },
          {
            label: 'Recordatorios de cumpleaños',
            icon: 'pi pi-fw pi-bell',
            routerLink: ['/bienestar/recordario-fechas'],
          },
          {
            label: 'Seguimiento de bienestar',
            icon: 'pi pi-fw pi-eye',
            routerLink: ['/bienestar/seguimiento-bienestar'],
          },
          {
            label: 'Informes y estadística',
            icon: 'pi pi-fw pi-chart-line',
            routerLink: ['/bienestar/informe-estadistico'],
          },
        ],
      },
      {
        label: 'Enlaces de ayuda',
        icon: 'pi pi-fw pi-share-alt',
        routerLink: ['ayuda'],
      },
    ],
  },
];

export const especialistaUgel = [
  {
    items: [
      inicio,
      {
        label: 'ERE',
        icon: 'pi pi-pen-to-square',
        items: [
          {
            label: 'Resultados',
            icon: 'pi pi-chart-bar',
            routerLink: ['/ere/informes-ere'],
          },
          {
            label: 'Comparar resultados',
            icon: 'pi pi-chart-bar',
            routerLink: ['/ere/informes-comparar-ere'],
          },
          {
            label: 'Evaluaciones',
            icon: 'pi pi-list-check',
            routerLink: ['/ere/evaluaciones'],
          },
        ],
      },
      reportesEre,
      {
        label: 'Enlaces de ayuda',
        icon: 'pi pi-fw pi-share-alt',
        routerLink: ['ayuda'],
      },
    ],
  },
];

/* // app.routes.ts

{
  label: 'Mantenimiento I.E.',
  icon: 'pi pi-wrench',
  routerLink: ['/mantenimiento-ie'], // Agregar la barra inicial
},

{
  label: 'Mantenimiento I.E.',
  icon: 'pi pi-wrench',
  routerLink: ['/mantenimiento-ie'], // Solo agregar la barra inicial
},
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'inicio', loadComponent: () => import('./components/inicio/inicio.component').then(m => m.InicioComponent) },
  
  // Rutas ERE
  { path: 'ere/informes-ere', loadComponent: () => import('./components/ere/informes-ere/informes-ere.component').then(m => m.InformesEreComponent) },
  { path: 'ere/informes-comparar-ere', loadComponent: () => import('./components/ere/comparar-ere/comparar-ere.component').then(m => m.CompararEreComponent) },
  { path: 'ere/evaluaciones', loadComponent: () => import('./components/ere/evaluaciones/evaluaciones.component').then(m => m.EvaluacionesComponent) },
  { path: 'ere/reportes', loadComponent: () => import('./components/ere/reportes/reportes.component').then(m => m.ReportesComponent) },
  { path: 'ere/especialistas-dremo/asignar-areas', loadComponent: () => import('./components/especialistas/dremo-asignar-areas/dremo-asignar-areas.component').then(m => m.DremoAsignarAreasComponent) },
  { path: 'ere/especialistas-ugel/asignar-areas', loadComponent: () => import('./components/especialistas/ugel-asignar-areas/ugel-asignar-areas.component').then(m => m.UgelAsignarAreasComponent) },
  
  // Rutas Actualización Docente
  { path: 'actualizacion-docente/capacitaciones', loadComponent: () => import('./components/actualizacion-docente/capacitaciones/capacitaciones.component').then(m => m.CapacitacionesComponent) },
  { path: 'actualizacion-docente/instructores', loadComponent: () => import('./components/actualizacion-docente/instructores/instructores.component').then(m => m.InstructoresComponent) },
  { path: 'actualizacion-docente/resultados', loadComponent: () => import('./components/actualizacion-docente/resultados/resultados.component').then(m => m.ResultadosComponent) },
  
  // Rutas Bienestar Social
  { path: 'bienestar/recordario-fechas', loadComponent: () => import('./components/bienestar/recordatorio-fechas/recordatorio-fechas.component').then(m => m.RecordatorioFechasComponent) },
  { path: 'bienestar/seguimiento-bienestar', loadComponent: () => import('./components/bienestar/seguimiento/seguimiento.component').then(m => m.SeguimientoComponent) },
  { path: 'bienestar/informe-estadistico', loadComponent: () => import('./components/bienestar/informe-estadistico/informe-estadistico.component').then(m => m.InformeEstadisticoComponent) },
  { path: 'bienestar/gestionar-encuestas', loadComponent: () => import('./components/bienestar/gestionar-encuestas/gestionar-encuestas.component').then(m => m.GestionarEncuestasComponent) },
  
  // RUTA PARA MANTENIMIENTO I.E. - AQUÍ ES DONDE LA AGREGAS
  { path: 'mantenimiento-ie', loadComponent: () => import('./components/mantenimiento-ie/mantenimiento-ie.component').then(m => m.MantenimientoIeComponent) },
  
  // Ruta de ayuda
  { path: 'ayuda', loadComponent: () => import('./components/ayuda/ayuda.component').then(m => m.AyudaComponent) },
  
  // Ruta wildcard
  { path: '**', redirectTo: '/inicio' }
]; 
  // Ruta para el componente de mantenimiento existente
  { 
    path: 'mantenimiento-ie', 
    loadComponent: () => import('./sistema/gestion-institucional/mantenimiento/mantenimiento.component').then(m => m.MantenimientoComponent)
  },

  // app.routes.ts
export const routes: Routes = [
  // ... otras rutas
  
  { 
    path: 'mantenimiento-ie', 
    loadComponent: () => import('./sistema/gestion-institucional/mantenimiento-ie/mantenimiento-ie.component').then(m => m.MantenimientoIeComponent)
  },
  
  // ... resto de rutas
];
  {
  label: 'Mantenimiento I.E.',
  icon: 'pi pi-wrench',
  routerLink: ['/mantenimiento-ie'], // Solo agregar la barra inicial
},
*/
