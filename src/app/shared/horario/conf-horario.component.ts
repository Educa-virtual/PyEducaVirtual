import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    ViewChild,
} from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { NgIf } from '@angular/common'
import { NoDataComponent } from '../no-data/no-data.component'
@Component({
    selector: 'app-conf-horario',
    standalone: true,
    imports: [PrimengModule, NgIf, NoDataComponent],
    templateUrl: './conf-horario.component.html',
    styleUrls: ['./conf-horario.component.scss'],
})
export class ConfHorariosComponent implements OnChanges {
    @Output() accionBtnItem = new EventEmitter()

    @Input() cursos = []
    @Input() dias = []
    @Input() horas = []
    @Input() horario = []

    @ViewChild('cursosContainer', { static: false })
    cursosContainer!: ElementRef

    scrollCursos(direction: number): void {
        const container = this.cursosContainer.nativeElement
        const scrollAmount = 270 // ajusta según el ancho de tus tarjetas
        container.scrollBy({
            left: scrollAmount * direction,
            behavior: 'smooth',
        })
    }
    cursoSeleccionado
    ngOnChanges(changes) {
        if (changes.cursos.currentValue) {
            this.cursos = changes.cursos.currentValue
        }
        if (changes.dias.currentValue) {
            this.dias = changes.dias.currentValue
        }
        if (changes.horas.currentValue) {
            this.horas = changes.horas.currentValue
        }
        if (changes.horario.currentValue) {
            this.horario = changes.horario.currentValue
        }
    }

    existeCursoHoraEnDia(iDiaId: number, iHorarioIeDetId: number): boolean {
        return this.horario.some(
            (hour) =>
                hour.iDiaId === iDiaId &&
                hour.iHorarioIeDetId === iHorarioIeDetId
        )
    }

    obtenerNombreCursoHoraEnDia(
        iDiaId: number,
        iHorarioIeDetId: number
    ): string {
        const horario = this.horario.find(
            (hour) =>
                hour.iDiaId === iDiaId &&
                hour.iHorarioIeDetId === iHorarioIeDetId
        )
        return horario ? horario.cCursoNombre : ''
    }

    agregarRemoverHorario(horario, dia, curso, accion) {
        const item = {
            iCursoId: 1,
            cCursoNombre: curso.cCursoNombre,
            iDiaId: dia.iDiaId,
            cDiaNombre: dia.cDiaNombre,
            iHorarioIeId: horario.iHorarioIeId,
            inicio: horario.inicio,
            fin: horario.fin,
            cDocente: horario.cDocente,
            iHorarioIeDetId: horario.iHorarioIeDetId,
        }

        this.accionBtn(accion, item)
    }
    accionBtn(accion, item) {
        const data = {
            accion,
            item,
        }
        this.accionBtnItem.emit(data)
    }

    // addCurso(bloqueId, diaCurso: any) {
    //     const curso = this.cursoSeleccionado

    //     if (!curso || curso.horasAsignadas >= curso.horasDisponibles) {
    //         console.warn('Curso sin horas disponibles')
    //         return
    //     }

    //     // Actualizar bloquesHorarios
    //     this.bloquesHorarios = this.bloquesHorarios.map((bloque) => {
    //         if (bloque.id === bloqueId) {
    //             return {
    //                 ...bloque,
    //                 [diaCurso]: curso,
    //             }
    //         }
    //         return bloque
    //     })

    //     // Actualizar cursos
    //     this.cursos = this.cursos.map((c) => {
    //         if (c.id === curso.id) {
    //             const actualizado = {
    //                 ...c,
    //                 horasAsignadas: c.horasAsignadas + 1,
    //             }

    //             // actualizar cursoSeleccionado también para mantenerlo en sincronía
    //             this.cursoSeleccionado = actualizado

    //             return actualizado
    //         }
    //         return c
    //     })
    // }

    // removeCurso(bloqueId: number, diaCurso: string) {
    //     // Encontrar el curso que está en ese bloque y día
    //     const cursoRemovido = this.bloquesHorarios.find(
    //         (b) => b.id === bloqueId
    //     )?.[diaCurso]

