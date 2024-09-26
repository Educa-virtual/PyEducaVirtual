import { Component, inject, OnInit } from '@angular/core'

/*BOTONES */
import { ButtonModule } from 'primeng/button'

/*MODAL */
import { DialogModule } from 'primeng/dialog'

/*INPUT TEXT */
import { InputTextModule } from 'primeng/inputtext'
import { InputTextareaModule } from 'primeng/inputtextarea'

//TAB
import { TabViewModule } from 'primeng/tabview'
import { DropdownModule } from 'primeng/dropdown'

import { IeparticipaComponent } from '../ieparticipa/ieparticipa.component'

import { ApiEvaluacionesRService } from '../../../services/api-evaluaciones-r.service'
import { Subject, takeUntil } from 'rxjs'
import { DynamicDialogRef } from 'primeng/dynamicdialog'
import {
    FormBuilder,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'
import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component'

interface TipoEvaluacion {
    idTipoEvalId: number
    cTipoEvalDescripcion: string
}
interface NivelEvaluacion {
    iNivelEvalId: number
    cNivelEvalNombre: string
}

@Component({
    selector: 'app-evaluaciones-form',
    standalone: true,
    imports: [
        ButtonModule,
        DialogModule,
        InputTextModule,
        InputTextareaModule,
        FormsModule,
        TabViewModule,
        IeparticipaComponent,
        DropdownModule,
        CommonInputComponent,
        ReactiveFormsModule,
    ],
    templateUrl: './evaluaciones-form.component.html',
    styleUrl: './evaluaciones-form.component.scss',
})
export class EvaluacionesFormComponent implements OnInit {
    private _formBuilder = inject(FormBuilder)
    private _ref = inject(DynamicDialogRef)

    public evaluacionFormGroup = this._formBuilder.group({
        idTipoEvalId: [null, [Validators.required]],
        iNivelEvalId: [null, [Validators.required]],
        cEvaluacionDescripcion: [null],
        cEvaluacionUrlDrive: [null],
        cEvaluacionUrlPlantilla: [null],
        cEvaluacionUrlManual: [null],
        cEvaluacionUrlMatriz: [null],
        dtEvaluacionLiberarMatriz: [null],
        dtEvaluacionLiberarCuadernillo: [null],
        dtEvaluacionLiberarResultados: [null],
        dtEvaluacionCreacion: [null, Validators.required],

        cEvaluacionNombre: [null, Validators.required],
    })

    private unsubscribe$: Subject<boolean> = new Subject()
    public params = {
        iCompentenciaId: 0,
        iCapacidadId: 0,
        iDesempenioId: 0,
        bPreguntaEstado: -1,
    }
    public data = []
    private _apiEre = inject(ApiEvaluacionesRService)
    tipoEvaluacion: TipoEvaluacion[] | undefined

    selectedTipoEvaluacion: TipoEvaluacion | undefined

    nivelEvaluacion: NivelEvaluacion[] | undefined
    selectedNivelEvaluacion: TipoEvaluacion | undefined
    fecha: string
    visible: boolean = false
    value!: string

    ngOnInit() {
        /*this.tipoEvaluacion = [
            { nombre: 'New York', id: 1 },
            { nombre: 'Rome', id: 1 }
        ];*/
        this.obtenerTipoEvaluacion()
        this.obtenerNivelEvaluacion()
    }

    obtenerTipoEvaluacion() {
        this._apiEre
            .obtenerTipoEvaluacion(this.params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (resp: unknown) => {
                    /*.competencias = resp['data']
                    this.competencias.unshift({
                        iCompentenciaId: 0,
                        cCompetenciaDescripcion: 'Todos',
                    })*/

                    this.tipoEvaluacion = resp['data']
                    //alert(JSON.stringify(this.data))
                    //this.sourceProducts = this.data
                },
            })
    }

    obtenerNivelEvaluacion() {
        this._apiEre
            .obtenerNivelEvaluacion(this.params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (resp: unknown) => {
                    /*.competencias = resp['data']
                    this.competencias.unshift({
                        iCompentenciaId: 0,
                        cCompetenciaDescripcion: 'Todos',
                    })*/

                    this.nivelEvaluacion = resp['data']
                    //alert(JSON.stringify(this.data))
                    //this.sourceProducts = this.data
                },
            })
    }
    onchange() {
        alert(JSON.stringify(this.selectedTipoEvaluacion))
        alert(this.fecha)
    }

    closeModal(data) {
        this._ref.close(data)
    }

    guardarActualizarAlternativa() {
        if (this.evaluacionFormGroup.invalid) {
            this.evaluacionFormGroup.markAllAsTouched()
            return
        }
    }
}
