import { PrimengModule } from '@/app/primeng.module'
import { GeneralService } from '@/app/servicios/general.service'
import { Component, inject, Input } from '@angular/core'
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

    @Input() iCursoId: string
    @Input() iDocenteId: string
    @Input() iYAcadId: string
    @Input() iSeccionId: string

    curricula = []
    festividades = []
    events = [] // guarda los eventos para el calendario

    ngOnInit() {
        this.getObtenerCurriculas()
        this.getObtenerCurriculasHorario()
        this.getObtenerFestividades()
    }

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

    // Obtener Areas curriculares para los checkbox
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

    getObtenerFestividades() {
        const params = {
            petition: 'post',
            group: 'docente',
            prefix: 'asistencia',
            ruta: 'obtenerFestividad',
            data: {},
            params: { skipSuccessMessage: true },
        }
        this.getInformation(params, 'festividades')
    }

    getObtenerCurriculasHorario() {
        const params = {
            petition: 'post',
            group: 'docente',
            prefix: 'buscar_curso',
            ruta: 'curriculaHorario',
            data: {
                iDocenteId: this.iDocenteId,
                iYAcadId: this.iYAcadId,
                iCursoId: this.iCursoId,
                iSeccionId: this.iSeccionId,
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
                this.events = item
                break
            case 'festividades':
                this.festividades = item
                this.festividades.map((caja) => {
                    caja.mostrar = true
                })
                break
            default:
                this.curricula = []
                this.festividades = []
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

    filterFestividad(valor: any) {
        this.events.map((evento) => {
            if (
                evento.grupo == valor.checkbox.cTipoFechaNombre &&
                valor.checkbox.mostrar == true
            ) {
                evento.display = 'block'
            }
            if (
                evento.grupo == valor.checkbox.cTipoFechaNombre &&
                valor.checkbox.mostrar == false
            ) {
                evento.display = 'none'
            }
        })
        this.events = Object.assign([], this.events)
    }

    filterCalendario(valor: any) {
        this.events.map((evento) => {
            if (
                evento.grupo == valor.checkbox.cCursoNombre &&
                valor.checkbox.mostrar == true
            ) {
                evento.display = 'block'
            }
            if (
                evento.grupo == valor.checkbox.cCursoNombre &&
                valor.checkbox.mostrar == false
            ) {
                evento.display = 'none'
            }
        })
        this.events = Object.assign([], this.events)
    }
}
