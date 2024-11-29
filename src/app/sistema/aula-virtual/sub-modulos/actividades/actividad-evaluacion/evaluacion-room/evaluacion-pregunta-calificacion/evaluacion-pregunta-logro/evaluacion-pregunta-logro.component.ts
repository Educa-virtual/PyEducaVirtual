import { PrimengModule } from '@/app/primeng.module'
import { ApiEvaluacionesService } from '@/app/sistema/aula-virtual/services/api-evaluaciones.service'
import { CommonModule } from '@angular/common'
import {
    Component,
    EventEmitter,
    inject,
    Input,
    OnInit,
    Output,
    OnDestroy,
} from '@angular/core'
import {
    FormArray,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'
import { Subject } from 'rxjs'

@Component({
    selector: 'app-evaluacion-pregunta-logro',
    standalone: true,
    imports: [CommonModule, PrimengModule, ReactiveFormsModule],
    templateUrl: './evaluacion-pregunta-logro.component.html',
    styleUrl: './evaluacion-pregunta-logro.component.scss',
})
export class EvaluacionPreguntaLogroComponent implements OnInit, OnDestroy {
    @Input() logrosCalificacion = []
    @Input() escalasCalificativas = []
    @Input() pregunta

    @Output() closeModalChange = new EventEmitter()
    formEvaluacionLogro: FormGroup

    private _formBuilder = inject(FormBuilder)
    private _apiEvalService = inject(ApiEvaluacionesService)
    private _unsubscribe$ = new Subject<boolean>()

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
            iEscalaCalifId: [logro.iEscalaCalifId, [Validators.required]],
            nNnivelLogroAlcNota: [
                logro.nNnivelLogroAlcNota,
                [Validators.required],
            ],
            cNivelLogroAlcConclusionDescriptiva: [
                logro.cNivelLogroAlcConclusionDescriptiva ?? null,
                [Validators.required],
            ],
            cNivelLogroEvaDescripcion: [logro.cNivelLogroEvaDescripcion],
            iNivelLogroEvaId: [logro.iNivelLogroEvaId],
            // estaEditando: [false],
        })
    }

    public guardarActualizarLogros() {
        if (this.formEvaluacionLogro.invalid) {
            this.formEvaluacionLogro.markAllAsTouched()
            return
        }

        const data = this.formEvaluacionLogro.value
        data.iEvalRptaId = this.pregunta.iEvalRptaId

        this._apiEvalService.calificarLogros(data).subscribe({
            next: (data) => {
                this.closeModalChange.emit({ esRubrica: false, data })
            },
        })
    }

    ngOnDestroy() {
        this._unsubscribe$.next(true)
        this._unsubscribe$.complete()
    }
}
