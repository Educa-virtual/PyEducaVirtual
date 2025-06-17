import { PrimengModule } from '@/app/primeng.module'
import { Component, inject, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { CompartirFichaService } from '../../services/compartir-ficha.service'
import { ActivatedRoute, Router } from '@angular/router'
import { DatosFichaBienestarService } from '../../services/datos-ficha-bienestar.service'
import { MessageService } from 'primeng/api'
import { SwitchInputComponent } from '../shared/switch-input/switch-input.component'

@Component({
    selector: 'app-ficha-discapacidad',
    standalone: true,
    imports: [PrimengModule, SwitchInputComponent],
    templateUrl: './ficha-discapacidad.component.html',
    styleUrl: './ficha-discapacidad.component.scss',
})
export class FichaDiscapacidadComponent implements OnInit {
    iFichaDGId: any = null
    formDiscapacidad: FormGroup
    visibleProgramaInput: Array<boolean>
    visibleLimitacionesInput: Array<boolean>
    ficha_registrada: boolean = false
    discapacidades: Array<object>
    get controles_discapacidades(): FormArray {
        return this.formDiscapacidad.get(
            'controles_discapacidades'
        ) as FormArray
    }

    private _messageService = inject(MessageService)

    constructor(
        private fb: FormBuilder,
        private compartirFicha: CompartirFichaService,
        private datosFichaBienestar: DatosFichaBienestarService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.compartirFicha.setActiveIndex(5)
        this.route.parent?.paramMap.subscribe((params) => {
            this.iFichaDGId = params.get('id')
        })
        if (!this.iFichaDGId) {
            this.router.navigate(['/'])
        }
    }

    ngOnInit(): void {
        try {
            this.formDiscapacidad = this.fb.group({
                iFichaDGId: [this.iFichaDGId, Validators.required],
                bFichaDGEstaEnCONADIS: [false],
                cFichaDGCodigoCONADIS: [null, Validators.maxLength(50)],
                bFichaDGEstaEnOMAPED: [false],
                cFichaDGCodigoOMAPED: [null, Validators.maxLength(50)],
                bOtroProgramaDiscapacidad: [false],
                cOtroProgramaDiscapacidad: [null, Validators.maxLength(50)],
                controles_discapacidades: this.fb.array([]),
                jsonDiscapacidades: [null],
            })
        } catch (error) {
            console.log(error, 'error inicializando formulario')
        }

        this.datosFichaBienestar.getFichaParametros().subscribe((data: any) => {
            this.discapacidades = this.datosFichaBienestar.getDiscapacidades(
                data?.discapacidades
            )
            if (this.discapacidades.length > 0) {
                this.crearControlesDiscapacidades(this.discapacidades)
            }
        })

        if (this.iFichaDGId) {
            this.verFichaDiscapacidad()
        }
    }

    crearControlesDiscapacidades(discapacidades: Array<object>) {
        const formArray = this.formDiscapacidad.get(
            'controles_discapacidades'
        ) as FormArray
        formArray.clear()
        this.discapacidades.map((param: any) => {
            const registro = discapacidades.find(
                (registro: any) => registro.value === param.value
            )
            let grupo: FormGroup = null
            if (!registro) {
                grupo = this.fb.group({
                    iDiscId: [param.value],
                    bDiscFicha: [false],
                    cDiscFichaObs: [null],
                })
                formArray.push(grupo)
            } else {
                grupo = this.fb.group({
                    iDiscId: [param.value],
                    bDiscFicha: [registro['estado']],
                    cDiscFichaObs: [registro['obs']],
                })
                formArray.push(grupo)
                grupo
                    .get('bDiscFicha')
                    .setValue(registro['estado'], { emitEvent: true })
            }
        })
    }

    async verFichaDiscapacidad(): Promise<void> {
        this.datosFichaBienestar
            .verFichaDiscapacidad({
                iFichaDGId: this.iFichaDGId,
            })
            .subscribe((data: any) => {
                if (data) {
                    this.setFormDiscapacidad(data.data[0])
                }
            })
    }

    setFormDiscapacidad(data: any) {
        this.formDiscapacidad.patchValue(data)
        this.datosFichaBienestar.formatearFormControl(
            this.formDiscapacidad,
            'bFichaDGEstaEnCONADIS',
            data.bFichaDGEstaEnCONADIS,
            'boolean'
        )
        this.datosFichaBienestar.formatearFormControl(
            this.formDiscapacidad,
            'bFichaDGEstaEnOMAPED',
            data.bFichaDGEstaEnOMAPED,
            'boolean'
        )
        this.datosFichaBienestar.formatearFormControl(
            this.formDiscapacidad,
            'bOtroProgramaDiscapacidad',
            data.bOtroProgramaDiscapacidad,
            'boolean'
        )
        const discapacidades = JSON.parse(data.discapacidades).map(
            (discapacidad: any) => {
                return {
                    value: discapacidad.iDiscId,
                    estado: discapacidad.bDiscFicha == 1 ? true : false,
                    obs: discapacidad.cDiscFichaObs || null,
                }
            }
        )
        this.crearControlesDiscapacidades(discapacidades)
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
        this.datosFichaBienestar
            .guardarFichaDiscapacidad(this.formDiscapacidad.value)
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
        if (this.formDiscapacidad.invalid) {
            this._messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe completar los campos requeridos',
            })
            return
        }
        this.formDiscapacidad
            .get('jsonDiscapacidades')
            .setValue(JSON.stringify(this.controles_discapacidades.value))
        this.datosFichaBienestar
            .actualizarFichaDiscapacidad(this.formDiscapacidad.value)
            .subscribe({
                next: () => {
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
                        detail: error.error.message,
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
