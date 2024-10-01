import { NgTemplateOutlet } from '@angular/common'
import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    inject,
} from '@angular/core'
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown'
import { ApiObtenerEuService } from './service/api-obtener-eu.service'

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
export class RolesDropdownComponent implements OnInit {
    private _apiValidacionE = inject(ApiObtenerEuService)
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
    ngOnInit(): void {
        /* this._apiValidacionE.obtenerAutenticacion(this)*/
        console.log(this._apiValidacionE)
    }

    changeProfile(event: DropdownChangeEvent) {
        const role = event.value as IRole
        this.profileChangeEmitter.emit(role)
    }
}
