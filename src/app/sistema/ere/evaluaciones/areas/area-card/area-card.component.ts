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
            },
            {
                label: 'Descargar matriz',
                icon: 'pi pi-angle-right',
                command: () => {
                    this.descargarMatrizPorEvaluacionArea()
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
            },
            {
                label: 'Subir PDF',
                icon: 'pi pi-angle-right',
                command: () => {
                    this.dialogSubirArchivoEvent.emit({
                        curso: this.curso,
                    })
                },
                disabled: this.iPerfilId !== ESPECIALISTA_DREMO,
            },
            {
                label: 'Descargar PDF',
                icon: 'pi pi-angle-right',
                command: () => {
                    if (this.curso.bTieneArchivo) {
                        this.descargarArchivoPreguntasPorArea('pdf')
                    } else {
                        alert('No se ha subido un archivo para esta área.')
                    }
                },
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
}
