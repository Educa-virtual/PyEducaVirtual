import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Message, MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { AccordionModule } from 'primeng/accordion';
import { ToolbarModule } from 'primeng/toolbar';
import {
  ContainerPageComponent,
  IActionContainer,
} from '@/app/shared/container-page/container-page.component';
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
// import {
//     accionBtnContainerCurriculas,
//     curriculasAccionBtnTable,
//     curriculasColumns,
//     curriculasSave,
// } from './config/table/curriculas'
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { CurriculasService } from './config/service/curriculas.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import {
//     accionBtnContainerCursos,
//     cursosAccionBtnTable,
//     cursosColumns,
//     cursosSave,
// } from './config/table/cursos'
// import { Observable } from 'rxjs'
import { CursosService } from './config/service/cursos.service';
import { ModalidadServicioService } from './config/service/modalidadServicio.service';
// import { FormConfig } from './config/types/forms'
import { InputNumberModule } from 'primeng/inputnumber';
// import {
//     assignCursosInNivelesGrados,
//     editar,
//     nivelesCursos,
// } from './config/actions/table'
// import { agregar } from './config/actions/container'
import { NivelGradosService } from './config/service/nivelesGrados.service';
// import { nivelesGradosColumns } from './config/table/nivelesGrados'
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { CalendarModule } from 'primeng/calendar';
import { GeneralService } from '@/app/servicios/general.service';
import { ConstantesService } from '@/app/servicios/constantes.service';

@Component({
  selector: 'app-curriculas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ImageModule,
    ProgressBarModule,
    ToastModule,
    InputNumberModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    MessagesModule,
    AccordionModule,
    FileUploadModule,
    ToolbarModule,
    ContainerPageComponent,
    TablePrimengComponent,
    DialogModule,
    InputTextModule,
    DropdownModule,
    EditorModule,
    ToggleButtonModule,
    CalendarModule,
  ],
  templateUrl: './curriculas.component.html',
  styleUrl: './curriculas.component.scss',
})
export class CurriculasComponent implements OnInit {
  choose(event, callback) {
    console.log('click');

    callback();
  }

  frmCurriculas: FormGroup;
  curriculas: any = [];
  curricula: any = {};
  visible: boolean = false;
  modalidades: any = [];
  titulo: string = 'Gestión de Currículas';
  iPerfilId: number;
  bEditar: boolean = false;

  // curriculas = {
  //     container: {
  //         actions: [agregar],
  //         accionBtnItem: accionBtnContainerCurriculas.bind(this),
  //     },
  //     table: {
  //         columns: curriculasColumns,
  //         data: [],
  //         actions: [editar, nivelesCursos],
  //         accionBtnItem: curriculasAccionBtnTable.bind(this),
  //     },
  //     save: (): Observable<object> => curriculasSave.call(this),
  // }

  // cursos = {
  //     container: {
  //         actions: [{ ...agregar, disabled: true }],
  //         accionBtnItem: accionBtnContainerCursos.bind(this),
  //     },
  //     table: {
  //         columnsGroup: cursosColumns.inTableColumnsGroup,
  //         columns: cursosColumns.inTableColumns,
  //         columnsWithoutActions: cursosColumns.inTableColumns.filter(
  //             (column) => column.type != 'actions'
  //         ),
  //         data: [],
  //         actions: {
  //             core: [editar],
  //             nivelesGrados: [assignCursosInNivelesGrados],
  //         },
  //         accionBtnItem: cursosAccionBtnTable.bind(this),
  //     },
  //     save: (): Observable<object> => cursosSave.call(this),
  // }

  // nivelesGrados = {
  //     container: {
  //         actions: [],
  //     },
  //     table: {
  //         columns: nivelesGradosColumns,
  //         data: [],
  //     },
  // }

  // curriculasActions: IActionTable[] = [editar]
  messages: Message[] | undefined;
  sidebarVisible: boolean = false;

