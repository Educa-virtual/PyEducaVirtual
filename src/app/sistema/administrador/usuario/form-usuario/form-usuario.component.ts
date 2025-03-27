import { Component, Input, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { GeneralService } from '@/app/servicios/general.service'
import { DatosEstudianteService } from '@/app/sistema/gestion-institucional/services/datos-estudiante-service'

import { LocalStoreService } from '@/app/servicios/local-store.service'

@Component({
    selector: 'app-form-usuario',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './form-usuario.component.html',
    styleUrl: './form-usuario.component.scss',
})
export class FormUsuarioComponent implements OnInit {
    @Input() data //listao de usuarios

    form_user: FormGroup
    registro: any
    perfil: any

    /* Formulario estudiante */
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

    constructor(
        private fb: FormBuilder,
        private query: GeneralService,
        private datosEstudianteService: DatosEstudianteService,

        private store: LocalStoreService
    ) {
        this.perfil = this.store.getItem('dremoPerfil')
    }

    ngOnInit() {
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
            this.form_user = this.fb.group({
                iPersId: [''],
                iTipoIdentId: ['1', [Validators.required]], //
                iTipoEstCivId: [''],
                cPersDocumento: [
                    '',
                    [
                        Validators.required,
                        Validators.minLength(8),
                        Validators.maxLength(12),
                    ],
                ],
                cPersNombre: [
                    '',
                    [Validators.required, Validators.minLength(3)],
                ],
                cPersMaterno: [''],
                cPersPaterno: [''],
                cNacionNombre: [''],
                cPersConCorreoElectronico: [
                    '',
                    [Validators.required, Validators.email],
                ],
                cPersDomicilio: [
                    '',
                    [Validators.required, Validators.minLength(5)],
                ],
                cPersSexo: ['', [Validators.required]],
                iCredId: this.perfil.iCredId,
                dPersNacimiento: [''],

                iPaisId: [''],
                iNacionId: [''],
                iDptoId: [''],
                iPrvnId: [''],
                iDsttId: [''],
                cEstUbigeo: [''],
            })
        } catch (error) {
            console.log(error, 'error de variables')
        }

        this.form_user.get('iNacionId').valueChanges.subscribe((value) => {
            this.es_peruano = value === 193 ? true : false
        })

        this.form_user.get('iDptoId').valueChanges.subscribe((value) => {
            this.form_user.get('iPrvnId').setValue(null)
            this.provincias = null
            this.getProvincias(value)
        })

        this.form_user.get('iPrvnId').valueChanges.subscribe((value) => {
            this.form_user.get('iDsttId').setValue(null)
            this.distritos = null
            this.getDistritos(value)
        })

        this.form_user.get('iDsttId').valueChanges.subscribe((value) => {
            this.form_user.get('cEstUbigeo').setValue(null)
            if (!value) return null
            if (!this.distritos) return null
            const item = this.distritos.find((item: any) => item.id === value)
            if (item) {
                this.form_user.get('cEstUbigeo').setValue(item['ubigeo_inei'])
            } else {
                this.form_user.get('cEstUbigeo').setValue('')
            }
        })
    }

    accionBtn(action: string) {
        if (action === 'validar') {
            this.validarDocumento()
        }
    }

    validarDocumento() {
        // solo para DNI
        this.query
            .validarPersona({
                iTipoIdentId: this.form_user.get('iTipoIdentId')?.value,
                cPersDocumento: this.form_user.get('cPersDocumento')?.value,
            })
            .subscribe({
                next: (data: any) => {
                    console.log(data, 'validar persona')
                    this.setFormUsuario(data.data)
                    this.registro = data.data
                },
                error: (error) => {
                    console.error('Error validando persona:', error)
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }
    setFormUsuario(item: any) {
        this.form_user.get('iPersId')?.setValue(item?.iPersId)
        this.form_user.get('cEstCodigo')?.setValue(item?.cEstCodigo)
        this.form_user.get('iTipoIdentId')?.setValue(item?.iTipoIdentId)
        this.form_user.get('cPersDocumento')?.setValue(item?.cPersDocumento)
        this.form_user.get('cPersNombre')?.setValue(item?.cPersNombre)
        this.form_user.get('cPersPaterno')?.setValue(item?.cPersPaterno)
        this.form_user.get('cPersMaterno')?.setValue(item?.cPersMaterno)
        this.form_user.get('cPersSexo')?.setValue(item?.cPersSexo)
        this.form_user.get('iTipoEstCivId')?.setValue(item?.iTipoEstCivId)
        this.form_user.get('iNacionId')?.setValue(item?.iNacionId)
        this.form_user
            .get('cEstPartidaNacimiento')
            ?.setValue(item?.cEstPartidaNacimiento)
        this.form_user.get('iDptoId')?.setValue(item?.iDptoId)
        this.form_user.get('iPrvnId')?.setValue(item?.iPrvnId)
        this.form_user.get('iDsttId')?.setValue(item?.iDsttId)
        this.form_user.get('cEstUbigeo')?.setValue(item?.cEstUbigeo)
        this.form_user.get('cPersDomicilio')?.setValue(item?.cPersDomicilio)
        this.form_user.get('cEstTelefono')?.setValue(item?.cEstTelefono)
        this.form_user.get('cEstCorreo')?.setValue(item?.cEstCorreo)
        this.form_user
            .get('dPersNacimiento')
            ?.setValue(
                item?.dPersNacimiento ? new Date(item.dPersNacimiento) : null
            )
    }

    //procesos para distritos
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
}
