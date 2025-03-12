import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { PrimengModule } from '@/app/primeng.module'
import { DropdownModule } from 'primeng/dropdown'
import { InputTextModule } from 'primeng/inputtext'
import { DatosFichaBienestarService } from '../services/datos-ficha-bienestar.service'
import { MessageService } from 'primeng/api'
import { CompartirFichaService } from '../services/compartir-ficha.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'

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

    constructor(
        private fb: FormBuilder,
        private datosFichaBienestarService: DatosFichaBienestarService,
        private compartirFichaService: CompartirFichaService,
        private store: LocalStoreService
    ) {}

    ngOnInit() {
        const perfil = this.store.getItem('dremoPerfil')

        this.formGroup = new FormGroup({
            text: new FormControl<string | null>(null),
        })

        this.datosFichaBienestarService.getReligiones().subscribe((data) => {
            this.religiones = data
        })

        this.datosFichaBienestarService.getTiposVias().subscribe((data) => {
            this.tipos_vias = data
        })

        this.formGeneral = this.fb.group({
            iSesionId: perfil?.iCredId,
            iPersId: perfil?.iPersId,
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

        if (this.compartirFichaService.getiFichaDGId() !== null) {
            this.searchFichaGeneral()
        }
    }

    searchFichaGeneral() {
        this.datosFichaBienestarService
            .searchFichaGeneral({
                iFichaDGId: this.compartirFichaService.getiFichaDGId(),
            })
            .subscribe((data: any) => {
                this.setFormGeneral(data)
            })
    }

    setFormGeneral(data: any) {
        this.formGeneral.patchValue(data)
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
                        data.data.iFichaDGId
                    )
                    this.compartirFichaService.setiPersId(data.data.iPersId)
                    this.ficha_registrada = true
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
                        data.data.iFichaDGId
                    )
                    this.compartirFichaService.setiPersId(data.data.iPersId)
                    this.ficha_registrada = true
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
