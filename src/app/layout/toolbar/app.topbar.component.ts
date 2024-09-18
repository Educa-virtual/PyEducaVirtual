import { Component, ElementRef, ViewChild, OnInit } from '@angular/core'
import { MenuItem } from 'primeng/api'
import { LayoutService } from '../service/app.layout.service'
import { LocalStoreService } from '../../servicios/local-store.service'
import { TokenStorageService } from '../../servicios/token.service'
import { RouterLink } from '@angular/router'
import { DropdownModule } from 'primeng/dropdown'
import { FormsModule } from '@angular/forms'
import { NgClass } from '@angular/common'
import { MenuModule } from 'primeng/menu'
import {
    IRole,
    RolesDropdownComponent,
} from './roles-dropdown/roles-dropdown.component'

interface Profile {
    iProfile: number
    profile: string
}

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    standalone: true,
    imports: [
        RouterLink,
        DropdownModule,
        FormsModule,
        NgClass,
        MenuModule,
        RolesDropdownComponent,
    ],
})
export class AppTopBarComponent implements OnInit {
    items!: MenuItem[]
    profile: Profile[] | []
    public roles: IRole[] = [
        {
            id: '1',
            ieCodigo: '20542',
            nombre: 'JAVIER PEREZ DE CUELLAR',
            codigoModular: '050092-0',
            nivel: 'PRIMARIA',
            direccion: 'DRE LIMA PROVINCIAS',
            ugel: '15 HUAROCHIRI',
        },
        {
            id: '2',
            ieCodigo: '9999',
            nombre: 'JUAN PEREZ',
            codigoModular: '000000-0',
            nivel: 'SECUNDARIA',
            direccion: 'DRE MOQUEGUA PROVINCIAS',
            ugel: '17 ILO',
        },
    ]
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
            { iProfile: 1006, profile: 'Evaluaciones' },
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
