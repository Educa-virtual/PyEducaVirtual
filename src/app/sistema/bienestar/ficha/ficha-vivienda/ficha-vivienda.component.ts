import { PrimengModule } from '@/app/primeng.module'
import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { DatosFichaBienestarService } from '../../services/datos-ficha-bienestar.service'
import { CompartirFichaService } from '../../services/compartir-ficha.service'
import { MessageService } from 'primeng/api'
import { ActivatedRoute, Router } from '@angular/router'
import { DropdownInputComponent } from '../shared/dropdown-input/dropdown-input.component'
import { MultiselectInputComponent } from '../shared/multiselect-input/multiselect-input.component'
import { InputSimpleComponent } from '../shared/input-simple/input-simple.component'
import { FuncionesBienestarService } from '../../services/funciones-bienestar.service'

@Component({
    selector: 'app-ficha-vivienda',
    standalone: true,
    imports: [
        PrimengModule,
        DropdownInputComponent,
        MultiselectInputComponent,
        InputSimpleComponent,
    ],
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
        private route: ActivatedRoute,
        private funcionesBienestar: FuncionesBienestarService
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
                iMatPreId: [null, Validators.required],
                iTipoVivId: [null],
                iViviendaCarNroPisos: [null],
                iViviendaCarNroAmbientes: [null],
                iViviendaCarNroHabitaciones: [null],
                iEstadoVivId: [null],
                iMatPisoVivId: [null],
                iMatTecVivId: [null],
                iTiposSsHhId: [null, Validators.required],
                iTipoSumAId: [null, Validators.required],
                iTipoAlumId: [null, Validators.required],
                iEleParaVivId: [null],
                jsonAlumbrados: [null],
                jsonElementos: [null],
                cTipoOcupaVivOtro: ['', Validators.maxLength(80)],
                cEstadoVivOtro: ['', Validators.maxLength(80)],
                cMatTecVivOtro: ['', Validators.maxLength(80)],
                cMatPisoVivOtro: ['', Validators.maxLength(80)],
                cMatPreOtro: ['', Validators.maxLength(80)],
                cTipoSumAOtro: ['', Validators.maxLength(80)],
                cTipoVivOtro: ['', Validators.maxLength(80)],
                cTipoSsHhOtro: ['', Validators.maxLength(80)],
                cTipoAlumOtro: ['', Validators.maxLength(80)],
                cEleParaVivOtro: ['', Validators.maxLength(80)],
            })
        } catch (error) {
            console.log(error, 'error inicializando formulario')
        }

        this.funcionesBienestar.formMarkAsDirty(this.formVivienda)
    }

    verFichaVivienda() {
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
        this.funcionesBienestar.formatearFormControl(
            this.formVivienda,
            'iTipoOcupaVivId',
            data.iTipoOcupaVivId,
            'number'
        )
        this.funcionesBienestar.formatearFormControl(
            this.formVivienda,
            'iMatPreId',
            data.iMatPreId,
            'number'
        )
        this.funcionesBienestar.formatearFormControl(
            this.formVivienda,
            'iTipoVivId',
            data.iTipoVivId,
            'number'
        )
        this.funcionesBienestar.formatearFormControl(
            this.formVivienda,
            'iViviendaCarNroPisos',
            data.iViviendaCarNroPisos,
            'number'
        )
        this.funcionesBienestar.formatearFormControl(
            this.formVivienda,
            'iViviendaCarNroAmbientes',
            data.iViviendaCarNroAmbientes,
            'number'
        )
        this.funcionesBienestar.formatearFormControl(
            this.formVivienda,
            'iViviendaCarNroHabitaciones',
            data.iViviendaCarNroHabitaciones,
            'number'
        )
        this.funcionesBienestar.formatearFormControl(
            this.formVivienda,
            'iEstadoVivId',
            data.iEstadoVivId,
            'number'
        )
        this.funcionesBienestar.formatearFormControl(
            this.formVivienda,
            'iMatPisoVivId',
            data.iMatPisoVivId,
            'number'
        )
        this.funcionesBienestar.formatearFormControl(
            this.formVivienda,
            'iMatTecVivId',
            data.iMatTecVivId,
            'number'
        )
        this.funcionesBienestar.formatearFormControl(
            this.formVivienda,
            'iTiposSsHhId',
            data.iTiposSsHhId,
            'number'
        )
        this.funcionesBienestar.formatearFormControl(
            this.formVivienda,
            'iTipoSumAId',
            data.iTipoSumAId,
            'number'
        )
        this.funcionesBienestar.formatearFormControl(
            this.formVivienda,
            'iTipoAlumId',
            data.alumbrados,
            'json'
        )
        this.funcionesBienestar.formatearFormControl(
            this.formVivienda,
            'iEleParaVivId',
            data.elementos,
            'json'
        )

        this.funcionesBienestar.formMarkAsDirty(this.formVivienda)
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

        this.funcionesBienestar.formControlJsonStringify(
            this.formVivienda,
            'jsonElementos',
            'iEleParaVivId'
        )
        this.funcionesBienestar.formControlJsonStringify(
            this.formVivienda,
            'jsonAlumbrados',
            'iTipoAlumId'
        )

        this.datosFichaBienestar
            .actualizarFichaVivienda(this.formVivienda.value)
            .subscribe({
                next: (data: any) => {
                    this.formVivienda
                        .get('iViendaCarId')
                        .setValue(data.data[0].iViendaCarId)
                    this.ficha_registrada = true
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Actualización exitosa',
                        detail: 'Se actualizaron los datos',
                    })
                    setTimeout(() => {
                        this.router.navigate([
                            `/bienestar/ficha/${this.iFichaDGId}/alimentacion`,
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
