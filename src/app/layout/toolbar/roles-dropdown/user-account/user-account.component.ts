import { PrimengModule } from '@/app/primeng.module'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { MenuItem } from 'primeng/api'

@Component({
    selector: 'app-user-account',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './user-account.component.html',
    styleUrl: './user-account.component.scss',
})
export class UserAccountComponent implements OnInit {
    @Output() accionMenuItem = new EventEmitter()
    name: string
    constructor(private ConstantesService: ConstantesService) {
        this.name = this.ConstantesService.nombres
    }

    items: MenuItem[] | undefined
    ngOnInit() {
        this.items = [
            {
                items: [
                    {
                        label: 'Mi Perfil',
                        icon: 'pi pi-user',
                    },
                    {
                        label: 'Salir Sesión',
                        icon: 'pi pi-sign-out',
                        command: () => {
                            this.accionMenuItem.emit('logout')
                        },
                    },
                ],
            },
        ]
    }
    selectedProfile: undefined
    profile = []
}
