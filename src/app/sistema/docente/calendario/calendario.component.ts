import { PrimengModule } from '@/app/primeng.module'
import { GeneralService } from '@/app/servicios/general.service'
import { Component, inject } from '@angular/core'
import { CalendarOptions } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'
import { ToolbarPrimengComponent } from '../../../shared/toolbar-primeng/toolbar-primeng.component'
import { FullCalendarioComponent } from '../../../shared/full-calendario/full-calendario.component' // * traduce el Modulo de calendario a español

@Component({
    selector: 'app-calendario',
    standalone: true,
    imports: [PrimengModule, ToolbarPrimengComponent, FullCalendarioComponent],
    templateUrl: './calendario.component.html',
    styleUrl: './calendario.component.scss',
})
export class CalendarioComponent {
    private GeneralService = inject(GeneralService)

    curricula = []
    curricula_horario = []
    events = []

    ngOnInit() {
        this.getObtenerCurriculas()
        this.getObtenerCurriculasHorario()
    }
    calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        slotLabelFormat: { hour: 'numeric', minute: '2-digit', hour12: false },
        initialView: 'dayGridMonth',
        locales: [esLocale],
        weekends: true,
        selectable: true,
        dayMaxEvents: true,
        height: 600,
        dateClick: (item) => console.log(item),
        viewDidMount: (info) => {
            const weekendDays = ['sábado', 'viernes']
            const allDays = info.el.querySelectorAll('.fc-day')

            allDays.forEach((cell: HTMLElement) => {
                const date = new Date(cell.getAttribute('data-date')!)
                if (
                    weekendDays.includes(
                        date.toLocaleString('es-pe', { weekday: 'long' })
                    )
                ) {
                    cell.style.backgroundColor = '#ffd7d7'
                }
            })
        },
        headerToolbar: {
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
            center: 'title',
            start: 'prev,next today',
        },
    }

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

    importantes: any[] = [
        {
            name: 'Feriados Nacionales',
            valor: 'asistencias',
            mostrar: true,
            estilo: 'red-checkbox',
        },
        {
            name: 'Feriados Recuperables',
            valor: 'festividades',
            mostrar: true,
            estilo: 'yellow-checkbox',
        },
        {
            name: 'Fecha de Recuperacion',
            valor: 'actividades',
            mostrar: true,
            estilo: 'green-checkbox',
        },
        {
            name: 'Fechas especiales de I.E.',
            valor: 'actividades',
            mostrar: true,
            estilo: 'purple-checkbox',
        },
    ]

    academicas: any[] = [
        {
            name: 'Foro',
            valor: 'actividades',
            mostrar: true,
            estilo: 'teal-checkbox',
        },
        {
            name: 'Evaluacion',
            valor: 'actividades',
            mostrar: true,
            estilo: 'teal-checkbox',
        },
        {
            name: 'Tarea',
            valor: 'actividades',
            mostrar: true,
            estilo: 'teal-checkbox',
        },
    ]

    getObtenerCurriculas() {
        const params = {
            petition: 'post',
            group: 'docente',
            prefix: 'buscar_curso',
            ruta: 'curricula',
            data: {
                iDocenteId: 1,
                iYAcadId: 3,
            },
            params: { skipSuccessMessage: true },
        }
        this.getInformation(params, 'curriculas')
    }
    getObtenerCurriculasHorario() {
        const params = {
            petition: 'post',
            group: 'docente',
            prefix: 'buscar_curso',
            ruta: 'curriculaHorario',
            data: {
                iDocenteId: 1,
                iYAcadId: 3,
            },
            params: { skipSuccessMessage: true },
        }
        this.getInformation(params, 'curriculaHorario')
    }

    accionBtnItem(event) {
        const { accion } = event
        const { item } = event

        switch (accion) {
            case 'curriculas':
                this.curricula = item
                this.curricula.map((caja) => {
                    caja.mostrar = true
                })
                break
            case 'curriculaHorario':
                this.calendarOptions.events = item
                this.events = item
                break
            default:
                this.curricula = []
                this.curricula_horario = []
                break
        }
    }

    getInformation(params, accion) {
        this.GeneralService.getGralPrefix(params).subscribe({
            next: (response: any) => {
                this.accionBtnItem({ accion, item: response?.data })
            },
            complete: () => {},
        })
    }

    accionCalendario(evnt) {
        console.log(evnt)
    }
}
