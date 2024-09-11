import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
    selector: 'app-cursos',
    standalone: true,
    imports: [CommonModule, ContainerPageComponent, TablePrimengComponent],
    templateUrl: './cursos.component.html',
    styleUrl: './cursos.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CursosComponent {}
