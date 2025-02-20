import { PrimengModule } from '@/app/primeng.module'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { TypesFilesUploadPrimengComponent } from '@/app/shared/types-files-upload-primeng/types-files-upload-primeng.component'
import { ApiEvaluacionesService } from '@/app/sistema/aula-virtual/services/api-evaluaciones.service'
import { NgIf } from '@angular/common'
import {
    Component,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    Output,
} from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { DialogService } from 'primeng/dynamicdialog'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { GeneralService } from '@/app/servicios/general.service'
import { ListPreguntasComponent } from '../list-preguntas/list-preguntas.component'
import { EVALUACION } from '@/app/sistema/aula-virtual/interfaces/actividad.interface'
import { MessageService } from 'primeng/api'
import { ApiAulaService } from '@/app/sistema/aula-virtual/services/api-aula.service'

/**
 * @Component Decorator que define la metadata del componente `FormEvaluacionComponent`.
 * Este componente representa un formulario de evaluación que permite la carga de archivos,
 * la selección de preguntas, y otras funcionalidades relacionadas.
 */
@Component({
    // Selector del componente para usarlo en plantillas HTML.
    selector: 'app-form-evaluacion',
    standalone: true,
    // Módulos e importaciones que utiliza este componente.
    imports: [
        PrimengModule,
        NgIf,
        TypesFilesUploadPrimengComponent,
        ListPreguntasComponent,
    ],
    templateUrl: './form-evaluacion.component.html',
    styleUrl: './form-evaluacion.component.scss',
})

/**
 * @class FormEvaluacionComponent
 * Componente para gestionar el formulario de evaluaciones.
 * Incluye funcionalidad para manejar evaluaciones, cursos y archivos relacionados.
 */
export class FormEvaluacionComponent implements OnChanges {
    private _FormBuilder = inject(FormBuilder)
    private _evaluacionService = inject(ApiEvaluacionesService)
    private _ConstantesService = inject(ConstantesService)
    private _ConfirmationModalService = inject(ConfirmationModalService)
    private _DialogService = inject(DialogService)
    private _store = inject(LocalStoreService)
    private _GeneralService = inject(GeneralService)
    private _MessageService = inject(MessageService)
    private _ApiAulaService = inject(ApiAulaService)

    @Output() accionBtnItem = new EventEmitter()
    @Input() showModalEvaluacion: boolean = false
    @Input() tituloEvaluacion: string
    @Input() opcionEvaluacion: string
    @Input() semana
    @Input() idDocCursoId
    @Input() semanaEvaluacion
    @Input() curso
    @Input() dataActividad

    /**
     * Fecha ajustada al horario más cercano de media hora.
     * Se inicializa con el resultado del método `ajustarAHorarioDeMediaHora`.
     * @type {Date}
     */

    date = this.ajustarAHorarioDeMediaHora(new Date())
    cursos = []
    tipoEvaluaciones = []
    filesUrl = []
    typesFiles = {
        file: true,
        url: true,
        youtube: true,
        repository: false,
        image: false,
    }
    /**
     * Identificador único de la evaluación.
     * @type {string}
     */
    iEvaluacionId: string
    /**
     * Propiedad que define qué vista se mostrará en el componente.
     * Puede tomar los valores:
     * - 'FORM-EVALUACION': Muestra el formulario de evaluación.
     * - 'LIST-PREGUNTAS': Muestra la lista de preguntas.
     * - 'FORM-PREGUNTAS': Muestra el formulario de preguntas.
     * @type {'FORM-EVALUACION' | 'LIST-PREGUNTAS' | 'FORM-PREGUNTAS'}
     */

    showMostrarVista: 'FORM-EVALUACION' | 'LIST-PREGUNTAS' | 'FORM-PREGUNTAS' =
        'FORM-EVALUACION'
    titulo: string

