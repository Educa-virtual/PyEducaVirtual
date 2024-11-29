import { PrimengModule } from '@/app/primeng.module'
import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnChanges,
    OnInit,
    inject,
} from '@angular/core'
import { ModalPrimengComponent } from '../modal-primeng/modal-primeng.component'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AuthService } from '@/app/servicios/auth.service'
import { MessageService } from 'primeng/api'

@Component({
    selector: 'app-recover-password',
    standalone: true,
    imports: [PrimengModule, ModalPrimengComponent],
    templateUrl: './recover-password.component.html',
    styleUrl: './recover-password.component.scss',
})
export class RecoverPasswordComponent implements OnChanges, OnInit {
    @Output() accionBtnItem = new EventEmitter()
    @Input() showModal: boolean = true

    private fb = inject(FormBuilder)
    private authService = inject(AuthService)
    private messageService = inject(MessageService)

    formulario: number = 1
    formCredencial!: FormGroup
    loadingUsuario: boolean
    loadingVerificarUsuario: boolean
    loadingActualizarUsuario: boolean

    showPassword: boolean = false
    showPasswordConfir: boolean = false

    ngOnInit() {
        this.formCredencial = this.fb.group({
            cUsuario: ['', Validators.required],
            cCorreo: ['', Validators.required],
            cCredTokenPassword: [''],
            cPassword: [''],
            cPasswordConfir: [''],
        })
    }
    ngOnChanges(changes) {
        this.formulario = 1
        if (this.formCredencial) {
            this.formCredencial.reset()
        }

        if (changes.showModal?.currentValue) {
            this.showModal = changes.showModal.currentValue
        }
    }

    obtenerUsuario() {
        this.loadingUsuario = true
        this.authService.obtenerUsuario(this.formCredencial.value).subscribe({
            next: (response: any) => {
                this.loadingUsuario = false
                if (response.validated) {
                    this.formulario = 2
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: '¡Atención!',
                        detail: 'Los datos ingresados son errónes, comuníquese con el administrador',
                    })
                }
            },
            complete: () => {},
            error: (error) => {
                console.log(error)
                this.loadingUsuario = false
                this.messageService.add({
                    severity: 'error',
                    summary: '¡Atención!',
                    detail: 'Los datos ingresados son errónes, comuníquese con el administrador',
                })
            },
        })
    }

    verificarUsuario() {
        this.loadingVerificarUsuario = true
        this.authService.verificarUsuario(this.formCredencial.value).subscribe({
            next: (response: any) => {
                this.loadingVerificarUsuario = false
                if (response.validated) {
                    this.formulario = 3
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: '¡Atención!',
                        detail: 'El código ingresado es incorrecto, revise su correo por favor y vuelva ingresar',
                    })
                }
            },
            complete: () => {},
            error: (error) => {
                console.log(error)
                this.loadingVerificarUsuario = false
                this.messageService.add({
                    severity: 'error',
                    summary: '¡Atención!',
                    detail: 'El código ingresado es incorrecto, revise su correo por favor y vuelva ingresar',
                })
            },
        })
    }

    actualizarUsuario() {
        if (this.formCredencial.value.cPassword.length >= 6) {
            this.loadingActualizarUsuario = true
            this.authService
                .actualizarUsuario(this.formCredencial.value)
                .subscribe({
                    next: (response: any) => {
                        this.loadingActualizarUsuario = false
                        if (response.validated) {
                            this.formulario = 4
                        } else {
                            this.messageService.add({
                                severity: 'error',
                                summary: '¡Atención!',
                                detail: 'No se pudo actualizar la contraseña, vuelva intentar o comuníquese con el administrador',
                            })
                        }
                    },
                    complete: () => {},
                    error: (error) => {
                        console.log(error)
                        this.loadingActualizarUsuario = false
                        this.messageService.add({
                            severity: 'error',
                            summary: '¡Atención!',
                            detail: 'No se pudo actualizar la contraseña, vuelva intentar o comuníquese con el administrador',
                        })
                    },
                })
        } else {
            this.messageService.add({
                severity: 'error',
                summary: '¡Atención!',
                detail: 'La contraseña debe de tener al menos 6 caracteres como mínimo',
            })
        }
    }
    accionBtn(elemento): void {
        const { accion } = elemento
        const { item } = elemento

        switch (accion) {
            case 'close-modal':
                this.accionBtnItem.emit({ accion, item })
                break
        }
    }
}
