import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component'
import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { FormGroup, ReactiveFormsModule } from '@angular/forms'
import dayjs from 'dayjs'
import { BaseDatePickerDirective } from '@/app/shared/directives/base-date-picker.directive'
import { PrimengModule } from '@/app/primeng.module'
import { EditorImageDirective } from '@/app/shared/directives/editor-image.directive'
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component'
import { FileUploadPrimengComponent } from '@/app/shared/file-upload-primeng/file-upload-primeng.component'

@Component({
    selector: 'app-evaluacion-form-info',
    standalone: true,
    imports: [
        CommonModule,
        CommonInputComponent,
        ReactiveFormsModule,
        BaseDatePickerDirective,
        PrimengModule,
        EditorImageDirective,
        ModalPrimengComponent,
        FileUploadPrimengComponent,
    ],
    templateUrl: './evaluacion-form-info.component.html',
    styleUrl: './evaluacion-form-info.component.scss',
})
export class EvaluacionFormInfoComponent {
    @Input() public evaluacionInfoForm: FormGroup
    @Output() filesChange = new EventEmitter()

    @Input() public tipoEvaluaciones = []
    @Input() files = []

    public currentTime = dayjs().toDate()

    get invalidForm() {
        return true
    }

    titleFileEvaluacion = ''
    showModal = false
    typeUpload: string
    nameEnlace: string

    openUpload(type) {
        this.showModal = true
        this.typeUpload = type
        this.titleFileEvaluacion = ''
        switch (type) {
            case 'file':
                this.titleFileEvaluacion = 'Añadir Archivo Local'
                break
            case 'url':
                this.titleFileEvaluacion = 'Añadir Enlace URL'
                break
            case 'youtube':
                this.titleFileEvaluacion = 'Añadir Enlace de Youtube'
                break
            case 'recursos':
                this.titleFileEvaluacion = 'Añadir Archivo de mis Recursos'
                break
            default:
                this.showModal = false
                this.typeUpload = null
                break
        }
    }

    accionBtnItem(elemento): void {
        const { accion } = elemento
        const { item } = elemento
        // let params
        switch (accion) {
            case 'close-modal':
                this.showModal = false
                break
            case 'subir-archivo-evaluacion':
                this.files.push({
                    type: 1, //1->file
                    nameType: 'file',
                    name: item.file.name,
                    size: item.file.size,
                    ruta: item.name,
                })
                this.filesChange.emit(this.files)
                this.showModal = false
                break
            case 'subir-url':
                if (item === '') return
                this.files.push({
                    type: 2, //2->url
                    nameType: 'url',
                    name: item,
                    size: '',
                    ruta: item,
                })
                this.filesChange.emit(this.files)
                this.showModal = false
                this.nameEnlace = ''
                break
            case 'subir-youtube':
                if (item === '') return
                this.files.push({
                    type: 3, //3->youtube
                    nameType: 'youtube',
                    name: item,
                    size: '',
                    ruta: item,
                })
                this.filesChange.emit(this.files)
                this.showModal = false
                this.nameEnlace = ''
                break
        }
    }
}
