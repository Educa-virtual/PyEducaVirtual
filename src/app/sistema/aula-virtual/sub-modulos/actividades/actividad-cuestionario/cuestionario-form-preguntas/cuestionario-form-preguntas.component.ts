import { PrimengModule } from '@/app/primeng.module'
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component'
import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnChanges,
    SimpleChanges,
    ViewChild,
    ElementRef,
} from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular'

@Component({
    selector: 'app-cuestionario-form-preguntas',
    standalone: true,
    imports: [ModalPrimengComponent, PrimengModule, EditorComponent],
    templateUrl: './cuestionario-form-preguntas.component.html',
    styleUrl: './cuestionario-form-preguntas.component.scss',
    providers: [
        { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
    ],
})
export class CuestionarioFormPreguntasComponent implements OnChanges {
    @Output() accionBtnItem = new EventEmitter()

    @Input() showModal: boolean = true
    @Input() tipoPreguntas = []
    @Input() data
    @Input() titulo: string = ''
    @Input() opcion: string = ''
    @ViewChild('editor', { static: true }) editor!: ElementRef

    isFocused = false
    codigoTipoPregunta: string = ''
    opcionSeleccionada: number = 0 // Para manejar la opción seleccionada

    activeCommands = {
        bold: false,
        italic: false,
        underline: false,
    }
    scaleLineI = [
        { id: 1, label: 'Muy fácil' },
        { id: 0, label: 'Fácil' },
    ]
    scaleLineF = [
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 },
        { id: 9 },
        { id: 10 },
    ]
    calif = [
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 },
        { id: 9 },
        { id: 10 },
    ]
    icons = [
        { idIcn: 1, icon: 'pi pi-thumbs-up' },
        { idIcn: 2, icon: 'pi pi-sun' },
        { idIcn: 3, icon: 'pi pi-star' },
    ]

    formPreguntas = new FormGroup({
        iTipoPregId: new FormControl(),
        iCredId: new FormControl(),
    })

    init: EditorComponent['init'] = {
        base_url: '/tinymce', // Root for resources
        suffix: '.min', // Suffix to use when loading resources
        menubar: false,
        selector: 'textarea',
        placeholder: 'Escriba aquí...',
        plugins: 'lists image table',
        toolbar:
            'undo redo | forecolor backcolor | bold italic underline strikethrough | ' +
            'alignleft aligncenter alignright alignjustify | bullist numlist | ' +
            'image table',
        height: 250,
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['showModal']) {
            this.showModal = changes['showModal']?.currentValue
        }
        if (changes['tipoPreguntas']) {
            this.tipoPreguntas = changes['tipoPreguntas']?.currentValue
        }
        if (changes['titulo']) {
            this.titulo = changes['titulo']?.currentValue
        }
        if (changes['opcion']) {
            this.opcion = changes['opcion']?.currentValue
        }
        if (changes['data']) {
            this.data = changes['data']?.currentValue
        }
    }

    accionBtn(elemento): void {
        const { accion } = elemento
        const { item } = elemento

        switch (accion) {
            case 'close-modal':
                this.accionBtnItem.emit({ accion, item })
                break
        }
    }

    obtenerCodigoTipoPregunta(even: any): void {
        const tipoPregunta = this.tipoPreguntas.find(
            (t) => t.iTipoPregId === even.value
        )
        if (tipoPregunta) {
            this.codigoTipoPregunta = tipoPregunta.cCodeTipoPreg
        }
    }

    onFocus() {
        this.isFocused = true
        this.updateCommandStates()
    }

    onBlur(event: FocusEvent) {
        const relatedTarget = event.relatedTarget as HTMLElement

        // Si el nuevo foco está en un botón de la barra, no ocultar la barra
        if (relatedTarget && relatedTarget.closest('.icon-button')) {
            return
        }

        this.isFocused = false
    }

    toggleFormat(command: string) {
        document.execCommand(command, false, '')
        this.updateCommandStates()

        // Mantener el focus en el editor después de aplicar formato
        this.editor.nativeElement.focus()
    }

    updateCommandStates() {
        this.activeCommands.bold = document.queryCommandState('bold')
        this.activeCommands.italic = document.queryCommandState('italic')
        this.activeCommands.underline = document.queryCommandState('underline')
    }

    opciones: {
        texto: string
        imagen?: File | null
    }[] = [{ texto: '' }]
    agregarOpcion() {
        this.opciones.push({ texto: '' })
    }
    eliminarOpcion(index: number) {
        this.opciones.splice(index, 1)

        // Asegurar que la opción seleccionada siga siendo válida
        if (this.opcionSeleccionada === index) {
            this.opcionSeleccionada = -1
        } else if (this.opcionSeleccionada > index) {
            this.opcionSeleccionada--
        }
    }
    onImagenSeleccionada(event: Event, index: number) {
        const file = (event.target as HTMLInputElement).files?.[0]
        if (file) {
            this.opciones[index].imagen = file
        }
    }
}
