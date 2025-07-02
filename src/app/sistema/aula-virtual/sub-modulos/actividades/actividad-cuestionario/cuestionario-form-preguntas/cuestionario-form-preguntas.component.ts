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
    inject,
} from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { MessageService } from 'primeng/api'

@Component({
    selector: 'app-cuestionario-form-preguntas',
    standalone: true,
    imports: [ModalPrimengComponent, PrimengModule],
    templateUrl: './cuestionario-form-preguntas.component.html',
    styleUrl: './cuestionario-form-preguntas.component.scss',
})
export class CuestionarioFormPreguntasComponent implements OnChanges {
    @Output() accionBtnItem = new EventEmitter()
    @Output() formpregunta = new EventEmitter()
    @Output() actualizarPregunta = new EventEmitter()

    @Input() showModal: boolean = true
    @Input() tipoPreguntas = []
    @Input() data
    @Input() titulo: string = ''
    @Input() opcion: string = ''
    @ViewChild('editor', { static: true }) editor!: ElementRef

    private messageService = inject(MessageService)

    isFocused = false
    codigoTipoPregunta: string = ''
    opcionSeleccionada: any = null // Para manejar la opción seleccionada
    escalaLine: string = '1'
    escalaLine2: string = '2'
    selectNumber: number = 3
    selectedIcon: string = 'pi pi-star'
    action: string
    // valores para guardar pregunta
    iTipoPregId: string | number
    cPregunta: string = ''
    jsonAlternativas: string = ''

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
        cPregunta: new FormControl(),
        jsonAlternativas: new FormControl(),
    })

    ngOnChanges(changes: SimpleChanges) {
        if (changes['showModal']) {
            this.showModal = changes['showModal']?.currentValue
        }
        // if (changes['tipoPreguntas']) {
        //     this.tipoPreguntas = changes['tipoPreguntas']?.currentValue
        // }
        if (changes['titulo']) {
            this.titulo = changes['titulo']?.currentValue
        }
        // if (changes['opcion']) {
        //     this.opcion = changes['opcion']?.currentValue
        // }

        if (this.opcion === 'ACTUALIZAR') {
            this.action = 'ACTUALIZAR'
            if (changes['data']) {
                this.data = changes['data']?.currentValue
                this.cPregunta = this.data?.cPregunta
                this.iTipoPregId = this.data?.iTipoPregId
                this.codigoTipoPregunta = this.data?.cCodeTipoPreg
                this.opciones = this.data?.jsonAlternativas
                // console.log('datos de oppciones', this.iTipoPregId)
            }
        }
        if (this.opcion === 'GUARDAR') {
            this.action = 'GUARDAR'
            this.limpiarPregunta()
            console.log(
                'datos para guardar',
                this.data,
                this.codigoTipoPregunta,
                this.opciones
            )
        }
    }

    accionBtn(elemento): void {
        const { accion } = elemento
        const { item } = elemento
        switch (accion) {
            case 'close-modal':
                this.accionBtnItem.emit({ accion, item })
                this.iTipoPregId = ''
                this.cPregunta = ''

                console.log('modal cerrado')
                break
            case 'ACTUALIZAR':
                this.actuaizarPregunta()
                break
        }
    }
    limpiarPregunta() {
        console.log('datos limpios')
        this.cPregunta = ''
        this.iTipoPregId = ''
        this.codigoTipoPregunta = ''
        this.opciones = []
    }
    obtenerCodigoTipoPregunta(even: any): void {
        const tipoPregunta = this.tipoPreguntas.find(
            (t) => t.iTipoPregId === even.value
        )
        if (tipoPregunta) {
            this.codigoTipoPregunta = tipoPregunta.cCodeTipoPreg
        }
    }

    guardarPregunta() {
        // Estructura que espera tu backend
        const alternativasFormateadas = this.opciones.map((op) => ({
            cAlternativa: op.cAlternativa || '',
            cAlternativaImg: op.imagen || '',
        }))
        // Convertir a JSON y guardar en una variable
        this.jsonAlternativas = JSON.stringify(alternativasFormateadas)

        if (!this.cPregunta || !this.iTipoPregId) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error de validación',
                detail: 'Pregunta o tipo de pregunta no pueden estar vacíos',
            })
            // console.error('Pregunta o tipo de pregunta no pueden estar vacíos')
            return
        }
        const data = {
            cPregunta: this.cPregunta,
            iTipoPregId: this.iTipoPregId,
            jsonAlternativas: this.jsonAlternativas,
        }
        this.formpregunta.emit(data)
        this.showModal = false
    }
    actualizar: any
    actuaizarPregunta() {
        // Estructura que espera tu backend
        const alternativasFormateadas = this.opciones.map((op) => ({
            cAlternativa: op.cAlternativa || '',
            cAlternativaImg: op.imagen || '',
        }))

        // Convertir a JSON y guardar en una variable
        this.jsonAlternativas = JSON.stringify(alternativasFormateadas)

        const data = {
            iPregId: this.data.iPregId,
            cPregunta: this.cPregunta,
            iTipoPregId: this.iTipoPregId,
            jsonAlternativas: this.jsonAlternativas,
        }
        this.actualizarPregunta.emit(data)
        // console.log('datos actualizados', this.data)
    }
    // x borrar
    onInput(event: Event) {
        const value = (event.target as HTMLElement).innerText
        this.cPregunta = value
        // this.formPreguntas.get('cPregunta')?.setValue(value)
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
        cAlternativa: string
        imagen?: File | null
    }[] = [{ cAlternativa: '' }]
    agregarOpcion() {
        this.opciones.push({ cAlternativa: '' })
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
    onEscalaLineChange(event: any) {
        this.escalaLine = event.value
        console.log('Nuevo ID seleccionado:', event.value) // El nuevo id
    }
    cambiarEscalaLine(event: any) {
        this.escalaLine2 = event.value
        console.log('Nuevo ID seleccionado:', event.value) // El nuevo id
    }
    // Generar un rango de números del 1 al n de ('TIP-PREG-CALIF')
    getDisplayedNumbers(): number[] {
        return Array.from({ length: this.selectNumber }, (_, i) => i + 1)
    }
    onSelectNumberChange(event: any) {
        this.selectNumber = event.value
        console.log('Nuevo número seleccionado:', event.value) // El nuevo número
    }
    selecIcons(event: any) {
        this.selectedIcon = event.value
        console.log('Nuevo icono seleccionado:', this.selectedIcon) // El nuevo icono
    }
}
