import { PrimengModule } from '@/app/primeng.module'
import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { CompartirFichaService } from '../../services/compartir-ficha.service'
import { Router } from '@angular/router'
import { DatosFichaBienestarService } from '../../services/datos-ficha-bienestar.service'
import { MessageService } from 'primeng/api'

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
    ficha_registrada: boolean = false
    discapacidades: Array<object>

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
        this.compartirFichaService.setActiveIndex(5)
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

    guardar() {
        if (this.formDiscapacidad.invalid) {
            this._messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe completar los campos requeridos',
            })
            return
        }

        const programas = []
        this.formDiscapacidad.get('iProgAlimId').value.forEach((elemento) => {
            programas.push({
                iProgAlimId: elemento,
            })
        })
        this.formDiscapacidad
            .get('jsonProgramas')
            .setValue(JSON.stringify(programas))

        this.datosFichaBienestarService
            .guardarFichaAlimentacion(this.formDiscapacidad.value)
            .subscribe({
                next: (data: any) => {
                    this.compartirFichaService.setiFichaDGId(
                        data.data[0].iFichaDGId
                    )
                    this.ficha_registrada = true
                    this.datosFichaBienestarService.formDiscapacidad =
                        this.formDiscapacidad.value
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Registro exitoso',
                        detail: 'Se registraron los datos',
                    })
                },
                error: (error) => {
                    console.error('Error guardando ficha:', error)
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.message,
                    })
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    actualizar() {
        if (this.formDiscapacidad.invalid) {
            this._messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe completar los campos requeridos',
            })
            return
        }

        const programas = []
        this.formDiscapacidad.get('iProgAlimId').value.forEach((elemento) => {
            programas.push({
                iProgAlimId: elemento,
            })
        })
        this.formDiscapacidad
            .get('jsonProgramas')
            .setValue(JSON.stringify(programas))

        this.datosFichaBienestarService
            .actualizarFichaAlimentacion(this.formDiscapacidad.value)
            .subscribe({
                next: (data: any) => {
                    this.compartirFichaService.setiFichaDGId(
                        data.data[0].iFichaDGId
                    )
                    this.ficha_registrada = true
                    this.datosFichaBienestarService.formDiscapacidad =
                        this.formDiscapacidad.value
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Actualización exitosa',
                        detail: 'Se actualizaron los datos',
                    })
                },
                error: (error) => {
                    console.error('Error actualizando ficha:', error)
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.message,
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
