import { PrimengModule } from '@/app/primeng.module'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { CompartirFichaService } from '../../services/compartir-ficha.service'
import { Router } from '@angular/router'
import { DatosFichaBienestarService } from '../../services/datos-ficha-bienestar.service'

@Component({
    selector: 'app-ficha-alimentacion',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './ficha-alimentacion.component.html',
    styleUrl: './ficha-alimentacion.component.scss',
})
export class FichaAlimentacionComponent implements OnInit {
    formAlimentacion: FormGroup
    lugares_alimentacion: Array<object>
    programas_alimentarios: Array<object>
    visibleInput: Array<boolean>
    visibleAdicionalInput: Array<boolean>

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
        this.visibleInput = Array(1).fill(false)
        this.visibleAdicionalInput = Array(6).fill(false)

        this.datosFichaBienestarService
            .getFichaParametros()
            .subscribe((data: any) => {
                this.lugares_alimentacion =
                    this.datosFichaBienestarService.getLugaresAlimentacion(
                        data?.lugares_alimentacion
                    )
                this.programas_alimentarios =
                    this.datosFichaBienestarService.getProgramasAlimentarios(
                        data?.programas_alimentarios
                    )
            })

        try {
            this.formAlimentacion = this.fb.group({
                iSesionId: this.compartirFichaService.perfil?.iCredId,
                iFichaDGId: this.compartirFichaService.getiFichaDGId(),
                iLugarAlimIdDesayuno: [null],
                cLugarAlimDesayuno: [''],
                iLugarAlimIdAlmuerzo: [null],
                cLugarAlimAlmuerzo: [''],
                iLugarAlimIdCena: [null],
                cLugarAlimCena: [''],
                iProAlimId: [null],
                cProAlimNombre: [''],
                bDietaVegetariana: [false],
                cDietaVegetarianaObs: [''],
                bDietaVegana: [false],
                cDietaVeganaObs: [''],
                bAlergiasAlim: [false],
                cAlergiasAlimObs: [''],
                bIntoleranciaAlim: [false],
                cIntoleranciaAlimObs: [''],
                bSumplementosAlim: [false],
                cSumplementosAlimObs: [''],
                bDificultadAlim: [false],
                cDificultadAlimObs: [''],
                cInfoAdicionalAlimObs: [''],
            })
        } catch (error) {
            console.log(error, 'error inicializando formulario')
        }
    }

    handleDropdownChange(event: any, index: number) {
        if (event?.value === undefined) {
            this.visibleInput[index] = false
            return null
        }
        if (Array.isArray(event.value)) {
            if (event.value.includes(1)) {
                this.visibleInput[index] = true
            } else {
                this.visibleInput[index] = false
            }
        } else {
            if (event.value == 1) {
                this.visibleInput[index] = true
            } else {
                this.visibleInput[index] = false
            }
        }
    }

    handleSwitchChange(event: any, index: number) {
        if (event?.checked === undefined) {
            this.visibleAdicionalInput[index] = false
            return null
        }
        if (event.checked === true) {
            this.visibleAdicionalInput[index] = true
        } else {
            this.visibleAdicionalInput[index] = false
        }
    }

    guardarDatos() {
        console.log(this.formAlimentacion.value)
    }

    actualizarDatos() {
        console.log(this.formAlimentacion.value)
    }
}
