import { Component, inject, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PrimengModule } from '@/app/primeng.module'
import { FormsModule } from '@angular/forms'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { GeneralService } from '@/app/servicios/general.service'
import { MessageService } from 'primeng/api'
@Component({
    selector: 'app-configuracion-asistencia',
    standalone: true,
    imports: [CommonModule, PrimengModule, FormsModule],
    providers: [MessageService],
    templateUrl: './configuracion-asistencia.component.html',
    styleUrl: './configuracion-asistencia.component.scss',
})
export class ConfiguracionAsistenciaComponent implements OnInit {
    visible: boolean = false
    nombreGrupo: string | undefined
    descripcionGrupo: string | undefined
    iSedeId: string
    selRol: any | number = 1
    time: Date | undefined
    grupo = []
    roles: any = [
        { id: 1, cNombre: 'Docente' },
        { id: 2, cNombre: 'Administrativo' },
        { id: 3, cNombre: 'Estudiante' },
    ]

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
        // this.visible = false
    }

    buscarGrupos() {
        const params = {
            petition: 'post',
            group: 'asi',
            prefix: 'grupos',
            ruta: 'verificar-grupo-asistencia',
            data: {
                iSedeId: this.iSedeId,
            },
            params: { skipSuccessMessage: true },
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
                    console.log(item)
                    this.grupo = item
                }
                break
            case 'guardar_grupos':
                const respuesta = Number(item[0]['respuesta'])
                if (respuesta != 0) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Nuevo Grupo',
                        detail: 'Se ha creado el grupo',
                        life: 10000,
                    })
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Fallo al Crear Nuevo Grupo',
                        detail: 'No se ha creado el grupo porque ya existe',
                        life: 10000,
                    })
                }
                this.visible = false
                break
            default:
                break
        }
    }
}
