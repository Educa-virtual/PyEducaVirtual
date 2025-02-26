import { PrimengModule } from '@/app/primeng.module'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { CompartirEstudianteService } from '@/app/sistema/gestion-institucional/services/compartir-estudiante.service'
import { CompartirMatriculaService } from '@/app/sistema/gestion-institucional/services/compartir-matricula.service'
import { DatosEstudianteService } from '@/app/sistema/gestion-institucional/services/datos-estudiante-service'
import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { MessageService } from 'primeng/api'

@Component({
    selector: 'app-representante',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './representante.component.html',
    styleUrl: './representante.component.scss',
})
export class RepresentanteComponent implements OnInit {
    form: FormGroup

    tipos_familiares: Array<object>
    tipos_documentos: Array<object>
    estados_civiles: Array<object>
    sexos: Array<object>
    nacionalidades: Array<object>
    departamentos: Array<object>
    provincias: Array<object>
    distritos: Array<object>
    lenguas: Array<object>
    tipos_contacto: Array<object>
    apoderado_registrado: boolean = false
    longitud_documento: number
    formato_documento: string = '99999999'
    es_peruano: boolean = true
    documento_consultable: boolean = true

    private _MessageService = inject(MessageService) // dialog Mensaje simple
    private _confirmService = inject(ConfirmationModalService) // componente de dialog mensaje

    constructor(
        private datosEstudianteService: DatosEstudianteService,
        private compartirEstudianteService: CompartirEstudianteService,
        private compartirMatriculaService: CompartirMatriculaService,
        private constantesService: ConstantesService,
        private fb: FormBuilder,
        private router: Router
    ) {}

