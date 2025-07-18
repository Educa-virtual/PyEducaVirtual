import { StringCasePipe } from '@shared/pipes/string-case.pipe'
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    inject,
    Input,
    OnInit,
    Output,
} from '@angular/core'
import { MenuModule } from 'primeng/menu'
import { ButtonModule } from 'primeng/button'
import { MenuItem, MessageService } from 'primeng/api'
import { ICurso } from '@/app/sistema/aula-virtual/sub-modulos/cursos/interfaces/curso.interface'
import { environment } from '@/environments/environment'
import { CommonModule } from '@angular/common'
import { ApiEvaluacionesRService } from '@/app/sistema/ere/evaluaciones/services/api-evaluaciones-r.service'
import { Router } from '@angular/router'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { ESPECIALISTA_DREMO } from '@/app/servicios/seg/perfiles'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { DIRECTOR_IE, DOCENTE } from '@/app/servicios/perfilesConstantes'
import { PrimengModule } from '@/app/primeng.module'
import { ActivarDescargaComponent } from '../activar-descarga/activar-descarga.component'

@Component({
    selector: 'app-area-card',
    standalone: true,
    imports: [
        CommonModule,
        MenuModule,
        ButtonModule,
        StringCasePipe,
        PrimengModule,
        ActivarDescargaComponent,
    ],
    templateUrl: './area-card.component.html',
    styleUrl: './area-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreaCardComponent implements OnInit {
    private router: Router = inject(Router)
    private evaluacionesService = inject(ApiEvaluacionesRService)
    private _ConstantesService = inject(ConstantesService)

    mostrarActivarDescargas: boolean = false

    @Input() iEvaluacionIdHashed: string = ''
    @Input() curso: ICurso
    backend = environment.backend

    selectedData = []
    acciones: MenuItem[] = []
    iPerfilId: number = this._ConstantesService.iPerfilId
    @Output() dialogSubirArchivoEvent = new EventEmitter<{
        curso: ICurso
    }>()
    @Output() dialogConfigurarNivelLogroEvent = new EventEmitter<{
        curso: ICurso
    }>()
    @Output() dialogImportarResultados = new EventEmitter<{
        curso: ICurso
    }>()
    @Output() dialogGuardarResultadosOnline = new EventEmitter<{
        curso: ICurso
    }>()

    constructor(
        private store: LocalStoreService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.acciones = [
            {
                label: 'Gestionar preguntas',
                icon: 'pi pi-angle-right',
                command: () => {
                    this.router.navigate([
                        `ere/evaluaciones/${this.iEvaluacionIdHashed}/areas/${this.curso.iCursosNivelGradId}/preguntas`,
                    ])
                },
                disabled:
                    this.iPerfilId === DIRECTOR_IE ||
                    this.iPerfilId === DOCENTE,
            },
            {
                label: 'Descargar matriz',
                icon: 'pi pi-angle-right',
                command: () => {
                    if (this.curso.bDescarga == '0' || !this.curso.bDescarga) {
                        alert('La descarga de la matriz no está activada')
                    } else {
                        this.descargarMatrizPorEvaluacionArea()
                    }
                },
            },
            {
                label: 'Config. nivel de logro',
                icon: 'pi pi-angle-right',
                command: () => {
                    this.dialogConfigurarNivelLogroEvent.emit({
                        curso: this.curso,
                    })
                },
                disabled: this.iPerfilId !== ESPECIALISTA_DREMO,
            },
            {
                label: 'Exportar a Word',
                icon: 'pi pi-angle-right',
                command: () => {
                    if (this.curso.iCantidadPreguntas == 0) {
                        alert('No hay preguntas para exportar')
                    } else {
                        this.descargarArchivoPreguntasWord()
                    }
                },
                disabled: this.iPerfilId !== ESPECIALISTA_DREMO,
            },
            {
                label: 'Subir eval. en PDF',
                icon: 'pi pi-angle-right',
                command: () => {
                    this.dialogSubirArchivoEvent.emit({
                        curso: this.curso,
                    })
                },
                disabled: this.iPerfilId !== ESPECIALISTA_DREMO,
            },
            {
                label: 'Descargar eval. en PDF',
                icon: 'pi pi-angle-right',
                command: () => {
                    if (this.curso.bTieneArchivo) {
                        this.descargarArchivoPreguntasPorArea('pdf')
                    } else {
                        alert('No se ha subido un archivo para esta área.')
                    }
                },
            },
            {
                label: 'Descargar hoja de respuestas',
                icon: 'pi pi-angle-right',
                command: () => {
                    this.descargarCartillaRespuestas()
                },
            },
            {
                label: 'Subir resultados por archivo Excel',
                icon: 'pi pi-upload',
                command: () => {
                    this.dialogImportarResultados.emit({
                        curso: this.curso,
                    })
                },
                disabled:
                    this.iPerfilId !== DIRECTOR_IE &&
                    this.iPerfilId !== ESPECIALISTA_DREMO,
            },
            {
                label: 'Subir resultados en linea',
                icon: 'pi pi-upload',
                command: () => {
                    this.dialogGuardarResultadosOnline.emit({
                        curso: this.curso,
                    })
                },
                disabled:
                    this.iPerfilId !== DIRECTOR_IE &&
                    this.iPerfilId !== ESPECIALISTA_DREMO,
            },
            /*{
                label: 'Activar matriz',
                icon: '',
                command: () => {
                    this.mostrarActivarDescargas = true
                },
                disabled: this.iPerfilId !== ADMINISTRADOR_DREMO,
            },*/
        ]
    }

    updateUrl(item) {
        item.cCursoImagen = 'cursos/images/no-image.jpg'
    }

    /**
     * No se usará para descargar el archivo en Word porque está habiendo problemas con el cliente de Angular
     * @param tipoArchivo
     */
    descargarArchivoPreguntasPorArea(tipoArchivo: string) {
        const params = {
            iEvaluacionId: this.iEvaluacionIdHashed,
            iCursosNivelGradId: this.curso.iCursosNivelGradId,
            tipoArchivo: tipoArchivo,
        }
        const extension = tipoArchivo === 'pdf' ? 'pdf' : 'docx'
        this.evaluacionesService
            .descargarArchivoPreguntasPorArea(params)
            .subscribe({
                next: (response: Blob) => {
                    const url = window.URL.createObjectURL(response)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `Evaluacion ${this.curso.cCursoNombre} ${this.curso.cGradoAbreviacion} ${this.curso.cNivelTipoNombre.replace('Educación', '')}.${extension}`
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

    descargarArchivoPreguntasWord() {
        const params = {
            iEvaluacionId: this.iEvaluacionIdHashed,
            iCursosNivelGradId: this.curso.iCursosNivelGradId,
            tipoArchivo: 'word',
        }
        this.evaluacionesService
            .descargarArchivoPreguntasPorArea(params)
            .subscribe({
                next: (response: Blob) => {
                    const url = window.URL.createObjectURL(response)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `${this.curso.cCursoNombre} ${this.curso.cGradoAbreviacion} ${this.curso.cNivelTipoNombre.replace('Educación', '')}.docx` //Por si se implementa el cambio de nombre ${this.curso.cCursoNombre} ${this.curso.cGradoAbreviacion} ${this.curso.cNivelTipoNombre.replace('Educación', '')}
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

    descargarCartillaRespuestas() {
        const params = {
            iEvaluacionId: this.iEvaluacionIdHashed,
            iCursosNivelGradId: this.curso.iCursosNivelGradId,
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

    descargarMatrizPorEvaluacionArea() {
        const user = this.store.getItem('dremoUser')
        const params = {
            iEvaluacionId: this.iEvaluacionIdHashed,
            iCursosNivelGradId: this.curso.iCursosNivelGradId,
            iDocenteId: user.iDocenteId,
        }

        this.evaluacionesService
            .descargarMatrizPorEvaluacionArea(params)
            .subscribe({
                next: (response: Blob) => {
                    const url = window.URL.createObjectURL(response)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `Matriz ${this.curso.cCursoNombre} ${this.curso.cGradoAbreviacion} ${this.curso.cNivelTipoNombre.replace('Educación', '')}.pdf`
                    a.click()
                    window.URL.revokeObjectURL(url)
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Problema al descargar el archivo',
                        detail: error.error.message,
                    })
                },
            })
    }

    importarResultados() {
        console.log('importar resultados')
    }
    cerrarActivarDescargas() {
        this.mostrarActivarDescargas = false
    }
    abrirActivarDescargas() {
        this.mostrarActivarDescargas = true
    }
}
