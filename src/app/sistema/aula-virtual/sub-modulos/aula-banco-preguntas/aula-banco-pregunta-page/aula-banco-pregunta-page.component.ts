import { PrimengModule } from '@/app/primeng.module'
import { Component, inject, ViewChild, OnInit } from '@angular/core'
import { AulaBancoPreguntasComponent } from '../aula-banco-preguntas/aula-banco-preguntas.component'
import { CommonModule } from '@angular/common'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { Subject, takeUntil } from 'rxjs'
import { GeneralService } from '@/app/servicios/general.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { ToolbarPrimengComponent } from '../../../../../shared/toolbar-primeng/toolbar-primeng.component'
import { AulaBancoPreguntasService } from '../aula-banco-preguntas/aula-banco-.preguntas.service'
import { MenuItem, MessageService } from 'primeng/api'
import { BancoPreguntasFormComponent } from '../banco-preguntas-form/banco-preguntas-form.component'
import { BancoPreguntasService } from '@/app/servicios/eval/banco-preguntas.service'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { removeHTML } from '@/app/shared/utils/remove-html'
import { EncabezadoPreguntasService } from '@/app/servicios/eval/encabezado-preguntas.service'
import { BancoEncabezadoFormComponent } from '../banco-encabezado-form/banco-encabezado-form.component'

@Component({
    selector: 'app-aula-banco-pregunta-page',
    standalone: true,
    imports: [
        PrimengModule,
        CommonModule,
        AulaBancoPreguntasComponent,
        ToolbarPrimengComponent,
        BancoPreguntasFormComponent,
        BancoEncabezadoFormComponent,
    ],
    templateUrl: './aula-banco-pregunta-page.component.html',
    styleUrl: './aula-banco-pregunta-page.component.scss',
    providers: [AulaBancoPreguntasService],
})
export class AulaBancoPreguntaPageComponent implements OnInit {
    @ViewChild(AulaBancoPreguntasComponent)
    bancoPreguntasComponent!: AulaBancoPreguntasComponent

    public cursos = []

    grados = []

    params = {
        iCursoId: 0,
        iDocenteId: null,
        iCurrContId: null,
        iNivelCicloId: null,
        iYearId: 0, // Nuevo parámetro para el año
        iSeccionId: 0, // Nuevo parámetro para la sección
        busqueda: '',
        iTipoPregId: 0,
        iEvaluacionId: 0,
        iGradoId: 0,
    }

    private _constantesService = inject(ConstantesService)
    private unsubscribe$ = new Subject<boolean>()
    private _generalService = inject(GeneralService)
    private _store = inject(LocalStoreService)
    private _BancoPreguntasService = inject(BancoPreguntasService)
    private _MessageService = inject(MessageService)
    private _ConfirmationModalService = inject(ConfirmationModalService)
    private _EncabezadoPreguntasService = inject(EncabezadoPreguntasService)
    menuAgregacionPreguntas: any
    filtros: any

