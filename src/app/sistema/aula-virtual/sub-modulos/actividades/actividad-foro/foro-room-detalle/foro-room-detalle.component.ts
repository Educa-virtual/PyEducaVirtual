import { PrimengModule } from '@/app/primeng.module'
import { IconComponent } from '@/app/shared/icon/icon.component'
import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component'
import { Component, Input, OnInit } from '@angular/core'

@Component({
    selector: 'app-foro-room-detalle',
    standalone: true,
    templateUrl: './foro-room-detalle.component.html',
    styleUrls: ['./foro-room-detalle.component.scss'],
    imports: [PrimengModule, ToolbarPrimengComponent, IconComponent],
})
export class ForoRoomDetalleComponent implements OnInit {
    @Input() dataForo: any[]

    foro: any

    constructor() {}

    ngOnInit() {
        this.foro = this.dataForo
    }
}
