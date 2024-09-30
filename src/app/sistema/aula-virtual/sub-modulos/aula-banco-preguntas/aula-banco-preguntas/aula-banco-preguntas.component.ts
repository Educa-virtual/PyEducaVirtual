import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { DropdownModule } from 'primeng/dropdown'

@Component({
    selector: 'app-aula-banco-preguntas',
    standalone: true,
    imports: [
        CommonModule,
        TablePrimengComponent,
        DropdownModule,
        FormsModule,
        ContainerPageComponent,
    ],
    templateUrl: './aula-banco-preguntas.component.html',
    styleUrl: './aula-banco-preguntas.component.scss',
})
export class AulaBancoPreguntasComponent {}
