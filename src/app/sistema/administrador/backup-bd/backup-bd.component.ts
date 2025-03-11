import { PrimengModule } from '@/app/primeng.module'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { Component, inject } from '@angular/core'
import { BackupBdService } from './services/backup-bd.service'
import { MessageService } from 'primeng/api'
import {
    IColumn,
    TablePrimengComponent,
} from '../../../shared/table-primeng/table-primeng.component'
import { LocalStoreService } from '@/app/servicios/local-store.service'

@Component({
    selector: 'app-backup-bd',
    standalone: true,
    imports: [ContainerPageComponent, PrimengModule, TablePrimengComponent],
    templateUrl: './backup-bd.component.html',
    styleUrl: './backup-bd.component.scss',
})
export class BackupBdComponent {
    titulo: string = 'Crear backup de base de datos'
    private backupBdService = inject(BackupBdService)
    filteredData: any[] = []
    columnas: IColumn[] = [
        {
            type: 'item',
            width: '0.5rem',
            field: 'index',
            header: '#',
            text_header: 'center',
            text: 'center',
        },
        {
            field: 'dtBackupCreacion',
            header: 'Fecha y hora',
            type: 'text',
            width: '3rem',
            text: 'left',
            text_header: 'Fecha y hora',
        },
        {
            field: 'cBackupNombre',
            header: 'Nombre de archivo',
            type: 'text',
            width: '3rem',
            text: 'left',
            text_header: 'Nombre de archivo',
        },
        {
            field: 'cBackupStatus',
            header: 'Estado de copia',
            type: 'text',
            width: '3rem',
            text: 'left',
            text_header: 'Estado de copia',
        },
        {
            field: 'iDiasEliminacion',
            header: 'Días para eliminarse',
            type: 'text',
            width: '3rem',
            text: 'left',
            text_header: 'Días para eliminarse',
        },
        {
            field: 'bArchivoEliminado',
            header: 'Eliminado',
            type: 'text',
            width: '3rem',
            text: 'left',
            text_header: 'Eliminado',
        },
    ]

    constructor(
        private messageService: MessageService,
        private store: LocalStoreService
    ) {}

    crearCopia() {
        this.backupBdService.realizarCopiaSeguridad().subscribe({
            next: (data: any) => {
                this.messageService.add({
                    severity: data.status.toLowerCase(),
                    summary: 'Mensaje',
                    detail: data.message,
                    life: 5000,
                })
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error,
                    life: 5000,
                })
            },
        })
    }
}
