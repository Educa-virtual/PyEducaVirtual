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

@Component({
    selector: 'app-form-contenido-semanas',
    standalone: true,
    imports: [ModalPrimengComponent, PrimengModule],
    templateUrl: './form-contenido-semanas.component.html',
    styleUrl: './form-contenido-semanas.component.scss',
})
export class FormContenidoSemanasComponent implements OnChanges {
    @Output() accionBtnItem = new EventEmitter()

    @Input() iSilaboId
    @Input() item
    @Input() showModal: boolean = true
    @Input() option: string
    indicadorActividades = []
    constructor(
        private fb: FormBuilder,
        private GeneralService: GeneralService,
        private ConstantesService: ConstantesService
    ) {}

    ngOnChanges(changes) {
        this.formContenidoSemanas.reset()
        if (changes.item?.currentValue) {
            this.item = changes.item.currentValue
            this.formContenidoSemanas.patchValue(this.item)
        }
        if (changes.showModal?.currentValue) {
            this.showModal = changes.showModal.currentValue
        }
        if (this.showModal) {
            this.getIndicadorActividades()
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

    getIndicadorActividades() {
        const params = {
            petition: 'post',
            group: 'docente',
            prefix: 'indicador-actividades',
            ruta: 'list',
            seleccion: 1,
            data: {
                opcion: 'CONSULTARxiSilaboId',
                valorBusqueda: this.iSilaboId,
                iCredId: this.ConstantesService.iCredId,
            },
            params: { skipSuccessMessage: true },
        }
        this.GeneralService.getGralPrefix(params).subscribe({
            next: (response) => {
                this.indicadorActividades = response?.data
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
