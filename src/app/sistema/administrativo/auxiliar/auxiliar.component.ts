import { PrimengModule } from '@/app/primeng.module'
import { Component, inject, OnInit, Input } from '@angular/core'
import { HistorialAsistenciaComponent } from './historial-asistencia/historial-asistencia.component'
import { ConfiguracionAsistenciaComponent } from './configuracion-asistencia/configuracion-asistencia.component'
import { ConfiguracionGruposComponent } from './configuracion-grupos/configuracion-grupos.component'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { GeneralService } from '@/app/servicios/general.service'
import { MessageService } from 'primeng/api'
@Component({
    selector: 'app-auxiliar',
    standalone: true,
    imports: [
        PrimengModule,
        HistorialAsistenciaComponent,
        ConfiguracionAsistenciaComponent,
        ConfiguracionGruposComponent,
    ],
    providers: [MessageService],
    templateUrl: './auxiliar.component.html',
    styleUrl: './auxiliar.component.scss',
})
export class AuxiliarComponent implements OnInit {
    @Input() datosGrupos: any = []

    visible: boolean = false
    grupo: boolean = false
    habilitarGrupo: boolean = true

    nombreGrupo: string | undefined
    descripcionGrupo: string | undefined
    iSedeId: string

    mensaje: any[] | undefined

    private generalService = inject(GeneralService)
    private constantesService = inject(ConstantesService)

    constructor(private messageService: MessageService) {
        this.iSedeId = this.constantesService.iSedeId
    }

    ngOnInit() {
        this.verificarCreacionGrupos()
    }

    verificarCreacionGrupos() {
        const params = {
            petition: 'post',
            group: 'asi',
            prefix: 'grupos',
            ruta: 'verificar-grupo-asistencia',
            data: {
                iSedeId: this.iSedeId,
            },
        }
        this.getInformation(params, 'verificar_grupos')
    }

    getInformation(params, accion) {
        this.generalService.getGralPrefix(params).subscribe({
            next: (response: any) => {
                this.accionBtnItem({ accion, item: response?.data })
            },
            error: (error) => {
                const mensaje = error.error.message
                this.messageService.add({
                    severity: 'error',
                    summary: 'Sin Grupos',
                    detail: mensaje,
                })
            },
            complete: () => {},
        })
    }
    accionBtnItem(elemento): void {
        const { accion } = elemento
        const { item } = elemento

        switch (accion) {
            case 'verificar_grupos':
                if (item) {
                    this.datosGrupos = item
                    this.grupo = true
                    this.habilitarGrupo = false
                }
                this.messageService.add({
                    severity: 'success',
                    summary: 'Grupos Creados',
                    detail: 'Se creo con exito los grupos de Asistencia',
                })
                break
            default:
                break
        }
    }
}
