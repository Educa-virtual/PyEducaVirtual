import { PrimengModule } from '@/app/primeng.module'
import { Component, inject, OnInit } from '@angular/core'
import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component'
import {
    TablePrimengComponent,
    IColumn,
} from '@/app/shared/table-primeng/table-primeng.component'
import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component'
import { FileUploadModule } from 'primeng/fileupload'
import { MessageService } from 'primeng/api'
import { InputSwitchModule } from 'primeng/inputswitch'
import { FormBuilder, Validators } from '@angular/forms'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'

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
        InputSwitchModule,
        CommonInputComponent,
    ],
    providers: [MessageService],
})
export class AperturaCursoComponent implements OnInit {
    uploadedFiles: any[] = []
    iPago: boolean = true
    // datos de prueba que seran remplazadas:
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
    private _formBuilder = inject(FormBuilder)
    private _confirmService = inject(ConfirmationModalService)

    constructor(private messageService: MessageService) {}

    // formGroup para el formulario
    public formNuevaCapacitacion = this._formBuilder.group({
        capacitacion: ['1', [Validators.required]],
        titulo: ['', [Validators.required]],
        nivelEducativo: ['1', [Validators.required]],
        dirigidoPa: ['1'],
        cDescripcion: [''],
        hora: ['', [Validators.required]],
        fechaIni: [new Date()],
        fechaFin: [new Date()],
        nompreProf: [],
        iPago: [0],
        montoPago: [''],
    })

    ngOnInit() {
        console.log('')
    }
    // mostrar los headr de las tablas
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
    //para subir la imagen
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
    // metodo para guardar el curso creado
    crearCurso() {
        // revisar si tiene datos formNuevaCapacitacion para registrar el curso
        const titulo = this.formNuevaCapacitacion.get('titulo')?.value || ''
        // alert en caso si no tiene datos los campos del formulario
        if (titulo == '') {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Tiene que agregar un Título al curso',
            })
        } else {
            // alert antes de guardar el curso creado
            this._confirmService.openConfiSave({
                message: 'Recuerde que no podra retroceder',
                header: `¿Esta seguro que desea guardar: ${titulo} ?`,
                accept: () => {
                    // Mensaje de guardado(opcional)
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Guardado',
                        detail: 'Acción éxitosa',
                    })
                    console.log(
                        'datos de curso',
                        this.formNuevaCapacitacion.value
                    )
                    this.formNuevaCapacitacion.reset()
                },
                reject: () => {
                    // Mensaje de cancelación (opcional)
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Cancelado',
                        detail: 'Curso no Guardado',
                    })
                },
            })
        }
    }
}
