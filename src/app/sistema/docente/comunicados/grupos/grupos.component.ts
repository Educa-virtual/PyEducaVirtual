import { Component, inject } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { FormsModule } from '@angular/forms'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { GeneralService } from '@/app/servicios/general.service'
import { MessageService } from 'primeng/api'
@Component({
    selector: 'app-grupos',
    standalone: true,
    imports: [PrimengModule, FormsModule, TablePrimengComponent],
    templateUrl: './grupos.component.html',
    styleUrl: './grupos.component.scss',
})
export class GruposComponent {
    private GeneralService = inject(GeneralService)
    constructor(
        private ConstantesService: ConstantesService,
        private messageService: MessageService
    ) {
        this.iSedeId = this.ConstantesService.iSedeId
        this.iIieeId = this.ConstantesService.iIieeId
        this.iYAcadId = this.ConstantesService.iYAcadId
    }
    iSedeId: string = ''
    iIieeId: string = ''
    iYAcadId: string = ''
    visible = true
    grupo: string
    columnas = [
        {
            type: 'item-checkbox',
            width: '1rem',
            field: 'iSeleccionado',
            header: 'Elegir',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'item',
            width: '1rem',
            field: 'cItem',
            header: '#',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '1rem',
            field: 'documento',
            header: 'Documento',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '1rem',
            field: 'completos',
            header: 'Apellidos y Nombres',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '1rem',
            field: 'contacto',
            header: 'Numero Telf. del Contacto',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '1rem',
            field: 'domicilio',
            header: 'Direccion Domiciliaria',
            text_header: 'center',
            text: 'center',
        },
    ]
    data = []
    cities = [
        { grupo: 'Docentes', codigo: 2 },
        { grupo: 'Estudiantes', codigo: 1 },
        // { grupo: 'Personal Ugel', codigo: 4 },
    ]

    mostrarMdoal() {
        this.visible = !this.visible
    }

    mostrarDocentes() {
        if (this.grupo) {
            this.obtenerMiembros(this.grupo['codigo'])
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Advertencia',
                detail: 'Debe Seleccionar Tipo de Persona',
            })
        }
    }

    obtenerMiembros(opcion: number | string) {
        const params = {
            petition: 'post',
            group: 'com',
            prefix: 'miembros',
            ruta: 'obtener_miembros',
            data: {
                opcion: opcion,
                iIieeId: this.iIieeId,
                iYAcadId: this.iYAcadId,
                iSedeId: this.iSedeId,
            },
        }
        this.getInformation(params, 'obtenerMiembros')
    }
    getInformation(params, accion) {
        this.GeneralService.getGralPrefix(params).subscribe({
            next: (response: any) => {
                this.accionBtnItem({ accion, item: response?.data })
            },
            complete: () => {},
        })
    }
    accionBtnItem(event): void {
        const { accion } = event
        const { item } = event

        switch (accion) {
            case 'obtenerMiembros':
                this.data = item
                break
            case 'setearDataxiSeleccionado':
                console.log(item)
                break
        }
    }
}
