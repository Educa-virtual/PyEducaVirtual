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
import { GeneralService } from '@/app/servicios/general.service'
import { ButtonModule } from 'primeng/button'
import { AccordionModule } from 'primeng/accordion'
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
        ButtonModule,
        AccordionModule,
    ],
})
export class InicioComponent implements OnInit {
    name: string
    name1: string
    primerNombre: string = ''
    perfiles: any[] = []
    modalPerfiles: boolean = false
    perfilSeleccionado: any = {}

    // Variables para el diálogo de comunicado
    displayComunicado: boolean = false
    comunicado: any = null
    comunicados: any[] = []

    constructor(
        private ConstantesService: ConstantesService,
        private ls: LocalStoreService,
        private tokenStorage: TokenStorageService,
        private router: Router,
        private generalService: GeneralService
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
        this.cargarComunicadosDestino()
    }

    obtenerPerfiles() {
        const info = this.ls.getItem('dremoUser')
        this.perfiles = info.perfiles
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

    cargarComunicadosDestino(): void {
        const params = {
            petition: 'post',
            group: 'com',
            prefix: 'comunicado',
            ruta: 'obtener_comunicados_destino', // Ruta definida en el backend
            data: {
                iPersId: this.getUserId(), // Se obtiene el ID del usuario
            },
        }
        console.table(params)
        this.generalService.getGralPrefix(params).subscribe({
            next: (response: any) => {
                if (response && response.data && response.data.length > 0) {
                    // Asigna el array completo de comunicados
                    this.comunicados = response.data
                    this.displayComunicado = true
                }
            },
            error: (err) => {
                console.error('Error al obtener comunicados destino', err)
            },
        })
    }

    // Método auxiliar para obtener el ID del usuario
    getUserId(): number {
        const info = this.ls.getItem('dremoUser')
        return info?.iPersId || 0
    }
}
