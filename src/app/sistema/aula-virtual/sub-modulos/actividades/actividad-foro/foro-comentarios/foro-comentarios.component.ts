import { PrimengModule } from '@/app/primeng.module'
import { RemoveHTMLPipe } from '@/app/shared/pipes/remove-html.pipe'
import { tipoActividadesKeys } from '@/app/sistema/aula-virtual/interfaces/actividad.interface'
import { ApiAulaService } from '@/app/sistema/aula-virtual/services/api-aula.service'
import { Component, inject, Input, OnInit } from '@angular/core'
import { Subject, takeUntil } from 'rxjs'
import { DOCENTE, ESTUDIANTE } from '@/app/servicios/perfilesConstantes'
import { ConstantesService } from '@/app/servicios/constantes.service'

@Component({
    selector: 'app-foro-comentarios',
    standalone: true,
    templateUrl: './foro-comentarios.component.html',
    styleUrls: ['./foro-comentarios.component.scss'],
    imports: [PrimengModule, RemoveHTMLPipe],
})
export class ForoComentariosComponent implements OnInit {
    @Input() id: number // id de foro se cambiara x string mas adelante
    @Input() ixActivadadId: string
    @Input() iActTopId: tipoActividadesKeys

    private _aulaService = inject(ApiAulaService)
    private unsbscribe$ = new Subject<boolean>()
    public DOCENTE = DOCENTE
    public ESTUDIANTE = ESTUDIANTE
    private _constantesService = inject(ConstantesService)

    items: { label?: string; icon?: string; separator?: boolean }[] = []
    respuestasForo: any
    totalComentarios: number
    iPerfilId: number
    selectedCommentIndex: number | null = null // Para rastrear el comentario seleccionado para responder

    constructor() {}

    ngOnInit() {
        this.items = [
            {
                label: 'Refresh',
                icon: 'pi pi-refresh',
            },
            {
                label: 'Search',
                icon: 'pi pi-search',
            },
            {
                separator: true,
            },
            {
                label: 'Delete',
                icon: 'pi pi-times',
            },
        ]
        this.iPerfilId = this._constantesService.iPerfilId
        console.log('id de foro', this.id, this.ixActivadadId, this.iActTopId)
        this.getRespuestaF()
    }
    // obtener datos de las respuesta de los foros
    getRespuestaF() {
        this._aulaService
            .obtenerRespuestaForo({
                iActTipoId: this.iActTopId,
                ixActivadadId: this.ixActivadadId,
            })
            .pipe(takeUntil(this.unsbscribe$))
            .subscribe({
                next: (resp: Record<string, any>) => {
                    this.respuestasForo = Object.values(resp).map(
                        (comment) => ({
                            ...comment,
                            expanded: false,
                        })
                    )
                    // this.data = resp['data']
                    this.totalComentarios = 0
                    this.respuestasForo.forEach((respuesta) => {
                        respuesta.json_respuestas_comentarios =
                            respuesta.json_respuestas_comentarios
                                ? JSON.parse(
                                      respuesta.json_respuestas_comentarios
                                  )
                                : []
                        // Sumar comentarios principales + anidados
                        this.totalComentarios +=
                            respuesta.json_respuestas_comentarios.length
                    })

                    console.log(
                        'Respuesta Comentarios de los Foros',
                        this.respuestasForo
                    )
                },
                error: (err) => {
                    console.error('Error al obtener respuestas del foro', err)
                },
            })
    }
    responderComentario(data: any) {
        this.selectedCommentIndex = data.iForoRptaId
        console.log(data)
    }
    colocarCursorAlFinal(textarea: HTMLTextAreaElement): void {
        const valor = textarea.value
        textarea.focus()
        setTimeout(() => {
            textarea.setSelectionRange(valor.length, valor.length)
        })
    }
}
