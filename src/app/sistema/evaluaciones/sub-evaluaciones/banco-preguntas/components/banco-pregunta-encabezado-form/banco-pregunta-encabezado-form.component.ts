import { CommonModule } from '@angular/common'
import { Component, inject, Input, OnInit } from '@angular/core'
import {
    ControlContainer,
    FormGroup,
    ReactiveFormsModule,
} from '@angular/forms'
import {
    AutoCompleteCompleteEvent,
    AutoCompleteModule,
} from 'primeng/autocomplete'
import { EditorModule } from 'primeng/editor'

export const sinEncabezadoObj = {
    iEncabPregId: -1,
    cEncabPregTitulo: 'Sin encabezado',
}

@Component({
    selector: 'app-banco-pregunta-encabezado-form',
    standalone: true,
    imports: [
        CommonModule,
        AutoCompleteModule,
        EditorModule,
        ReactiveFormsModule,
    ],
    templateUrl: './banco-pregunta-encabezado-form.component.html',
    styleUrl: './banco-pregunta-encabezado-form.component.scss',
})
export class BancoPreguntaEncabezadoFormComponent implements OnInit {
    @Input({ required: true }) controlKey: string
    @Input() encabezados = []
    private parentContainer = inject(ControlContainer)
    formGroup!: FormGroup
    encabezadosFiltered = []
    ngOnInit(): void {
        this.formGroup = this.parentFormGroup
    }

    get parentFormGroup() {
        return this.parentContainer.control?.get(this.controlKey) as FormGroup
    }

    search(event: AutoCompleteCompleteEvent) {
        const filtered = []
        const query = event.query

        for (let i = 0; i < this.encabezados.length; i++) {
            const encabezado = this.encabezados[i]
            if (
                encabezado.cEncabPregTitulo
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) == 0
            ) {
                filtered.push(encabezado)
            }
        }

        this.encabezadosFiltered = [sinEncabezadoObj, ...filtered]
    }
}