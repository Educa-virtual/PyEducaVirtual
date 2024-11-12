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
import { NgFor } from '@angular/common'
import { RecursosListaComponent } from '@/app/shared/components/recursos-lista/recursos-lista.component'
import { ConstantesService } from '@/app/servicios/constantes.service'
@Component({
    selector: 'app-foro-room',
    standalone: true,
    templateUrl: './foro-room.component.html',
    styleUrls: ['./foro-room.component.scss'],
    imports: [
        IconComponent,
        RecursosListaComponent,
        RemoveHTMLPipe,
        CommonInputComponent,
        TablePrimengComponent,
        TabViewModule,
        OrderListModule,
        PrimengModule,
        NgFor,
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
    FilesTareas = []
    estudiantes: any[] = []
    calificacion: any[] = []
    respuestasForo: any[] = []
    comentarios: any[] = []
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
    })
    constructor() {}
    ngOnInit() {
        this.obtenerIdPerfil()
        this.mostrarCalificacion()
        this.obtenerForo()
        this.getRespuestaF()
    }
    // closeModal(data) {
    //     this.ref.close(data)
    // }
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
    sendCommentPadre() {
        // guardar el comentario
        this.iEstudianteId = this._constantesService.iEstudianteId
        this.foroFormComntAl.value
        console.log('rptaPadre', this.foroFormComntAl)
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
                    // para refrescar la pagina
                    if (resp?.validated) {
                        this.getRespuestaF()
                        this.foroFormComntAl.get('cForoRptaRespuesta')?.reset()
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
                    console.log('Comentarios de los Foros', this.respuestasForo)
                },
                error: (err) => {
                    console.error('Error al obtener respuestas del foro', err)
                },
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
}
