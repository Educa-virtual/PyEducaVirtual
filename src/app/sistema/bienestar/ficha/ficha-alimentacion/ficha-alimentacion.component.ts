import { PrimengModule } from '@/app/primeng.module'
import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
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

    async ngOnInit(): Promise<void> {
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
                iAlimId: [null],
                iFichaDGId: this.compartirFichaService.getiFichaDGId(),
                iLugarAlimIdDesayuno: [null],
                cLugarAlimDesayuno: [''],
                iLugarAlimIdAlmuerzo: [null],
                cLugarAlimAlmuerzo: [''],
                iLugarAlimIdCena: [null],
                cLugarAlimCena: [''],
                iProgAlimId: [null],
                cProgAlimNombre: [''],
                bDietaVegetariana: [false],
                cDietaVegetarianaObs: [''],
                bDietaVegana: [false],
                cDietaVeganaObs: [''],
                bFichaDGAlergiaAlimentos: [false],
                cFichaDGAlergiaAlimentos: [''],
                bIntoleranciaAlim: [false],
                cIntoleranciaAlimObs: [''],
                bSumplementosAlim: [false],
                cSumplementosAlimObs: [''],
                bDificultadAlim: [false],
                cDificultadAlimObs: [''],
                cInfoAdicionalAlimObs: [''],
                jsonProgramas: [null],
            })
        } catch (error) {
            console.log(error, 'error inicializando formulario')
        }

        if (this.compartirFichaService.getiFichaDGId()) {
            this.verFichaAlimentacion()
        }
    }

    get iProgAlimIdControl(): FormControl {
        return this.formAlimentacion.controls['iProgAlimId'] as FormControl
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

    async verFichaAlimentacion() {
        this.datosFichaBienestarService
            .verFichaAlimentacion({
                iFichaDGId: this.compartirFichaService.getiFichaDGId(),
            })
            .subscribe((data: any) => {
                if (data.data.length) {
                    this.setFormAlimentacion(data.data[0])
                }
            })
    }

    setFormAlimentacion(data: any) {
        if (data.iAlimId) {
            this.ficha_registrada = true
        } else {
            return
        }
        this.formAlimentacion.patchValue(data)
        this.formatearFormControl(
            'bFichaDGAlergiaAlimentos',
            data.bFichaDGAlergiaAlimentos,
            'bool'
        )
        this.formatearFormControl(
            'iLugarAlimIdDesayuno',
            data.iLugarAlimIdDesayuno,
            'num'
        )
        this.formatearFormControl(
            'iLugarAlimIdAlmuerzo',
            data.iLugarAlimIdAlmuerzo,
            'num'
        )
        this.formatearFormControl(
            'iLugarAlimIdCena',
            data.iLugarAlimIdCena,
            'num'
        )

        this.formatearFormControl('iProgAlimId', data.programas, 'json')
    }

    formatearFormControl(id: string, value: any, tipo: string = 'str') {
        if (tipo === 'num') {
            this.formAlimentacion.get(id)?.patchValue(value ? +value : null)
        } else if (tipo === 'bool') {
            this.formAlimentacion.get(id)?.patchValue(value == 1 ? true : false)
        } else if (tipo === 'str') {
            this.formAlimentacion.get(id)?.patchValue(value)
        } else if (tipo === 'json') {
            if (!value) {
                this.formAlimentacion.get(id)?.patchValue(null)
            } else {
                const json = JSON.parse(value)
                const items = []
                for (let i = 0; i < json.length; i++) {
                    items.push(json[i][id])
                }
                this.formAlimentacion.get(id)?.patchValue(items)
            }
        } else {
            this.formAlimentacion.get(id)?.patchValue(value)
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

        const programas = []
        this.formAlimentacion.get('iProgAlimId').value.forEach((elemento) => {
            programas.push({
                iProgAlimId: elemento,
            })
        })
        this.formAlimentacion
            .get('jsonProgramas')
            .setValue(JSON.stringify(programas))

        this.datosFichaBienestarService
            .guardarFichaAlimentacion(this.formAlimentacion.value)
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
        if (this.formAlimentacion.invalid) {
            this._messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe completar los campos requeridos',
            })
            return
        }

        const programas = []
        this.formAlimentacion.get('iProgAlimId').value.forEach((elemento) => {
            programas.push({
                iProgAlimId: elemento,
            })
        })
        this.formAlimentacion
            .get('jsonProgramas')
            .setValue(JSON.stringify(programas))

        this.datosFichaBienestarService
            .actualizarFichaAlimentacion(this.formAlimentacion.value)
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
