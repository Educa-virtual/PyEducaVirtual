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
import { MenuItem } from 'primeng/api'
import { ICurso } from '@/app/sistema/aula-virtual/sub-modulos/cursos/interfaces/curso.interface'
import { environment } from '@/environments/environment'
import { CommonModule } from '@angular/common'
import { ApiEvaluacionesRService } from '@/app/sistema/ere/evaluaciones/services/api-evaluaciones-r.service'
import { Router } from '@angular/router'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { ESPECIALISTA_DREMO } from '@/app/servicios/seg/perfiles'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { DIRECTOR_IE } from '@/app/servicios/perfilesConstantes'

@Component({
    selector: 'app-area-card',
    standalone: true,
    imports: [CommonModule, MenuModule, ButtonModule, StringCasePipe],
    templateUrl: './area-card.component.html',
    styleUrl: './area-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreaCardComponent implements OnInit {
    private router: Router = inject(Router)
    private evaluacionesService = inject(ApiEvaluacionesRService)
    private _ConstantesService = inject(ConstantesService)

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

    constructor(private store: LocalStoreService) {}

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
                disabled: this.iPerfilId === DIRECTOR_IE,
            },
            {
                label: 'Descargar matriz',
                icon: 'pi pi-angle-right',
                command: () => {
                    this.descargarMatrizPorEvaluacionArea()
                },
                disabled: this.iPerfilId === DIRECTOR_IE,
            },
            {
                label: 'Config. nivel de logro',
                icon: 'pi pi-angle-right',
                command: () => {
                    this.dialogConfigurarNivelLogroEvent.emit({
                        curso: this.curso,
                    })
                },
                disabled: this.iPerfilId === DIRECTOR_IE,
            },
            {
                label: 'Exportar a Word',
                icon: 'pi pi-angle-right',
                command: () => {
                    if (this.curso.iCantidadPreguntas == 0) {
                        alert('No hay preguntas para exportar')
                    } else {
                        this.descargarArchivoPreguntasPorArea('word')
                    }
                },
                disabled: this.iPerfilId === DIRECTOR_IE,
            },
            {
                label: 'Subir eval. PDF',
                icon: 'pi pi-angle-right',
                command: () => {
                    this.dialogSubirArchivoEvent.emit({
                        curso: this.curso,
                    })
                },
                disabled:
                    this.iPerfilId == DIRECTOR_IE ||
                    this.iPerfilId !== ESPECIALISTA_DREMO,
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
                label: 'Subir resultados',
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
        ]
    }

    updateUrl(item) {
        item.cCursoImagen = 'cursos/images/no-image.jpg'
    }

    descargarArchivoPreguntasPorArea(tipoArchivo: string) {
        const params = {
            iEvaluacionId: this.iEvaluacionIdHashed,
            iCursosNivelGradId: this.curso.iCursosNivelGradId,
            tipoArchivo: tipoArchivo,
        }
        this.evaluacionesService.descargarArchivoPreguntasPorArea(params)
    }

    descargarMatrizPorEvaluacionArea() {
        const user = this.store.getItem('dremoUser')
        const params = {
            iEvaluacionId: this.iEvaluacionIdHashed,
            iCursosNivelGradId: this.curso.iCursosNivelGradId,
            iDocenteId: user.iDocenteId,
        }
        this.evaluacionesService.descargarMatrizPorEvaluacionArea(params)
    }

    importarResultados() {
        console.log('importar resultados')
    }
}