    showModalPreguntas: boolean = false
    showModalEncabezado: boolean = false
    showModalBancoPreguntas: boolean = false
    tiposAgregarPregunta: MenuItem[] = [
        {
            label: 'Pregunta',
            icon: 'pi pi-plus',
            command: () => {
                this.itemCurso = this.cursos.filter(
                    (curso) => curso.iCursoId === this.params.iCursoId
                )[0]
                this.itemCurso.idEncabPregId = null
                this.itemCurso.cEncabPregTitulo = null
                this.showModalPreguntas = true
            },
        },
        {
            label: 'Pregunta Múltiple',
            icon: 'pi pi-plus',
            command: () => {
                this.itemCurso = this.cursos.filter(
                    (curso) => curso.iCursoId === this.params.iCursoId
                )[0]
                this.showModalEncabezado = true
            },
        },
    ]
    itemData: any
    itemCurso: any
    accionBtnItem(elemento) {
        this.showModalPreguntas = false
        const { accion, item } = elemento
        switch (accion) {
            case 'close-modal':
                this.showModalPreguntas = false
                break
            case 'editar':
                this.showModalPreguntas = true
                this.itemData = item
                break
            case 'eliminar':
                if (!item) return
                const { idEncabPregId, iBancoId } = item
                const title = idEncabPregId
                    ? 'pregunta múltiple: ' + item.cEncabPregTitulo
                    : 'pregunta: ' + removeHTML(item.cBancoPregunta)
                this._ConfirmationModalService.openConfirm({
                    header: '¿Eliminar ' + title + '?',
                    accept: () => {
                        idEncabPregId
                            ? this.eliminarEncabezadoPreguntas(idEncabPregId)
                            : iBancoId && this.eliminarBancoPreguntas(iBancoId)
                    },
                    reject: () => {
                        this.mostrarMensajeToast({
                            severity: 'error',
                            summary: 'Cancelado',
                            detail: 'Acción cancelada',
                        })
                    },
                })
                break
            case 'editar-multiple':
                this.showModalEncabezado = true
                this.itemData = item
                break
            case 'eliminar-multiple':
                if (!item) return
                this._ConfirmationModalService.openConfirm({
                    header: '¿Eliminar ' + item.cEncabPregTitulo + '?',
                    accept: () => {
                        this.eliminarEncabezadoPreguntas(item.idEncabPregId)
                    },
                    reject: () => {
                        this.mostrarMensajeToast({
                            severity: 'error',
                            summary: 'Cancelado',
                            detail: 'Acción cancelada',
                        })
                    },
                })
                break
            case 'agregar-pregunta-multiple':
                if (this.params.iCursoId === 0) {
                    this.mostrarMensajeToast({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Seleccione un curso',
                    })
                    return
                }
                this.itemCurso = this.cursos.filter(
                    (curso) => curso.iCursoId === this.params.iCursoId
                )[0]
                this.itemCurso.idEncabPregId = item.idEncabPregId
                this.itemCurso.cEncabPregTitulo = item.cEncabPregTitulo
                this.showModalPreguntas = true
                break
        }
    }

    accionBtnItemEncabezado(elemento) {
        this.showModalEncabezado = false
        const { accion, item } = elemento
        switch (accion) {
            case 'close-modal':
                this.showModalEncabezado = false
                this.obtenerBancoPreguntas()
                break
            case 'editar':
                this.showModalEncabezado = true
                this.itemData = item
                break
            case 'eliminar':
                if (!item) return
                const { idEncabPregId, iBancoId } = item
                const title = idEncabPregId
                    ? 'pregunta múltiple: ' + item.cEncabPregTitulo
                    : 'pregunta: ' + removeHTML(item.cBancoPregunta)
                this._ConfirmationModalService.openConfirm({
                    header: '¿Eliminar ' + title + '?',
                    accept: () => {
                        idEncabPregId
                            ? this.eliminarEncabezadoPreguntas(idEncabPregId)
                            : iBancoId && this.eliminarBancoPreguntas(iBancoId)
                    },
                    reject: () => {
                        this.mostrarMensajeToast({
                            severity: 'error',
                            summary: 'Cancelado',
                            detail: 'Acción cancelada',
                        })
                    },
                })
                break
        }
    }

    ngOnInit() {
        this.getCursosDocente()
        this.obtenerGrados()
    }

    obtenerBancoPreguntas() {
        this.bancoPreguntasComponent.obtenerBancoPreguntas()
    }

    getCursosDocente() {
        const params = {
            petition: 'post',
            group: 'acad',
            prefix: 'docente',
            ruta: 'docente_curso',
            data: {
                opcion: 2,
                iDocenteId: this._constantesService.iDocenteId,
                iYAcadId: this._constantesService.iYAcadId,
                iSedeId: this._constantesService.iSedeId,
                iIieeId: this._constantesService.iIieeId,
            },
            params: { skipSuccessMessage: true },
        }
        this.obtenerCursos(params)
    }

