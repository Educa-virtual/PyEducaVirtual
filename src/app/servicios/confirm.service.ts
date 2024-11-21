import { Injectable } from '@angular/core'
import { ConfirmationService, MessageService } from 'primeng/api'
import { CanDeactivate } from '@angular/router'

export interface CanComponentDeactivate {
    canDeactivate: () => Promise<boolean> | boolean
}

type toastMessage = {
    severity: 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast'
    summary: string
    detail: string
    life: number
}

export type informationMessage = {
    header: string
    message: string
    accept: toastMessage
    reject: toastMessage
}

@Injectable({ providedIn: 'root' })
export class StepConfirmationService
    implements CanDeactivate<CanComponentDeactivate>
{
    private isDeactivating = false
    constructor(
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {}

    async confirmAction(
        {
            onAcceptCallbacks = [],
            onAcceptPromises = [],
        }: {
            onAcceptCallbacks?: (() => void)[]
            onAcceptPromises?: (() => Promise<void>)[]
        } = {},
        informationMessage: informationMessage
    ) {
        return new Promise<boolean>((resolve) => {
            this.confirmationService.confirm({
                header: informationMessage.header,
                message: informationMessage.message,
                accept: async () => {
                    console.log('sirviendo confirmacion')

                    this.messageService.add(informationMessage.accept)

                    // Ejecutar funciones síncronas
                    onAcceptCallbacks.forEach((callback) => callback())

                    // Ejecutar funciones asincrónicas y esperar que se resuelvan
                    for (const callback of onAcceptPromises) {
                        await callback()
                    }

                    resolve(true)
                },
                reject: () => {
                    this.messageService.add(informationMessage.reject)

                    resolve(false)
                },
            })
        })
    }

    async canDeactivate(component?: CanComponentDeactivate): Promise<boolean> {
        if (component.canDeactivate) {
            return await component.canDeactivate()
        }

        // const confirm = await component.(); 
        // return confirm;  

        return false
    }
}
