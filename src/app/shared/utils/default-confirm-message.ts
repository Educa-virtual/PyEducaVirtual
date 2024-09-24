import { IModal } from '../confirm-modal/modal.interface'

export function alertToConfirm({
    header,
    message = '',
    icon = '',
    ...options
}: IModal) {
    return {
        header: header,
        icon: icon ?? 'pi pi-exclamation-triangle',
        acceptLabel: 'Si',
        rejectLabel: 'No',
        message: message === '' ? message : 'No podrá revertir esta acción',
        ...options,
    }
}
