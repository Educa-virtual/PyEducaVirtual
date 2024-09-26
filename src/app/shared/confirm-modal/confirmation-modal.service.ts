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

    openConfirm({ header, message = '', ...config }: IModal) {
        this.dialogState.next({
            header,
            key: 'manual',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Si',
            rejectLabel: 'No, cancelar',
            rejectVisible: true,
            message: message === '' ? message : 'No podrá revertir esta acción',
            ...config,
        })
    }

    openAlert({
        header,
        ...config
    }: Omit<IModal, 'header'> & {
        header: string
    }) {
        this.dialogState.next({
            header,
            key: 'manual',
            icon: 'pi pi-exclamation-triangle',
            rejectVisible: false,
            acceptLabel: 'Aceptar',
            ...config,
        })
    }
}
