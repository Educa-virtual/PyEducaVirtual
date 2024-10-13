import { ConstantesService } from '@/app/servicios/constantes.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { Component, OnInit } from '@angular/core'
import { DialogModule } from 'primeng/dialog'
import { DropdownModule } from 'primeng/dropdown'

@Component({
    selector: 'app-inicio',
    standalone: true,
    templateUrl: './inicio.component.html',
    styleUrl: './inicio.component.scss',
    imports: [DialogModule, DropdownModule],
})
export class InicioComponent implements OnInit {
    name: string

    perfiles: any = []

    modalPerfiles: boolean = false
    perfilSeleccionado: any = {}

    constructor(
        private ConstantesService: ConstantesService,
        private lg: LocalStoreService
    ) {
        this.name = this.ConstantesService.nombres
    }

    ngOnInit() {
        this.obtenerPerfiles()
    }

    obtenerPerfiles() {
        const info = this.lg.getItem('dremoToken')
        this.perfiles = info.perfiles
        console.log('perfiles', this.perfiles)
        this.openModal()
    }

    openModal() {
        this.modalPerfiles = true
    }
    seleccionarPerfil(e) {
        const val = e.value
        const found = this.perfiles.find((item) => item.iPerfilId == val)
        console.log('found ', found)
        this.perfilSeleccionado = found
        this.modalPerfiles = false
    }
}
