import { MessageService } from 'primeng/api';
import { inject } from '@angular/core';

export abstract class MostrarErrorComponent {
  protected messageService = inject(MessageService); // ✅ CAMBIO AQUÍ

  protected mostrarErrores(error: any) {
    const errores = error?.error?.errors;
    if (error.status === 422 && errores) {
      Object.keys(errores).forEach(campo => {
        errores[campo].forEach((mensaje: string) => {
          this.mostrarMensajeToast({
            severity: 'error',
            summary: 'Error de validación',
            detail: mensaje,
          });
        });
      });
    } else {
      this.mostrarMensajeToast({
        severity: 'error',
        summary: 'Error',
        detail: error?.error?.message || 'Ocurrió un error inesperado',
      });
    }
  }

  protected mostrarMensajeToast({
    severity,
    summary,
    detail,
  }: {
    severity: string;
    summary: string;
    detail: string;
  }) {
    this.messageService.add({ severity, summary, detail });
  }
}
