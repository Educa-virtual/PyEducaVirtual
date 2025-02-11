import { PrimengModule } from '@/app/primeng.module'
import { Component } from '@angular/core'

@Component({
    selector: 'app-discapacidad',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './discapacidad.component.html',
    styleUrl: './discapacidad.component.scss',
})
export class DiscapacidadComponent {
    tiene_discapacidad: Array<object>
    tiene_condicion: Array<object>

    ngOnInit(): void {
        this.getTieneDiscapacidad()
        this.getTieneCondicion()
    }

    getTieneDiscapacidad() {
        this.tiene_discapacidad = [
            { nombre: 'SI', id: '1' },
            { nombre: 'NO', id: '2' },
        ]
    }

    getTieneCondicion() {
        this.tiene_condicion = [
            { nombre: 'SI', id: '1' },
            { nombre: 'NO', id: '2' },
        ]
    }
}
