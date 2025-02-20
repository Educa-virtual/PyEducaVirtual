import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnChanges,
} from '@angular/core'
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown'
import { NgTemplateOutlet } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

@Component({
    selector: 'app-anio-escolar',
    standalone: true,
    imports: [
        DropdownModule,
        NgTemplateOutlet,
        FormsModule,
        ReactiveFormsModule,
    ],
    templateUrl: './anio-escolar.component.html',
    styleUrl: './anio-escolar.component.scss',
})
export class AnioEscolarComponent implements OnChanges {
    @Output() actionTopBar = new EventEmitter()

    @Input() years = []
    @Input() selectedYear: string

    ngOnChanges(changes) {
        if (changes.years?.currentValue) {
            this.years = changes.years.currentValue
        }
        if (changes.selectedYear?.currentValue) {
            this.selectedYear = changes.selectedYear.currentValue
        }
    }
    changeYear(event: DropdownChangeEvent) {
        const data = {
            accion: 'year',
            item: event.value,
        }
        this.actionTopBar.emit(data)
    }
}
