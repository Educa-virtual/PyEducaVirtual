import {
    AfterViewInit,
    Component,
    ContentChildren,
    Input,
    QueryList,
    ViewChild,
    ViewContainerRef,
} from '@angular/core'
import { TabPanelComponent } from '../tab-panel/tab-panel.component'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'app-tab-view',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './tab-view.component.html',
    styleUrl: './tab-view.component.scss',
})
export class TabViewComponent implements AfterViewInit {
    @ContentChildren(TabPanelComponent) tabs!: QueryList<TabPanelComponent>
    @Input() activeIndex: number = 0

    @ViewChild('contentContainer', { read: ViewContainerRef, static: false })
    container!: ViewContainerRef

    ngAfterViewInit(): void {
        this.selectTab(this.activeIndex)
    }

    selectTab(index: number) {
        this.activeIndex = index

        this.container.clear()

        const tab = this.tabs.toArray()[index]

        console.log(tab)

        if (tab?.content) {
            this.container.createEmbeddedView(tab.content)
        }
    }
}
