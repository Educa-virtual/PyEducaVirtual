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
    selector: 'app-datos',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './datos.component.html',
    styleUrl: './datos.component.scss',
})
export class DatosComponent implements OnInit {
    form: FormGroup

    tipos_documentos: Array<object>
    sexos: Array<object>
    nacionalidades: Array<object>
    departamentos: Array<object>
    provincias: Array<object>
    distritos: Array<object>
    religiones: Array<object>
    tipos_contacto: Array<object>
    ubigeo: Array<object>
    estudiante_registrado: boolean = false
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
        this.datosEstudianteService.getTiposDocumentos().subscribe((data) => {
            this.tipos_documentos = data
        })
        this.datosEstudianteService.getNacionalidades().subscribe((data) => {
            this.nacionalidades = data
        })
        this.datosEstudianteService.getDepartamentos().subscribe((data) => {
            this.departamentos = data
        })
        this.datosEstudianteService.getTiposContacto().subscribe((data) => {
            this.tipos_contacto = data
        })
        this.datosEstudianteService.getReligiones().subscribe((data) => {
            this.religiones = data
        })

        this.sexos = this.datosEstudianteService.getSexos()

        try {
            this.form = this.fb.group({
                iEstudianteId: [null], // PK
                iPersId: [null], // FK tabla grl.personas
                cEstCodigo: [null],
                iTipoIdentId: [null, Validators.required],
                cPersDocumento: [null, Validators.required],
                cPersPaterno: ['', Validators.required],
                cPersMaterno: [''],
                cPersNombre: ['', Validators.required],
                cPersSexo: [null, Validators.required],
                iNacionId: [null],
                cEstPartidaNacimiento: [''],
                dPersNacimiento: ['', Validators.required],
                cPersDomicilio: [''],
                iPaisId: [null],
                iDptoId: [null],
                iPrvnId: [null],
                iDsttId: [null],
                iCredId: this.constantesService.iCredId,
                cEstUbigeo: [''],
                cEstTelefono: [''],
                cEstCorreo: [''],
            })
        } catch (error) {
            console.log(error, 'error de variables')
        }

        this.form
            .get('iEstudianteId')
            .setValue(this.compartirEstudianteService.getiEstudianteId())
        this.form
            .get('iPersId')
            .setValue(this.compartirEstudianteService.getiPersId())

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

        this.form.get('iDsttId').valueChanges.subscribe((value) => {
            this.form.get('cEstUbigeo').setValue(null)
            if (!value) return null
            if (!this.distritos) return null
            const item = this.distritos.find((item: any) => item.id === value)
            if (item) {
                this.form.get('cEstUbigeo').setValue(item['ubigeo_inei'])
            } else {
                this.form.get('cEstUbigeo').setValue('')
            }
        })

