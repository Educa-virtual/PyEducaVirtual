import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChanges,
} from '@angular/core'

@Component({
    selector: 'app-time',
    standalone: true,
    templateUrl: './time.component.html',
    styleUrls: ['./time.component.scss'],
    imports: [],
})
export class TimeComponent implements OnChanges, OnDestroy {
    @Output() accionTime = new EventEmitter()

    @Input() inicio // Fecha y hora de inicio
    @Input() fin // Fecha y hora de fin

    tiempoRestante: number = 0 // Tiempo restante en segundos
    intervalo: any
    private hours: number = 0
    private minutos: number = 0
    private segundos: number = 0

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['inicio'] || changes['fin']) {
            this.inicio = new Date(this.inicio)
            this.fin = new Date(this.fin)
            if (this.inicio.getTime() == this.fin.getTime()) {
                return
            }
            this.detenerContador() // Reinicia el contador si las fechas cambian
            this.calcularTiempoRestante()
            this.iniciarContador()
        }
    }

    calcularTiempoRestante(): void {
        this.inicio = new Date(this.inicio.getTime() + 1000)
        const diferenciaMs = this.fin.getTime() - this.inicio.getTime()
        this.tiempoRestante = Math.max(Math.floor(diferenciaMs / 1000), 0)
    }

    iniciarContador(): void {
        this.intervalo = setInterval(() => {
            this.calcularTiempoRestante()
            this.emitirEvento()
            if (this.tiempoRestante <= 0) {
                this.detenerContador()
                this.emitirEvento()
            }
        }, 1000)
    }

    detenerContador(): void {
        console.log('Deteniendo contador')
        if (this.intervalo) {
            clearInterval(this.intervalo)
            this.intervalo = null
        }
    }

    ngOnDestroy(): void {
        console.log('Destruyendo componente')
        this.detenerContador() // Limpia el intervalo al destruir el componente
    }

    emitirEvento(): void {
        const data = {
            accion: 'tiempo-espera',
            item: null,
        }
        if (this.hours == 0 && this.minutos == 1 && this.segundos == 0) {
            data.accion = 'tiempo-1-minuto-restante'
        }
        if (this.hours == 0 && this.minutos == 0 && this.segundos == 0) {
            data.accion = 'tiempo-finalizado'
        }
        /*else {
           data.accion = 'tiempo-espera'
       }*/
        console.log('Emitiendo evento:', data.accion)
        console.log('Tiempo restante:', this.hours, this.minutos, this.segundos)
        this.accionTime.emit(data)
    }

    getTiempoFormateado(): string {
        this.hours = Math.floor(this.tiempoRestante / 3600) // 1 hora = 3600 segundos
        this.minutos = Math.floor((this.tiempoRestante % 3600) / 60) // 1 minuto = 60 segundos
        this.segundos = Math.floor(this.tiempoRestante % 60)
        //this.emitirEvento(hours,minutos,segundos)
        const pad = (num: number) => num.toString().padStart(2, '0')
        return `${pad(this.hours)}:${pad(this.minutos)}:${pad(this.segundos)}`
    }
}
