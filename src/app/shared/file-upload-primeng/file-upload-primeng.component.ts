import { PrimengModule } from '@/app/primeng.module'
import { GeneralService } from '@/app/servicios/general.service'
import {
    Component,
    EventEmitter,
    inject,
    Input,
    Output,
    OnChanges,
} from '@angular/core'
import { FileUploadEvent } from 'primeng/fileupload'

@Component({
    selector: 'app-file-upload-primeng',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './file-upload-primeng.component.html',
    styleUrl: './file-upload-primeng.component.scss',
})
export class FileUploadPrimengComponent implements OnChanges {
    @Output() actionFileUpload = new EventEmitter()
    @Input() nameFile: string
    @Input() nameOption: string

    private GeneralService = inject(GeneralService)

    ngOnChanges(changes) {
        if (changes.nameFile?.currentValue) {
            this.nameFile = changes.nameFile.currentValue
        }
        if (changes.nameOption?.currentValue) {
            this.nameOption = changes.nameOption.currentValue
        }
    }

    async onUpload(elemento: FileUploadEvent) {
        const filesToUpload = <Array<File>>elemento.files

        if (filesToUpload.length) {
            const archivoFile = filesToUpload[0]

            const dataFile = await this.objectToFormData({
                file: archivoFile,
                nameFile: this.nameFile,
                params: { skipSuccessMessage: true },
            })

            this.GeneralService.subirArchivo(dataFile).subscribe({
                next: (resp: any) => {
                    const data = {
                        accion: 'subir-archivo-' + this.nameOption,
                        item: {
                            file: archivoFile,
                            name: resp.data,
                        },
                    }
                    this.actionFileUpload.emit(data)
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
}
