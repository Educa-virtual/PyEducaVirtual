import { StringCasePipe } from '@shared/pipes/string-case.pipe'
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    Input,
    OnInit,
} from '@angular/core'
import { MenuModule } from 'primeng/menu'
import { ButtonModule } from 'primeng/button'
import { MenuItem } from 'primeng/api'
import { ICurso } from '@/app/sistema/aula-virtual/sub-modulos/cursos/interfaces/curso.interface'
import { environment } from '@/environments/environment'
import { CommonModule } from '@angular/common'
import { ApiEvaluacionesRService } from '@/app/sistema/evaluaciones/services/api-evaluaciones-r.service'
import { Router } from '@angular/router'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { ESPECIALISTA_DREMO } from '@/app/servicios/seg/perfiles'
import { ConstantesService } from '@/app/servicios/constantes.service'

@Component({
    selector: 'app-gestionar-preguntas-card',
    standalone: true,
    imports: [CommonModule, MenuModule, ButtonModule, StringCasePipe],
    templateUrl: './gestionar-preguntas-card.component.html',
    styleUrl: './gestionar-preguntas-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GestionarPreguntasCardComponent implements OnInit {
    private router: Router = inject(Router)
    private evaluacionesService = inject(ApiEvaluacionesRService)
    private _ConstantesService = inject(ConstantesService)

    @Input() iEvaluacionIdHashed: string = ''
    backend = environment.backend
    @Input() curso: ICurso
    selectedData = []
    acciones: MenuItem[] = []
    iPerfilId: number = this._ConstantesService.iPerfilId

    constructor(private store: LocalStoreService) {}

    ngOnInit() {
        this.acciones = [
            {
                label: 'Gestionar preguntas',
                icon: 'pi pi-angle-right',
                command: () => {
                    this.router.navigate([
                        `ere/evaluaciones/${this.iEvaluacionIdHashed}/gestionar-preguntas/areas/${this.curso.iCursosNivelGradId}`,
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
                label: 'Exportar a Word',
                icon: 'pi pi-angle-right',
                command: () => {
                    this.exportarPreguntasPorArea()
                },
            },
            {
                label: 'Subir PDF',
                icon: 'pi pi-angle-right',
                command: () => {},
                disabled: this.iPerfilId !== ESPECIALISTA_DREMO,
            },
            {
                label: 'Descargar PDF',
                icon: 'pi pi-angle-right',
                command: () => {
                    this.descargarPreguntasPorArea()
                },
            },
        ]
    }

    updateUrl(item) {
        item.cCursoImagen = 'cursos/images/no-image.jpg'
    }

    exportarPreguntasPorArea() {
        if (this.curso.iCantidadPreguntas == 0) {
            alert('No hay preguntas para exportar')
        } else {
            const params = {
                iEvaluacionId: this.iEvaluacionIdHashed,
                iCursosNivelGradId: this.curso.iCursosNivelGradId,
            }
            this.evaluacionesService.exportarPreguntasPorArea(params)
        }
    }

    descargarPreguntasPorArea() {
        if (this.curso.bTieneArchivo) {
            const params = {
                iEvaluacionId: this.iEvaluacionIdHashed,
                iCursosNivelGradId: this.curso.iCursosNivelGradId,
            }
            this.evaluacionesService.descargarPreguntasPorArea(params)
        } else {
            alert('No se ha subido un archivo para esta área.')
        }
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
