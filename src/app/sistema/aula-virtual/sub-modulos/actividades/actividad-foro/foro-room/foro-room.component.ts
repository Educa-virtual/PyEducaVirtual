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
import { provideIcons } from '@ng-icons/core'
import { PrimengModule } from '@/app/primeng.module'
import { GeneralService } from '@/app/servicios/general.service'
import { ApiAulaService } from '@/app/sistema/aula-virtual/services/api-aula.service'
import { tipoActividadesKeys } from '@/app/sistema/aula-virtual/interfaces/actividad.interface'
import { Subject, takeUntil } from 'rxjs'
import { RemoveHTMLPipe } from '@/app/shared/pipes/remove-html.pipe'
import { NgIf } from '@angular/common'
import { RecursosListaComponent } from '@/app/shared/components/recursos-lista/recursos-lista.component'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { EmptySectionComponent } from '@/app/shared/components/empty-section/empty-section.component'
import { MenuItem, Message } from 'primeng/api'
// import { WebsocketService } from '@/app/sistema/aula-virtual/services/websoket.service'
import { DOCENTE, ESTUDIANTE } from '@/app/servicios/perfilesConstantes'
import { LocalStoreService } from '@/app/servicios/local-store.service'

import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component'
import { ForoRoomDetalleComponent } from '../foro-room-detalle/foro-room-detalle.component'
import { Location } from '@angular/common'
import { ForosService } from '@/app/servicios/aula/foros.service'
import { TabDescripcionActividadesComponent } from '../../components/tab-descripcion-actividades/tab-descripcion-actividades.component'

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
        PrimengModule,
        NgIf,
        ToolbarPrimengComponent,
        ForoRoomDetalleComponent,
        TabDescripcionActividadesComponent,
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
    @Input() iIeCursoId
    @Input() iSeccionId
    @Input() iNivelGradoId

    public DOCENTE = DOCENTE
    public ESTUDIANTE = ESTUDIANTE

    private GeneralService = inject(GeneralService)
    private _formBuilder = inject(FormBuilder)
    private _aulaService = inject(ApiAulaService)
    // private ref = inject(DynamicDialogRef)
    private _constantesService = inject(ConstantesService)
    private _ForosService = inject(ForosService)
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
    //modalCalificacion: boolean = false
    estudianteSelectComent: number | null = null
    estudianteSelect = null
    respuestasForo: any[] = []
    display = false
    nombrecompleto

    foro: any
    resptDocente: any
    iPerfilId: number
    iEstudianteId: number
    iDocenteId: number
    expanded: false
    iCredId: number

    commentForoM: string = ''
    selectedCommentIndex: number | null = null // Para rastrear el comentario seleccionado para responder
    selectedComentario: number | null = null
    respuestaInput: string = '' // Para almacenar la respuesta temporal
    isDocente: boolean = this._constantesService.iPerfilId === DOCENTE
    items: MenuItem[] | undefined
    home: MenuItem | undefined

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
        //iEscalaCalifId: [],
        iForoRptaId: ['', [Validators.required]],
        cForoRptaDocente: ['', [Validators.required]],
        //nForoRptaNota: [],
        //cForoDescripcion: [],
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
    perfil: any[] = []
    constructor(
        private location: Location,
        // private websocketService: WebsocketService,
        private store: LocalStoreService
        //private _activatedRoute: ActivatedRoute,
        //private messageService: MessageService
    ) {
        this.perfil = this.store.getItem('dremoPerfil')
        //para obtener el idDocCursoId
    }
    params: any = {}
    selectedItems = []
    ngOnInit(): void {
        this.items = [
            {
                label: 'Mis Áreas Curriculares',
                routerLink: '/aula-virtual/areas-curriculares',
            },
            {
                label: 'Contenido',
                command: () => this.goBack(),
                routerLink: '/',
            },
            { label: 'Foro' },
        ]

        this.home = { icon: 'pi pi-home', routerLink: '/' }
        this.params = {
            ejemplo: 'Este es un parámetro',
        }
        // this.websocketService.messages$.subscribe((msg: any) => {
        //     this.messageWebs.push(`Servidor: ${msg}`)
        // })
        // this.websocketService.messages$.subscribe((message: any) => {
        //     // Agregar el mensaje recibido a la lista de comentarios
        //     this.comments.push(message);  // Asume que tienes una lista `comments`
        // });
        this.obtenerIdPerfil()
        // this.mostrarCalificacion()

        this.obtenerForo()
        this.getRespuestaF()
        //this.getEstudiantesMatricula()
        // this.obtenerResptDocente()
    }
    goBack() {
        this.location.back()
    }

    itemRespuesta: any[] = []
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
            command: () => this.eliminar(this.itemRespuesta),
        },
    ]
    //metodo para editar foro:
    editar(): void {
        // let respuestasForo = this.itemRespuesta
        // console.log('Editar acción ejecutada', respuestasForo)
        //iForoRptaId
    }
    // metodo para eliminar foro
    eliminar(itemRespuesta: any): void {
        const iForoRptaId = {
            iForoRptaId: parseInt(itemRespuesta.iForoRptaId, 10),
        }
        // console.log('Eliminar acción ejecutada01', iForoRptaId)
        this._aulaService.eliminarRespuesta(iForoRptaId).subscribe({
            next: (response) => {
                //const mensaje = response?.message || 'Elemento eliminado sin respuesta del servidor';
                console.log('Elemento eliminado correctamente:', response)
                // Actualiza la lista local después de eliminar
                // this.itemRespuesta = this.itemRespuesta.filter(
                //     (item: any) => item.iForoRptaId !== respuestasForo
                // );
            },
            error: (err) => {
                console.error('Error al eliminar:', err)
            },
        })
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
    // openModal(respuestasForo) {
    //     this.modalCalificacion = true
    //     this.estudianteSelect = respuestasForo
    //     this.foroFormComnt.patchValue(respuestasForo)
    // }

    openModalCalificacion(respuestasForoEstudiant) {
        // console.log('estudiante seleccionado', this.estudianteSelectComent)
        this.modelaCalificacionComen = true
        this.perfilSelect = respuestasForoEstudiant
    }
    toggleEditor() {
        this.showEditor = true
    }
    closeEditor() {
        this.showEditor = false
    }
    isDisabled: boolean = true
    selecEstudiante(estudianteId: number): void {
        this.estudianteSelectComent = estudianteId
        // console.log('Hola estudiante', this.estudianteSelectComent)
    }
    limpiarHTML(html: string): string {
        const temporal = document.createElement('div') // Crear un div temporal
        temporal.innerHTML = html // Insertar el HTML
        return temporal.textContent || '' // Obtener solo el texto
    }
    //calificar comentario de estudiante
    calificarComnt() {
        const idEstudiante = Number(this.perfilSelect.iEstudianteId)
        const idForoId = Number(this.foro.iForoId)

        const rpta = this.foroFormCalf.value
        const resput = rpta.cForoRptaDocente
        const respuestDocLimpia = this.limpiarHTML(resput)
        const where = {
            iEstudianteId: idEstudiante,
            iForoId: idForoId,
            cForoRptDocente: respuestDocLimpia,
        }
        // console.log('estudiante seleccionadodddd', where)

        // const rpta = this.respuestasForo.find(
        //     (i) => i.EstudianteId === this.perfilSelect.EstudianteId
        // )
        this.foroFormCalf.controls['iForoRptaId'].setValue(rpta.iForoRptaId)
        const value = this.foroFormCalf.value
        const nn = value.cForoRptaDocente
        const conclusionFinalDocente = this.limpiarHTML(nn)
        value.cForoRptaDocente = conclusionFinalDocente
        // console.log(where, this.foro)
        this._aulaService.calificarForoDocente(where).subscribe((resp: any) => {
            if (resp?.validated) {
                this.modelaCalificacionComen = false
                this.getRespuestaF()
                console.log(resp)
            }
        })
        console.log('Guardar Calificacion', where)
        this.foroFormCalf.reset()
    }
    cerrarmodal() {
        this.modelaCalificacionComen = false
    }
    startReply(index: number) {
        this.selectedCommentIndex = index // Guarda el índice del comentario seleccionado
        console.log('Comentario', this.selectedCommentIndex)
    }
    cancelarEdicion() {
        this.selectedCommentIndex = null // Desactiva el editor al hacer clic en "Cancelar"
    }

    mostrarCalificacion() {
        const userId = 1
        this._aulaService.obtenerCalificacion(userId).subscribe((Data) => {
            this.calificacion = Data['data']
            //console.log('Mostrar escala',this.calificacion)
        })
    }
    foroRespaldo = []
    // obtener informacion general de foro
    obtenerForo() {
        this._aulaService
            .obtenerForo({
                iActTipoId: this.iActTopId,
                ixActivadadId: this.ixActivadadId,
            })
            .pipe(takeUntil(this.unsbscribe$))
            .subscribe({
                next: (resp) => {
                    this.foro = resp.length
                        ? {
                              ...resp[0],
                              dInicio: resp[0].dtForoInicio,
                              dFin: resp[0].dtForoFin,
                              cDescripcion: resp[0].cForoDescripcion,
                              cDocumentos: resp[0].cForoUrl
                                  ? JSON.parse(resp[0].cForoUrl)
                                  : [],
                              cTitle:
                                  'Foro: ' +
                                  (resp[0]?.cForoTitulo ||
                                      'Título no disponible'),
                              iEstado: Number(resp[0].iEstado),
                          }
                        : {}
                    // console.log('datos generales foro', this.foro)
                    this.obtenerResptDocente() // función para obtener la retroalimentan al estudiante
                    this.FilesTareas = this.foro?.cForoUrl
                        ? JSON.parse(this.foro?.cForoUrl)
                        : []
                    // console.log(this.FilesTareas)
                },
            })
    }
    respuestaDocente: string
    comentarioDocente: string
    // obtener retroalimentacion de docente a estudiante x su comentario
    obtenerResptDocente() {
        const idEstudiante = Number(this.iEstudianteId)
        const idForoId = Number(this.foro?.iForoId)

        // console.log('id foro',idForoId)
        this._aulaService
            .obtenerResptDocente({
                iEstudianteId: idEstudiante,
                iForoId: idForoId,
            })
            .subscribe((Data) => {
                // cForoRptaDocente
                this.resptDocente = Data['data']
                // console.log(this.resptDocente)
                this.comentarioDocente =
                    this.resptDocente?.[0]?.cForoRptaDocente
                // console.log('respuesta docente', this.comentarioDocente)
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

                    // console.log(
                    //     'Respuesta Comentarios de los Foros',
                    //     this.respuestasForo
                    // )
                },
                error: (err) => {
                    console.error('Error al obtener respuestas del foro', err)
                },
            })
    }
    toggleExpand(comment: any) {
        comment.expanded = !comment.expanded
    }
    // Obtener la lista de estudiantes matriculados
    getInformation(params) {
        this.GeneralService.getGralPrefix(params).subscribe({
            next: (response) => {
                this.estudiantes = response.data
                //console.log('lista de estudiante', this.estudiantes)
            },
            complete: () => {},
            error: (error) => {
                console.log(error)
            },
        })
    }
    // consulta para obtener los estudiantes
    // getEstudiantesMatricula() {
    //     if(this.iPerfilId === ESTUDIANTE) return
    //     this._ForosService
    //         .obtenerReporteEstudiantesRetroalimentacion({
    //             iIeCursoId: this.iIeCursoId,
    //             iYAcadId: this._constantesService.iYAcadId,
    //             iSedeId: this._constantesService.iSedeId,
    //             iSeccionId: this.iSeccionId,
    //             iNivelGradoId: this.iNivelGradoId,
    //             iForoId:Number(this.foro.iForoId)
    //         })
    //         .subscribe((Data) => {
    //             this.estudiantes = Data['data']
    //             this.estudiantes = Data['data'].map((item: any) => {
    //                 return {
    //                     ...item,
    //                     cTitulo: item.completoalumno,
    //                 }
    //             })
    //         })
    // }
}
