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

import { EvaluacionAreasComponent } from './../evaluacion-areas/evaluacion-areas.component'

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
import { StepperModule } from 'primeng/stepper'
import { CommonModule } from '@angular/common'

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
        EvaluacionAreasComponent,
        StepperModule,
        CommonModule,
    ],
    templateUrl: './evaluaciones-form.component.html',
    styleUrl: './evaluaciones-form.component.scss',
})
export class EvaluacionesFormComponent implements OnInit {
    private _formBuilder = inject(FormBuilder)
    private _ref = inject(DynamicDialogRef)

    public evaluacionFormGroup = this._formBuilder.group({
        iEvaluacionId: [null, [Validators.required]], //borrar
        idTipoEvalId: [null, [Validators.required]],
        iNivelEvalId: [null, [Validators.required]],
        cEvaluacionDescripcion: [null, [Validators.required]],
        cEvaluacionUrlDrive: [null, [Validators.required]],
        cEvaluacionUrlPlantilla: [null, [Validators.required]],
        cEvaluacionUrlManual: [null, [Validators.required]],
        cEvaluacionUrlMatriz: [null, [Validators.required]],
        cEvaluacionObs: [null, [Validators.required]],
        dtEvaluacionLiberarMatriz: [null, [Validators.required]],
        dtEvaluacionLiberarCuadernillo: [null, [Validators.required]],
        dtEvaluacionLiberarResultados: [null, [Validators.required]],
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

    iEvaluacionId: any

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

    guardarEvaluacion() {
        const data = {
            //iEvaluacionId: this.evaluacionFormGroup.get('iEvaluacionId').value, //borrar
            idTipoEvalId: this.evaluacionFormGroup.get('idTipoEvalId').value,
            iNivelEvalId: this.evaluacionFormGroup.get('iNivelEvalId').value,
            //cambios desde aqui
            // dtEvaluacionCreacion: this.evaluacionFormGroup.get(
            //     'dtEvaluacionCreacion'
            // ).value,
            // dtEvaluacionCreacion: this.formatDate(
            //     this.evaluacionFormGroup.get('dtEvaluacionCreacion').value
            // ),
            // cEvaluacionNombre:
            //     this.evaluacionFormGroup.get('cEvaluacionNombre').value,
            // cEvaluacionDescripcion: this.evaluacionFormGroup.get(
            //     'cEvaluacionDescripcion'
            // ).value,
            // cEvaluacionUrlDrive: this.evaluacionFormGroup.get(
            //     'cEvaluacionUrlDrive'
            // ).value,
            // cEvaluacionUrlPlantilla: this.evaluacionFormGroup.get(
            //     'cEvaluacionUrlPlantilla'
            // ).value,
            // cEvaluacionUrlManual: this.evaluacionFormGroup.get(
            //     'cEvaluacionUrlManual'
            // ).value,
            // cEvaluacionUrlMatriz: this.evaluacionFormGroup.get(
            //     'cEvaluacionUrlMatriz'
            // ).value,
            // cEvaluacionObs:
            //     this.evaluacionFormGroup.get('cEvaluacionObs').value,
            // dtEvaluacionLiberarMatriz: this.evaluacionFormGroup.get(
            //     'dtEvaluacionLiberarMatriz'
            // ).value,
            // dtEvaluacionLiberarCuadernillo: this.evaluacionFormGroup.get(
            //     'dtEvaluacionLiberarCuadernillo'
            // ).value,
            // dtEvaluacionLiberarResultados: this.evaluacionFormGroup.get(
            //     'dtEvaluacionLiberarResultados'
            // ).value,
            // dtEvaluacionLiberarMatriz: this.formatDate(
            //     this.evaluacionFormGroup.get('dtEvaluacionLiberarMatriz').value
            // ),
            // dtEvaluacionLiberarCuadernillo: this.formatDate(
            //     this.evaluacionFormGroup.get('dtEvaluacionLiberarCuadernillo')
            //         .value
            // ),
            // dtEvaluacionLiberarResultados: this.formatDate(
            //     this.evaluacionFormGroup.get('dtEvaluacionLiberarResultados')
            //         .value
            // ),
        }
        console.log(data)

        this._apiEre
            .guardarEvaluacion(data)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (resp: any) => {
                    /*.competencias = resp['data']
                    this.competencias.unshift({
                        iCompentenciaId: 0,
                        cCompetenciaDescripcion: 'Todos',
                    })*/
                    this.iEvaluacionId = resp['data'][0]['iEvaluacionId'] // Captura el ID generado
                    console.log(
                        'ID de Evaluación guardado:',
                        this.iEvaluacionId
                    )
                    this.iEvaluacionId = resp['data'][0]['iEvaluacionId']

                    //alert(JSON.stringify(this.data))
                    //this.sourceProducts = this.data
                },
                error: (error) => {
                    console.error('Error al guardar la evaluación:', error) // Captura el error aquí
                    alert('Error en el servidor: ' + JSON.stringify(error))
                },
            })
    }
    //Formatao del Año,Mes,Dia -> para SQL SERVER
    formatDate(dateString: string): string {
        // Convierte a formato YYYY-MM-DD
        const date = new Date(dateString)
        return date.toISOString().split('T')[0] // Devuelve solo la parte de la fecha
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
        //alert(JSON.stringify(this.selectedTipoEvaluacion))
        //alert(this.fecha)
    }

    closeModal(data) {
        this._ref.close(data)
        console.log('Formulario de evaluación cancelado')

        // Resetear el formulario si es necesario
        this.evaluacionFormGroup.reset()
    }

    // notaInsertEvaluacion guardaractualizaralternativa es el verdadero
    // guardarActualizarAlternativa() {
    //     // if (this.evaluacionFormGroup.invalid) {
    //     //     this.evaluacionFormGroup.markAllAsTouched()
    //     //     return
    //     // }
    //     // alert('guardar')
    //     if (this.evaluacionFormGroup.valid) {
    //         console.log(
    //             'Datos del formulario de evaluación guardados:',
    //             this.evaluacionFormGroup.value
    //         )
    //         // Lógica para guardar el formulario (puede enviar los datos a Laravel, por ejemplo)
    //     } else {
    //         console.log('Formulario de evaluación no válido')
    //     }
    // }
    // guardarActualizarAlternativa() {
    //     if (this.evaluacionFormGroup.valid) {
    //         console.log(
    //             'Datos del formulario de evaluación guardados:',
    //             this.evaluacionFormGroup.value
    //         )

    //         // Llama al método del servicio para guardar los datos en la base de datos
    //         this._apiEre
    //             .guardarEvaluacion(this.evaluacionFormGroup.value)
    //             .pipe(takeUntil(this.unsubscribe$))
    //             .subscribe({
    //                 next: (response) => {
    //                     console.log('Evaluación guardada con éxito:', response)
    //                     // Aquí puedes agregar lógica adicional, como cerrar el modal o mostrar un mensaje de éxito
    //                     this.closeModal(true)
    //                 },
    //                 error: (error) => {
    //                     console.error('Error al guardar la evaluación:', error)
    //                     // Aquí puedes manejar el error, como mostrar un mensaje de error
    //                 },
    //             })
    //     } else {
    //         console.log('Formulario de evaluación no válido')
    //         this.evaluacionFormGroup.markAllAsTouched() // Resaltar todos los campos como tocados
    //     }
    // }
}
