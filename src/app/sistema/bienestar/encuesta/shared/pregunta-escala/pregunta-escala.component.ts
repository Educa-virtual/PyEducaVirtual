import { PrimengModule } from '@/app/primeng.module'
import { Component, Input, OnInit, TemplateRef } from '@angular/core'
import { FormControl } from '@angular/forms'
import { TextFieldModule } from '@angular/cdk/text-field'

@Component({
    selector: 'app-pregunta-escala',
    standalone: true,
    imports: [PrimengModule, TextFieldModule],
    templateUrl: './pregunta-escala.component.html',
    styleUrl: './pregunta-escala.component.scss',
})
export class PreguntaEscalaComponent implements OnInit {
    @Input() ratingControl: FormControl = new FormControl()

    @Input() addonLabel: string = 'Campo'

    @Input() infoAdicional!: TemplateRef<any>

    @Input() iEncuPregId!: number

    @Input() controlDisabled: boolean = false

    alternativas: Array<any> = [
        { label: 'MUY EN DESACUERDO / NUNCA', value: 1 },
        { label: 'ALGO EN DESACUERDO / CASI NUNCA', value: 2 },
        { label: 'NEUTRAL', value: 3 },
        { label: 'ALGO DE ACUERDO / CASI SIEMPRE', value: 4 },
        { label: 'MUY DE ACUERDO / SIEMPRE', value: 5 },
    ]

    ngOnInit(): void {
        if (this.controlDisabled) {
            this.ratingControl.disable()
        }
    }
}
