import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { NoDataComponent } from '@/app/shared/no-data/no-data.component';
import { Message, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { GeneralService } from '@/app/servicios/general.service';
import { AulaBancoPreguntasModule } from '@/app/sistema/aula-virtual/sub-modulos/aula-banco-preguntas/aula-banco-preguntas.module';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { PrimengModule } from '@/app/primeng.module';

@Component({
  selector: 'app-curricula-curso-competencias',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent, NoDataComponent, AulaBancoPreguntasModule],
  templateUrl: './curricula-curso-competencias.component.html',
  styleUrl: './curricula-curso-competencias.component.scss',
})
export class CurriculaCursoCompetenciasComponent implements OnChanges {
  @Input() iCursoId: number = 0;
  @Input() cursos: any = [];
  @Input() iCurrId: number = 0;
  @Input() modoFormulario: boolean = false;
  @Output() asignarCompetencia = new EventEmitter();

  competencias: any[] = [];
  competencias_area: any = [];
  messages: Message[] | undefined;
  frmCursosCompetencias: FormGroup;
  nivelTipos: any[] = [];
  modalidad: any[] = [];
  nivel_tipo_actual: any = {};
  bUpdate: boolean = false; //variable para identificar modificacion
  perfil: any;

  activeTab: number = 0;
  estados_competencias: any[] = [
    { label: 'ACTIVO', value: 1 },
    { label: 'INACTIVO', value: 0 },
  ];

  private _confirmService = inject(ConfirmationModalService);
  private _LocalStoreService = inject(LocalStoreService);

  constructor(
    private fb: FormBuilder,
    public cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private query: GeneralService
  ) {
    this.frmCursosCompetencias = this.fb.group({
      iCompCursoId: [''],
      iNivelId: [0],
      iNivelTipoId: [0, Validators.required],
      iCursoId: [''],
      iCompetenciaId: ['', Validators.required],
      iEstado: [1],
    });

    this.perfil = this._LocalStoreService.getItem('dremoPerfil');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['iCurrId'] && changes['iCurrId'].currentValue) {
      // Si iCurrId cambió y tiene valor válido
      this.inicializacion();
      this.getCompetencias();
      this.getModalidad();
      this.getNivelTipos();
    }

    if (changes['cursos'] && changes['cursos'].currentValue) {
      // Si curriculas cambió
      this.cursos = changes['cursos'].currentValue;
    }

