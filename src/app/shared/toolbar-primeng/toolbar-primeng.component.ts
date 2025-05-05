import { PrimengModule } from '@/app/primeng.module'
import { Component, Input } from '@angular/core'

@Component({
    selector: 'app-toolbar-primeng',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './toolbar-primeng.component.html',
    styleUrl: './toolbar-primeng.component.scss',
})
export class ToolbarPrimengComponent {
    @Input() title: string = ''
    @Input() subtitle: string = ''
}
