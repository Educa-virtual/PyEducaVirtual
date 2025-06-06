import { PrimengModule } from '@/app/primeng.module'
import { environment } from '@/environments/environment'
import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
    selector: 'app-card-capacitaciones',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './card-capacitaciones.component.html',
    styleUrl: './card-capacitaciones.component.scss',
})
export class CardCapacitacionesComponent {
    backend = environment.backend
    @Input() capacitacion
    @Output() verDetalle = new EventEmitter<string>()

    updateUrl(item) {
        item.cImagenUrl = '/images/recursos/miss-lesson-animate.svg'
    }

    getUrlImg(cImagenUrl: string) {
        cImagenUrl = cImagenUrl ? JSON.parse(cImagenUrl) : []
        return cImagenUrl.length
            ? cImagenUrl[0]['url']
            : '/images/recursos/miss-lesson-animate.svg'
    }
    mostrarInscritos() {
        // console.log('mostrarInscritos', this.capacitacion)
        // this.verDetalle.emit(this.capacitacion.iCapacitacionId.toString())
        this.verDetalle.emit(this.capacitacion)
    }
}
