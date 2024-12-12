import { ConstantesService } from '@/app/servicios/constantes.service'
import { ApiEvaluacionesService } from '@/app/sistema/aula-virtual/services/api-evaluaciones.service'
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { FormBuilder } from '@angular/forms'

@Component({
    selector: 'app-rubrica-form-header',
    templateUrl: './rubrica-form-header.component.html',
    styleUrl: './rubrica-form-header.component.scss',
})
export class RubricaFormHeaderComponent implements OnInit {
    form: FormGroup
    @Input() rubricas
    @Input() mode

    @Output() sendRubrica = new EventEmitter<any>()
    match
    params
    @Input() rubricaForm: FormGroup

    filterRubricas = []

    enviar() {}

    buscarSugerencias(event: any) {
        const query = event.query ?? event.value.cInstrumentoNombre // Entrada del usuario
        this.filterRubricas = this.rubricas.filter((item) => {
            if (
                item.cInstrumentoNombre.toLowerCase() === query.toLowerCase() &&
                event.value
            ) {
                this.sendRubrica.emit(event.value)
            }

            // console.log(item.cInstrumentoNombre.toLowerCase() == query.toLowerCase());

            return item.cInstrumentoNombre
                .toLowerCase()
                .includes(query.toLowerCase())
        })
    }

    constructor(
        private _ConstantesService: ConstantesService,
        private _evaluacionService: ApiEvaluacionesService,
                private _activeRoute: ActivatedRoute,
                private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            filtroYear: [String(new Date().getFullYear())]
        })
    }

    ngOnInit(): void {
        this.obtenerRubricas()
        this.filterRubricas = this.rubricas
        
        this.form.valueChanges.subscribe((value) => {
            this.obtenerRubricas(value.filtroYear)
        })
    }

    obtenerRubricas(filtroYear = undefined) {
        console.log('filtroYear')
        console.log(filtroYear ? new Date(filtroYear).getFullYear() : filtroYear)

        this.params = {
            iDocenteId: this._ConstantesService.iDocenteId,
        }
        this._activeRoute.queryParams.subscribe((params) => {
            this.params.iCursoId = params['iCursoId'] ?? undefined
            this.params.idDocCursoId = params['idDocCursoId'] ?? undefined
        })

        this._evaluacionService.obtenerRubricas(this.params).subscribe({
            next: (data) => {
                data.forEach((element) => {
                    this.rubricas.push(element)
                })
            },
        })
    }
}
