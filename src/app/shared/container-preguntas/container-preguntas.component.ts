import { PrimengModule } from '@/app/primeng.module'
import { Component, OnInit, Input } from '@angular/core'

@Component({
    selector: 'app-container-preguntas',
    standalone: true,
    templateUrl: './container-preguntas.component.html',
    styleUrls: ['./container-preguntas.component.scss'],
    imports: [PrimengModule],
})
export class ContainerPreguntasComponent implements OnInit {
    @Input() pregunta: string = ''
    @Input() alternativas: string[] = []

    seleccion: string | null = null

    constructor() {
        console.log('ff')
    }

    ngOnInit() {
        console.log('ff')
    }
    // meto de al seleccionar una opción
    seleccionarOpcion(opcion: string) {
        this.seleccion = opcion
        console.log('Seleccionaste', opcion)
    }
    // como convertir el (id) en letras y poder listar
    getLetra(index: number): string {
        return String.fromCharCode(65 + index) // Convierte 0 → A, 1 → B, 2 → C, etc.
    }
}
