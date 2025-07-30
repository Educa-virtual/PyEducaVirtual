import { PrimengModule } from '@/app/primeng.module';
import { Component, EventEmitter, inject, OnInit, Output, ViewChild } from '@angular/core';
import { InputFileUploadComponent } from '@shared//input-file-upload/input-file-upload.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICurso } from '@/app/sistema/aula-virtual/sub-modulos/cursos/interfaces/curso.interface';
import { StringCasePipe } from '@/app/shared/pipes/string-case.pipe';
import { ApiEvaluacionesRService } from '@/app/sistema/ere/evaluaciones/services/api-evaluaciones-r.service';
import { MessageService } from 'primeng/api';

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
  fileUploadComponent!: InputFileUploadComponent;
  visible: boolean = false;
  private evaluacionesService = inject(ApiEvaluacionesRService);
  titulo: string = '';
  form: FormGroup;
  curso: ICurso;
  @Output() archivoSubidoEvent = new EventEmitter<{ curso: ICurso }>();

  constructor(
    private fb: FormBuilder,
    private stringCasePipe: StringCasePipe,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    try {
      this.form = this.fb.group({
        archivo: [null, Validators.required],
      });
    } catch (error) {
      console.log(error, 'error de formulario');
    }
  }

  descargarArchivoEnSistema(event: Event) {
    event.preventDefault();
    if (this.curso.bTieneArchivo) {
      const params = {
        iEvaluacionId: this.curso.iEvaluacionIdHashed,
        iCursosNivelGradId: this.curso.iCursosNivelGradId,
        tipoArchivo: 'pdf',
      };
      this.evaluacionesService.descargarArchivoPreguntasPorArea(params);
    } else {
      alert('No se ha subido un archivo para esta área.');
    }
  }

  mostrarDialog(datos: { curso: ICurso }) {
    this.titulo = `Subir PDF: ${this.stringCasePipe.transform(datos.curso.cCursoNombre)} - ${datos.curso.cGradoAbreviacion.toString().substring(0, 1)}° Grado
        - ${datos.curso.cNivelTipoNombre.toString().replace('Educación ', '')}`;
    this.visible = true;
    this.curso = datos.curso;
    this.fileUploadComponent.clear();
  }

  handleArchivo(event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    this.form.patchValue({
      archivo: file,
    });
  }

  subirArchivo() {
    const formData: FormData = new FormData();
    formData.append('archivo', this.form.controls['archivo'].value);
    this.evaluacionesService
      .subirArchivoEvaluacionArea(
        this.curso.iEvaluacionIdHashed,
        this.curso.iCursosNivelGradId,
        formData
      )
      .subscribe({
        next: (data: any) => {
          if (data.status.toLowerCase() == 'success') {
            this.visible = false;
            //this.curso.bTieneArchivo == true // se comenta por fallos de subida de archivo
            this.curso.bTieneArchivo = true;
            this.archivoSubidoEvent.emit({
              curso: this.curso,
            });
          }
          this.messageService.add({
            severity: data.status.toLowerCase(),
            summary: 'Mensaje',
            detail: data.message,
            life: 5000,
          });
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error,
            life: 5000,
          });
        },
      });
  }
}
