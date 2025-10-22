import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { NoDataComponent } from '@/app/shared/no-data/no-data.component';
import { FieldsetModule } from 'primeng/fieldset';
import { PrimengModule } from '@/app/primeng.module';
import { CurriculaCursoCompetenciasComponent } from '../curricula-curso-competencias/curricula-curso-competencias.component';
import { TypesFilesUploadPrimengComponent } from '@/app/shared/types-files-upload-primeng/types-files-upload-primeng.component';
import { environment } from '@/environments/environment';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { HttpClient } from '@angular/common/http';
import imagenesRecursos from '@/app/shared/imagenes/recursos';

interface Image {
  id: number;
  url: string;
  title: string;
}

@Component({
  selector: 'app-curricula-curso',
  standalone: true,
  imports: [
    ContainerPageComponent,
    TablePrimengComponent,
    DialogModule,
    ImageModule,
    ProgressBarModule,
    EditorModule,
    FileUploadModule,
    ToggleButtonModule,
    ReactiveFormsModule,
    NoDataComponent,
    FieldsetModule,
    PrimengModule,
    FormsModule,
    CurriculaCursoCompetenciasComponent,
    TypesFilesUploadPrimengComponent,
  ],
  templateUrl: './curricula-curso.component.html',
  styleUrl: './curricula-curso.component.scss',
})
export class CurriculaCursoComponent implements OnChanges {
  @Output() asignarCurso = new EventEmitter();

  @Input() iCurrId: number = 0;
  @Input() curriculas: any = [];

  cursos: any[] = [];
  visible: boolean = false;
  totalCursos: any[] = [];
  nivelesTipos: any[] = [];
  grados: any[] = [];
  tiposCursos: any[] = [];
  capacidades: any[] = [];
  iCursoId: number = 0;
  capacidadesCurso: any[] = [];
  titulo: string = '';

