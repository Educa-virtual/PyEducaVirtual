import { Component, inject, OnInit } from '@angular/core'
/*Droodwn*/
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'
import { DropdownModule } from 'primeng/dropdown'
import { InputSwitchModule } from 'primeng/inputswitch'

//EDITOR
import { EditorModule } from 'primeng/editor'

/*Tab */
import { TabViewModule } from 'primeng/tabview'

/*Input text */
import { InputTextModule } from 'primeng/inputtext'
/*import alternativa*/
import { AlternativasComponent } from '../alternativas/alternativas.component'
/*acordion */
import { AccordionModule } from 'primeng/accordion'

import { ButtonModule } from 'primeng/button'
import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { ApiEvaluacionesService } from '../../../services/api-evaluaciones.service'
import { StepsModule } from 'primeng/steps'
@Component({
    selector: 'app-banco-preguntas-form',
    standalone: true,
    imports: [
        DropdownModule,
        InputSwitchModule,
        EditorModule,
        TabViewModule,
        InputTextModule,
        AlternativasComponent,
        ButtonModule,
        AccordionModule,
        ReactiveFormsModule,
        CommonInputComponent,
        StepsModule,
    ],
    templateUrl: './banco-preguntas-form.component.html',
    styleUrl: './banco-preguntas-form.component.scss',
})
export class BancoPreguntasFormComponent implements OnInit {
    public tipoPreguntas = []
    public alternativas = []
    public mode: 'EDITAR' | 'CREAR' = 'CREAR'
    public pregunta
    public pasos = [
        {
            label: 'Información Pregunta',
        },
        {
            label: 'Alternativas',
        },
    ]
    public activeIndex = 0

    private _formBuilder = inject(FormBuilder)
    private _config = inject(DynamicDialogConfig)
    private _evaluacionesService = inject(ApiEvaluacionesService)
    private _ref = inject(DynamicDialogRef)

    public bancoPreguntasForm: FormGroup = this._formBuilder.group({
        iPreguntaId: [0],
        iTipoPregId: [null, [Validators.required]],
        iCursoId: [null, [Validators.required]],
        cPregunta: [null, [Validators.required]],
        cPreguntaTextoAyuda: [''],
        iPreguntaNivel: [null, [Validators.required]],
        iPreguntaPeso: [null, [Validators.required]],
        // dtPreguntaTiempo: [null, [Validators.required]],
        iHoras: [0, [Validators.required]],
        iMinutos: [0, [Validators.required]],
        iSegundos: [0, [Validators.required]],
        cPreguntaClave: [null, [Validators.required]],
    })

    ngOnInit() {
        this.tipoPreguntas = this._config.data.tipoPreguntas
        this.pregunta = this._config.data.pregunta

        this.patchForm(this.pregunta, this._config.data.iCursoId)

        if (this.pregunta?.iPreguntaId !== 0) {
            this.mode = 'EDITAR'
            this.obtenerAlternativas()
        }
    }

    goStep(opcion: string) {
        switch (opcion) {
            case 'next':
                if (this.activeIndex === 0 && this.bancoPreguntasForm.invalid) {
                    this.bancoPreguntasForm.markAllAsTouched()
                    return
                }
                if (this.activeIndex !== 1) {
                    this.activeIndex++
                }
                break
            case 'back':
                if (this.activeIndex !== 0) {
                    this.activeIndex--
                }
                break
        }
    }

    obtenerAlternativas() {
        this._evaluacionesService
            .obtenerAlternativaByPreguntaId(this.pregunta.iPreguntaId)
            .subscribe({
                next: (resp: unknown) => {
                    this.alternativas = resp['data']
                },
            })
    }

    patchForm(pregunta, iCursoId) {
        this.bancoPreguntasForm.patchValue(pregunta)
        this.bancoPreguntasForm.get('iCursoId').setValue(iCursoId)
    }

    closeModal(data) {
        this._ref.close(data)
    }

    guardarActualizarBancoPreguntas() {
        if (this.bancoPreguntasForm.invalid) {
            this.bancoPreguntasForm.markAllAsTouched()
            return
        }

        if (this.alternativas.length == 0) {
            return
        }

        const pregunta = this.bancoPreguntasForm.value
        pregunta.datosAlternativas = this.alternativas
        if (this.mode == 'CREAR') {
            this._evaluacionesService
                .guardarPreguntaConAlternativas(pregunta)
                .subscribe({
                    next: () => {
                        this.closeModal(pregunta)
                    },
                })
        }
        if (this.mode == 'EDITAR') {
            this._evaluacionesService
                .actualizarBancoPreguntas(pregunta)
                .subscribe({
                    next: () => {
                        this.closeModal(pregunta)
                    },
                })
        }
    }
}
