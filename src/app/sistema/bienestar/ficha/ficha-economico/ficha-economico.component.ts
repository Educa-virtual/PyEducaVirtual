import { PrimengModule } from '@/app/primeng.module'
import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { CompartirFichaService } from '../../services/compartir-ficha.service'
import { Router } from '@angular/router'
import { DatosFichaBienestarService } from '../../services/datos-ficha-bienestar.service'
import { FichaEconomico } from '../../interfaces/FichaEconomico'
import { MessageService } from 'primeng/api'

@Component({
    selector: 'app-ficha-economico',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './ficha-economico.component.html',
    styleUrl: './ficha-economico.component.scss',
})
export class FichaEconomicoComponent implements OnInit {
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
        private compartirFichaService: CompartirFichaService,
        private datosFichaBienestarService: DatosFichaBienestarService
    ) {
        if (this.compartirFichaService.getiFichaDGId() === null) {
            this.router.navigate(['/bienestar/ficha/general'])
        }
        this.compartirFichaService.setActiveIndex(2)
    }

    ngOnInit(): void {
        this.datosFichaBienestarService
            .getFichaParametros()
            .subscribe((data: any) => {
                this.rangos_sueldo =
                    this.datosFichaBienestarService.getRangosSueldo(
                        data?.rangos_sueldo
                    )
                this.dependencias_economicas =
                    this.datosFichaBienestarService.getDependenciasEconomicas(
                        data?.dependencias_economicas
                    )
                this.tipos_apoyo_economico =
                    this.datosFichaBienestarService.getTiposApoyoEconomico(
                        data?.tipos_apoyo_economico
                    )
                this.jornadas_trabajo =
                    this.datosFichaBienestarService.getJornadasTrabajo(
                        data?.jornadas_trabajo
                    )
            })

        if (this.compartirFichaService.getiFichaDGId()) {
            this.searchFichaEconomico()
        }

        try {
            this.formEconomico = this.fb.group({
                iCredId: this.compartirFichaService.perfil.iCredId,
                iIngresoEcoId: [null],
                iFichaDGId: this.compartirFichaService.getiFichaDGId(),
                iIngresoEcoFamiliar: [null],
                cIngresoEcoActividad: [null],
                iIngresoEcoEstudiante: [null],
                iIngresoEcoTrabajoHoras: [null],
                bIngresoEcoTrabaja: [null],
                bApoderadoTrabaja: [null],
                cIngresoEcoDependeDe: [null],
                iRangoSueldoId: [null],
                iRangoSueldoIdPersona: [null],
                iDepEcoId: [null],
                iTipoAEcoId: [null],
                iJorTrabId: [null],
            })
        } catch (error) {
            console.log(error, 'error inicializando formulario')
        }

        this.formEconomico
            .get('bApoderadoTrabaja')
            .valueChanges.subscribe((value) => {
                if (value) {
                    this.apoderado_trabaja = true
                    this.formEconomico
                        .get('iIngresoEcoEstudiante')
                        .setValue(null)
                    this.formEconomico
                        .get('iRangoSueldoIdPersona')
                        .setValue(null)
                    this.formEconomico
                        .get('iIngresoEcoTrabajoHoras')
                        .setValue(null)
                    this.formEconomico
                        .get('cIngresoEcoDependeDe')
                        .setValue(null)
                    this.formEconomico.get('iDepEcoId').setValue(null)
                    this.formEconomico.get('iJorTrabId').setValue(null)
                } else {
                    this.apoderado_trabaja = false
                }
            })
    }

    async searchFichaEconomico(): Promise<void> {
        const data = await this.datosFichaBienestarService.searchFichaEconomico(
            {
                iFichaDGId: await this.compartirFichaService.getiFichaDGId(),
            }
        )
        if (data) {
            this.setFormEconomico(data)
        }
    }

    setFormEconomico(data: FichaEconomico) {
        this.ficha_registrada = true
        this.formEconomico.patchValue(data)
        this.formEconomico
            .get('iIngresoEcoId')
            .setValue(data?.iIngresoEcoId ? +data.iIngresoEcoId : null)
        this.formEconomico
            .get('iIngresoEcoFamiliar')
            .setValue(
                data?.iIngresoEcoFamiliar ? +data.iIngresoEcoFamiliar : null
            )
        this.formEconomico
            .get('cIngresoEcoActividad')
            .setValue(
                data?.cIngresoEcoActividad ? data.cIngresoEcoActividad : null
            )
        this.formEconomico
            .get('iIngresoEcoEstudiante')
            .setValue(
                data?.iIngresoEcoEstudiante ? +data.iIngresoEcoEstudiante : null
            )
        this.formEconomico
            .get('iIngresoEcoTrabajoHoras')
            .setValue(
                data?.iIngresoEcoTrabajoHoras
                    ? +data.iIngresoEcoTrabajoHoras
                    : null
            )
        this.formEconomico
            .get('bIngresoEcoTrabaja')
            .setValue(
                data?.bIngresoEcoTrabaja ? +data.bIngresoEcoTrabaja : null
            )
        this.formEconomico
            .get('cIngresoEcoDependeDe')
            .setValue(
                data?.cIngresoEcoDependeDe ? +data.cIngresoEcoDependeDe : null
            )
        this.formEconomico
            .get('iRangoSueldoId')
            .setValue(data?.iRangoSueldoId ? +data.iRangoSueldoId : null)
        this.formEconomico
            .get('iRangoSueldoIdPersona')
            .setValue(
                data?.iRangoSueldoIdPersona ? +data.iRangoSueldoIdPersona : null
            )
        this.formEconomico
            .get('iDepEcoId')
            .setValue(data?.iDepEcoId ? +data.iDepEcoId : null)
        this.formEconomico
            .get('iTipoAEcoId')
            .setValue(data?.iTipoAEcoId ? +data.iTipoAEcoId : null)
        this.formEconomico
            .get('iJorTrabId')
            .setValue(data?.iJorTrabId ? +data.iJorTrabId : null)
        this.formEconomico
            .get('bIngresoEcoTrabaja')
            .setValue(
                data?.bIngresoEcoTrabaja ? !!+data.bIngresoEcoTrabaja : null
            )
    }

    guardar() {
        if (this.formEconomico.invalid) {
            this._MessageService.add({
                severity: 'warning',
                summary: 'Advertencia',
                detail: 'Debe completar los campos requeridos',
            })
            return
        }
        this.datosFichaBienestarService
            .guardarFichaEconomico(this.formEconomico.value)
            .subscribe({
                next: (data: any) => {
                    this.compartirFichaService.setiFichaDGId(
                        data.data[0].iFichaDGId
                    )
                    this.ficha_registrada = true
                    this.datosFichaBienestarService.formGeneral =
                        this.formEconomico.value
                },
                error: (error) => {
                    console.error('Error guardando ficha:', error)
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

    actualizar() {
        if (this.formEconomico.invalid) {
            this._MessageService.add({
                severity: 'warning',
                summary: 'Advertencia',
                detail: 'Debe completar los campos requeridos',
            })
            return
        }
        this.datosFichaBienestarService
            .actualizarFichaEconomico(this.formEconomico.value)
            .subscribe({
                next: (data: any) => {
                    this.compartirFichaService.setiFichaDGId(
                        data.data[0].iFichaDGId
                    )
                    this.ficha_registrada = true
                    this.datosFichaBienestarService.formEconomico =
                        this.formEconomico.value
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
