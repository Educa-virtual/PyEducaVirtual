import { PrimengModule } from '@/app/primeng.module'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { Component } from '@angular/core'

@Component({
    selector: 'app-backup-bd',
    standalone: true,
    imports: [ContainerPageComponent, PrimengModule],
    templateUrl: './backup-bd.component.html',
    styleUrl: './backup-bd.component.scss',
})
export class BackupBdComponent {
    titulo: string = 'Crear backup de Base de Datos'
}
