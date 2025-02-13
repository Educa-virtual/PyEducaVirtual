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
import { environment } from '@/environments/environment.template'
import { CommonModule } from '@angular/common'
import { ApiEvaluacionesRService } from '@/app/sistema/evaluaciones/services/api-evaluaciones-r.service'
import { Router } from '@angular/router'

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
    @Input() iEvaluacionIdHashed: string = ''
    backend = environment.backend
    @Input() curso: ICurso
    selectedData = []
    acciones: MenuItem[] = []

    ngOnInit() {
        this.acciones = [
            {
                label: 'Gestionar preguntas',
                icon: 'pi pi-angle-right',
                command: () => {
                    console.log(
                        `ere/evaluaciones/${this.iEvaluacionIdHashed}/gestionar-preguntas/areas/${this.curso.iCursoId}`
                    )
                    this.router.navigate([
                        `ere/evaluaciones/${this.iEvaluacionIdHashed}/gestionar-preguntas/areas/${this.curso.iCursoId}`,
                    ])
                },
            },
            {
                label: 'Descargar matriz',
                icon: 'pi pi-angle-right',
                command: () => {},
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
            },
            {
                label: 'Descargar PDF',
                icon: 'pi pi-angle-right',
                command: () => {},
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
                iCursoId: this.curso.iCursoId,
            }
            this.evaluacionesService.exportarPreguntasPorArea(params)
        }
    }
}
