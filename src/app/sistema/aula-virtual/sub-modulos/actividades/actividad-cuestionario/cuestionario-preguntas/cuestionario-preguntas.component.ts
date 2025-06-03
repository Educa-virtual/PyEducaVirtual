import { PrimengModule } from '@/app/primeng.module'
import { Component, OnInit, inject, Input } from '@angular/core'
// --------------
// import { GeneralService } from '@/app/servicios/general.service'
// import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
// import { ApiEvaluacionesRService } from '@/app/sistema/ere/evaluaciones/services/api-evaluaciones-r.service'
import { NgIf } from '@angular/common'
import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular'
import { MenuItem } from 'primeng/api'
// import { abecedario } from '@/app/sistema/aula-virtual/constants/aula-virtual'
// import { HttpClient } from '@angular/common/http'
import { environment } from '@/environments/environment'
// import { catchError, map, throwError } from 'rxjs'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { RemoveHTMLCSSPipe } from '@/app/shared/pipes/remove-html-style.pipe'
import { TruncatePipe } from '@/app/shared/pipes/truncate-text.pipe'
import { ESPECIALISTA_DREMO } from '@/app/servicios/seg/perfiles'
// import { PreguntasEreService } from '@/app/sistema/ere/evaluaciones/services/preguntas-ere.service'
import { RemoveHTMLPipe } from '@/app/shared/pipes/remove-html.pipe'
import { BancoPreguntasComponent } from '@/app/sistema/evaluaciones/sub-evaluaciones/banco-preguntas/banco-preguntas.component'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { NoDataComponent } from '@/app/shared/no-data/no-data.component'

@Component({
    selector: 'app-cuestionario-preguntas',
    standalone: true,
    templateUrl: './cuestionario-preguntas.component.html',
    styleUrls: ['./cuestionario-preguntas.component.scss'],
    imports: [
        PrimengModule,
        RemoveHTMLPipe,
        NgIf,
        ContainerPageComponent,
        EditorComponent,
        BancoPreguntasComponent,
        RemoveHTMLCSSPipe,
        TruncatePipe,
        NoDataComponent,
    ],
    providers: [
        { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
    ],
})
export class CuestionarioPreguntasComponent implements OnInit {
    // private _GeneralService = inject(GeneralService)
    //     private _MessageService = inject(MessageService)
    //     private _preguntasService = inject(PreguntasEreService)
    //     private _apiEre = inject(ApiEvaluacionesRService)
    //     private _ConfirmationModalService = inject(ConfirmationModalService)
    //     private http = inject(HttpClient)
    private _ConstantesService = inject(ConstantesService)

    // private backendApi = environment.backendApi
    backend = environment.backend
    breadCrumbItems: MenuItem[]
    breadCrumbHome: MenuItem

    private enunciadosCache = new Map<number, string>()

    @Input() iEvaluacionId
    @Input() iCursoNivelGradId
    data
    matrizCompetencia = []
    matrizCapacidad = []
    matrizCapacidadFiltrado = []
    nIndexAcordionTab: number = null
    isSecundaria: boolean = false
    isDisabled: boolean =
        this._ConstantesService.iPerfilId === ESPECIALISTA_DREMO
    preguntaPeso = [
        {
            iPreguntaPesoId: 1,
            cPreguntaPesoNombre: '1: Baja',
        },
        {
            iPreguntaPesoId: 2,
            cPreguntaPesoNombre: '2: Media',
        },
        {
            iPreguntaPesoId: 3,
            cPreguntaPesoNombre: '3: Alta',
        },
    ]
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
        height: 400,
        editable_root: this.isDisabled,
    }
    initEnunciado: EditorComponent['init'] = {
        base_url: '/tinymce', // Root for resources
        suffix: '.min', // Suffix to use when loading resources
        menubar: false,
        selector: 'textarea',
        placeholder: 'Escribe aqui...',
        height: 1000,
        plugins: 'lists image table',
        toolbar:
            'undo redo | forecolor backcolor | bold italic underline strikethrough | ' +
            'alignleft aligncenter alignright alignjustify | bullist numlist | ' +
            'image table',
        editable_root: this.isDisabled,
    }
    encabezado = ''
    preguntas = []
    alternativas = []
    showModalBancoPreguntas: boolean = false
    totalPregunta: number = 0
    iNivelGradoId: number = null

    tiposAgregarPregunta: MenuItem[] = [
        {
            label: 'Pregunta simple',
            icon: 'pi pi-plus',
            command: () => {
                // this.handleNuevaPregunta(false)
            },
        },
        {
            label: 'Pregunta múltiple',
            icon: 'pi pi-plus',
            command: () => {
                // this.handleNuevaPregunta(true)
            },
        },
        {
            label: 'Del banco de preguntas',
            icon: 'pi pi-plus',
            command: () => {
                this.showModalBancoPreguntas = true
            },
        },
    ]

    ngOnInit() {
        console.log('iEvaluacionId')
    }
}
