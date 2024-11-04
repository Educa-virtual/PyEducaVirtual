import { PrimengModule } from '@/app/primeng.module'
import { Component, inject, OnInit } from '@angular/core'
import { Message } from 'primeng/api'
import { ImageUploadPrimengComponent } from '../../../shared/image-upload-primeng/image-upload-primeng.component'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { GeneralService } from '@/app/servicios/general.service'
import { FormBuilder, Validators } from '@angular/forms'
import { DatePipe } from '@angular/common'
import { FormVerificarCorreoComponent } from './components/form-verificar-correo/form-verificar-correo.component'

@Component({
    selector: 'app-perfil',
    standalone: true,
    imports: [
        PrimengModule,
        ImageUploadPrimengComponent,
        FormVerificarCorreoComponent,
    ],
    templateUrl: './perfil.component.html',
    styleUrl: './perfil.component.scss',
})
export class PerfilComponent implements OnInit {
    private _ConstantesService = inject(ConstantesService)
    private _GeneralService = inject(GeneralService)
    private fb = inject(FormBuilder)
    mensaje: Message[] = [
        {
            severity: 'info',
            detail: 'En esta sección podrá actualizar su información básica',
        },
    ]
    pipe = new DatePipe('es-ES')
    date = new Date()
    formPersonas = this.fb.group({
        iPersId: [this._ConstantesService.iPersId, Validators.required],

        cPersNombre: [''],
        cPersPaterno: [''],
        cPersMaterno: [''],
        dPersNacimiento: [],
        cPersFotografia: [''],
        cPersDomicilio: [''],
        cPersCorreo: [''],
        cPersCorreoValidado: [],
        cPersCelular: [''],
        cPersCelularValidado: [],

        cPersPassword: [],
    })

    ngOnInit() {
        this.getPersonasxiPersId()
    }
    accionBtnItem(elemento): void {
        const { accion } = elemento
        const { item } = elemento
        switch (accion) {
            case 'subir-archivo-users':
                this.formPersonas.controls.cPersFotografia.setValue(
                    item.imagen.data
                )
                break
            case 'close-modal':
                this.showModalVerificarCorreo = false
                break
        }
    }
    getPersonasxiPersId() {
        const params = {
            petition: 'post',
            group: 'grl',
            prefix: 'personas',
            ruta: 'obtenerPersonasxiPersId',
            seleccion: 1,
            data: {
                opcion: 'CONSULTARxiPersId',
                iPersId: this._ConstantesService.iPersId,
            },
            params: { skipSuccessMessage: true },
        }

        this._GeneralService.getGralPrefix(params).subscribe({
            next: (response) => {
                if (response.validated) {
                    this.formPersonas.patchValue(
                        response.data.length ? response.data[0] : null
                    )
                    const date = new DatePipe('es-PE').transform(
                        this.formPersonas.value.dPersNacimiento,
                        'yyyy/MM/dd'
                    )
                    this.formPersonas.controls.dPersNacimiento.setValue(
                        new Date(date)
                    )
                }
            },
            complete: () => {},
            error: (error) => {
                console.log(error)
            },
        })
    }
    showModalVerificarCorreo: boolean = false

    guardarPersonasxDatosPersonales() {
        if (this.formPersonas.value.cPersCorreoValidado) {
            let fechaNacimiento =
                this.formPersonas.value.dPersNacimiento.toLocaleString(
                    'en-GB',
                    { timeZone: 'America/Lima' }
                )
            fechaNacimiento = fechaNacimiento.replace(',', '')
            this.formPersonas.controls.dPersNacimiento.setValue(fechaNacimiento)
            const params = {
                petition: 'post',
                group: 'grl',
                prefix: 'personas',
                ruta: 'guardarPersonasxDatosPersonales',
                data: this.formPersonas.value,
            }

            this._GeneralService.getGralPrefix(params).subscribe({
                next: (response) => {
                    if (response.validated) {
                        this.getPersonasxiPersId()
                    }
                },
                complete: () => {},
                error: (error) => {
                    console.log(error)
                },
            })
        } else {
            this.showModalVerificarCorreo = true
            this.enviarCodVerificarCorreo()
        }
    }

    enviarCodVerificarCorreo() {
        const params = {
            petition: 'post',
            group: 'grl',
            prefix: 'personas',
            ruta: 'enviarCodVerificarCorreo',
            data: {
                iPersId: this._ConstantesService.iPersId,
                cPersCorreo: this.formPersonas.value.cPersCorreo,
            },
        }

        this._GeneralService.getGralPrefix(params).subscribe({
            next: (response) => {
                if (response.validated) {
                    this.getPersonasxiPersId()
                }
            },
            complete: () => {},
            error: (error) => {
                console.log(error)
            },
        })
    }
    verificarCorreo() {
        this.showModalVerificarCorreo = true
    }
}
