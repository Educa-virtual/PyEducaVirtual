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

    perfiles: any[] = []

    modalPerfiles: boolean = false
    perfilSeleccionado: any = {}

    constructor(
        private ConstantesService: ConstantesService,
        private lg: LocalStoreService
    ) {
        this.name = this.ConstantesService.nombres
        this.name1 = this.ConstantesService.nombre
    }

    ngOnInit() {
        this.obtenerPerfiles()
    }

    obtenerPerfiles() {
        const info = this.lg.getItem('dremoToken')
        this.perfiles = info.perfiles
        //console.log('perfiles', this.perfiles)
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
    seleccionarElemento(perfiles: any): void {
        const found = (this.perfilSeleccionado = perfiles)
        console.log(found)
        this.modalPerfiles = false
    }
}
