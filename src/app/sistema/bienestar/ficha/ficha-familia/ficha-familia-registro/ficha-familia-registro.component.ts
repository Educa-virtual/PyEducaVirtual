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
import { ActivatedRoute, Router } from '@angular/router'
import { DropdownInputComponent } from '../../shared/dropdown-input/dropdown-input.component'

@Component({
    selector: 'app-ficha-familia-registro',
    standalone: true,
    imports: [PrimengModule, DropdownInputComponent],
    templateUrl: './ficha-familia-registro.component.html',
    styleUrl: './ficha-familia-registro.component.scss',
})
export class FichaFamiliaRegistroComponent implements OnInit, OnChanges {
    @Output() esVisibleChange = new EventEmitter<any>()
    @Input() iFamiliarId: string | null = null

    formFamiliar: FormGroup
    familiar_registrado: boolean = false
    iFichaDGId: any = null

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
    ver_controles_direccion: boolean = true

    private _messageService = inject(MessageService) // dialog Mensaje simple
    private _confirmService = inject(ConfirmationModalService) // componente de dialog mensaje

    constructor(
        private fb: FormBuilder,
        private datosFichaBienestar: DatosFichaBienestarService,
        private compartirFichaService: CompartirFichaService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.route.parent?.paramMap.subscribe((params) => {
            this.iFichaDGId = params.get('id')
        })
        if (!this.iFichaDGId) {
            this.router.navigate(['/'])
        }
    }

