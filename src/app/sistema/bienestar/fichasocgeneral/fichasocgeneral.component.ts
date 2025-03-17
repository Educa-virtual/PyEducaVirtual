import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { PrimengModule } from '@/app/primeng.module'
import { DropdownModule } from 'primeng/dropdown'
import { InputTextModule } from 'primeng/inputtext'
import { DatosFichaBienestarService } from '../services/datos-ficha-bienestar.service'
import { MessageService } from 'primeng/api'
import { CompartirFichaService } from '../services/compartir-ficha.service'
import { FichaGeneral } from '../interfaces/fichaGeneral'
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
    templateUrl: './fichasocgeneral.component.html',
    styleUrl: './fichasocgeneral.component.scss',
})
export class FichasocgeneralComponent implements OnInit {
    formGroup: FormGroup | undefined
    formGeneral: FormGroup
    religiones: Array<object>
    tipos_vias: Array<object>
    visibleInput: boolean = false
    ficha_registrada: boolean = false

    private _MessageService = inject(MessageService)
    private _ConfirmService = inject(ConfirmationModalService)

    constructor(
        private fb: FormBuilder,
        private datosFichaBienestarService: DatosFichaBienestarService,
        private compartirFichaService: CompartirFichaService
    ) {}

    ngOnInit() {
        this.formGeneral = this.fb.group({
            iSesionId: this.compartirFichaService.perfil?.iCredId,
            iPersId: this.compartirFichaService.perfil?.iPersId,
            iFichaDGId: [null],
            iTipoViaId: [null],
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
                    this.visibleInput = true
                } else {
                    this.visibleInput = false
                    this.formGeneral.get('iFichaDGNroHijos')?.setValue(null) // Limpia si desactivan
                }
            })

        this.datosFichaBienestarService
            .getFichaGeneralParametros()
            .subscribe((data: any) => {
                this.tipos_vias = this.datosFichaBienestarService.getTiposVias(
                    data?.tipos_vias
                )
                this.religiones = this.datosFichaBienestarService.getReligiones(
                    data?.religiones
                )
            })

        if (this.compartirFichaService.getiFichaDGId()) {
            this.searchFichaGeneral()
        }
    }

    searchFichaGeneral() {
        this.datosFichaBienestarService
            .searchFichaGeneral({
                iFichaDGId: this.compartirFichaService.getiFichaDGId(),
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
        this.formGeneral.get('iTipoViaId').setValue(+data.iTipoViaId)
        this.formGeneral.get('iReligionId').setValue(+data.iReligionId)
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
