import { PrimengModule } from '@/app/primeng.module'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { GestionPandemiaDosisComponent } from './gestion-pandemia-dosis/gestion-pandemia-dosis.component'
import { CompartirFichaService } from '../../services/compartir-ficha.service'
import { Router } from '@angular/router'
import { DatosFichaBienestarService } from '../../services/datos-ficha-bienestar.service'

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
    visibleDolenciasInput: Array<boolean>
    seguros_salud: Array<object>

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
        this.visibleInput = Array(7).fill(false)
        this.visibleAlergiaInput = Array(2).fill(false)
        this.visibleSeguroInput = Array(1).fill(false)

        this.datosFichaBienestarService
            .getFichaParametros()
            .subscribe((data: any) => {
                this.dolencias = this.datosFichaBienestarService.getDolencias(
                    data?.dolencias
                )
                if (this.dolencias && this.dolencias.length > 0) {
                    this.visibleDolenciasInput = Array(
                        this.dolencias.length
                    ).fill(false)
                }
                this.seguros_salud = this.datosFichaBienestarService.getSeguros(
                    data?.seguros_salud
                )
            })

        try {
            this.formSalud = this.fb.group({
                iFichaDGId: [null, Validators.required],
                bFichaDGAlergiaMedicamentos: [false],
                cFichaDGAlergiaMedicamentos: [null],
                bFichaDGAlergiaOtros: [false],
                cFichaDGAlergiaOtros: [null],
                iSeguroSaludId: [null],
                cSeguroSaludObs: [null],
                iDolenciaId: [null],
                cDolFichaObs: [null],
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
