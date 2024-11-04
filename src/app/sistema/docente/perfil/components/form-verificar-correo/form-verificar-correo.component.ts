import { PrimengModule } from '@/app/primeng.module'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { TokenStorageService } from '@/app/servicios/token.service'
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component'
import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnChanges,
} from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'

@Component({
    selector: 'app-form-verificar-correo',
    standalone: true,
    imports: [PrimengModule, ModalPrimengComponent],
    templateUrl: './form-verificar-correo.component.html',
    styleUrl: './form-verificar-correo.component.scss',
})
export class FormVerificarCorreoComponent implements OnChanges {
    @Output() accionBtnItem = new EventEmitter()
    @Input() showModalVerificarCorreo: boolean = false

    formVerificar!: FormGroup
    loading: boolean

    constructor(
        private tokenStorage: TokenStorageService,
        private router: Router,
        private fb: FormBuilder,
        private ConstantesService: ConstantesService
    ) {
        this.formVerificar = this.fb.group({
            cCodeVerif: ['', Validators.required],
            iPersId: [this.ConstantesService.iPersId, Validators.required],
        })
    }

    ngOnChanges(changes) {
        if (changes.showModal?.currentValue) {
            this.showModalVerificarCorreo = changes.showModal.currentValue
        }
    }

    verificarCodigoCorreo() {}

    accionBtn(elemento): void {
        const { accion } = elemento
        const { item } = elemento

        switch (accion) {
            case 'close-modal':
                this.accionBtnItem.emit({ accion, item })
                break
        }
    }
}
