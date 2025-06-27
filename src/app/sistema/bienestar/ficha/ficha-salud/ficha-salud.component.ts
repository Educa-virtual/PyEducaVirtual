import { PrimengModule } from '@/app/primeng.module'
import { Component, inject, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { GestionPandemiaDosisComponent } from './gestion-pandemia-dosis/gestion-pandemia-dosis.component'
import { CompartirFichaService } from '../../services/compartir-ficha.service'
import { ActivatedRoute, Router } from '@angular/router'
import { DatosFichaBienestarService } from '../../services/datos-ficha-bienestar.service'
import { MultiselectInputComponent } from '../shared/multiselect-input/multiselect-input.component'
import { SwitchInputComponent } from '../shared/switch-input/switch-input.component'
import { MessageService } from 'primeng/api'

@Component({
    selector: 'app-ficha-salud',
    standalone: true,
    imports: [
        PrimengModule,
        GestionPandemiaDosisComponent,
        MultiselectInputComponent,
        SwitchInputComponent,
    ],
    templateUrl: './ficha-salud.component.html',
    styleUrl: './ficha-salud.component.scss',
})
export class FichaSaludComponent implements OnInit {
    iFichaDGId: any = null
    formSalud: FormGroup
    dolencias: Array<object>
    seguros_salud: Array<object>
    ficha_registrada: boolean = false
    get controles_dolencias(): FormArray {
        return this.formSalud.get('controles_dolencias') as FormArray
    }

    private _messageService = inject(MessageService)

    constructor(
        private fb: FormBuilder,
        private compartirFicha: CompartirFichaService,
        private datosFichaBienestar: DatosFichaBienestarService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.compartirFicha.setActiveIndex(6)
        this.route.parent?.paramMap.subscribe((params) => {
            this.iFichaDGId = params.get('id')
        })
        if (!this.iFichaDGId) {
            this.router.navigate(['/'])
        }
    }

    ngOnInit(): void {
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
                controles_dolencias: this.fb.array([]),
                jsonDolencias: [null],
                jsonSeguros: [null],
            })
        } catch (error) {
            console.log(error, 'error inicializando formulario')
        }

        this.datosFichaBienestar.getFichaParametros().subscribe((data: any) => {
            this.seguros_salud = this.datosFichaBienestar.getSeguros(
                data?.seguros_salud
            )
            this.dolencias = this.datosFichaBienestar.getDolencias(
                data?.dolencias
            )
            if (this.dolencias && this.dolencias.length > 0) {
                this.crearControlesDolencias(this.dolencias)
            }
        })

        if (this.iFichaDGId) {
            this.verFichaSalud()
        }
    }

    verFichaSalud() {
        this.datosFichaBienestar
            .verFichaSalud({
                iFichaDGId: this.iFichaDGId,
            })
            .subscribe((data: any) => {
                if (data.data.length) {
                    this.setFormSalud(data.data[0])
                }
            })
    }

    setFormSalud(data: any) {
        this.formSalud.patchValue(data)
        this.datosFichaBienestar.formatearFormControl(
            this.formSalud,
            'bFichaDGAlergiaMedicamentos',
            data.bFichaDGAlergiaMedicamentos,
            'boolean'
        )
        this.datosFichaBienestar.formatearFormControl(
            this.formSalud,
            'bFichaDGAlergiaOtros',
            data.bFichaDGAlergiaOtros,
            'boolean'
        )
        if (data.dolencias) {
            const dolencias = JSON.parse(data.dolencias).map(
                (dolencia: any) => {
                    return {
                        value: dolencia.iDolenciaId,
                        estado: dolencia.bDolFicha == 1 ? true : false,
                        obs: dolencia.cDolFichaObs || null,
                    }
                }
            )
            this.crearControlesDolencias(dolencias)
        }
    }

    crearControlesDolencias(dolencias: Array<object>) {
        const formArray = this.formSalud.get('controles_dolencias') as FormArray
        formArray.clear()
        this.dolencias.map((param: any) => {
            const registro = dolencias.find(
                (registro: any) => registro.value === param.value
            )
            let grupo: FormGroup = null
            if (!registro) {
                grupo = this.fb.group({
                    iDolenciaId: [param.value],
                    bDolFicha: [false],
                    cDolFichaObs: [null],
                })
                formArray.push(grupo)
            } else {
                grupo = this.fb.group({
                    iDolenciaId: [param.value],
                    bDolFicha: [registro['estado']],
                    cDolFichaObs: [registro['obs']],
                })
                formArray.push(grupo)
                grupo
                    .get('bDolFicha')
                    .setValue(registro['estado'], { emitEvent: true })
            }
        })
    }

    actualizar() {
        if (this.formSalud.invalid) {
            this._messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe completar los campos requeridos',
            })
            return
        }
        this.formSalud
            .get('jsonDolencias')
            .setValue(JSON.stringify(this.controles_dolencias.value))

        this.datosFichaBienestar.formControlJsonStringify(
            this.formSalud,
            'jsonSeguros',
            'iSeguroSaludId'
        )

        this.datosFichaBienestar
            .actualizarFichaSalud(this.formSalud.value)
            .subscribe({
                next: () => {
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Actualización exitosa',
                        detail: 'Se actualizaron los datos',
                    })
                    setTimeout(() => {
                        this.router.navigate([
                            `/bienestar/ficha/${this.iFichaDGId}/recreacion`,
                        ])
                    }, 1000)
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
