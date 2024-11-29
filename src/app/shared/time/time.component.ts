import {
    Component,
    Input,
    OnChanges,
    OnDestroy,
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
    @Input() inicio: Date = new Date() // Fecha y hora de inicio
    @Input() fin: Date = new Date() // Fecha y hora de fin

    tiempoRestante: number = 0 // Tiempo restante en segundos
    intervalo: any
    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['inicio'] || changes['fin']) {
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
        const minutos = Math.floor(this.tiempoRestante / 60)
        const segundos = this.tiempoRestante % 60
        return `${minutos}:${segundos < 10 ? '0' + segundos : segundos}`
    }
}
