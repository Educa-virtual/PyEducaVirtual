import { PrimengModule } from '@/app/primeng.module'
import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { DatosFichaBienestarService } from '../../services/datos-ficha-bienestar.service'
import { CompartirFichaService } from '../../services/compartir-ficha.service'
import { MessageService } from 'primeng/api'
import { ActivatedRoute, Router } from '@angular/router'
import { DropdownInputComponent } from '../shared/dropdown-input/dropdown-input.component'
import { MultiselectInputComponent } from '../shared/multiselect-input/multiselect-input.component'

@Component({
    selector: 'app-ficha-vivienda',
    standalone: true,
    imports: [PrimengModule, DropdownInputComponent, MultiselectInputComponent],
    templateUrl: './ficha-vivienda.component.html',
    styleUrl: './ficha-vivienda.component.scss',
})
export class FichaViviendaComponent implements OnInit {
    formVivienda: FormGroup
    ficha_registrada: boolean = false
    iFichaDGId: any

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

    private _messageService = inject(MessageService)

    constructor(
        private fb: FormBuilder,
        private datosFichaBienestar: DatosFichaBienestarService,
        private compartirFicha: CompartirFichaService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.compartirFicha.setActiveIndex(3)
        this.route.parent?.paramMap.subscribe((params) => {
            this.iFichaDGId = params.get('id')
        })
        if (!this.iFichaDGId) {
            this.router.navigate(['/'])
        }
    }

    ngOnInit(): void {
        this.datosFichaBienestar.getFichaParametros().subscribe((data: any) => {
            this.ocupaciones_vivienda =
                this.datosFichaBienestar.getOcupacionesVivienda(
                    data?.ocupaciones_vivienda
                )
            this.estados_vivienda = this.datosFichaBienestar.getEstadosVivienda(
                data?.estados_vivienda
            )
            this.tipos_vivienda = this.datosFichaBienestar.getTiposVivienda(
                data?.tipos_vivienda
            )
            this.materiales_paredes_vivienda =
                this.datosFichaBienestar.getParedesVivienda(
                    data?.materiales_paredes_vivienda
                )
            this.materiales_techos_vivienda =
                this.datosFichaBienestar.getTechosVivienda(
                    data?.materiales_techos_vivienda
                )
            this.materiales_pisos_vivienda =
                this.datosFichaBienestar.getPisosVivienda(
                    data?.materiales_pisos_vivienda
                )
            this.suministros_agua = this.datosFichaBienestar.getSuministrosAgua(
                data?.suministros_agua
            )
            this.tipos_sshh = this.datosFichaBienestar.getTiposSshh(
                data?.tipos_sshh
            )
            this.tipos_alumbrado = this.datosFichaBienestar.getTiposAlumbrado(
                data?.tipos_alumbrado
            )
            this.otros_elementos = this.datosFichaBienestar.getOtrosElementos(
                data?.otros_elementos
            )
        })

        if (this.iFichaDGId) {
            this.verFichaVivienda()
        }

        this.visibleInput = Array(10).fill(false)

        try {
            this.formVivienda = this.fb.group({
                iViendaCarId: [null],
                iFichaDGId: [this.iFichaDGId, Validators.required],
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
                jsonAlumbrados: [null],
                jsonElementos: [null],
                cTipoOcupaVivOtro: [''],
                cEstadoVivOtro: [''],
                cMatTecVivOtro: [''],
                cMatPisoVivOtro: [''],
                cMatPreOtro: [''],
                cTipoSumAOtro: [''],
                cTipoVivOtro: [''],
                cTipoSsHhOtro: [''],
                cTipoAlumOtro: [''],
                cEleParaVivOtro: [''],
            })
        } catch (error) {
            console.log(error, 'error inicializando formulario')
        }
    }

    async verFichaVivienda() {
        this.datosFichaBienestar
            .verFichaVivienda({
                iFichaDGId: this.iFichaDGId,
            })
            .subscribe((data: any) => {
                if (data.data.length) {
                    this.setFormVivienda(data.data[0])
                }
            })
    }

