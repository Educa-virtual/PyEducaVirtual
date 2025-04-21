import { Component, OnInit } from '@angular/core'
import { AccordionModule } from 'primeng/accordion'
import { CheckboxModule } from 'primeng/checkbox'
import { FullCalendarModule } from '@fullcalendar/angular'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { TableModule } from 'primeng/table'
import { ListboxModule } from 'primeng/listbox'
import { MeterGroupModule } from 'primeng/metergroup'
import { ApiService } from '@/app/servicios/api.service'

interface Curso {
    id: number
    curso: string
    profesor: string
    horasDisponibles: number
    horasAsignadas: number
}

@Component({
    selector: 'app-conf-horario',
    standalone: true,
    imports: [
        AccordionModule,
        FormsModule,
        CheckboxModule,
        MeterGroupModule,
        ListboxModule,
        TableModule,
        FullCalendarModule,
        CommonModule,
    ],
    templateUrl: './conf-horario.component.html',
    styleUrls: ['./conf-horario.component.scss'],
})
export class ConfHorariosComponent implements OnInit {
    addCurso(bloqueId, diaCurso: any) {
        const curso = this.cursoSeleccionado

        if (!curso || curso.horasAsignadas >= curso.horasDisponibles) {
            console.warn('Curso sin horas disponibles')
            return
        }

        // Actualizar bloquesHorarios
        this.bloquesHorarios = this.bloquesHorarios.map((bloque) => {
            if (bloque.id === bloqueId) {
                return {
                    ...bloque,
                    [diaCurso]: curso,
                }
            }
            return bloque
        })

        // Actualizar cursos
        this.cursos = this.cursos.map((c) => {
            if (c.id === curso.id) {
                const actualizado = {
                    ...c,
                    horasAsignadas: c.horasAsignadas + 1,
                }

                // actualizar cursoSeleccionado también para mantenerlo en sincronía
                this.cursoSeleccionado = actualizado

                return actualizado
            }
            return c
        })
    }

    removeCurso(bloqueId: number, diaCurso: string) {
        // Encontrar el curso que está en ese bloque y día
        const cursoRemovido = this.bloquesHorarios.find(
            (b) => b.id === bloqueId
        )?.[diaCurso]

        if (!cursoRemovido || !cursoRemovido.id) {
            console.warn('No hay curso asignado para remover.')
            return
        }

        // Remover el curso del bloque
        this.bloquesHorarios = this.bloquesHorarios.map((bloque) => {
            if (bloque.id === bloqueId) {
                // Puedes poner undefined o eliminar la clave si prefieres
                const { [diaCurso]: _, ...resto } = bloque
                return {
                    ..._,
                    ...resto,
                    [diaCurso]: undefined,
                }
            }
            return bloque
        })

        // Disminuir la cantidad de horas asignadas al curso removido
        this.cursos = this.cursos.map((curso) => {
            if (curso.id === cursoRemovido.id) {
                const actualizado = {
                    ...curso,
                    horasAsignadas: curso.horasAsignadas - 1,
                }

                // Si justo estamos mostrando ese curso como seleccionado, actualiza también
                if (this.cursoSeleccionado?.id === actualizado.id) {
                    this.cursoSeleccionado = actualizado
                }

                return actualizado
            }
            return curso
        })
    }

    isDay(bloque: any): boolean {
        return (
            typeof bloque === 'object' &&
            bloque !== null &&
            Object.keys(bloque).length > 0
        )
    }

    isBloque(bloque: any): boolean {
        return typeof bloque === 'string'
    }
    cursos: Curso[] = [
        {
            id: 1,
            curso: 'Matemáticas',
            profesor: 'Dr. García',
            horasDisponibles: 6,
            horasAsignadas: 0,
        },
        {
            id: 2,
            curso: 'Física',
            profesor: 'Dra. Rodríguez',
            horasDisponibles: 4,
            horasAsignadas: 0,
        },
        {
            id: 3,
            curso: 'Química',
            profesor: 'Lic. Pérez',
            horasDisponibles: 3,
            horasAsignadas: 0,
        },
        {
            id: 4,
            curso: 'Historia',
            profesor: 'Mg. Ramírez',
            horasDisponibles: 5,
            horasAsignadas: 0,
        },
        {
            id: 5,
            curso: 'Lenguaje',
            profesor: 'Lic. Torres',
            horasDisponibles: 4,
            horasAsignadas: 0,
        },
    ]

    cursoSeleccionado

