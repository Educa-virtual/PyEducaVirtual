import { PrimengModule } from '@/app/primeng.module'
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component'
import { TypesFilesUploadPrimengComponent } from '@/app/shared/types-files-upload-primeng/types-files-upload-primeng.component'
import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnChanges,
} from '@angular/core'
import { FormGroup } from '@angular/forms'
import {
    storeMaterialEducativoDocentes,
    updateMaterialEducativoDocentes,
} from '../../../formGroup/form-material-educativo-docentes'
import { NgIf } from '@angular/common'

@Component({
    selector: 'app-form-material-educativo',
    standalone: true,
    imports: [
        PrimengModule,
        ModalPrimengComponent,
        TypesFilesUploadPrimengComponent,
        NgIf,
    ],
    templateUrl: './form-material-educativo.component.html',
    styleUrl: './form-material-educativo.component.scss',
})
export class FormMaterialEducativoComponent implements OnChanges {
    @Output() accionBtnItem = new EventEmitter()

    @Input() showModal: boolean = true
    @Input() data
    @Input() titulo: string = ''
    @Input() opcion: string = ''

    typesFiles = {
        file: true,
        url: true,
        youtube: true,
        repository: false,
        image: false,
    }

    date = new Date()
    formMaterialEducativoDocentes: FormGroup

    ngOnChanges(changes) {
        if (changes.showModal?.currentValue) {
            this.showModal = changes.showModal.currentValue
        }
        if (changes.titulo?.currentValue) {
            this.titulo = changes.titulo.currentValue
        }
        if (changes.opcion?.currentValue) {
            this.opcion = changes.opcion.currentValue
            this.formMaterialEducativoDocentes =
                this.opcion === 'GUARDAR'
                    ? storeMaterialEducativoDocentes
                    : updateMaterialEducativoDocentes
        }
        if (changes.data?.currentValue) {
            this.data = changes.data.currentValue
            if (this.formMaterialEducativoDocentes) {
                this.formMaterialEducativoDocentes.patchValue(this.data)
            }
        }
    }
    accionBtn(elemento): void {
        const { accion } = elemento
        const { item } = elemento

        switch (accion) {
            case 'close-modal':
                this.accionBtnItem.emit({ accion, item })
                break
            case this.opcion:
                this.accionBtnItem.emit({
                    accion,
                    item: this.formMaterialEducativoDocentes.value,
                })
                break
        }
    }
}
