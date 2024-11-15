import { Injectable } from '@angular/core'
import { ConfirmationService, MessageService } from 'primeng/api'

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
export class StepConfirmationService {
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
            },
            reject: () => {
                this.messageService.add(informationMessage.reject)
            },
        })
    }
}
