import { Component } from '@angular/core'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'

@Component({
    selector: 'app-resumen',
    standalone: true,
    imports: [ContainerPageComponent, TablePrimengComponent],
    templateUrl: './resumen.component.html',
    styleUrl: './resumen.component.scss',
})
export class ResumenComponent {}
