import { Confirmation } from 'primeng/api'

export interface IModal extends Confirmation {
    severity?: string
    summary?: string
    detail?: string
}
