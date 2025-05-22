import { ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CardModule } from 'primeng/card'
import { ButtonModule } from 'primeng/button'
import { Message } from 'primeng/api'
import { MessagesModule } from 'primeng/messages'
import { AccordionModule } from 'primeng/accordion'
import { ToolbarModule } from 'primeng/toolbar'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import {
    accionBtnCurriculas,
    curriculasColumns,
    curriculasSave,
    validateFormCurricula,
} from './config/table/curriculas'
import { DialogModule } from 'primeng/dialog'
import { FormBuilder, Validators } from '@angular/forms'
import { InputTextModule } from 'primeng/inputtext'
import { DropdownModule } from 'primeng/dropdown'
import { ToggleButtonModule } from 'primeng/togglebutton'
import { CurriculasService } from './config/service/curriculas.service'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { DividerModule } from 'primeng/divider'
import {
    accionBtnCursos,
    cursosColumns,
    cursosSave,
    validateFormCursos,
} from './config/table/cursos'
import { concatMap, iif, Observable, of, tap, throwError } from 'rxjs'
import { CursosService } from './config/service/cursos.service'
import { ModalidadServicioService } from './config/service/modalidadServicio.service'
import { FormConfig } from './config/types/forms'
import { InputNumberModule } from 'primeng/inputnumber'
import {
    assignCursosInNivelesGrados,
    editar,
    eliminar,
    nivelesCursos,
} from './config/actions/table'
import { agregar } from './config/actions/container'
import { CursosNivelesGradosService } from './config/service/nivelesGrados.service'
import { nivelesGradosColumns } from './config/table/nivelesGrados'
import { ProgressBarModule } from 'primeng/progressbar'
import { ToastModule } from 'primeng/toast'
import { FileUploadModule } from 'primeng/fileupload'
import { ImageModule } from 'primeng/image'
import { CalendarModule } from 'primeng/calendar'
import { InputTextareaModule } from 'primeng/inputtextarea'
import {
    accionBtnCursosNivelesGrados,
    asyncCursosNivelGrado,
} from './config/table/cursosNivelesGrados'
import { iCursosNivelesGrados } from './config/types/cursosNivelesGrados'
import { iCursos } from './config/types/cursos'
import { iCurriculas } from './config/types/curricula'

@Component({
    selector: 'app-curriculas',
    standalone: true,
    imports: [
        DividerModule,
        CommonModule,
        FormsModule,
        ImageModule,
        ProgressBarModule,
        ToastModule,
        InputNumberModule,
        ReactiveFormsModule,
        CardModule,
        ButtonModule,
        MessagesModule,
        AccordionModule,
        InputTextareaModule,
        FileUploadModule,
        ToolbarModule,
        ContainerPageComponent,
        TablePrimengComponent,
        DialogModule,
        InputTextModule,
        DropdownModule,
        ToggleButtonModule,
        CalendarModule,
    ],
    templateUrl: './curriculas.component.html',
    styleUrl: './curriculas.component.scss',
})
export class CurriculasComponent implements OnInit {
    choose(event, callback) {
        console.log('click')

        callback()
    }

    // mensajes: EditorComponent['init'] = {
    //     base_url: '/tinymce', // Root for resources
    //     suffix: '.min', // Suffix to use when loading resources
    //     menubar: false,

    //     // selector: 'textarea',
    //     // setup: (editor) => {
    //     //     editor.on('blur', (e) =>
    //     //         this.actualizar(e, 'cSilaboDescripcionCurso')
    //     //     )
    //     // },
    //     placeholder: 'Escribe aqui...',
    //     height: 250,
    //     plugins: 'lists image table',
    //     toolbar: 'bold italic underline strikethrough',
    //     editable_root: true,
    // }

    curriculas = {
        container: {
            actions: [agregar],
            accionBtnItem: accionBtnCurriculas.bind(this),
        },
        table: {
            columns: curriculasColumns,
            data: [],
            actions: [editar, nivelesCursos],
            accionBtnItem: accionBtnCurriculas.bind(this),
        },
        save: (): Observable<object> => curriculasSave.call(this),
    }

