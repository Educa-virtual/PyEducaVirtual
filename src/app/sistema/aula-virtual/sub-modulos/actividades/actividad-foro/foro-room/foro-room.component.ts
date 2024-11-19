import { Component, inject, OnInit, Input } from '@angular/core'
import { IconComponent } from '@/app/shared/icon/icon.component'
//import { LeyendaComponent } from '@/app/shared/components/leyenda/leyenda.component'
import {
    matAccessTime,
    matCalendarMonth,
    matHideSource,
    matListAlt,
    matMessage,
    matRule,
    matStar,
} from '@ng-icons/material-icons/baseline'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import {
    TablePrimengComponent,
    IActionTable,
    IColumn,
} from '@/app/shared/table-primeng/table-primeng.component'
import { provideIcons } from '@ng-icons/core'
import { TabViewModule } from 'primeng/tabview'
import { OrderListModule } from 'primeng/orderlist'
import { PrimengModule } from '@/app/primeng.module'
import { GeneralService } from '@/app/servicios/general.service'
import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component'
import { ApiAulaService } from '@/app/sistema/aula-virtual/services/api-aula.service'
import { tipoActividadesKeys } from '@/app/sistema/aula-virtual/interfaces/actividad.interface'
import { Subject, takeUntil } from 'rxjs'
import { RemoveHTMLPipe } from '@/app/shared/pipes/remove-html.pipe'
import { NgFor, NgIf } from '@angular/common'
import { RecursosListaComponent } from '@/app/shared/components/recursos-lista/recursos-lista.component'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { EmptySectionComponent } from '@/app/shared/components/empty-section/empty-section.component'
import { Message } from 'primeng/api'
import { WebsocketService } from '@/app/sistema/aula-virtual/services/websoket.service'
@Component({
    selector: 'app-foro-room',
    standalone: true,
    templateUrl: './foro-room.component.html',
    styleUrls: ['./foro-room.component.scss'],
    imports: [
        IconComponent,
        EmptySectionComponent,
        RecursosListaComponent,
        RemoveHTMLPipe,
        CommonInputComponent,
        TablePrimengComponent,
        TabViewModule,
        OrderListModule,
        PrimengModule,
        NgFor,
        NgIf,
    ],
    providers: [
        provideIcons({
            matHideSource,
            matCalendarMonth,
            matMessage,
            matStar,
            matRule,
            matListAlt,
            matAccessTime,
        }),
    ],
})
export class ForoRoomComponent implements OnInit {
    @Input() ixActivadadId: string
    @Input() iActTopId: tipoActividadesKeys

    private GeneralService = inject(GeneralService)
    private _formBuilder = inject(FormBuilder)
    private _aulaService = inject(ApiAulaService)
    // private ref = inject(DynamicDialogRef)
    private _constantesService = inject(ConstantesService)
    //private ref = inject(DynamicDialogRef)
    // variables
    showEditor = false // variable          para ocultar el p-editor
    public data = []
    FilesTareas = []
    estudiantes: any[] = []
    calificacion: any[] = []
    respuestasForo: any[] = []
    comentarios: any[] = []
    descripcion: Message[] = []
    messages: Message[] | undefined
    messageWeb: string = ''
    messageWebs: string[] = []
    modalCalificacion: boolean = false
    estudianteSelect = null
    private unsbscribe$ = new Subject<boolean>()

    public foro
    iPerfilId: number
    iEstudianteId: number
    iDocenteId: number
    expanded: false

    commentForoM: string = ''
    selectedCommentIndex: number | null = null // Para rastrear el comentario seleccionado para responder
    selectedComentario: number | null = null
    respuestaInput: string = '' // Para almacenar la respuesta temporal

    public foroForm: FormGroup = this._formBuilder.group({
        cForoTitulo: ['', [Validators.required]],
        cForoDescripcion: ['', [Validators.required]],
        iForoCatId: [0, [Validators.required]],
        dtForoInicio: [''],
        iEstado: [0, Validators.required],
        dtForoPublicacion: ['dtForoInicio'],
        dtForoFin: [],
    })
    public foroFormComnt: FormGroup = this._formBuilder.group({
        iEscalaCalifId: [],
        iForoRptaId: [],
        cForoRptaDocente: ['', [Validators.required]],
        nForoRptaNota: [],
        cForoDescripcion: [],
    })
    public foroFormComntAl: FormGroup = this._formBuilder.group({
        cForoRptaRespuesta: ['', [Validators.required]],
        cForoRptaPadre: [''],
        iEstudianteId: [],
        iForoId: [''],
        iDocenteId: [''],
        iForoRptaId: [''],
    })
    constructor(private websocketService: WebsocketService) {}

