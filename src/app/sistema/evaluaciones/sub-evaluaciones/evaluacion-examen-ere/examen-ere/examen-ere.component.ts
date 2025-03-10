import { Component, inject, Input } from '@angular/core'
import { ContainerPageComponent } from '../../../../../shared/container-page/container-page.component'
import { Router, RouterModule } from '@angular/router'
import { environment } from '@/environments/environment'
import { PrimengModule } from '@/app/primeng.module'

@Component({
    selector: 'app-examen-ere',
    standalone: true,
    imports: [RouterModule, ContainerPageComponent, PrimengModule],
    templateUrl: './examen-ere.component.html',
    styleUrl: './examen-ere.component.scss',
})
export class ExamenEreComponent {
    @Input() iEvaluacionId: string = ''
    @Input() cEvaluacionNombre: string = ''
    @Input() cursos: any = []

    private router = inject(Router)

    backend = environment.backend
    updateUrl(item) {
        item.cCursoImagen = 'cursos/images/no-image.jpg'
    }
    irMostrarEvaluacion(curso) {
        this.router.navigate([
            `ere/mostrar-evaluacion/${this.iEvaluacionId}/areas/${curso.iCursoNivelGradId}/${this.cEvaluacionNombre}/${curso.cCursoNombre}`,
        ])
    }
}
