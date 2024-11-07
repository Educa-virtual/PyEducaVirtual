import { PrimengModule } from '@/app/primeng.module'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { GeneralService } from '@/app/servicios/general.service'
import { Component, OnInit, Input, inject } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Subject, takeUntil } from 'rxjs'
import { CalendarOptions } from '@fullcalendar/core'
import { Data } from '../interfaces/asistencia.interface' // * exportando intefaces
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es' // * traduce el Modulo de calendario a español

@Component({
    selector: 'app-asistencia',
    standalone: true,
    imports: [ContainerPageComponent, PrimengModule, TablePrimengComponent],
    templateUrl: './asistencia.component.html',
    styleUrl: './asistencia.component.scss',
})
export class AsistenciaComponent implements OnInit {
    @Input() iCursoId: string
    @Input() iNivelGradoId: string
    @Input() iSeccionId: string
    private GeneralService = inject(GeneralService)
    private unsubscribe$ = new Subject<boolean>()

    cCursoNombre: string
    constructor(
        //private GeneralService: GeneralService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
        this.activatedRoute.params.subscribe((params) => {
            this.iCursoId = params['iCursoId']
            this.cCursoNombre = params['cCursoNombre']
        })
    }

    ngOnInit() {
        this.getObtenerAsitencias()
        this.getFechasImportantes()
    }

    /**
     * @param fechaActual Guarda la fecha actual para la asistencia
     */
    formatoFecha: Date = new Date()
    fechaActual =
        this.formatoFecha.getFullYear() +
        '-' +
        (this.formatoFecha.getMonth() + 1) +
        '-' +
        this.formatoFecha.getDate()

