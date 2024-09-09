import { Component, Input } from '@angular/core'
import { PrimengModule } from 'src/app/primeng.module'

@Component({
    selector: 'app-container-page',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './container-page.component.html',
    styleUrl: './container-page.component.scss',
})
export class ContainerPageComponent {
    @Input() title: string = 'Titulo'
}
