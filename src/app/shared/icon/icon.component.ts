import { Component, Input } from '@angular/core'
import { IconName, NgIconComponent } from '@ng-icons/core'

type IconSize = 'sm' | 'base' | 'lg' | 'xl' | 'none'

const impactClasses: Record<NonNullable<IconSize>, string> = {
    base: 'var(--icon-size-base)',
    sm: 'var(--icon-size-sm)',
    lg: 'var(--icon-size-lg)',
    xl: 'var(--icon-size-xl)',
    none: '',
}

@Component({
    selector: 'app-icon',
    standalone: true,
    imports: [NgIconComponent],
    templateUrl: './icon.component.html',
    styleUrl: './icon.component.scss',
})
export class IconComponent {
    @Input({ required: true }) name!: IconName | string
    @Input() isPrimeIcon = false
    @Input() color: string | undefined
    @Input() strokeWidth: string | number | undefined
    @Input() size: IconSize = 'base'

    get getSize(): string {
        return impactClasses[this.size]
    }
}
