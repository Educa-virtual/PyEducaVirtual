const inicio = {
  label: 'Inicio',
  icon: 'pi pi-fw pi-home',
  // routerLink: [''],
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
      {
        label: 'Administracion',
        icon: 'pi pi-fw pi-home',
        // routerLink: [''],
      },
      // inicio,
      {
        label: 'Administrador IE',
        icon: 'pi pi-warehouse',
        items: [
          {
            label: 'Gestión de feriados nacionales',
            icon: 'pi pi-calendar',
            routerLink: ['/gestion-institucional/fechas-nacionales'],
          },
          {
            label: 'Gestión del año académico',
            icon: 'pi pi-calendar-clock',
            routerLink: ['/gestion-institucional/years-academicos'],
          },
          {
            label: 'Gestión de ciclos',
            icon: 'pi pi-stopwatch',
            routerLink: ['/gestion-institucional/ciclo'],
          },
        ],
      },
      {
        label: 'Mantenimiento IE',
        icon: 'pi pi-config',
        items: [
          {
            label: 'Curricula',
            icon: 'pi pi-star',
            routerLink: ['/administrador/mantenimiento-curricula'],
          },
        ],
      },
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
            label: 'Solicitudes',
            icon: 'pi pi-file-plus',
            routerLink: ['/actualizacion-docente/solicitudes'],
          },
          {
            label: 'Instructores',
            icon: 'pi pi-user',
            routerLink: ['/actualizacion-docente/instructores'],
          },
          {
            label: 'Mantenimiento',
            icon: 'pi pi-fw pi-cog',
            items: [
              {
                label: 'Tipos de público',
                icon: 'pi pi-users',
                routerLink: ['/actualizacion-docente/mantenimiento/tipos-publico'],
              },
            ],
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
