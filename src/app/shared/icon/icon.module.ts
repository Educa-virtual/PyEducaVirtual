import { NgModule } from '@angular/core'
import { provideIcons } from '@ng-icons/core'
import {
    matCancelScheduleSendOutline,
    matSendOutline,
} from '@ng-icons/material-icons/outline'

@NgModule({
    imports: [],
    exports: [],
    declarations: [],
    providers: [provideIcons({ matSendOutline, matCancelScheduleSendOutline })],
})
export class IconModule {}
