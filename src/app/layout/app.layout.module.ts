import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { InputTextModule } from 'primeng/inputtext'
import { SidebarModule } from 'primeng/sidebar'
import { BadgeModule } from 'primeng/badge'
import { RadioButtonModule } from 'primeng/radiobutton'
import { InputSwitchModule } from 'primeng/inputswitch'
import { RippleModule } from 'primeng/ripple'
import { AppMenuComponent } from './app.menu.component'
import { AppMenuitemComponent } from './app.menuitem.component'
import { RouterModule } from '@angular/router'
import { AppTopBarComponent } from './app.topbar.component'
import { AppFooterComponent } from './app.footer.component'

import { AppSidebarComponent } from './app.sidebar.component'
import { AppLayoutComponent } from './app.layout.component'
import { DropdownModule } from 'primeng/dropdown'
import { PrimengModule } from '../primeng.module'
import { GlobalLoaderComponent } from '../shared/interceptors/global-loader/global-loader.component'
import { CommonModule } from '@angular/common'

@NgModule({
    imports: [
        GlobalLoaderComponent,
        FormsModule,
        CommonModule,
        HttpClientModule,
        BrowserAnimationsModule,
        InputTextModule,
        SidebarModule,
        BadgeModule,
        RadioButtonModule,
        InputSwitchModule,
        RippleModule,
        RouterModule,
        DropdownModule,
        PrimengModule,
        AppMenuitemComponent,
        AppTopBarComponent,
        AppFooterComponent,
        AppMenuComponent,
        AppSidebarComponent,
        AppLayoutComponent,
    ],
    exports: [AppLayoutComponent],
})
export class AppLayoutModule {}
