import { IconComponent } from '@/app/shared/icon/icon.component'
import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { provideIcons } from '@ng-icons/core'
import { matCalendarMonth } from '@ng-icons/material-icons/baseline'
import { TabViewModule } from 'primeng/tabview'

@Component({
    selector: 'app-actividad',
    standalone: true,
    imports: [CommonModule, IconComponent, TabViewModule],
    templateUrl: './actividad.component.html',
    styleUrl: './actividad.component.scss',
    providers: [provideIcons({ matCalendarMonth })],
})
export class ActividadComponent {}
