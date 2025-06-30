import { Component } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'

@Component({
    selector: 'app-informe-estadistico',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './informe-estadistico.component.html',
    styleUrl: './informe-estadistico.component.scss',
})
export class InformeEstadisticoComponent {
    title: string = 'Informes y Estadístico'
    activeItem: any

    items = [
        {
            label: 'Nivel de Pobreza',
            icon: 'pi pi-fw pi-user',
            route: '/bienestar/ficha/general',
        },
        {
            label: 'Salud',
            icon: 'pi pi-fw pi-users',
            route: '/bienestar/ficha/familia',
        },
        {
            label: 'Vivienda',
            icon: 'pi pi-fw pi-wallet',
            route: '/bienestar/ficha/economico',
        },
        {
            label: 'Económica',
            icon: 'pi pi-fw pi-wallet',
            route: '/bienestar/ficha/economico',
        },
        {
            label: 'Demográfica',
            icon: 'pi pi-fw pi-wallet',
            route: '/bienestar/ficha/economico',
        },
    ]
}
