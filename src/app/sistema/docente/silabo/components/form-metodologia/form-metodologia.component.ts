import { PrimengModule } from '@/app/primeng.module'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component'
import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnChanges,
} from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { MessageService } from 'primeng/api'

@Component({
    selector: 'app-form-metodologia',
    standalone: true,
    imports: [ModalPrimengComponent, PrimengModule],
    templateUrl: './form-metodologia.component.html',
    styleUrl: './form-metodologia.component.scss',
})
export class FormMetodologiaComponent implements OnChanges {
    @Output() accionBtnItem = new EventEmitter()

    @Input() data: []
    @Input() item
    @Input() showModal: boolean = true
    @Input() option: string

    constructor(
        private fb: FormBuilder,
        private ConstantesService: ConstantesService,
        private messageService: MessageService
    ) {}

    ngOnChanges(changes) {
        this.dataSilaboMetodologias.reset()
        if (changes.item?.currentValue) {
            this.item = changes.item.currentValue
            this.dataSilaboMetodologias.patchValue(this.item)
        }
    }

    dataSilaboMetodologias = this.fb.group({
        opcion: ['', Validators.required],

        idSilMetId: [''],
        iTipoMetId: ['', Validators.required],
        iSilaboId: ['', Validators.required],
        cSilMetDescripcion: ['', Validators.required],

        iCredId: [this.ConstantesService.iCredId, Validators.required],
    })

    accionBtn(elemento): void {
        const { accion } = elemento
        const { item } = elemento

        switch (accion) {
            case 'close-modal':
                this.accionBtnItem.emit({ accion, item })
                break

            case 'Agregar':
                this.dataSilaboMetodologias.controls.opcion.setValue(
                    'GUARDARxiSilaboId'
                )
                if (this.dataSilaboMetodologias.valid) {
                    this.messageService.add({
                        severity: 'error',
                        summary: '¡Atención!',
                        detail: 'Debe de ingresar todos los campos',
                    })
                } else {
                    this.accionBtnItem.emit({
                        accion: 'guardar',
                        item: this.dataSilaboMetodologias.value,
                    })
                }

                break
            case 'Actualizar':
                this.dataSilaboMetodologias.controls.opcion.setValue(
                    'ACTUALIZARxidSilMetId'
                )
                if (this.dataSilaboMetodologias.valid) {
                    this.messageService.add({
                        severity: 'error',
                        summary: '¡Atención!',
                        detail: 'Debe de ingresar todos los campos',
                    })
                } else {
                    this.accionBtnItem.emit({
                        accion: 'modificar',
                        item: this.dataSilaboMetodologias.value,
                    })
                }

                break
            default:
                break
        }
    }
}