    selectedItems = []
    columnas: IColumn[] = [
        {
            field: 'id',
            header: '#',
            text: 'actividad',
            text_header: 'left',
            width: '3rem',
            type: 'text',
        },
        {
            field: 'cNombreEstudiante',
            header: 'Estudiantes',
            text: 'actividad',
            text_header: 'left',
            width: '5rem',
            type: 'text',
        },

        {
            field: 'cForoRptaRespuesta',
            header: 'Respuesta',
            text: 'Estado',
            text_header: 'left',
            width: '5rem',
            type: 'text',
        },
        {
            field: 'cNombreEstudiante',
            header: 'Calificación',
            text: 'actividad',
            text_header: 'left',
            width: '5rem',
            type: 'text',
        },

        {
            field: 'cForoRptaRespuesta',
            header: 'Descripción',
            text: 'Estado',
            text_header: 'left',
            width: '5rem',
            type: 'text',
        },
        {
            field: '',
            header: 'Acciones',
            type: 'actions',
            width: '5rem',
            text: 'left',
            text_header: '',
        },
    ]
    public accionesTabla: IActionTable[] = [
        {
            labelTooltip: 'Calificar',
            icon: 'pi pi-eye',
            accion: 'ver',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
        {
            labelTooltip: 'Eliminar',
            icon: 'pi pi-trash',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
    ]
    ngOnInit(): void {
        // this.websocketService.messages$.subscribe((msg: any) => {
        //     this.messageWebs.push(`Servidor: ${msg}`)
        // })
        // this.websocketService.messages$.subscribe((message: any) => {
        //     // Agregar el mensaje recibido a la lista de comentarios
        //     this.comments.push(message);  // Asume que tienes una lista `comments`
        // });
        this.obtenerIdPerfil()
        this.mostrarCalificacion()
        this.obtenerForo()
        this.getRespuestaF()
        this.getEstudiantesMatricula()
    }
    // closeModal(data) {
    //     this.ref.close(data)
    // }

    accionBtnItemTable({ accion, item }) {
        if (accion === 'asignar') {
            this.selectedItems = []
            this.selectedItems = [item]
        }
        // if (accion === 'editar') {
        // }
        // if (accion === 'ver') {
        // }
    }
    //ver si mi perfil esta llegando (borrar)
    obtenerIdPerfil() {
        this.iEstudianteId = this._constantesService.iEstudianteId
        this.iPerfilId = this._constantesService.iPerfilId
        this.iDocenteId = this._constantesService.iDocenteId
        console.log('mi id perfil', this.iPerfilId)
    }
    openModal(respuestasForo) {
        this.modalCalificacion = true
        this.estudianteSelect = respuestasForo
        this.foroFormComnt.patchValue(respuestasForo)
    }
    toggleEditor() {
        this.showEditor = true
    }
    closeEditor() {
        this.showEditor = false
    }
    submit() {
        const value = this.foroFormComnt.value
        console.log('Guardar Calificacion', value)
        this._aulaService.calificarForoDocente(value).subscribe((resp: any) => {
            if (resp?.validated) {
                this.modalCalificacion = false
                this.getRespuestaF()
            }
        })
    }
    startReply(index: number) {
        this.selectedCommentIndex = index // Guarda el índice del comentario seleccionado
        console.log('Comentario', this.selectedCommentIndex)
    }
    cancelarEdicion() {
        this.selectedCommentIndex = null // Desactiva el editor al hacer clic en "Cancelar"
    }
    sendCommentPadre(respuestas) {
        // guardar el comentario
        const iDocenteId = this._constantesService.iDocenteId
        this.iEstudianteId = this._constantesService.iEstudianteId
        this.foroFormComntAl.controls['iDocenteId'].setValue(iDocenteId)
        this.foroFormComntAl.controls['iEstudianteId'].setValue(
            this.iEstudianteId
        )
        this.foroFormComntAl.controls['iForoRptaId'].setValue(
            respuestas.iForoRptaId
        )
        //console.log('rptaPadre', this.foroFormComntAl)
        this._aulaService
            .guardarComentarioRespuesta(this.foroFormComntAl.value)
            .subscribe({
                next: (resp: any) => {
                    // para refrescar la pagina
                    if (resp?.validated) {
                        this.getRespuestaF()
                        this.foroFormComntAl.get('cForoRptaPadre')?.reset()
                    }
                },
                error: (error) => {
                    console.error('Comentario:', error)
                },
            })
    }

    sendComment() {
        const perfil = (this.iPerfilId = this._constantesService.iPerfilId)
        if (perfil == 8) {
            this.iEstudianteId = this._constantesService.iEstudianteId
            const comment = {
                ...this.foroFormComntAl.value,
                iForoId: this.ixActivadadId,
                iEstudianteId: this.iEstudianteId,
            }
            console.log('comentarios: ', comment)
            this._aulaService.guardarRespuesta(comment).subscribe({
                next: (resp: any) => {
                    console.log('respuesta completa', resp)
                    // para refrescar la pagina
                    if (resp?.validated) {
                        this.getRespuestaF()
                        this.foroFormComntAl.get('cForoRptaRespuesta')?.reset()
                        // Enviar comentario a través de WebSocket
                        this.websocketService.sendMessage({
                            type: 'newComment',
                            data: comment?.cForoRptaRespuesta,
                        })
                        console.log('que envias', comment?.cForoRptaRespuesta)
                    }
                },
                error: (error) => {
                    console.error('Comentario:', error)
                },
            })
        } else {
            this.iDocenteId = this._constantesService.iDocenteId
            const comment = {
                ...this.foroFormComntAl.value,
                iForoId: this.ixActivadadId,
                iDocenteId: this.iDocenteId,
            }
            this._aulaService.guardarRespuesta(comment).subscribe({
                next: (resp: any) => {
                    // para refrescar la pagina
                    if (resp?.validated) {
                        this.getRespuestaF()
                        this.foroFormComntAl.get('cForoRptaRespuesta')?.reset()
                        // Enviar comentario a través de WebSocket
                        this.websocketService.sendMessage({
                            type: 'newComment',
                            data: comment?.cForoRptaRespuesta,
                        })
                    }
                },
                error: (error) => {
                    console.error('Comentario:', error)
                },
            })
        }
    }
    mostrarCalificacion() {
        const userId = 1
        this._aulaService.obtenerCalificacion(userId).subscribe((Data) => {
            this.calificacion = Data['data']
            //console.log('Mostrar escala',this.calificacion)
        })
    }
    foroRespaldo = []
    obtenerForo() {
        this._aulaService
            .obtenerForo({
                iActTipoId: this.iActTopId,
                ixActivadadId: this.ixActivadadId,
            })
            .pipe(takeUntil(this.unsbscribe$))
            .subscribe({
                next: (resp) => {
                    this.messages = [
                        {
                            severity: 'info',
                            detail:
                                resp?.cForoDescripcion ||
                                'No hay descripción disponible',
                        },
                    ]
                    this.foro = resp
                    this.FilesTareas = this.foro?.cForoUrl
                        ? JSON.parse(this.foro?.cForoUrl)
                        : []
                },
            })
    }
    //getRespuestasForo
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
                    this.data = resp['data']
                    this.respuestasForo.forEach(
                        (i) =>
                            (i.json_respuestas_comentarios =
                                i.json_respuestas_comentarios
                                    ? JSON.parse(i.json_respuestas_comentarios)
                                    : null)
                    )
                    console.log('Comentarios de los Foros', this.respuestasForo)
                },
                error: (err) => {
                    console.error('Error al obtener respuestas del foro', err)
                },
            })
        // Suscribirse a nuevos comentarios a través de WebSocket
        this.websocketService.listen('newComment').subscribe((message: any) => {
            console.log('Nuevo comentario recibido desde WebSocket:', message)

            // Suponiendo que el comentario recibido es solo texto, puedes agregarlo a la lista de respuestas.
            // Si necesitas agregar la respuesta de una manera más estructurada, ajusta este bloque.
            const newComment = {
                cForoRptaRespuesta: message,
                expanded: false,
            }

            // Aquí puedes agregar el nuevo comentario al array `respuestasForo`
            // Asegúrate de que `respuestasForo` esté actualizada con los nuevos comentarios
            this.respuestasForo.push(newComment)

            // Si la lista de respuestas necesita alguna otra actualización o formato, puedes hacerlo aquí.
            console.log('Respuestas de foro actualizadas:', this.respuestasForo)
        })
    }
    toggleExpand(comment: any) {
        comment.expanded = !comment.expanded
    }
    getInformation(params) {
        this.GeneralService.getGralPrefix(params).subscribe({
            next: (response) => {
                this.estudiantes = response.data
            },
            complete: () => {},
            error: (error) => {
                console.log(error)
            },
        })
    }

    getEstudiantesMatricula() {
        const params = {
            petition: 'post',
            group: 'aula-virtual',
            prefix: 'matricula',
            ruta: 'list',
            data: {
                opcion: 'CONSULTAR-ESTUDIANTESxiSemAcadIdxiYAcadIdxiCurrId',
                iSemAcadId:
                    '2jdp2ERVe0QYG8agql5J1ybONbOMzW93KvLNZ7okAmD4xXBrwe',
                iYAcadId: '2jdp2ERVe0QYG8agql5J1ybONbOMzW93KvLNZ7okAmD4xXBrwe',
                iCurrId: '2jdp2ERVe0QYG8agql5J1ybONbOMzW93KvLNZ7okAmD4xXBrwe',
            },
            params: { skipSuccessMessage: true },
        }

        this.getInformation(params)
    }
}
