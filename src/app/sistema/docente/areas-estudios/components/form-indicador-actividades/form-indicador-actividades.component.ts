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
    selector: 'app-form-indicador-actividades',
    standalone: true,
    imports: [ModalPrimengComponent, PrimengModule],
    templateUrl: './form-indicador-actividades.component.html',
    styleUrl: './form-indicador-actividades.component.scss',
})
export class FormIndicadorActividadesComponent implements OnChanges {
    @Output() accionBtnItem = new EventEmitter()

    @Input() data = []
    @Input() tipoIndicadorLogros = []
    @Input() item
    @Input() showModal: boolean = true
    @Input() option: string
    @Input() iSilaboId

    actividades = []
    indicadorLogro: string = ''

    constructor(
        private fb: FormBuilder,
        private ConstantesService: ConstantesService,
        private GeneralService: GeneralService
    ) {}

    ngOnChanges(changes) {
        this.formIndicadorActividades.reset()
        if (changes.item?.currentValue) {
            this.item = changes.item.currentValue
            this.formIndicadorActividades.patchValue(this.item)
        }
        if (changes.showModal?.currentValue) {
            this.showModal = changes.showModal.currentValue
        }
        if (this.showModal) {
            this.getSilaboActividadAprendizajes()
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

    getSilaboActividadAprendizajes() {
        const params = {
            petition: 'post',
            group: 'docente',
            prefix: 'silabo-actividad-aprendizajes',
            ruta: 'list',
            seleccion: 1,
            data: {
                opcion: 'CONSULTARxiSilaboId',
                iCredId: this.ConstantesService.iCredId,
                iSilaboId: this.iSilaboId,
            },
            params: { skipSuccessMessage: true },
        }
        this.GeneralService.getGralPrefix(params).subscribe({
            next: (response) => {
                this.actividades = response?.data
            },
            complete: () => {},
            error: (error) => {
                console.log(error)
            },
        })
    }

    obtenerIndicadorLogro() {
        if (this.formIndicadorActividades.value.iSilaboActAprendId) {
            const indicador = this.actividades.find(
                (i) =>
                    i.iSilaboActAprendId ===
                    this.formIndicadorActividades.value.iSilaboActAprendId
            )
            this.indicadorLogro = indicador.cSilaboActIndLogro
        }
    }

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
