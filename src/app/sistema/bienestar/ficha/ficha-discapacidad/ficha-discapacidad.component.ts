import { PrimengModule } from '@/app/primeng.module'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { CompartirFichaService } from '../../services/compartir-ficha.service'
import { Router } from '@angular/router'
import { DatosFichaBienestarService } from '../../services/datos-ficha-bienestar.service'

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

    discapacidades: Array<object>

    constructor(
        private fb: FormBuilder,
        private compartirFichaService: CompartirFichaService,
        private datosFichaBienestarService: DatosFichaBienestarService,
        private router: Router
    ) {
        if (this.compartirFichaService.getiFichaDGId() === null) {
            this.router.navigate(['/bienestar/ficha/general'])
        }
    }

    ngOnInit(): void {
        this.visibleProgramaInput = Array(3).fill(false)

        this.datosFichaBienestarService
            .getFichaParametros()
            .subscribe((data: any) => {
                this.discapacidades =
                    this.datosFichaBienestarService.getDiscapacidades(
                        data?.discapacidades
                    )
                if (this.discapacidades.length > 0) {
                    this.visibleLimitacionesInput = Array(
                        this.discapacidades.length
                    ).fill(false)
                }
            })

        try {
            this.formDiscapacidad = this.fb.group({
                iFichaDGId: [null, Validators.required],
                bFichaDGEstaEnCONADIS: [false],
                cCodigoCONADIS: [null],
                bFichaDGEstaEnOMAPED: [false],
                cCodigoOMAPED: [null],
                bFichaDGEstaEnOtro: [false],
                cOtroProgramaDiscapacidad: [null],
                iDiscId: [null],
                cDiscFichaObs: [null],
            })
        } catch (error) {
            console.log(error, 'error inicializando formulario')
        }
    }

    handleSwitchProgramaChange(event: any, index: any) {
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
