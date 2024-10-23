import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { IconComponent } from '../../icon/icon.component'
import { provideIcons } from '@ng-icons/core'
import { matHideSource } from '@ng-icons/material-icons/baseline'

@Component({
    selector: 'app-empty-section',
    standalone: true,
    imports: [CommonModule, IconComponent],
    templateUrl: './empty-section.component.html',
    styleUrl: './empty-section.component.scss',
    providers: [provideIcons({ matHideSource })],
})
export class EmptySectionComponent {
    @Input({ required: true }) message: string = 'No hay datos para mostrar'
    @Input() styleClass: string
}
