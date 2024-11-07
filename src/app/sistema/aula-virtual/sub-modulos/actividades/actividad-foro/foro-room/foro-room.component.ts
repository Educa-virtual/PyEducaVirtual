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
    private _constantesService = inject(ConstantesService)
    //private ref = inject(DynamicDialogRef)
    // variables
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

    commentForoM: string = ''

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
        iEstudianteId: [],
        iForoId: [''],
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
        console.log('mi id perfil', this.iEstudianteId)
    }
    openModal(respuestasForo) {
        this.modalCalificacion = true
        this.estudianteSelect = respuestasForo
        this.foroFormComnt.patchValue(respuestasForo)
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
    sendComment() {
        this.iEstudianteId = this._constantesService.iEstudianteId
        const comment = this.foroFormComntAl.value
        comment.iForoId = this.ixActivadadId
        comment.iEstudianteId = this.iEstudianteId

        this._aulaService.guardarRespuesta(comment).subscribe(
            (response) => {
                this.comentarios.push(comment)
                console.log('Comentario Guardado:', response)

                this.foroFormComntAl.get('cForoRptaRespuesta')?.reset()
            },
            (error) => {
                console.error('Comentario:', error)
            }
        )
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
                next: (resp) => {
                    this.respuestasForo = Object.values(resp)
                    console.log('Comentarios de los Foros', this.respuestasForo)
                },
            })
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
        //console.log('Datos estudiante', this.GeneralService)
    }
    abrirPDF(url: any) {
        window.open(url, '_blank')
    }

    comments = [
        {
            profilePicture: 'path/to/profile.jpg',
            author: 'Jhon Doe',
            time: new Date(),
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
        },
        // Más comentarios
    ]

    // replyToComment(respuestasForo: any) {
    //     // Lógica para responder al comentario
    // }

    // editComment(respuestasForo: any) {
    //     // Lógica para editar el comentario
    // }

    // deleteComment(respuestasForo: any) {
    //     // Lógica para borrar el comentario
    // }
}
