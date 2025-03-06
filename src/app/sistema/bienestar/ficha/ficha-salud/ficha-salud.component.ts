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
    visibleSeguroInput: Array<boolean>
    seguros_salud: Array<object>

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.visibleInput = Array(7).fill(false)
        this.visibleAlergiaInput = Array(2).fill(false)
        this.visibleSeguroInput = Array(1).fill(false)

        this.dolencias = [
            { id: 1, nombre: 'Asma' },
            { id: 2, nombre: 'Diabetes' },
            { id: 3, nombre: 'Epilepsia' },
            { id: 4, nombre: 'Artritis' },
            { id: 5, nombre: 'Reumatismo' },
            { id: 6, nombre: 'Hipertensión' },
            { id: 7, nombre: 'Estrés' },
        ]

        this.seguros_salud = [
            { id: 0, nombre: 'Otro' },
            { id: 1, nombre: 'Seguro Integral de Salud' },
            { id: 2, nombre: 'ESSALUD' },
            { id: 3, nombre: 'Seguro Privado de Salud' },
            { id: 4, nombre: 'Entidad Prestadora de Salud' },
            { id: 5, nombre: 'Seguro de Fuerzas Armadas / Policiales' },
        ]

        try {
            this.formSalud = this.fb.group({
                iFichaDGId: [null, Validators.required],
                bFichaDGAlergiaMedicamentos: [false],
                cFichaDGAlergiaMedicamentos: [null],
                bFichaDGAlergiaOtros: [false],
                cFichaDGAlergiaOtros: [null],
                iSeguroSaludId: [null],
                cSeguroSaludObs: [null],
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

    handleDropdownChange(event: any, index: number) {
        if (event?.value === undefined) {
            this.visibleSeguroInput[index] = false
            return null
        }
        if (Array.isArray(event.value)) {
            if (event.value.includes(0)) {
                this.visibleSeguroInput[index] = true
            } else {
                this.visibleSeguroInput[index] = false
            }
        } else {
            if (event.value == 0) {
                this.visibleSeguroInput[index] = true
            } else {
                this.visibleSeguroInput[index] = false
            }
        }
    }

    guardarDatos() {
        console.log(this.formSalud.value, 'guardando datos')
    }

    actualizarDatos() {
        console.log(this.formSalud.value, 'actualizando datos')
    }
}
