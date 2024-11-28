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
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
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
import { TimeComponent } from '@/app/shared/time/time.component'
@Component({
    selector: 'app-foro-room',
    standalone: true,
    templateUrl: './foro-room.component.html',
    styleUrls: ['./foro-room.component.scss'],
    imports: [
        IconComponent,
        TimeComponent,
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
    // variables
    showEditor = false // variable          para ocultar el p-editor
    public data = []
    FilesTareas = []
    estudiantes: any[] = []
    estudiantesOriginales: any[] = []
    calificacion: any[] = []
    comentarios: any[] = []
    descripcion: Message[] = []
    messages: Message[] | undefined
    messageWeb: string = ''
    messageWebs: string[] = []
    private unsbscribe$ = new Subject<boolean>()
    modelaCalificacionComen: boolean = false
    perfilSelect = null
    respuestasForoEstudiant: any[] = []
    totalComentarios: number = 0
    estudianteId: any[] = []
    //
    fechaInicio: Date = new Date() // Hora actual
    fechaFin: Date = new Date(new Date().getTime() + 10 * 60 * 1000) // 10 minutos después
    // borrar variables del p-dia
    modalCalificacion: boolean = false
    estudianteSelectComent: number | null = null
    estudianteSelect = null
    respuestasForo: any[] = []
    display = false
    nombrecompleto

    public foro
    iPerfilId: number
    iEstudianteId: number
    iDocenteId: number
    expanded: false
    iCredId: number

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
    public foroFormCalf: FormGroup = this._formBuilder.group({
        iEscalaCalifId: [],
        iForoRptaId: ['', [Validators.required]],
        cForoRptaDocente: ['', [Validators.required]],
        nForoRptaNota: [],
        cForoDescripcion: [],
    })
    // borrar foroFormComnt
    public foroFormComnt: FormGroup = this._formBuilder.group({
        iEscalaCalifId: [],
        iForoRptaId: [],
        cForoRptaDocente: ['', [Validators.required]],
        nForoRptaNota: [],
        iDocenteId: [''],
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
    ngOnInit(): void {
        // this.websocketService.messages$.subscribe((msg: any) => {
        //     this.messageWebs.push(`Servidor: ${msg}`)
        // })
        // this.websocketService.messages$.subscribe((message: any) => {
        //     // Agregar el mensaje recibido a la lista de comentarios
        //     this.comments.push(message);  // Asume que tienes una lista `comments`
        // });
        this.obtenerEstudiantesMatricula()
        this.obtenerIdPerfil()
        this.mostrarCalificacion()
        this.obtenerForo()
        this.getRespuestaF()
        this.getEstudiantesMatricula()
    }
    // menu para editar y eliminar el comentario del foro
    menuItems = [
        {
            label: 'Editar',
            icon: 'pi pi-pencil',
            command: () => this.editar(),
        },
        {
            label: 'Eliminar',
            icon: 'pi pi-trash',
            command: () => this.eliminar(),
        },
    ]

    editar() {
        console.log('Editar acción ejecutada')
        // Lógica para editar
    }

    eliminar() {
        console.log('Eliminar acción ejecutada')
        // Lógica para eliminar
    }

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
        console.log('icredito', this.iEstudianteId)
    }
    openModal(respuestasForo) {
        this.modalCalificacion = true
        this.estudianteSelect = respuestasForo
        this.foroFormComnt.patchValue(respuestasForo)
    }
    openModalCalificacion(respuestasForoEstudiant) {
        this.modelaCalificacionComen = true
        this.perfilSelect = respuestasForoEstudiant
    }
    toggleEditor() {
        this.showEditor = true
    }
    closeEditor() {
        this.showEditor = false
    }
    selecEstudiante(estudianteId: number): void {
        this.estudianteSelectComent = estudianteId
        console.log('Hola estudiante', this.estudianteSelectComent)
    }
    calificarComnt() {
        const rpta = this.respuestasForo.find(
            (i) => i.EstudianteId === this.perfilSelect.EstudianteId
        )
        this.foroFormCalf.controls['iForoRptaId'].setValue(rpta.iForoRptaId)
        const value = this.foroFormCalf.value
        this._aulaService.calificarForoDocente(value).subscribe((resp: any) => {
            if (resp?.validated) {
                this.modelaCalificacionComen = false
                this.getRespuestaF()
            }
        })
        console.log('Guardar Calificacion', value)

        // this._aulaService.calificarForoDocente(value).subscribe((resp: any) => {
        //     if (resp?.validated) {
        //         this.modalCalificacion = false
        //         this.getRespuestaF()
        //     }
        // })
    }
    submit() {
        //const value = this.foroFormComnt.value
        this.iDocenteId = this._constantesService.iDocenteId
        const comment = {
            ...this.foroFormComnt.value,
            iForoId: this.ixActivadadId,
            iDocenteId: this.iDocenteId,
        }
        console.log('Guardar Calificacion', comment)
        this._aulaService
            .calificarForoDocente(comment)
            .subscribe((resp: any) => {
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
                            detail: resp?.cForoDescripcion,
                        },
                    ]
                    this.foro = resp
                    console.log('obtener datos de foro01', resp)
                    this.FilesTareas = this.foro?.cForoUrl
                        ? JSON.parse(this.foro?.cForoUrl)
                        : []
                    // Formatear fechas (si existen)
                    // Formatear fechas (si existen)
                    if (this.foro?.dtForoInicio) {
                        this.foro.dtForoInicio = this.formatDateISO(
                            this.foro.dtForoInicio
                        )
                    }

                    if (this.foro?.dtForoFin) {
                        this.foro.dtForoFin = this.formatDateISO(
                            this.foro.dtForoFin
                        )
                    }
                },
            })
    }
    formatDateISO(date: string | number | Date): string {
        const parsedDate = new Date(date) // Convertir a Date
        if (isNaN(parsedDate.getTime())) {
            console.warn('Fecha no válida:', date)
            return '' // Manejo de errores si la fecha no es válida
        }

        const year = parsedDate.getFullYear()
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0') // Mes comienza desde 0
        const day = String(parsedDate.getDate()).padStart(2, '0')
        const hours = String(parsedDate.getHours()).padStart(2, '0')
        const minutes = String(parsedDate.getMinutes()).padStart(2, '0')
        const seconds = String(parsedDate.getSeconds()).padStart(2, '0')
        const milliseconds = String(parsedDate.getMilliseconds()).padStart(
            3,
            '0'
        )

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`
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
        // Suscribirse a nuevos comentarios a través de WebSocket
        // this.websocketService.listen('newComment').subscribe((message: any) => {
        //     console.log('Nuevo comentario recibido desde WebSocket:', message)

        //     // Suponiendo que el comentario recibido es solo texto, puedes agregarlo a la lista de respuestas.
        //     // Si necesitas agregar la respuesta de una manera más estructurada, ajusta este bloque.
        //     const newComment = {
        //         cForoRptaRespuesta: message,
        //         expanded: false,
        //     }

        //     // Aquí puedes agregar el nuevo comentario al array `respuestasForo`
        //     // Asegúrate de que `respuestasForo` esté actualizada con los nuevos comentarios
        //     this.respuestasForo.push(newComment)

        //     // Si la lista de respuestas necesita alguna otra actualización o formato, puedes hacerlo aquí.
        //     console.log('Respuestas de foro actualizadas:', this.respuestasForo)
        // })
    }
    toggleExpand(comment: any) {
        comment.expanded = !comment.expanded
    }
    getInformation(params) {
        this.GeneralService.getGralPrefix(params).subscribe({
            next: (response) => {
                this.estudiantes = response.data
                console.log('lista de estudiante', this.estudiantes)
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
    obtenerEstudiantesMatricula() {
        this.iCredId = this._constantesService.iCredId
        console.log('Parametros para obtener Alumnos', this.iCredId)
    }
}
