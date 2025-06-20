import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { CommonModule } from '@angular/common'
import {
    Component,
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
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { SubirArchivoPreguntasComponent } from './subir-archivo-preguntas/subir-archivo-preguntas.component'
import { AreaCardComponent } from './area-card/area-card.component'
import { ConfigurarNivelLogroComponent } from './configurar-nivel-logro/configurar-nivel-logro.component'
import { ImportarResultadosComponent } from '../../informes-ere/importar-resultados/importar-resultados.component'
import { AreasService } from '../services/areas.service'
import { GuardarResultadosOnlineComponent } from '../../informes-ere/guardar-resultados-online/guardar-resultados-online.component'
import { SimpleListaAreasComponent } from './simple-lista-areas/simple-lista-areas.component'

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
        ConfigurarNivelLogroComponent,
        ImportarResultadosComponent,
        GuardarResultadosOnlineComponent,
        SimpleListaAreasComponent,
    ],
    templateUrl: './lista-areas.component.html',
    styleUrl: './lista-areas.component.scss',
})
export class ListaAreasComponent implements OnInit {
    private store = new LocalStoreService()
    @ViewChild(SubirArchivoPreguntasComponent)
    dialogSubirArchivo!: SubirArchivoPreguntasComponent

    @ViewChild(ImportarResultadosComponent)
    dialogImportarResultados!: ImportarResultadosComponent

    // modal de guardar resultados online
    @ViewChild(GuardarResultadosOnlineComponent)
    dialogGuardarResultadosOnline!: GuardarResultadosOnlineComponent

    @ViewChild(ConfigurarNivelLogroComponent)
    dialogConfigurarNivelLogro!: ConfigurarNivelLogroComponent

    @ViewChildren(AreaCardComponent)
    gestionarPreguntasCard!: QueryList<AreaCardComponent>

    modoCard: boolean = true
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

    constructor(
        private route: ActivatedRoute,
        private evaluacionesService: ApiEvaluacionesRService,
        private areasService: AreasService
    ) {}

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

    recibirDatosParaConfigurarNivelLogro(datos: { curso: ICurso }) {
        this.dialogConfigurarNivelLogro.mostrarDialog(datos)
    }

    importarResultados(datos: { curso: ICurso }) {
        this.dialogImportarResultados.mostrarDialog(datos)
    }
    // Modal para guardar resultados online
    guardarResultadosOnline(datos: { curso: ICurso }) {
        this.dialogGuardarResultadosOnline.mostrarDialog(datos)
    }

    /*actualizarEstadoArchivoSubido(datos: { curso: ICurso }) {
        this.gestionarPreguntasCard.forEach((card) => {
            if (
                card.curso.iCursosNivelGradId === datos.curso.iCursosNivelGradId
            ) {
                card.curso.bTieneArchivo = true
            }
        })
    }
    */

    actualizarEstadoArchivoSubido(datos: { curso: ICurso }) {
        const cursoIndex = this.cursos.findIndex(
            (c) => c.iCursosNivelGradId === datos.curso.iCursosNivelGradId
        )

        if (cursoIndex !== -1) {
            this.cursos[cursoIndex].bTieneArchivo = true
            this.cursos = [...this.cursos]
        }

        this.gestionarPreguntasCard?.forEach((card) => {
            if (
                card.curso.iCursosNivelGradId === datos.curso.iCursosNivelGradId
            ) {
                card.curso.bTieneArchivo = true
            }
        })
    }
    actualizarEstadoResultadosImportados(datos: { curso: ICurso }) {
        console.log(datos, 'datos')
    }
    // modal guardar resultados online
    actualizarEstadoResultadosGuardados(datos: { curso: ICurso }) {
        console.log(datos, 'datos')
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
        this.obtenerAreasPorEvaluacion()
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

    obtenerAreasPorEvaluacion() {
        this.areasService
            .obtenerAreasPorEvaluacion(this.iEvaluacionIdHashed)
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

    cambiarVista(): void {
        this.modoCard = !this.modoCard
        console.log('Vista cambiada a:', this.modoCard ? 'Cards' : 'Tabla')
    }
}
