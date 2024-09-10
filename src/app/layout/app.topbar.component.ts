import { Component, ElementRef, ViewChild, OnInit } from '@angular/core'
import { MenuItem } from 'primeng/api'
import { LayoutService } from './service/app.layout.service'
import { LocalStoreService } from '../servicios/local-store.service'
import { TokenStorageService } from '../servicios/token.service'

interface Profile {
    iProfile: number
    profile: string
}

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent implements OnInit {
    items!: MenuItem[]
    profile: Profile[] | []
    selectedProfile: Profile | undefined

    @ViewChild('menubutton') menuButton!: ElementRef

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef

    @ViewChild('topbarmenu') menu!: ElementRef

    constructor(
        public layoutService: LayoutService,
        private store: LocalStoreService,
        private tokenStorageService: TokenStorageService
    ) {}

    ngOnInit() {
        this.selectedProfile = this.store.getItem('dremoPerfil')
        this.profile = [
            { iProfile: 1001, profile: 'Docente' },
            { iProfile: 1002, profile: 'Estudiante' },
            { iProfile: 1003, profile: 'Aula Virtual' },
            { iProfile: 1004, profile: 'Otro' },
            { iProfile: 1005, profile: 'Administrador' },
        ]
        this.items = [
            {
                // label: 'Options',
                items: [
                    {
                        label: 'Cerrar Sesión',
                        icon: 'pi pi-sign-out',
                        command: () => this.logout(),
                    },
                ],
            },
        ]
    }

    changeProfile(event) {
        this.store.setItem('dremoPerfil', event.value)
        setTimeout(() => {
            window.location.reload()
        }, 200)
    }

    logout(): void {
        this.tokenStorageService.signOut()
        window.location.reload()
    }
}