    setFormVivienda(data: any) {
        this.ficha_registrada = true
        this.formVivienda.patchValue(data)
        this.datosFichaBienestar.formatearFormControl(
            this.formVivienda,
            'iTipoOcupaVivId',
            data.iTipoOcupaVivId,
            'number'
        )
        this.datosFichaBienestar.formatearFormControl(
            this.formVivienda,
            'iMatPreId',
            data.iMatPreId,
            'number'
        )
        this.datosFichaBienestar.formatearFormControl(
            this.formVivienda,
            'iTipoVivId',
            data.iTipoVivId,
            'number'
        )
        this.datosFichaBienestar.formatearFormControl(
            this.formVivienda,
            'iViviendaCarNroPisos',
            data.iViviendaCarNroPisos,
            'number'
        )
        this.datosFichaBienestar.formatearFormControl(
            this.formVivienda,
            'iViviendaCarNroAmbientes',
            data.iViviendaCarNroAmbientes,
            'number'
        )
        this.datosFichaBienestar.formatearFormControl(
            this.formVivienda,
            'iViviendaCarNroHabitaciones',
            data.iViviendaCarNroHabitaciones,
            'number'
        )
        this.datosFichaBienestar.formatearFormControl(
            this.formVivienda,
            'iEstadoVivId',
            data.iEstadoVivId,
            'number'
        )
        this.datosFichaBienestar.formatearFormControl(
            this.formVivienda,
            'iMatPisoVivId',
            data.iMatPisoVivId,
            'number'
        )
        this.datosFichaBienestar.formatearFormControl(
            this.formVivienda,
            'iMatTecVivId',
            data.iMatTecVivId,
            'number'
        )
        this.datosFichaBienestar.formatearFormControl(
            this.formVivienda,
            'iTiposSsHhId',
            data.iTiposSsHhId,
            'number'
        )
        this.datosFichaBienestar.formatearFormControl(
            this.formVivienda,
            'iTipoSumAId',
            data.iTipoSumAId,
            'number'
        )
        this.datosFichaBienestar.formatearFormControl(
            this.formVivienda,
            'iTipoAlumId',
            data.alumbrados,
            'json'
        )
        this.datosFichaBienestar.formatearFormControl(
            this.formVivienda,
            'iEleParaVivId',
            data.elementos,
            'json'
        )
    }

    guardar() {
        if (this.formVivienda.invalid) {
            this._messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe completar los campos requeridos',
            })
            return
        }

        const elementos = []
        this.formVivienda.get('iEleParaVivId').value.forEach((elemento) => {
            elementos.push({
                iEleParaVivId: elemento,
            })
        })
        this.formVivienda
            .get('jsonElementos')
            .setValue(JSON.stringify(elementos))

        const alumbrados = []
        this.formVivienda.get('iTipoAlumId').value.forEach((elemento) => {
            alumbrados.push({
                iTipoAlumId: elemento,
            })
        })
        this.formVivienda
            .get('jsonAlumbrados')
            .setValue(JSON.stringify(alumbrados))

        this.datosFichaBienestar
            .guardarFichaVivienda(this.formVivienda.value)
            .subscribe({
                next: (data: any) => {
                    this.compartirFicha.setiFichaDGId(data.data[0].iFichaDGId)
                    this.ficha_registrada = true
                    this.datosFichaBienestar.formVivienda =
                        this.formVivienda.value
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
                        detail: error.error.message,
                    })
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    actualizar() {
        if (this.formVivienda.invalid) {
            this._messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe completar los campos requeridos',
            })
            return
        }

        if (this.formVivienda.get('iEleParaVivId').value !== null) {
            const elementos = []
            this.formVivienda.get('iEleParaVivId').value.forEach((elemento) => {
                elementos.push({
                    iEleParaVivId: elemento,
                })
            })
            this.formVivienda
                .get('jsonElementos')
                .setValue(JSON.stringify(elementos))
        } else {
            this.formVivienda.get('jsonElementos').setValue(null)
        }

        if (this.formVivienda.get('iTipoAlumId').value !== null) {
            const alumbrados = []
            this.formVivienda.get('iTipoAlumId').value.forEach((elemento) => {
                alumbrados.push({
                    iTipoAlumId: elemento,
                })
            })
            this.formVivienda
                .get('jsonAlumbrados')
                .setValue(JSON.stringify(alumbrados))
        } else {
            this.formVivienda.get('jsonAlumbrados').setValue(null)
        }

        this.datosFichaBienestar
            .actualizarFichaVivienda(this.formVivienda.value)
            .subscribe({
                next: (data: any) => {
                    this.formVivienda
                        .get('iViendaCarId')
                        .setValue(data.data[0].iIngresoEcoId)
                    this.ficha_registrada = true
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
