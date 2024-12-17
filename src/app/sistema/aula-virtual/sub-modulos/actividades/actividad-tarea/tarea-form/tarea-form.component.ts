import {
    Component,
    EventEmitter,
    inject,
    Output,
    Input,
    OnChanges,
} from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { GeneralService } from '@/app/servicios/general.service'
import { PrimengModule } from '@/app/primeng.module'
import { Message } from 'primeng/api'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete'
import { DatePipe } from '@angular/common'
import { TypesFilesUploadPrimengComponent } from '../../../../../../shared/types-files-upload-primeng/types-files-upload-primeng.component'
import { TooltipModule } from 'primeng/tooltip'

@Component({
    selector: 'app-tarea-form',
    standalone: true,
    imports: [PrimengModule, TypesFilesUploadPrimengComponent, TooltipModule],
    templateUrl: './tarea-form.component.html',
    styleUrl: './tarea-form.component.scss',
})
export class TareaFormComponent implements OnChanges {
    // Crea una instancia de la clase DatePipe para formatear fechas en español
    pipe = new DatePipe('es-ES')
    date = this.ajustarAHorarioDeMediaHora(new Date())
    // Indica que el tipo de archivo "file" está habilitado o permitido.
    typesFiles = {
        file: true,
        url: true,
        youtube: true,
        repository: false,
        image: false,
    }
    @Output() submitEvent = new EventEmitter<any>()
    @Output() cancelEvent = new EventEmitter<void>()

    @Input() contenidoSemana
    @Input() tarea

    semana: Message[] = []
    tareas = []
    filteredTareas: any[] | undefined
    nameEnlace: string = ''
    titleFileTareas: string = ''
    showModal: boolean = false

    private _formBuilder = inject(FormBuilder)
    private GeneralService = inject(GeneralService)
    private ConstantesService = inject(ConstantesService)
    minDate: Date

    ngOnChanges(changes): void {
        if (changes.contenidoSemana?.currentValue) {
            this.contenidoSemana = changes.contenidoSemana.currentValue
            this.semana = [
                {
                    severity: 'info',
                    detail:
                        this.contenidoSemana.cContenidoSemNumero +
                        ' SEMANA - ' +
                        this.contenidoSemana.cContenidoSemTitulo,
                },
            ]
        }
        if (changes.tarea?.currentValue) {
            this.tarea = changes.tarea.currentValue
            this.formTareas.patchValue(this.tarea)
            this.filesUrl = this.formTareas.value.cTareaArchivoAdjunto
                ? JSON.parse(this.formTareas.value.cTareaArchivoAdjunto)
                : []
            if (this.tarea.iTareaId) {
                this.formTareas.controls.dtFin.setValue(
                    new Date(this.formTareas.value.dtTareaFin)
                )
                this.formTareas.controls.dtInicio.setValue(
                    new Date(this.formTareas.value.dtTareaInicio)
                )
            }
        }
    }
    // Declaración de un formulario reactivo con el uso de FormBuilder para la creación y configuración de los controles.
    public formTareas = this._formBuilder.group({
        bReutilizarTarea: [false],
        dtInicio: [this.date, Validators.required],
        dtFin: [new Date(this.ajustarAHorarioDeMediaHora(new Date()).setHours(this.date.getHours() + 1)), Validators.required],

        iTareaId: [],
        cTareaTitulo: ['', [Validators.required]],
        cTareaDescripcion: ['', [Validators.required]],

        dtTareaInicio: ['', [Validators.required]],
        dtTareaFin: ['', [Validators.required]],

        cTareaArchivoAdjunto: [],
        cTareaIndicaciones: [''],
        dFechaEvaluacionPublicacion: [''],
        tHoraEvaluacionPublicacion: [''],
        dFechaEvaluacionPublicacionInicio: [],
        tHoraEvaluacionPublicacionInicio: [''],
        dFechaEvaluacionPublicacionFin: [],
        tHoraEvaluacionPublicacionFin: [''],

        //TABLA: PROGRACION_ACTIVIDADES
        iProgActId: [],
        iContenidoSemId: [],
        iActTipoId: [],
        dtProgActInicio: [],
        dtProgActFin: [],
        cProgActTituloLeccion: [''],
        cProgActDescripcion: [''],
        dtProgActPublicacion: [],
    })


    ajustarAHorarioDeMediaHora(fecha) {
        const minutos = fecha.getMinutes(); // Obtener los minutos actuales
        const minutosAjustados = minutos <= 30 ? 30 : 0; // Decidir si ajustar a 30 o 0 (hora siguiente)
        if (minutos > 30) {
          fecha.setHours(fecha.getHours() + 1); // Incrementar la hora si los minutos pasan de 30
        }
        fecha.setMinutes(minutosAjustados); // Ajustar los minutos
        fecha.setSeconds(0); // Opcional: Resetear los segundos a 0
        fecha.setMilliseconds(0); // Opcional: Resetear los milisegundos a 0
        return fecha;
      }

    getTareasxiCursoId() {
        // Verifica si la opción "bReutilizarTarea" en el formulario es verdadera
        if (this.formTareas.value.bReutilizarTarea) {
            // Si es verdadera, se crea un objeto de configuración para realizar una petición de tipo 'post'
            const params = {
                petition: 'post',
                group: 'aula-virtual',
                prefix: 'tareas',
                ruta: 'getTareasxiCursoId',
                data: {
                    opcion: 'CONSULTAR-TAREASxiCursoId',
                    iCredId: this.ConstantesService.iCredId,
                    iCursoId: this.contenidoSemana.iCursoId,
                },
                params: { skipSuccessMessage: true },
            }
            this.getInformation(params, 'get_tareas_reutilizadas')
        } else {
            this.formTareas.controls.cTareaTitulo.setValue(null)
        }
    }

