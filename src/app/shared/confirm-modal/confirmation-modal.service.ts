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

    openConfirm({
        header,
        message = '',
        ...config
    }: Omit<IModal, 'header'> & {
        header: string
    }) {
        console.log(message === '')

        this.dialogState.next({
            header,
            key: 'manual',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Si',
            rejectLabel: 'No, cancelar',
            rejectVisible: true,
            message:
                message === '' ? 'No podrá revertir esta acción.' : message,
            ...config,
        })
    }
    openConfiSave({
        header,
        message = '',
        ...config
    }: Omit<IModal, 'header'> & {
        header: string
    }) {
        console.log(message === '')

        this.dialogState.next({
            header,
            key: 'manual',
            icon: 'pi pi-exclamation-circle',
            acceptLabel: 'Si',
            rejectLabel: 'No, Cancelar',
            rejectVisible: true,
            message:
                message === '' ? 'No podrá revertir esta acción.' : message,
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
