import { Component, OnInit, Input } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
@Component({
    selector: 'app-pregunta-visualizacion',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './pregunta-visualizacion.component.html',
    styleUrl: './pregunta-visualizacion.component.scss',
})
export class PreguntaVisualizacionComponent implements OnInit {
    @Input() participanteSeleccionado: string = ''
    ngOnInit() {
        console.log('pregunta-visulziacion')
    }
}
