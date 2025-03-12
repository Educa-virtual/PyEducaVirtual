import { PrimengModule } from '@/app/primeng.module'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MessageService } from 'primeng/api'
import { DatosFichaBienestarService } from '../../../services/datos-ficha-bienestar.service'
import { CompartirFichaService } from '../../../services/compartir-ficha.service'

@Component({
    selector: 'app-ficha-familia-registro',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './ficha-familia-registro.component.html',
    styleUrl: './ficha-familia-registro.component.scss',
})
export class FichaFamiliaRegistroComponent implements OnInit {
    formFamiliar: FormGroup
    familiar_registrado: boolean = false

    tipos_documentos: Array<object>
    tipos_familiares: Array<object>
    sexos: Array<object>
    estados_civiles: Array<object>
    tipos_vias: Array<object>
    nacionalidades: Array<object>
    departamentos: Array<object>
    provincias: Array<object>
    distritos: Array<object>
    tipos_contacto: Array<object>
    ubigeo: Array<object>
    ocupaciones: Array<object>
    grados_instruccion: Array<object>
    tipos_ies: Array<object>

    estudiante_registrado: boolean = false
    longitud_documento: number
    formato_documento: string = '99999999'
    es_peruano: boolean = true
    documento_consultable: boolean = true

    private _messageService = inject(MessageService) // dialog Mensaje simple
    private _confirmService = inject(ConfirmationModalService) // componente de dialog mensaje

    constructor(
        private fb: FormBuilder,
        private datosFichaBienestarService: DatosFichaBienestarService,
        private compartirFichaService: CompartirFichaService
    ) {}

    ngOnInit(): void {
        this.datosFichaBienestarService
            .getTiposFamiliares()
            .subscribe((data) => {
                this.tipos_familiares = data
            })
        this.datosFichaBienestarService
            .getTiposDocumentos()
            .subscribe((data) => {
                this.tipos_documentos = data
            })
        this.datosFichaBienestarService
            .getEstadosCiviles()
            .subscribe((data) => {
                this.estados_civiles = data
            })
        this.datosFichaBienestarService.getDepartamentos().subscribe((data) => {
            this.departamentos = data
        })
        this.datosFichaBienestarService.getTiposContacto().subscribe((data) => {
            this.tipos_contacto = data
        })
        this.datosFichaBienestarService.getTiposVias().subscribe((data) => {
            this.tipos_vias = data
        })
        this.datosFichaBienestarService.getOcupaciones().subscribe((data) => {
            this.ocupaciones = data
        })
        this.datosFichaBienestarService
            .getGradosInstruccion()
            .subscribe((data) => {
                this.grados_instruccion = data
            })
        this.datosFichaBienestarService.getTiposIes().subscribe((data) => {
            this.tipos_ies = data
        })
        this.sexos = this.datosFichaBienestarService.getSexos()

        try {
            this.formFamiliar = this.fb.group({
                iFichaDGId: this.compartirFichaService.getiFichaDGId(), // PK
                iPersId: [null, Validators.required],
                iTipoFamiliarId: [null, Validators.required],
                bFamiliarVivoConEl: [false],
                iTipoIdentId: [null, Validators.required],
                cPersDocumento: ['', Validators.required],
                cPersNombre: ['', Validators.required],
                cPersPaterno: ['', Validators.required],
                cPersMaterno: [''],
                dPersNacimiento: [Validators.required],
                cPersSexo: [null, Validators.required],
                iTipoEstCivId: [null],
                iNacionId: [null],
                iDptoId: [null],
                iPrvnId: [null],
                iDsttId: [null],
                cPersDomicilio: [''],
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
                iOcupacionId: [null],
                iGradoInstId: [null],
                iTipoIeEstId: [null],
            })
        } catch (error) {
            console.log(error, 'error al inicializar formulario')
        }

        this.formFamiliar
            .get('iTipoIdentId')
            .valueChanges.subscribe((value) => {
                this.formFamiliar.get('cPersDocumento').setValue(null)
                // Solo permitir validar DNI, CDE y RUC
                this.documento_consultable = [1, 2, 3].includes(value)
                    ? true
                    : false
                const tipo_doc = this.tipos_documentos.find(
                    (item: any) => item.id === value
                )
                this.longitud_documento = tipo_doc['longitud']
                this.formato_documento = '9'.repeat(this.longitud_documento)
            })

        this.formFamiliar.get('iNacionId').valueChanges.subscribe((value) => {
            this.es_peruano = value === 193 ? true : false
        })

        this.formFamiliar.get('iDptoId').valueChanges.subscribe((value) => {
            this.formFamiliar.get('iPrvnId').setValue(null)
            this.provincias = null
            this.getProvincias(value)
        })

        this.formFamiliar.get('iPrvnId').valueChanges.subscribe((value) => {
            this.formFamiliar.get('iDsttId').setValue(null)
            this.distritos = null
            this.getDistritos(value)
        })

        this.formFamiliar.get('iDsttId').valueChanges.subscribe((value) => {
            this.formFamiliar.get('cEstUbigeo').setValue(null)
            if (!value) return null
            if (!this.distritos) return null
            const item = this.distritos.find((item: any) => item.id === value)
            if (item) {
                this.formFamiliar
                    .get('cEstUbigeo')
                    .setValue(item['ubigeo_inei'])
            } else {
                this.formFamiliar.get('cEstUbigeo').setValue('')
            }
        })
    }