  // forms: FormConfig = {
  //     curriculas: this.fb.group({}),
  //     cursos: this.fb.group({}),
  //     tipoCurso: this.fb.group({}),
  //     assignCursosInNivelesGrados: this.fb.group({}),
  // }
  // dialogs = {
  //     curriculas: {
  //         title: 'Crear Currículas',
  //         visible: false,
  //         expand: {
  //             cursos: false,
  //         },
  //     },
  //     cursos: {
  //         title: 'Crear Curso',
  //         visible: false,
  //     },
  //     tipoCurso: {
  //         title: 'Crear Modalidad de Servicio',
  //         visible: false,
  //     },
  //     nivelesCursos: {
  //         title: 'Currículas',
  //         visible: false,
  //     },
  // }

  // dropdowns = {
  //     tipoCurso: undefined,
  //     modalidades: undefined,
  //     nivelesGrados: undefined,
  // }
  private _ConstantesService = inject(ConstantesService);
  constructor(
    private fb: FormBuilder,
    public curriculasService: CurriculasService,
    public cursosService: CursosService,
    public modalidadServiciosService: ModalidadServicioService,
    public nivelesGradosService: NivelGradosService,
    public cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private query: GeneralService
  ) {
    this.iPerfilId = this._ConstantesService.iPerfilId;
    this.frmCurriculas = this.fb.group({
      iCurrId: [''],
      iModalServId: ['', Validators.required],
      iCurrNotaMinima: ['', Validators.required],
      iCurrTotalCreditos: ['', Validators.required],
      iCurrNroHoras: ['', Validators.required],
      cCurrPerfilEgresado: ['', Validators.required],
      cCurrMencion: ['', Validators.required],
      nCurrPesoProcedimiento: ['', Validators.required],
      cCurrPesoConceptual: ['', Validators.required],
      cCurrPesoActitudinal: ['', Validators.required],
      bCurrEsLaVigente: [''],
      cCurrRsl: ['', Validators.required],
      dtCurrRsl: ['', Validators.required],
      cCurrDescripcion: ['', Validators.required],
    });

    // this.forms.cursos = this.fb.group({
    //     iCurrId: [''],
    //     iTipoCursoId: [''],
    //     cCursoNombre: [''],
    //     nCursoCredTeoria: [''],
    //     nCursoCredPractica: [''],
    //     cCursoDescripcion: [''],
    //     nCursoTotalCreditos: [''],
    //     cCursoPerfilDocente: [''],
    //     iCursoTotalHoras: [''],
    //     iCursoEstado: [''],
    //     cCursoImagen: [''],
    // })

    // this.forms.assignCursosInNivelesGrados = this.fb.group({
    //     iNivelGradoId: ['', Validators.required],
    // })

    // this.forms.curriculas.get('iModalServId').dirty
  }

  ngOnInit() {
    this.messages = [{ severity: 'info', detail: 'Videos de Seguridad' }];
    /*
        this.forms.curriculas.valueChanges.subscribe(({ iCurrId }) => {
            const disabled = !(iCurrId !== '' && iCurrId !== null)

            this.cursos.container = {
                ...this.cursos.container,
                actions: this.cursos.container.actions.map((action) => ({
                    ...action,
                    disabled,
                })),
            }
        })
    */
    this.obtenerDatosIniciales();
  }

  accionBtnItem(event: any) {
    const item = event.item;
    const accion = event.accion;
    switch (accion) {
      case 'nueva_curricula':
        this.bEditar = false;
        this.visible = true;
        break;
      case 'editar':
        this.titulo = 'Editar currícula';
        this.visible = true;
        this.bEditar = true;

        this.frmCurriculas.patchValue({
          iCurrId: item.iCurrId,
          iModalServId: item.iModalServId,
          iCurrNotaMinima: item.iCurrNotaMinima,
          iCurrTotalCreditos: item.iCurrTotalCreditos,
          iCurrNroHoras: item.iCurrNroHoras,
          cCurrPerfilEgresado: item.cCurrPerfilEgresado,
          cCurrMencion: item.cCurrMencion,
          nCurrPesoProcedimiento: item.nCurrPesoProcedimiento,
          cCurrPesoConceptual: item.cCurrPesoConceptual,
          cCurrPesoActitudinal: item.cCurrPesoActitudinal,
          bCurrEsLaVigente: item.bCurrEsLaVigente,
          cCurrRsl: item.cCurrRsl,
          dtCurrRsl: item.dtCurrRsl,
          cCurrDescripcion: item.cCurrDescripcion,
        });

        // this.cursosService.getCursos(item.iCurrId).subscribe({
        //     next: (res: any) => {
        //         this.cursos.table.data = res.data
        //     },
        // })

        break;
    }
  }

