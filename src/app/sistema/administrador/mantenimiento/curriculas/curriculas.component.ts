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
    accionBtnContainerCurriculas,
    curriculasAccionBtnTable,
    curriculasColumns,
    curriculasSave,
} from './config/table/curriculas'
import { DialogModule } from 'primeng/dialog'
import { FormBuilder, Validators } from '@angular/forms'
import { InputTextModule } from 'primeng/inputtext'
import { DropdownModule } from 'primeng/dropdown'
import { EditorModule } from 'primeng/editor'
import { ToggleButtonModule } from 'primeng/togglebutton'
import { CurriculasService } from './config/service/curriculas.service'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { DividerModule } from 'primeng/divider'
import {
    accionBtnContainerCursos,
    cursosAccionBtnTable,
    cursosColumns,
    cursosSave,
} from './config/table/cursos'
import { Observable } from 'rxjs'
import { CursosService } from './config/service/cursos.service'
import { ModalidadServicioService } from './config/service/modalidadServicio.service'
import { FormConfig } from './config/types/forms'
import { InputNumberModule } from 'primeng/inputnumber'
import {
    assignCursosInNivelesGrados,
    editar,
    nivelesCursos,
} from './config/actions/table'
import { agregar } from './config/actions/container'
import { NivelGradosService } from './config/service/nivelesGrados.service'
import { nivelesGradosColumns } from './config/table/nivelesGrados'
import { ProgressBarModule } from 'primeng/progressbar'
import { ToastModule } from 'primeng/toast'
import { FileUploadModule } from 'primeng/fileupload'
import { ImageModule } from 'primeng/image'

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
        FileUploadModule,
        ToolbarModule,
        ContainerPageComponent,
        TablePrimengComponent,
        DialogModule,
        InputTextModule,
        DropdownModule,
        EditorModule,
        ToggleButtonModule,
    ],
    templateUrl: './curriculas.component.html',
    styleUrl: './curriculas.component.scss',
})
export class CurriculasComponent implements OnInit {
    choose(event, callback) {
        console.log('click')

        callback()
    }

    curriculas = {
        container: {
            actions: [agregar],
            accionBtnItem: accionBtnContainerCurriculas.bind(this),
        },
        table: {
            columns: curriculasColumns,
            data: [],
            actions: [editar, nivelesCursos],
            accionBtnItem: curriculasAccionBtnTable.bind(this),
        },
        save: (): Observable<object> => curriculasSave.call(this),
    }

    cursos = {
        container: {
            actions: [{ ...agregar, disabled: true }],
            accionBtnItem: accionBtnContainerCursos.bind(this),
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
            accionBtnItem: cursosAccionBtnTable.bind(this),
        },
        save: (): Observable<object> => cursosSave.call(this),
    }

