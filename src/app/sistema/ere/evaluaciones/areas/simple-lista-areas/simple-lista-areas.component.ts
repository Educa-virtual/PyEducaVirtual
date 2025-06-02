import { StringCasePipe } from '@/app/shared/pipes/string-case.pipe'
import {
    Component,
    inject,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    OnDestroy,
    Output,
    EventEmitter,
} from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { MenuItem } from 'primeng/api'
import { DialogGenerarCuadernilloComponent } from '../dialog-generar-cuadernillo/dialog-generar-cuadernillo.component'
import { ConfigurarNivelLogroComponent } from '../configurar-nivel-logro/configurar-nivel-logro.component'
import { Router, RouterModule } from '@angular/router'
import { ActivatedRoute } from '@angular/router'
import { Subject } from 'rxjs'
import { CommonModule } from '@angular/common'
import { ICurso } from '@/app/sistema/aula-virtual/sub-modulos/cursos/interfaces/curso.interface'
import { ApiEvaluacionesRService } from '@/app/sistema/ere/evaluaciones/services/api-evaluaciones-r.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { ESPECIALISTA_DREMO } from '@/app/servicios/seg/perfiles'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { DIRECTOR_IE } from '@/app/servicios/perfilesConstantes'
import { environment } from '@/environments/environment'

interface Column {
    field: string
    header: string
}

@Component({
    selector: 'app-simple-lista-areas',
    standalone: true,
    imports: [
        CommonModule,
        PrimengModule,
        DialogGenerarCuadernilloComponent,
        ConfigurarNivelLogroComponent,
        RouterModule,
        StringCasePipe,
    ],
    templateUrl: './simple-lista-areas.component.html',
    styleUrl: './simple-lista-areas.component.scss',
})
export class SimpleListaAreasComponent implements OnInit, OnChanges, OnDestroy {
    @Input() iEvaluacionIdHashed: string = ''
    @Input() cursosFromParent: ICurso[] = []

    @Output() dialogSubirArchivoEvent = new EventEmitter<{ curso: ICurso }>()
    @Output() dialogConfigurarNivelLogroEvent = new EventEmitter<{
        curso: ICurso
    }>()
    @Output() dialogImportarResultados = new EventEmitter<{ curso: ICurso }>()
    @Output() dialogGuardarResultadosOnline = new EventEmitter<{
        curso: ICurso
    }>()

    private router: Router = inject(Router)
    private evaluacionesService = inject(ApiEvaluacionesRService)
    private _ConstantesService = inject(ConstantesService)
    private route = inject(ActivatedRoute)
    private store = inject(LocalStoreService)
    private destroy$ = new Subject<void>()

    backend = environment.backend
    iPerfilId: number = this._ConstantesService.iPerfilId

    title: string = 'Lista de áreas'
    breadCrumbItems: MenuItem[] = []
    breadCrumbHome: MenuItem = {}
    colsDirector: Column[] = []
    colsEspecialista: Column[] = []
    cursos: ICurso[] = []

    mostrarDialogoEdicion: boolean = false
    visible: boolean = false

    cursoSeleccionado: ICurso | null = null

    cursosAgrupados: { [key: string]: ICurso[] } = {}
    gradosFiltrados: string[] = []
    gradosOrdenados: string[]

    ngOnInit(): void {
        this.initializeBreadcrumb()
        this.initializeColumns()
    }

