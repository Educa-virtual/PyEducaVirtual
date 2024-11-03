import { NgModule } from '@angular/core'
import { provideIcons } from '@ng-icons/core'
import { ICONS } from './icons'

@NgModule({
    imports: [],
    exports: [],
    declarations: [],
    providers: [provideIcons(ICONS)],
})
export class IconModule {}
