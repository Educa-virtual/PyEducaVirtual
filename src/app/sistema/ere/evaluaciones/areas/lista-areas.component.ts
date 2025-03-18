import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { CommonModule } from '@angular/common'
import {
    Component,
    inject,
    OnInit,
    QueryList,
    ViewChild,
    ViewChildren,
} from '@angular/core'
import { DataView } from 'primeng/dataview'

import { PrimengModule } from '@/app/primeng.module'

import { ICurso } from '@/app/sistema/aula-virtual/sub-modulos/cursos/interfaces/curso.interface'
import { environment } from '@/environments/environment'
import { ActivatedRoute } from '@angular/router'
import { ApiEvaluacionesRService } from '@/app/sistema/ere/evaluaciones/services/api-evaluaciones-r.service'
import { MessagesModule } from 'primeng/messages'
import { Message } from 'primeng/api'
import { ApiEspecialistasService } from '@/app/sistema/ere/services/api-especialistas.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { SubirArchivoPreguntasComponent } from './subir-archivo-preguntas/subir-archivo-preguntas.component'
import { AreaCardComponent } from './area-card/area-card.component'

export type Layout = 'list' | 'grid'

@Component({
    selector: 'app-lista-areas',
    standalone: true,
    imports: [
        CommonModule,
        ContainerPageComponent,
        PrimengModule,
        MessagesModule,
        SubirArchivoPreguntasComponent,
        AreaCardComponent,
    ],
    templateUrl: './lista-areas.component.html',
    styleUrl: './lista-areas.component.scss',
})
export class ListaAreasComponent implements OnInit {
    private evaluacionesService = inject(ApiEvaluacionesRService)
    private especialistasService = inject(ApiEspecialistasService)
    private store = new LocalStoreService()
    private _ConstantesService = inject(ConstantesService)
    @ViewChild(SubirArchivoPreguntasComponent)
    dialogSubirArchivo!: SubirArchivoPreguntasComponent
    @ViewChildren(AreaCardComponent)
    gestionarPreguntasCard!: QueryList<AreaCardComponent>

    iEvaluacionIdHashed: string = ''
    sortField: string = ''
    sortOrder: number = 0
    evaluacion: any = null
    cursos: ICurso[] = []
    cursosInicial: ICurso[] = []
    layout: Layout = 'grid'
    backend = environment.backend
    options = ['grid']
    mostrarMensajeVacio: boolean = false
    mensajeInfo: Message[] | undefined

    constructor(private route: ActivatedRoute) {}

    public onFilter(dv: DataView, event: Event) {
        const text = (event.target as HTMLInputElement).value.toLowerCase()
        this.cursos = this.cursosInicial
        if (text.length > 1) {
            this.cursos = this.cursos.filter((curso) =>
                curso.cCursoNombre.toLowerCase().includes(text)
            )
        }
    }

    recibirDatosParaSubirArchivo(datos: { curso: ICurso }) {
        this.dialogSubirArchivo.mostrarDialog(datos)
    }

    actualizarEstadoArchivoSubido(datos: { curso: ICurso }) {
        this.gestionarPreguntasCard.forEach((card) => {
            if (
                card.curso.iCursosNivelGradId === datos.curso.iCursosNivelGradId
            ) {
                card.curso.bTieneArchivo = true
            }
        })
    }

    ngOnInit() {
        this.mensajeInfo = [
            {
                severity: 'info',
                detail: 'No hay áreas seleccionables para el usuario actual',
            },
        ]
        this.route.params.subscribe((params) => {
            this.iEvaluacionIdHashed = params['iEvaluacionId']
        })
        this.obtenerEvaluacion()
        this.obtenerAreasPorEvaluacionyEspecialista()
    }

    obtenerEvaluacion() {
        this.evaluacionesService
            .obtenerEvaluacionPorId(this.iEvaluacionIdHashed)
            .subscribe({
                next: (resp: unknown) => {
                    this.evaluacion = resp
                },
                error: (error) => {
                    console.error('Error obteniendo datos', error)
                },
            })
    }

    obtenerAreasPorEvaluacionyEspecialista() {
        this.especialistasService
            .obtenerAreasPorEvaluacionyEspecialista(
                this.iEvaluacionIdHashed,
                this.store.getItem('dremoUser').iPersId,
                this._ConstantesService.iPerfilId
            )
            .subscribe({
                next: (respuesta) => {
                    this.cursosInicial = respuesta.map((curso: ICurso) => ({
                        ...curso,
                    }))
                    this.cursos = this.cursosInicial
                    this.mostrarMensajeVacio = false
                },
                error: (error) => {
                    this.mostrarMensajeVacio = true
                    console.error('Error obteniendo datos', error)
                },
            })
    }
}
