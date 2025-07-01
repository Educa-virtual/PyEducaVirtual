import { PrimengModule } from '@/app/primeng.module'
import { Component, OnInit } from '@angular/core'
import { MessageService } from 'primeng/api'

interface ClassSchedule {
    id: number
    subject: string
    startTime: string
    endTime: string
    location?: string
}

interface WeeklySchedule {
    lunes: ClassSchedule[]
    martes: ClassSchedule[]
    miercoles: ClassSchedule[]
    jueves: ClassSchedule[]
    viernes: ClassSchedule[]
    sabado: ClassSchedule[]
    domingo: ClassSchedule[]
}

@Component({
    selector: 'app-asignar-horario-capacitacion',
    standalone: true,
    templateUrl: './asignar-horario-capacitacion.component.html',
    styleUrls: ['./asignar-horario-capacitacion.component.scss'],
    imports: [PrimengModule],
})
export class AsignarHorarioCapacitacionComponent implements OnInit {
    displayDialog = false
    activeDay = ''
    activeDayName = ''

    schedule: WeeklySchedule = {
        lunes: [],
        martes: [],
        miercoles: [],
        jueves: [],
        viernes: [],
        sabado: [],
        domingo: [],
    }
    dias = [
        { id: 'lunes', nombre: 'Lunes', color: 'bg-blue-100' },
        { id: 'martes', nombre: 'Martes', color: 'bg-green-100' },
        { id: 'miercoles', nombre: 'Miércoles', color: 'bg-yellow-100' },
        { id: 'jueves', nombre: 'Jueves', color: 'bg-purple-100' },
        { id: 'viernes', nombre: 'Viernes', color: 'bg-pink-100' },
        { id: 'sabado', nombre: 'Sábado', color: 'bg-indigo-100' },
        { id: 'domingo', nombre: 'Domingo', color: 'bg-orange-100' },
    ]
    newClass: ClassSchedule = {
        id: 0,
        subject: '',
        startTime: '',
        endTime: '',
        location: '',
    }
    constructor(private messageService: MessageService) {}

    ngOnInit() {
        console.log('jjj')
    }
    openDialog(dayKey: string) {
        this.activeDay = dayKey
        this.activeDayName =
            this.dias.find((d) => d.id === dayKey)?.nombre || ''
        this.displayDialog = true
        this.resetNewClass()
    }
    closeDialog() {
        this.displayDialog = false
        this.activeDay = ''
        this.resetNewClass()
    }

    resetNewClass() {
        this.newClass = {
            id: 0,
            subject: '',
            startTime: '',
            endTime: '',
            location: '',
        }
    }
    formatTime(time: string): string {
        // if (!time) return '';
        // const [hours, minutes] = time.split(':');
        // return `${hours}:${minutes}`;
        if (!time || !time.includes(':')) return ''
        const parts = time.split(':')
        const hours = parts[0] ?? ''
        const minutes = parts[1] ?? ''
        return `${hours}:${minutes}`
    }
    formatToHour(time: string): string {
        const date = new Date(time)
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        return `${hours}:${minutes}`
    }

    getTotalClasses(): number {
        return Object.values(this.schedule).reduce(
            (total, dayClasses) => total + dayClasses.length,
            0
        )
    }

    anadirClase() {
        this.newClass.startTime = this.formatToHour(this.newClass.startTime)
        this.newClass.endTime = this.formatToHour(this.newClass.endTime)
        console.log('Adding class:', this.newClass)
        if (
            this.newClass.subject &&
            this.newClass.startTime &&
            this.newClass.endTime
        ) {
            const classToAdd: ClassSchedule = {
                ...this.newClass,
                id: Date.now(),
            }

            this.schedule[this.activeDay as keyof WeeklySchedule].push(
                classToAdd
            )

            // Ordenar por hora de inicio
            this.schedule[this.activeDay as keyof WeeklySchedule].sort((a, b) =>
                a.startTime.localeCompare(b.startTime)
            )

            this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Clase agregada correctamente',
            })

            this.closeDialog()
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Por favor completa todos los campos requeridos',
            })
        }
    }
}
