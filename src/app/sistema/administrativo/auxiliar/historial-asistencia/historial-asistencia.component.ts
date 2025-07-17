import { Component, inject, OnInit, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { PrimengModule } from '@/app/primeng.module'
import { MessageService } from 'primeng/api'
import { GeneralService } from '@/app/servicios/general.service'
import { ConstantesService } from '@/app/servicios/constantes.service'
@Component({
    selector: 'app-historial-asistencia',
    standalone: true,
    imports: [FormsModule, CommonModule, PrimengModule],
    templateUrl: './historial-asistencia.component.html',
    styleUrl: './historial-asistencia.component.scss',
})
export class HistorialAsistenciaComponent implements OnInit {
    @Input() datosGrupos: any = []
    iSedeId: string
    selGrupo: any
    personal: any = []

    grupo: any = [
        { id: 1, cNombre: 'Todos' },
        { id: 2, cNombre: 'Auxiliar' },
        { id: 3, cNombre: 'Estudiante' },
        { id: 4, cNombre: 'Docente' },
        { id: 5, cNombre: 'Administrativo' },
    ]

    headers: any = [
        { campo: '#' },
        { campo: 'Nombre y Apellidos' },
        { campo: 'Grupo' },
        { campo: 'Hora de Ingreso' },
        { campo: 'Acciones' },
    ]

    private generalService = inject(GeneralService)
    private constantesService = inject(ConstantesService)

    constructor(private messageService: MessageService) {
        this.iSedeId = this.constantesService.iSedeId
    }

    ngOnInit() {
        console.log()
        // this.buscarGrupos();
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
                    this.grupo = item
                }
                break
            default:
                break
        }
    }
}
