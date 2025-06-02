import { Component } from '@angular/core'
import { ToolbarPrimengComponent } from '../../../shared/toolbar-primeng/toolbar-primeng.component'
import { PrimengModule } from '@/app/primeng.module'

@Component({
    selector: 'app-instructores',
    standalone: true,
    imports: [ToolbarPrimengComponent, PrimengModule],
    templateUrl: './instructores.component.html',
    styleUrl: './instructores.component.scss',
})
export class InstructoresComponent {}
