import { PrimengModule } from '@/app/primeng.module'
import { Component, OnInit } from '@angular/core'
import {
    TablePrimengComponent,
    IColumn,
} from '@/app/shared/table-primeng/table-primeng.component'
import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component'
import { FileUploadModule } from 'primeng/fileupload'
import { MessageService } from 'primeng/api'

@Component({
    selector: 'app-apertura-curso',
    standalone: true,
    templateUrl: './apertura-curso.component.html',
    styleUrls: ['./apertura-curso.component.scss'],
    imports: [
        PrimengModule,
        ToolbarPrimengComponent,
        TablePrimengComponent,
        FileUploadModule,
    ],
    providers: [MessageService],
})
export class AperturaCursoComponent implements OnInit {
    uploadedFiles: any[] = []
    cursos = [
        {
            nombreCurso: 'Aprendizaje Basado en Proyectos',
            fechaFin: '25/03/25',
        },
        {
            nombreCurso: 'Aprendizaje Basado en Proyectos',
            fechaFin: '25/03/25',
        },
        {
            nombreCurso: 'Aprendizaje Basado en Proyectos',
            fechaFin: '25/03/25',
        },
        {
            nombreCurso: 'Aprendizaje Basado en Proyectos',
            fechaFin: '25/03/25',
        },
        {
            nombreCurso: 'Aprendizaje Basado en Proyectos',
            fechaFin: '25/03/25',
        },
    ]
    constructor(private messageService: MessageService) {}

    public formNuevaCapacitacion

    ngOnInit() {
        console.log('')
    }
    public columnasTabla: IColumn[] = [
        {
            type: 'item',
            width: '0.5rem',
            field: 'index',
            header: 'Nro',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'nombreCurso',
            header: 'Título del curso',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '1rem',
            field: 'fechaFin',
            header: 'Fecha Fin',
            text_header: 'center',
            text: 'center',
        },
    ]
    onUpload(event: any) {
        let file
        for (file of event.files) {
            this.uploadedFiles.push(file)
        }
        this.messageService.add({
            severity: 'info',
            summary: 'File Uploaded',
            detail: '',
        })
    }
}
