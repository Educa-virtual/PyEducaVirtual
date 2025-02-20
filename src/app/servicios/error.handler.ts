import { Injectable } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { MessageService } from 'primeng/api' // Asegúrate de inyectar este servicio en tu clase.

@Injectable({
    providedIn: 'root',
})
export class ErrorHandler {
    constructor(private messageService: MessageService) {}

    handleHttpError(error: HttpErrorResponse): void {
        // this.handleHttpError(error);
        // if (error instanceof HttpErrorResponse) {
        // } else {
        //   this.handleUnknownError(error);
        // }
        if (error.status === 0) {
            this.showConnectionError(error)
        } else if (error.status >= 400 && error.status < 500) {
            this.showClientError(error)
        } else if (error.status >= 500) {
            this.showServerError(error)
        }
    }

    private showConnectionError(error: HttpErrorResponse): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Error de conexión',
            detail:
                error?.error?.message || 'No se puede conectar al servidor.',
            life: 3000,
        })
    }

    private showClientError(error: HttpErrorResponse): void {
        this.messageService.add({
            severity: 'warn',
            summary: 'Error del cliente',
            detail: error?.error?.message || 'Se produjo un error del cliente.',
            life: 3000,
        })
    }

    private showServerError(error: HttpErrorResponse): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Error del servidor',
            detail:
                error?.error?.message ||
                'Se produjo un error en el servidor. Inténtalo de nuevo más tarde.',
            life: 3000,
        })
    }
}