        this.buscarEstudiante()
    }

    getProvincias(iDptoId: number) {
        if (!iDptoId) return null
        this.datosEstudianteService.getProvincias(iDptoId).subscribe({
            next: (data) => {
                this.provincias = data
            },
        })
    }

    getDistritos(iPrvnId: number) {
        if (!iPrvnId) return null
        this.datosEstudianteService.getDistritos(iPrvnId).subscribe({
            next: (data) => {
                this.distritos = data
            },
        })
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
                    this.setFormEstudiante(data.data)
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

    /**
     * Buscar datos de estudiante segun id compartido
     */
    buscarEstudiante() {
        if (this.compartirEstudianteService.getiEstudianteId() == null) {
            return null
        }
        this.estudiante_registrado = true
        this.datosEstudianteService
            .searchEstudiante({
                iEstudianteId:
                    this.compartirEstudianteService.getiEstudianteId(),
            })
            .subscribe({
                next: (data: any) => {
                    const item = data.data[0]

                    this.compartirEstudianteService.setiPersId(item.iPersId)
                    this.compartirEstudianteService.setiPersApoderadoId(
                        item.iPersApoderadoId
                    )
                    this.compartirEstudianteService.setcEstCodigo(
                        item.cEstCodigo
                    )
                    this.compartirEstudianteService.setcEstApenom(
                        item._cEstApenom
                    )
                    this.setFormEstudiante(item)
                },
                error: (error) => {
                    console.error('Error obteniendo estudiante:', error)
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
    setFormEstudiante(item: any) {
        // Deben ser strings o null
        this.form.get('iEstudianteId')?.setValue(item?.iEstudianteId)
        this.form.get('iPersId')?.setValue(item?.iPersId)
        this.form.get('cEstCodigo')?.setValue(item?.cEstCodigo)
        this.form.get('iTipoIdentId')?.setValue(item?.iTipoIdentId)
        this.form.get('cPersDocumento')?.setValue(item?.cPersDocumento)
        this.form.get('cPersNombre')?.setValue(item?.cPersNombre)
        this.form.get('cPersPaterno')?.setValue(item?.cPersPaterno)
        this.form.get('cPersMaterno')?.setValue(item?.cPersMaterno)
        this.form.get('cPersSexo')?.setValue(item?.cPersSexo)
        this.form.get('iTipoEstCivId')?.setValue(item?.iTipoEstCivId)
        this.form.get('iNacionId')?.setValue(item?.iNacionId)
        this.form
            .get('cEstPartidaNacimiento')
            ?.setValue(item?.cEstPartidaNacimiento)
        this.form.get('iDptoId')?.setValue(item?.iDptoId)
        this.form.get('iPrvnId')?.setValue(item?.iPrvnId)
        this.form.get('iDsttId')?.setValue(item?.iDsttId)
        this.form.get('cEstUbigeo')?.setValue(item?.cEstUbigeo)
        this.form.get('cPersDomicilio')?.setValue(item?.cPersDomicilio)
        this.form.get('cEstTelefono')?.setValue(item?.cEstTelefono)
        this.form.get('cEstCorreo')?.setValue(item?.cEstCorreo)
        this.form
            .get('dPersNacimiento')
            ?.setValue(
                item?.dPersNacimiento ? new Date(item.dPersNacimiento) : null
            )
    }

    guardarEstudiante() {
        this.datosEstudianteService
            .guardarEstudiante(this.form.value)
            .subscribe({
                next: (data: any) => {
                    this.estudiante_registrado = true
                    console.log(data, 'agregar estudiante')
                    this.compartirEstudianteService.setiEstudianteId(
                        data.data[0].iEstudianteId
                    )
                    this.compartirEstudianteService.setiPersId(
                        data.data[0].iPersId
                    )
                    this.compartirEstudianteService.setcEstCodigo(
                        data.data[0].cEstCodigo
                    )
                    this.compartirEstudianteService.setcEstApenom(
                        data.data[0]._cEstApenom
                    )
                    this.compartirMatriculaService.setiEstudianteId(
                        data.data[0].iEstudianteId
                    )
                    this.router.navigate([
                        '/gestion-institucional/estudiante/registro/representante',
                    ])
                    this._MessageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Estudiante registrado',
                    })
                },
                error: (error) => {
                    console.error('Error guardando estudiante:', error)
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

    actualizarEstudiante() {
        this.datosEstudianteService
            .actualizarEstudiante(this.form.value)
            .subscribe({
                next: (data: any) => {
                    console.log(data, 'actualizar estudiante')
                    this._MessageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Estudiante actualizado',
                    })
                    this.compartirEstudianteService.setiEstudianteId(
                        data.data[0].iEstudianteId
                    )
                    this.compartirEstudianteService.setiPersId(
                        data.data[0].iPersId
                    )
                    this.compartirEstudianteService.setcEstCodigo(
                        data.data[0].cEstCodigo
                    )
                    this.compartirEstudianteService.setcEstApenom(
                        data.data[0]._cPersApenom
                    )
                    setTimeout(() => {
                        this.router.navigate([
                            '/gestion-institucional/estudiante/registro/representante',
                        ])
                    }, 1000)
                },
                error: (error) => {
                    console.error('Error actualizando estudiante:', error)
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
