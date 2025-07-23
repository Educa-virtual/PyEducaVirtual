import { Component, inject, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { FormsModule } from '@angular/forms'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { MessageService } from 'primeng/api'
import { TimeComponent } from '@/app/shared/time/time.component'
@Component({
    selector: 'app-estudiante-encuesta',
    standalone: true,
    imports: [PrimengModule, FormsModule, TimeComponent],
    templateUrl: './estudiante-encuesta.component.html',
    styleUrl: './estudiante-encuesta.component.scss',
})
export class EstudianteEncuestaComponent implements OnInit {
    private _ConfirmationModalService = inject(ConfirmationModalService)
    private _MessageService = inject(MessageService)
    title: string = 'Censo DRE/UGEL 2024'
    subtitle: string = 'SEGUIMIENTO Y MONITORIO PEDAGÓGICO'
    activeIndex: number = 0
    tiempoActual = new Date()
    tiempoFin = new Date()
    finalizado: boolean = false
    preguntas = [
        {
            iPreguntaId: '1001',
            cPregunta: '<p>¿Cuál es el libro sagrado del cristianismo?</p>',
            title: 'Pregunta 1',
            iMarcado: 0,
            alternativas: [
                {
                    iAlternativaId: '1001',
                    cAlternativaDescripcion: 'La Biblia',
                    iMarcado: 0,
                },
                {
                    iAlternativaId: '1002',
                    cAlternativaDescripcion: 'El Corán',
                    iMarcado: 0,
                },
                {
                    iAlternativaId: '1003',
                    cAlternativaDescripcion: 'La Torá',
                    iMarcado: 0,
                },
                {
                    iAlternativaId: '1004',
                    cAlternativaDescripcion: 'El Bhagavad Gita',
                    iMarcado: 0,
                },
            ],
        },
        {
            iPreguntaId: '1002',
            cPregunta:
                '<p>¿Cuál de los siguientes es un ejemplo de valor moral?</p>',
            title: 'Pregunta 2',
            iMarcado: 0,
            alternativas: [
                {
                    iAlternativaId: '1005',
                    cAlternativaDescripcion: 'Honestidad',
                    iMarcado: 0,
                },
                {
                    iAlternativaId: '1006',
                    cAlternativaDescripcion: 'Egoísmo',
                    iMarcado: 0,
                },
                {
                    iAlternativaId: '1007',
                    cAlternativaDescripcion: 'Envidia',
                    iMarcado: 0,
                },
                {
                    iAlternativaId: '1008',
                    cAlternativaDescripcion: 'Avaricia',
                    iMarcado: 0,
                },
            ],
        },
        {
            iPreguntaId: '1003',
            cPregunta:
                '<p>¿Cuál de los siguientes es un ejemplo de valor moral?</p>',
            title: 'Pregunta 3',
            iMarcado: 0,
            alternativas: [
                {
                    iAlternativaId: '1005',
                    cAlternativaDescripcion: 'Honestidad',
                    iMarcado: 0,
                },
                {
                    iAlternativaId: '1006',
                    cAlternativaDescripcion: 'Egoísmo',
                    iMarcado: 0,
                },
                {
                    iAlternativaId: '1007',
                    cAlternativaDescripcion: 'Envidia',
                    iMarcado: 0,
                },
                {
                    iAlternativaId: '1008',
                    cAlternativaDescripcion: 'Avaricia',
                    iMarcado: 0,
                },
            ],
        },
        {
            iPreguntaId: '1004',
            cPregunta:
                '<p>¿Cuál de los siguientes es un ejemplo de valor moral?</p>',
            title: 'Pregunta 4',
            iMarcado: 0,
            alternativas: [
                {
                    iAlternativaId: '1005',
                    cAlternativaDescripcion: 'Honestidad',
                    iMarcado: 0,
                },
                {
                    iAlternativaId: '1006',
                    cAlternativaDescripcion: 'Egoísmo',
                    iMarcado: 0,
                },
                {
                    iAlternativaId: '1007',
                    cAlternativaDescripcion: 'Envidia',
                    iMarcado: 0,
                },
                {
                    iAlternativaId: '1008',
                    cAlternativaDescripcion: 'Avaricia',
                    iMarcado: 0,
                },
            ],
        },
    ]
    ngOnInit() {
        this.tiempoActual = new Date()
        this.tiempoFin = new Date(this.tiempoActual.getTime() + 30 * 60 * 1000)
    }
    anteriorPregunta() {
        if (this.activeIndex > 0) {
            this.activeIndex = this.activeIndex - 1
        }
    }

    siguientePregunta(index: number) {
        if (index <= this.preguntas.length - 1) {
            this.activeIndex = index + 1
        }
    }

    seleccionarPregunta(index: number) {
        this.activeIndex = index
    }

    guardarPregunta(alternativas: any[], alternativa: any) {
        alternativas.forEach((alt) => {
            alt.iMarcado = 0
        })

        alternativa.iMarcado = 1

        this.preguntas[this.activeIndex].iMarcado = 1
    }
    calcularPreguntasRespondidas(): number {
        return this.preguntas.filter((p) => p.iMarcado === 0).length
    }
    calcularPreguntasPendientes(): number {
        return this.preguntas.filter((p) => p.iMarcado === 0).length
    }
    finalizarEncuesta() {
        this.preguntarTerminarEncuesta()
    }
    preguntarTerminarEncuesta() {
        const cantidadPreguntasPendientes = this.calcularPreguntasPendientes()
        let mensaje = ''

        switch (cantidadPreguntasPendientes) {
            case 0:
                mensaje = 'La encuesta se dará por terminada. ¿Desea continuar?'
                break
            case 1:
                mensaje =
                    'Hay 1 pregunta pendiente de responder. ¿Desea continuar?'
                break
            default:
                mensaje = `Hay ${cantidadPreguntasPendientes} preguntas pendientes de responder. ¿Desea continuar?`
                break
        }

        this._ConfirmationModalService.openConfirm({
            header: mensaje,
            accept: () => {
                this.terminarEncuesta()
            },
            reject: () => {
                console.log('Usuario canceló la finalización')
            },
        })
    }
    terminarEncuesta() {
        this._MessageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Encuesta finalizada correctamente',
        })
    }
    timeEvent($event: any) {
        const { accion } = $event
        switch (accion) {
            case 'tiempo-finalizado':
                this.finalizado = true
                this._MessageService.add({
                    severity: 'error',
                    summary: 'Tiempo agotado',
                    detail: 'El tiempo para completar la encuesta ha terminado',
                })
                this.terminarEncuesta()
                break
            case 'tiempo-1-minuto-restante':
                this._MessageService.add({
                    severity: 'warn',
                    summary: 'Tiempo restante',
                    detail: 'Queda 1 minuto para finalizar la encuesta',
                })
                break
            default:
                break
        }
    }
}
