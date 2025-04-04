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
                iFichaDGId: [null, Validators.required],
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
                    this.setFormVivienda(data.data)
                }
            })
    }

    setFormVivienda(data: FichaVivienda) {
        this.formVivienda.patchValue(data)
        this.formVivienda
            .get('iTipoOcupaVivId')
            ?.setValue(+data.iTipoOcupaVivId)
        this.formVivienda
            .get('iViviendaCarNroPisos')
            ?.setValue(+data.iViviendaCarNroPisos)
        this.formVivienda
            .get('iViviendaCarNroAmbientes')
            ?.setValue(+data.iViviendaCarNroAmbientes)
        this.formVivienda
            .get('iViviendaCarNroHabitaciones')
            ?.setValue(+data.iViviendaCarNroHabitaciones)
        this.formVivienda.get('iEstadoVivId')?.setValue(+data.iEstadoVivId)
        this.formVivienda.get('iMatTecVivId')?.setValue(+data.iMatTecVivId)
        this.formVivienda.get('iMatPisoVivId')?.setValue(+data.iMatPisoVivId)
        this.formVivienda.get('iMatPreId')?.setValue(+data.iMatPreId)
        this.formVivienda.get('iTiposSsHhId')?.setValue(+data.iTiposSsHhId)
    }

    guardarDatos() {
        if (this.formVivienda.invalid) {
            this._messageService.add({
                severity: 'warning',
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
                severity: 'warning',
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
