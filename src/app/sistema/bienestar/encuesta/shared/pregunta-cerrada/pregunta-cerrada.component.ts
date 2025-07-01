import { PrimengModule } from '@/app/primeng.module'
import { Component, Input, OnInit, TemplateRef } from '@angular/core'
import { FormControl } from '@angular/forms'
import { TextFieldModule } from '@angular/cdk/text-field'

@Component({
    selector: 'app-pregunta-cerrada',
    standalone: true,
    imports: [PrimengModule, TextFieldModule],
    templateUrl: './pregunta-cerrada.component.html',
    styleUrl: './pregunta-cerrada.component.scss',
})
export class PreguntaCerradaComponent implements OnInit {
    @Input() switchControl: FormControl = new FormControl()

    @Input() addonLabel: string = 'Campo'

    @Input() infoAdicional!: TemplateRef<any>

    @Input() iEncuPregId!: number

    @Input() controlDisabled: boolean = false

    alternativas: Array<any> = [
        { label: 'SI', value: 1 },
        { label: 'NO', value: 0 },
    ]

    ngOnInit() {
        if (this.controlDisabled) {
            this.switchControl.disable()
        }
    }
}
