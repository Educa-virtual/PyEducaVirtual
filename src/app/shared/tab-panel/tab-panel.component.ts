import {
    AfterContentInit,
    Component,
    Input,
    TemplateRef,
    ViewChild,
} from '@angular/core'

@Component({
    selector: 'app-tab-panel',
    standalone: true,
    templateUrl: './tab-panel.component.html',
    styleUrl: './tab-panel.component.scss',
})
export class TabPanelComponent implements AfterContentInit {
    @Input() title: string = ''
    // @ContentChild(TemplateRef, {static: false}) content: TemplateRef<any>

    @ViewChild(TemplateRef, { static: false }) content: TemplateRef<any>

    ngAfterContentInit(): void {
        console.log(this.content)
    }
}
