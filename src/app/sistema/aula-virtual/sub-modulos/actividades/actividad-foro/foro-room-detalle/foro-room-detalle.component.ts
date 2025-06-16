import { PrimengModule } from '@/app/primeng.module'
import { IconComponent } from '@/app/shared/icon/icon.component'
import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component'
import { Component, Input, OnInit } from '@angular/core'
import { ForoComentariosComponent } from '../foro-comentarios/foro-comentarios.component'

@Component({
    selector: 'app-foro-room-detalle',
    standalone: true,
    templateUrl: './foro-room-detalle.component.html',
    styleUrls: ['./foro-room-detalle.component.scss'],
    imports: [
        PrimengModule,
        ToolbarPrimengComponent,
        IconComponent,
        ForoComentariosComponent,
    ],
})
export class ForoRoomDetalleComponent implements OnInit {
    @Input() dataForo: any[]

    foro: any // variable con datos generales de foro
    idForo: number // variable para enviar el idForo a otro componente

    constructor() {}

    ngOnInit() {
        this.foro = this.dataForo
        this.idForo = this.foro.iForoId
    }
}
