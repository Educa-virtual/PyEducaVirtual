import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { PrimengModule } from '@/app/primeng.module'

@Component({
    selector: 'app-banco-preguntas',
    standalone: true,
    imports: [CommonModule, FormsModule, PrimengModule],
    templateUrl: './banco-preguntas.component.html',
    styleUrl: './banco-preguntas.component.scss',
})
export class BancoPreguntasComponent {}
