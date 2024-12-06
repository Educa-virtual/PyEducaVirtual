import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component'
import { CommonModule } from '@angular/common'
import {
    Component,
    EventEmitter,
    inject,
    Input,
    OnInit,
    Output,
} from '@angular/core'
import {
    ControlContainer,
    FormGroup,
    ReactiveFormsModule,
    FormsModule,
} from '@angular/forms'
import { DropdownModule } from 'primeng/dropdown'
import { EditorModule } from 'primeng/editor'
import { ApiEvaluacionesRService } from '../../../../services/api-evaluaciones-r.service'
import { Subject, takeUntil } from 'rxjs'
import { InputTextModule } from 'primeng/inputtext'
// interface MatrizCompetencia {
//     iCompetenciaId: number
//     cCompetenciaNombre: string
// }
@Component({
    selector: 'app-banco-pregunta-informacion-form',
    standalone: true,
    imports: [
        CommonModule,
        DropdownModule,
        EditorModule,
        CommonInputComponent,
        ReactiveFormsModule,
        FormsModule,
        InputTextModule,
    ],
    templateUrl: './banco-pregunta-informacion-form.component.html',
    styleUrl: './banco-pregunta-informacion-form.component.scss',
})
export class BancoPreguntaInformacionFormComponent implements OnInit {
    @Input() tipoPreguntas = []
    @Input({ required: true }) controlKey = ''
    @Input() _iEvaluacionId: string | null = null // Aquí definimos el @Input
    @Output() payloadEmitido = new EventEmitter<any>() //Emitire el payload al Componente Padre
    // injeccion de dependencias
    private parentContainer = inject(ControlContainer)
    private _apiEre = inject(ApiEvaluacionesRService)
    formGroup!: FormGroup
    private unsubscribe$: Subject<boolean> = new Subject()
    public params = {}
    value: string = '' //! Vinculamos el campo de texto a esta propiedad Cambiar Value en html y aqui
    matrizCompetencia: any[] = [] // Opciones para el dropdown
    matrizCapacidad: any[] = [] // Opciones para el dropdown
    selectedCompetencia: any // Almacena la opción seleccionada
    selectedCapacidad: any // Almacena la opción seleccionada
    selectediEvaluacionId: any // Almacena la opción seleccionada
    matrizCapacidadFiltrada: any[] = [] //Filtrar Capacidad

    constructor() {}

    ngOnInit(): void {
        this.formGroup = this.parentFormGroup
        this.obtenerMatrizCompetencias()
        this.obtenerMatrizCapacidades()
        console.log(
            'Valor Recibido Banco Preguntas Form a Parte 2 Informacion Pregunta:',
            this._iEvaluacionId
        )

        // Si ya se tiene la capacidad seleccionada y quieres emitir el payload
        if (this.selectedCapacidad) {
            this.insertarMatrizDesempeno()
        }
    }

