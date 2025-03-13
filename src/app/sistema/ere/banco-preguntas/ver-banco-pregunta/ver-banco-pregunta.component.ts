import {
    Component,
    OnInit,
    OnChanges,
    SimpleChanges,
    Input,
    inject,
} from '@angular/core'
import { NgIf } from '@angular/common'
import { PrimengModule } from '@/app/primeng.module'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular'
import { environment } from '@/environments/environment'
import { RemoveHTMLCSSPipe } from '@/app/shared/pipes/remove-html-style.pipe'
import { TruncatePipe } from '@/app/shared/pipes/truncate-text.pipe'
import { InputTextareaModule } from 'primeng/inputtextarea'

// Servicio
import { PreguntasReutilizablesService } from '@/app/sistema/evaluaciones/services/preguntas-reutilizables.service'

@Component({
    selector: 'app-ver-banco-pregunta',
    standalone: true,
    imports: [
        PrimengModule,
        ContainerPageComponent,
        EditorComponent,
        NgIf,
        RemoveHTMLCSSPipe,
        TruncatePipe,
        InputTextareaModule,
    ],
    providers: [
        { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
    ],
    templateUrl: './ver-banco-pregunta.component.html',
    styleUrls: ['./ver-banco-pregunta.component.scss'],
})
export class VerBancoPreguntaComponent implements OnInit, OnChanges {
    // Servicio inyectado
    private _PreguntasReutilizablesService = inject(
        PreguntasReutilizablesService
    )

    // Objeto donde guardaremos la data recibida de la API
    encab: any

    // Para construir la ruta de imágenes, etc.
    backend = environment.backend

    // Entradas desde el padre
    @Input() iPreguntaId: string = '' // ID para Pregunta Simple
    @Input() iEncabPregId: string = '' // ID para Pregunta Múltiple

    // Variable para marcar si es solo lectura
    isDisabled: boolean = true

    // Config del Editor TinyMCE
    init: EditorComponent['init'] = {
        base_url: '/tinymce',
        suffix: '.min',
        menubar: false,
        selector: 'textarea',
        placeholder: 'Escribe aquí...',
        plugins: 'lists image table',
        toolbar:
            'undo redo | forecolor backcolor | bold italic underline strikethrough | ' +
            'alignleft aligncenter alignright alignjustify | bullist numlist | ' +
            'image table',
        height: 400,
        editable_root: true,
        // readonly: 1, // Otra forma de deshabilitar edición si deseas
    }

    ngOnInit(): void {
        // Aquí no cargamos nada; la carga se hace en ngOnChanges cuando detecte iPreguntaId o iEncabPregId
        console.log('Componente Hijo - OnInit')
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log('Componente Hijo - OnChanges', changes)

        // 1. Detecta si cambió iPreguntaId (PREGUNTA SIMPLE)
        if (changes['iPreguntaId'] && changes['iPreguntaId'].currentValue) {
            const nuevoId = changes['iPreguntaId'].currentValue
            console.log(
                'iPreguntaId cambió:',
                changes['iPreguntaId'].previousValue,
                '=>',
                nuevoId
            )

            // Llamamos al método de carga para pregunta simple
            this.cargarPreguntaSimple(nuevoId)
        }

        // 2. Detecta si cambió iEncabPregId (PREGUNTA MÚLTIPLE)
        if (changes['iEncabPregId'] && changes['iEncabPregId'].currentValue) {
            const nuevoEncabId = changes['iEncabPregId'].currentValue
            console.log(
                'iEncabPregId cambió:',
                changes['iEncabPregId'].previousValue,
                '=>',
                nuevoEncabId
            )

            // Llamamos al método de carga para pregunta múltiple
            this.cargarPreguntaMultiple(nuevoEncabId)
        }
    }

    // ============================================================
    // Carga PREGUNTA SIMPLE
    // ============================================================
    private cargarPreguntaSimple(preguntaId: string): void {
        if (!preguntaId) {
            console.warn('No hay iPreguntaId válido, no se hace la llamada')
            return
        }
        console.log('Cargando Pregunta Simple con ID:', preguntaId)

        const params = { tipo_pregunta: 1 }

        this._PreguntasReutilizablesService
            .obtenerDetallePregunta(preguntaId, params)
            .subscribe({
                next: (respuesta) => {
                    this.encab = respuesta
                    console.log('Pregunta Simple cargada:', respuesta)
                },
                error: (error) => {
                    console.error('Error al cargar pregunta simple:', error)
                },
            })
    }

    // ============================================================
    // Carga PREGUNTA MÚLTIPLE
    // ============================================================
    private cargarPreguntaMultiple(encabPregId: string): void {
        if (!encabPregId) {
            console.warn('No hay iEncabPregId válido, no se hace la llamada')
            return
        }
        console.log('Cargando Pregunta Múltiple con ID:', encabPregId)

        const params = { tipo_pregunta: 2 }

        // Ajusta si tu servicio es distinto
        this._PreguntasReutilizablesService
            .obtenerDetallePregunta(encabPregId, params)
            .subscribe({
                next: (respuesta) => {
                    this.encab = respuesta
                    console.log('Pregunta Múltiple cargada:', respuesta)
                },
                error: (error) => {
                    console.error('Error al cargar pregunta múltiple:', error)
                },
            })
    }
}
