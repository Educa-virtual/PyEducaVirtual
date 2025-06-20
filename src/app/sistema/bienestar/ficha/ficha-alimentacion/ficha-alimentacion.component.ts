import { PrimengModule } from '@/app/primeng.module'
import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { CompartirFichaService } from '../../services/compartir-ficha.service'
import { Router } from '@angular/router'
import { DatosFichaBienestarService } from '../../services/datos-ficha-bienestar.service'
import { MessageService } from 'primeng/api'

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
    ficha_registrada: boolean = false

    private _messageService = inject(MessageService)

    constructor(
        private fb: FormBuilder,
        private compartirFichaService: CompartirFichaService,
        private datosFichaBienestarService: DatosFichaBienestarService,
        private router: Router
    ) {
        if (this.compartirFichaService.getiFichaDGId() === null) {
            this.router.navigate(['/bienestar/ficha/general'])
        }
        this.compartirFichaService.setActiveIndex(4)
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

    guardar() {
        if (this.formAlimentacion.invalid) {
            this._messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe completar los campos requeridos',
            })
            return
        }
        this.datosFichaBienestarService
            .guardarFichaVivienda(this.formAlimentacion.value)
            .subscribe({
                next: (data: any) => {
                    this.compartirFichaService.setiFichaDGId(
                        data.data[0].iFichaDGId
                    )
                    this.ficha_registrada = true
                    this.datosFichaBienestarService.formVivienda =
                        this.formAlimentacion.value
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Registro Exitoso',
                        detail: 'Se registró la ficha de vivienda',
                    })
                },
                error: (error) => {
                    console.error('Error guardando ficha:', error)
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error,
                    })
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    actualizar() {
        if (this.formAlimentacion.invalid) {
            this._messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe completar los campos requeridos',
            })
            return
        }
        this.datosFichaBienestarService
            .actualizarFichaVivienda(this.formAlimentacion.value)
            .subscribe({
                next: (data: any) => {
                    this.compartirFichaService.setiFichaDGId(
                        data.data[0].iFichaDGId
                    )
                    this.ficha_registrada = true
                    this.datosFichaBienestarService.formAlimentacion =
                        this.formAlimentacion.value
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Actualización Exitosa',
                        detail: 'Se actualizó la ficha de vivienda',
                    })
                },
                error: (error) => {
                    console.error('Error actualizando ficha:', error)
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error,
                    })
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    salir() {
        this.router.navigate(['/'])
    }
}