    ngOnInit(): void {
        if (this.compartirEstudianteService.getiEstudianteId() === null) {
            this.router.navigate([
                '/gestion-institucional/estudiante/registro/datos',
            ])
        }

        this.datosEstudianteService.getTiposDocumentos().subscribe((data) => {
            this.tipos_documentos = data
        })
        this.datosEstudianteService.getEstadosCiviles().subscribe((data) => {
            this.estados_civiles = data
        })
        this.datosEstudianteService.getNacionalidades().subscribe((data) => {
            this.nacionalidades = data
        })
        this.datosEstudianteService.getDepartamentos().subscribe((data) => {
            this.departamentos = data
        })

        this.sexos = this.datosEstudianteService.getSexos()
        this.lenguas = this.datosEstudianteService.getLenguas()

        try {
            this.form = this.fb.group({
                iEstudianteId: [
                    this.compartirEstudianteService.getiEstudianteId(),
                    Validators.required,
                ], // PK
                iPersApoderadoId: [null],
                iTipoFamiliarId: [null, Validators.required],
                iTipoIdentId: [null, Validators.required],
                cPersDocumento: [null, Validators.required],
                cPersPaterno: ['', Validators.required],
                cPersMaterno: [''],
                cPersNombre: ['', Validators.required],
                iTipoEstCivId: [null],
                cPersSexo: [null, Validators.required],
                iNacionId: [null],
                dPersNacimiento: ['', Validators.required],
                cPersDomicilio: [''],
                iPaisId: [null],
                iDptoId: [null],
                iPrvnId: [null],
                iDsttId: [null],
                iOcupacionId: [null],
                bFamiliarVivoConEl: [false],
                iGradoInstId: [null],
                iCredId: this.constantesService.iCredId,
                cEstCodigo: [{ value: '', disabled: true }],
                cEstApenom: [{ value: '', disabled: true }],
            })
        } catch (error) {
            console.log(error, 'error de variables')
        }

        this.form
            .get('cEstCodigo')
            .setValue(this.compartirEstudianteService.getcEstCodigo())
        this.form
            .get('cEstApenom')
            .setValue(this.compartirEstudianteService.getcEstApenom())

        this.form.get('iTipoIdentId').valueChanges.subscribe((value) => {
            this.form.get('cPersDocumento').setValue(null)
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

        this.form.get('iNacionId').valueChanges.subscribe((value) => {
            this.es_peruano = value === 193 ? true : false
        })

        this.form.get('iDptoId').valueChanges.subscribe((value) => {
            this.form.get('iPrvnId').setValue(null)
            this.provincias = null
            this.getProvincias(value)
        })

        this.form.get('iPrvnId').valueChanges.subscribe((value) => {
            this.form.get('iDsttId').setValue(null)
            this.distritos = null
            this.getDistritos(value)
        })

        if (this.compartirEstudianteService.getiPersId()) {
            this.form
                .get('iPersId')
                ?.setValue(this.compartirEstudianteService.getiPersId())
        }

        this.buscarApoderado()
    }

    buscarApoderado() {
        if (this.compartirEstudianteService.getiPersApoderadoId() == null) {
            return null
        }
        this.apoderado_registrado = true
        this.datosEstudianteService
            .searchApoderado({
                iEstudianteId:
                    this.compartirEstudianteService.getiEstudianteId(),
            })
            .subscribe({
                next: (data: any) => {
                    const item = data.data[0]
                    this.setFormApoderado(item)
                },
                error: (error) => {
                    console.error('Error obteniendo apoderado:', error)
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

    /**
     * Setea los datos de un estudiante seleccionado
     * @param item datos del estudiante seleccionado
     */
    setFormApoderado(item) {
        this.form.get('iPersApoderadoId')?.setValue(item.iPersId)
        this.form.get('iTipoFamiliarId')?.setValue(item.iTipoFamiliarId)
        this.form.get('iTipoIdentId')?.setValue(item.iTipoIdentId)
        this.form.get('cPersDocumento')?.setValue(item.cPersDocumento)
        this.form.get('cPersNombre')?.setValue(item.cPersNombre)
        this.form.get('cPersPaterno')?.setValue(item.cPersPaterno)
        this.form.get('cPersMaterno')?.setValue(item.cPersMaterno)
        this.form.get('cPersSexo')?.setValue(item.cPersSexo)
        this.form.get('iTipoEstCivId')?.setValue(item.iTipoEstCivId)
        this.form.get('iNacionId')?.setValue(item.iNacionId)
        this.form.get('cPersDomicilio')?.setValue(item.cPersDomicilio)
        this.form.get('iPaisId')?.setValue(item.iPaisId)
        this.form.get('iDptoId')?.setValue(item.iDptoId)
        this.form.get('iPrvnId')?.setValue(item.iPrvnId)
        this.form.get('iDsttId')?.setValue(item.iDsttId)
        this.form
            .get('dPersNacimiento')
            ?.setValue(
                item.dPersNacimiento ? new Date(item.dPersNacimiento) : null
            )
    }

    /**
     * Buscar datos de persona segun documento en formulario
     */
    validarPersona() {
        this.datosEstudianteService
            .validarPersona({
                iTipoIdentId: this.form.get('iTipoIdentId')?.value,
                cPersDocumento: this.form.get('cPersDocumento')?.value,
            })
            .subscribe({
                next: (data: any) => {
                    console.log(data, 'validar persona')
                    this.setFormApoderado(data.data)
                    this._MessageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: data.message,
                    })
                },
                error: (error) => {
                    console.error('Error validando persona:', error)
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

    getProvincias(iDptoId: number) {
        this.datosEstudianteService.getProvincias(iDptoId).subscribe({
            next: (data) => {
                this.provincias = data
            },
        })
    }

    getDistritos(iPrvnId: number) {
        this.datosEstudianteService.getDistritos(iPrvnId).subscribe({
            next: (data) => {
                this.distritos = data
            },
        })
    }

    guardarApoderado() {
        this.datosEstudianteService
            .guardarApoderado(this.form.value)
            .subscribe({
                next: (data: any) => {
                    this.apoderado_registrado = true
                    console.log(data, 'agregar apoderado')
                    this._MessageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Apoderado registrado',
                    })
                    this.compartirMatriculaService.setiEstudianteId(
                        this.form.get('iEstudianteId')?.value
                    )
                    this.router.navigate([
                        '/gestion-institucional/matricula-individual',
                    ])
                },
                error: (error) => {
                    console.error('Error guardando apoderado:', error)
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

    actualizarApoderado() {
        this.datosEstudianteService
            .actualizarApoderado(this.form.value)
            .subscribe({
                next: (data: any) => {
                    console.log(data, 'actualizar apoderado')
                    this._MessageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Apoderado actualizado',
                    })
                },
                error: (error) => {
                    console.error('Error actualizando apoderado:', error)
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
