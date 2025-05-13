import { PrimengModule } from '@/app/primeng.module'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { MenuItem } from 'primeng/api'

@Component({
    selector: 'app-user-account',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './user-account.component.html',
    styleUrl: './user-account.component.scss',
})
export class UserAccountComponent implements OnInit {
    @Output() actionTopBar = new EventEmitter()

    @Input() modulos = []
    @Input() roles = []
    @Input() selectedModulo: string //perfil seleccionado

    name: string

    constructor(private ConstantesService: ConstantesService) {
        this.name = this.ConstantesService.nombres
        // this.cPerfilNombre = this.selectedModulo[0]['cPerfilNombre']
    }

    items: MenuItem[] | undefined
    ngOnInit() {
        // console.log(this.selectedModulo, 'selectedModulo')
        // this.cPerfilNombre = this.selectedModulo[0]['cPerfilNombre']

        this.items = [
            {
                items: [
                    // {
                    //     label: 'Mi Perfil',
                    //     icon: 'pi pi-user',
                    // },
                    {
                        label: 'Cambiar contraseña',
                        icon: 'pi pi-bars',
                        command: () => {
                            this.actionTopBar.emit({ accion: 'logout' })
                        },
                    },
                    {
                        label: 'Salir sesión',
                        icon: 'pi pi-sign-out',
                        command: () => {
                            this.actionTopBar.emit({ accion: 'logout' })
                        },
                    },
                ],
            },
        ]
    }

    changePerfil() {
        const data = {
            accion: 'modulo',
            item: this.modulos.find(
                (item) => item.iModuloId === this.selectedModulo
            ),
        }
        this.actionTopBar.emit(data)
    }
}
