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
import { MenuItem, Message } from 'primeng/api'
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

    breadCrumbItems: MenuItem[]
    breadCrumbHome: MenuItem

    constructor(private route: ActivatedRoute) {}

    public onFilter(dv: DataView, event: Event) {
        //Elimina acentos (á, é, etc.) y convierte a minúsculas
        const normalizeText = (str: string) =>
            str
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
        const text = normalizeText((event.target as HTMLInputElement).value)
        this.cursos = this.cursosInicial
        if (text.length > 1) {
            this.cursos = this.cursos.filter((curso) =>
                normalizeText(curso.cCursoNombre).includes(text)
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
                detail:
                    'No hay áreas seleccionables para el usuario actual con el rol ' +
                    this.store.getItem('dremoPerfil').cPerfilNombre,
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
                    this.breadCrumbItems = [
                        {
                            label: 'ERE',
                        },
                        {
                            label: 'Evaluaciones',
                            routerLink: '/ere/evaluaciones',
                        },
                        {
                            label:
                                this.evaluacion.cEvaluacionNombre +
                                ' - ' +
                                this.evaluacion.cNivelEvalNombre,
                        },
                        { label: 'Lista de áreas' },
                    ]
                    this.breadCrumbHome = {
                        icon: 'pi pi-home',
                        routerLink: '/',
                    }
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
