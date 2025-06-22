import { PrimengModule } from '@/app/primeng.module'
import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component'
import { Component, inject, Input, OnChanges } from '@angular/core'
import { MenuItem, MessageService } from 'primeng/api'
import { NoDataComponent } from '@/app/shared/no-data/no-data.component'
import { PreguntasFormComponent } from '../evaluacion-form/preguntas-form/preguntas-form.component'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { EvaluacionPreguntasService } from '@/app/servicios/eval/evaluacion-preguntas.service'
import { EvaluacionListPreguntasComponent } from '../evaluacion-room/components/evaluacion-list-preguntas/evaluacion-list-preguntas.component'
import { ApiEvaluacionesRService } from '@/app/sistema/evaluaciones/services/api-evaluaciones-r.service'
import { FormEncabezadoComponent } from '../evaluacion-room/components/form-encabezado/form-encabezado.component'
export interface IEvaluacion {
    cTitle: string
    cHeader: string
    iEstado?: number
    iEvaluacionId?: string | number
    iNivelCicloId?: string | number
    iCursoId?: string | number

    idEncabPregId?: string | number
    cEncabPregTitulo?: string

    cFormulario: any
}
@Component({
    selector: 'app-evaluacion-preguntas',
    standalone: true,
    imports: [
        ToolbarPrimengComponent,
        PrimengModule,
        NoDataComponent,
        PreguntasFormComponent,
        EvaluacionListPreguntasComponent,
        FormEncabezadoComponent,
    ],
    templateUrl: './evaluacion-preguntas.component.html',
    styleUrl: './evaluacion-preguntas.component.scss',
})
export class EvaluacionPreguntasComponent implements OnChanges {
    @Input() data: IEvaluacion

    private _ConstantesService = inject(ConstantesService)
    private _EvaluacionPreguntasService = inject(EvaluacionPreguntasService)
    private _MessageService = inject(MessageService)
    private _ApiEvaluacionesRService = inject(ApiEvaluacionesRService)

    showModalPreguntas: boolean = false
    showModalEncabezado: boolean = false

    preguntas: any = []
    tiposAgregarPregunta: MenuItem[] = [
        {
            label: 'Pregunta',
            icon: 'pi pi-plus',
            command: () => {
                this.accionBtn({ accion: 'agregar-pregunta', item: [] })
            },
        },
        {
            label: 'Pregunta Múltiple',
            icon: 'pi pi-plus',
            command: () => {
                this.showModalEncabezado = true
                this.showModalPreguntas = false
            },
        },
        {
            label: 'Agregar del banco de preguntas',
            icon: 'pi pi-plus',
            command: () => {
                // this.showModalBancoPreguntas = true
            },
        },
    ]

    accionForm(evento: boolean) {
        if (evento) {
            this.obtenerEvaluacionPreguntas(this.data.iEvaluacionId)
        }
        this.showModalPreguntas = !evento
        this.showModalEncabezado = !evento
        this.data.cFormulario = null
    }

    accionBtn(elemento: any) {
        const { accion, item } = elemento

        switch (accion) {
            case 'agregar-pregunta-encabezado':
                this.data.idEncabPregId = item.idEncabPregId
                this.data.cEncabPregTitulo = item.cEncabPregTitulo
                this.data.cFormulario = null
                this.showModalPreguntas = true
                this.showModalEncabezado = false
                break
            case 'agregar-pregunta':
                this.data.idEncabPregId = null
                this.data.cEncabPregTitulo = null
                this.data.cFormulario = null
                this.showModalPreguntas = true
                this.showModalEncabezado = false
                break
            case 'actualizar-pregunta-encabezado':
                this.data.cFormulario = item
                this.showModalPreguntas = false
                this.showModalEncabezado = true
                break
            case 'actualizar-pregunta':
                this.data.cFormulario = item
                this.showModalPreguntas = true
                this.showModalEncabezado = false
                break
        }
    }

    ngOnChanges(changes) {
        if (changes.data.currentValue) {
            this.data = changes.data.currentValue
            this.obtenerEvaluacionPreguntas(this.data.iEvaluacionId)
        }
    }

    obtenerEvaluacionPreguntas(iEvaluacionId) {
        if (!iEvaluacionId) return
        const params = {
            iCredId: this._ConstantesService.iCredId,
        }
        this._EvaluacionPreguntasService
            .obtenerEvaluacionPreguntasxiEvaluacionId(iEvaluacionId, params)
            .subscribe({
                next: (resp) => {
                    if (resp.validated) {
                        this.preguntas = resp.data
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
                        // Error genérico si no hay errores específicos
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

    generarWordEvaluacion() {
        const ids = this.preguntas.map((item) => item.iBancoId).join(',')

        const params = {
            iCursoId: this.data?.iCursoId,
            ids,
            iDocenteId: this._ConstantesService.iDocenteId,
        }
        this._ApiEvaluacionesRService.generarWordEvaluacionByIds(params)
    }

    mostrarMensajeToast(message) {
        this._MessageService.add(message)
    }
}
