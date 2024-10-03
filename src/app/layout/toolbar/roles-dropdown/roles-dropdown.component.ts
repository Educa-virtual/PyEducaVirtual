import { NgTemplateOutlet } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown'

export interface IRole {
    id: string
    ieCodigo: string
    nombre: string
    codigoModular: string
    nivel: string
    direccion: string
    ugel: string
}
@Component({
    selector: 'app-roles-dropdown',
    standalone: true,
    imports: [DropdownModule, NgTemplateOutlet],
    templateUrl: './roles-dropdown.component.html',
    styleUrl: './roles-dropdown.component.scss',
})
export class RolesDropdownComponent {
    @Output() profileChangeEmitter = new EventEmitter<IRole>()
    @Input() selectedProfile: IRole | undefined
    @Input({ required: true }) roles: IRole[] = [
        {
            id: '1',
            ieCodigo: '20542',
            nombre: 'JAVIER PEREZ DE CUELLAR',
            codigoModular: '050092-0',
            nivel: 'PRIMARIA',
            direccion: 'DRE LIMA PROVINCIAS',
            ugel: '15 HUAROCHIRI',
        },
    ]

    changeProfile(event: DropdownChangeEvent) {
        const role = event.value as IRole
        this.profileChangeEmitter.emit(role)
    }
}
