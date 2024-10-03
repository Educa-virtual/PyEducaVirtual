import { PrimengModule } from '@/app/primeng.module'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { GeneralService } from '@/app/servicios/general.service'
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
    selector: 'app-form-actividades',
    standalone: true,
    imports: [ModalPrimengComponent, PrimengModule],
    templateUrl: './form-actividades.component.html',
    styleUrl: './form-actividades.component.scss',
})
export class FormActividadesComponent implements OnChanges {
    @Output() accionBtnItem = new EventEmitter()

    @Input() showModal: boolean = true
    @Input() data = []
    @Input() item
    @Input() option: string

    constructor(
        private GeneralService: GeneralService,
        private fb: FormBuilder,
        private ConstantesService: ConstantesService,
        private messageService: MessageService
    ) {}

    ngOnChanges(changes) {
        this.dataSilaboActividadAprendizajes.reset()
        if (changes.item?.currentValue) {
            this.item = changes.item.currentValue
            this.dataSilaboActividadAprendizajes.patchValue(this.item)
        }
    }

    dataSilaboActividadAprendizajes = this.fb.group({
        opcion: ['', Validators.required],

        iSilaboActAprendId: [''],
        iSilaboId: [''],
        iIndLogorCapId: [''],
        cSilaboActAprendNumero: [''],
        cSilaboActAprendNombre: [''],
        cSilaboActAprendElementos: [''],
        dtSilaboActAprend: [''],
        cSilaboActIndLogro: [''],
        iSilaboActAprendSemanaEval: [''],
        iSilaboActHoras: [''],

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
                this.dataSilaboActividadAprendizajes.controls.opcion.setValue(
                    'GUARDARxiSilaboId'
                )
                this.accionBtnItem.emit({
                    accion: 'guardar',
                    item: this.dataSilaboActividadAprendizajes.value,
                })

                break
            case 'Actualizar':
                this.dataSilaboActividadAprendizajes.controls.opcion.setValue(
                    'ACTUALIZARxiSilaboActAprendId'
                )
                this.accionBtnItem.emit({
                    accion: 'modificar',
                    item: this.dataSilaboActividadAprendizajes.value,
                })

                break

            default:
                break
        }
    }
}