    // obtiene el formulario padre usando ControlContainer
    get parentFormGroup() {
        return this.parentContainer.control?.get(this.controlKey) as FormGroup
    }
    //!MatrizCompetencias
    obtenerMatrizCompetencias(): void {
        this._apiEre
            .obtenerMatrizCompetencias(this.params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (resp: any) => {
                    console.log('Respuesta completa de la API:', resp)

                    // Mapear los datos necesarios para el dropdown
                    this.matrizCompetencia = resp.data.fullData.map(
                        (item: any) => ({
                            iCompetenciaId: item.iCompetenciaId.toString(), // Convertir a string si es necesario
                            cCompetenciaNombre: item.cCompetenciaNombre,
                        })
                    )

                    console.log(
                        'Matriz de competencias:',
                        this.matrizCompetencia
                    )
                },
                error: (err) => {
                    console.error('Error al cargar datos:', err)
                },
            })
    }
    //!MatrizCapacidades
    obtenerMatrizCapacidades(): void {
        this._apiEre
            .obtenerMatrizCapacidades(this.params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (resp: any) => {
                    console.log('Respuesta completa de la API:', resp)

                    // Mapear los datos necesarios para el dropdown
                    this.matrizCapacidad = resp.data.fullData.map(
                        (item: any) => ({
                            iCapacidadId: item.iCapacidadId.toString(), // Convertir a string si es necesario
                            cCapacidadNombre: item.cCapacidadNombre,
                            iCompetenciaId: item.iCompetenciaId.toString(),
                        })
                    )

                    console.log('Matriz de Capacidades:', this.matrizCapacidad)
                },
                error: (err) => {
                    console.error('Error al cargar datos:', err)
                },
            })
    }

    onCompetenciaChange(event: any): void {
        console.log('Competencia seleccionada:', this.selectedCompetencia)
        this.matrizCapacidadFiltrada = this.matrizCapacidad.filter(
            (capacidad) => capacidad.iCompetenciaId === this.selectedCompetencia
        )
        console.log('Capacidades filtradas:', this.matrizCapacidadFiltrada)
        this.selectedCapacidad = null
        console.log('Valor del Evento', event)
    }
    onCapacidadChange(event: any): void {
        console.log('Capacidad seleccionada:', this.selectedCapacidad)

        // Puedes realizar cualquier acción adicional aquí
        const selectedCapacidadData = this.matrizCapacidad.find(
            (capacidad) => capacidad.iCapacidadId === this.selectedCapacidad
        )
        console.log(
            'Datos de la Capacidad seleccionada:',
            selectedCapacidadData
        )
        console.log('Valor del Evento', event)
        this.emitirPayload()
    }
    // Función para manejar la lógica de inserción
    insertarMatrizDesempeno() {
        console.log('Capacidad seleccionada:', this.selectedCapacidad)

        // Busca los datos de la capacidad seleccionada
        const selectedCapacidadData = this.matrizCapacidad.find(
            (capacidad) => capacidad.iCapacidadId === this.selectedCapacidad
        )
        if (selectedCapacidadData) {
            console.log(
                'Datos de la Capacidad seleccionada:',
                selectedCapacidadData
            )

            // Almacena los valores en variables separadas
            const iCapacidadId = selectedCapacidadData.iCapacidadId
            const iCompetenciaId = selectedCapacidadData.iCompetenciaId

            console.log('iCapacidadId:', iCapacidadId)
            console.log('iCompetenciaId:', iCompetenciaId)

            const payload = {
                // Valor ingresado en el input de texto
                iEvaluacionId: this._iEvaluacionId, // Si lo tienes definido
                iCompCursoId: 1, //Aqui se debe agregar, Dinamico
                iCapacidadId: iCapacidadId, // Usamos el valor de iCapacidadId obtenido
                cDesempenoDescripcion: this.value,
                //iCompetenciaId: iCompetenciaId, // Usamos el valor de iCompetenciaId obtenido
                cDesempenoConocimiento: 'Hola',
                iEstado: 1,
                iSesionId: 1,
            }

            console.log('Payload:', payload)

            // Emitir el payload al componente padre
            this.payloadEmitido.emit(payload)
        } else {
            console.log('Capacidad seleccionada no encontrada')
        }
    }
    //emitir el payload
    emitirPayload() {
        // Buscar la capacidad seleccionada
        const selectedCapacidadData = this.matrizCapacidad.find(
            (capacidad) => capacidad.iCapacidadId === this.selectedCapacidad
        )

        if (selectedCapacidadData) {
            const payload = {
                iEvaluacionId: this._iEvaluacionId,
                iCompCursoId: 1, // Este valor debe ser dinámico si es necesario
                iCapacidadId: selectedCapacidadData.iCapacidadId,
                cDesempenoDescripcion: this.value,
                cDesempenoConocimiento: 'Hola', // Este campo también es dinámico
                iEstado: 1,
                iSesionId: 1,
            }

            // Emitir el payload al componente padre
            this.payloadEmitido.emit(payload)
        }
    }
    // Cambiar valor del input
    onDesempenoDescripcionChange() {
        this.emitirPayload()
    }

    // Método que se ejecuta al enviar el formulario
    onSubmit(form: any) {
        if (form.valid) {
            console.log(
                'Formulario enviado con éxito',
                this.selectedCompetencia
            )
            this.insertarMatrizDesempeno()
        } else {
            console.log('Formulario no válido')
        }
    }
}
