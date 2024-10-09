import { Component, EventEmitter, Input, Output } from '@angular/core'
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown'
import { IRole } from '../roles-dropdown.component'
import { NgTemplateOutlet } from '@angular/common'

@Component({
    selector: 'app-anio-escolar',
    standalone: true,
    imports: [DropdownModule, NgTemplateOutlet],
    templateUrl: './anio-escolar.component.html',
    styleUrl: './anio-escolar.component.scss',
})
export class AnioEscolarComponent {
    @Output() profileChangeEmitter = new EventEmitter<IRole>()
    @Input() selectedProfile: IRole | undefined
    anios = [
        {
            id: '1',
            iAnioEscolar: '2024',
        },
    ]

    changeProfile(event: DropdownChangeEvent) {
        const role = event.value as IRole
        this.profileChangeEmitter.emit(role)
    }
}
