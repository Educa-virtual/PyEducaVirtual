import { Component, OnInit, Input } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
@Component({
    selector: 'app-pregunta-visualizacion',
    standalone: true,
    imports: [CommonModule, FormsModule, PrimengModule],
    templateUrl: './pregunta-visualizacion.component.html',
    styleUrl: './pregunta-visualizacion.component.scss',
})
export class PreguntaVisualizacionComponent implements OnInit {
    @Input() participanteSeleccionado: string = ''
    checked: boolean = false
    respuesta1: string = 'D'
    respuesta2: string = 'A'

    ngOnInit() {
        console.log('pregunta-visulziacion')
    }
}
