import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
@Component({
    selector: 'app-registrar-logro-alcanzado',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './registrar-logro-alcanzado.component.html',
    styleUrl: './registrar-logro-alcanzado.component.scss',
})
export class RegistrarLogroAlcanzadoComponent implements OnInit {
    @Input() selectedItem: any
    @Output() registraLogroAlcanzado = new EventEmitter<boolean>()
    ngOnInit() {
        console.log('registrar-logro-alcanzado')
    }
    cerrarDialog() {
        this.registraLogroAlcanzado.emit(false)
    }
    guardarLogro() {
        this.registraLogroAlcanzado.emit(false)
    }
}
