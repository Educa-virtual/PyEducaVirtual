import { PrimengModule } from '@/app/primeng.module'
import {
    Component,
    EventEmitter,
    inject,
    Input,
    OnInit,
    Output,
} from '@angular/core'
import { ImageUploadPrimengComponent } from '../../../shared/image-upload-primeng/image-upload-primeng.component'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { GeneralService } from '@/app/servicios/general.service'
import { FormBuilder, Validators } from '@angular/forms'
import { FormVerificarCorreoComponent } from './components/form-verificar-correo/form-verificar-correo.component'
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component'
import { MessageService } from 'primeng/api'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { NgIf } from '@angular/common'

@Component({
    selector: 'app-perfil',
    standalone: true,
    imports: [
        PrimengModule,
        ImageUploadPrimengComponent,
        FormVerificarCorreoComponent,
        ModalPrimengComponent,
        NgIf,
    ],
    templateUrl: './perfil.component.html',
    styleUrl: './perfil.component.scss',
})
export class PerfilComponent implements OnInit {
    @Output() accionCloseItem = new EventEmitter()
    @Input() showModal: boolean = false

    private _ConstantesService = inject(ConstantesService)
    private _GeneralService = inject(GeneralService)
    private fb = inject(FormBuilder)
    private _MessageService = inject(MessageService)
    private _LocalStoreService = inject(LocalStoreService)

    formPersonas = this.fb.group({
        iPersId: [this._ConstantesService.iPersId, Validators.required],

        cPersNombre: [''],
        cPersPaterno: [''],
        cPersMaterno: [''],
        cPersFotografia: [''],
        cPersDomicilio: [''],
        cPersCorreo: ['', [Validators.required, Validators.email]],
        cPersCorreoValidado: [],
        cPersCelular: [''],
        cPersCelularValidado: [],

        cPersPassword: [],
    })
    iPersConId
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
                this.accionCloseItem.emit()
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
        }

        this._GeneralService.getGralPrefix(params).subscribe({
            next: (response) => {
                if (response.validated) {
                    this.formPersonas.patchValue(
                        response.data.length ? response.data[0] : null
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
        if (!this.formPersonas.valid) return
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
                    this._MessageService.add({
                        severity: 'success',
                        summary: 'Exitoso!',
                        detail: 'Se ha guardado exitosamente su información',
                    })
                    const user = this._LocalStoreService.getItem('dremoUser')
                    user.cPersFotografia =
                        this.formPersonas.value.cPersFotografia
                    this._LocalStoreService.setItem('dremoUser', user)
                    this.accionCloseItem.emit()
                    setTimeout(() => {
                        window.location.reload()
                    }, 1000)
                }
            },
            complete: () => {},
            error: (error) => {
                console.log('Error completo:', error)

                // Acceder a errores del backend
                const errores = error?.error?.errors

                if (error.status === 422 && errores) {
                    // Recorre y muestra cada mensaje de error
                    Object.keys(errores).forEach((campo) => {
                        errores[campo].forEach((mensaje: string) => {
                            this._MessageService.add({
                                severity: 'error',
                                summary: 'Error de validación',
                                detail: mensaje,
                            })
                        })
                    })
                } else {
                    // Error genérico si no hay errores específicos
                    this._MessageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail:
                            error?.error?.message ||
                            'Ocurrió un error inesperado',
                    })
                }
            },
        })
    }

    enviarCodVerificarCorreo() {
        const params = {
            petition: 'post',
            group: 'grl',
            prefix: 'personas-contactos',
            ruta: 'enviarCodVerificarCorreo',
            data: {
                iPersId: this._ConstantesService.iPersId,
                cPersCorreo: this.formPersonas.value.cPersCorreo,
                iTipoConId: 1,
                iPersConId: null,
                cPersConCodigoValidacion: null,
            },
        }

        this._GeneralService.getGralPrefix(params).subscribe({
            next: (response) => {
                if (response.validated) {
                    this.iPersConId = response.data
                    this.showModalVerificarCorreo = true
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