    /**
     * Formulario de evaluación con múltiples campos para capturar información relevante.
     */
    formEvaluacion = this._FormBuilder.group({
        opcion: [''],
        iEvaluacionId: [],
        iTipoEvalId: [1],
        iInstrumentoId: [],
        iEscalaCalifId: [],
        iDocenteId: [0, Validators.required],
        dtEvaluacionPublicacion: [],
        cEvaluacionTitulo: ['', Validators.required],
        cEvaluacionDescripcion: ['', Validators.required],
        cEvaluacionObjetivo: [],
        nEvaluacionPuntaje: [],
        iEvaluacionNroPreguntas: [],
        dtEvaluacionInicio: ['', Validators.required],
        dtEvaluacionFin: ['', Validators.required],
        iEvaluacionDuracionHoras: [],
        iEvaluacionDuracionMinutos: [],
        cEvaluacionArchivoAdjunto: [],

        /**
         * Inicializa las fechas de inicio y fin para un formulario, con la fecha de inicio establecida
         * en el valor de `this.date` y la fecha de fin ajustada a una hora posterior a la actual.
         */
        dtInicio: [this.date],
        dtFin: [
            new Date(
                this.ajustarAHorarioDeMediaHora(new Date()).setHours(
                    this.date.getHours() + 1
                )
            ),
            Validators.required,
        ],

        dFechaEvaluacionPublicacion: [],
        dFechaEvaluacionInico: [this.date],
        dFechaEvaluacionFin: [this.date],
        tHoraEvaluacionPublicacion: [],
        tHoraEvaluacionInico: [],
        tHoraEvaluacionFin: [],

        //Tabla:Programacion de Actividades
        iProgActId: [],
        iContenidoSemId: [],
        iActTipoId: [EVALUACION],
        dtProgActInicio: [],
        dtProgActFin: [],
        cProgActTituloLeccion: [''],
        cProgActDescripcion: [''],
        dtProgActPublicacion: [],
    })

    /**
     * Método que se ejecuta cuando hay cambios en las propiedades de entrada del componente.
     * Se utilizan para actualizar valores y realizar acciones según los cambios detectados.
     *
     * @param {SimpleChanges} changes - Objeto que contiene los cambios detectados en las propiedades de entrada.
     */

    ngOnChanges(changes) {
        // Si el valor de 'showModalEvaluacion' cambia, se actualiza y se obtiene el tipo de evaluaciones
        if (changes.showModalEvaluacion?.currentValue) {
            this.showModalEvaluacion = changes.showModalEvaluacion.currentValue
            this.obtenerTipoEvaluaciones()
        }

        if (changes.semanaEvaluacion?.currentValue) {
            this.semanaEvaluacion = changes.semanaEvaluacion.currentValue
        }
        if (changes.curso?.currentValue) {
            this.curso = changes.curso.currentValue
        }

        if (changes.dataActividad?.currentValue) {
            this.dataActividad = changes.dataActividad.currentValue
            this.dataActividad?.ixActivadadId ? this.obtenerEvaluacion() : null
        }
        // Lógica de control de vistas según el valor de 'showMostrarVista'
        switch (this.showMostrarVista) {
            case 'FORM-EVALUACION':
                this.titulo =
                    this.tituloEvaluacion +
                    ' EVALUACIÓN: ' +
                    this.curso?.cCursoNombre
                break
        }
    }

    /**
     * Obtiene los tipos de evaluaciones a través de un servicio y los asigna a la variable tipoEvaluaciones.
     *
     * Esta función realiza una llamada al servicio `_evaluacionService` para obtener los tipos de evaluaciones
     * y, al recibir la respuesta, asigna los datos a la propiedad `tipoEvaluaciones` del componente.
     */
    obtenerTipoEvaluaciones() {
        this._evaluacionService.obtenerTipoEvaluaciones().subscribe((data) => {
            this.tipoEvaluaciones = data
        })
    }

