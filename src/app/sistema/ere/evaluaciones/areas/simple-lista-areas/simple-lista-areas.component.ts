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
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api'
import { DialogGenerarCuadernilloComponent } from '../dialog-generar-cuadernillo/dialog-generar-cuadernillo.component'
import { ConfigurarNivelLogroComponent } from '../configurar-nivel-logro/configurar-nivel-logro.component'
import { Router, RouterModule } from '@angular/router'
import { ActivatedRoute } from '@angular/router'
import { Subject } from 'rxjs'
import { CommonModule } from '@angular/common'
import { ICurso } from '@/app/sistema/aula-virtual/sub-modulos/cursos/interfaces/curso.interface'
import { ApiEvaluacionesRService } from '@/app/sistema/ere/evaluaciones/services/api-evaluaciones-r.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import {
    ADMINISTRADOR_DREMO,
    ESPECIALISTA_DREMO,
} from '@/app/servicios/seg/perfiles'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { DIRECTOR_IE } from '@/app/servicios/perfilesConstantes'
import { environment } from '@/environments/environment'
import { AreasService } from '../../services/areas.service'
interface Column {
    field: string
    header: string
    width?: string
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
    @Input() curso: ICurso
    @Input() cursosFromParent: ICurso[] = []

    @Output() dialogSubirArchivoEvent = new EventEmitter<{ curso: ICurso }>()
    @Output() dialogConfigurarNivelLogroEvent = new EventEmitter<{
        curso: ICurso
    }>()
    @Output() dialogImportarResultados = new EventEmitter<{ curso: ICurso }>()
    @Output() dialogGuardarResultadosOnline = new EventEmitter<{
        curso: ICurso
    }>()

    @Output() solicitudActualizacion = new EventEmitter<void>()
    @Output() dialogActivarDescarga = new EventEmitter<{ curso: ICurso }>()

    private router: Router = inject(Router)
    private evaluacionesService = inject(ApiEvaluacionesRService)
    private _ConstantesService = inject(ConstantesService)
    private route = inject(ActivatedRoute)
    private store = inject(LocalStoreService)
    private destroy$ = new Subject<void>()
    confirmationService = inject(ConfirmationService)

    backend = environment.backend
    iPerfilId: number = this._ConstantesService.iPerfilId

    title: string = 'Lista de áreas'
    breadCrumbItems: MenuItem[] = []
    breadCrumbHome: MenuItem = {}
    colsDirector: Column[] = []
    colsEspecialista: Column[] = []
    colsAdministradorDremo: Column[] = []
    cursos: ICurso[] = []

    mostrarDialogoEdicion: boolean = false
    visible: boolean = false

