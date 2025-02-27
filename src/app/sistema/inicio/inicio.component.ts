import { ConstantesService } from '@/app/servicios/constantes.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { Component, OnInit } from '@angular/core'
import { DialogModule } from 'primeng/dialog'
import { DropdownModule } from 'primeng/dropdown'
import { DataViewModule } from 'primeng/dataview'
import { OrderListModule } from 'primeng/orderlist'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { TokenStorageService } from '@/app/servicios/token.service'
@Component({
    selector: 'app-inicio',
    standalone: true,
    templateUrl: './inicio.component.html',
    styleUrl: './inicio.component.scss',
    imports: [
        DialogModule,
        CommonModule,
        OrderListModule,
        DropdownModule,
        DataViewModule,
    ],
})
export class InicioComponent implements OnInit {
    name: string
    name1: string
    primerNombre: string = ''
    perfiles: any[] = []
    modalPerfiles: boolean = false
    perfilSeleccionado: any = {}

    constructor(
        private ConstantesService: ConstantesService,
        private ls: LocalStoreService,
        private tokenStorage: TokenStorageService,
        private router: Router
    ) {
        this.name = this.ConstantesService.nombres
        this.name1 = this.ConstantesService.nombre
        if (!this.ConstantesService.verificado) {
            setTimeout(() => {
                this.tokenStorage.signOut()
                this.router.navigate(['login'])
            }, 3000)
        }
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
