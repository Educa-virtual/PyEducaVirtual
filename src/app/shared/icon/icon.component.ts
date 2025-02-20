import { Component, HostBinding, Input } from '@angular/core'
import { IconName, NgIconComponent } from '@ng-icons/core'
import { IconModule } from './icon.module'

export type IconSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | 'none'

const impactClasses: Record<NonNullable<IconSize>, string> = {
    base: 'var(--icon-size-base)',
    xs: 'var(--icon-size-xs)',
    sm: 'var(--icon-size-sm)',
    lg: 'var(--icon-size-lg)',
    xl: 'var(--icon-size-xl)',
    none: '',
}

@Component({
    selector: 'app-icon',
    standalone: true,
    imports: [NgIconComponent, IconModule],
    templateUrl: './icon.component.html',
    styleUrl: './icon.component.scss',
})
export class IconComponent {
    @Input({ required: true }) name!: IconName | string
    @Input() color: string | undefined
    @Input() strokeWidth: string | number | undefined
    @Input() size: IconSize | string = 'base'

    get getSize(): string {
        return impactClasses[this.size]
    }

    @HostBinding('class')
    get hostClasses(): string {
        return this.color
    }

    isPrimeIcon(): boolean {
        return this.name.startsWith('pi pi-')
    }
}
