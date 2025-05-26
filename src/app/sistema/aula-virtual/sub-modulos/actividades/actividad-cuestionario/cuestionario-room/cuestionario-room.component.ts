import { PrimengModule } from '@/app/primeng.module'
import { IActividad } from '@/app/sistema/aula-virtual/interfaces/actividad.interface'
import { Component, Input, OnInit } from '@angular/core'
import { Message } from 'primeng/api'
import { DynamicDialogConfig } from 'primeng/dynamicdialog'
import { MessagesModule } from 'primeng/messages'

@Component({
    selector: 'app-cuestionario-room',
    standalone: true,
    templateUrl: './cuestionario-room.component.html',
    styleUrls: ['./cuestionario-room.component.scss'],
    imports: [PrimengModule, MessagesModule],
})
export class CuestionarioRoomComponent implements OnInit {
    @Input() ixActivadadId: string
    @Input() iProgActId: string
    @Input() iActTopId: number
    @Input() contenidoSemana

    actividad: IActividad | undefined
    action: string
    semana: Message[] = []

    constructor(private dialogConfig: DynamicDialogConfig) {
        this.contenidoSemana = this.dialogConfig.data.contenidoSemana
        this.action = this.dialogConfig.data.action
        this.actividad = this.dialogConfig.data.actividad
        console.log(
            'actividad01',
            this.actividad,
            this.action,
            this.contenidoSemana
        )
        // Verifica si hay una actividad específica y si la acción es 'ACTUALIZAR'
        // if (this.actividad?.ixActivadadId && this.action === 'ACTUALIZAR') {
        //     this.getTareasxiTareaId(this.actividad.ixActivadadId)
        // }
    }

    ngOnInit() {
        console.log('datos de cuestionario', this.contenidoSemana)
    }
}
