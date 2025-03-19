import { PrimengModule } from '@/app/primeng.module'
import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
    selector: 'app-registrar-sugerencia',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './registrar-sugerencia.component.html',
    styleUrl: './registrar-sugerencia.component.scss',
})
export class RegistrarSugerenciaComponent {
    form: FormGroup
    disable_form: boolean = false
    uploadedFiles: any
    sugerencia_registrada: boolean = false

    destinos: Array<object>
    prioridades: Array<object>

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.destinos = [
            { id: 1, nombre: 'EQUIPO TECNICO' },
            { id: 2, nombre: 'DIRECCION' },
            { id: 3, nombre: 'PROFESORES' },
            { id: 4, nombre: 'ESPECIALISTAS' },
        ]

        this.prioridades = [
            { id: 1, nombre: 'BAJA' },
            { id: 2, nombre: 'MEDIA' },
            { id: 3, nombre: 'ALTA' },
        ]

        this.form = this.fb.group({
            iDestinoId: [null, Validators.required],
            cAsunto: [null, Validators.required],
            cSugerencia: [null, Validators.required],
        })
    }

    guardarSugerencia() {
        this.disable_form = true
    }

    actualizarSugerencia() {
        this.disable_form = true
    }
}
