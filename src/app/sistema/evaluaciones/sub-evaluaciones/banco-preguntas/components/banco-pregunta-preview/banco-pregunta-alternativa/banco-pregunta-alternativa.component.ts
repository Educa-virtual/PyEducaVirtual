import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { IconComponent } from '../../../../../../../shared/icon/icon.component'
import { PrimengModule } from '@/app/primeng.module'
import { EditorOnlyViewDirective } from '@/app/shared/directives/editor-only-view.directive'

@Component({
    selector: 'app-banco-pregunta-alternativa',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        IconComponent,
        PrimengModule,
        EditorOnlyViewDirective,
    ],
    templateUrl: './banco-pregunta-alternativa.component.html',
    styleUrl: './banco-pregunta-alternativa.component.scss',
})
export class BancoPreguntaAlternativaComponent {
    @Input({ required: true }) alternativa
    @Input({ required: true }) pregunta
}
