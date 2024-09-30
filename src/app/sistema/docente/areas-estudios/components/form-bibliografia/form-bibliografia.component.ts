import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    OnInit,
} from '@angular/core'
import { ModalPrimengComponent } from '../../../../../shared/modal-primeng/modal-primeng.component'
import { PrimengModule } from '@/app/primeng.module'
import { GeneralService } from '@/app/servicios/general.service'
import { FormBuilder, Validators } from '@angular/forms'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { MessageService } from 'primeng/api'
interface Data {
    accessToken: string
    refreshToken: string
    expires_in: number
    msg?
    data?
    validated?: boolean
    code?: number
}
@Component({
    selector: 'app-form-bibliografia',
    standalone: true,
    imports: [ModalPrimengComponent, PrimengModule],
    templateUrl: './form-bibliografia.component.html',
    styleUrl: './form-bibliografia.component.scss',
})
export class FormBibliografiaComponent implements OnChanges, OnInit {
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

    ngOnInit() {
        this.getTipoBibliografias()
    }
    ngOnChanges(changes) {
        this.dataBibliografias.reset()
        if (changes.item?.currentValue) {
            this.item = changes.item.currentValue
            this.dataBibliografias.patchValue(this.item)
        }
    }

    dataBibliografias = this.fb.group({
        opcion: ['', Validators.required],

        iBiblioId: [''],
        iTipoBiblioId: ['', Validators.required],
        iSilaboId: [''],
        cBiblioAutor: ['', Validators.required],
        cBiblioTitulo: ['', Validators.required],
        cBiblioAnioEdicion: ['', Validators.required],
        cBiblioEditorial: ['', Validators.required],
        cBiblioUrl: [''],
        iEstado: [1],
        iSesionId: [null],
        dtCreado: [null],
        dtActualizado: [null],

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
                this.dataBibliografias.controls.opcion.setValue(
                    'GUARDARxiSilaboId'
                )
                console.log(this.dataBibliografias)
                if (!this.dataBibliografias.valid) {
                    // this.messageService.add({
                    //     severity: 'error',
                    //     summary: '¡Atención!',
                    //     detail: 'Debe de ingresar todos los campos',
                    // })
                } else {
                    this.accionBtnItem.emit({
                        accion: 'guardar',
                        item: this.dataBibliografias.value,
                    })
                }

                break
            case 'Actualizar':
                this.dataBibliografias.controls.opcion.setValue(
                    'ACTUALIZARxiBiblioId'
                )
                if (!this.dataBibliografias.valid) {
                    this.messageService.add({
                        severity: 'error',
                        summary: '¡Atención!',
                        detail: 'Debe de ingresar todos los campos',
                    })
                } else {
                    this.accionBtnItem.emit({
                        accion: 'modificar',
                        item: this.dataBibliografias.value,
                    })
                }

                break

            default:
                break
        }
    }
    getTipoBibliografias() {
        const params = {
            petition: 'post',
            group: 'docente',
            prefix: 'tipo-bibliografias',
            ruta: 'list',
            data: {
                opcion: 'CONSULTAR',
            },
        }
        this.getInformation(params, false)
    }
    tipoBibliografias = []
    getInformation(params, api) {
        this.GeneralService.getGralPrefix(params).subscribe({
            next: (response: Data) => {
                if (!api) {
                    this.tipoBibliografias = response.data
                }
            },
            complete: () => {},
            error: (error) => {
                console.log(error)
            },
        })
    }
}
