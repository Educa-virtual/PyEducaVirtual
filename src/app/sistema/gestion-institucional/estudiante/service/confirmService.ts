import { Injectable } from '@angular/core'
import { ConfirmationService, MessageService } from 'primeng/api'

export type informationMessage = {
    header: string
    message: string
    accept: {
        severity:
            | 'success'
            | 'info'
            | 'warn'
            | 'error'
            | 'secondary'
            | 'contrast'
        summary: string
        detail: string
        life: number
    }
    reject: {
        severity:
            | 'success'
            | 'info'
            | 'warn'
            | 'error'
            | 'secondary'
            | 'contrast'
        summary: string
        detail: string
        life: number
    }
}

@Injectable({ providedIn: 'root' })
export class StepConfirmationService {
    constructor(
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {}

    confirmAction(
        onAcceptCallbacks: (() => void)[] = [],
        informationMessage: informationMessage
    ) {
        this.confirmationService.confirm({
            header: informationMessage.header,
            message: informationMessage.message,
            accept: () => {
                console.log('sirviendo confirmacion')

                this.messageService.add(informationMessage.accept)

                onAcceptCallbacks.forEach((callback) => callback())
            },
            reject: () => {
                this.messageService.add(informationMessage.reject)
            },
        })
    }
}
