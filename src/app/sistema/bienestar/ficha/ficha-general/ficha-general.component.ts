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

    private _MessageService = inject(MessageService)
    private _ConfirmService = inject(ConfirmationModalService)

    constructor(
        private fb: FormBuilder,
        private datosFichaBienestarService: DatosFichaBienestarService,
        private compartirFichaService: CompartirFichaService
    ) {}

    ngOnInit() {
        console.log('iniciando')
        this.visibleInput = Array(3).fill(false)

        this.formGeneral = this.fb.group({
            iSesionId: this.compartirFichaService.perfil?.iCredId,
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

        if (this.compartirFichaService.getiPersId()) {
            this.searchFichaGeneral()
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

    searchFichaGeneral() {
        this.datosFichaBienestarService
            .searchFichaGeneral({
                iFichaDGId: this.compartirFichaService.getiFichaDGId(),
                iPersId: this.compartirFichaService.getiPersId(),
                iYAcadId: this.compartirFichaService.iYAcadId,
            })
            .subscribe((data: any) => {
                if (data) {
                    this.setFormGeneral(data)
                }
            })
    }

    setFormGeneral(data: FichaGeneral) {
        this.ficha_registrada = true
        this.formGeneral.patchValue(data)
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
                    console.log(data.data[0].iFichaDGId, 'ficha')
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