    /**
     * calendarOptions
     * * Se encarga de mostrar el calendario
     * @param locales Traduce el calendario a español
     * @param events Se encarga de mostrar las actividades programadas por hora y fecha
     * @param dayMaxEvents limita los eventos del dia para que se desborden del calendario
     */
    events: any[] = []
    calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        slotLabelFormat: { hour: 'numeric', minute: '2-digit', hour12: false },
        initialView: 'dayGridMonth',
        locales: [esLocale],
        weekends: true,
        selectable: true,
        dayMaxEvents: true,
        // eventShortHeight: 30,
        dateClick: (item) => this.handleDateClick(item),
        headerToolbar: {
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
            center: 'title',
            start: 'prev,next today',
        },
    }

    /**
     *
     * @param checkbox Muestra si el estado del checkbox es true or false
     * @param valor Se encarga de enviar el tipo de filtro que se aplique en el calendario
     */
    filterCalendario(checkbox: any, valor: any) {
        this.events.map((evento) => {
            if (evento.grupo == valor && checkbox.mostrar == true) {
                evento.display = 'block'
                console.log(evento)
            }
            if (evento.grupo == valor && checkbox.mostrar == false) {
                evento.display = 'none'
                console.log(evento)
            }
        })
        this.calendarOptions.events = Object.assign([], this.events)
    }

    // * Se encarga de seleccionar la fecha de Asistencia
    handleDateClick(item) {
        this.getAsistencia(item.dateStr)
        this.fechaActual = item.dateStr
    }

    /**
     * updateActividad
     * * Muestra una ventana Modal para poder cambiar el nombre de la programacion de actividad
     */

    visible: boolean = false // * Muestra la ventana modal
    strId: string = '' // * Almacena el id de la actividad
    strTitulo: string = '' // * Almacena el titulo de la actividad

    editActividad(id: any, titulo: any) {
        this.visible = true
        this.strId = id
        this.strTitulo = titulo
    }

    escapeModal() {
        this.visible = false
        this.strId = ''
        this.strTitulo = ''
    }

    leyenda = [
        { significado: 'Asistio', simbolo: 'X' },
        { significado: 'Inasistencia', simbolo: 'I' },
        { significado: 'Inasistencia Justificada', simbolo: 'J' },
        { significado: 'Tardanza', simbolo: 'T' },
        { significado: 'Tardanza Justificada', simbolo: 'P' },
        { significado: 'Sin Registro', simbolo: '-' },
    ]

    /**
     * @param categories Muestra los datos del checkbox
     */
    categories: any[] = [
        {
            name: 'Asistencias',
            valor: 'asistencias',
            mostrar: true,
            estilo: 'cyan-checkbox',
        },
        {
            name: 'Festividades',
            valor: 'festividades',
            mostrar: true,
            estilo: 'pink-checkbox',
        },
        {
            name: 'Programacion de Actividades',
            valor: 'actividades',
            mostrar: true,
            estilo: 'green-checkbox',
        },
    ]

    valSelect1: string = ''
    valSelect2: number = 0

    data = []

    /**
     * changeAsistencia
     * * Esta funcion cambia los estados de asistencia del alumno
     * @param tipoMarcado guarda los estados del boton de asistencia
     * @indice limite el cambio de los valores del boton
     * @iTipoAsiId extraemos el indice
     */

    tipoMarcado = [
        { iTipoAsiId: '7', cTipoAsiLetra: '-' },
        { iTipoAsiId: '1', cTipoAsiLetra: 'X' },
        { iTipoAsiId: '2', cTipoAsiLetra: 'T' },
        { iTipoAsiId: '3', cTipoAsiLetra: 'I' },
        { iTipoAsiId: '4', cTipoAsiLetra: 'J' },
        { iTipoAsiId: '9', cTipoAsiLetra: 'P' },
    ]

    iTipoAsiId = 0
    indice = 0

    changeAsistencia(index) {
        if (this.data[index]['iTipoAsiId'] == null) {
            this.data[index]['iTipoAsiId'] = this.tipoMarcado[0]['iTipoAsiId']
            this.data[index]['cTipoAsiLetra'] =
                this.tipoMarcado[0]['cTipoAsiLetra']
        }

        this.iTipoAsiId = this.tipoMarcado.findIndex(
            (tipo) => tipo.iTipoAsiId == this.data[index]['iTipoAsiId']
        )
        this.indice = (this.iTipoAsiId + 7) % 6
        this.data[index]['iTipoAsiId'] =
            this.tipoMarcado[this.indice]['iTipoAsiId']
        this.data[index]['cTipoAsiLetra'] =
            this.tipoMarcado[this.indice]['cTipoAsiLetra']
        this.data[index]['dtCtrlAsistencia'] = this.fechaActual
    }

    goAreasEstudio() {
        this.router.navigate(['aula-virtual/areas-curriculares'])
    }

    accionBtnItem(elemento): void {
        const { accion } = elemento
        const { item } = elemento

        switch (accion) {
            case 'ingresar':
                this.router.navigate(['./docente/detalle-asistencia'])
                break
            case 'get_data':
                this.getObtenerAsitencias()
                this.getFechasImportantes()
                break
            case 'get_asistencia':
                this.data = item
                break
            case 'get_fecha_importante':
                this.calendarOptions.events = item
                this.events = item
                break
            default:
                break
        }
    }

    /**
     * updateActividad
     * * Se encarga de actualizar las tareas del calendario
     * @param iTareaId Es el id de tareas
     * @param cTareaTitulo Es el titulo de la tarea
     */

    updateActividad() {
        const params = {
            petition: 'post',
            group: 'aula-virtual',
            prefix: 'tareas',
            ruta: 'update',
            data: {
                opcion: 'ACTUALIZAR_TITULO_TAREA',
                iTareaId: this.strId,
                cTareaTitulo: this.strTitulo,
            },
            params: { skipSuccessMessage: true },
        }

        this.getInformation(params, 'get_data')

        this.strId = ''
        this.strTitulo = ''
        this.visible = false
    }

    // * Registro de asistencia del alumno

    storeAsistencia() {
        const params = {
            petition: 'post',
            group: 'docente',
            prefix: 'asistencia',
            ruta: 'list',
            data: {
                opcion: 'GUARDAR_ASISTENCIA_ESTUDIANTE',
                iCursoId: this.iCursoId,
                asistencia_json: JSON.stringify(this.data),
                dtCtrlAsistencia: this.fechaActual,
            },
            params: { skipSuccessMessage: true },
        }

        this.getInformation(params, 'get_data')
    }

    /**
     * getFechasImportantes
     * * Se encarga de Obtener de mostras lo siguientes actividades:
     * * Fechas de actividades Escolares
     * * Asistencia del Año escolar
     * * Actividades Programadas
     */

    getFechasImportantes() {
        const params = {
            petition: 'post',
            group: 'docente',
            prefix: 'fechas_importantes',
            ruta: 'list',
            data: {
                opcion: 'CONSULTAR_FECHAS_IMPORTANTES',
            },
            params: { skipSuccessMessage: true },
        }
        this.getInformation(params, 'get_fecha_importante')
    }

    /**
     * getAsistencia
     * * Se encarga de Obtener la asistencia por dia seleccionado
     */

    getAsistencia(fechas) {
        const params = {
            petition: 'post',
            group: 'docente',
            prefix: 'asistencia',
            ruta: 'list',
            data: {
                opcion: 'CONSULTAR_ASISTENCIA_FECHA',
                iCursoId: this.iCursoId,
                dtCtrlAsistencia: fechas,
            },
            params: { skipSuccessMessage: true },
        }
        this.getInformation(params, 'get_asistencia')
    }

    /**
     * getReportePdf
     * * Obtiene el reporte de asistnecia (Mensual, semana y diario)
     */

    getReportePdf(tipoReporte: number) {
        const params = {
            petition: 'get',
            group: 'docente',
            prefix: 'reporte_mensual',
            ruta: 'report',
            data: {
                opcion: 'REPORTE_MENSUAL',
                iCursoId: this.iCursoId,
                dtCtrlAsistencia: this.fechaActual,
                tipoReporte: tipoReporte,
            },
            params: { skipSuccessMessage: true },
        }
        this.GeneralService.getGralReporte(params)
    }

    getObtenerAsitencias() {
        const params = {
            petition: 'post',
            group: 'docente',
            prefix: 'asistencia',
            ruta: 'list',
            data: {
                opcion: 'CONSULTAR_ASISTENCIA_FECHA',
                iCursoId: this.iCursoId,
                dtCtrlAsistencia: this.fechaActual,
            },
            params: { skipSuccessMessage: true },
        }
        this.getInformation(params, 'get_asistencia')
    }
    getInformation(params, accion) {
        this.GeneralService.getGralPrefix(params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (response: Data) => {
                    this.accionBtnItem({ accion, item: response?.data })
                },
                complete: () => {},
            })
    }
}
