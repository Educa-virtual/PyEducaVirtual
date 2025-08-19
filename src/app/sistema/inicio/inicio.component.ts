import { ConstantesService } from '@/app/servicios/constantes.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PrimengModule } from '@/app/primeng.module'
import { Router } from '@angular/router'
import { TokenStorageService } from '@/app/servicios/token.service'
import { GeneralService } from '@/app/servicios/general.service'
@Component({
    selector: 'app-inicio',
    standalone: true,
    templateUrl: './inicio.component.html',
    styleUrl: './inicio.component.scss',
    imports: [CommonModule, PrimengModule],
})
export class InicioComponent implements OnInit {
    mensaje: any[] | undefined
    bandeja: any[] = []
    bandejaFiltrada: any[] = []
    visible = false
    name: string
    name1: string
    primerNombre: string = ''
    perfiles: any[] = []
    modalPerfiles: boolean = false
    perfilSeleccionado: any = {}
    iYAcadId: string
    iSedeId: string
    iPerfilId: number
    iEstudianteId: number
    // Variables para el diálogo de comunicado
    displayComunicado: boolean = false
    comunicado: any = null
    comunicados: any[] = []
    products: any = undefined
    responsiveOptions: any[] | undefined
    titulo = ''
    descripcion = ''
    constructor(
        private ConstantesService: ConstantesService,
        private ls: LocalStoreService,
        private tokenStorage: TokenStorageService,
        private router: Router,
        private generalService: GeneralService
    ) {
        this.iYAcadId = this.ConstantesService.iYAcadId
        this.iSedeId = this.ConstantesService.iSedeId
        this.iPerfilId = this.ConstantesService.iPerfilId
        this.iEstudianteId = this.ConstantesService.iEstudianteId
        this.responsiveOptions = [
            {
                breakpoint: '1199px',
                numVisible: 1,
                numScroll: 1,
            },
            {
                breakpoint: '991px',
                numVisible: 2,
                numScroll: 1,
            },
            {
                breakpoint: '767px',
                numVisible: 1,
                numScroll: 1,
            },
        ]
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
        const perfil = this.ls.getItem('dremoPerfil')
        if (perfil) {
            this.cargarComunicadosDestino()
        } else {
            this.openModal()
        }
    }

    obtenerPerfiles() {
        const info = this.ls.getItem('dremoUser')
        this.perfiles = info.perfiles
    }

    openModal() {
        this.modalPerfiles = true
    }

    seleccionarElemento(perfil: any): void {
        // const found = (this.perfilSeleccionado = perfiles)
        const found = perfil
        this.perfilSeleccionado = found

        this.ls.setItem('dremoPerfil', found)

        this.modalPerfiles = false

        // cargar la interfaz del perfil seleccionado.
        setTimeout(() => {
            window.location.reload()
        }, 200)
    }

    cargarComunicadosDestino(): void {
        const perfil = this.perfiles.map((item) => item.iPerfilId) // Se filtran los id de los perfiles
        const params = {
            petition: 'post',
            group: 'com',
            prefix: 'comunicado',
            ruta: 'obtener_comunicados_destino', // Ruta definida en el backend
            data: {
                iPersId: this.getUserId(), // Se obtiene el ID del usuario
                iYAcadId: this.iYAcadId,
                perfil: perfil,
                iSedeId: this.iSedeId,
            },
        }

        this.generalService.getGralPrefix(params).subscribe({
            next: (response: any) => {
                if (response && response.data && response.data?.length > 0) {
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

    showModal(titulo: string, descripcion: string): void {
        this.visible = true
        this.titulo = titulo
        this.descripcion = descripcion
    }
    onKeyDown(event: KeyboardEvent) {
        if (event.key === 'Enter' || event.key === ' ') {
            return // este evento es solo para quitar el modo estricto de typescript
        }
    }

    onKeyUp(event: KeyboardEvent) {
        if (event.key === 'Enter' || event.key === ' ') {
            return // este evento es solo para quitar el modo estricto de typescript
        }
    }
    obtenerEstado(estado: string) {
        switch (estado) {
            case '1':
                return 'info'
            case '2':
                return 'success'
            case '3':
                return 'warning'
            case '4':
                return 'danger'
            default:
                return 'secondary'
        }
    }
}
