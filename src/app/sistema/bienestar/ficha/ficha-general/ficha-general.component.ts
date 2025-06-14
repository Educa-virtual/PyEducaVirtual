import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { PrimengModule } from '@/app/primeng.module'
import { DropdownModule } from 'primeng/dropdown'
import { InputTextModule } from 'primeng/inputtext'
import { DatosFichaBienestarService } from '../../services/datos-ficha-bienestar.service'
import { MessageService } from 'primeng/api'
import { CompartirFichaService } from '../../services/compartir-ficha.service'
import { FichaGeneral } from '../../interfaces/fichaGeneral'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { ActivatedRoute } from '@angular/router'

@Component({
    selector: 'app-ficha-socioeconomica',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        InputTextModule,
        FormsModule,
        PrimengModule,
        //TablePrimengComponent,
        DropdownModule,
    ],
    templateUrl: './ficha-general.component.html',
    styleUrl: './ficha-general.component.scss',
})
export class FichaGeneralComponent implements OnInit {
    formGroup: FormGroup | undefined
    formGeneral: FormGroup
    religiones: Array<object>
    tipos_vias: Array<object>
    visibleInput: Array<boolean>
    ficha_registrada: boolean = false
    idFicha: any

    private _MessageService = inject(MessageService)
    private _ConfirmService = inject(ConfirmationModalService)

    constructor(
        private fb: FormBuilder,
        private datosFichaBienestarService: DatosFichaBienestarService,
        private compartirFichaService: CompartirFichaService,
        private route: ActivatedRoute
    ) {
        this.compartirFichaService.setActiveIndex(0)
    }

    ngOnInit() {
        this.route.parent?.paramMap.subscribe((params) => {
            this.idFicha = params.get('id')
        })
        console.log(this.idFicha)
        this.visibleInput = Array(3).fill(false)

        this.formGeneral = this.fb.group({
            iPersId: this.compartirFichaService.perfil?.iPersId,
            iFichaDGId: this.compartirFichaService.getiFichaDGId(),
            iTipoViaId: [null, Validators.required],
            cTipoViaOtro: [''],
            cFichaDGDireccionNombreVia: ['', Validators.required],
            cFichaDGDireccionNroPuerta: [''],
            cFichaDGDireccionBlock: [''],
            cFichaDGDirecionInterior: [''],
            cFichaDGDirecionPiso: [''],
            cFichaDGDireccionManzana: [''],
            cFichaDGDireccionLote: [''],
            cFichaDGDireccionKm: [''],
            cFichaDGDireccionReferencia: [''],
            iReligionId: [null],
            cReligionOtro: [''],
            bFamiliarPadreVive: [false],
            bFamiliarMadreVive: [false],
            bFamiliarPadresVivenJuntos: [false],
            bFichaDGTieneHijos: [false],
            iFichaDGNroHijos: [null],
        })

        // Habilitar o deshabilitar el campo "iFichaDGNroHijos" en función de "bFichaDGTieneHijos"
        this.formGeneral
            .get('bFichaDGTieneHijos')
            ?.valueChanges.subscribe((value) => {
                if (value) {
                    this.visibleInput[0] = true
                } else {
                    this.visibleInput[0] = false
                    this.formGeneral.get('iFichaDGNroHijos')?.setValue(null) // Limpia si desactivan
                }
            })

        this.datosFichaBienestarService
            .getFichaParametros()
            .subscribe((data: any) => {
                this.tipos_vias = this.datosFichaBienestarService.getTiposVias(
                    data?.tipos_vias
                )
                this.religiones = this.datosFichaBienestarService.getReligiones(
                    data?.religiones
                )
            })

        this.searchFichaGeneral()
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

    async searchFichaGeneral(): Promise<void> {
        const data = await this.datosFichaBienestarService.searchFichaGeneral({
            iFichaDGId: await this.compartirFichaService.getiFichaDGId(),
        })
        if (data) {
            this.setFormGeneral(data)
        }
    }

    setFormGeneral(data: FichaGeneral) {
        this.ficha_registrada = true
        this.formGeneral.patchValue(data)
        this.compartirFichaService.setiFichaDGId(
            data.iFichaDGId ? data.iFichaDGId + '' : null
        )
        this.formGeneral
            .get('iFichaDGId')
            .setValue(data.iFichaDGId ? +data.iFichaDGId : null)
        this.formGeneral
            .get('iTipoViaId')
            .setValue(data.iTipoViaId ? +data.iTipoViaId : null)
        this.formGeneral
            .get('iReligionId')
            .setValue(data.iReligionId ? +data.iReligionId : null)
        this.formGeneral
            .get('bFamiliarPadreVive')
            .setValue(!!+data.bFamiliarPadreVive)
        this.formGeneral
            .get('bFamiliarMadreVive')
            .setValue(!!+data.bFamiliarMadreVive)
        this.formGeneral
            .get('bFamiliarPadresVivenJuntos')
            .setValue(!!+data.bFamiliarPadresVivenJuntos)
        this.formGeneral
            .get('bFichaDGTieneHijos')
            .setValue(!!+data.bFichaDGTieneHijos)
        this.formGeneral.get('iFichaDGNroHijos').setValue(data.iFichaDGNroHijos)
    }

    guardar() {
        if (this.formGeneral.invalid) {
            this._MessageService.add({
                severity: 'warning',
                summary: 'Advertencia',
                detail: 'Debe completar los campos requeridos',
            })
            return
        }
        this.datosFichaBienestarService
            .guardarFichaGeneral(this.formGeneral.value)
            .subscribe({
                next: (data: any) => {
                    this.compartirFichaService.setiFichaDGId(
                        data.data[0].iFichaDGId
                    )
                    this.ficha_registrada = true
                    this.datosFichaBienestarService.formGeneral =
                        this.formGeneral.value
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
        if (this.formGeneral.invalid) {
            this._MessageService.add({
                severity: 'warning',
                summary: 'Advertencia',
                detail: 'Debe completar los campos requeridos',
            })
            return
        }
        this.datosFichaBienestarService
            .actualizarFichaGeneral(this.formGeneral.value)
            .subscribe({
                next: (data: any) => {
                    this.compartirFichaService.setiFichaDGId(
                        data.data[0].iFichaDGId
                    )
                    this.ficha_registrada = true
                    this.datosFichaBienestarService.formGeneral =
                        this.formGeneral.value
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
}
