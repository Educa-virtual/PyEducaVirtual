import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { PrimengModule } from '@/app/primeng.module'
import { MenuItem } from 'primeng/api'
import { NivelPobrezaComponent } from './nivel-pobreza/nivel-pobreza.component'
import { SaludComponent } from './salud/salud.component'

@Component({
    selector: 'app-informe-estadistico',
    standalone: true,
    imports: [PrimengModule, NivelPobrezaComponent, SaludComponent],
    templateUrl: './informe-estadistico.component.html',
    styleUrl: './informe-estadistico.component.scss',
})
export class InformeEstadisticoComponent implements OnInit {
    title: string = 'Informes y Estadístico'
    activeItem: any

    items = [
        {
            label: 'Nivel de Pobreza',
            icon: 'pi pi-fw pi-user',
            route: '/bienestar/informe-estadistico/nivel-pobreza',
        },
        {
            label: 'Salud',
            icon: 'pi pi-fw pi-users',
            route: '/bienestar/informe-estadistico/salud',
        },
        {
            label: 'Vivienda',
            icon: 'pi pi-fw pi-wallet',
            route: '/bienestar/informe-estadistico/vivienda',
        },
        {
            label: 'Económica',
            icon: 'pi pi-fw pi-wallet',
            route: '/bienestar/informe-estadistico/economica',
        },
        {
            label: 'Demográfica',
            icon: 'pi pi-fw pi-wallet',
            route: '/bienestar/informe-estadistico/demografica',
        },
    ]

    constructor(private router: Router) {}

    ngOnInit(): void {
        console.log('ngOnInit')
        //Redireccionar
        this.activeItem = this.items[0]
        this.router.navigate([this.activeItem.route])
        this.handleTabChange(this.activeItem)
    }

    handleTabChange(newItem: MenuItem) {
        console.log('Cambiando a:', newItem.label)
        this.activeItem = newItem
    }
}
