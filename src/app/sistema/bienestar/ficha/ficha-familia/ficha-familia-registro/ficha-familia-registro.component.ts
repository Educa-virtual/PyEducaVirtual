import { PrimengModule } from '@/app/primeng.module'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import {
    Component,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    OnInit,
    Output,
} from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MessageService } from 'primeng/api'
import { DatosFichaBienestarService } from '../../../services/datos-ficha-bienestar.service'
import { CompartirFichaService } from '../../../services/compartir-ficha.service'
import { FichaFamiliar } from '../../../interfaces/fichaFamiliar'

@Component({
    selector: 'app-ficha-familia-registro',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './ficha-familia-registro.component.html',
    styleUrl: './ficha-familia-registro.component.scss',
})
export class FichaFamiliaRegistroComponent implements OnInit, OnChanges {
    @Output() es_visible = new EventEmitter<any>()
    @Input() iFamiliarId: string | null = null

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
    ocupaciones: Array<object>
    grados_instruccion: Array<object>
    tipos_ies: Array<object>

    longitud_documento: number
    formato_documento: string = '99999999'
    es_peruano: boolean = true
    documento_consultable: boolean = true
    fecha_actual: Date = new Date()

    private _messageService = inject(MessageService) // dialog Mensaje simple
    private _confirmService = inject(ConfirmationModalService) // componente de dialog mensaje

    constructor(
        private fb: FormBuilder,
        private datosFichaBienestarService: DatosFichaBienestarService,
        private compartirFichaService: CompartirFichaService
    ) {}