    /**
     * Obtiene la evaluación de la actividad desde el servicio API y actualiza el formulario de evaluación.
     *
     * Realiza una llamada al servicio `obtenerActividad()` del servicio `_ApiAulaService` para obtener los
     * datos de una evaluación basándose en el tipo de actividad y el ID de la actividad.
     * Luego, actualiza los valores del formulario `formEvaluacion`, incluyendo:
     * - Los valores de la evaluación, como archivo adjunto y fechas de inicio y fin.
     *
     * Se manejan las siguientes propiedades del formulario:
     * - `cEvaluacionArchivoAdjunto`: URL de los archivos adjuntos de la evaluación.
     * - `dtEvaluacionFin` y `dtEvaluacionInicio`: Fechas de fin y de inicio de la evaluación.
     *
     * @returns {void} No devuelve ningún valor, solo actualiza el formulario.
     */
    obtenerEvaluacion() {
        this._ApiAulaService
            .obtenerActividad({
                iActTipoId: EVALUACION,
                ixActivadadId: this.dataActividad?.ixActivadadId,
            })
            .subscribe({
                next: (data) => {
                    this.formEvaluacion.patchValue(data)
                    //console.log(typeof this.formEvaluacion.value.cEvaluacionArchivoAdjunto)
                    this.filesUrl =
                        this.formEvaluacion.value.cEvaluacionArchivoAdjunto
                    // this.filesUrl = this.formEvaluacion.value.cEvaluacionArchivoAdjunto.length>0
                    //     ? JSON.parse(this.formEvaluacion.value.cEvaluacionArchivoAdjunto)
                    //     : []
                    this.formEvaluacion.controls.dtFin.setValue(
                        new Date(this.formEvaluacion.value.dtEvaluacionFin)
                    )
                    this.formEvaluacion.controls.dtInicio.setValue(
                        new Date(this.formEvaluacion.value.dtEvaluacionInicio)
                    )
                },
            })
    }

    /**
     * Maneja las acciones del botón según el tipo de acción recibido.
     * Realiza diferentes operaciones como mostrar vistas, agregar archivos a la lista de URLs,
     * guardar o actualizar información, o abrir un modal con preguntas dependiendo del valor de la acción.
     *
     * @param {Object} elemento - Objeto que contiene los parámetros necesarios para realizar la acción.
     * @param {string} elemento.accion - Tipo de acción a realizar.
     * @param {Object} elemento.item - Datos relacionados con la acción.
     *
     * Acciones disponibles:
     * - 'close-modal': Cambia la vista mostrada a 'FORM-EVALUACION' y emite la acción y el item.
     * - 'subir-file-evaluacion': Agrega un archivo a la lista de archivos con la ruta especificada.
     * - 'url-evaluacion': Agrega una URL a la lista de archivos con la ruta proporcionada.
     * - 'youtube-evaluacion': Agrega un enlace de YouTube a la lista de archivos.
     * - 'GUARDAR' / 'ACTUALIZAR': Llama a la función `guardarActualizarFormInfo` para guardar o actualizar la información.
     * - 'GUARDARxProgActxiEvaluacionId' / 'ACTUALIZARxProgActxiEvaluacionId': Obtiene el ID de la evaluación y abre un modal con preguntas relacionadas.
     *
     * @returns {void}
     */
    accionBtn(elemento): void {
        const { accion } = elemento
        const { item } = elemento
        switch (accion) {
            case 'close-modal':
                this.showMostrarVista = 'FORM-EVALUACION'
                this.accionBtnItem.emit({ accion, item })
                break
            case 'subir-file-evaluacion':
                this.filesUrl.push({
                    type: 1, //1->file
                    nameType: 'file',
                    name: item.file.name,
                    size: item.file.size,
                    ruta: item.name,
                })
                break
            case 'url-evaluacion':
                this.filesUrl.push({
                    type: 2, //2->url
                    nameType: 'url',
                    name: item.name,
                    size: '',
                    ruta: item.ruta,
                })
                break
            case 'youtube-evaluacion':
                this.filesUrl.push({
                    type: 3, //3->youtube
                    nameType: 'youtube',
                    name: item.name,
                    size: '',
                    ruta: item.ruta,
                })
                break
            case 'GUARDAR':
            case 'ACTUALIZAR':
                this.guardarActualizarFormInfo()
                break
            case 'GUARDARxProgActxiEvaluacionId':
            case 'ACTUALIZARxProgActxiEvaluacionId':
                this.iEvaluacionId = item.length
                    ? item[0]['iEvaluacionId']
                    : null
                this.openModalListPreguntas()
                break
        }
    }

