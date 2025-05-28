import { PrimengModule } from '@/app/primeng.module'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Usuario } from '../interfaces/usuario.interface'
import { FormBuilder, FormGroup } from '@angular/forms'

@Component({
    selector: 'app-cambiar-fecha-caducidad',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './cambiar-fecha-caducidad.component.html',
    styleUrl: './cambiar-fecha-caducidad.component.scss',
})
export class CambiarFechaCaducidadComponent {
    @Input() visible: boolean = false
    @Input() usuario: Usuario = null
    @Output() visibleChange = new EventEmitter<boolean>()
    formCambiarFecha: FormGroup

    constructor(private fb: FormBuilder) {}

    cerrarDialog() {
        this.visibleChange.emit(false)
    }
}
