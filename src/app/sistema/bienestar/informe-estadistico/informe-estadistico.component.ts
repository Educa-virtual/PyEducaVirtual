import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { PrimengModule } from '@/app/primeng.module'
import { MenuItem } from 'primeng/api'

@Component({
    selector: 'app-informe-estadistico',
    standalone: true,
    imports: [PrimengModule],
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
            //route: '/bienestar/ficha/familia',
        },
        {
            label: 'Vivienda',
            icon: 'pi pi-fw pi-wallet',
            //route: '/bienestar/ficha/economico',
        },
        {
            label: 'Económica',
            icon: 'pi pi-fw pi-wallet',
            //route: '/bienestar/ficha/economico',
        },
        {
            label: 'Demográfica',
            icon: 'pi pi-fw pi-wallet',
            //route: '/bienestar/ficha/economico',
        },
    ]

    constructor(private router: Router) {}

    ngOnInit(): void {
        console.log('ngOnInit')
        //this.activeItem = this.items[0]
        //Redireccionar
        //this.router.navigate(['/bienestar/informe-estadistico/nivel-pobreza'])
        this.activeItem = this.items[0]
    }

    handleTabChange(newItem: MenuItem) {
        console.log('Cambiando a:', newItem.label)
        this.activeItem = newItem
    }
}
