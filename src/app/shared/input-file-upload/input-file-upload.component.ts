import { PrimengModule } from '@/app/primeng.module'
import {
    Component,
    ElementRef,
    ViewChild,
    Input,
    forwardRef,
} from '@angular/core'
import { NG_VALUE_ACCESSOR } from '@angular/forms'

@Component({
    selector: 'app-input-file-upload',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './input-file-upload.component.html',
    styleUrl: './input-file-upload.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputFileUploadComponent),
            multi: true,
        },
    ],
})
export class InputFileUploadComponent {
    @Input() label: string = ''
    @Input() canViewLocalFile: boolean = true
    @Input() acceptTypes: string = ''
    selectFile: File | null = null
    fileBlob: Blob | null = null
    @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>
    @ViewChild('fileView') fileView: ElementRef<HTMLInputElement>

    constructor() {}

    onChange: (file: File | null) => void = () => {}
    onTouched: () => void = () => {}

    // Métodos de ControlValueAccessor
    writeValue(value: File | null): void {
        console.log('Seteando pdf')
        console.log(value)

        this.selectFile = value
        if (this.fileView && this.fileView.nativeElement) {
            this.fileView.nativeElement.value = value ? value.name : ''

            this.fileBlob = new Blob([this.selectFile], {
                type: this.selectFile.type,
            })
        }

        this.onChange(this.selectFile)
        this.onTouched()
    }

    registerOnChange(fn: (value: File | null) => void): void {
        this.onChange = fn
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn
    }

    setDisabledState(isDisabled: boolean): void {
        if (this.fileInput) {
            this.fileInput.nativeElement.disabled = isDisabled
        }
    }

    // Métodos del Componente
    viewFile(): void {
        if (this.fileBlob) {
            // Crear una URL temporal para el Blob
            const fileURL = URL.createObjectURL(this.fileBlob)

            // Abrir el archivo en una nueva pestaña
            window.open(fileURL, '_blank')

            // Opcional: limpiar el Blob después de usarlo
            URL.revokeObjectURL(fileURL)
        }
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement
        if (input.files && input.files.length > 0) {
            this.selectFile = input.files[0] // Archivo seleccionado
            this.fileView.nativeElement.value = this.selectFile.name

            this.fileBlob = new Blob([this.selectFile], {
                type: this.selectFile.type,
            })
        }

        this.onChange(this.selectFile)
        this.onTouched()
        return this.selectFile
    }

    triggerFileInput() {
        this.clear()
        this.fileInput.nativeElement.click()
    }

    clear() {
        this.selectFile = null
        this.fileInput.nativeElement.value = ''
        this.fileView.nativeElement.value = ''
        this.fileBlob = null
    }
}
