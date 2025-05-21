import { PrimengModule } from '@/app/primeng.module'
import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { DatosFichaBienestarService } from '../../services/datos-ficha-bienestar.service'
import { CompartirFichaService } from '../../services/compartir-ficha.service'
import { FichaVivienda } from '../../interfaces/fichaVivienda'
import { MessageService } from 'primeng/api'
import { Router } from '@angular/router'

@Component({
    selector: 'app-ficha-vivienda',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './ficha-vivienda.component.html',
    styleUrl: './ficha-vivienda.component.scss',
})
export class FichaViviendaComponent implements OnInit {
    formVivienda: FormGroup
    vivienda_registrada: boolean = false

    ocupaciones_vivienda: Array<object>
    pisos_vivienda: Array<object>
    estados_vivienda: Array<object>
    materiales_paredes_vivienda: Array<object>
    materiales_pisos_vivienda: Array<object>
    materiales_techos_vivienda: Array<object>
    tipos_vivienda: Array<object>
    suministros_agua: Array<object>
    tipos_sshh: Array<object>
    tipos_alumbrado: Array<object>
    otros_elementos: Array<object>

    visibleInput: Array<boolean>

    constructor(
        private fb: FormBuilder,
        private datosFichaBienestarService: DatosFichaBienestarService,
        private compartirFichaService: CompartirFichaService,
        private router: Router
    ) {
        if (this.compartirFichaService.getiFichaDGId() === null) {
            this.router.navigate(['/bienestar/ficha/general'])
        }
        this.compartirFichaService.setActiveIndex(3)
    }

    private _messageService = inject(MessageService)

    ngOnInit(): void {
        this.datosFichaBienestarService
            .getFichaParametros()
            .subscribe((data: any) => {
                this.ocupaciones_vivienda =
                    this.datosFichaBienestarService.getOcupacionesVivienda(
                        data?.ocupaciones_vivienda
                    )
                this.estados_vivienda =
                    this.datosFichaBienestarService.getEstadosVivienda(
                        data?.estados_vivienda
                    )
                this.tipos_vivienda =
                    this.datosFichaBienestarService.getTiposVivienda(
                        data?.tipos_vivienda
                    )
                this.materiales_paredes_vivienda =
                    this.datosFichaBienestarService.getParedesVivienda(
                        data?.materiales_paredes_vivienda
                    )
                this.materiales_techos_vivienda =
                    this.datosFichaBienestarService.getTechosVivienda(
                        data?.materiales_techos_vivienda
                    )
                this.materiales_pisos_vivienda =
                    this.datosFichaBienestarService.getPisosVivienda(
                        data?.materiales_pisos_vivienda
                    )
                this.suministros_agua =
                    this.datosFichaBienestarService.getSuministrosAgua(
                        data?.suministros_agua
                    )
                this.tipos_sshh = this.datosFichaBienestarService.getTiposSshh(
                    data?.tipos_sshh
                )
                this.tipos_alumbrado =
                    this.datosFichaBienestarService.getTiposAlumbrado(
                        data?.tipos_alumbrado
                    )
                this.otros_elementos =
                    this.datosFichaBienestarService.getOtrosElementos(
                        data?.otros_elementos
                    )
            })

        if (this.compartirFichaService.getiFichaDGId()) {
            this.searchFichaVivienda()
        }

        this.visibleInput = Array(10).fill(false)

        try {
            this.formVivienda = this.fb.group({
                iViendaCarId: [null],
                iFichaDGId: [
                    this.compartirFichaService.getiFichaDGId(),
                    Validators.required,
                ],
                iTipoOcupaVivId: [null],
                iMatPreId: [null],
                iTipoVivId: [null],
                iViviendaCarNroPisos: [null],
                iViviendaCarNroAmbientes: [null],
                iViviendaCarNroHabitaciones: [null],
                iEstadoVivId: [null],
                iMatPisoVivId: [null],
                iMatTecVivId: [null],
                iTiposSsHhId: [null],
                iTipoSumAId: [null],
                iTipoAlumId: [null],
                iEleParaVivId: [null],
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

    searchFichaVivienda() {
        this.datosFichaBienestarService
            .searchFichaVivienda({
                iFichaDGId: this.compartirFichaService.getiFichaDGId(),
            })
            .subscribe((data: any) => {
                if (data.data.length) {
                    this.setFormVivienda(data.data[0])
                }
            })
    }

    setFormVivienda(data: FichaVivienda) {
        this.formVivienda.patchValue(data)
        this.formatearFormControl(
            'iTipoOcupaVivId',
            data.iTipoOcupaVivId,
            'num'
        )
        this.formatearFormControl('iMatPreId', data.iMatPreId, 'num')
        this.formatearFormControl('iTipoVivId', data.iTipoVivId, 'num')
        this.formatearFormControl(
            'iViviendaCarNroPisos',
            data.iViviendaCarNroPisos,
            'num'
        )
        this.formatearFormControl(
            'iViviendaCarNroAmbientes',
            data.iViviendaCarNroAmbientes,
            'num'
        )
        this.formatearFormControl(
            'iViviendaCarNroHabitaciones',
            data.iViviendaCarNroHabitaciones,
            'num'
        )
        this.formatearFormControl('iEstadoVivId', data.iEstadoVivId, 'num')
        this.formatearFormControl('iMatPisoVivId', data.iMatPisoVivId, 'num')
        this.formatearFormControl('iMatTecVivId', data.iMatTecVivId, 'num')
        this.formatearFormControl('iTiposSsHhId', data.iTiposSsHhId, 'num')
        this.formatearFormControl('iTipoSumAId', data.iTipoSumAId, 'num')
        // this.formatearFormControl('iTipoAlumId', data.iTipoAlumId, 'num')
    }

    formatearFormControl(id: string, value: any, tipo: string = 'str') {
        if (tipo === 'num') {
            this.formVivienda.get(id)?.setValue(value ? +value : null)
        } else if (tipo === 'str') {
            this.formVivienda.get(id)?.setValue(value)
        } else {
            this.formVivienda.get(id)?.setValue(value)
        }
    }

    guardarDatos() {
        if (this.formVivienda.invalid) {
            this._messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe completar los campos requeridos',
            })
            return
        }
        this.datosFichaBienestarService
            .guardarFichaVivienda(this.formVivienda.value)
            .subscribe({
                next: (data: any) => {
                    this.compartirFichaService.setiFichaDGId(
                        data.data[0].iFichaDGId
                    )
                    this.vivienda_registrada = true
                    this.datosFichaBienestarService.formVivienda =
                        this.formVivienda.value
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

    actualizarDatos() {
        if (this.formVivienda.invalid) {
            this._messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe completar los campos requeridos',
            })
            return
        }
        this.datosFichaBienestarService
            .actualizarFichaVivienda(this.formVivienda.value)
            .subscribe({
                next: (data: any) => {
                    this.compartirFichaService.setiFichaDGId(
                        data.data[0].iFichaDGId
                    )
                    this.vivienda_registrada = true
                    this.datosFichaBienestarService.formVivienda =
                        this.formVivienda.value
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
}
