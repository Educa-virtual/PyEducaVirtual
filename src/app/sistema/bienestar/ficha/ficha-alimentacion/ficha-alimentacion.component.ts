import { PrimengModule } from '@/app/primeng.module'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { CompartirFichaService } from '../../services/compartir-ficha.service'

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
        private compartirFichaService: CompartirFichaService
    ) {}

    ngOnInit(): void {
        this.visibleInput = Array(1).fill(false)
        this.visibleAdicionalInput = Array(6).fill(false)

        this.lugares_alimentacion = [
            { id: 0, nombre: 'OTRO' },
            { id: 1, nombre: 'HOGAR' },
            { id: 2, nombre: 'PENSIÓN' },
            { id: 3, nombre: 'COMEDOR' },
            { id: 4, nombre: 'NINGUNO' },
        ]

        this.programas_alimentarios = [
            { id: 0, nombre: 'OTRO' },
            { id: 1, nombre: 'QALIWARMA' },
            { id: 2, nombre: 'WASI MIKUNA' },
            { id: 3, nombre: 'PROGRAMA DE COMPLEMENTACION ALIMENTARIA' },
            { id: 4, nombre: 'VASO DE LECHE' },
        ]

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
            if (event.value.includes(0)) {
                this.visibleInput[index] = true
            } else {
                this.visibleInput[index] = false
            }
        } else {
            if (event.value == 0) {
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
