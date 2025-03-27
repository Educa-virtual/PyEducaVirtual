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

    ngOnChanges(changes: SimpleChanges): void {
        console.log('Iniciado')
        if (changes['inicio'] || changes['fin']) {
            this.inicio = new Date(this.inicio)
            this.fin = new Date(this.fin)
            this.detenerContador() // Reinicia el contador si las fechas cambian
            this.calcularTiempoRestante()
            this.iniciarContador()
        }
    }

    calcularTiempoRestante(): void {
        const diferenciaMs = this.fin.getTime() - new Date().getTime()
        this.tiempoRestante = Math.max(Math.floor(diferenciaMs / 1000), 0)
    }

    iniciarContador(): void {
        this.intervalo = setInterval(() => {
            this.calcularTiempoRestante()
            if (this.tiempoRestante <= 0) {
                this.detenerContador()
            }
        }, 1000)
    }

    detenerContador(): void {
        if (this.intervalo) {
            clearInterval(this.intervalo)
            this.intervalo = null
        }
    }

    ngOnDestroy(): void {
        this.detenerContador() // Limpia el intervalo al destruir el componente
    }

    getTiempoFormateado(): string {
        const hours = Math.floor(this.tiempoRestante / 3600) // 1 hora = 3600 segundos
        const minutos = Math.floor((this.tiempoRestante % 3600) / 60) // 1 minuto = 60 segundos
        const segundos = Math.floor(this.tiempoRestante % 60)
        const data = {
            accion: 'tiempo-finalizado',
            item: null,
        }
        if (hours == 0 && minutos == 0 && segundos == 0) {
            this.accionTime.emit(data)
        } else {
            data.accion = 'tiempo-espera'
            this.accionTime.emit(data)
        }
        const pad = (num: number) => num.toString().padStart(2, '0')
        return `${pad(hours)}:${pad(minutos)}:${pad(segundos)}`
    }
}