    /**
     * Función para guardar o actualizar la información de la evaluación y la programación de actividades.
     *
     * Esta función obtiene los valores del formulario de evaluación, procesa las fechas y horas de inicio,
     * fin y publicación de la evaluación, y luego construye un objeto `data` que es enviado al backend.
     * Dependiendo de la opción seleccionada, se guarda o actualiza la información de la evaluación y la
     * programación de actividades.
     *
     * @returns {void} No retorna ningún valor. La función se encarga de manejar el proceso de guardado o
     *                  actualización.
     */
    private guardarActualizarFormInfo() {
        this.formEvaluacion.controls.dFechaEvaluacionInico.setValue(
            this.formEvaluacion.value.dtInicio
        )
        this.formEvaluacion.controls.dFechaEvaluacionFin.setValue(
            this.formEvaluacion.value.dtFin
        )

        const data = this.formEvaluacion.getRawValue()
        data.iDocenteId = this._ConstantesService.iDocenteId
        data.iActTipoId = EVALUACION
        data.iContenidoSemId = this.semanaEvaluacion.iContenidoSemId

        let horaInicio: any = data.dFechaEvaluacionInico.toLocaleString(
            'en-GB',
            {
                timeZone: 'America/Lima',
            }
        )
        let horaFin: any = data.dFechaEvaluacionFin.toLocaleString('en-GB', {
            timeZone: 'America/Lima',
        })
        horaInicio = horaInicio.split(',')
        horaFin = horaFin.split(',')

        this.formEvaluacion.controls['dFechaEvaluacionPublicacion'].setValue(
            horaInicio[0]
        )
        this.formEvaluacion.controls['tHoraEvaluacionPublicacion'].setValue(
            horaInicio[1].replace(' ', '')
        )
        this.formEvaluacion.controls['dFechaEvaluacionInico'].setValue(
            horaInicio[0]
        )
        this.formEvaluacion.controls['tHoraEvaluacionInico'].setValue(
            horaInicio[1].replace(' ', '')
        )
        this.formEvaluacion.controls['dFechaEvaluacionFin'].setValue(horaFin[0])
        this.formEvaluacion.controls['tHoraEvaluacionFin'].setValue(
            horaFin[1].replace(' ', '')
        )

        data.dFechaEvaluacionPublicacion = horaInicio[0]
        data.tHoraEvaluacionPublicacion = horaInicio[1].replace(' ', '')

        data.dFechaEvaluacionInico = horaInicio[0]
        data.tHoraEvaluacionInico = horaInicio[1].replace(' ', '')

        data.dFechaEvaluacionFin = horaFin[0]
        data.tHoraEvaluacionFin = horaFin[1].replace(' ', '')

        if (
            data.dFechaEvaluacionPublicacion &&
            data.tHoraEvaluacionPublicacion
        ) {
            data.dtEvaluacionPublicacion =
                data.dFechaEvaluacionPublicacion +
                ' ' +
                data.tHoraEvaluacionPublicacion
        }
        if (data.dFechaEvaluacionInico && data.tHoraEvaluacionInico) {
            data.dtEvaluacionInicio =
                data.dFechaEvaluacionInico + ' ' + data.tHoraEvaluacionInico
            this.formEvaluacion.controls.dtEvaluacionInicio.setValue(
                data.dtEvaluacionInicio
            )
        }

        if (data.dFechaEvaluacionFin && data.tHoraEvaluacionFin) {
            data.dtEvaluacionFin =
                data.dFechaEvaluacionFin + ' ' + data.tHoraEvaluacionFin
            this.formEvaluacion.controls.dtEvaluacionFin.setValue(
                data.dtEvaluacionFin
            )
        }

        //PROGRAMACIÓN ACTIVIDADES
        data.dtProgActInicio = data.dtEvaluacionInicio
        data.dtProgActFin = data.dtEvaluacionFin
        data.cProgActTituloLeccion = data.cEvaluacionTitulo
        data.dtProgActPublicacion = data.dtEvaluacionPublicacion

        if (this.formEvaluacion.invalid) {
            this.formEvaluacion.markAllAsTouched()
            return
        }

        data.cEvaluacionArchivoAdjunto = JSON.stringify(this.filesUrl)

        if (this.opcionEvaluacion === 'GUARDAR') {
            data.opcion = 'GUARDARxProgActxiEvaluacionId'
        } else {
            data.opcion = 'ACTUALIZARxProgActxiEvaluacionId'
        }

        const params = {
            petition: 'post',
            group: 'aula-virtual',
            prefix: 'programacion-actividades',
            ruta: 'store',
            data: data,
            params: { skipSuccessMessage: true },
        }

        this.getInformation(params, data.opcion)
    }

