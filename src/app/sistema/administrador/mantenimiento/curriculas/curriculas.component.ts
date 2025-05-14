import { Component, OnInit } from '@angular/core'
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
    accionBtnContainer,
    curriculasAccionBtnTable,
    curriculasColumns,
    curriculasContainerActions,
    editar,
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
import { cursosColumns, cursosSave } from './config/table/cursos'
import { Observable } from 'rxjs'
import { CursosService } from './config/service/cursos.service'
import { ModalidadServicioService } from './config/service/modalidadServicio.service'
import { FormConfig } from './config/types/forms'
import { InputNumberModule } from 'primeng/inputnumber'

@Component({
    selector: 'app-curriculas',
    standalone: true,
    imports: [
        DividerModule,
        CommonModule,
        FormsModule,
        InputNumberModule,
        ReactiveFormsModule,
        CardModule,
        ButtonModule,
        MessagesModule,
        AccordionModule,
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
    curriculas = {
        container: {
            actions: curriculasContainerActions,
            accionBtnItem: accionBtnContainer.bind(this),
        },
        table: {
            columns: curriculasColumns,
            data: [],
            actions: [editar],
            accionBtnItem: curriculasAccionBtnTable.bind(this),
        },
        save: (): Observable<object> => curriculasSave.call(this),
    }

    cursos = {
        table: {
            columnsGroup: cursosColumns.inTableColumnsGroup,
            columns: cursosColumns.inTableColumns,
            actions: [editar],
            data: [],
        },
        save: (): Observable<object> => cursosSave.call(this),
    }

    dialogVisible = {
        curricula: false,
        cursos: false,
        tipoCurso: false,
    }
    curriculasActions: IActionTable[] = [editar]
    messages: Message[] | undefined
    sidebarVisible: boolean = false

    forms: FormConfig = {
        curriculas: this.fb.group({}),
        cursos: this.fb.group({}),
        tipoCurso: this.fb.group({}),
    }
    modal

    modalidadesDropdownOptions

    constructor(
        private fb: FormBuilder,
        public curriculasService: CurriculasService,
        public cursosService: CursosService,
        public modalidadServiciosService: ModalidadServicioService
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
        })

        console.log(this.forms)

        this.forms.curriculas.get('iModalServId').dirty
    }

    ngOnInit() {
        this.messages = [{ severity: 'info', detail: 'Videos de Seguridad' }]

        this.obtenerDatosIniciales()
    }

    obtenerDatosIniciales() {
        this.modalidadServiciosService.getModalidadServicios().subscribe({
            next: (value: any) => {
                this.modalidadesDropdownOptions = value.data.map((item) => ({
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
                console.log(this.modalidadesDropdownOptions)
            },
        })
    }

    showCursos() {
        // this.forms.curriculas.markAllAsTouched()
        // this.forms.curriculas.updateValueAndValidity()

        Object.keys(this.forms.curriculas.controls).forEach((field) => {
            const control = this.forms.curriculas.get(field)
            control?.markAsTouched() // Marca como tocado (touched)
            control?.markAsDirty() // Marca como modificado (dirty)
        })

        if (this.forms.curriculas.invalid) {
            return
        }

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

        this.dialogVisible.cursos = true
    }

    saveCurriculas() {
        this.curriculas.save().subscribe({
            next: (res: any) => {
                console.log(res)
                this.dialogVisible.curricula = false
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
                this.dialogVisible.curricula = false
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
