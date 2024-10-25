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
    selector: 'app-form-detalle-evaluaciones',
    standalone: true,
    imports: [ModalPrimengComponent, PrimengModule],
    templateUrl: './form-detalle-evaluaciones.component.html',
    styleUrl: './form-detalle-evaluaciones.component.scss',
})
export class FormDetalleEvaluacionesComponent implements OnChanges {
    @Output() accionBtnItem = new EventEmitter()

    @Input() item
    @Input() showModal: boolean = true
    @Input() option: string

    constructor(
        private fb: FormBuilder,
        private ConstantesService: ConstantesService,
        private messageService: MessageService
    ) {}

    ngOnChanges(changes) {
        this.dataDetalleEvaluaciones.reset()
        if (changes.item?.currentValue) {
            this.item = changes.item.currentValue
            this.dataDetalleEvaluaciones.patchValue(this.item)
        }
    }
    dataDetalleEvaluaciones = this.fb.group({
        opcion: ['', Validators.required],

        iDetEvaId: [''],
        iSilaboId: ['', Validators.required],
        cDetEvalDetalles: ['', Validators.required],

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
                this.dataDetalleEvaluaciones.controls.opcion.setValue(
                    'GUARDARxiSilaboId'
                )
                if (this.dataDetalleEvaluaciones.valid) {
                    this.messageService.add({
                        severity: 'error',
                        summary: '¡Atención!',
                        detail: 'Debe de ingresar todos los campos',
                    })
                } else {
                    this.accionBtnItem.emit({
                        accion: 'guardar',
                        item: this.dataDetalleEvaluaciones.value,
                    })
                }

                break
            case 'Actualizar':
                this.dataDetalleEvaluaciones.controls.opcion.setValue(
                    'ACTUALIZARxiDetEvaId'
                )
                if (this.dataDetalleEvaluaciones.valid) {
                    this.messageService.add({
                        severity: 'error',
                        summary: '¡Atención!',
                        detail: 'Debe de ingresar todos los campos',
                    })
                } else {
                    this.accionBtnItem.emit({
                        accion: 'modificar',
                        item: this.dataDetalleEvaluaciones.value,
                    })
                }

                break
            default:
                break
        }
    }
}
