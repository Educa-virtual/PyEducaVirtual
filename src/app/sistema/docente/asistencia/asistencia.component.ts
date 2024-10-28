import { PrimengModule } from '@/app/primeng.module'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { GeneralService } from '@/app/servicios/general.service'
import { Component, OnInit, Input } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Subject, takeUntil } from 'rxjs'
import { CalendarOptions } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
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
    @Input() iCursoId: string
    @Input() iNivelGradoId: string
    @Input() iSeccionId: string

    private unsubscribe$ = new Subject<boolean>()

    cCursoNombre: string
    constructor(
        private GeneralService: GeneralService,
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
    formatoFecha: Date = new Date()
    fechaActual =
        this.formatoFecha.getFullYear() +
        '-' +
        (this.formatoFecha.getMonth() + 1) +
        '-' +
        this.formatoFecha.getDate()

    dataFechas = []
    calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        locales: [esLocale],
        weekends: true,
        height: '100%',
        selectable: true,
        eventShortHeight: 30,
        dateClick: (item) => this.handleDateClick(item),
        headerToolbar: {
            end: 'dayGridMonth,dayGridWeek,dayGridDay',
            center: 'title',
            start: 'prev,next today',
        },
        events: null,
    }

    // [{ title: 'Meeting', start: new Date() }]
    handleDateClick(item) {
        this.verAsistencia(item.dateStr)
        this.fechaActual = item.dateStr
    }
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
        console.log(this.dataFechas)
    }
    verAsistencia(fechas: string) {
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
    visible: boolean = false

    fechas = [
        {
            nombre: 'Feriados Nacionales',
            cantidad: 5,
            color: 'var(--red-400)',
        },
        {
            nombre: 'Feriados Recuperables',
            cantidad: 5,
            color: 'var(--yellow-400)',
        },
        {
            nombre: 'Fechas de Recuperacion',
            cantidad: 5,
            color: 'var(--green-400)',
        },
        {
            nombre: 'Fechas Especiales I.E.',
            cantidad: 5,
            color: 'var(--bluegray-400)',
        },
        {
            nombre: 'Dias de Gestion',
            cantidad: 5,
            color: 'var(--gray-400)',
        },
        {
            nombre: 'Mis Actividades',
            cantidad: 5,
            color: 'var(--teal-400)',
        },
    ]

    valSelect1: string = ''
    valSelect2: number = 0

    data = []

    tipoMarcado = [
        { iTipoAsiId: '7', cTipoAsiLetra: '-' },
        { iTipoAsiId: '1', cTipoAsiLetra: 'A' },
        { iTipoAsiId: '2', cTipoAsiLetra: 'T' },
        { iTipoAsiId: '3', cTipoAsiLetra: 'N' },
        { iTipoAsiId: '4', cTipoAsiLetra: 'J' },
    ]

    iTipoAsiId = 0
    indice = 0
    marcarAsistencia(index) {
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

    guardarAsistencia() {
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
        // console.log(item)
        // console.log(accion)

        switch (accion) {
            case 'ingresar':
                this.router.navigate(['./docente/detalle-asistencia'])
                break
            case 'get_data':
                this.getObtenerAsitencias()
                break
            case 'get_asistencia':
                this.data = item
                break
            // case 'get_asistencia_fecha':
            //     this.data = item
            //     break
            case 'get_fecha_importante':
                this.calendarOptions.events = item
                //this.getCalendario()
                break
            default:
                break
        }
    }
    showModal = false
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
