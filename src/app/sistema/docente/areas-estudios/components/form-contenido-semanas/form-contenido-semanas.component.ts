import { PrimengModule } from '@/app/primeng.module'
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component'
import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnChanges,
} from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'

@Component({
    selector: 'app-form-contenido-semanas',
    standalone: true,
    imports: [ModalPrimengComponent, PrimengModule],
    templateUrl: './form-contenido-semanas.component.html',
    styleUrl: './form-contenido-semanas.component.scss',
})
export class FormContenidoSemanasComponent implements OnChanges {
    @Output() accionBtnItem = new EventEmitter()

    @Input() indicadorActividades = []
    @Input() item
    @Input() showModal: boolean = true
    @Input() option: string

    constructor(private fb: FormBuilder) {}

    ngOnChanges(changes) {
        this.formContenidoSemanas.reset()
        if (changes.item?.currentValue) {
            this.item = changes.item.currentValue
            this.formContenidoSemanas.patchValue(this.item)
        }
    }

    formContenidoSemanas = this.fb.group({
        opcion: ['', Validators.required],

        iContenidoSemId: [],
        iIndActId: [],
        cContenidoSemTitulo: [],
        cContenidoSemNumero: [],
        cContenidoSemDescripcion: [],

        iCredId: [''],
    })
    accionBtn(elemento): void {
        const { accion } = elemento
        const { item } = elemento

        switch (accion) {
            case 'close-modal':
                this.accionBtnItem.emit({ accion, item })
                break
            case 'Agregar':
                this.formContenidoSemanas.controls.opcion.setValue(
                    'GUARDARxiIndActId'
                )
                this.accionBtnItem.emit({
                    accion: 'guardar',
                    item: this.formContenidoSemanas.value,
                })

                break
            case 'Actualizar':
                this.formContenidoSemanas.controls.opcion.setValue(
                    'ACTUALIZARxiContenidoSemId'
                )
                this.accionBtnItem.emit({
                    accion: 'modificar',
                    item: this.formContenidoSemanas.value,
                })

                break
            default:
                break
        }
    }
}
