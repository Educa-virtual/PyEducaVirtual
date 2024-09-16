import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { ConfirmationModalService } from '../confirmation-modal.service'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { ConfirmationService } from 'primeng/api'
import { IModal } from '../modal.interface'

@Component({
    selector: 'app-confirm-modal',
    standalone: true,
    imports: [CommonModule, ConfirmDialogModule, ButtonModule],
    templateUrl: './confirm-modal.component.html',
    styleUrl: './confirm-modal.component.scss',
})
export class ConfirmModalComponent implements OnInit {
    private _confirmationService = inject(ConfirmationModalService)
    private _confirmService = inject(ConfirmationService)

    visible: boolean = false
    public message: IModal

    ngOnInit(): void {
        this._confirmationService.dialogState$.subscribe((config) => {
            this._confirmService.confirm(config)
        })
    }
}
