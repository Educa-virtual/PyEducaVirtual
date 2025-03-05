import { PrimengModule } from '@/app/primeng.module'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
    selector: 'app-ficha-discapacidad',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './ficha-discapacidad.component.html',
    styleUrl: './ficha-discapacidad.component.scss',
})
export class FichaDiscapacidadComponent implements OnInit {
    formDiscapacidad: FormGroup
    visibleProgramaInput: Array<boolean>
    visibleLimitacionesInput: Array<boolean>

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.visibleProgramaInput = Array(2).fill(false)
        this.visibleLimitacionesInput = Array(6).fill(false)

        try {
            this.formDiscapacidad = this.fb.group({
                iFichaDGId: [null, Validators.required],
                bFichaDGEstaEnCONADIS: [false],
                cCodigoCONADIS: [null],
                bFichaDGEstaEnOMAPED: [false],
                cCodigoOMAPED: [null],
                cOtroProgramaDiscapacidad: [null],
                bLimFisica: [false],
                cLimFisicaObs: [null],
                bLimSensorial: [false],
                cLimSensorialObs: [null],
                bLimIntelectual: [false],
                cLimIntelectualObs: [null],
                bLimMental: [false],
                cLimMentalObs: [null],
            })
        } catch (error) {
            console.log(error, 'error inicializando formulario')
        }
    }

    handleSwitchProgramaChange(event: any, index: number) {
        if (event?.checked === undefined) {
            this.visibleProgramaInput[index] = false
            return null
        }
        if (event.checked === true) {
            this.visibleProgramaInput[index] = true
        } else {
            this.visibleProgramaInput[index] = false
        }
    }

    handleSwitchLimitacionChange(event: any, index: number) {
        if (event?.checked === undefined) {
            this.visibleLimitacionesInput[index] = false
            return null
        }
        if (event.checked === true) {
            this.visibleLimitacionesInput[index] = true
        } else {
            this.visibleLimitacionesInput[index] = false
        }
    }

    guardarDatos() {
        console.log(this.formDiscapacidad.value)
    }

    actualizarDatos() {
        console.log(this.formDiscapacidad.value)
    }
}
