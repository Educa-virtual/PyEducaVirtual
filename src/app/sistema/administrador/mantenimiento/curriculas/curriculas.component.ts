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
import { CurriculaCursoComponent } from './curricula-curso/curricula-curso.component';

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
    CurriculaCursoComponent,
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
  messages: Message[] | undefined;
  sidebarVisible: boolean = false;
  iCurrId: number = 1;

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
  }

  ngOnInit() {
    this.messages = [{ severity: 'info', detail: 'Videos de Seguridad' }];
    this.obtenerDatosIniciales();
  }

  accionBtnItem(event: any) {
    const item = event.item;
    const accion = event.accion;

    switch (accion) {
      case 'nueva_curricula':
        this.iCurrId = 0;
        this.bEditar = false;
        this.visible = true;
        break;

      case 'cursos':
        this.bEditar = false;
        this.visible = false;
        this.iCurrId = item.iCurrId;
        alert(this.iCurrId);

        break;

      case 'mostrar_curricula':
        this.iCurrId = 0;
        this.bEditar = false;
        this.visible = false;
        this.obtenerDatosIniciales();
        break;
      case 'editar':
        this.iCurrId = 0;
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
          dtCurrRsl: item.dtCurrRsl ? new Date(item.dtCurrRsl) : null,
          cCurrDescripcion: item.cCurrDescripcion,
        });

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

  updCurriculas() {
    const params = {
      iCurrId: Number(this.frmCurriculas.value.iCurrId) || 0,
      iModalServId: Number(this.frmCurriculas.value.iModalServId) || 0,
      iCurrNotaMinima: Number(this.frmCurriculas.value.iCurrNotaMinima) || 0,
      iCurrTotalCreditos: Number(this.frmCurriculas.value.iCurrTotalCreditos) || 0,
      iCurrNroHoras: Number(this.frmCurriculas.value.iCurrNroHoras) || 0,
      cCurrPerfilEgresado: this.frmCurriculas.value.cCurrPerfilEgresado || '',
      cCurrMencion: this.frmCurriculas.value.cCurrMencion || '',
      nCurrPesoProcedimiento: parseFloat(
        this.frmCurriculas.value.nCurrPesoProcedimiento || 0
      ).toFixed(2),
      cCurrPesoConceptual: parseFloat(this.frmCurriculas.value.cCurrPesoConceptual || 0).toFixed(2),
      cCurrPesoActitudinal: parseFloat(this.frmCurriculas.value.cCurrPesoActitudinal || 0).toFixed(
        2
      ),
      bCurrEsLaVigente: Number(this.frmCurriculas.value.bCurrEsLaVigente) || 0,
      cCurrRsl: this.frmCurriculas.value.cCurrRsl || '',
      dtCurrRsl: this.frmCurriculas.value.dtCurrRsl
        ? new Date(this.frmCurriculas.value.dtCurrRsl)
        : null,
      cCurrDescripcion: this.frmCurriculas.value.cCurrDescripcion || '',
      iSesionId: this.iPerfilId,
    };

    this.query
      .updateCalAcademico({
        json: JSON.stringify(params),
        _opcion: 'updCurricula',
      })
      .subscribe({
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del sistema',
            detail: 'Error: No se registró la currícula. ' + (error.error?.message || ''),
          });
        },
        complete: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Mensaje del sistema',
            detail: 'Se registró la currícula correctamente.',
          });
          this.visible = false;
          this.obtenerDatosIniciales();
        },
      });
  }

  saveCurriculas() {
    const params = {
      iCurrId: Number(this.frmCurriculas.value.iCurrId) || 0,
      iModalServId: Number(this.frmCurriculas.value.iModalServId) || 0,
      iCurrNotaMinima: Number(this.frmCurriculas.value.iCurrNotaMinima) || 0,
      iCurrTotalCreditos: Number(this.frmCurriculas.value.iCurrTotalCreditos) || 0,
      iCurrNroHoras: Number(this.frmCurriculas.value.iCurrNroHoras) || 0,
      cCurrPerfilEgresado: this.frmCurriculas.value.cCurrPerfilEgresado || '',
      cCurrMencion: this.frmCurriculas.value.cCurrMencion || '',
      nCurrPesoProcedimiento: parseFloat(
        this.frmCurriculas.value.nCurrPesoProcedimiento || 0
      ).toFixed(2),
      cCurrPesoConceptual: parseFloat(this.frmCurriculas.value.cCurrPesoConceptual || 0).toFixed(2),
      cCurrPesoActitudinal: parseFloat(this.frmCurriculas.value.cCurrPesoActitudinal || 0).toFixed(
        2
      ),
      bCurrEsLaVigente: Number(this.frmCurriculas.value.bCurrEsLaVigente) || 0,
      cCurrRsl: this.frmCurriculas.value.cCurrRsl || '',
      dtCurrRsl: this.frmCurriculas.value.dtCurrRsl
        ? new Date(this.frmCurriculas.value.dtCurrRsl)
        : null,
      cCurrDescripcion: this.frmCurriculas.value.cCurrDescripcion || '',
      iSesionId: this.iPerfilId,
    };

    this.query
      .addCalAcademico({
        json: JSON.stringify(params),
        _opcion: 'addCurricula',
      })
      .subscribe({
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del sistema',
            detail: 'Error: No se registró la currícula. ' + (error.error?.message || ''),
          });
        },
        complete: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Mensaje del sistema',
            detail: 'Se registró la currícula correctamente.',
          });
          this.visible = false;
          this.obtenerDatosIniciales();
        },
      });
  }

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
    {
      labelTooltip: 'Mostrar cursos',
      icon: 'pi pi-book',
      accion: 'cursos',
      type: 'item',
      class: 'p-button-rounded p-button-success p-button-text',
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