    cursos = {
        container: {
            actions: [{ ...agregar, disabled: true }],
            accionBtnItem: accionBtnCursos.bind(this),
        },
        table: {
            columnsGroup: cursosColumns.inTableColumnsGroup,
            columns: cursosColumns.inTableColumns,
            columnsWithoutActions: cursosColumns.inTableColumns.filter(
                (column) => column.type != 'actions'
            ),
            data: [],
            actions: {
                core: [editar],
                nivelesGrados: [assignCursosInNivelesGrados],
            },
            accionBtnItem: accionBtnCursos.bind(this),
        },
        save: (): Observable<object> =>
            cursosSave.call(this, this.forms.cursos.value),
    }

    cursosNivelesGrados = {
        table: {
            columns: cursosColumns.inTableColumns,
            data: [],
            actions: [eliminar],
            accionBtnItem: accionBtnCursosNivelesGrados.bind(this),
        },
    }

    nivelesGrados = {
        filters: '',
        container: {
            actions: [],
        },
        table: {
            columns: nivelesGradosColumns,
            data: [],
        },
    }

    curriculasActions: IActionTable[] = [editar]
    messages: Message[] | undefined
    sidebarVisible: boolean = false

    forms: FormConfig = {
        curriculas: this.fb.group({}),
        cursos: this.fb.group({}),
        tipoCurso: this.fb.group({}),
        cursosNivelesGrados: this.fb.group({}),
    }
    dialogs = {
        curriculas: {
            title: 'Crear Currículas',
            visible: false,
            expand: {
                cursos: false,
            },
        },
        cursos: {
            title: 'Crear Curso',
            visible: false,
        },
        tipoCurso: {
            title: 'Crear Modalidad de Servicio',
            visible: false,
        },
        nivelesCursos: {
            title: 'Currículas',
            visible: false,
        },
        cursosNivelesCursos: {
            title: 'Asignar curso a nivel grado',
            visible: false,
        },
    }

    dropdowns = {
        tipoCurso: undefined,
        modalidades: undefined,
        nivelesGrados: undefined,
    }

    constructor(
        private fb: FormBuilder,
        public curriculasService: CurriculasService,
        public cursosService: CursosService,
        public modalidadServiciosService: ModalidadServicioService,
        public nivelesGradosService: CursosNivelesGradosService,
        public cdr: ChangeDetectorRef
    ) {
        this.forms.curriculas = this.fb.group<iCurriculas['formGroup']>({
            iCurrId: [''],
            iModalServId: [''],
            iCurrNotaMinima: [''],
            iCurrTotalCreditos: [''],
            iCurrNroHoras: [''],
            cCurrPerfilEgresado: ['', Validators.required],
            cCurrMencion: [''],
            nCurrPesoProcedimiento: [''],
            cCurrPesoConceptual: [''],
            cCurrPesoActitudinal: [''],
            bCurrEsLaVigente: [''],
            cCurrRsl: [''],
            dtCurrRsl: [''],
            cCurrDescripcion: [''],
        })

        this.forms.cursos = this.fb.group<iCursos['formGroup']>({
            iCursoId: [''],
            iCurrId: [''],
            iTipoCursoId: [''],
            cCursoNombre: [''],
            nCursoCredTeoria: [''],
            nCursoCredPractica: [''],
            cCursoDescripcion: [''],
            nCursoTotalCreditos: [''],
            cCursoPerfilDocente: [''],
            iCursoTotalHoras: [''],
            iEstado: [''],
            cCursoImagen: [''],
        })

        this.forms.cursosNivelesGrados = this.fb.group<
            iCursosNivelesGrados['formGroup']
        >({
            iNivelGradoId: [''],
            iCursoId: [''],
            nCursoHorasTeoria: [''],
            nCursoHorasPractica: [''],
            cCursoDescripcion: [''],
            nCursoTotalCreditos: [''],
            cCursoPerfilDocente: [''],
            iCursoTotalHoras: [''],
        })

        this.forms.curriculas.get('iModalServId').dirty
    }

