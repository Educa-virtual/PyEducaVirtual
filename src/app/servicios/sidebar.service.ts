import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class SidebarService {
    // BehaviorSubject mantiene el estado del sidebar
    private sidebarState = new BehaviorSubject<boolean>(false) // Inicia cerrado

    // Observable que los componentes pueden suscribirse
    sidebarState$ = this.sidebarState.asObservable()

    constructor() {}

    // Abre el sidebar
    openSidebar() {
        this.sidebarState.next(true)
    }

    // Cierra el sidebar
    closeSidebar() {
        this.sidebarState.next(false)
    }

    // Alterna el estado (abre/cierra)
    toggleSidebar() {
        this.sidebarState.next(!this.sidebarState.value)
    }
}
