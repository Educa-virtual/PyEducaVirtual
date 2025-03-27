import { PrimengModule } from '@/app/primeng.module'
import { NgFor, NgIf } from '@angular/common'
import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    Output,
} from '@angular/core'

export interface TabsPrimeng {
    title: string
    icon?: string
    tab?: string
}

@Component({
    selector: 'app-tabs-primeng',
    standalone: true,
    imports: [PrimengModule, NgFor, NgIf],
    templateUrl: './tabs-primeng.component.html',
    styleUrl: './tabs-primeng.component.scss',
})
export class TabsPrimengComponent {
    @Output() updateTab = new EventEmitter()

    @Input() activeIndex: number = 0
    @Input() tabs: TabsPrimeng[]

    private _ChangeDetectorRef = inject(ChangeDetectorRef)
    ngOnChange(changes) {
        if (changes.activeIndex?.currentValue) {
            this.activeIndex = changes.activeIndex.currentValue
        }
        if (changes.tabs?.currentValue) {
            this.tabs = changes.tabs.currentValue
        }
    }
    onActiveIndexChange(event: number) {
        this.activeIndex = event
        this.updateTab.emit(this.activeIndex)
    }
}