    bloquesHorarios: Array<{ id: number; Bloque: string; [dia: string]: any }> =
        [
            {
                id: 1,
                Bloque: '8:00 - 9:30',
                Lun: { id: 1, curso: 'Matemáticas' },
                Mar: {},
                Mie: {},
                Jue: {},
                Vie: {},
            },
            {
                id: 2,
                Bloque: '9:45 - 11:15',
                Lun: {},
                Mar: {},
                Mie: {},
                Jue: {},
                Vie: {},
            },
            {
                id: 3,
                Bloque: '11:30 - 13:00',
                Lun: {},
                Mar: {},
                Mie: {},
                Jue: {},
                Vie: {},
            },
            {
                id: 4,
                Bloque: '14:30 - 16:00',
                Lun: {},
                Mar: {},
                Mie: {},
                Jue: {},
                Vie: {},
            },
            {
                id: 5,
                Bloque: '16:30 - 18:00',
                Lun: {},
                Mar: {},
                Mie: {},
                Jue: {},
                Vie: {},
            },
        ]

    dias = [
        { field: 'Bloque', header: '' },
        { field: 'Lun', header: 'Lunes' },
        { field: 'Mar', header: 'Martes' },
        { field: 'Mie', header: 'Miércoles' },
        { field: 'Jue', header: 'Jueves' },
        { field: 'Vie', header: 'Viernes' },
    ].map((day, index) => ({ ...day, col: index }))
    horas: string[] = [
        '8:00 - 9:30',
        '9:45 - 11:15',
        '11:30 - 13:00',
        '14:30 - 16:00',
    ]

    festividades
    eventoFestividades
    actividades
    eventoActividad
    curricula
    eventoCurricular
    calendarOptions
    DURACION_BLOQUE: number = 1.5

    cursosSeleccionados: number[] = []
    asignaciones: Record<number, number> = {} // {bloqueId: cursoId}
    dialogOpen: boolean = false
    bloqueSeleccionado: number | null = null

    constructor(private apiService: ApiService) {}

    async ngOnInit() {
        const dias = await this.apiService.getData({
            esquema: 'grl',
            tabla: 'dias',
            campos: '*',
            where: '1=1',
        })
        const cursos = await this.apiService.getData({
            esquema: '',
            tabla: '',
            campos: '*',
            where: '',
        })

        console.log('horario')
        console.log(dias)
        console.log(cursos)
    }

    toggleCurso(cursoId: number): void {
        const index = this.cursosSeleccionados.indexOf(cursoId)
        if (index !== -1) {
            this.cursosSeleccionados.splice(index, 1)
        } else {
            this.cursosSeleccionados.push(cursoId)
        }
    }

    calcularHorasAsignadas(cursoId: number): number {
        const cantidad = Object.values(this.asignaciones).filter(
            (id) => id === cursoId
        ).length
        return cantidad * this.DURACION_BLOQUE
    }

    tieneHorasDisponibles(cursoId: number): boolean {
        const curso = this.cursos.find((c) => c.id === cursoId)
        if (!curso) return false
        return this.calcularHorasAsignadas(cursoId) < curso.horasDisponibles
    }

    getBloqueId(diaIndex: number, horaIndex: number): number {
        return diaIndex * this.horas.length + horaIndex + 1
    }

    getCursoEnBloque(bloqueId: number): Curso | undefined {
        const cursoId = this.asignaciones[bloqueId]
        return this.cursos.find((curso) => curso.id === cursoId)
    }

    asignarCursoABloque(bloqueId: number, cursoId: number): void {
        if (this.tieneHorasDisponibles(cursoId)) {
            this.asignaciones[bloqueId] = cursoId
        }
    }

    eliminarAsignacion(bloqueId: number): void {
        delete this.asignaciones[bloqueId]
    }

    abrirDialogo(bloqueId: number): void {
        this.bloqueSeleccionado = bloqueId
        this.dialogOpen = true
    }

    cerrarDialogo(): void {
        this.dialogOpen = false
        this.bloqueSeleccionado = null
    }

    calcularPorcentaje(cursoId: number): number {
        const curso = this.cursos.find((c) => c.id === cursoId)
        if (!curso) return 0

        const asignadas = this.calcularHorasAsignadas(cursoId)
        return (asignadas / curso.horasDisponibles) * 100
    }

    getCursoPorId(cursoId: number) {
        return this.cursos.find((c) => c.id === cursoId)
    }

    onClickBloque(bloqueId: number, horaIndex: number) {
        console.log('Bloque:', bloqueId, 'Hora Index:', horaIndex)
    }

    asignarCursoDesdeDialog(cursoId) {
        // lógica para asignar curso desde el diálogo
        console.log('Asignando curso desde diálogo...' + cursoId)
    }
}
