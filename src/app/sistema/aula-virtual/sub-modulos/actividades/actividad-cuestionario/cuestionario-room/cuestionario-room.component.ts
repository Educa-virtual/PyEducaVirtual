import { PrimengModule } from '@/app/primeng.module'
import { Component, Input, OnInit } from '@angular/core'
@Component({
    selector: 'app-cuestionario-room',
    standalone: true,
    templateUrl: './cuestionario-room.component.html',
    styleUrls: ['./cuestionario-room.component.scss'],
    imports: [PrimengModule],
})
export class CuestionarioRoomComponent implements OnInit {
    @Input() ixActivadadId: string
    @Input() iProgActId: string
    @Input() iActTopId: number
    @Input() contenidoSemana

    constructor() {}

    ngOnInit() {
        console.log('datos de cuestionario', this.contenidoSemana)
    }
}
