import { IActividad } from '@/app/sistema/aula-virtual/interfaces/actividad.interface'
import { CommonModule } from '@angular/common'
import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnInit,
    inject,
} from '@angular/core'

import { IconComponent } from '@/app/shared/icon/icon.component'
import { ActividadConfigPipe } from '@/app/sistema/aula-virtual/pipes/actividad-config.pipe'
import { MenuItem } from 'primeng/api'
import { PrimengModule } from '@/app/primeng.module'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { IsIconTypePipe } from '@/app/shared/pipes/is-icon-type.pipe'

@Component({
    selector: 'app-actividad-row',
    standalone: true,
    imports: [
        CommonModule,
        IconComponent,
        ActividadConfigPipe,
        PrimengModule,
        IsIconTypePipe,
    ],
    templateUrl: './actividad-row.component.html',
    styleUrl: './actividad-row.component.scss',
})
export class ActividadRowComponent implements OnInit {
    @Input({ required: true }) actividad: IActividad
    @Output() actionSelected = new EventEmitter<{
        actividad: IActividad
        action: string
    }>()

    public accionesActividad: MenuItem[] | undefined

    private _constantesService = inject(ConstantesService)
    iPerfilId: number = null
    ngOnInit() {
        this.iPerfilId = this._constantesService.iPerfilId
    }
    onAction(action: string, event: Event) {
        this.actionSelected.emit({ actividad: this.actividad, action })
        event.stopPropagation()
    }
    obtenerStyleActividad(iEstadoActividad) {
        let styleActividad = ''
        switch (Number(iEstadoActividad)) {
            case 1: //PROCESO
                styleActividad = 'border-left:15px solid var(--green-500);'
                break
            case 2: //NO PUBLICADO
                styleActividad = 'border-left:15px solid var(--yellow-500);'
                break
            case 0: //CULMINADO
                styleActividad = 'border-left:15px solid var(--red-500);'
                break
        }
        return styleActividad
    }
}
