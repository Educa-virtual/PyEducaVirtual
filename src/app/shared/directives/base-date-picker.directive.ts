import { Directive, Host, Input, OnInit } from '@angular/core'
import { Calendar } from 'primeng/calendar'

@Directive({
    selector: '[appBaseDatePicker]',
    standalone: true,
})
export class BaseDatePickerDirective implements OnInit {
    @Input() showTodayButton = false
    ngOnInit() {
        this.setAttributes()
    }

    constructor(@Host() private pCalendar: Calendar) {}

    private setAttributes() {
        this.pCalendar.appendTo = 'body'
        this.pCalendar.iconDisplay = 'input'
        this.pCalendar.styleClass = 'w-full'
        this.pCalendar.showButtonBar = true
        this.pCalendar.showIcon = true
        if (!this.showTodayButton) {
            this.pCalendar.todayButtonStyleClass = 'hidden'
        }
    }
}
