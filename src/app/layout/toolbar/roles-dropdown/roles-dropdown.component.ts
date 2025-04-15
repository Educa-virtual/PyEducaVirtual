import { PrimengModule } from '@/app/primeng.module'
import { NgTemplateOutlet } from '@angular/common'
import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnChanges,
    OnInit,
} from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { DropdownModule } from 'primeng/dropdown'
import { FormPerfilesComponent } from './form-perfiles/form-perfiles.component'
import { LocalStoreService } from '@/app/servicios/local-store.service'
@Component({
    selector: 'app-roles-dropdown',
    standalone: true,
    imports: [
        DropdownModule,
        NgTemplateOutlet,
        FormsModule,
        ReactiveFormsModule,
        PrimengModule,
        FormPerfilesComponent,
    ],
    templateUrl: './roles-dropdown.component.html',
    styleUrl: './roles-dropdown.component.scss',
})
export class RolesDropdownComponent implements OnChanges, OnInit {
    @Output() actionTopBar = new EventEmitter()

    @Input() perfiles = []
    @Input() selectedPerfil

    showModal: boolean = false

    constructor(private store: LocalStoreService) {}
    ngOnChanges(changes) {
        if (changes.perfiles?.currentValue) {
            this.perfiles = changes.perfiles.currentValue
        }
        if (changes.selectedPerfil?.currentValue) {
            this.selectedPerfil = changes.selectedPerfil.currentValue
        }
    }
    ngOnInit() {
        const modalPerfil = this.store.getItem('dremoModalPerfil')
        if (!modalPerfil || this.selectedPerfil?.iPerfilId !== 0) {
            return
        }
        this.showModal = true
    }
    accionBtnItem(elemento): void {
        const { accion } = elemento
        switch (accion) {
            case 'close-modal':
                this.showModal = false
                break
            default:
                break
        }
    }
}