    /**
     * Abre un modal de confirmación para agregar o actualizar preguntas.
     * Dependiendo de la opción de evaluación ('GUARDAR' o 'ACTUALIZAR'), el modal muestra un mensaje
     * con la acción correspondiente y actualiza el estado de la vista y el título del formulario.
     *
     * Si el usuario acepta la acción, la vista se cambia a 'LIST-PREGUNTAS' y el título se actualiza con
     * la opción de evaluación y el nombre del curso. Si el usuario rechaza, se cierra el modal sin realizar
     * ninguna acción adicional.
     *
     * @method openModalListPreguntas
     * @returns {void} No devuelve ningún valor, solo ejecuta la lógica de apertura del modal y
     * realiza cambios en el estado de la vista y título.
     */
    openModalListPreguntas() {
        const accion =
            this.opcionEvaluacion === 'GUARDAR' ? 'agregar' : 'actualizar'
        this._ConfirmationModalService.openConfirm({
            header: '¿Deseas ' + accion + ' preguntas?',
            accept: () => {
                this.showMostrarVista = 'LIST-PREGUNTAS'
                this.titulo =
                    this.opcionEvaluacion +
                    ' PREGUNTAS PARA: ' +
                    this.curso?.cCursoNombre
            },
            reject: () => {
                this.accionBtn({ accion: 'close-modal', item: [] })
            },
        })
    }

    /**
     * Obtiene información desde el servicio y ejecuta una acción con la respuesta.
     *
     * @param {any} params - Los parámetros necesarios para realizar la solicitud.
     * @param {string} accion - La acción que se debe ejecutar una vez obtenida la respuesta.
     */
    getInformation(params, accion) {
        this._GeneralService.getGralPrefix(params).subscribe({
            next: (response) => {
                this.accionBtn({ accion, item: response?.data })
            },
            complete: () => {},
            error: (error) => {
                console.log(error)
                this._MessageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error,
                })
            },
        })
    }

    /**
     * Ajusta la hora de la fecha proporcionada a la media hora más cercana.
     * Si los minutos son menores o iguales a 30, los ajusta a 30. Si son mayores, ajusta a la siguiente hora.
     *
     * @param {Date} fecha - La fecha que se va a ajustar.
     * @returns {Date} - La fecha ajustada con minutos en 0 o 30, y segundos y milisegundos en 0.
     */

    ajustarAHorarioDeMediaHora(fecha) {
        const minutos = fecha.getMinutes() // Obtener los minutos actuales
        const minutosAjustados = minutos <= 30 ? 30 : 0 // Decidir si ajustar a 30 o 0 (hora siguiente)
        if (minutos > 30) {
            fecha.setHours(fecha.getHours() + 1) // Incrementar la hora si los minutos pasan de 30
        }
        fecha.setMinutes(minutosAjustados)
        fecha.setSeconds(0)
        fecha.setMilliseconds(0)
        return fecha
    }
}
