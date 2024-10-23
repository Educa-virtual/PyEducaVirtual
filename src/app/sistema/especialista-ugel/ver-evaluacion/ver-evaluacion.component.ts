import { Component } from '@angular/core'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { Button } from 'primeng/button'
import { CardModule } from 'primeng/card'
import { DividerModule } from 'primeng/divider'
import { TableModule } from 'primeng/table'
import { CommonModule } from '@angular/common'
@Component({
    selector: 'app-ver-evaluacion',
    standalone: true,
    imports: [DividerModule, CardModule, Button, TableModule, CommonModule],
    templateUrl: './ver-evaluacion.component.html',
    styleUrl: './ver-evaluacion.component.scss',
})
export class VerEvaluacionComponent {
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
    products = [
        {
            code: '1',
            name: 'Product 1',
            category: 'Electronics',
            quantity: 100,
        },
        { code: '2', name: 'Product 2', category: 'Apparel', quantity: 50 },
    ]
}
