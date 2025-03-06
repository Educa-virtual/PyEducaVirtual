import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { PrimengModule } from '@/app/primeng.module'
import { DropdownModule } from 'primeng/dropdown'
import { InputTextModule } from 'primeng/inputtext'

@Component({
    selector: 'app-ficha-socioeconomica',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        InputTextModule,
        FormsModule,
        PrimengModule,
        //TablePrimengComponent,
        DropdownModule,
    ],
    templateUrl: './fichasocgeneral.component.html',
    styleUrl: './fichasocgeneral.component.scss',
})
export class FichasocgeneralComponent implements OnInit {
    formGroup: FormGroup | undefined
    form: FormGroup

    tipoVias = [
        { label: 'Avenida', value: 'Avenida' },
        { label: 'Jirón', value: 'Jiron' },
        { label: 'Calle', value: 'Calle' },
    ]

    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        this.formGroup = new FormGroup({
            text: new FormControl<string | null>(null),
        })

        this.form = this.fb.group({
            tipoVia: ['Avenida'],
            nombreVia: ['', Validators.required],
            nroPuerta: ['', Validators.required],
            bloque: [''],
            interior: [''],
            piso: [''],
            mz: [''],
            lote: [''],
            km: [''],
            referencia: [''],
            telefono: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            tieneHijos: [false],
            cantidadHijos: [{ value: null, disabled: true }],
        })

        // Habilitar o deshabilitar el campo "cantidadHijos" en función de "tieneHijos"
        this.form.get('tieneHijos')?.valueChanges.subscribe((value) => {
            if (value) {
                this.form.get('cantidadHijos')?.enable()
            } else {
                this.form.get('cantidadHijos')?.disable()
                this.form.get('cantidadHijos')?.setValue(null) // Limpia si desactivan
            }
        })
    }

    guardar() {
        if (this.form.valid) {
            console.log('Datos a guardar:', this.form.value)
        } else {
            console.warn('El formulario tiene errores')
            this.form.markAllAsTouched() // Para resaltar campos con errores
        }
    }
}
