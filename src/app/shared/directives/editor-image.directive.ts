import { GeneralService } from '@/app/servicios/general.service'
import { Directive, Host, inject, Input } from '@angular/core'
import { Editor } from 'primeng/editor'
import { objectToFormData } from '../utils/object-to-form-data'
import { environment } from '@/environments/environment'

const containerToolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    ['link', 'image'],

    [{ header: 1 }, { header: 2 }],
    [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ direction: 'rtl' }],

    [{ size: ['small', false, 'large', 'huge'] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    // [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],

    ['clean'],
]

@Directive({
    selector: '[appEditorImage]',
    standalone: true,
})
export class EditorImageDirective {
    @Input({ required: true }) nameFile: string
    private _generalService = inject(GeneralService)
    modules = {
        toolbar: {
            container: containerToolbarOptions,
            handlers: {
                image: this.customImageHandler.bind(this),
            },
        },
    }
    constructor(@Host() private pEditor: Editor) {
        this.pEditor.modules = this.modules
    }

    customImageHandler(value: any) {
        if (!value) return
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'image/*')

        input.onchange = (e: Event) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (file) {
                this.uploadImage(file)
            }
        }

        input.click()
    }

    async uploadImage(file: File) {
        console.log(this.pEditor.quill)

        const dataFile = objectToFormData({
            file,
            nameFile: this.nameFile,
        })
        this._generalService.subirArchivo(dataFile).subscribe({
            next: (resp: any) => {
                // const data = {
                //     accion: 'subir-archivo-' + 'test',
                //     item: {
                //         file,
                //         name: resp.data,
                //     },
                // }
                const routeImage = `${environment.backend}/${resp.data}`
                this.pEditor.quill.insertEmbed(
                    this.pEditor.quill.getSelection().index,
                    'image',
                    routeImage
                )
            },
            complete: () => {},
            error: (error) => {
                console.log(error)
            },
        })
    }
}
