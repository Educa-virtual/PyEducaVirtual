import { Routes } from '@angular/router'

// Configuración de rutas hijas
export const CHILDREN_ROUTES: Routes = [
    {
        path: 'nivel-pobreza',
        loadComponent: () =>
            import('./nivel-pobreza/nivel-pobreza.component').then(
                (m) => m.NivelPobrezaComponent
            ),
    },
    {
        path: 'salud',
        loadComponent: () =>
            import('./salud/salud.component').then((m) => m.SaludComponent),
    },
    /*{
        path: 'vivienda',
        loadComponent: () => import('./vivienda/vivienda.component').then(m => m.ViviendaComponent)
    },
    {
        path: 'economica',
        loadComponent: () => import('./economica/economica.component').then(m => m.EconomicaComponent)
    },
    {
        path: 'demografica',
        loadComponent: () => import('./demografica/demografica.component').then(m => m.DemograficaComponent)
    },
    {
        path: '',
        redirectTo: 'nivel-pobreza',
        pathMatch: 'full'
    }*/
]

// Array para el TabMenu del componente padre
export const TAB_MENU_ITEMS = [
    {
        label: 'Nivel de Pobreza',
        icon: 'pi pi-fw pi-chart-bar',
        route: '/bienestar/informe-estadistico/nivel-pobreza',
    },
    {
        label: 'Salud',
        icon: 'pi pi-fw pi-heart',
        route: '/bienestar/informe-estadistico/salud',
    },
    /*{
        label: 'Vivienda',
        icon: 'pi pi-fw pi-home',
        route: '/bienestar/informe-estadistico/vivienda',
    },
    {
        label: 'Económica',
        icon: 'pi pi-fw pi-wallet',
        route: '/bienestar/informe-estadistico/economica',
    },
    {
        label: 'Demográfica',
        icon: 'pi pi-fw pi-users',
        route: '/bienestar/informe-estadistico/demografica',
    },*/
]