    /*ngOnChanges(changes: SimpleChanges): void {
        if (changes['iEvaluacionIdHashed']?.currentValue) {
            this.iEvaluacionIdHashed =
                changes['iEvaluacionIdHashed'].currentValue
        }
        if (changes['cursosFromParent']?.currentValue) {
            this.cursosFromParent = changes['cursosFromParent'].currentValue
            this.cursos = [...this.cursosFromParent]
            console.log('Cursos recibidos del padre:', this.cursos)
        }
    }
        */

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['iEvaluacionIdHashed']?.currentValue) {
            this.iEvaluacionIdHashed =
                changes['iEvaluacionIdHashed'].currentValue
        }
        if (changes['cursosFromParent']?.currentValue) {
            this.cursosFromParent = changes['cursosFromParent'].currentValue
            this.cursos = [...this.cursosFromParent]
            this.agruparCursosPorGrado()
            console.log('Cursos recibidos del padre:', this.cursos)
            console.log('Cursos agrupados:', this.cursosAgrupados)
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next()
        this.destroy$.complete()
    }

    private initializeBreadcrumb(): void {
        this.breadCrumbHome = {
            icon: 'pi pi-home',
            routerLink: '/inicio',
        }
        this.breadCrumbItems = [{ label: 'Lista de Áreas' }]
    }

    private initializeColumns(): void {
        this.colsDirector = [
            { field: 'id', header: 'Nº' },
            { field: 'area', header: 'Área' },
            { field: 'cuadernillo', header: 'Cuadernillo de Evaluación' },
            { field: 'hojaRespuestas', header: 'Hoja de respuestas' },
            { field: 'matriz', header: 'Matriz de Evaluación' },
            { field: 'resultados', header: 'Resultados' },
        ]

        this.colsEspecialista = [
            { field: 'id', header: 'Nº' },
            { field: 'area', header: 'Área' },
            { field: 'cuadernillo', header: 'Cuadernillo de Evaluación' },
            { field: 'hojaRespuestas', header: 'Hoja de respuestas' },
            { field: 'matriz', header: 'Matriz de Evaluación' },
            { field: 'acciones', header: 'Acciones' },
        ]
    }

    descargarArchivoPreguntasPorArea(tipoArchivo: string): void {
        if (!this.cursoSeleccionado) {
            alert('No hay curso seleccionado')
            return
        }

        const params = {
            iEvaluacionId: this.iEvaluacionIdHashed,
            iCursosNivelGradId: this.cursoSeleccionado.iCursosNivelGradId!,
            tipoArchivo: tipoArchivo,
        }
        this.evaluacionesService.descargarArchivoPreguntasPorArea(params)
    }

    descargarMatrizPorEvaluacionArea(): void {
        if (!this.cursoSeleccionado) {
            alert('No hay curso seleccionado')
            return
        }

        const user = this.store.getItem('dremoUser')
        const params = {
            iEvaluacionId: this.iEvaluacionIdHashed,
            iCursosNivelGradId: this.cursoSeleccionado.iCursosNivelGradId!,
            iDocenteId: user.iDocenteId,
        }
        this.evaluacionesService.descargarMatrizPorEvaluacionArea(params)
    }

    descargarPDF(tipo: string, curso: ICurso): void {
        this.cursoSeleccionado = curso

        switch (tipo) {
            case 'Cuadernillo':
                if (curso.bTieneArchivo) {
                    this.descargarArchivoPreguntasPorArea('pdf')
                } else {
                    alert(
                        'No se ha subido un archivo de cuadernillo para esta área.'
                    )
                }
                break
            case 'Hoja de respuestas':
                this.descargarArchivoPreguntasPorArea('hoja_respuestas')
                break
            case 'Matriz':
                this.descargarMatrizPorEvaluacionArea()
                break
            default:
                console.error('Tipo de archivo no reconocido:', tipo)
        }
    }

    onDialogSubirArchivo(curso: ICurso): void {
        this.cursoSeleccionado = curso
        this.dialogSubirArchivoEvent.emit({ curso })
    }

    onDialogConfigurarNivelLogro(curso: ICurso): void {
        this.cursoSeleccionado = curso
        this.dialogConfigurarNivelLogroEvent.emit({ curso })
    }

    onDialogImportarResultados(curso: ICurso): void {
        this.cursoSeleccionado = curso
        this.dialogImportarResultados.emit({ curso })
    }

    onDialogResultadosOnline(curso: ICurso): void {
        this.cursoSeleccionado = curso
        this.dialogGuardarResultadosOnline.emit({ curso })
    }

    gestionarPreguntas(curso: ICurso): void {
        this.router.navigate([
            `ere/evaluaciones/${this.iEvaluacionIdHashed}/areas/${curso.iCursosNivelGradId}/preguntas`,
        ])
    }

    recibirDatosParaConfigurarNivelLogro(datos: { curso: ICurso }): void {
        this.dialogConfigurarNivelLogroEvent.emit(datos)
        this.visible = false
    }

    verResultados(curso: ICurso): void {
        console.log('Ver resultados de:', curso.cCursoNombre)
    }

    get esDirector(): boolean {
        return this.iPerfilId === DIRECTOR_IE
    }

    get esEspecialista(): boolean {
        return this.iPerfilId === ESPECIALISTA_DREMO
    }

    eliminarArchivoCuadernillo(curso: ICurso): void {
        this.cursoSeleccionado = curso

        if (
            confirm(
                `¿Está seguro de eliminar el archivo de cuadernillo para ${curso.cCursoNombre}?\n\nEsto le permitirá subir un nuevo archivo.`
            )
        ) {
            console.log(
                'Eliminando archivo de cuadernillo para:',
                curso.cCursoNombre
            )

            curso.bTieneArchivo = false

            console.log(
                'Archivo eliminado. Ahora puede subir un nuevo archivo.'
            )
        }
    }

    obtenerNombreArchivo(curso: ICurso): string {
        return `${curso.cCursoNombre?.toLowerCase().replace(/\s+/g, '_')}_eval.pdf`
    }

    updateUrl(curso: ICurso): void {
        curso.cCursoImagen = 'cursos/images/no-image.jpg'
    }

    // Modal para guardar resultados online
    guardarResultadosOnline(datos: { curso: ICurso }) {
        this.dialogGuardarResultadosOnline.emit(datos)
    }

    private agruparCursosPorGrado(): void {
        this.cursosAgrupados = {}

        this.cursos.forEach((curso) => {
            const grado =
                curso.cGradoAbreviacion?.toString().substring(0, 1) || '0'
            const nivel =
                curso.cNivelTipoNombre?.toString().replace('Educación ', '') ||
                'Sin nivel'
            const claveGrado = `${grado}° Grado - ${nivel}`

            if (!this.cursosAgrupados[claveGrado]) {
                this.cursosAgrupados[claveGrado] = []
            }

            this.cursosAgrupados[claveGrado].push(curso)
        })

        // Ordenar las claves de grados
        this.gradosOrdenados = Object.keys(this.cursosAgrupados).sort(
            (a, b) => {
                const gradoA = parseInt(a.charAt(0))
                const gradoB = parseInt(b.charAt(0))
                return gradoA - gradoB
            }
        )
    }

    obtenerIndiceGlobal(curso: ICurso): number {
        return (
            this.cursos.findIndex(
                (c) => c.iCursosNivelGradId === curso.iCursosNivelGradId
            ) + 1
        )
    }
}
