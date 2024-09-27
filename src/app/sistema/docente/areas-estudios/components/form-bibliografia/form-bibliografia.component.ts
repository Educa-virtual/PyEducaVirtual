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
    @Input() option: string

    constructor(private GeneralService: GeneralService) {}

    ngOnInit() {
        this.getTipoBibliografias()
    }
    ngOnChanges(changes) {
        const { currentValue } = changes.data
        this.data = currentValue
    }
    accionBtn(elemento): void {
        const { accion } = elemento
        const { item } = elemento

        switch (accion) {
            case 'close-modal':
                this.accionBtnItem.emit({ accion, item })
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
