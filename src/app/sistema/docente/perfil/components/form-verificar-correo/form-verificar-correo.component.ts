import { PrimengModule } from '@/app/primeng.module'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { GeneralService } from '@/app/servicios/general.service'
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
    @Input() iPersConId

    formVerificar!: FormGroup
    loading: boolean

    constructor(
        private tokenStorage: TokenStorageService,
        private router: Router,
        private fb: FormBuilder,
        private ConstantesService: ConstantesService,
        private GeneralService: GeneralService
    ) {
        this.formVerificar = this.fb.group({
            cCodeVerif: ['', Validators.required],
            iPersId: [this.ConstantesService.iPersId, Validators.required],
            iPersConId: [],
        })
    }

    ngOnChanges(changes) {
        if (changes.showModalVerificarCorreo?.currentValue) {
            this.showModalVerificarCorreo =
                changes.showModalVerificarCorreo.currentValue
        }
        if (changes.iPersConId?.currentValue) {
            console.log(this.iPersConId)
            this.iPersConId = changes.iPersConId.currentValue
            this.formVerificar.controls['iPersConId'].setValue(this.iPersConId)
        }
    }

    verificarCodigoCorreo() {
        const params = {
            petition: 'post',
            group: 'grl',
            prefix: 'personas-contactos',
            ruta: 'verificarCodVerificarCorreo',
            data: this.formVerificar.value,
        }

        this.GeneralService.getGralPrefix(params).subscribe({
            next: (response) => {
                if (response.validated) {
                    this.accionBtnItem.emit({
                        accion: 'close-modal',
                        item: [],
                    })
                }
            },
            complete: () => {},
            error: (error) => {
                console.log(error)
            },
        })
    }

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