    ngOnInit(): void {
        this.datosFichaBienestarService
            .getFichaParametros()
            .subscribe((data: any) => {
                this.sexos = this.datosFichaBienestarService.getSexos()
                this.tipos_familiares =
                    this.datosFichaBienestarService.getTiposFamiliares(
                        data?.tipos_familiares
                    )
                this.tipos_documentos =
                    this.datosFichaBienestarService.getTiposDocumentos(
                        data?.tipos_documentos
                    )
                this.estados_civiles =
                    this.datosFichaBienestarService.getEstadosCiviles(
                        data?.estados_civiles
                    )
                this.nacionalidades =
                    this.datosFichaBienestarService.getNacionalidades(
                        data?.nacionalidades
                    )
                this.departamentos =
                    this.datosFichaBienestarService.getDepartamentos(
                        data?.departamentos
                    )
                this.datosFichaBienestarService.getProvincias(data?.provincias)
                this.datosFichaBienestarService.getDistritos(data?.distritos)
                this.tipos_vias = this.datosFichaBienestarService.getTiposVias(
                    data?.tipos_vias
                )
                this.ocupaciones =
                    this.datosFichaBienestarService.getOcupaciones(
                        data?.ocupaciones
                    )
                this.grados_instruccion =
                    this.datosFichaBienestarService.getGradosInstruccion(
                        data?.grados_instruccion
                    )
                this.tipos_ies = this.datosFichaBienestarService.getTiposIes(
                    data?.tipos_ies
                )
            })

        try {
            this.formFamiliar = this.fb.group({
                iSesionId: this.compartirFichaService.perfil?.iCredId,
                iFichaDGId: this.compartirFichaService.getiFichaDGId(), // PK
                iPersId: [null],
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

        this.showFamiliar()

        this.formFamiliar
            .get('iTipoIdentId')
            .valueChanges.subscribe((value) => {
                // Solo permitir validar DNI, CDE y RUC
                this.documento_consultable = [1, 2, 3].includes(value)
                    ? true
                    : false
                const tipo_doc = this.tipos_documentos.find(
                    (item: any) => item.value === value
                )
                if (tipo_doc) {
                    const longitud =
                        this.formFamiliar.get('cPersDocumento')?.value
                    if (longitud && longitud.length > tipo_doc['longitud']) {
                        this.formFamiliar.get('cPersDocumento').setValue(null)
                    }
                    this.longitud_documento = tipo_doc['longitud']
                    this.formato_documento = '9'.repeat(this.longitud_documento)
                }
            })

        this.formFamiliar.get('iNacionId').valueChanges.subscribe((value) => {
            this.es_peruano = value === 193 ? true : false
        })

        this.formFamiliar.get('iDptoId').valueChanges.subscribe((value) => {
            this.formFamiliar.get('iPrvnId').setValue(null)
            this.provincias = null
            this.filterProvincias(value)
        })

        this.formFamiliar.get('iPrvnId').valueChanges.subscribe((value) => {
            this.formFamiliar.get('iDsttId').setValue(null)
            this.distritos = null
            this.filterDistritos(value)
        })
    }

    ngOnChanges() {
        this.showFamiliar()
    }

    filterProvincias(iDptoId: number) {
        if (!iDptoId) return null
        this.provincias =
            this.datosFichaBienestarService.filterProvincias(iDptoId)
    }

    filterDistritos(iPrvnId: number) {
        if (!iPrvnId) return null
        this.distritos =
            this.datosFichaBienestarService.filterDistritos(iPrvnId)
    }

    showFamiliar() {
        this.formFamiliar?.reset()
        this.formFamiliar
            ?.get('iSesionId')
            ?.setValue(this.compartirFichaService.perfil?.iCredId)
        this.formFamiliar
            ?.get('iFichaDGId')
            ?.setValue(this.compartirFichaService.getiFichaDGId())

        if (!this.iFamiliarId) return null

        this.datosFichaBienestarService
            .showFamiliar({
                iFamiliarId: this.iFamiliarId,
            })
            .subscribe((data: any) => {
                console.log(data, 'data familiar')
                this.setFormFamiliar(data.data[0])
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
    setFormFamiliar(item: FichaFamiliar) {
        // Deben ser strings o null
        this.formFamiliar.patchValue(item)
        this.formFamiliar
            .get('iTipoIdentId')
            ?.setValue(!!+item?.bFamiliarVivoConEl)
        this.formFamiliar
            .get('iTipoFamiliarId')
            ?.setValue(item?.iTipoFamiliarId ? +item.iTipoFamiliarId : null)
        this.formFamiliar
            .get('cPersDocumento')
            ?.setValue(item?.cPersDocumento ? +item.cPersDocumento : null)
        this.formFamiliar
            .get('iTipoIdentId')
            ?.setValue(item?.iTipoIdentId ? +item.iTipoIdentId : null)
        this.formFamiliar
            .get('iTipoEstCivId')
            ?.setValue(item?.iTipoEstCivId ? +item.iTipoEstCivId : null)
        this.formFamiliar
            .get('iNacionId')
            ?.setValue(item?.iNacionId ? +item.iNacionId : null)
        this.formFamiliar
            .get('iDptoId')
            ?.setValue(item?.iDptoId ? +item.iDptoId : null)
        this.formFamiliar
            .get('iPrvnId')
            ?.setValue(item?.iPrvnId ? +item.iPrvnId : null)
        this.formFamiliar
            .get('iDsttId')
            ?.setValue(item?.iDsttId ? +item.iDsttId : null)
        this.formFamiliar
            .get('iTipoViaId')
            ?.setValue(item?.iTipoViaId ? +item.iTipoViaId : null)
        this.formFamiliar
            .get('iOcupacionId')
            ?.setValue(item?.iOcupacionId ? +item.iOcupacionId : null)
        this.formFamiliar
            .get('iGradoInstId')
            ?.setValue(item?.iGradoInstId ? +item.iGradoInstId : null)
        this.formFamiliar
            .get('iTipoIeEstId')
            ?.setValue(item?.iTipoIeEstId ? +item.iTipoIeEstId : null)
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
                    // this.datosFichaBienestarService.formFamiliar =
                    //     this.formFamiliar.value
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
                    this.es_visible.emit(false)
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
                    // this.datosFichaBienestarService.formFamiliar =
                    //     this.formFamiliar.value
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
                    this.es_visible.emit(false)
                },
            })
    }

    salirResetearForm() {
        this.es_visible.emit(false)
        this.formFamiliar.reset()
        this.formFamiliar.get('iPersId')?.setValue(null)
        this.formFamiliar.get('iFichaDGId')?.setValue(null)
    }
}