    ngOnInit() {
        this.messages = [{ severity: 'info', detail: 'Videos de Seguridad' }]

        this.forms.curriculas.valueChanges.subscribe(({ iCurrId }) => {
            const disabled = !(iCurrId !== '' && iCurrId !== null)

            this.cursos.container = {
                ...this.cursos.container,
                actions: this.cursos.container.actions.map((action) => ({
                    ...action,
                    disabled,
                })),
            }
        })

        this.obtenerDatosIniciales()
    }

    obtenerDatosIniciales() {
        this.modalidadServiciosService.getModalidadServicios().subscribe({
            next: (value: any) => {
                this.dropdowns.modalidades = value.data.map((item) => ({
                    name: item.cModalServNombre,
                    code: item.iModalServId,
                }))
            },
            error: (err) => {
                console.error(err)
            },
            complete: () => {},
        })

        this.cursosService.getTipoCursos().subscribe({
            next: (res: any) => {
                this.dropdowns.tipoCurso = res.data.map((item) => ({
                    name: item.cTipoCursoNombre,
                    code: item.iTipoCursoId,
                }))
            },
        })

        this.curriculasService.getCurriculas().subscribe({
            next: (res: any) => {
                console.log(res)

                this.curriculas.table.data = res.data
            },
            error: (err) => {
                console.error(err)
            },
            complete: () => {
                console.log(this.dropdowns.modalidades)
            },
        })

        this.nivelesGradosService.getNivelGrados().subscribe({
            next: (res: any) => {
                this.dropdowns.nivelesGrados = res.data.map((item) => ({
                    name: item.cGradoNombre,
                    code: item.iNivelGradoId,
                }))
                console.log(res)
            },
        })

        asyncCursosNivelGrado.call(this)
    }

    saveCurriculas() {
        of(null)
            .pipe(
                concatMap(() =>
                    iif(
                        () => validateFormCurricula.call(this),
                        this.curriculas.save(),
                        throwError(() => new Error('Formulario inválido'))
                    )
                ),
                tap((res1) => console.log('save', res1)),
                concatMap((resCurricula) => {
                    console.log('resCurricula')
                    console.log(resCurricula)
                    return this.curriculasService.getCurriculas()
                })
            )
            .subscribe({
                next: (res: any) => {
                    this.curriculas.table.data = res.data
                },
                error: (err) => {
                    console.error(err)
                },
                complete: () => {
                    this.dialogs.curriculas.visible = false
                },
            })
    }

    saveCursos() {
        of(null)
            .pipe(
                concatMap(() =>
                    iif(
                        () => validateFormCursos.call(this),
                        this.cursos.save(),
                        throwError(() => new Error('Formulario inválido'))
                    )
                ),
                tap((res1) => console.log('save', res1)),
                concatMap((resCursos) => {
                    console.log('resCursos')
                    console.log(resCursos)
                    return this.cursosService.getCursos(
                        this.forms.cursos.value.iCursoId
                    )
                })
            )
            .subscribe({
                next: (res: any) => {
                    this.cursos.table.data = res.data
                },
                error: (err) => {
                    console.error(err)
                },
                complete: () => {
                    this.dialogs.cursos.visible = false
                },
            })
    }

    saveCursosNivelesGrados() {
        of(null)
            .pipe(
                concatMap(() =>
                    iif(
                        () => validateFormCursos.call(this),
                        this.cursos.save(),
                        throwError(() => new Error('Formulario inválido'))
                    )
                ),
                tap((res1) => console.log('save', res1)),
                concatMap((resCursos) => {
                    console.log('resCursos')
                    console.log(resCursos)
                    return this.cursosService.getCursos(
                        this.forms.cursos.value.iCursoId
                    )
                })
            )
            .subscribe({
                next: (res: any) => {
                    this.cursos.table.data = res.data
                },
                error: (err) => {
                    console.error(err)
                },
                complete: () => {
                    this.dialogs.cursos.visible = false
                },
            })
    }
}
