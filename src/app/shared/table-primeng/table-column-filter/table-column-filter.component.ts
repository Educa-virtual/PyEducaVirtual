import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { CheckboxModule } from 'primeng/checkbox'
import { MenuModule } from 'primeng/menu'
import { IconComponent } from '../../icon/icon.component'
import { provideIcons } from '@ng-icons/core'
import { matTune } from '@ng-icons/material-icons/baseline'

@Component({
    selector: 'app-table-column-filter',
    standalone: true,
    imports: [
        CommonModule,
        MenuModule,
        CheckboxModule,
        FormsModule,
        ButtonModule,
        IconComponent,
    ],
    templateUrl: './table-column-filter.component.html',
    styleUrl: './table-column-filter.component.scss',
    providers: [provideIcons({ matTune })],
})
export class TableColumnFilterComponent {
    @Input() columns = []
    @Output() columnsChange = new EventEmitter()

    selectedColumns = []

    // Actualiza las columnas seleccionadas por las que estan seleccionadas
    updateSelectedColumns() {
        this.selectedColumns = this.columns.filter((column) => column.selected)
        this.columnsChange.emit(this.selectedColumns)
    }

    onItemChange() {
        this.updateSelectedColumns()
    }

    // previene la propagación del evento
    onCheckboxClick(event: Event) {
        event.stopPropagation()
    }
}