  obtenerDatosIniciales() {
    this.modalidadServiciosService.getModalidadServicios().subscribe({
      next: (value: any) => {
        this.modalidades = value.data.map(item => ({
          name: item.cModalServNombre,
          code: item.iModalServId,
        }));
      },
      error: err => {
        console.error(err);
      },
      complete: () => {},
    });

    this.curriculasService.getCurriculas().subscribe({
      next: (res: any) => {
        this.curriculas = res.data;
      },
      error: error => {
        this.messageService.add({
          severity: 'danger',
          summary: 'Mensaje del sistema',
          detail: 'Error: No se establecio conexión. ' + error.error.message,
        });
      },
      complete: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Mensaje del sistema',
          detail: 'Se obtuvo registro de curriculas',
        });
      },
    });
  }

  // showCursos() {
  //     this.cursos.table.data = []

  //     Object.keys(this.forms.curriculas.controls).forEach((field) => {
  //         const control = this.forms.curriculas.get(field)
  //         control?.markAsTouched() // Marca como tocado (touched)
  //         control?.markAsDirty() // Marca como modificado (dirty)
  //     })

  //     this.dialogs.curriculas.expand.cursos = true

  //     this.cursosService
  //         .getCursos(this.forms.curriculas.value.iCurrId)
  //         .subscribe({
  //             next: (res: any) => {
  //                 console.log(res)
  //                 this.cursos.table.data = res.data
  //             },
  //             error: (err) => {
  //                 console.log(err)
  //             },
  //             complete: () => {},
  //         })

  //     this.cursos.table.data
  // }

  updCurriculas() {
    alert('lleg');
    let params = this.frmCurriculas.value;
    // Si params es un array, recorres con map
    params = params.map((item: any) => ({
      ...item, // mantenemos todas las propiedades originales
      iSesionId: this.iPerfilId, // agregamos la variable nueva
    }));

    this.query.updateCalAcademico({
      json: JSON.stringify(params),
      _opcion: 'updAprobacionCargaNoLectiva',
    });

    this.curriculas.save().subscribe({
      next: () => {
        this.visible = false;
        this.obtenerDatosIniciales();
      },
      error: error => {
        this.messageService.add({
          severity: 'danger',
          summary: 'Mensaje del sistema',
          detail: 'Error: No se registro curricula. ' + error.error.message,
        });
      },
      complete: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Mensaje del sistema',
          detail: 'Se registro curricula.',
        });
      },
    });
  }

  saveCurriculas() {
    let params = this.frmCurriculas.value;
    // Si params es un array, recorres con map
    params = params.map((item: any) => ({
      ...item, // mantenemos todas las propiedades originales
      iSesionId: this.iPerfilId, // agregamos la variable nueva
    }));

    this.query.updateCalAcademico({
      json: JSON.stringify(params),
      _opcion: 'updAprobacionCargaNoLectiva',
    });

    this.curriculas.save().subscribe({
      next: () => {
        this.visible = false;
        this.obtenerDatosIniciales();
      },
      error: error => {
        this.messageService.add({
          severity: 'danger',
          summary: 'Mensaje del sistema',
          detail: 'Error: No se registro curricula. ' + error.error.message,
        });
      },
      complete: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Mensaje del sistema',
          detail: 'Se registro curricula.',
        });
      },
    });
  }

  /*   saveCursos() {
        this.cursos.save().subscribe({
            next: (res: any) => {
                console.log(res)
                this.dialogs.cursos.visible = false

                console.log(this.forms.cursos.value)

                this.obtenerDatosIniciales()
            },
            error: (err) => {
                console.error(err)
            },
            complete: () => {},
        })
    }
*/
  // saveInformation() {

  //     of(null)
  //         .pipe(
  //             concatMap(() => {
  //                 // Insertar datos
  //                 return this.curriculas.save()
  //             }),
  //             concatMap((value: any) => {
  //                 const curricula = value.data[0]

  //                 if (!this.forms.cursos.value.iCursoId) {
  //                     return this.cursosService.insCursos({
  //                         iCurrid: curricula.id,
  //                         iTipoCursoId: this.forms.cursos.value.iTipoCursoId,
  //                         cCursoNombre: this.forms.cursos.value.cCursoNombre,
  //                         nCursoCredTeoria:
  //                             this.forms.cursos.value.nCursoCredTeoria,
  //                         nCursoCredPractica:
  //                             this.forms.cursos.value.nCursoCredPractica,
  //                         cCursoDescripcion:
  //                             this.forms.cursos.value.cCursoDescripcion,
  //                         nCursoTotalCreditos:
  //                             this.forms.cursos.value.nCursoTotalCreditos,
  //                         cCursoPerfilDocente:
  //                             this.forms.cursos.value.cCursoPerfilDocente,
  //                         iCursoTotalHoras:
  //                             this.forms.cursos.value.iCursoTotalHoras,
  //                     })
  //                 } else {
  //                     return this.cursosService.insCursos({
  //                         iCurrid: curricula.id,
  //                         iTipoCursoId: this.forms.cursos.value.iTipoCursoId,
  //                         cCursoNombre: this.forms.cursos.value.cCursoNombre,
  //                         nCursoCredTeoria:
  //                             this.forms.cursos.value.nCursoCredTeoria,
  //                         nCursoCredPractica:
  //                             this.forms.cursos.value.nCursoCredPractica,
  //                         cCursoDescripcion:
  //                             this.forms.cursos.value.cCursoDescripcion,
  //                         nCursoTotalCreditos:
  //                             this.forms.cursos.value.nCursoTotalCreditos,
  //                         cCursoPerfilDocente:
  //                             this.forms.cursos.value.cCursoPerfilDocente,
  //                         iCursoTotalHoras:
  //                             this.forms.cursos.value.iCursoTotalHoras,
  //                     })
  //                 }
  //             })
  //         )
  //         .subscribe({
  //             next: (res) => console.log('Resultado final:', res),
  //             error: (err) => {
  //                 console.error('Error al inscribir el curso:', err);
  //             },
  //             complete: () => {
  //                 this.dialogVisible.curricula = false
  //                 this.dialogVisible.cursos = false
  //             },
  //         })
  // }
  accionesCurricula: IActionContainer[] = [
    {
      labelTooltip: 'Agregar curricula',
      text: 'Nueva curricula',
      icon: 'pi pi-plus',
      accion: 'nueva_curricula',
      class: 'p-button-primary',
    },
    {
      labelTooltip: 'Mostrar curriculas',
      text: 'Mostrar curriculas',
      icon: 'pi pi-search',
      accion: 'mostrar_curricula',
      class: 'p-button-warning',
    },
  ];

  accionesTablaCurricula: IActionTable[] = [
    {
      labelTooltip: 'Editar',
      icon: 'pi pi-pencil',
      accion: 'editar',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
    },
  ];
  curriculasColumns = [
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
      field: 'cCurrDescripcion',
      header: 'Nombre',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '5rem',
      field: 'cCurrRsl',
      header: 'Cursos',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '5rem',
      field: 'iCurrNroHoras',
      header: 'Horas totales',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'estado-activo',
      width: '5rem',
      field: 'iEstado',
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
}
