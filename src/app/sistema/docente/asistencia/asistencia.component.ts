import { PrimengModule } from '@/app/primeng.module'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { GeneralService } from '@/app/servicios/general.service'
import { Component, OnInit, Input, inject } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Subject, takeUntil } from 'rxjs'
import { CalendarOptions } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'
interface Data {
    accessToken: string
    refreshToken: string
    expires_in: number
    msg?
    data?
    validated?: boolean
    code?: number
}
@Component({
    selector: 'app-asistencia',
    standalone: true,
    imports: [ContainerPageComponent, PrimengModule, TablePrimengComponent],
    templateUrl: './asistencia.component.html',
    styleUrl: './asistencia.component.scss',
})
export class AsistenciaComponent implements OnInit {
    public events: any[] = []
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
     */
    calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        slotLabelFormat: { hour: 'numeric', minute: '2-digit', hour12: false },
        initialView: 'dayGridMonth',
        locales: [esLocale],
        weekends: true,
        height: '100%',
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
        this.events.filter((evento) => {
            if (evento.grupo == valor && checkbox.mostrar == true) {
                evento.display = 'block'
            }
            if (evento.grupo == valor && checkbox.mostrar == false) {
                evento.display = 'none'
            }
        })
        this.calendarOptions.events = Object.assign([], this.events)
    }

    // * Se encarga de seleccionar la fecha de Asistencia
    handleDateClick(item) {
        this.getAsistencia(item.dateStr)
        this.fechaActual = item.dateStr
    }

    showDialog(id: number) {
        console.log(id)
        this.visible = true
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
     * @param categories Muestra los datos del checkbox
     */
    categories: any[] = [
        {
            name: 'Asistencias',
            valor: 'asistencias',
            id: 1,
            mostrar: true,
            estilo: 'cyan-checkbox',
        },
        {
            name: 'Festividades',
            valor: 'festividades',
            id: 2,
            mostrar: true,
            estilo: 'pink-checkbox',
        },
        {
            name: 'Programacion de Actividades',
            valor: 'actividades',
            id: 3,
            mostrar: true,
            estilo: 'green-checkbox',
        },
    ]

    visible: boolean = false

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
        { iTipoAsiId: '1', cTipoAsiLetra: 'A' },
        { iTipoAsiId: '2', cTipoAsiLetra: 'T' },
        { iTipoAsiId: '3', cTipoAsiLetra: 'N' },
        { iTipoAsiId: '4', cTipoAsiLetra: 'J' },
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
        this.indice = (this.iTipoAsiId + 6) % 5
        this.data[index]['iTipoAsiId'] =
            this.tipoMarcado[this.indice]['iTipoAsiId']
        this.data[index]['cTipoAsiLetra'] =
            this.tipoMarcado[this.indice]['cTipoAsiLetra']
        this.data[index]['dtCtrlAsistencia'] = this.fechaActual
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
                this.events = item
                this.calendarOptions.events = item
                break
            default:
                break
        }
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