    obtenerGrados() {
        const params = {
            petition: 'post',
            group: 'acad',
            prefix: 'grados',
            ruta: 'handleCrudOperation', //'getDocentesCursos',
            data: {
                opcion: 'CONSULTAR',
                iCredId: this._constantesService.iCredId,
            },
        }
        this._generalService.getGralPrefix(params).subscribe({
            next: (response) => {
                this.grados = [
                    {
                        iGradoId: 0,
                        cGrado: 'Todos',
                    },
                    ...response.data,
                ]
            },
            complete: () => {},
            error: (error) => {
                console.log(error)
            },
        })
    }
    obtenerCursos(params) {
        this._generalService
            .getGralPrefix(params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (response) => {
                    this.cursos = response.data.map((curso) => ({
                        iCursoId: curso.idDocCursoId,
                        ...curso,
                    }))
                    this.cursos.unshift({
                        iCursoId: 0,
                        cCursoNombre: 'Todos',
                    })
                },
                complete: () => {},
                error: (error) => {
                    console.log(error)
                },
            })
    }

    private _aulaBancoPreguntasService = inject(AulaBancoPreguntasService)
    agregarPreguntas() {
        this.agregarEditarPregunta({
            iPreguntaId: 0,
            preguntas: [],
            iEncabPregId: -1,
        })
    }
    agregarEditarPregunta(pregunta) {
        const refModal = this._aulaBancoPreguntasService.openPreguntaModal({
            pregunta,
            iCursoId: this.params.iCursoId,
            tipoPreguntas: [],
            iEvaluacionId: null,
            padreComponente: 'AULA-VIRTUAL',
        })
        refModal.onClose.subscribe((result) => {
            if (result) {
                // const pregunta = this.mapLocalPregunta(result)
                // this.preguntas.push(pregunta)
                // this.preguntasSeleccionadasChange.emit(this.preguntas)
            }
        })
    }
    public years = [
        { iYearId: 0, cYearNombre: 'Todos' },
        { iYearId: 2023, cYearNombre: '2023' },
        { iYearId: 2024, cYearNombre: '2024' },
    ]

    public secciones = [
        { iSeccionId: 0, cSeccionNombre: 'Todas' },
        { iSeccionId: 1, cSeccionNombre: 'A' },
        { iSeccionId: 2, cSeccionNombre: 'B' },
        { iSeccionId: 3, cSeccionNombre: 'C' },
    ]

    eliminarBancoPreguntas(iBancoId) {
        const params = {
            iCredId: this._constantesService.iCredId,
        }
        this._BancoPreguntasService
            .eliminarBancoPreguntasxiBancoId(iBancoId, params)
            .subscribe({
                next: (resp) => {
                    if (resp.validated) {
                        this.mostrarMensajeToast({
                            severity: 'success',
                            summary: 'Genial!',
                            detail: resp.message,
                        })
                        this.obtenerBancoPreguntas()
                    }
                },
                error: (error) => {
                    const errores = error?.error?.errors
                    if (error.status === 422 && errores) {
                        // Recorre y muestra cada mensaje de error
                        Object.keys(errores).forEach((campo) => {
                            errores[campo].forEach((mensaje: string) => {
                                this.mostrarMensajeToast({
                                    severity: 'error',
                                    summary: 'Error de validación',
                                    detail: mensaje,
                                })
                            })
                        })
                    } else {
                        this.mostrarMensajeToast({
                            severity: 'error',
                            summary: 'Error',
                            detail:
                                error?.error?.message ||
                                'Ocurrió un error inesperado',
                        })
                    }
                },
            })
    }

    mostrarMensajeToast(message) {
        this._MessageService.add(message)
    }

    eliminarEncabezadoPreguntas(idEncabPregId) {
        const params = {
            iCredId: this._constantesService.iCredId,
        }
        this._EncabezadoPreguntasService
            .eliminarBancoEncabezadoPreguntasxidEncabPregId(
                idEncabPregId,
                params
            )
            .subscribe({
                next: (resp) => {
                    if (resp.validated) {
                        this.mostrarMensajeToast({
                            severity: 'success',
                            summary: 'Genial!',
                            detail: resp.message,
                        })
                        this.obtenerBancoPreguntas()
                    }
                },
                error: (error) => {
                    const errores = error?.error?.errors
                    if (error.status === 422 && errores) {
                        // Recorre y muestra cada mensaje de error
                        Object.keys(errores).forEach((campo) => {
                            errores[campo].forEach((mensaje: string) => {
                                this.mostrarMensajeToast({
                                    severity: 'error',
                                    summary: 'Error de validación',
                                    detail: mensaje,
                                })
                            })
                        })
                    } else {
                        this.mostrarMensajeToast({
                            severity: 'error',
                            summary: 'Error',
                            detail:
                                error?.error?.message ||
                                'Ocurrió un error inesperado',
                        })
                    }
                },
            })
    }
}
