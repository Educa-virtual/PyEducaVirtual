import { PrimengModule } from '@/app/primeng.module'
import { Component, OnInit } from '@angular/core'
import { MessageService } from 'primeng/api'
import { AsistenciasComponent } from './asistencias/asistencias.component'
@Component({
    selector: 'app-auxiliar',
    standalone: true,
    imports: [PrimengModule, AsistenciasComponent],
    providers: [MessageService],
    templateUrl: './auxiliar.component.html',
    styleUrl: './auxiliar.component.scss',
})
export class AuxiliarComponent implements OnInit {
    // @Input() datosGrupos: any = []

    // visible: boolean = false
    // grupo: boolean = false

    // nombreGrupo: string | undefined
    // descripcionGrupo: string | undefined
    // iSedeId: string

    // mensaje: any[] | undefined

    // private generalService = inject(GeneralService)
    // private constantesService = inject(ConstantesService)

    // constructor(private messageService: MessageService) {
    //     this.iSedeId = this.constantesService.iSedeId
    // }
    habilitarGrupo: boolean = true

    ngOnInit() {
        console.log(1)
    }
}
