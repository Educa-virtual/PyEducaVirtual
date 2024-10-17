import { Directive, ElementRef, Host, OnInit, Renderer2 } from '@angular/core'
import { Calendar } from 'primeng/calendar'

@Directive({
    selector: '[appBaseDatePicker]',
    standalone: true,
})
export class BaseDatePickerDirective implements OnInit {
    ngOnInit() {
        this.setAttributes()
    }

    constructor(
        @Host() private pCalendar: Calendar,
        private _renderer: Renderer2,
        private _element: ElementRef
    ) {}

    private setAttributes() {
        this.pCalendar.appendTo = 'body'
        this.pCalendar.iconDisplay = 'input'
        this.pCalendar.styleClass = 'w-full'
        this.pCalendar.showButtonBar = true
        this.pCalendar.showIcon = true
    }
}
