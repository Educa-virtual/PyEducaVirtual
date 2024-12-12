import { CanDeactivate } from '@angular/router'
import { Injectable } from '@angular/core'
import { StepConfirmationService } from '@/app/servicios/confirm.service'
export interface CanComponentDeactivate {
    canDeactivate: () => Promise<boolean> | boolean
}

@Injectable({
    providedIn: 'root',
})
export class StepGuardService implements CanDeactivate<CanComponentDeactivate> {
    constructor(private stepConfirmationService: StepConfirmationService) {}

    // Implementación de canDeactivate
    async canDeactivate(component?: CanComponentDeactivate): Promise<boolean> {
        // Verificar si el componente tiene lógica personalizada para la desactivación
        if (component && component.canDeactivate) {
            const result = component.canDeactivate() // Ejecutar la lógica personalizada del componente
            if (result instanceof Promise) {
                return await result // Si devuelve una promesa, esperar a que se resuelva
            }
            return result // Si es un valor booleano, devolverlo directamente
        }

        console.log('dddd')

        const confirm = await this.stepConfirmationService.confirmAction(
            {},
            {
                header: '¿Desea salir sin guardar los cambios?',
                message: 'Por favor, confirme para continuar.',
                accept: {
                    severity: 'success',
                    summary: 'Confirmado',
                    detail: 'Se ha aceptado la navegación.',
                    life: 3000,
                },
                reject: {
                    severity: 'error',
                    summary: 'Cancelado',
                    detail: 'Se ha cancelado la navegación.',
                    life: 3000,
                },
            }
        )
        return confirm
    }
}