    filterTareas(event: AutoCompleteCompleteEvent) {
        // Método que filtra las tareas de acuerdo con la consulta del usuario.
        const filtered: any[] = []
        const query = event.query
        for (let i = 0; i < (this.tareas as any[]).length; i++) {
            const tareas = (this.tareas as any[])[i]
            if (
                tareas.cTareaTitulo
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) == 0
            ) {
                filtered.push(tareas)
            }
        }
        this.filteredTareas = filtered
    }

    getFilterIndicaciones(event) {
        // Verifica si 'event' no es nulo o indefinido
        if (event) {
            this.formTareas.controls.cTareaDescripcion.setValue(
                event.cTareaDescripcion ? event.cTareaDescripcion : ''
            )
            // Asigna el valor de 'event.iProgActId' al control 'iProgActId' del formulario.
            // Si 'event.iProgActId' es nulo o indefinido, asigna 'null'.
            this.formTareas.controls.iProgActId.setValue(
                event.iProgActId ? event.iProgActId : null
            )
        }
    }
    /*Obtiene información general desde el servicio GeneralService.*/
    getInformation(params, accion) {
        this.GeneralService.getGralPrefix(params).subscribe({
            next: (response) => {
                this.accionBtnItem({ accion, item: response?.data })
            },
            complete: () => {},
            error: (error) => {
                console.log(error)
            },
        })
    }
    filesUrl = []
    accionBtnItem(elemento): void {
        const { accion } = elemento
        const { item } = elemento
        // let params
        switch (accion) {
            case 'get_tareas_reutilizadas':
                this.tareas = item
                this.filteredTareas = item
                break
            case 'close-modal':
                this.showModal = false
                break
            case 'subir-file-tareas':
                this.filesUrl.push({
                    type: 1, //1->file
                    nameType: 'file',
                    name: item.file.name,
                    size: item.file.size,
                    ruta: item.name,
                })
                break
            case 'url-tareas':
                this.filesUrl.push({
                    type: 2, //2->url
                    nameType: 'url',
                    name: item.name,
                    size: '',
                    ruta: item.ruta,
                })
                break
            case 'youtube-tareas':
                this.filesUrl.push({
                    type: 3, //3->youtube
                    nameType: 'youtube',
                    name: item.name,
                    size: '',
                    ruta: item.ruta,
                })
                break
        }
    }
    /*Esta función se encarga de formatear y establecer los valores de ciertos campos
 de un formulario, ajustando las fechas y horas a una zona horaria específica
  y asignando ciertos valores de campos a otros.*/

    submit() {
        // Obtener las fechas de inicio y fin
        let horaInicio = this.formTareas.value.dtInicio
        let horaFin = this.formTareas.value.dtFin

        // Sumar 30 minutos a las fechas (en milisegundos)
        if (horaInicio && horaFin) {
            horaInicio = new Date(horaInicio)
            horaFin = new Date(horaFin)
            horaInicio.setMinutes(horaInicio.getMinutes() + 30) // Sumar 30 minutos
            horaFin.setMinutes(horaFin.getMinutes() + 30) // Sumar 30 minutos
        }

        // Convertir las fechas a formato correcto sin coma
        const horaInicioStr =
            horaInicio
                ?.toLocaleString('en-GB', { timeZone: 'America/Lima' })
                .replace(',', '') || ''
        const horaFinStr =
            horaFin
                ?.toLocaleString('en-GB', { timeZone: 'America/Lima' })
                .replace(',', '') || ''

        // Establecer los valores en los controles de formulario
        this.formTareas.controls.dtTareaInicio.setValue(horaInicioStr)
        this.formTareas.controls.dtTareaFin.setValue(horaFinStr)
        this.formTareas.controls.dtProgActInicio.setValue(horaInicioStr)
        this.formTareas.controls.dtProgActFin.setValue(horaFinStr)

        // Establecer el título de la lección
        this.formTareas.controls.cProgActTituloLeccion.setValue(
            this.formTareas.value.cTareaTitulo
        )

        // Limpiar la etiqueta de <p-editor> y obtener solo el texto plano
        const rawDescripcion =
            this.formTareas.controls.cTareaDescripcion.value || ''
        const cleanDescripcion = this.stripHtml(rawDescripcion)

        this.formTareas.controls.cTareaDescripcion.setValue(cleanDescripcion)

        // Establecer la fecha de publicación
        this.formTareas.controls.dtProgActPublicacion.setValue(horaFinStr)

        // Convertir los archivos adjuntos en formato JSON
        this.formTareas.controls.cTareaArchivoAdjunto.setValue(
            JSON.stringify(this.filesUrl)
        )

        // Verificar si el formulario es inválido antes de emitir el evento
        if (this.formTareas.invalid) {
            this.formTareas.markAllAsTouched()
            return
        }

        const value = this.formTareas.value
        this.submitEvent.emit(value)
    }

    // Función para limpiar el HTML y obtener solo el texto
    stripHtml(html: string): string {
        const tempElement = document.createElement('div')
        tempElement.innerHTML = html
        return tempElement.innerText.trim()
    }

    imports: [
        TooltipModule,
        // otros módulos necesarios
    ]
}
