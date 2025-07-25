import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { FormsModule } from '@angular/forms'

@Component({
    selector: 'app-boleta-logro',
    standalone: true,
    imports: [PrimengModule, FormsModule],
    templateUrl: './boleta-logro.component.html',
    styleUrl: './boleta-logro.component.scss',
})
export class BoletaLogroComponent implements OnInit {
    @Input() selectedItem: any
    @Output() boletaLogroImprimir = new EventEmitter<boolean>()
    ngOnInit() {
        console.log('boleta-logro OnInit')
    }

    cerrarDialog() {
        this.boletaLogroImprimir.emit(false)
    }
    generarPDF(datos: any) {
        console.log('Generando PDF con datos:', datos)
    }
    mostrarModalPoliticas: boolean = false

    abrirModalPoliticas() {
        this.mostrarModalPoliticas = true
    }

    cancelarPoliticas() {
        this.mostrarModalPoliticas = false
        console.log('Políticas canceladas')
    }

    aceptarPoliticas() {
        this.mostrarModalPoliticas = false
        console.log('Políticas aceptadas - continuar proceso')
    }
}