    //     if (!cursoRemovido || !cursoRemovido.id) {
    //         console.warn('No hay curso asignado para remover.')
    //         return
    //     }

    //     // Remover el curso del bloque
    //     this.bloquesHorarios = this.bloquesHorarios.map((bloque) => {
    //         if (bloque.id === bloqueId) {
    //             // Puedes poner undefined o eliminar la clave si prefieres
    //             const { [diaCurso]: _, ...resto } = bloque
    //             return {
    //                 ..._,
    //                 ...resto,
    //                 [diaCurso]: undefined,
    //             }
    //         }
    //         return bloque
    //     })

    //     // Disminuir la cantidad de horas asignadas al curso removido
    //     this.cursos = this.cursos.map((curso) => {
    //         if (curso.id === cursoRemovido.id) {
    //             const actualizado = {
    //                 ...curso,
    //                 horasAsignadas: curso.horasAsignadas - 1,
    //             }

    //             // Si justo estamos mostrando ese curso como seleccionado, actualiza también
    //             if (this.cursoSeleccionado?.id === actualizado.id) {
    //                 this.cursoSeleccionado = actualizado
    //             }

    //             return actualizado
    //         }
    //         return curso
    //     })
    // }

    // isDay(bloque: any): boolean {
    //     return (
    //         typeof bloque === 'object' &&
    //         bloque !== null &&
    //         Object.keys(bloque).length > 0
    //     )
    // }

    // isBloque(bloque: any): boolean {
    //     return typeof bloque === 'string'
    // }

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

    // toggleCurso(cursoId: number): void {
    //     const index = this.cursosSeleccionados.indexOf(cursoId)
    //     if (index !== -1) {
    //         this.cursosSeleccionados.splice(index, 1)
    //     } else {
    //         this.cursosSeleccionados.push(cursoId)
    //     }
    // }

    // calcularHorasAsignadas(cursoId: number): number {
    //     const cantidad = Object.values(this.asignaciones).filter(
    //         (id) => id === cursoId
    //     ).length
    //     return cantidad * this.DURACION_BLOQUE
    // }

    // tieneHorasDisponibles(cursoId: number): boolean {
    //     const curso = this.cursos.find((c) => c.id === cursoId)
    //     if (!curso) return false
    //     return this.calcularHorasAsignadas(cursoId) < curso.horasDisponibles
    // }

    // getBloqueId(diaIndex: number, horaIndex: number): number {
    //     return diaIndex * this.horas.length + horaIndex + 1
    // }

    // getCursoEnBloque(bloqueId: number): any | undefined {
    //     const cursoId = this.asignaciones[bloqueId]
    //     return this.cursos.find((curso) => curso.id === cursoId)
    // }

    // asignarCursoABloque(bloqueId: number, cursoId: number): void {
    //     if (this.tieneHorasDisponibles(cursoId)) {
    //         this.asignaciones[bloqueId] = cursoId
    //     }
    // }

    // eliminarAsignacion(bloqueId: number): void {
    //     delete this.asignaciones[bloqueId]
    // }

    // abrirDialogo(bloqueId: number): void {
    //     this.bloqueSeleccionado = bloqueId
    //     this.dialogOpen = true
    // }

    // cerrarDialogo(): void {
    //     this.dialogOpen = false
    //     this.bloqueSeleccionado = null
    // }

    // calcularPorcentaje(cursoId: number): number {
    //     const curso = this.cursos.find((c) => c.id === cursoId)
    //     if (!curso) return 0

    //     const asignadas = this.calcularHorasAsignadas(cursoId)
    //     return (asignadas / curso.horasDisponibles) * 100
    // }

    // getCursoPorId(cursoId: number) {
    //     return this.cursos.find((c) => c.id === cursoId)
    // }

    // onClickBloque(bloqueId: number, horaIndex: number) {
    //     console.log('Bloque:', bloqueId, 'Hora Index:', horaIndex)
    // }

    // asignarCursoDesdeDialog(cursoId) {
    //     // lógica para asignar curso desde el diálogo
    //     console.log('Asignando curso desde diálogo...' + cursoId)
    // }
}
