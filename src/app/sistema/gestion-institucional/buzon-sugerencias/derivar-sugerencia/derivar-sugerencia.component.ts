import { PrimengModule } from '@/app/primeng.module'
import { Component, Input } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
    selector: 'app-derivar-sugerencia',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './derivar-sugerencia.component.html',
    styleUrl: './derivar-sugerencia.component.scss',
})
export class DerivarSugerenciaComponent {
    @Input() item: any
    @Input() disable: boolean

    form: FormGroup
    disable_form: boolean = false
    derivacion_registrada: boolean = false
    uploadedFiles: any

    destinos: Array<object>

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.destinos = [
            { id: 1, nombre: 'EQUIPO TECNICO' },
            { id: 2, nombre: 'DIRECCION' },
            { id: 3, nombre: 'PROFESORES' },
            { id: 4, nombre: 'ESPECIALISTAS' },
        ]

        this.form = this.fb.group({
            iDestinoId: [null, Validators.required],
            cProveido: [null, Validators.required],
        })
    }

    guardarDerivacion() {
        console.log('Guardando derivación...')
    }

    actualizarDerivacion() {
        console.log('Actualizando derivación...')
    }
}
