import { Component, EventEmitter, Input, Output } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import {
    FormBuilder,
    FormGroup,
    Validators,
    ReactiveFormsModule,
} from '@angular/forms'
import { MessageService } from 'primeng/api'
import { CommonModule } from '@angular/common'
import { ModalPrimengComponent } from '../../../shared/modal-primeng/modal-primeng.component'
import { GeneralService } from '@/app/servicios/general.service'
import { ConstantesService } from '@/app/servicios/constantes.service'

@Component({
    selector: 'app-cambiar-constrasena',
    standalone: true,
    imports: [
        PrimengModule,
        ReactiveFormsModule,
        CommonModule,
        ModalPrimengComponent,
    ],
    templateUrl: './cambiar-constrasena.component.html',
    styleUrl: './cambiar-constrasena.component.scss',
})
export class CambiarConstrasenaComponent {
    @Output() accionCloseItem = new EventEmitter()
    @Input() showModal: boolean = false

    title: string = 'Cambiar contraseña'
    form: FormGroup

    constructor(
        private fb: FormBuilder,
        private _MessageService: MessageService,
        private _GeneralService: GeneralService,
        private _ConstantesService: ConstantesService
    ) {
        this.form = this.fb.group(
            {
                contraseniaActual: ['', [Validators.required]],
                contraseniaNueva: [
                    '',
                    [Validators.required, Validators.minLength(8)],
                ],
                confirmacionContrasenia: ['', Validators.required],
                iCredId: [this._ConstantesService.iCredId],
                iPersId: [this._ConstantesService.iPersId],
            },
            {
                validators: this.validadorCoincidenciaContrasenia,
            }
        )
    }

    // Validador personalizado para comparar contraseñas
    validadorCoincidenciaContrasenia(formGroup: FormGroup) {
        const contraseniaNueva = formGroup.get('contraseniaNueva')?.value
        const confirmacionContrasenia = formGroup.get(
            'confirmacionContrasenia'
        )?.value

        if (contraseniaNueva !== confirmacionContrasenia) {
            formGroup
                .get('confirmacionContrasenia')
                ?.setErrors({ noCoinciden: true })
            return { noCoinciden: true }
        } else {
            formGroup.get('confirmacionContrasenia')?.setErrors(null)
            return null
        }
    }

    enviarFormulario(): void {
        if (this.form.valid) {
            const params = {
                petition: 'post',
                group: 'seg',
                prefix: 'credenciales',
                ruta: 'updatePassword',
                data: this.form.value,
            }

            this._GeneralService.getGralPrefix(params).subscribe({
                next: (response) => {
                    if (response.validated) {
                        this._MessageService.add({
                            severity: 'success',
                            summary: 'Exitoso!',
                            detail: 'Contraseña cambiada correctamente',
                        })
                        this.form.reset()
                        this.accionCloseItem.emit()
                        setTimeout(() => {
                            window.location.reload()
                        }, 1000)
                    }
                },
                complete: () => {},
                error: (error) => {
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
        } else {
            this._MessageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Por favor, complete todos los campos correctamente',
            })

            // Marcar todos los campos como seleccionados para mostrar errores
            Object.keys(this.form.controls).forEach((key) => {
                const control = this.form.get(key)
                control?.markAsTouched()
            })
        }
    }
}
