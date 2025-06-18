import { PrimengModule } from '@/app/primeng.module'
import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { CompartirFichaService } from '../../services/compartir-ficha.service'
import { ActivatedRoute, Router } from '@angular/router'
import { DatosFichaBienestarService } from '../../services/datos-ficha-bienestar.service'
import { MessageService } from 'primeng/api'
import { MultiselectInputComponent } from '../shared/multiselect-input/multiselect-input.component'
import { DropdownInputComponent } from '../shared/dropdown-input/dropdown-input.component'
import { SwitchInputComponent } from '../shared/switch-input/switch-input.component'

@Component({
    selector: 'app-ficha-alimentacion',
    standalone: true,
    imports: [
        PrimengModule,
        MultiselectInputComponent,
        DropdownInputComponent,
        SwitchInputComponent,
    ],
    templateUrl: './ficha-alimentacion.component.html',
    styleUrl: './ficha-alimentacion.component.scss',
})
export class FichaAlimentacionComponent implements OnInit {
    iFichaDGId: any = null
    formAlimentacion: FormGroup
    lugares_alimentacion: Array<object>
    programas_alimentarios: Array<object>
    visibleInput: Array<boolean>
    visibleAdicionalInput: Array<boolean>
    ficha_registrada: boolean = false

    private _messageService = inject(MessageService)

    constructor(
        private fb: FormBuilder,
        private compartirFicha: CompartirFichaService,
        private datosFichaBienestar: DatosFichaBienestarService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.compartirFicha.setActiveIndex(4)
        this.route.parent?.paramMap.subscribe((params) => {
            this.iFichaDGId = params.get('id')
        })
        if (!this.iFichaDGId) {
            this.router.navigate(['/'])
        }
    }

    ngOnInit() {
        this.datosFichaBienestar.getFichaParametros().subscribe((data: any) => {
            this.lugares_alimentacion =
                this.datosFichaBienestar.getLugaresAlimentacion(
                    data?.lugares_alimentacion
                )
            this.programas_alimentarios =
                this.datosFichaBienestar.getProgramasAlimentarios(
                    data?.programas_alimentarios
                )
        })

        try {
            this.formAlimentacion = this.fb.group({
                iAlimId: [null],
                iFichaDGId: [this.iFichaDGId, Validators.required],
                iLugarAlimIdDesayuno: [null],
                cLugarAlimDesayuno: [''],
                iLugarAlimIdAlmuerzo: [null],
                cLugarAlimAlmuerzo: [''],
                iLugarAlimIdCena: [null],
                cLugarAlimCena: [''],
                iProgAlimId: [null],
                cProgAlimNombre: [''],
                bDietaEspecial: [false],
                cDietaEspecialObs: [''],
                bFichaDGAlergiaAlimentos: [false],
                cFichaDGAlergiaAlimentos: [''],
                bIntoleranciaAlim: [false],
                cIntoleranciaAlimObs: [''],
                bSumplementosAlim: [false],
                cSumplementosAlimObs: [''],
                bDificultadAlim: [false],
                cDificultadAlimObs: [''],
                cAlimObs: [''],
                jsonProgramas: [null],
            })
        } catch (error) {
            console.log(error, 'error inicializando formulario')
        }

        if (this.iFichaDGId) {
            this.verFichaAlimentacion()
        }
    }

    async verFichaAlimentacion() {
        this.datosFichaBienestar
            .verFichaAlimentacion({
                iFichaDGId: this.iFichaDGId,
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
            this.ficha_registrada = false
            return
        }
        this.formAlimentacion.patchValue(data)
        this.datosFichaBienestar.formatearFormControl(
            this.formAlimentacion,
            'bFichaDGAlergiaAlimentos',
            data.bFichaDGAlergiaAlimentos,
            'boolean'
        )
        this.datosFichaBienestar.formatearFormControl(
            this.formAlimentacion,
            'iLugarAlimIdDesayuno',
            data.iLugarAlimIdDesayuno,
            'number'
        )
        this.datosFichaBienestar.formatearFormControl(
            this.formAlimentacion,
            'iLugarAlimIdAlmuerzo',
            data.iLugarAlimIdAlmuerzo,
            'number'
        )
        this.datosFichaBienestar.formatearFormControl(
            this.formAlimentacion,
            'iLugarAlimIdCena',
            data.iLugarAlimIdCena,
            'number'
        )
        this.datosFichaBienestar.formatearFormControl(
            this.formAlimentacion,
            'iProgAlimId',
            data.programas,
            'json'
        )
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

        this.datosFichaBienestar
            .guardarFichaAlimentacion(this.formAlimentacion.value)
            .subscribe({
                next: () => {
                    this.ficha_registrada = true
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

        if (this.formAlimentacion.get('iProgAlimId').value !== null) {
            const programas = []
            this.formAlimentacion
                .get('iProgAlimId')
                .value.forEach((elemento) => {
                    programas.push({
                        iProgAlimId: elemento,
                    })
                })
            this.formAlimentacion
                .get('jsonProgramas')
                .setValue(JSON.stringify(programas))
        } else {
            this.formAlimentacion.get('jsonProgramas').setValue(null)
        }

        this.datosFichaBienestar
            .actualizarFichaAlimentacion(this.formAlimentacion.value)
            .subscribe({
                next: (data: any) => {
                    this.formAlimentacion
                        .get('iAlimId')
                        .setValue(data.data[0].iAlimId)
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