  perfil: any;
  filesUrl = [];
  typesFiles = {
    file: false,
    url: false,
    youtube: false,
    repository: false,
    image: true,
  };
  portada = imagenesRecursos;
  selectedImageId: any;
  ruta_imagen: string = '';
  showVistaPrevia: boolean = false;
  datosprevios: any;
  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5,
    },
    {
      breakpoint: '768px',
      numVisible: 3,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
    },
  ];

  backend = environment.backend;
  private http = inject(HttpClient);
  private backendApi = environment.backendApi;
  private _LocalStoreService = inject(LocalStoreService);
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private query: GeneralService
  ) {
    this.perfil = this._LocalStoreService.getItem('dremoPerfil');
    this.ruta_imagen = String('cursos/images/SVG/');
  }

  frmCursos = this.fb.group({
    iCursoId: [0],
    iCurrId: ['', Validators.required],
    iTipoCursoId: ['', Validators.required],
    cCursoNombre: [''],
    nCursoCredTeoria: [''],
    nCursoCredPractica: [''],
    cCursoDescripcion: [''],
    nCursoTotalCreditos: [''],
    cCursoPerfilDocente: [''],
    iCursoTotalHoras: [''],
    iCursoEstado: ['', Validators.required],
    cCursoImagen: [''],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['iCurrId'] && changes['iCurrId'].currentValue) {
      // Si iCurrId cambió y tiene valor válido
      this.inicializacion();
      this.getTipoCurso();
    }

    if (changes['curriculas'] && changes['curriculas'].currentValue) {
      // Si curriculas cambió
      this.curriculas = changes['curriculas'].currentValue;
    }
  }

  inicializacion() {
    //const item = event.item || this.cursos || null
    this.cursos = [];
    this.query
      .searchCalendario({
        json: JSON.stringify({
          iCurrId: this.iCurrId,
        }),
        _opcion: 'getCursoXiCurrrId',
      })
      .subscribe({
        next: (data: any) => {
          // this.totalCursos = data.data;
          this.cursos = data.data;
        },
        error: error => {
          let message = error?.error?.message || 'Error desconocido';
          const match = message.match(/]([^\]]+?)\./);
          if (match && match[1]) {
            message = match[1].trim() + '.';
          }
          message = decodeURIComponent(message);
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del sistema',
            detail: message,
          });
        },
        complete: () => {
          if (this.cursos && this.cursos.length === 0) {
            this.messageService.add({
              severity: 'warning',
              summary: 'Mensaje del sistema',
              detail: 'La curricula no cuenta con áreas curriculares',
            });
            return;
          }
        },
      });
  }

  // getCapacidades() {
  //   this.query
  //     .searchCalendario({
  //       json: JSON.stringify({
  //         iCurrId: this.iCurrId,
  //       }),
  //       _opcion: 'getCursoCapacidades',
  //     })
  //     .subscribe({
  //       next: (data: any) => {
  //         this.capacidades = data.data;
  //       },
  //       error: error => {
  //         this.messageService.add({
  //           severity: 'error',
  //           summary: 'Mensaje del sistema',
  //           detail: 'Error de conexión' + error.error.message,
  //         });
  //       },
  //     });
  // }
  // getCapacidadesCurso() {
  //   this.query
  //     .searchCalendario({
  //       json: JSON.stringify({
  //         iCursoId: this.iCursoId,
  //       }),
  //       _opcion: 'getCursoCapacidades',
  //     })
  //     .subscribe({
  //       next: (data: any) => {
  //         this.capacidadesCurso = data.data;
  //       },
  //       error: error => {
  //         this.messageService.add({
  //           severity: 'error',
  //           summary: 'Mensaje del sistema',
  //           detail: 'Error de conexión' + error.error.message,
  //         });
  //       },
  //     });
  // }

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
      case 'agregar':
        (this.titulo = 'Formulario para agregar  área curricular'), this.frmCursos.reset();
        this.visible = true;
        break;

      case 'editar':
        this.titulo = 'Formulario para editar áreas curriculares';
        this.frmCursos.reset();
        this.iCursoId = event.item.iCursoId;

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
        });
        this.frmCursos.get('cCursoImagen')?.setValue(event.item.cCursoImagen), (this.filesUrl = []);
        if ((event.item.cCursoImagen ?? '').length > 0) {
          this.filesUrl.push({
            name: 'imagen',
            ruta: event.item.cCursoImagen,
          });
          this.ruta_imagen = event.item.cCursoImagen;
        }

        this.visible = true;

        break;

      default:
        break;
    }
  }

  // mostrar modal de visualizacion de una vista previa del curso creado
  showVistaPreviaCurso() {
    this.showVistaPrevia = true;
    this.datosprevios = this.frmCursos.value;
  }

  //
  seleccionarImagen(event: any) {
    const index = event.detail.index; // Acceder al índice correcto
    this.portada[index]; // Obtiene la imagen según el índice
  }

  selectImage(image: any) {
    this.selectedImageId = image.id;

    const data = {
      id: image.id,
      name: image.name,
      url: image.url,
    };
    const jsonData = JSON.stringify(data);
    this.frmCursos.patchValue({
      cCursoImagen: jsonData,
    });
    // const ruta = this.frmCursos.value.cCursoImagen
    // alert(ruta)
  }

  isSelected(image: Image): boolean {
    return this.selectedImageId === image.id;
  }

  accionesCursos: IActionContainer[] = [
    {
      labelTooltip: 'Agregar área',
      text: '',
      icon: 'pi pi-plus',
      accion: 'agregar',
      class: 'p-button-primary',
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
    // {
    //   labelTooltip: 'Mostrar competencias',
    //   icon: 'pi pi-book',
    //   accion: 'cursos',
    //   type: 'item',
    //   class: 'p-button-rounded p-button-primary p-button-text',
    // },
    {
      labelTooltip: 'Eliminar área curricular',
      icon: 'pi pi-trash',
      accion: 'eliminar_area',
      type: 'item',
      class: 'p-button-rounded p-button-danger p-button-text',
    },
  ];

  cursosColumns = [
    {
      type: 'item',
      width: '5%',
      field: '',
      header: 'Item',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '60%',
      field: 'cCursoNombre',
      header: 'Área curricular',
      text_header: 'center',
      text: 'left',
    },
    // {
    //   type: 'text',
    //   width: '5rem',
    //   field: 'nCursoTotalCreditos',
    //   header: 'Créditos',
    //   text_header: 'center',
    //   text: 'center',
    // },
    // {
    //   type: 'text',
    //   width: '5rem',
    //   field: 'iCursoTotalHoras',
    //   header: 'Horas',
    //   text_header: 'center',
    //   text: 'center',
    // },
    {
      type: 'estado-activo',
      width: '5%',
      field: 'iCursoEstado',
      header: '',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'actions',
      width: '30%',
      field: 'actions',
      header: 'Acciones',
      text_header: 'center',
      text: 'center',
    },
  ];

  accionBtnCursos(event: any) {
    this.frmCursos.reset();

    switch (event.accion) {
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
