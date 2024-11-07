import {
    Component,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    Output,
} from '@angular/core'
import { ModalPrimengComponent } from '../modal-primeng/modal-primeng.component'
import { PrimengModule } from '@/app/primeng.module'
import { NgIf } from '@angular/common'
import { GeneralService } from '@/app/servicios/general.service'

@Component({
    selector: 'app-types-files-upload-primeng',
    standalone: true,
    imports: [ModalPrimengComponent, PrimengModule, NgIf],
    templateUrl: './types-files-upload-primeng.component.html',
    styleUrl: './types-files-upload-primeng.component.scss',
})
export class TypesFilesUploadPrimengComponent implements OnChanges {
    private _GeneralService = inject(GeneralService)

    @Output() actionTypesFileUpload = new EventEmitter()
    @Input() nameFile: string
    @Input() nameOption: string
    @Input() typesFiles = {
        file: true,
        url: true,
        youtube: true,
        repository: false,
        image: false,
    }

    showModal: boolean = false
    titleFileTareas: string = ''
    typeUpload: string

    ngOnChanges(changes) {
        if (changes.typesFiles?.currentValue) {
            this.typesFiles = changes.typesFiles.currentValue
        }
    }

    openUpload(type) {
        this.typeUpload = type
        this.titleFileTareas = ''
        switch (type) {
            case 'file':
                this.titleFileTareas = 'Añadir Archivo Local'
                break
            case 'url':
                this.showModal = true
                this.titleFileTareas = 'Añadir Enlace URL'
                break
            case 'youtube':
                this.showModal = true
                this.titleFileTareas = 'Añadir Enlace de Youtube'
                break
            case 'repository':
                this.titleFileTareas = 'Añadir Archivo de mis Recursos'
                break
            case 'image':
                this.titleFileTareas = 'Añadir Archivo Local'
                break
            default:
                this.showModal = false
                this.typeUpload = null
                break
        }
    }

    async onUploadChange(evt) {
        const filesToUpload = evt.target.files

        if (filesToUpload.length) {
            const archivoFile = filesToUpload[0]

            const dataFile = await this.objectToFormData({
                file: archivoFile,
                nameFile: this.nameFile,
                params: { skipSuccessMessage: true },
            })

            this._GeneralService.subirArchivo(dataFile).subscribe({
                next: (resp: any) => {
                    const data = {
                        accion: 'subir-archivo-' + this.nameOption,
                        item: {
                            file: archivoFile,
                            name: resp.data,
                        },
                    }
                    console.log(data)
                },
                complete: () => {},
                error: (error) => {
                    console.log(error)
                },
            })
        }
    }

    objectToFormData(obj: any) {
        const formData = new FormData()
        Object.keys(obj).forEach((key) => {
            if (obj[key] !== '') {
                formData.append(key, obj[key])
            }
        })

        return formData
    }

    accionBtnItem(elemento): void {
        const { accion } = elemento
        //const { item } = elemento
        // let params
        switch (accion) {
            case 'close-modal':
                this.showModal = false
                break
        }
    }
}
