import { PrimengModule } from '@/app/primeng.module'
import { Component } from '@angular/core'

@Component({
    selector: 'app-portafolio',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './portafolio.component.html',
    styleUrl: './portafolio.component.scss',
})
export class PortafolioComponent {
    cursos = [
        {
            cNombreCurso: 'Comunicación',
        },
        {
            cNombreCurso: 'Matemática',
        },
        {
            cNombreCurso: 'Educación Religiosa',
        },
        {
            cNombreCurso: 'Ciencia y Tecnología',
        },
    ]
}
