import {
  TableColumn,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { ProgressBarModule } from 'primeng/progressbar';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule } from 'primeng/fileupload';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MessageService } from 'primeng/api';
import { GeneralService } from '@/app/servicios/general.service';

@Component({
  selector: 'app-curricula-curso',
  standalone: true,
  imports: [
    ContainerPageComponent,
    ReactiveFormsModule,
    TablePrimengComponent,
    DialogModule,
    ImageModule,
    ProgressBarModule,
    EditorModule,
    FileUploadModule,
    ToggleButtonModule,
  ],
  templateUrl: './curricula-curso.component.html',
  styleUrl: './curricula-curso.component.scss',
})
export class CurriculaCursoComponent implements OnChanges {
  @Output() asignarCurso = new EventEmitter();

  @Input() iCurrId: number = 0;

  frmCursos: FormGroup;
  cursos: any = null;
  visible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private query: GeneralService
  ) {
    this.frmCursos = this.fb.group({
      iCurrId: [''],
      iTipoCursoId: [''],
      cCursoNombre: [''],
      nCursoCredTeoria: [''],
      nCursoCredPractica: [''],
      cCursoDescripcion: [''],
      nCursoTotalCreditos: [''],
      cCursoPerfilDocente: [''],
      iCursoTotalHoras: [''],
      iCursoEstado: [''],
      cCursoImagen: [''],
    });
  }
  choose(event, callback) {
    console.log('click');

    callback();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cursos'] && changes['cursos'].currentValue) {
      //this.inicializacion();
    }
  }

  inicializacion() {
    //const item = event.item || this.cursos || null
    this.query
      .searchCalendario({
        json: JSON.stringify({
          id: this.iCurrId,
        }),
        _opcion: 'getCursoNivelGrado',
      })
      .subscribe({
        next: (data: any) => {
          this.cursos = data.data;
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del sistema',
            detail: 'Error de conexión' + error.error.message,
          });
        },
        complete: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Mensaje del sistema',
            detail: 'Se cargo exitosamente',
          });
        },
      });
    // this.frmCursos.patchValue({
    //     iCurrId: item.iCurrId,
    //     iTipoCursoId: item.iTipoCursoId,
    //     cCursoNombre: item.cCursoNombre,
    //     nCursoCredTeoria: item.nCursoCredTeoria,
    //     nCursoCredPractica: item.nCursoCredPractica,
    //     cCursoDescripcion: item.cCursoDescripcion,
    //     nCursoTotalCreditos: item.nCursoTotalCreditos,
    //     cCursoPerfilDocente: item.cCursoPerfilDocente,
    //     iCursoTotalHoras: item.iCursoTotalHoras,
    //     iCursoEstado: item.iCursoEstado,
    //     cCursoImagen: item.cCursoImagen,
    // })
  }

  cursosColumns: TableColumn = {
    inTableColumnsGroup: [
      [
        {
          type: 'text',
          width: '5rem',
          text_header: 'center',
          field: '',
          header: 'ITEM',
          text: 'center',
          colspan: 1,
          rowspan: 2,
        },
      ],
      [
        {
          type: 'text',
          width: '5rem',
          text_header: 'center',
          field: 'B11',
          header: 'ITEM',
          text: 'center',
          colspan: 1,
          rowspan: 2,
        },
      ],
    ],
    inTableColumns: [
      {
        type: 'item',
        width: '5rem',
        field: '',
        header: 'Item',
        text_header: 'center',
        text: 'center',
      },
      {
        type: 'text',
        width: '5rem',
        field: 'cCursoNombre',
        header: 'Nombre',
        text_header: 'center',
        text: 'center',
      },
      {
        type: 'text',
        width: '5rem',
        field: 'nCursoTotalCreditos',
        header: 'Créditos totales',
        text_header: 'center',
        text: 'center',
      },
      {
        type: 'text',
        width: '5rem',
        field: 'iCursoTotalHoras',
        header: 'Horas totales',
        text_header: 'center',
        text: 'center',
      },
      {
        type: 'estado-activo',
        width: '5rem',
        field: 'iCursoEstado',
        header: 'Estado',
        text_header: 'center',
        text: 'center',
      },
      {
        type: 'actions',
        width: '3rem',
        field: 'actions',
        header: 'Acciones',
        text_header: 'center',
        text: 'center',
      },
    ],
  };

  accionBtnCursos(event: any) {
    this.frmCursos.reset();

    switch (event.accion) {
      case 'agregar':
        this.cursos = {
          ...this.cursos,
          title: 'Agregar curso',
          visible: true,
        };
        break;
      case 'editar':
        this.frmCursos.reset();

        this.cursos.container.actions = [];

        this.cursos = {
          ...this.cursos,
          title: 'Editar curso',
          visible: true,
        };

        this.frmCursos.patchValue({
          iCurrId: event.item.iCurrId,
          iTipoCursoId: event.item.iTipoCursoId,
          cCursoNombre: event.item.cCursoNombre,
          nCursoCredTeoria: event.item.nCursoCredTeoria,
          nCursoCredPractica: event.item.nCursoCredPractica,
          cCursoDescripcion: event.item.cCursoDescripcion,
          nCursoTotalCreditos: event.item.nCursoTotalCreditos,
          cCursoPerfilDocente: event.item.cCursoPerfilDocente,
          iCursoTotalHoras: event.item.iCursoTotalHoras,
          iCursoEstado: event.item.iCursoEstado,
          cCursoImagen: event.item.cCursoImagen,
        });

        break;
      // case 'assignCursosInNivelesGrados':
      // Object.keys(
      //     this.forms.assignCursosInNivelesGrados.controls
      // ).forEach((field) => {
      //     const control =
      //         this.forms.assignCursosInNivelesGrados.get(field)
      //     control?.markAsTouched() // Marca como tocado (touched)
      //     control?.markAsDirty() // Marca como modificado (dirty)
      // })

      // if (this.forms.assignCursosInNivelesGrados.invalid) return

      // break

      default:
        break;
    }
  }

  cursosSave() {
    // if (!this.frmCurso.iCurrId) {
    //     return this.cursosService.insCursos(payload)
    // } else {
    //     return this.cursosService.insCursos({
    //         ...payload,
    //         iCursoId: formCurso.iCursoId,
    //     })
    // }
  }
}
