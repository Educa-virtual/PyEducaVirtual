import { Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { PrimengModule } from '@/app/primeng.module'
import { MessageService } from 'primeng/api'
import { GeneralService } from '@/app/servicios/general.service'
import { ConstantesService } from '@/app/servicios/constantes.service'

@Component({
    selector: 'app-configuracion-grupos',
    standalone: true,
    imports: [CommonModule, FormsModule, PrimengModule],
    templateUrl: './configuracion-grupos.component.html',
    styleUrl: './configuracion-grupos.component.scss',
})
export class ConfiguracionGruposComponent implements OnInit {
    // @Input() datosGrupos: any = [];
    elegir: boolean = false
    ingreso: string | undefined
    salida: string | undefined
    visible: boolean = false
    time: Date[] | undefined
    datosGrupos: any = []
    iSedeId: string
    nombreGrupo: string | undefined
    descripcionGrupo: string | undefined

    private generalService = inject(GeneralService)
    private constantesService = inject(ConstantesService)

    constructor(private messageService: MessageService) {
        this.iSedeId = this.constantesService.iSedeId
    }

    ngOnInit() {
        this.buscarGrupos()
    }

    guardarGrupo() {
        const params = {
            petition: 'post',
            group: 'asi',
            prefix: 'grupos',
            ruta: 'guardar-grupo-asistencia',
            data: {
                cGrupoNombre: this.nombreGrupo,
                cGrupoDescripcion: this.descripcionGrupo,
                iSedeId: this.iSedeId,
            },
        }
        this.getInformation(params, 'guardar_grupos')
    }

    buscarGrupos() {
        const params = {
            petition: 'post',
            group: 'asi',
            prefix: 'grupos',
            ruta: 'verificar-horario',
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
            case 'guardar_grupos':
                break
            case 'verificar_grupos':
                if (item) {
                    this.datosGrupos = item.map((element) => {
                        if (element.configuracion != null) {
                            return {
                                ...element,
                                configuracion: JSON.parse(
                                    element.configuracion
                                ),
                            }
                        } else {
                            return {
                                ...element,
                                configuracion: {
                                    iConfHorarioId: 0,
                                    iGrupoId: 0,
                                    tConfHorarioEntTur: '1900-01-01T00:00:00',
                                    tConfHorarioSalTur: '1900-01-01T00:00:00',
                                },
                            }
                        }
                    })
                }
                break
            default:
                break
        }
    }
}
