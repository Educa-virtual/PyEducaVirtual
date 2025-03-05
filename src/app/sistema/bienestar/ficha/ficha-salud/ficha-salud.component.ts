import { PrimengModule } from '@/app/primeng.module'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { GestionPandemiaDosisComponent } from './gestion-pandemia-dosis/gestion-pandemia-dosis.component'

@Component({
    selector: 'app-ficha-salud',
    standalone: true,
    imports: [PrimengModule, GestionPandemiaDosisComponent],
    templateUrl: './ficha-salud.component.html',
    styleUrl: './ficha-salud.component.scss',
})
export class FichaSaludComponent implements OnInit {
    formSalud: FormGroup
    dolencias: Array<object>
    visibleInput: Array<boolean>
    visibleAlergiaInput: Array<boolean>

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.visibleInput = Array(7).fill(false)
        this.visibleAlergiaInput = Array(2).fill(false)

        this.dolencias = [
            { id: 1, nombre: 'Asma' },
            { id: 2, nombre: 'Diabetes' },
            { id: 3, nombre: 'Epilepsia' },
            { id: 4, nombre: 'Artritis' },
            { id: 5, nombre: 'Reumatismo' },
            { id: 6, nombre: 'Hipertensión' },
            { id: 7, nombre: 'Estrés' },
        ]

        try {
            this.formSalud = this.fb.group({
                iFichaDGId: [null, Validators.required],
                bFichaDGAlergiaMedicamentos: [false],
                cFichaDGAlergiaMedicamentos: [null],
                bFichaDGAlergiaOtros: [false],
                cFichaDGAlergiaOtros: [null],
            })
        } catch (error) {
            console.log(error, 'error inicializando formulario')
        }
    }

    handleSwitchChange(event: any, index: number) {
        if (event?.checked === undefined) {
            this.visibleInput[index] = false
            return null
        }
        if (event.checked === true) {
            this.visibleInput[index] = true
        } else {
            this.visibleInput[index] = false
        }
    }

    handleSwitchAlergiaChange(event: any, index: number) {
        if (event?.checked === undefined) {
            this.visibleAlergiaInput[index] = false
            return null
        }
        if (event.checked === true) {
            this.visibleAlergiaInput[index] = true
        } else {
            this.visibleAlergiaInput[index] = false
        }
    }

    guardarDatos() {
        console.log(this.formSalud.value, 'guardando datos')
    }

    actualizarDatos() {
        console.log(this.formSalud.value, 'actualizando datos')
    }
}
