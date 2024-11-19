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
import { MessageService } from 'primeng/api'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { ReporteAsistenciaComponent } from './reporte-asistencia/reporte-asistencia.component'

@Component({
    selector: 'app-asistencia',
    standalone: true,
    imports: [
        ContainerPageComponent,
        PrimengModule,
        TablePrimengComponent,
        ReporteAsistenciaComponent,
    ],
    templateUrl: './asistencia.component.html',
    styleUrl: './asistencia.component.scss',
})
export class AsistenciaComponent implements OnInit {
    @Input() iCursoId: string
    @Input() iDocenteId: string
    @Input() iGradoId: string
    @Input() iYAcadId: string
    @Input() iNivelGradoId: string
    @Input() iSeccionId: string
    @Input() cSeccion: string
    @Input() cGradoAbreviacion: string
    @Input() cNivelTipoNombre: string
    @Input() cNivelNombreCursos: string
    @Input() nombrecompleto: string
    @Input() cCicloRomanos: string

    private GeneralService = inject(GeneralService)
    private unsubscribe$ = new Subject<boolean>()
    private _LocalStoreService = inject(LocalStoreService)
    private _ConstantesService = inject(ConstantesService)

    cCursoNombre: string
    constructor(
        private messageService: MessageService,
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
        this.getFechasImportantes()
    }

    /**
     * @param fechaActual Guarda la fecha actual para la asistencia
     */

    formatoFecha: Date = new Date()
    fechaActual = this.formatoFecha.toISOString().split('T')[0]
    limitado = this.formatoFecha.getDay()

    confFecha: any = {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }

