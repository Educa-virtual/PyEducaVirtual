import { PrimengModule } from '@/app/primeng.module'
import { NgFor } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'

export interface TabsPrimeng {
    title: string
    icon?: string
    tab?: string
}

@Component({
    selector: 'app-tabs-primeng',
    standalone: true,
    imports: [PrimengModule, NgFor],
    templateUrl: './tabs-primeng.component.html',
    styleUrl: './tabs-primeng.component.scss',
})
export class TabsPrimengComponent {
    @Output() updateTab = new EventEmitter()

    @Input() activeIndex: number = 0
    @Input() tabs: TabsPrimeng[]

    ngOnChange(changes) {
        if (changes.activeIndex?.currentValue) {
            this.activeIndex = changes.activeIndex.currentValue
            this.updateTab.emit(this.activeIndex)
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
