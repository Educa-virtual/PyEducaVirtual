import { PrimengModule } from '@/app/primeng.module'
import { Component, OnInit } from '@angular/core'
import { InputFileUploadComponent } from '../../../../../shared/input-file-upload/input-file-upload.component'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ICurso } from '@/app/sistema/aula-virtual/sub-modulos/cursos/interfaces/curso.interface'

@Component({
    selector: 'app-subir-archivo-preguntas',
    standalone: true,
    imports: [PrimengModule, InputFileUploadComponent],
    templateUrl: './subir-archivo-preguntas.component.html',
    styleUrl: './subir-archivo-preguntas.component.scss',
})
export class SubirArchivoPreguntasComponent implements OnInit {
    visible: boolean = false
    //curso: ICurso = null
    //iEvaluacionIdHashed: string = ''
    titulo: string = ''
    //private rutaArchivoActual: string = ''
    form: FormGroup

    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        try {
            this.form = this.fb.group({
                archivo: [null, Validators.required],
            })
        } catch (error) {
            console.log(error, 'error de formulario')
        }
    }

    mostrarDialog(datos: { curso: ICurso; iEvaluacionIdHashed: string }) {
        this.titulo = `${datos.curso.cCursoNombre} - ${datos.curso.cGradoAbreviacion.toString().substring(0, 1)}° Grado
        - ${datos.curso.cNivelTipoNombre.toString().replace('Educación ', '')}`
        this.visible = true
    }

    handleArchivo(event) {
        const file = (event.target as HTMLInputElement)?.files?.[0]
        this.form.patchValue({
            archivo: file,
        })
    }

    subirArchivo() {
        console.log('Subir')
        /*const formData: FormData = new FormData()
        formData.append('archivo', this.form.controls['archivo'].value)
        formData.append('iYAcadId', this.iYAcadId)
        formData.append('iSedeId', this.iSedeId)
        formData.append('iCredId', this.constantesService.iCredId)
        formData.append('tipo', 'matriculas')

        this.datosMatriculaService.subirArchivoMatriculas(formData).subscribe({
            next: (data: any) => {
                console.log(data, 'subir archivo')
                this.visible = false
                this.mostrarResultados(data.data)
            },
            error: (error) => {
                console.error('Error subiendo archivo:', error)
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error,
                })
            },
            complete: () => {
                console.log('Request completed')
            },
        })*/
    }
}
