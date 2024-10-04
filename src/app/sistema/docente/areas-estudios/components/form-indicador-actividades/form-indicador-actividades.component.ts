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
    selector: 'app-form-indicador-actividades',
    standalone: true,
    imports: [ModalPrimengComponent, PrimengModule],
    templateUrl: './form-indicador-actividades.component.html',
    styleUrl: './form-indicador-actividades.component.scss',
})
export class FormIndicadorActividadesComponent implements OnChanges {
    @Output() accionBtnItem = new EventEmitter()

    @Input() data = []
    @Input() actividades = []
    @Input() tipoIndicadorLogros = []
    @Input() item
    @Input() showModal: boolean = true
    @Input() option: string

    constructor(private fb: FormBuilder) {}

    ngOnChanges(changes) {
        this.formIndicadorActividades.reset()
        if (changes.item?.currentValue) {
            this.item = changes.item.currentValue
            this.formIndicadorActividades.patchValue(this.item)
        }
    }

    formIndicadorActividades = this.fb.group({
        opcion: ['', Validators.required],

        iIndActId: [''],
        cIndActNumero: [''],
        iIndActSemanaEval: [''],
        cIndActDescripcion: [''],
        bIndActEsEvaluado: [''],
        iSilaboActAprendId: ['', Validators.required],
        cIndActProcedimientos: [''],
        cIndActActitudes: [''],
        cIndActConceptual: [''],
        IndActHoras: [''],
        iTipoIndLogId: ['', Validators.required],
        cIndActNombre: [''],

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
                this.formIndicadorActividades.controls.opcion.setValue(
                    'GUARDARxiSilaboActAprendIdxiTipoIndLogId'
                )
                this.accionBtnItem.emit({
                    accion: 'guardar',
                    item: this.formIndicadorActividades.value,
                })

                break
            case 'Actualizar':
                this.formIndicadorActividades.controls.opcion.setValue(
                    'ACTUALIZARxiIndActId'
                )
                this.accionBtnItem.emit({
                    accion: 'modificar',
                    item: this.formIndicadorActividades.value,
                })

                break
            default:
                break
        }
    }
}
