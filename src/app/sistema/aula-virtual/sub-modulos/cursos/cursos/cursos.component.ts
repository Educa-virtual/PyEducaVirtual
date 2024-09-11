import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { CardModule } from 'primeng/card'
import { DataViewModule } from 'primeng/dataview'
import { TableModule } from 'primeng/table'
import { TablePrimengComponent } from '../../../../../shared/table-primeng/table-primeng.component'

@Component({
    selector: 'app-cursos',
    standalone: true,
    imports: [
        CommonModule,
        ContainerPageComponent,
        CardModule,
        DataViewModule,
        TableModule,
        TablePrimengComponent,
    ],
    templateUrl: './cursos.component.html',
    styleUrl: './cursos.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CursosComponent {
    sortField: string = ''
    sortOrder: number = 0
}