    getProvincias(iDptoId: number) {
        if (!iDptoId) return null
        this.datosFichaBienestarService.getProvincias(iDptoId).subscribe({
            next: (data) => {
                this.provincias = data
            },
        })
    }

    getDistritos(iPrvnId: number) {
        if (!iPrvnId) return null
        this.datosFichaBienestarService.getDistritos(iPrvnId).subscribe({
            next: (data) => {
                this.distritos = data
            },
        })
    }

    /**
     * Buscar datos de persona segun documento en formulario
     */
    validarPersona() {
        this.datosFichaBienestarService
            .validarPersona({
                iTipoIdentId: this.formFamiliar.get('iTipoIdentId')?.value,
                cPersDocumento: this.formFamiliar.get('cPersDocumento')?.value,
            })
            .subscribe({
                next: (data: any) => {
                    console.log(data, 'validar persona')
                    this.setFormFamiliar(data.data)
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: data.message,
                    })
                },
                error: (error) => {
                    console.error('Error validando persona:', error)
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

    /**
     * Buscar datos de familiar segun id compartido
     */
    buscarFamiliar() {
        console.log('buscar familiar')
    }

    /**
     * Setea los datos de un familiar seleccionado
     * @param item datos del familiar seleccionado
     */
    setFormFamiliar(item: any) {
        // Deben ser strings o null
        this.formFamiliar.get('iFichaDGId')?.setValue(item?.iFichaDGId)
        this.formFamiliar.get('iPersId')?.setValue(item?.iPersId)
        this.formFamiliar.get('cEstCodigo')?.setValue(item?.cEstCodigo)
        this.formFamiliar.get('iTipoIdentId')?.setValue(item?.iTipoIdentId)
        this.formFamiliar.get('cPersDocumento')?.setValue(item?.cPersDocumento)
        this.formFamiliar.get('cPersNombre')?.setValue(item?.cPersNombre)
        this.formFamiliar.get('cPersPaterno')?.setValue(item?.cPersPaterno)
        this.formFamiliar.get('cPersMaterno')?.setValue(item?.cPersMaterno)
        this.formFamiliar.get('cPersSexo')?.setValue(item?.cPersSexo)
        this.formFamiliar.get('iTipoEstCivId')?.setValue(item?.iTipoEstCivId)
        this.formFamiliar.get('iNacionId')?.setValue(item?.iNacionId)
        this.formFamiliar
            .get('cEstPartidaNacimiento')
            ?.setValue(item?.cEstPartidaNacimiento)
        this.formFamiliar.get('iDptoId')?.setValue(item?.iDptoId)
        this.formFamiliar.get('iPrvnId')?.setValue(item?.iPrvnId)
        this.formFamiliar.get('iDsttId')?.setValue(item?.iDsttId)
        this.formFamiliar.get('cEstUbigeo')?.setValue(item?.cEstUbigeo)
        this.formFamiliar.get('cPersDomicilio')?.setValue(item?.cPersDomicilio)
        this.formFamiliar.get('cEstTelefono')?.setValue(item?.cEstTelefono)
        this.formFamiliar.get('cEstCorreo')?.setValue(item?.cEstCorreo)
        this.formFamiliar
            .get('dPersNacimiento')
            ?.setValue(
                item?.dPersNacimiento ? new Date(item.dPersNacimiento) : null
            )
    }

    guardarFamiliar() {
        this.datosFichaBienestarService
            .guardarFamiliar(this.formFamiliar.value)
            .subscribe({
                next: (data: any) => {
                    console.log(data, 'guardado')
                    this.familiar_registrado = true
                },
                error: (error) => {
                    console.error('Error guardando familiar:', error)
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

    actualizarFamiliar() {
        this.datosFichaBienestarService
            .actualizarFamiliar(this.formFamiliar.value)
            .subscribe({
                next: (data: any) => {
                    console.log(data, 'actualizado')
                    this.familiar_registrado = true
                },
                error: (error) => {
                    console.error('Error actualizando familiar:', error)
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
