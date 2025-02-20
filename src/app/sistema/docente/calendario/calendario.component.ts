import { PrimengModule } from '@/app/primeng.module'
import { GeneralService } from '@/app/servicios/general.service'
import { Component, inject, Input } from '@angular/core'
import { ToolbarPrimengComponent } from '../../../shared/toolbar-primeng/toolbar-primeng.component'
import { FullCalendarioComponent } from '../../../shared/full-calendario/full-calendario.component' // * traduce el Modulo de calendario a español
import { ConstantesService } from '@/app/servicios/constantes.service'

@Component({
    selector: 'app-calendario',
    standalone: true,
    imports: [PrimengModule, ToolbarPrimengComponent, FullCalendarioComponent],
    templateUrl: './calendario.component.html',
    styleUrl: './calendario.component.scss',
})
export class CalendarioComponent {
    private GeneralService = inject(GeneralService)
    private ConstantesService = inject(ConstantesService)

    @Input() iCursoId: string
    @Input() iSeccionId: string

    curricula = []
    festividades = []
    actividades = []
    events = [] // guarda los eventos para el calendario

    ngOnInit() {
        this.getObtenerCurriculas()
        this.getObtenerCurriculasHorario()
        this.getObtenerFestividades()
        this.getObtenerActividad()
    }

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

    getObtenerActividad() {
        const params = {
            petition: 'post',
            group: 'docente',
            prefix: 'buscar_curso',
            ruta: 'obtenerActividad',
            data: {},
            params: { skipSuccessMessage: true },
        }
        this.getInformation(params, 'actividades')
    }

    getObtenerCurriculasHorario() {
        const params = {
            petition: 'post',
            group: 'docente',
            prefix: 'buscar_curso',
            ruta: 'curriculaHorario',
            data: {
                iDocenteId: this.ConstantesService.iDocenteId,
                iYAcadId: this.ConstantesService.iYAcadId,
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
            case 'actividades':
                this.actividades = item
                this.actividades.map((caja) => {
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

    filterActividad(valor: any) {
        this.events.map((evento) => {
            if (
                evento.grupo == valor.checkbox.cActTipoNombre &&
                valor.checkbox.mostrar == true
            ) {
                evento.display = 'block'
            }
            if (
                evento.grupo == valor.checkbox.cActTipoNombre &&
                valor.checkbox.mostrar == false
            ) {
                evento.display = 'none'
            }
        })
        this.events = Object.assign([], this.events)
    }
}
