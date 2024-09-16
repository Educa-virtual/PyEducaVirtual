import { DynamicDialogConfig } from 'primeng/dynamicdialog'

export const MODAL_CONFIG: DynamicDialogConfig = {
    width: '70%',
    focusOnShow: false,
    breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
    },
}
