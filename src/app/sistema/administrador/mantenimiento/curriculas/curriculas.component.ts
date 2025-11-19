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
import { ModalidadServicioService } from './config/service/modalidadServicio.service';
// import { FormConfig } from './config/types/forms'
import { InputNumberModule } from 'primeng/inputnumber';
// import {
//     assignCursosInNivelesGrados,
//     editar,
//     nivelesCursos,
// } from './config/actions/table'
// import { agregar } from './config/actions/container'
// import { nivelesGradosColumns } from './config/table/nivelesGrados'
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { CalendarModule } from 'primeng/calendar';
import { GeneralService } from '@/app/servicios/general.service';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { CurriculaCursoComponent } from './curricula-curso/curricula-curso.component';
import { NoDataComponent } from '@/app/shared/no-data/no-data.component';

import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { CurriculaCompetenciaComponent } from './curricula-competencia/curricula-competencia.component';

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
    NoDataComponent,
    CurriculaCompetenciaComponent,
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
  iCurrId: number = null;
  caption: string;

  private _ConstantesService = inject(ConstantesService);
  private _confirmService = inject(ConfirmationModalService);
  constructor(
    private fb: FormBuilder,
    public curriculasService: CurriculasService,
    // public cursosService: CursosService,
    public modalidadServiciosService: ModalidadServicioService,
    // public nivelesGradosService: NivelGradosService,
    public cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private query: GeneralService
  ) {
    this.iPerfilId = this._ConstantesService.iPerfilId;
    this.frmCurriculas = this.fb.group({
      iCurrId: [''],
      iModalServId: ['', Validators.required],
      iCurrNotaMinima: [''],
      iCurrTotalCreditos: [''],
      iCurrNroHoras: [''],
      cCurrPerfilEgresado: [''],
      cCurrMencion: [''],
      nCurrPesoProcedimiento: [''],
      cCurrPesoConceptual: [''],
      cCurrPesoActitudinal: [''],
      bCurrEsLaVigente: [false],
      cCurrRsl: [''],
      dtCurrRsl: [''],
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
        this.frmCurriculas.reset();
        this.iCurrId = 0;
        this.bEditar = false;
        this.visible = true;
        this.titulo = 'Formulario para registrar nueva currícula';
        break;

      case 'cursos':
        this.bEditar = false;
        this.visible = false;
        this.iCurrId = item.iCurrId;
        this.caption = item.cCurrDescripcion;
        break;

      case 'mostrar_curricula':
        this.iCurrId = 0;
        this.bEditar = false;
        this.visible = false;

        this.obtenerDatosIniciales();
        break;

      case 'editar':
        this.iCurrId = item.iCurrId;
        this.caption = item.cCurrDescripcion;
        this.titulo = 'Formulario para editar nueva currícula';
        this.titulo = 'Formulario para editar currícula';
        this.visible = true;
        this.bEditar = true;
        console.log(item);
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
          bCurrEsLaVigente: Number(item.bCurrEsLaVigente) ?? false,

          cCurrRsl: item.cCurrRsl,
          dtCurrRsl: item.dtCurrRsl ? new Date(item.dtCurrRsl) : null,
          cCurrDescripcion: item.cCurrDescripcion,
        });

        break;
      case 'eliminar_curricula':
        this._confirmService.openConfirm({
          header: 'Advertencia de curriculas',
          message: '¿Desea eliminar la curricula?',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            // Acción para eliminar el registro
            this.deleteCurricula(item.iCurrId);
          },
          // reject: () => {
          //   // Mensaje de cancelación (opcional)
          //   this.messageService.add({
          //     severity: 'error',
          //     summary: 'Mensaje',
          //     detail: 'Registro cancelado',
          //   });
          // },
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
      error: error => {
        let message = error?.error?.message || 'Sin conexión a la bd';
        const match = message.match(/]([^\]]+?)\./);
        if (match && match[1]) {
          message = match[1].trim() + '.';
        }
        this.messageService.add({
          severity: 'error',
          summary: 'Mensaje del sistema',
          detail: message,
        });
      },
      complete: () => {},
    });

    this.curriculasService.getCurriculas().subscribe({
      next: (res: any) => {
        this.curriculas = res.data;

        this.curriculas = this.curriculas.map(e => ({
          ...e,
          cCurrRslShort: e.cCurrRsl ? e.cCurrRsl.substring(0, 20) : '',
        }));
      },
      // error: (error) =>{
      //   let message = error?.error?.message || 'Sin conexión a la bd';
      //   const match = message.match(/]([^\]]+?)\./);
      //   if (match && match[1]) {
      //     message = match[1].trim() + '.';
      //   }
      //   this.messageService.add({
      //     severity: 'error',
      //     summary: 'Mensaje del sistema',
      //     detail: message,
      //   });
      // },
      // complete: () => {
      //   this.messageService.add({
      //     severity: 'success',
      //     summary: 'Mensaje del sistema',
      //     detail: 'Se obtuvo registro de curriculas',
      //   });
      // },
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
      bCurrEsLaVigente: this.frmCurriculas.value.bCurrEsLaVigente || false,
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
          let message = error?.error?.message || 'Sin conexión a la bd';
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

  deleteCurricula(id: number) {
    const params = {
      esquema: 'acad',
      tabla: 'curriculas',
      campo: 'iCurrId',
      valorId: id,
    };
    this.query.deleteAcademico(params).subscribe({
      error: error => {
        let message = error?.error?.message || 'Sin conexión a la bd';
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
        this.messageService.add({
          severity: 'success',
          summary: 'Mensaje del sistema',
          detail: 'Se eliminó la currícula correctamente.',
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
          let message = error?.error?.message || 'Sin conexión a la bd';
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
      class: 'p-button-success',
    },
    // {
    //   labelTooltip: 'Mostrar curriculas',
    //   text: 'Mostrar curriculas',
    //   icon: 'pi pi-search',
    //   accion: 'mostrar_curricula',
    //   class: 'p-button-warning',
    // },
  ];

  accionesTablaCurricula: IActionTable[] = [
    {
      labelTooltip: 'Editar currícula',
      icon: 'pi pi-pencil',
      accion: 'editar',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
    },
    {
      labelTooltip: 'Mostrar áreas curriculares',
      icon: 'pi pi-book',
      accion: 'cursos',
      type: 'item',
      class: 'p-button-rounded p-button-success p-button-text',
    },
    // {
    //   labelTooltip: 'Eliminar áreas curriculares',
    //   icon: 'pi pi-trash',
    //   accion: 'eliminar_curricula',
    //   type: 'item',
    //   class: 'p-button-rounded p-button-danger p-button-text',
    // },
  ];
  curriculasColumns = [
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
      width: '30%',
      field: 'cCurrDescripcion',
      header: 'Nombre',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '30%',
      field: 'cCurrRslShort',
      header: 'Refencia',
      text_header: 'center',
      text: 'left',
    },
    // {
    //   type: 'text',
    //   width: '5rem',
    //   field: 'iCurrNroHoras',
    //   header: 'Horas',
    //   text_header: 'center',
    //   text: 'center',
    // },
    {
      type: 'estado-activo',
      width: '5%',
      field: 'iEstado',
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
}
