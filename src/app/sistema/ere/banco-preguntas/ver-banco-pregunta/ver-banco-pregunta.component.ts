import { PreguntasReutilizablesService } from '@/app/sistema/evaluaciones/services/preguntas-reutilizables.service'
import {
    Component,
    inject,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { NgIf } from '@angular/common'
import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular'
import { environment } from '@/environments/environment'
import { RemoveHTMLCSSPipe } from '@/app/shared/pipes/remove-html-style.pipe'
import { TruncatePipe } from '@/app/shared/pipes/truncate-text.pipe'

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
    ],
    providers: [
        { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
    ],
    templateUrl: './ver-banco-pregunta.component.html',
    styleUrl: './ver-banco-pregunta.component.scss',
})
export class VerBancoPreguntaComponent implements OnInit, OnChanges {
    private _PreguntasReutilizablesService = inject(
        PreguntasReutilizablesService
    )
    encab: any

    backend = environment.backend
    @Input() iPreguntaId: string = ''
    @Input() iEncabPregId: string = ''
    isDisabled: any
    seleccion: string | null = null
    init: EditorComponent['init'] = {
        base_url: '/tinymce', // Root for resources
        suffix: '.min', // Suffix to use when loading resources
        menubar: false,
        selector: 'textarea',
        placeholder: 'Escribe aqui...',
        plugins: 'lists image table',
        toolbar:
            'undo redo | forecolor backcolor | bold italic underline strikethrough | ' +
            'alignleft aligncenter alignright alignjustify | bullist numlist | ' +
            'image table',
        height: 400,
        editable_root: true,
    }

    ngOnInit(): void {
        void this.iPreguntaId
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log('ejecutando changes', changes)

        if (changes['iPreguntaId']) {
            const prevValue = changes['iPreguntaId'].previousValue
            const currentValue = changes['iPreguntaId'].currentValue
            console.log('iPreguntaId cambió:', prevValue, '=>', currentValue)

            if (currentValue) {
                this.iPreguntaId = currentValue
                this.cargarPregunta()
            }
        }
    }

    cargarPregunta(): void {
        console.log('hijo recibe iPreguntaId=', this.iPreguntaId)
        if (!this.iPreguntaId) {
            console.warn('No hay iPreguntaId válido, no se hace la llamada')
            return
        }
        console.log('cargo pregunta 1')

        const params: any = {
            tipo_pregunta: 1,
        }

        this._PreguntasReutilizablesService
            .obtenerDetallePregunta(this.iPreguntaId, params)
            .subscribe({
                next: (respuesta) => {
                    this.encab = respuesta
                    console.log('cargo pregunta 2', respuesta)
                },
                error: (error) => {
                    console.error('error obtenido', error)
                },
            })

        console.log('probando' + this.iPreguntaId)
    }
}
