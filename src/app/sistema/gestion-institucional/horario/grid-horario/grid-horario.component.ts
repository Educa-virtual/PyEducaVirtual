import { PrimengModule } from '@/app/primeng.module'
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from '@angular/core'

@Component({
    selector: 'app-grid-horario',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './grid-horario.component.html',
    styleUrl: './grid-horario.component.scss',
})
export class GridHorarioComponent implements OnChanges {
    @Output() filtrarCurso = new EventEmitter()
    @Output() filtrarActividad = new EventEmitter()

    @Input() inicio
    @Input() horarios
    @Input() events
    @Input() curricula

    activarIndice: number | number[] = [] //activa las pestañas de p-according

    horas: { inicio: string; fin: string; intervalo: string }[] = []
    dias: string[] = [
        'Lunes',
        'Martes',
        'Miércoles',
        'Jueves',
        'Viernes',
        'Sábado',
        'Domingo',
    ]
    horario: {
        [hora: string]: {
            [dia: string]: { asignatura: string; profesor: string } | null
        }
    } = {}
    bloques: string[] = [] // Bloques horarios (intervalos únicos generados)

    // registros = [
    //   { dia: 'Lunes', inicio: '07:00', fin: '08:30', asignatura: 'Matemática', profesor: 'Julio Salazar Jimenez' },
    //   { dia: 'Lunes', inicio: '08:30', fin: '09:15', asignatura: 'Historia', profesor: 'Ana López' },
    //   { dia: 'Martes', inicio: '07:45', fin: '08:30', asignatura: 'Ciencias', profesor: 'Carlos Pérez' },
    //   { dia: 'Miércoles', inicio: '07:45', fin: '08:30', asignatura: 'Ciencias', profesor: 'Carlos Pérez' },
    //   // Más registros...
    // ];

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['curricula'] && changes['curricula'].currentValue) {
            // Utiliza una copia local para evitar modificar el @Input
            const nuevaCurricula = changes['curricula'].currentValue
            this.procesarRegistros()
            // Verifica si realmente hay diferencias significativas antes de procesar
            if (this.esCambioRelevante(this.curricula, nuevaCurricula)) {
                this.curricula = nuevaCurricula // Actualiza la copia local
                this.procesarRegistros() // Procesa los datos sin generar ciclos
            }
        }
        if (changes['horarios'] && changes['horarios'].currentValue) {
            // Utiliza una copia local para evitar modificar el @Input
            this.procesarRegistros()
            // Verifica si realmente hay diferencias significativas antes de procesar
        }
    }

    movil: boolean = false
    verificarDimension() {
        this.movil = window.innerWidth < 768
        this.activarIndice = this.movil ? [] : [0]
    }

    eventoCurricular(curso: any) {
        // console.log(curso, 'cursos seleccionado')
        this.filtrarCurso.emit(curso)
    }
    eventoActividad(id) {
        const data = {
            checkbox: id,
        }
        this.filtrarActividad.emit(data)
    }

    /* Compara si hay cambios relevantes entre el valor anterior y el actual
     */
    private esCambioRelevante(actual: any, nuevo: any): boolean {
        // Lógica para comparar objetos y determinar si es necesario procesar
        return JSON.stringify(actual) !== JSON.stringify(nuevo)
    }
    generarHorario() {
        // // Generar intervalos de 45 minutos de 7:00 AM a 12:30 PM
        //   const inicioHorario = new Date();
        //   inicioHorario.setHours(7, 0, 0, 0);
        //   const finHorario = new Date();
        //   finHorario.setHours(12, 30, 0, 0);
        //   while (inicioHorario < finHorario) {
        //     const finIntervalo = new Date(inicioHorario.getTime() + 45 * 60 * 1000);
        //     this.horas.push({
        //       inicio: inicioHorario.toTimeString().slice(0, 5),
        //       fin: finIntervalo.toTimeString().slice(0, 5),
        //       intervalo: `${inicioHorario.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${finIntervalo.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        //     });
        //     inicioHorario.setTime(finIntervalo.getTime());
        //   }
        // Ejemplo de horario con recreo
        // this.horario = {
        //   '09:00': { Lunes: 'Recreo', Martes: 'Recreo', Miércoles: 'Recreo', Jueves: 'Recreo', Viernes: 'Recreo' },
        //   '07:00': { Lunes: 'Matemáticas', Martes: 'Historia', Miércoles: 'Ciencias', Jueves: 'Lengua', Viernes: 'Arte' },
        //   '07:45': { Lunes: 'Inglés', Martes: 'Química', Miércoles: 'Educación Física', Jueves: 'Física', Viernes: 'Geografía' },
        //   // Agregar más eventos según sea necesario
        // };
        // Más registros...
    }

    procesarRegistros() {
        const intervalos: Set<string> = new Set()

        // Paso 1: Dividir los intervalos según los registros
        this.horarios.forEach((registro) => {
            const inicio = this.convertirHoraAFecha(registro.inicio)
            const fin = this.convertirHoraAFecha(registro.fin)

            // Dividimos el rango en bloques de 45 minutos
            let actual = new Date(inicio)
            while (actual < fin) {
                const siguiente = new Date(actual.getTime() + 45 * 60 * 1000)
                const bloqueInicio = this.formatearHora(actual)
                const bloqueFin = this.formatearHora(
                    siguiente > fin ? fin : siguiente
                )
                intervalos.add(`${bloqueInicio}-${bloqueFin}`)
                actual = siguiente
            }
        })

        // Paso 2: Ordenar los bloques de tiempo
        this.bloques = Array.from(intervalos).sort((a, b) => {
            const [horaA] = a.split('-')
            const [horaB] = b.split('-')
            return (
                this.convertirHoraAFecha(horaA).getTime() -
                this.convertirHoraAFecha(horaB).getTime()
            )
        })

        // Paso 3: Construir el horario basado en los bloques
        this.bloques.forEach((bloque) => {
            const [inicio, fin] = bloque.split('-')
            this.horario[bloque] = {}
            this.dias.forEach((dia) => {
                const registro = this.horarios.find(
                    (r) =>
                        r.dia === dia &&
                        this.estaDentroDelRango(inicio, fin, r.inicio, r.fin)
                )
                this.horario[bloque][dia] = registro
                    ? {
                          asignatura: registro.asignatura,
                          profesor: registro.profesor,
                      }
                    : null
            })
        })
    }

    // Utilidades

    convertirHoraAFecha(hora: string): Date {
        const [horas, minutos] = hora.split(':').map(Number)
        const fecha = new Date()
        fecha.setHours(horas, minutos, 0, 0)
        return fecha
    }

    formatearHora(fecha: Date): string {
        return fecha.toTimeString().slice(0, 5) // Devuelve "HH:mm"
    }

    estaDentroDelRango(
        inicio: string,
        fin: string,
        rangoInicio: string,
        rangoFin: string
    ): boolean {
        const inicioFecha = this.convertirHoraAFecha(inicio)
        const finFecha = this.convertirHoraAFecha(fin)
        const rangoInicioFecha = this.convertirHoraAFecha(rangoInicio)
        const rangoFinFecha = this.convertirHoraAFecha(rangoFin)

        return inicioFecha >= rangoInicioFecha && finFecha <= rangoFinFecha
    }
}
