import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { IModal } from './modal.interface'

@Injectable({
    providedIn: 'root',
})
export class ConfirmationModalService {
    private dialogState = new Subject<IModal | null>()

    dialogState$ = this.dialogState.asObservable()
    constructor() {}

    private confirmationResponse = new Subject<boolean>()
    confirmationResponse$ = this.confirmationResponse.asObservable()

    openDialog(config: IModal) {
        this.dialogState.next(config)
    }
}
