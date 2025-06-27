import { PrimengModule } from '@/app/primeng.module'
import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { CompartirFichaService } from '../../services/compartir-ficha.service'
import { ActivatedRoute, Router } from '@angular/router'
import { DatosFichaBienestarService } from '../../services/datos-ficha-bienestar.service'
import { FichaEconomico } from '../../interfaces/FichaEconomico'
import { MessageService } from 'primeng/api'
import { InputSimpleComponent } from '../shared/input-simple/input-simple.component'
import { DropdownSimpleComponent } from '../shared/dropdown-simple/dropdown-simple.component'
import { SwitchSimpleComponent } from '../shared/switch-simple/switch-simple.component'
import { FuncionesBienestarService } from '../../services/funciones-bienestar.service'

@Component({
    selector: 'app-ficha-economico',
    standalone: true,
    imports: [
        PrimengModule,
        InputSimpleComponent,
        DropdownSimpleComponent,
        SwitchSimpleComponent,
    ],
    templateUrl: './ficha-economico.component.html',
    styleUrl: './ficha-economico.component.scss',
})
export class FichaEconomicoComponent implements OnInit {
    iFichaDGId: any = null
    formEconomico: FormGroup
    ficha_registrada: boolean
    apoderado_trabaja: boolean = false

    rangos_sueldo: Array<object>
    dependencias_economicas: Array<object>
    tipos_apoyo_economico: Array<object>
    jornadas_trabajo: Array<object>

    private _MessageService = inject(MessageService)

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private compartirFicha: CompartirFichaService,
        private route: ActivatedRoute,
        private datosFichaBienestar: DatosFichaBienestarService,
        private funcionesBienestar: FuncionesBienestarService
    ) {
        this.compartirFicha.setActiveIndex(2)
        this.route.parent?.paramMap.subscribe((params) => {
            this.iFichaDGId = params.get('id')
        })
        if (!this.iFichaDGId) {
            this.router.navigate(['/'])
        }
    }

    ngOnInit(): void {
        this.datosFichaBienestar.getFichaParametros().subscribe((data: any) => {
            this.rangos_sueldo = this.datosFichaBienestar.getRangosSueldo(
                data?.rangos_sueldo
            )
            this.dependencias_economicas =
                this.datosFichaBienestar.getDependenciasEconomicas(
                    data?.dependencias_economicas
                )
            this.tipos_apoyo_economico =
                this.datosFichaBienestar.getTiposApoyoEconomico(
                    data?.tipos_apoyo_economico
                )
            this.jornadas_trabajo = this.datosFichaBienestar.getJornadasTrabajo(
                data?.jornadas_trabajo
            )
        })

        if (this.iFichaDGId) {
            this.verFichaEconomico()
        }

        try {
            this.formEconomico = this.fb.group({
                iFichaDGId: this.iFichaDGId,
                iIngresoEcoId: [null],
                iIngresoEcoFamiliar: [null],
                cIngresoEcoActividad: [null, Validators.maxLength(100)],
                iIngresoEcoEstudiante: [null],
                iIngresoEcoTrabajoHoras: [null],
                bIngresoEcoTrabaja: [null],
                bApoderadoTrabaja: [null],
                cIngresoEcoDependeDe: [null, Validators.maxLength(100)],
                iRangoSueldoId: [null, Validators.required],
                iRangoSueldoIdPersona: [null],
                iDepEcoId: [null],
                iTipoAEcoId: [null],
                iJorTrabId: [null],
            })
        } catch (error) {
            console.log(error, 'error inicializando formulario')
        }

        this.funcionesBienestar.formMarkAsDirty(this.formEconomico)
    }

    verFichaEconomico() {
        this.datosFichaBienestar
            .verFichaEconomico({
                iFichaDGId: this.iFichaDGId,
            })
            .subscribe((data: any) => {
                if (data.data.length) {
                    this.setFormEconomico(data.data[0])
                }
            })
    }

    setFormEconomico(data: FichaEconomico) {
        if (data.iIngresoEcoId) {
            this.ficha_registrada = true
        }
        this.formEconomico.patchValue(data)
        this.funcionesBienestar.formatearFormControl(
            this.formEconomico,
            'iIngresoEcoId',
            data.iIngresoEcoId,
            'number'
        )
        this.funcionesBienestar.formatearFormControl(
            this.formEconomico,
            'iIngresoEcoFamiliar',
            data.iIngresoEcoFamiliar,
            'number'
        )
        this.funcionesBienestar.formatearFormControl(
            this.formEconomico,
            'iIngresoEcoEstudiante',
            data.iIngresoEcoEstudiante,
            'number'
        )
        this.funcionesBienestar.formatearFormControl(
            this.formEconomico,
            'iIngresoEcoTrabajoHoras',
            data.iIngresoEcoTrabajoHoras,
            'number'
        )
        this.funcionesBienestar.formatearFormControl(
            this.formEconomico,
            'bIngresoEcoTrabaja',
            data.bIngresoEcoTrabaja,
            'boolean'
        )
        this.funcionesBienestar.formatearFormControl(
            this.formEconomico,
            'iRangoSueldoId',
            data.iRangoSueldoId,
            'number'
        )
        this.funcionesBienestar.formatearFormControl(
            this.formEconomico,
            'iRangoSueldoIdPersona',
            data.iRangoSueldoIdPersona,
            'number'
        )
        this.funcionesBienestar.formatearFormControl(
            this.formEconomico,
            'iDepEcoId',
            data.iDepEcoId,
            'number'
        )
        this.funcionesBienestar.formatearFormControl(
            this.formEconomico,
            'iTipoAEcoId',
            data.iTipoAEcoId,
            'number'
        )
        this.funcionesBienestar.formatearFormControl(
            this.formEconomico,
            'iJorTrabId',
            data.iJorTrabId,
            'number'
        )
        this.funcionesBienestar.formatearFormControl(
            this.formEconomico,
            'bIngresoEcoTrabaja',
            data.bIngresoEcoTrabaja,
            'boolean'
        )
        this.funcionesBienestar.formMarkAsDirty(this.formEconomico)
    }

    actualizar() {
        if (this.formEconomico.invalid) {
            this._MessageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe completar los campos requeridos',
            })
            return
        }
        this.datosFichaBienestar
            .actualizarFichaEconomico(this.formEconomico.value)
            .subscribe({
                next: (data: any) => {
                    this.formEconomico
                        .get('iIngresoEcoId')
                        .setValue(data.data[0].iIngresoEcoId)
                    this._MessageService.add({
                        severity: 'success',
                        summary: 'Actualización exitosa',
                        detail: 'Se actualizaron los datos',
                    })
                    setTimeout(() => {
                        this.router.navigate([
                            `/bienestar/ficha/${this.iFichaDGId}/vivienda`,
                        ])
                    }, 1000)
                },
                error: (error) => {
                    console.error('Error actualizando ficha:', error)
                    this._MessageService.add({
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