    fechaEspecifica = this.formatoFecha.toLocaleDateString(
        'es-PE',
        this.confFecha
    )

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
        height: 600,
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
            }
            if (evento.grupo == valor && checkbox.mostrar == false) {
                evento.display = 'none'
            }
        })
        this.calendarOptions.events = Object.assign([], this.events)
    }

    mostrarModal: number = 0
    fechaCaptura = this.fechaActual
    // * Se encarga de seleccionar la fecha de Asistencia
    handleDateClick(item) {
        this.fechaActual = item.dateStr
        const dia = new Date(this.fechaActual + 'T00:00:00')
        this.limitado = dia.getDay()
        this.fechaEspecifica = dia.toLocaleDateString('es-PE', this.confFecha)

        if (this.limitado != 6 && this.limitado != 0) {
            if (this.fechaCaptura == this.fechaActual) {
                this.mostrarModal++
                if (this.mostrarModal == 1) {
                    this.verAsistencia = true
                    this.mostrarModal = 0
                    this.fechaCaptura = ''
                    this.getAsistencia(item.dateStr)
                }
                this.mostrarModal = 0
            } else {
                this.fechaCaptura = this.fechaActual
                this.mostrarModal = 0
            }
        }
    }
    showModal = false
    modalReporte() {
        this.showModal = true
        // this.verReporte = true
    }

    /**
     * updateActividad
     * * Muestra una ventana Modal para poder cambiar el nombre de la programacion de actividad
     */

    fechaDia = new Date()
    verAsistencia: boolean = false // * Muestra la ventana modal
    strId: string = '' // * Almacena el id de la actividad
    strTitulo: string = '' // * Almacena el titulo de la actividad

    editActividad(id: any, titulo: any) {
        this.verAsistencia = true
        this.strId = id
        this.strTitulo = titulo
    }

    escapeModal() {
        this.verAsistencia = false
        this.strId = ''
        this.strTitulo = ''
    }

    captura = ''
    capturarMes = 0
    countAsistencias() {
        this.events.filter((index) => {
            this.captura = index.title.split(' : ')
            const capturar = this.captura[0]
            const suma = parseInt(this.captura[1])
            this.capturarMes = new Date(index.start).getMonth() + 1
            const fechas = this.formatoFecha.getMonth() + 1

            this.leyenda[0].contar +=
                capturar == 'Asistio' && this.capturarMes == fechas ? suma : 0
            this.leyenda[1].contar +=
                capturar == 'Inasistencia' && this.capturarMes == fechas
                    ? suma
                    : 0
            this.leyenda[2].contar +=
                capturar == 'Inasistencia Justificada' &&
                this.capturarMes == fechas
                    ? suma
                    : 0
            this.leyenda[3].contar +=
                capturar == 'Tardanza' && this.capturarMes == fechas ? suma : 0
            this.leyenda[4].contar +=
                capturar == 'Tardanza Justificada' && this.capturarMes == fechas
                    ? suma
                    : 0
            this.leyenda[5].contar +=
                capturar == 'Sin Registro' && this.capturarMes == fechas
                    ? suma
                    : 0
        })
    }
    countAsistenciasModal() {
        // devuelve en 0 las cantidades de tipos de asistencias
        this.leyendaModal.forEach((index) => {
            return (index.contar = 0)
        })

        this.data.filter((index) => {
            const suma = 1
            this.captura = index.iTipoAsiId
            this.leyendaModal[0].contar += this.captura == '1' ? suma : 0
            this.leyendaModal[1].contar += this.captura == '3' ? suma : 0
            this.leyendaModal[2].contar += this.captura == '4' ? suma : 0
            this.leyendaModal[3].contar += this.captura == '2' ? suma : 0
            this.leyendaModal[4].contar += this.captura == '9' ? suma : 0
            this.leyendaModal[5].contar += this.captura == '7' ? suma : 0
        })
    }

    leyenda = [
        {
            significado: 'Asistio',
            simbolo: 'X',
            contar: 0,
            divColor: 'green-50-boton',
            bgColor: 'green-boton',
        },
        {
            significado: 'Inasistencia',
            simbolo: 'I',
            contar: 0,
            divColor: 'red-50-boton',
            bgColor: 'red-boton',
        },
        {
            significado: 'Inasistencia Justificada',
            simbolo: 'J',
            contar: 0,
            divColor: 'primary-50-boton',
            bgColor: 'primary-boton',
        },
        {
            significado: 'Tardanza',
            simbolo: 'T',
            contar: 0,
            divColor: 'orange-50-boton',
            bgColor: 'orange-boton',
        },
        {
            significado: 'Tardanza Justificada',
            simbolo: 'P',
            contar: 0,
            divColor: 'yellow-50-boton',
            bgColor: 'yellow-boton',
        },
        {
            significado: 'Sin Registro',
            simbolo: '-',
            contar: 0,
            divColor: 'cyan-50-boton',
            bgColor: 'cyan-boton',
        },
    ]

    leyendaModal = [
        {
            significado: 'Asistio',
            iTipoAsiId: '1',
            simbolo: 'X',
            contar: 0,
            divColor: 'green-50-boton',
            bgColor: 'green-boton',
        },
        {
            significado: 'Inasistencia',
            iTipoAsiId: '3',
            simbolo: 'I',
            contar: 0,
            divColor: 'red-50-boton',
            bgColor: 'red-boton',
        },
        {
            significado: 'Inasistencia Justificada',
            iTipoAsiId: '4',
            simbolo: 'J',
            contar: 0,
            divColor: 'primary-50-boton',
            bgColor: 'primary-boton',
        },
        {
            significado: 'Tardanza',
            iTipoAsiId: '2',
            simbolo: 'T',
            contar: 0,
            divColor: 'orange-50-boton',
            bgColor: 'orange-boton',
        },
        {
            significado: 'Tardanza Justificada',
            iTipoAsiId: '9',
            simbolo: 'P',
            contar: 0,
            divColor: 'yellow-50-boton',
            bgColor: 'yellow-boton',
        },
        {
            significado: 'Sin Registro',
            iTipoAsiId: '7',
            simbolo: '-',
            contar: 0,
            divColor: 'cyan-50-boton',
            bgColor: 'cyan-boton',
        },
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
        { iTipoAsiId: '7', cTipoAsiLetra: '-', bgcolor: 'bt-cyan' },
        { iTipoAsiId: '1', cTipoAsiLetra: 'X', bgcolor: 'bt-green' },
        { iTipoAsiId: '2', cTipoAsiLetra: 'T', bgcolor: 'bt-orange' },
        { iTipoAsiId: '3', cTipoAsiLetra: 'I', bgcolor: 'bt-red' },
        { iTipoAsiId: '4', cTipoAsiLetra: 'J', bgcolor: 'bt-primary' },
        { iTipoAsiId: '9', cTipoAsiLetra: 'P', bgcolor: 'bt-yellow' },
    ]

    iTipoAsiId = 0
    indice = 0

    changeAsistencia(index) {
        if (this.data[index]['iTipoAsiId'] == null) {
            this.data[index]['iTipoAsiId'] = this.tipoMarcado[0]['iTipoAsiId']
            this.data[index]['cTipoAsiLetra'] =
                this.tipoMarcado[0]['cTipoAsiLetra']
            this.data[index]['bgcolor'] = this.tipoMarcado[0]['bgcolor']
        }

        this.iTipoAsiId = this.tipoMarcado.findIndex(
            (tipo) => tipo.iTipoAsiId == this.data[index]['iTipoAsiId']
        )
        this.indice = (this.iTipoAsiId + 7) % 6

        this.data[index]['iTipoAsiId'] =
            this.tipoMarcado[this.indice]['iTipoAsiId']
        this.data[index]['cTipoAsiLetra'] =
            this.tipoMarcado[this.indice]['cTipoAsiLetra']
        this.data[index]['bgcolor'] = this.tipoMarcado[this.indice]['bgcolor']

        this.countAsistenciasModal()
    }

    goAreasEstudio() {
        this.router.navigate(['aula-virtual/areas-curriculares'])
    }

    estado = {
        '1': 'bt-green',
        '2': 'bt-orange',
        '3': 'bt-red',
        '4': 'bt-primary',
        '7': 'bt-cyan',
        '9': 'bt-yellow',
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
                this.verAsistencia = false
                break
            case 'get_asistencia':
                this.data = item
                this.data.map((index) => {
                    index.bgcolor = this.estado[index.iTipoAsiId]
                })
                this.countAsistenciasModal()
                break
            case 'get_fecha_importante':
                this.calendarOptions.events = item
                this.events = item
                this.countAsistencias()
                break
            case 'close-modal':
                this.showModal = false
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
        this.verAsistencia = false
    }

    // * Registro de asistencia del alumno

    storeAsistencia() {
        if (this.limitado != 6 && this.limitado != 0) {
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

            this.messageService.add({
                severity: 'success',
                summary: 'Mensaje',
                detail: 'Asistencia Registrada',
            })
        } else {
            this.messageService.add({
                severity: 'info',
                summary: 'Mensaje',
                detail: 'Fecha no habilitada',
            })
        }
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
        const iYearId = this._LocalStoreService.getItem('dremoYear')
        const params = {
            petition: 'get',
            group: 'docente',
            prefix: 'reporte_mensual',
            ruta: 'report',
            data: {
                opcion: 'REPORTE_MENSUAL',
                iCursoId: this.iCursoId,
                iYearId: iYearId,
                iSeccionId: this.iSeccionId,
                iNivelGradoId: this.iNivelGradoId,
                iDocenteId: this._ConstantesService.iDocenteId,
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
