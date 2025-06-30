import { PrimengModule } from '@/app/primeng.module'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { Component, inject, OnInit } from '@angular/core'
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
export class BackupBdComponent implements OnInit {
    titulo: string = 'Crear backup de base de datos'
    private backupBdService = inject(BackupBdService)
    dataHistorialBackups: any[] = []
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
            width: '5rem',
            text: 'left',
            text_header: 'center',
        },
        {
            field: 'cPersNombre',
            header: 'Creado por',
            type: 'text',
            width: '10rem',
            text: 'left',
            text_header: 'center',
        },
        {
            field: 'cBackupNombre',
            header: 'Nombre de archivo',
            type: 'text',
            width: '9rem',
            text: 'left',
            text_header: 'center',
        },
        {
            field: 'cBackupStatus',
            header: 'Estado de copia',
            type: 'text',
            width: '4rem',
            text: 'center',
            text_header: 'center',
        },
        {
            field: 'iDiasParaEliminarse',
            header: 'Días para eliminarse',
            type: 'text',
            width: '3rem',
            text: 'center',
            text_header: 'Días para eliminarse',
        },
        /*{
            field: 'bArchivoEliminado',
            header: 'Eliminado',
            type: 'tag',
            width: '3rem',
            text: 'center',
            text_header: 'center',
            styles: {
                'SI' : 'danger',
                'NO' : 'success'
            }
        },*/
    ]

    constructor(
        private messageService: MessageService,
        private store: LocalStoreService
    ) {}

    ngOnInit() {
        console.log('ok')
        //this.obtenerHistorialBackups()
    }

    obtenerHistorialBackups() {
        this.backupBdService.obtenerHistorialBackups().subscribe({
            next: (respuesta: any) => {
                this.dataHistorialBackups = respuesta['data']
            },
            error: (error) => {
                console.log('error obtenido' + error)
            },
        })
    }

    crearCopia() {
        this.backupBdService.realizarCopiaSeguridad().subscribe({
            next: (data: any) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Mensaje',
                    detail: data.message,
                })
                //this.obtenerHistorialBackups()
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error,
                })
            },
        })
    }
}
