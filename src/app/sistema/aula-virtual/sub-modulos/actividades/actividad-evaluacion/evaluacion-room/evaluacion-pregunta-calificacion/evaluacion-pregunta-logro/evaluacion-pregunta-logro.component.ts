import { PrimengModule } from '@/app/primeng.module'
import { CommonModule } from '@angular/common'
import { Component, inject, Input, OnInit } from '@angular/core'
import {
    FormArray,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'

@Component({
    selector: 'app-evaluacion-pregunta-logro',
    standalone: true,
    imports: [CommonModule, PrimengModule, ReactiveFormsModule],
    templateUrl: './evaluacion-pregunta-logro.component.html',
    styleUrl: './evaluacion-pregunta-logro.component.scss',
})
export class EvaluacionPreguntaLogroComponent implements OnInit {
    @Input() logrosCalificacion = []
    @Input() escalasCalificativas = []
    formEvaluacionLogro: FormGroup

    private _formBuilder = inject(FormBuilder)

    public get logrosCalificacionFormArray(): FormArray {
        return this.formEvaluacionLogro.get('logrosCalificacion') as FormArray
    }

    ngOnInit() {
        this.initForm()
    }

    initForm() {
        this.formEvaluacionLogro = this._formBuilder.group({
            logrosCalificacion: this._formBuilder.array([]),
        })

        // armar logros array
        this.construirLogrosArray()
    }

    construirLogrosArray() {
        this.logrosCalificacion.map((logro) => {
            this.logrosCalificacionFormArray.push(this.agregarLogroForm(logro))
        })
    }

    private agregarLogroForm(logro): FormGroup {
        return this._formBuilder.group({
            iNivelLogroAlcId: [logro.iNivelLogroAlcId],
            iEvalRptaId: [logro.iEvalRptaId],
            iEscalaCalifId: [{ value: logro.iEscalaCalifId, disabled: true }],
            nNnivelLogroAlcNota: [logro.nNnivelLogroAlcNota],
            cNivelLogroAlcConclusionDescriptiva: [
                logro.cNivelLogroAlcConclusionDescriptiva,
                [Validators.required],
            ],
            iNivelEvaId: [logro.iNivelEvaId],
            cNivelLogroEvaDescripcion: [logro.cNivelLogroEvaDescripcion],
            estaEditando: [false],
        })
    }

    public editarLogroRow(i) {
        this.logrosCalificacionFormArray.at(i).get('iEscalaCalifId').enable()
        this.logrosCalificacionFormArray.at(i).patchValue({
            estaEditando: true,
        })
    }
    public guardarActualizarLogro(i) {
        this.logrosCalificacionFormArray.at(i).get('iEscalaCalifId').disable()
        this.logrosCalificacionFormArray.at(i).patchValue({
            estaEditando: false,
        })
    }
}
