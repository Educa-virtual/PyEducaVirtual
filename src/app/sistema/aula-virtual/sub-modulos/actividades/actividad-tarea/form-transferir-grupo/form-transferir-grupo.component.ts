import { PrimengModule } from '@/app/primeng.module'
import { GeneralService } from '@/app/servicios/general.service'
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component'
import {
    Component,
    EventEmitter,
    inject,
    Input,
    Output,
    OnChanges,
} from '@angular/core'

@Component({
    selector: 'app-form-transferir-grupo',
    standalone: true,
    imports: [ModalPrimengComponent, PrimengModule],
    templateUrl: './form-transferir-grupo.component.html',
    styleUrl: './form-transferir-grupo.component.scss',
})
export class FormTransferirGrupoComponent implements OnChanges {
    @Output() accionBtnItem = new EventEmitter()

    private GeneralService = inject(GeneralService)

    @Input() showModalTransferir: boolean
    @Input() grupos: any = []
    @Input() iEstudianteId
    @Input() iTareaEstudianteId

    iTareaCabGrupoId

    ngOnChanges(changes) {
        if (changes.showModalTransferir?.currentValue) {
            this.showModalTransferir = changes.showModalTransferir.currentValue
        }
        if (changes.grupos?.currentValue) {
            this.grupos = changes.grupos.currentValue
        }
        if (changes.iEstudianteId?.currentValue) {
            this.iEstudianteId = changes.iEstudianteId.currentValue
        }
        if (changes.iTareaEstudianteId?.currentValue) {
            this.iTareaEstudianteId = changes.iTareaEstudianteId.currentValue
        }
    }
    transferenciaTareaCabeceraGrupos() {
        const params = {
            petition: 'post',
            group: 'aula-virtual',
            prefix: 'tarea-cabecera-grupos',
            ruta: 'transferenciaTareaCabeceraGrupos',
            data: {
                iEstudianteId: this.iEstudianteId,
                iTareaEstudianteId: this.iTareaEstudianteId,
                iTareaCabGrupoId: this.iTareaCabGrupoId,
            },
            params: { skipSuccessMessage: true },
        }
        this.GeneralService.getGralPrefix(params).subscribe({
            next: (response) => {
                if (response.validated) {
                    this.accionBtnItem.emit({
                        accion: 'save-modal-transferir',
                        item: [],
                    })
                }
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
            case 'close-modal-transferir':
                this.accionBtnItem.emit({ accion, item })
                break

            default:
                break
        }
    }
}
