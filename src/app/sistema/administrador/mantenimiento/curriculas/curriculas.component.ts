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
import { FormBuilder, FormGroup } from '@angular/forms'
import { InputTextModule } from 'primeng/inputtext'
import { DropdownModule } from 'primeng/dropdown'
import { EditorModule } from 'primeng/editor'
import { ToggleButtonModule } from 'primeng/togglebutton'
import { CurriculasService } from './config/service/curriculas.service'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { DividerModule } from 'primeng/divider'
import { cursosColumns, cursosSave } from './config/table/cursos'
import { concatMap, of } from 'rxjs'
import { CursosService } from './config/service/cursos.service'
import { ModalidadServicioService } from './config/service/modalidadServicio.service'

@Component({
    selector: 'app-curriculas',
    standalone: true,
    imports: [
        DividerModule,
        CommonModule,
        FormsModule,
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
        save: curriculasSave,
    }

    cursos = {
        table: {
            columnsGroup: cursosColumns.inTableColumnsGroup,
            columns: cursosColumns.inTableColumns,
            data: [],
        },
        save: cursosSave,
    }

    dialogVisible = {
        curricula: false,
        cursos: false,
        tipoCurso: false,
    }
    curriculasActions: IActionTable[] = [editar]
    messages: Message[] | undefined
    sidebarVisible: boolean = false

    curriculasForm: FormGroup

    modal

    modalidadesDropdownOptions

    constructor(
        private fb: FormBuilder,
        private curriculasService: CurriculasService,
        private cursosService: CursosService,
        private modalidadServiciosService: ModalidadServicioService
    ) {
        this.curriculasForm = this.fb.group({
            iModalServId: [''],
            iCurrNotaMinima: [''],
            iCurrTotalCreditos: [''],
            iCurrNroHoras: [''],
            cCurrPerfilEgresado: [''],
            cCurrMencion: [''],
            nCurrPesoProcedimiento: [''],
            cCurrPesoConceptual: [''],
            cCurrPesoActitudinal: [''],
            bCurrEsLaVigente: [''],
            cCurrRsl: [''],
            dtCurrRsl: [''],
            cCurrDescripcion: [''],
        })
    }

    ngOnInit() {
        this.messages = [{ severity: 'info', detail: 'Videos de Seguridad' }]

        this.modalidadServiciosService.getModalidadServicios().subscribe({
            next(value: any) {
                console.log(value.data)
                this.modalidadesDropdownOptions = value.data.map((item) => ({
                    name: item.cModalServNombre,
                    code: item.iModalServId,
                }))

                console.log(this.modalidadesDropdownOptions)
            },
            error(err) {
                console.error(err)
            },
            complete() {
                console.log('complete')
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
                console.log(this.modalidadesDropdownOptions)
            },
        })
    }

    showCursos() {
        this.dialogVisible.cursos = true
    }

    saveInformation() {
        this.dialogVisible.curricula = false
        this.dialogVisible.cursos = false

        console.log(this.curriculasForm.value)

        of(null).pipe(
            concatMap(() => {
                return this.curriculasService.insCurriculas({
                    iModalServId: this.curriculasForm.value.iModalServId,
                    iCurrNotaMinima: this.curriculasForm.value.iCurrNotaMinima,
                    iCurrTotalCreditos:
                        this.curriculasForm.value.iCurrTotalCreditos,
                    iCurrNroHoras: this.curriculasForm.value.iCurrNroHoras,
                    cCurrPerfilEgresado:
                        this.curriculasForm.value.cCurrPerfilEgresado,
                    cCurrMencion: this.curriculasForm.value.cCurrMencion,
                    nCurrPesoProcedimiento:
                        this.curriculasForm.value.nCurrPesoProcedimiento,
                    cCurrPesoConceptual:
                        this.curriculasForm.value.cCurrPesoConceptual,
                    cCurrPesoActitudinal:
                        this.curriculasForm.value.cCurrPesoActitudinal,
                    bCurrEsLaVigente:
                        this.curriculasForm.value.bCurrEsLaVigente,
                    cCurrRsl: this.curriculasForm.value.cCurrRsl,
                    dtCurrRsl: this.curriculasForm.value.dtCurrRsl,
                    cCurrDescripcio: this.curriculasForm.value.cCurrDescripcio,
                })
            }),
            concatMap((curricula: any) => {
                return this.cursosService.insCursos({
                    iCurrid: curricula.iCurrid,
                })
            })
        )
    }
}
