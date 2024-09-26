import { Component } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { DynamicDialogRef } from 'primeng/dynamicdialog'
@Component({
    selector: 'app-botonos-modal-form',
    standalone: true,
    imports: [ButtonModule],
    // templateUrl: './botonos-modal-form.component.html',
    template: `
        <div class="flex w-full justify-content-end mt-3">
            <p-button
                type="button"
                label="Cancelar"
                icon="pi pi-times"
                severity="contrast"
                (onClick)="
                    closeDialog({
                        buttonType: 'Cancel',
                        summary: 'No Product Selected',
                    })
                "
            />
            <p-button
                type="button"
                label="Guardar"
                icon="pi pi-save"
                (onClick)="guardarEvaluacion()"
            />
        </div>
    `,
    styleUrl: './botonos-modal-form.component.scss',
})
export class BotonosModalFormComponent {
    constructor(public ref: DynamicDialogRef) {}

    closeDialog(data) {
        this.ref.close(data)
    }
    guardarEvaluacion() {
        alert('guardar evalución')
    }
}
