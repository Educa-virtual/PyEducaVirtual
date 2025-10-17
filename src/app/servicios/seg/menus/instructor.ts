const inicio = {
  label: 'Inicio',
  icon: 'pi pi-fw pi-home',
  routerLink: ['/inicio'],
};

export const instructor = [
  {
    items: [
      inicio,
      {
        label: 'Mis capacitaciones',
        icon: 'pi pi-id-card',
        routerLink: ['/actualizacion-docente/curso-capacitaciones'],
      },
      {
        label: 'Mi repositorio',
        icon: 'pi pi-folder-open',
        routerLink: ['/actualizacion-docente/mi-repositorio'],
      },
      {
        label: 'Enlaces de ayuda',
        icon: 'pi pi-fw pi-share-alt',
        routerLink: ['ayuda'],
      },
    ],
  },
];
