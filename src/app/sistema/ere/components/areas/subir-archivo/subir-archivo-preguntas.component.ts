import { PrimengModule } from '@/app/primeng.module'
import { Component, inject, OnInit, ViewChild } from '@angular/core'
import { InputFileUploadComponent } from '../../../../../shared/input-file-upload/input-file-upload.component'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ICurso } from '@/app/sistema/aula-virtual/sub-modulos/cursos/interfaces/curso.interface'
import { StringCasePipe } from '@/app/shared/pipes/string-case.pipe'
import { ApiEvaluacionesRService } from '@/app/sistema/evaluaciones/services/api-evaluaciones-r.service'
import { MessageService } from 'primeng/api'

@Component({
    selector: 'app-subir-archivo-preguntas',
    standalone: true,
    imports: [PrimengModule, InputFileUploadComponent],
    templateUrl: './subir-archivo-preguntas.component.html',
    styleUrl: './subir-archivo-preguntas.component.scss',
    providers: [StringCasePipe, MessageService],
})
export class SubirArchivoPreguntasComponent implements OnInit {
    @ViewChild(InputFileUploadComponent)
    fileUploadComponent!: InputFileUploadComponent
    visible: boolean = false
    private evaluacionesService = inject(ApiEvaluacionesRService)
    titulo: string = ''
    form: FormGroup
    curso: ICurso
    iEvaluacionIdHashed: string = ''

    constructor(
        private fb: FormBuilder,
        private stringCasePipe: StringCasePipe,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        try {
            this.form = this.fb.group({
                archivo: [null, Validators.required],
            })
        } catch (error) {
            console.log(error, 'error de formulario')
        }
    }

    descargarArchivoEnSistema(event: Event) {
        event.preventDefault()
        if (this.curso.bTieneArchivo) {
            const params = {
                iEvaluacionId: this.iEvaluacionIdHashed,
                iCursosNivelGradId: this.curso.iCursosNivelGradId,
            }
            this.evaluacionesService.descargarPreguntasPorArea(params)
        } else {
            alert('No se ha subido un archivo para esta área.')
        }
    }

    mostrarDialog(datos: { curso: ICurso; iEvaluacionIdHashed: string }) {
        this.titulo = `Subir PDF: ${this.stringCasePipe.transform(datos.curso.cCursoNombre)} - ${datos.curso.cGradoAbreviacion.toString().substring(0, 1)}° Grado
        - ${datos.curso.cNivelTipoNombre.toString().replace('Educación ', '')}`
        this.visible = true
        this.curso = datos.curso
        this.iEvaluacionIdHashed = datos.iEvaluacionIdHashed
        this.fileUploadComponent.clear()
    }

    handleArchivo(event) {
        const file = (event.target as HTMLInputElement)?.files?.[0]
        this.form.patchValue({
            archivo: file,
        })
    }

    subirArchivo() {
        const formData: FormData = new FormData()
        formData.append('archivo', this.form.controls['archivo'].value)
        this.evaluacionesService
            .subirArchivoEvaluacionArea(
                this.iEvaluacionIdHashed,
                this.curso.iCursosNivelGradId,
                formData
            )
            .subscribe({
                next: (data: any) => {
                    if (data.status.toLowerCase() == 'success') {
                        this.visible = false
                    }
                    this.messageService.add({
                        severity: data.status.toLowerCase(),
                        summary: 'Mensaje',
                        detail: data.message,
                        life: 5000,
                    })
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'danger',
                        summary: 'Mensaje',
                        detail: error,
                        life: 5000,
                    })
                },
            })
    }
}
