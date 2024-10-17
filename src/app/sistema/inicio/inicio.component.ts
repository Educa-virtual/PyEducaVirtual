import { ConstantesService } from '@/app/servicios/constantes.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { Component, OnInit } from '@angular/core'
import { DialogModule } from 'primeng/dialog'
import { DropdownModule } from 'primeng/dropdown'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { DataViewModule } from 'primeng/dataview'
import { OrderListModule } from 'primeng/orderlist'
import { CommonModule } from '@angular/common'
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
        TablePrimengComponent,
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
        private ls: LocalStoreService
    ) {
        this.name = this.ConstantesService.nombres
        this.name1 = this.ConstantesService.nombre
    }

    ngOnInit() {
        this.obtenerPerfiles()
    }

    obtenerPerfiles() {
        const info = this.ls.getItem('dremoToken')
        this.perfiles = info.perfiles
        this.openModal()
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
