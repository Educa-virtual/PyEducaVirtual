import { CommonModule } from '@angular/common'
import { Component, inject, Input, OnInit } from '@angular/core'
import { CommonInputComponent } from '../../../../../../shared/components/common-input/common-input.component'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { EditorModule } from 'primeng/editor'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { ButtonModule } from 'primeng/button'
import { ApiEvaluacionesRService } from '@/app/sistema/evaluaciones/services/api-evaluaciones-r.service'
import { AutoCompleteModule } from 'primeng/autocomplete'

@Component({
    selector: 'app-encabezado-form',
    standalone: true,
    imports: [
        CommonModule,
        CommonInputComponent,
        ReactiveFormsModule,
        EditorModule,
        ButtonModule,
        AutoCompleteModule,
    ],
    templateUrl: './encabezado-form.component.html',
    styleUrl: './encabezado-form.component.scss',
})
export class EncabezadoFormComponent implements OnInit {
    @Input() encabezados = []
    encabezadosFiltered = this.encabezados
    private _fb = inject(FormBuilder)
    private _ref = inject(DynamicDialogRef)
    private _evaluacionesService = inject(ApiEvaluacionesRService)
    private _config = inject(DynamicDialogConfig)

    public encabezadoForm = this._fb.group({
        iEncabPregId: [0],
        cEncabPregTitulo: ['', Validators.required],
        cEncabPregContenido: ['', Validators.required],
        // iNivelGradoId: [null, Validators.required],
        iNivelGradoId: [1],
        // iEspecialistaId: [null, Validators.required],
        iEspecialistaId: [1],
        iCursoId: [1],
    })

    ngOnInit() {
        console.log(this._config.data.encabezado)

        this.patchValues(this._config.data.encabezado)
    }

    patchValues(encabezado) {
        this.encabezadoForm.patchValue(encabezado)
    }

    closeModal(data) {
        this._ref.close(data)
    }

    guardarActualizarEncabezado() {
        if (this.encabezadoForm.invalid) {
            this.encabezadoForm.markAllAsTouched()
            return
        }
        const data = this.encabezadoForm.value

        this._evaluacionesService.guardarActualizarPreguntas(data).subscribe({
            next: (resp: unknown) => {
                data.iEncabPregId = resp['data'].id
                this.closeModal(data)
            },
        })
    }

    search(event) {
        console.log(event)
    }
}