    if (changes['iCursoId'] && changes['iCursoId'].currentValue) {
      // Si curriculas cambió

      this.iCursoId = changes['iCursoId'].currentValue;
      this.getCompetenciasCurso(this.iCursoId);
    }
  }

  inicializacion() {
    this.frmCursosCompetencias.reset();
  }

  cambiarTab(index: number) {
    this.activeTab = index;
    if (index === 1) {
      this.inicializacion();
    }
  }

  accionBtnItem(event: any) {
    const item = event.item || null;
    const accion = event.accion || null;

    switch (accion) {
      case 'cursos':
        this.asignarCompetencia.emit(item);
        break;

      case 'agregar':
        this.frmCursosCompetencias.reset();
        this.bUpdate = false;
        this.activeTab = 1;
        break;

      case 'guardar':
        this.insertarCursoCompetencia(item);
        this.bUpdate = false;
        break;

      case 'actualizar':
        this.insertarCursoCompetencia(item);
        this.bUpdate = true;
        break;

      case 'select_modalidad':
        const nivel = item.iNivelId > 0 ? item.iNivelId : this.frmCursosCompetencias.value.iNivelId;

        this.nivel_tipo_actual = this.nivelTipos.filter(lista => lista.iNivelId === nivel);
        break;

      case 'editar_competencia':
        this.accionBtnItem({ accion: 'select_modalidad', item: { iNivelId: item.iNivelId } });
        this.frmCursosCompetencias.patchValue({
          iCompCursoId: item.iCompCursoId,
          iNivelId: item.iNivelId,
          iNivelTipoId: item.iNivelTipoId,
          iCursoId: this.iCursoId,
          iCompetenciaId: item.iCompetenciaId,
          iEstado: Number(item.iEstado) ?? 0,
        });
        this.bUpdate = true;
        this.activeTab = 1;
        break;

      case 'cambiar_tab_competencia':
        this.activeTab = 1;
        break;

      case 'eliminar_competencia':
        this._confirmService.openConfirm({
          header: 'Advertencia de eliminación permanente',
          message: '¿Desea eliminar la competencia del área de forma permanente?',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            // Acción para eliminar el registro
            this.eliminarCursoCompetencia(item.iCompCursoId);
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

      default:
        break;
    }
  }

  getCompetencias() {
    this.query
      .searchCalendario({
        json: JSON.stringify({
          iCurrId: this.iCurrId,
        }),
        _opcion: 'getCompetenciasXiCurrId',
      })
      .subscribe({
        next: (data: any) => {
          // this.totalCursos = data.data;
          this.competencias = data.data;
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
      });
  }

  getCompetenciasCurso(id: number) {
    //acad.competencias_cursos
    if (id === 0 || id == null) {
      return;
    }
    this.query
      .searchCalendario({
        json: JSON.stringify({
          iCursoId: id,
          iNivelTipoId: null,
          iCurrId: null,
          iCompetenciaId: null,
        }),
        _opcion: 'getCompetenciasXiCursoId',
      })
      .subscribe({
        next: (data: any) => {
          this.competencias_area = data.data;
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
      });
  }

  getNivelTipos() {
    this.query
      .searchCalAcademico({
        esquema: 'acad',
        tabla: 'nivel_tipos',
        campos: '*',
        condicion: '1=1',
      })
      .subscribe({
        next: (data: any) => {
          this.nivelTipos = data.data;
        },
      });
  }
  getModalidad() {
    this.query
      .searchCalAcademico({
        esquema: 'acad',
        tabla: 'niveles',
        campos: '*',
        condicion: '1=1',
      })
      .subscribe({
        next: (data: any) => {
          this.modalidad = data.data;
        },
      });
  }

  insertarCursoCompetencia(item: any) {
    const params = {
      iCredEntPerfId: this.perfil.iCredEntPerfId ?? null,
      iCredId: this.perfil.iCredId ?? null,
      iCompCursoId: item.iCompCursoId ?? null,
      iNivelTipoId: item.iNivelTipoId ?? null,
      iCursoId: this.iCursoId ?? null,
      iCompetenciaId: item.iCompetenciaId ?? null,
      iEstado: item.iEstado ?? 0,
    };
    this.query.insertarCompetenciasCurso(params).subscribe({
      error: error => {
        let message = error.error?.message || 'Error desconocido';
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
          detail: 'Se actualizo correctamente',
        });
        this.getCompetenciasCurso(this.iCursoId);
        if (!this.bUpdate) {
          this.frmCursosCompetencias.reset();
        }
      },
    });
  }

  eliminarCursoCompetencia(id) {
    const params = {
      esquema: 'acad',
      tabla: 'competencias_cursos',
      campo: 'iCompCursoId',
      valorId: id,
    };
    this.query.deleteAcademico(params).subscribe({
      error: error => {
        let message = error.error?.message || 'No se proceso petición';
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
          summary: 'Mensaje de sistema',
          detail: 'Eliminación exitosa',
        });
      },
    });
  }

  columns = [
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
      width: '15%',
      field: 'cNivelTipoNombre',
      header: 'Nivel',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '10%',
      field: 'cCursoNombre',
      header: 'Área',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '15%',
      field: 'cCompetenciaNro',
      header: 'N°',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '40%',
      field: 'cCompetenciaNombre',
      header: 'competencia',
      text_header: 'center',
      text: 'left',
    },
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
      width: '10%',
      field: 'actions',
      header: 'Acciones',
      text_header: 'center',
      text: 'center',
    },
  ];

  actions: IActionTable[] = [
    {
      labelTooltip: 'Editar competencias',
      icon: 'pi pi-pencil',
      accion: 'editar_competencia',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
    },
    // {
    //   labelTooltip: 'Eliminar competencias',
    //   icon: 'pi pi-trash',
    //   accion: 'eliminar_competencia',
    //   type: 'item',
    //   class: 'p-button-rounded p-button-danger p-button-text',
    // },
  ];

  actionsContainer = [
    {
      labelTooltip: 'Agregar',
      text: 'Agregar competencia',
      icon: 'pi pi-plus',
      accion: 'agregar',
      class: 'p-button-success',
    },
  ];
}
