import { PrimengModule } from '@/app/primeng.module'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { TokenStorageService } from '@/app/servicios/token.service'
import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
    selector: 'app-form-perfiles',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './form-perfiles.component.html',
    styleUrl: './form-perfiles.component.scss',
})
export class FormPerfilesComponent {
    @Output() accionBtnItem = new EventEmitter()
    @Input() showModal: boolean

    perfiles = []
    perfilSeleccionado: any = {}
    name: string
    constructor(
        private store: LocalStoreService,
        private ConstantesService: ConstantesService,
        private tokenStorageService: TokenStorageService
    ) {
        this.name = this.ConstantesService.nombres
        const user = this.store.getItem('dremoUser')
        this.perfiles = user ? user.perfiles : this.logout()
    }

    changePerfil(perfiles): void {
        this.store.setItem('dremoModalPerfil', false)
        this.store.setItem('dremoPerfil', perfiles)
        setTimeout(() => {
            window.location.reload()
        }, 200)
    }
    closeModal() {
        this.accionBtnItem.emit({ accion: 'close-modal', item: [] })
    }
    logout(): void {
        this.store.clear()
        this.tokenStorageService.signOut()
        window.location.reload()
    }
}
