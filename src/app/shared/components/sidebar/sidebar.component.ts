import { ConstantesService } from '@/app/servicios/constantes.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { SidebarService } from '@/app/servicios/sidebar.service'
import { TokenStorageService } from '@/app/servicios/token.service'
import { CommonModule, NgFor } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { Router, RouterModule } from '@angular/router'

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [NgFor, RouterModule, CommonModule],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
    private _ConstantesService = inject(ConstantesService)
    private _LocalStoreService = inject(LocalStoreService)
    private _TokenStorageService = inject(TokenStorageService)
    private _SidebarService = inject(SidebarService)
    private _Router = inject(Router)

    menu: any = []
    isSidebarOpen = false

    ngOnInit() {
        const nav = this._ConstantesService.nav
        if (nav.length) {
            this.menu = nav[0]['items']
        }
        this._SidebarService.sidebarState$.subscribe((state) => {
            this.isSidebarOpen = state // Actualiza el estado local según el servicio
        })
    }

    closeSidebar() {
        this._SidebarService.closeSidebar()
    }

    isActive(route: string): boolean {
        return this._Router.url.includes(route) // Verifica si la URL actual incluye la ruta
    }
    isActiveS(route: string): boolean {
        console.log(route)
        console.log(this._Router.url)
        return this._Router.url.includes(route) // Verifica si la URL actual incluye la ruta
    }

    logout(): void {
        this._LocalStoreService.clear()
        this._TokenStorageService.signOut()
        window.location.reload()
    }
}
