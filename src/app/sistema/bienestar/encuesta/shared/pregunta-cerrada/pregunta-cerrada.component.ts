import { PrimengModule } from '@/app/primeng.module'
import { Component, Input, TemplateRef } from '@angular/core'
import { FormControl } from '@angular/forms'
import { TextFieldModule } from '@angular/cdk/text-field'

@Component({
    selector: 'app-pregunta-cerrada',
    standalone: true,
    imports: [PrimengModule, TextFieldModule],
    templateUrl: './pregunta-cerrada.component.html',
    styleUrl: './pregunta-cerrada.component.scss',
})
export class PreguntaCerradaComponent {
    @Input() switchControl: FormControl = new FormControl()

    @Input() addonLabel: string = 'Campo'

    @Input() infoAdicional!: TemplateRef<any>

    @Input() iEncuPregId!: number

    alternativas: Array<any> = [
        { label: 'SI', value: 1 },
        { label: 'NO', value: 0 },
    ]
}
