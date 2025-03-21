import { AppTopBarComponent } from '@/app/layout/toolbar/app.topbar.component'
import { SidebarService } from '@/app/servicios/sidebar.service'
import { Component, inject } from '@angular/core'

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [AppTopBarComponent],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
    private _SidebarService = inject(SidebarService)

    toggleSidebar() {
        this._SidebarService.toggleSidebar() // Notifica a los componentes que están escuchando
    }
}