    ngOnInit(): void {
        this.datosFichaBienestar.getFichaParametros().subscribe((data: any) => {
            this.sexos = this.datosFichaBienestar.getSexos()
            this.tipos_familiares = this.datosFichaBienestar.getTiposFamiliares(
                data?.tipos_familiares
            )
            this.tipos_documentos = this.datosFichaBienestar.getTiposDocumentos(
                data?.tipos_documentos
            )
            this.estados_civiles = this.datosFichaBienestar.getEstadosCiviles(
                data?.estados_civiles
            )
            this.nacionalidades = this.datosFichaBienestar.getNacionalidades(
                data?.nacionalidades
            )
            this.departamentos = this.datosFichaBienestar.getDepartamentos(
                data?.departamentos
            )
            this.datosFichaBienestar.getProvincias(data?.provincias)
            this.datosFichaBienestar.getDistritos(data?.distritos)
            this.tipos_vias = this.datosFichaBienestar.getTiposVias(
                data?.tipos_vias
            )
            this.ocupaciones = this.datosFichaBienestar.getOcupaciones(
                data?.ocupaciones
            )
            this.grados_instruccion =
                this.datosFichaBienestar.getGradosInstruccion(
                    data?.grados_instruccion
                )
            this.tipos_ies = this.datosFichaBienestar.getTiposIes(
                data?.tipos_ies
            )
        })

        try {
            this.formFamiliar = this.fb.group({
                iSesionId: this.compartirFichaService.perfil?.iCredId,
                iFichaDGId: this.iFichaDGId, // PK
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
                cTipoViaOtro: ['', Validators.maxLength(100)],
                cFamiliarDireccionNombreVia: ['', Validators.maxLength(150)],
                cFamiliarDireccionNroPuerta: ['', Validators.maxLength(10)],
                cFamiliarDireccionBlock: ['', Validators.maxLength(3)],
                cFamiliarDireccionInterior: ['', Validators.maxLength(3)],
                iFamiliarDireccionPiso: [null],
                cFamiliarDireccionManzana: ['', Validators.maxLength(10)],
                cFamiliarDireccionLote: ['', Validators.maxLength(3)],
                cFamiliarDireccionKm: ['', Validators.maxLength(10)],
                cFamiliarDireccionReferencia: [''],
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

        this.formFamiliar
            .get('bFamiliarVivoConEl')
            .valueChanges.subscribe((value) => {
                if (value === true) {
                    this.ver_controles_direccion = false
                } else {
                    this.ver_controles_direccion = true
                    this.formFamiliar.get('iTipoViaId')?.setValue(null)
                    this.formFamiliar
                        .get('cFamiliarDireccionNombreVia')
                        ?.setValue(null)
                    this.formFamiliar
                        .get('cFamiliarDireccionNroPuerta')
                        ?.setValue(null)
                    this.formFamiliar
                        .get('cFamiliarDireccionBlock')
                        ?.setValue(null)
                    this.formFamiliar
                        .get('cFamiliarDireccionInterior')
                        ?.setValue(null)
                    this.formFamiliar
                        .get('iFamiliarDireccionPiso')
                        ?.setValue(null)
                    this.formFamiliar
                        .get('cFamiliarDireccionManzana')
                        ?.setValue(null)
                    this.formFamiliar
                        .get('cFamiliarDireccionLote')
                        ?.setValue(null)
                    this.formFamiliar
                        .get('cFamiliarDireccionKm')
                        ?.setValue(null)
                    this.formFamiliar
                        .get('cFamiliarDireccionReferencia')
                        ?.setValue(null)
                }
            })
    }

    ngOnChanges() {
        this.showFamiliar()
    }

    filterProvincias(iDptoId: number) {
        if (!iDptoId) return null
        this.provincias = this.datosFichaBienestar.filterProvincias(iDptoId)
    }

    filterDistritos(iPrvnId: number) {
        if (!iPrvnId) return null
        this.distritos = this.datosFichaBienestar.filterDistritos(iPrvnId)
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

        this.datosFichaBienestar
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
        if (
            !this.formFamiliar.get('iTipoIdentId')?.value ||
            !this.formFamiliar.get('cPersDocumento')?.value
        ) {
            this._messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe especificar un tipo y número de documento',
            })
            return
        }
        this.datosFichaBienestar
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
                        detail:
                            error.error.message || 'Error al validar persona',
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
        this.datosFichaBienestar.formatearFormControl(
            this.formFamiliar,
            'iTipoIdentId',
            item.iTipoIdentId,
            'number'
        )
        this.datosFichaBienestar.formatearFormControl(
            this.formFamiliar,
            'iTipoFamiliarId',
            item.iTipoFamiliarId,
            'number'
        )
        this.datosFichaBienestar.formatearFormControl(
            this.formFamiliar,
            'iTipoEstCivId',
            item.iTipoEstCivId,
            'number'
        )
        this.datosFichaBienestar.formatearFormControl(
            this.formFamiliar,
            'iNacionId',
            item.iNacionId,
            'number'
        )
        this.datosFichaBienestar.formatearFormControl(
            this.formFamiliar,
            'iDptoId',
            item.iDptoId,
            'number'
        )
        this.datosFichaBienestar.formatearFormControl(
            this.formFamiliar,
            'iPrvnId',
            item.iPrvnId,
            'number'
        )
        this.datosFichaBienestar.formatearFormControl(
            this.formFamiliar,
            'iDsttId',
            item.iDsttId,
            'number'
        )
        this.datosFichaBienestar.formatearFormControl(
            this.formFamiliar,
            'iTipoViaId',
            item.iTipoViaId,
            'number'
        )
        this.datosFichaBienestar.formatearFormControl(
            this.formFamiliar,
            'iOcupacionId',
            item.iOcupacionId,
            'number'
        )
        this.datosFichaBienestar.formatearFormControl(
            this.formFamiliar,
            'iGradoInstId',
            item.iGradoInstId,
            'number'
        )
        this.datosFichaBienestar.formatearFormControl(
            this.formFamiliar,
            'iTipoIeEstId',
            item.iTipoIeEstId,
            'number'
        )
        this.datosFichaBienestar.formatearFormControl(
            this.formFamiliar,
            'dPersNacimiento',
            item.dPersNacimiento,
            'date'
        )
    }

    guardarFamiliar() {
        this.datosFichaBienestar
            .guardarFamiliar(this.formFamiliar.value)
            .subscribe({
                next: (data: any) => {
                    console.log(data, 'guardado')
                    this.familiar_registrado = true
                    // this.datosFichaBienestar.formFamiliar =
                    //     this.formFamiliar.value
                },
                error: (error) => {
                    console.error('Error guardando familiar:', error)
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error.message || 'Error al guardar datos',
                    })
                },
                complete: () => {
                    console.log('Request completed')
                    this.esVisibleChange.emit(false)
                },
            })
    }

    actualizarFamiliar() {
        this.datosFichaBienestar
            .actualizarFamiliar(this.formFamiliar.value)
            .subscribe({
                next: (data: any) => {
                    console.log(data, 'actualizado')
                    this.familiar_registrado = true
                    // this.datosFichaBienestar.formFamiliar =
                    //     this.formFamiliar.value
                },
                error: (error) => {
                    console.error('Error actualizando familiar:', error)
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail:
                            error.error.message || 'Error al actualizar datos',
                    })
                },
                complete: () => {
                    console.log('Request completed')
                    this.esVisibleChange.emit(false)
                },
            })
    }

    salirResetearForm() {
        this.esVisibleChange.emit(false)
        this.formFamiliar.reset()
        this.formFamiliar.get('iPersId')?.setValue(null)
        this.formFamiliar.get('iFichaDGId')?.setValue(null)
    }
}
