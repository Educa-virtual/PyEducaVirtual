import { ConstantesService } from '@/app/servicios/constantes.service'
import { Component } from '@angular/core'

@Component({
    selector: 'app-inicio',
    standalone: true,
    imports: [],
    templateUrl: './inicio.component.html',
    styleUrl: './inicio.component.scss',
})
export class InicioComponent {
    name: string
    constructor(private ConstantesService: ConstantesService) {
        this.name = this.ConstantesService.nombres
    }
}
