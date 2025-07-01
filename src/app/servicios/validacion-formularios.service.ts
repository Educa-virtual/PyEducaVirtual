import { inject, Injectable } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { MessageService } from 'primeng/api'
import { ConfirmationModalService } from '../shared/confirm-modal/confirmation-modal.service'
import { IModal } from '../shared/confirm-modal/modal.interface'

@Injectable({
    providedIn: 'root',
})
export class ValidacionFormulariosService {
    private _ConfirmationModalService = inject(ConfirmationModalService)
    constructor(private _MessageService: MessageService) {}
    message: IModal = {
        severity: 'error',
        summary: '',
        detail: '',
    }

    validarFormulario(
        form: FormGroup,
        nombresCampos: Record<string, string>,
        tituloMensaje: string = 'Formulario incompleto'
    ): { valid: boolean; message: IModal | null } {
        if (form.invalid) {
            form.markAllAsTouched()

            const camposInvalidos = Object.entries(form.controls)
                .filter(
                    ([key, control]) => control.invalid && nombresCampos[key]
                )
                .map(([key]) => nombresCampos[key])
            if (camposInvalidos.length) {
                this.message.severity = 'error'
                this.message.summary = tituloMensaje
                this.message.detail = `Faltan completar los siguientes campos: ${camposInvalidos.join(', ')}.`
                return { valid: false, message: this.message }
            }
            return { valid: false, message: this.message } // El formulario no es válido
        }
        return { valid: true, message: null } // El formulario es válido
    }
}
