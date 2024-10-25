import { Component } from '@angular/core'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'

@Component({
    selector: 'app-especialista-ugel',
    standalone: true,
    templateUrl: './especialista-ugel.component.html',
    styleUrls: ['./especialista-ugel.component.scss'],
})
export class EspecialistaUgelComponent {
    // constructor() {}
    name: string
    name1: string
    primerNombre: string = ''
    perfiles: any[] = []
    modalPerfiles: boolean = false
    perfilSeleccionado: any = {}

    constructor(
        private ConstantesService: ConstantesService,
        private ls: LocalStoreService
    ) {
        this.name = this.ConstantesService.nombres
        this.name1 = this.ConstantesService.nombre
    }

    ngOnInit() {
        this.obtenerPerfiles()
    }

    obtenerPerfiles() {
        const info = this.ls.getItem('dremoUser')
        this.perfiles = info.perfiles
        // this.openModal()
    }

    openModal() {
        this.modalPerfiles = true
    }
    seleccionarElemento(perfiles: any): void {
        const found = (this.perfilSeleccionado = perfiles)
        this.ls.setItem('dremoPerfil', found)
        setTimeout(() => {
            window.location.reload()
        }, 200)
        this.modalPerfiles = false
    }
}
