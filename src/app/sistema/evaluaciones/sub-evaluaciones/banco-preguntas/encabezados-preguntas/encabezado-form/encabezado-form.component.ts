import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { CommonInputComponent } from '../../../../../../shared/components/common-input/common-input.component'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { EditorModule } from 'primeng/editor'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { ApiEvaluacionesService } from '../../../../services/api-evaluaciones.service'
import { ButtonModule } from 'primeng/button'

@Component({
    selector: 'app-encabezado-form',
    standalone: true,
    imports: [
        CommonModule,
        CommonInputComponent,
        ReactiveFormsModule,
        EditorModule,
        ButtonModule,
    ],
    templateUrl: './encabezado-form.component.html',
    styleUrl: './encabezado-form.component.scss',
})
export class EncabezadoFormComponent implements OnInit {
    private _fb = inject(FormBuilder)
    private _ref = inject(DynamicDialogRef)
    private _evaluacionesService = inject(ApiEvaluacionesService)
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
}
