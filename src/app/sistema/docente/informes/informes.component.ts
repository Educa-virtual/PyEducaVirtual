import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
    ContainerPageComponent,
    //IActionContainer,, Input, inject , OnInit
} from '@/app/shared/container-page/container-page.component'
import { TabViewModule } from 'primeng/tabview'
import { IconComponent } from '@/app/shared/icon/icon.component'
import {
    matAccessTime,
    matCalendarMonth,
    matHideSource,
    matListAlt,
    matMessage,
    matRule,
    matStar,
} from '@ng-icons/material-icons/baseline'
import { provideIcons } from '@ng-icons/core'
import { TableModule } from 'primeng/table'
//import para el select
import { DropdownModule } from 'primeng/dropdown'
import { InputGroupModule } from 'primeng/inputgroup'
import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component'
import { InputGroupAddonModule } from 'primeng/inputgroupaddon'
import { ContainerPageAccionbComponent } from './container-page-accionb/container-page-accionb.component'
//El buscar
import { InputTextModule } from 'primeng/inputtext'
import { InputIconModule } from 'primeng/inputicon'
import { IconFieldModule } from 'primeng/iconfield'
import { ButtonModule } from 'primeng/button'

@Component({
    selector: 'app-informes',
    standalone: true,
    templateUrl: './informes.component.html',
    styleUrls: ['./informes.component.scss'],
    imports: [
        ContainerPageComponent,
        CommonModule,
        TabViewModule,
        IconComponent,
        TableModule,
        DropdownModule,
        InputGroupModule,
        CommonInputComponent,
        InputGroupAddonModule,
        ContainerPageAccionbComponent,
        InputTextModule,
        InputIconModule,
        IconFieldModule,
        ButtonModule,
    ],
    providers: [
        provideIcons({
            matHideSource,
            matCalendarMonth,
            matMessage,
            matStar,
            matRule,
            matListAlt,
            matAccessTime,
        }),
    ],
})
export class InformesComponent {
    constructor() {}

    // ngOnInit() {
    // } implements OnInit
}
