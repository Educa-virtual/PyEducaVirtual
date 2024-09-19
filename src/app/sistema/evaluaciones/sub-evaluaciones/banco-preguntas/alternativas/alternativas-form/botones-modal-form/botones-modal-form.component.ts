import { Component } from '@angular/core'
import { DynamicDialogRef } from 'primeng/dynamicdialog'
import { ButtonModule } from 'primeng/button'

@Component({
    selector: 'app-botones-modal-form',
    standalone: true,
    imports: [ButtonModule],
    //templateUrl: './botones-modal-form.component.html',

    template: `
        <div class="flex w-full justify-content-end mt-3">
            <p-button
                type="button"
                label="Cancel"
                icon="pi pi-times"
                (onClick)="
                    closeDialog({
                        buttonType: 'Cancel',
                        summary: 'No Product Selected',
                    })
                "
            />
        </div>
    `,
    styleUrl: './botones-modal-form.component.scss',
})
export class BotonesModalFormComponent {
    constructor(public ref: DynamicDialogRef) {}

    closeDialog(data) {
        this.ref.close(data)
    }
}