    nivelesGrados = {
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
        assignCursosInNivelesGrados: this.fb.group({}),
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
        public nivelesGradosService: NivelGradosService,
        public cdr: ChangeDetectorRef
    ) {
        this.forms.curriculas = this.fb.group({
            iCurrId: [''],
            iModalServId: ['', Validators.required],
            iCurrNotaMinima: ['', Validators.required],
            iCurrTotalCreditos: ['', Validators.required],
            iCurrNroHoras: ['', Validators.required],
            cCurrPerfilEgresado: ['', Validators.required],
            cCurrMencion: ['', Validators.required],
            nCurrPesoProcedimiento: ['', Validators.required],
            cCurrPesoConceptual: ['', Validators.required],
            cCurrPesoActitudinal: ['', Validators.required],
            bCurrEsLaVigente: [''],
            cCurrRsl: ['', Validators.required],
            dtCurrRsl: ['', Validators.required],
            cCurrDescripcion: ['', Validators.required],
        })

        this.forms.cursos = this.fb.group({
            iCurrId: [''],
            iTipoCursoId: [''],
            cCursoNombre: [''],
            nCursoCredTeoria: [''],
            nCursoCredPractica: [''],
            cCursoDescripcion: [''],
            nCursoTotalCreditos: [''],
            cCursoPerfilDocente: [''],
            iCursoTotalHoras: [''],
            iCursoEstado: [''],
            cCursoImagen: [''],
        })

        this.forms.assignCursosInNivelesGrados = this.fb.group({
            iNivelGradoId: ['', Validators.required],
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
    }

    showCursos() {
        this.cursos.table.data = []

        Object.keys(this.forms.curriculas.controls).forEach((field) => {
            const control = this.forms.curriculas.get(field)
            control?.markAsTouched() // Marca como tocado (touched)
            control?.markAsDirty() // Marca como modificado (dirty)
        })

        this.dialogs.curriculas.expand.cursos = true

        this.cursosService
            .getCursos(this.forms.curriculas.value.iCurrId)
            .subscribe({
                next: (res: any) => {
                    console.log(res)
                    this.cursos.table.data = res.data
                },
                error: (err) => {
                    console.log(err)
                },
                complete: () => {},
            })

        this.cursos.table.data
    }

    saveCurriculas() {
        this.curriculas.save().subscribe({
            next: (res: any) => {
                console.log(res)
                this.dialogs.curriculas.visible = false
                this.obtenerDatosIniciales()
            },
            error: (err) => {
                console.error(err)
            },
            complete: () => {},
        })
    }

    saveCursos() {
        this.cursos.save().subscribe({
            next: (res: any) => {
                console.log(res)
                this.dialogs.cursos.visible = false

                console.log(this.forms.cursos.value)

                this.obtenerDatosIniciales()
            },
            error: (err) => {
                console.error(err)
            },
            complete: () => {},
        })
    }

    // saveInformation() {

    //     of(null)
    //         .pipe(
    //             concatMap(() => {
    //                 // Insertar datos
    //                 return this.curriculas.save()
    //             }),
    //             concatMap((value: any) => {
    //                 const curricula = value.data[0]

    //                 if (!this.forms.cursos.value.iCursoId) {
    //                     return this.cursosService.insCursos({
    //                         iCurrid: curricula.id,
    //                         iTipoCursoId: this.forms.cursos.value.iTipoCursoId,
    //                         cCursoNombre: this.forms.cursos.value.cCursoNombre,
    //                         nCursoCredTeoria:
    //                             this.forms.cursos.value.nCursoCredTeoria,
    //                         nCursoCredPractica:
    //                             this.forms.cursos.value.nCursoCredPractica,
    //                         cCursoDescripcion:
    //                             this.forms.cursos.value.cCursoDescripcion,
    //                         nCursoTotalCreditos:
    //                             this.forms.cursos.value.nCursoTotalCreditos,
    //                         cCursoPerfilDocente:
    //                             this.forms.cursos.value.cCursoPerfilDocente,
    //                         iCursoTotalHoras:
    //                             this.forms.cursos.value.iCursoTotalHoras,
    //                     })
    //                 } else {
    //                     return this.cursosService.insCursos({
    //                         iCurrid: curricula.id,
    //                         iTipoCursoId: this.forms.cursos.value.iTipoCursoId,
    //                         cCursoNombre: this.forms.cursos.value.cCursoNombre,
    //                         nCursoCredTeoria:
    //                             this.forms.cursos.value.nCursoCredTeoria,
    //                         nCursoCredPractica:
    //                             this.forms.cursos.value.nCursoCredPractica,
    //                         cCursoDescripcion:
    //                             this.forms.cursos.value.cCursoDescripcion,
    //                         nCursoTotalCreditos:
    //                             this.forms.cursos.value.nCursoTotalCreditos,
    //                         cCursoPerfilDocente:
    //                             this.forms.cursos.value.cCursoPerfilDocente,
    //                         iCursoTotalHoras:
    //                             this.forms.cursos.value.iCursoTotalHoras,
    //                     })
    //                 }
    //             })
    //         )
    //         .subscribe({
    //             next: (res) => console.log('Resultado final:', res),
    //             error: (err) => {
    //                 console.error('Error al inscribir el curso:', err);
    //             },
    //             complete: () => {
    //                 this.dialogVisible.curricula = false
    //                 this.dialogVisible.cursos = false
    //             },
    //         })
    // }
}
