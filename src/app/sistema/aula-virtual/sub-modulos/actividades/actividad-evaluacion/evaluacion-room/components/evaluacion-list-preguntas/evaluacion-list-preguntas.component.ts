import { PrimengModule } from '@/app/primeng.module'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { NgFor } from '@angular/common'
import {
    Component,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    Output,
} from '@angular/core'
import { MessageService } from 'primeng/api'
import { removeHTML } from '@/app/shared/utils/remove-html'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { EvaluacionPreguntasService } from '@/app/servicios/eval/evaluacion-preguntas.service'
import { EncabezadoPreguntasService } from '@/app/servicios/eval/encabezado-preguntas.service'

@Component({
    selector: 'app-evaluacion-list-preguntas',
    standalone: true,
    imports: [PrimengModule, NgFor],
    templateUrl: './evaluacion-list-preguntas.component.html',
    styleUrl: './evaluacion-list-preguntas.component.scss',
})
export class EvaluacionListPreguntasComponent implements OnChanges {
    @Input() preguntas = []

    @Output() accionBtn = new EventEmitter()
    @Output() accionForm = new EventEmitter()

    private _ConfirmationModalService = inject(ConfirmationModalService)
    private _MessageService = inject(MessageService)
    private _ConstantesService = inject(ConstantesService)
    private _EvaluacionPreguntasService = inject(EvaluacionPreguntasService)
    private _EncabezadoPreguntasService = inject(EncabezadoPreguntasService)

    ngOnChanges(changes) {
        if (changes.preguntas.currentValue) {
            this.preguntas = changes.preguntas.currentValue
            this.preguntas.forEach((pregunta) => {
                // Primero: parsear jsonPreguntas si viene como string
                if (typeof pregunta.jsonPreguntas === 'string') {
                    try {
                        pregunta.jsonPreguntas = JSON.parse(
                            pregunta.jsonPreguntas
                        )
                    } catch (e) {
                        console.error(
                            'Error al parsear jsonPreguntas:',
                            e,
                            pregunta.jsonPreguntas
                        )
                        pregunta.jsonPreguntas = {}
                    }
                }

                // Segundo: parsear jsonAlternativas dentro de jsonPreguntas si viene como string
                if (
                    pregunta.jsonPreguntas &&
                    typeof pregunta.jsonPreguntas.jsonAlternativas === 'string'
                ) {
                    try {
                        pregunta.jsonPreguntas.jsonAlternativas = JSON.parse(
                            pregunta.jsonPreguntas.jsonAlternativas
                        )
                    } catch (e) {
                        console.error(
                            'Error al parsear jsonAlternativas (dentro de jsonPreguntas):',
                            e,
                            pregunta.jsonPreguntas.jsonAlternativas
                        )
                        pregunta.jsonPreguntas.jsonAlternativas = []
                    }
                }
                // Tercero (opcional): parsear también el jsonAlternativas raíz, si existe como string
                if (typeof pregunta.jsonAlternativas === 'string') {
                    try {
                        pregunta.jsonAlternativas = JSON.parse(
                            pregunta.jsonAlternativas
                        )
                    } catch (e) {
                        console.error(
                            'Error al parsear jsonAlternativas (raíz):',
                            e,
                            pregunta.jsonAlternativas
                        )
                        pregunta.jsonAlternativas = []
                    }
                }
            })
        }
    }

    mostrarListaAlternativas(item: any): boolean {
        return (
            Array.isArray(item.jsonAlternativas) &&
            item.jsonAlternativas.length > 0
        )
    }

    eliminarPregunta(data: any): void {
        if (!data) return

        const { idEncabPregId, iEvalPregId } = data
        const title = idEncabPregId
            ? 'pregunta múltiple: ' + data.cEncabPregTitulo
            : 'pregunta: ' + removeHTML(data.cEvalPregPregunta)
        this._ConfirmationModalService.openConfirm({
            header: '¿Eliminar ' + title + '?',
            accept: () => {
                idEncabPregId
                    ? this.eliminarEncabezadoPreguntas(idEncabPregId)
                    : iEvalPregId &&
                      this.eliminarEvaluacionPreguntas(iEvalPregId)
            },
            reject: () => {
                this.mostrarMensajeToast({
                    severity: 'error',
                    summary: 'Cancelado',
                    detail: 'Acción cancelada',
                })
            },
        })
    }

    eliminarEncabezadoPreguntas(idEncabPregId) {
        const params = {
            iCredId: this._ConstantesService.iCredId,
        }
        this._EncabezadoPreguntasService
            .eliminarEncabezadoPreguntasxidEncabPregId(idEncabPregId, params)
            .subscribe({
                next: (resp) => {
                    if (resp.validated) {
                        this.mostrarMensajeToast({
                            severity: 'success',
                            summary: 'Genial!',
                            detail: resp.message,
                        })
                        this.accionForm.emit(true)
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

    eliminarEvaluacionPreguntas(iEvalPregId) {
        const params = {
            iCredId: this._ConstantesService.iCredId,
        }
        this._EvaluacionPreguntasService
            .eliminarEvaluacionPreguntasxiEvalPregId(iEvalPregId, params)
            .subscribe({
                next: (resp) => {
                    if (resp.validated) {
                        this.mostrarMensajeToast({
                            severity: 'success',
                            summary: 'Genial!',
                            detail: resp.message,
                        })
                        this.accionForm.emit(true)
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

    editarPregunta(data: any): void {
        if (!data) return

        const { idEncabPregId, iEvalPregId } = data
        this.accionBtn.emit({
            accion: idEncabPregId
                ? 'actualizar-pregunta-encabezado'
                : iEvalPregId && 'actualizar-pregunta',
            item: data,
        })
    }

    mostrarMensajeToast(message) {
        this._MessageService.add(message)
    }
}
