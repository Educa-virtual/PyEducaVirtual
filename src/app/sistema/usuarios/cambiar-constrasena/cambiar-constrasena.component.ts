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
import { UsuariosService } from '../services/usuarios.service'

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
        private messageService: MessageService,
        private usuariosService: UsuariosService
        //private _GeneralService: GeneralService,
        //private _ConstantesService: ConstantesService
    ) {
        // const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

        this.form = this.fb.group(
            {
                contrasenaActual: ['', [Validators.required]],
                contrasenaNueva: [
                    '',
                    [
                        Validators.required,
                        Validators.minLength(8),
                        Validators.pattern(passwordPattern),
                    ],
                ],
                confirmarContrasena: ['', Validators.required],
                //iCredId: [this._ConstantesService.iCredId],
                //iPersId: [this._ConstantesService.iPersId],
            },
            {
                validators: this.validadorCoincidenciacontrasena,
            }
        )
    }

    // Validador personalizado para comparar contraseñas
    validadorCoincidenciacontrasena(formGroup: FormGroup) {
        const contrasenaNueva = formGroup.get('contrasenaNueva')?.value
        const confirmarContrasena = formGroup.get('confirmarContrasena')?.value

        if (contrasenaNueva !== confirmarContrasena) {
            formGroup
                .get('confirmarContrasena')
                ?.setErrors({ noCoinciden: true })
            return { noCoinciden: true }
        } else {
            formGroup.get('confirmarContrasena')?.setErrors(null)
            return null
        }
    }

    enviarFormulario(): void {
        this.usuariosService
            .cambiarContrasena(
                this.form.get('contrasenaActual')?.value,
                this.form.get('contrasenaNueva')?.value
            )
            .subscribe({
                next: (response: any) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Contraseña cambiada',
                        detail: response.message,
                    })
                    this.form.reset()
                    this.accionCloseItem.emit()
                    /*setTimeout(() => {
                        window.location.reload()
                    }, 1000)*/
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error al cambiar la contraseña',
                        detail: error.error.message || 'Error desconocido',
                    })
                },
            })

        /*if (this.form.valid) {


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
        }*/
    }
}
