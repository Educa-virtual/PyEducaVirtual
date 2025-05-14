import { Component } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import {
    FormBuilder,
    FormGroup,
    Validators,
    ReactiveFormsModule,
} from '@angular/forms'
import { MessageService } from 'primeng/api'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'app-cambiar-constrasena',
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule, CommonModule],
    templateUrl: './cambiar-constrasena.component.html',
    styleUrl: './cambiar-constrasena.component.scss',
})
export class CambiarConstrasenaComponent {
    title: string = 'Cambiar contraseña'
    form: FormGroup

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService
    ) {
        this.form = this.fb.group(
            {
                contraseniaActual: ['', [Validators.required]],
                contraseniaNueva: [
                    '',
                    [Validators.required, Validators.minLength(8)],
                ],
                confirmacionContrasenia: ['', Validators.required],
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
            // Aquí va la lógica para cambiar la contraseña usando el servicio

            this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Contraseña cambiada correctamente',
            })

            this.form.reset()
        } else {
            this.messageService.add({
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