    cursoSeleccionado: ICurso | null = null
    cursosAgrupados: { [key: string]: ICurso[] } = {}
    gradosFiltrados: string[] = []
    gradosOrdenados: string[]
    constructor(
        private messageService: MessageService,
        private areasService: AreasService
    ) {}
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
            { field: 'id', header: 'Nº', width: '5%' },
            { field: 'area', header: 'Área', width: '15%' },
            {
                field: 'cuadernillo',
                header: 'Cuadernillo de Evaluación',
                width: '10%',
            },
            {
                field: 'hojaRespuestas',
                header: 'Hoja de respuestas',
                width: '10%',
            },
            { field: 'matriz', header: 'Matriz de Evaluación', width: '10%' },
            { field: 'acciones', header: 'Acciones', width: '10%' },
        ]

        this.colsEspecialista = [
            { field: 'id', header: 'Nº', width: '5%' },
            { field: 'area', header: 'Área', width: '15%' },
            {
                field: 'cuadernillo',
                header: 'Cuadernillo de Evaluación',
                width: '10%',
            },
            {
                field: 'hojaRespuestas',
                header: 'Hoja de respuestas',
                width: '10%',
            },
            { field: 'matriz', header: 'Matriz de Evaluación', width: '10%' },
            { field: 'acciones', header: 'Acciones', width: '10%' },
        ]

        this.colsAdministradorDremo = [
            { field: 'id', header: 'Nº', width: '5%' },
            { field: 'area', header: 'Área', width: '15%' },
            {
                field: 'cuadernillo',
                header: 'Cuadernillo de Evaluación',
                width: '10%',
            },
            {
                field: 'hojaRespuestas',
                header: 'Hoja de respuestas',
                width: '10%',
            },
            { field: 'matriz', header: 'Matriz de Evaluación', width: '10%' },
            {
                field: 'activarDescargas',
                header: 'Activar descargas',
                width: '10%',
            },
            { field: 'acciones', header: 'Acciones', width: '10%' },
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

        this.evaluacionesService
            .descargarArchivoPreguntasPorArea(params)
            .subscribe({
                next: (response: Blob) => {
                    const url = window.URL.createObjectURL(response)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `Evaluacion ${this.cursoSeleccionado.cCursoNombre} ${this.cursoSeleccionado.cGradoAbreviacion} ${this.cursoSeleccionado.cNivelTipoNombre.replace('Educación', '')}.pdf`
                    a.click()
                    window.URL.revokeObjectURL(url)
                },
                error: (error) => {
                    console.error('Error al descargar:', error)
                    alert('Error al descargar el archivo')
                },
            })
    }
    /*descargarArchivoPreguntasPorArea(tipoArchivo: string): void {
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
    }*/
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

        this.evaluacionesService
            .descargarMatrizPorEvaluacionArea(params)
            .subscribe({
                next: (response: Blob) => {
                    const url = window.URL.createObjectURL(response)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `Matriz ${this.cursoSeleccionado.cCursoNombre} ${this.cursoSeleccionado.cGradoAbreviacion} ${this.cursoSeleccionado.cNivelTipoNombre.replace('Educación', '')}.pdf`
                    a.click()
                    window.URL.revokeObjectURL(url)
                },
                error: (error) => {
                    console.error('Error al descargar matriz:', error)
                    alert('Error al descargar la matriz')
                },
            })
    }
    /*descargarMatrizPorEvaluacionArea(): void {
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
    */
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
                //this.descargarArchivoPreguntasPorArea('hoja_respuestas')
                this.descargarCartillaRespuestas(curso)
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
    get esAdministradorDremo(): boolean {
        return this.iPerfilId === ADMINISTRADOR_DREMO
    }

    eliminarArchivoCuadernillo(curso: ICurso): void {
        this.cursoSeleccionado = curso

        this.confirmationService.confirm({
            message: `¿Está seguro de eliminar el archivo de cuadernillo para ${curso.cCursoNombre}? Esto le permitirá subir un nuevo archivo.`,
            header: '',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Eliminar',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass:
                'p-button-success p-button-sm custom-accept',
            rejectButtonStyleClass: 'p-button-danger p-button-sm custom-reject',
            accept: () => {
                this.areasService
                    .eliminarArchivoPreguntasPdf(
                        curso.iEvaluacionIdHashed,
                        curso.iCursosNivelGradId
                    )
                    .subscribe({
                        next: () => {
                            curso.bTieneArchivo = false
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Éxito',
                                detail: 'Archivo eliminado correctamente.',
                            })
                        },
                        error: (err) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail:
                                    err.error.message ||
                                    'Error al eliminar el archivo de cuadernillo.',
                            })
                        },
                    })
            },
        })
    }
    /*eliminarArchivoCuadernillo(curso: ICurso): void {
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
    }*/

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
        this.gradosOrdenados = Object.keys(this.cursosAgrupados)
    }

    obtenerIndiceGlobal(curso: ICurso): number {
        return (
            this.cursos.findIndex(
                (c) => c.iCursosNivelGradId === curso.iCursosNivelGradId
            ) + 1
        )
    }

    onArchivoSubidoExitoso(Curso: ICurso): void {
        // Actualizar localmente
        Curso.bTieneArchivo = true

        // Solicitar actualización al padre
        this.solicitudActualizacion.emit()

        // Reagrupar cursos
        this.agruparCursosPorGrado()
    }

    // Descargar hoja de respuestas
    descargarCartillaRespuestas(curso: ICurso) {
        this.cursoSeleccionado = curso

        const params = {
            iEvaluacionId: this.iEvaluacionIdHashed,
            iCursosNivelGradId: curso.iCursosNivelGradId,
        }
        this.evaluacionesService.descargarCartillaRespuestas(params).subscribe({
            next: (response: Blob) => {
                const url = window.URL.createObjectURL(response)
                const a = document.createElement('a')
                a.href = url
                a.download = `Hoja respuestas.docx` //Por si se implementa el cambio de nombre ${this.curso.cCursoNombre} ${this.curso.cGradoAbreviacion} ${this.curso.cNivelTipoNombre.replace('Educación', '')}
                a.click()
                window.URL.revokeObjectURL(url)
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Problema al descargar el archivo',
                    detail: error,
                })
            },
        })
    }

    descargarArchivoPreguntasWord(curso: any) {
        const params = {
            iEvaluacionId: this.iEvaluacionIdHashed,
            iCursosNivelGradId: curso.iCursosNivelGradId,
            tipoArchivo: 'word',
        }
        this.evaluacionesService
            .descargarArchivoPreguntasPorArea(params)
            .subscribe({
                next: (response: Blob) => {
                    const url = window.URL.createObjectURL(response)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `${curso.cCursoNombre} ${curso.cGradoAbreviacion} ${curso.cNivelTipoNombre.replace('Educación', '')}.docx` //Por si se implementa el cambio de nombre ${this.curso.cCursoNombre} ${this.curso.cGradoAbreviacion} ${this.curso.cNivelTipoNombre.replace('Educación', '')}
                    a.click()
                    window.URL.revokeObjectURL(url)
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Problema al descargar el archivo',
                        detail: error,
                    })
                },
            })
    }
    onDialogActivarDescarga(curso: ICurso): void {
        this.cursoSeleccionado = curso
        this.dialogActivarDescarga.emit({ curso })
    }
}
