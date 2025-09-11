import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  ContainerPageComponent,
  IActionContainer,
} from '@/app/shared/container-page/container-page.component';
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
  totalCursos: any[] = [];
  nivelesTipos: any[] = [];
  grados: any[] = [];
  tiposCursos: any[] = [];
  capacidades: any[] = [];
  iCursoId: number = 0;
  capacidadesCurso: any[] = [];

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
    if (changes['iCurrId'] && changes['iCurrId'].currentValue) {
      this.inicializacion();
      this.getTipoCurso();
      this.getCapacidades();
    }
  }

  inicializacion() {
    //const item = event.item || this.cursos || null
    this.query
      .searchCalendario({
        json: JSON.stringify({
          iCurrId: this.iCurrId,
        }),
        _opcion: 'getCursoXiCurrrId',
      })
      .subscribe({
        next: (data: any) => {
          this.totalCursos = data.data;
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del sistema',
            detail: 'Error de conexión' + error.error.message,
          });
        },
        complete: () => {
          this.cursos = Array.from(
            new Map(
              this.totalCursos
                //.filter((curso: any) => curso.iCurrId === this.iCurrId)
                .map((curso: any) => [curso.iCursoId, curso])
            ).values()
          );
          this.nivelesTipos = Array.from(
            new Map(
              this.totalCursos
                //.filter((curso: any) => curso.iCurrId === this.iCurrId)
                .map((curso: any) => [curso.iNivelTipos, curso])
            ).values()
          );
          this.grados = Array.from(
            new Map(
              this.totalCursos
                //.filter((curso: any) => curso.iCurrId === this.iCurrId)
                .map((curso: any) => [curso.iNivelTipos, curso])
            ).values()
          );

          this.messageService.add({
            severity: 'success',
            summary: 'Mensaje del sistema',
            detail: 'Se cargo exitosamente',
          });
        },
      });
  }

  getCapacidades() {
    this.query
      .searchCalendario({
        json: JSON.stringify({
          iCurrId: this.iCurrId,
        }),
        _opcion: 'getCursoCapacidades',
      })
      .subscribe({
        next: (data: any) => {
          this.capacidades = data.data;
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del sistema',
            detail: 'Error de conexión' + error.error.message,
          });
        },
      });
  }
  getCapacidadesCurso() {
    this.query
      .searchCalendario({
        json: JSON.stringify({
          iCursoId: this.iCursoId,
        }),
        _opcion: 'getCursoCapacidades',
      })
      .subscribe({
        next: (data: any) => {
          this.capacidadesCurso = data.data;
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del sistema',
            detail: 'Error de conexión' + error.error.message,
          });
        },
      });
  }

  getTipoCurso() {
    this.query
      .searchCalendario({
        json: JSON.stringify({
          iCurrId: this.iCurrId,
        }),
        _opcion: 'getTipoCursos',
      })
      .subscribe({
        next: (data: any) => {
          this.tiposCursos = data.data;
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del sistema',
            detail: 'Error de conexión' + error.error.message,
          });
        },
      });
  }

  accionBtnItem(event: any) {
    const item = event.item || null;
    const accion = event.accion || null;

    switch (accion) {
      case 'cursos':
        this.asignarCurso.emit(item);
        break;

      default:
        break;
    }
  }
  accionesCursos: IActionContainer[] = [
    {
      labelTooltip: 'Agregar curso',
      text: 'Nuevo curso',
      icon: 'pi pi-plus',
      accion: 'nuevo_curso',
      class: 'p-button-primary',
    },
    {
      labelTooltip: 'Mostrar cursos',
      text: 'Mostrar cursos',
      icon: 'pi pi-search',
      accion: 'mostrar_curso',
      class: 'p-button-warning',
    },
  ];

  accionesTablaCurso: IActionTable[] = [
    {
      labelTooltip: 'Editar',
      icon: 'pi pi-pencil',
      accion: 'editar',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
    },
    {
      labelTooltip: 'Mostrar cursos',
      icon: 'pi pi-book',
      accion: 'cursos',
      type: 'item',
      class: 'p-button-rounded p-button-success p-button-text',
    },
  ];

  cursosColumns = [
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
  ];

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
