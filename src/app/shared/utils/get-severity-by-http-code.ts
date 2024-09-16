import { IModal } from '../confirm-modal/modal.interface'

export const getMessageByHttpCode = (code: number): IModal => {
    const message: IModal = {}

    if (code >= 200 && code < 300) {
        message.header = 'Éxito'
        message.severity = 'success'
        message.icon = 'pi pi-check text-green-500 text-5xl'
        message.acceptButtonStyleClass = 'p-button-success p-button-rounded'
    }

    if (code >= 400) {
        message.header = 'Error'
        message.severity = 'error'
        message.icon = 'pi pi-exclamation-circle text-red-500 text-5xl'
        message.acceptButtonStyleClass = 'p-button-danger p-button-rounded'
    }

    return message
}
