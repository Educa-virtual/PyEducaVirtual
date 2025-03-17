import {
    AfterViewInit,
    Component,
    ElementRef,
    forwardRef,
    Input,
    Output,
    ViewChild,
} from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { CommonModule } from '@angular/common'
import { EventEmitter } from '@angular/core'

@Component({
    selector: 'app-btn-file-upload',
    standalone: true,
    imports: [ButtonModule, CommonModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => BtnFileUploadComponent),
            multi: true,
        },
    ],
    templateUrl: './btn-file-upload.component.html',
    styleUrl: './btn-file-upload.component.scss',
})
export class BtnFileUploadComponent
    implements ControlValueAccessor, AfterViewInit
{
    @Input() label: string = 'Cargar archivo'
    @Input() icon: string = 'pi pi-upload'
    @Input() accept: string = '*'
    @Input() disabled: boolean = false

    @Output() fileChange = new EventEmitter<any>()

    isAttachedFile = false

    @ViewChild('FileInput', { static: false })
    fileInput: ElementRef<HTMLInputElement>

    @ViewChild('FileView', { static: false })
    fileView: ElementRef<HTMLInputElement>
    file: File | null = null
    isDisabled = false

    ngAfterViewInit(): void {
        if (this.file) {
            this.attachFileInput(this.file)
        }
    }

    attachFileInput(file: File): void {
        if (!file) {
            this.fileInput.nativeElement.value = ''
            this.fileView.nativeElement.value = this.label
            this.isAttachedFile = false
        } else {
            this.fileView.nativeElement.value = file.name
            this.isAttachedFile = true
        }

        this.onChange(file)
        this.onTouched()
        this.fileChange.emit(file)
    }

    // Métodos de ControlValueAccessor
    private onChange = (file: File | null) => {
        console.log(file)
    }
    onTouched: () => void = () => {}

    writeValue(file): void {
        this.file = file
        if (this.fileInput) {
            this.attachFileInput(file)
        }
    }

    registerOnChange(fn: (file: File | null) => void): void {
        this.onChange = fn
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn
    }

    setDisabledState?(isDisabled: boolean): void {
        this.isDisabled = isDisabled
    }

    onFileSelected(): void {
        this.file = this.fileInput.nativeElement.files[0]

        this.fileView.nativeElement.value = this.file.name

        this.isAttachedFile = true

        this.attachFileInput(this.file)
    }

    onDeletedFile() {
        this.fileInput.nativeElement.value = ''
        this.fileView.nativeElement.value = this.label

        this.isAttachedFile = false

        this.onChange(null)
        this.onTouched()
    }
}
