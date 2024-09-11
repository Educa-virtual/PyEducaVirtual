import { Message } from 'primeng/api'

export const getMessageByHttpCode = (code: number): Message => {
    const message: Message = {}

    if (code >= 200 && code < 300) {
        message.summary = 'Éxito'
        message.severity = 'success'
    }

    if (code >= 400) {
        message.summary = 'Error'
        message.severity = 'error'
    }

    return message
}
