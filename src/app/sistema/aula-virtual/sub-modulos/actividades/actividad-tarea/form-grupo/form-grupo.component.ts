import { PrimengModule } from '@/app/primeng.module'
import { GeneralService } from '@/app/servicios/general.service'
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component'
import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnChanges,
    inject,
} from '@angular/core'

@Component({
    selector: 'app-form-grupo',
    standalone: true,
    imports: [ModalPrimengComponent, PrimengModule],
    templateUrl: './form-grupo.component.html',
    styleUrl: './form-grupo.component.scss',
})
export class FormGrupoComponent implements OnChanges {
    @Output() accionBtnItem = new EventEmitter()

    private GeneralService = inject(GeneralService)

    @Input() iTareaId: string
    @Input() showModal: boolean = true

    estudiantes = []
    cTareaGrupoNombre: string

    ngOnChanges(changes) {
        if (changes.iTareaId?.currentValue) {
            this.iTareaId = changes.iTareaId.currentValue
            this.getTareaCabeceraGruposEstudiantes()
        }
    }
    getTareaCabeceraGruposEstudiantes() {
        const params = {
            petition: 'post',
            group: 'aula-virtual',
            prefix: 'tarea-cabecera-grupos',
            ruta: 'list',
            data: {
                opcion: 'CONSULTAR-ESTUDIANTESxiTareaId',
                iTareaId: this.iTareaId,
            },
            params: { skipSuccessMessage: true },
        }
        this.getInformation(params, 'get-' + params.prefix)
    }

    saveTareaCabeceraGrupos() {
        // let data
        // this.estudiantes.forEach((i)=>{data.push({
        //     bAsignado:i.bAsignado,

        // })})
        const params = {
            petition: 'post',
            group: 'aula-virtual',
            prefix: 'tarea-cabecera-grupos',
            ruta: 'store',
            data: {
                opcion: 'GUARDAR-ESTUDIANTESxiTareaId',
                iTareaId: this.iTareaId,
                cTareaGrupoNombre: this.cTareaGrupoNombre,
                valorBusqueda: JSON.stringify(this.estudiantes),
            },
            params: { skipSuccessMessage: true },
        }
        this.getInformation(params, 'save-' + params.prefix)
    }

    getInformation(params, condition) {
        this.GeneralService.getGralPrefix(params).subscribe({
            next: (response) => {
                this.accionBtn({ accion: condition, item: response.data })
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
            case 'get-tarea-cabecera-grupos':
                this.estudiantes = item
                break
            case 'save-tarea-cabecera-grupos':
                console.log(item)
                this.accionBtnItem.emit({ accion, item })
                break
            default:
                break
        }
    }
}
