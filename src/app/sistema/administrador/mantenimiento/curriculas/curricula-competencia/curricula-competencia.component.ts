import { ChangeDetectorRef, Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { MenuItem, MessageService } from 'primeng/api';
import { GeneralService } from '@/app/servicios/general.service';
import { Button } from 'primeng/button';
import { NoDataComponent } from '@/app/shared/no-data/no-data.component';
import {
  IActionContainer,
  ContainerPageComponent,
} from '@/app/shared/container-page/container-page.component';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { PrimengModule } from '@/app/primeng.module';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { CurriculaCompetenciaCapacidadesComponent } from '../curricula-competencia-capacidades/curricula-competencia-capacidades.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-curricula-competencia',
  standalone: true,
  imports: [
    TablePrimengComponent,
    Button,
    NoDataComponent,
    ContainerPageComponent,
    PrimengModule,
    CurriculaCompetenciaCapacidadesComponent,
  ],
  templateUrl: './curricula-competencia.component.html',
  styleUrl: './curricula-competencia.component.scss',
})
export class CurriculaCompetenciaComponent implements OnInit {
  @Output() asignarcompetencia = new EventEmitter();

  titulo: string = 'Gestión de Competencias';
  competencias: any[];
  visible_competencia: boolean = false;
  bUpdate = false;
  iCompetenciaId: number;
  perfil: any;
  curriculaDescripcion: string;
  iCurrId: any;

  breadCrumbHome: MenuItem = { icon: 'pi pi-home' };
  breadCrumbItems: MenuItem[] = [];

  private _ConstantesService = inject(ConstantesService);
  private _confirmService = inject(ConfirmationModalService);
  private _LocalStoreService = inject(LocalStoreService);

  constructor(
    private fb: FormBuilder,
    public cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private query: GeneralService,
    private route: ActivatedRoute
  ) {
    this.perfil = this._LocalStoreService.getItem('dremoPerfil');
    /* obtener del extra de la ruta */
    this.curriculaDescripcion = this.route.snapshot.paramMap.get('curricula');
    this.iCurrId = this.route.snapshot.paramMap.get('iCurrId');
    this.setBreadCrumb();
  }

  setBreadCrumb() {
    this.breadCrumbItems = [
      { label: 'Currículas', routerLink: ['/administrador/mantenimiento-curricula'] },
      {
        label: this.curriculaDescripcion,
        routerLink: [`/administrador/mantenimiento-curricula/${this.iCurrId}/areas`],
      },
      { label: 'Competencias' },
    ];
  }

  formCompetencia = this.fb.group({
    iCompetenciaId: [0],
    iCurrId: [0, Validators.required],
    cCompetenciaDescripcion: [''],
    cCompetenciaNombre: ['', Validators.required],
    cCompetenciaNro: [null],
    iEstado: [1],
  });

  ngOnInit() {
    this.competencias = [];
    //const item = event.item || this.cursos || null
    this.query
      .searchCalendario({
        json: JSON.stringify({
          iCurrId: this.iCurrId,
        }),
        _opcion: 'getCompetenciasXiCurriculaId',
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
        complete: () => {
          if (this.competencias && this.competencias.length === 0) {
            this.messageService.add({
              severity: 'warn',
              summary: 'Mensaje del sistema',
              detail: 'La curricula no cuenta con competencias',
            });
            return;
          }
          // this.messageService.add({
          //   severity: 'success',
          //   summary: 'Mensaje del sistema',
          //   detail: 'Se cargo exitosamente',
          // });
        },
      });
  }

  accionBtnItem(event: any) {
    const item = event.item || null;
    const accion = event.accion || null;

    switch (accion) {
      case 'asignar':
        this.asignarcompetencia.emit(item);
        break;
      case 'agregar':
        this.titulo =
          'Formulario para agregar competencia curricular (Curricula: ' +
          this.curriculaDescripcion +
          ')';
        this.visible_competencia = true;
        this.iCompetenciaId = 0;
        this.bUpdate = false;
        this.formCompetencia.reset();
        this.formCompetencia.patchValue({
          iCurrId: Number(this.iCurrId),
          iEstado: 1,
        });
        break;

      case 'editar':
        this.titulo =
          'Formulario para editar competencia curricular (Curricula: ' +
          this.curriculaDescripcion +
          ')';
        this.formCompetencia.reset();
        this.iCompetenciaId = item.iCompetenciaId;
        this.visible_competencia = true;
        this.accionBtnItem({ accion: 'select_modalidad', item: { iNivelId: item.iNivelId } });
        this.formCompetencia.patchValue({
          iCompetenciaId: item.iCompetenciaId,
          iCurrId: Number(this.iCurrId),
          cCompetenciaDescripcion: item.cCompetenciaDescripcion,
          cCompetenciaNombre: item.cCompetenciaNombre,
          cCompetenciaNro: item.cCompetenciaNro,
          iEstado: Number(item.iEstado) || 0,
        });
        this.bUpdate = true;
        break;

      case 'agregar_competencia':
        this.bUpdate = false;
        this.insertarCompetencia(this.formCompetencia.value);

        break;

      case 'actualizar_competencia':
        this.bUpdate = true;
        this.insertarCompetencia(this.formCompetencia.value);
        break;

      case 'eliminar_competencia':
        this._confirmService.openConfirm({
          header: 'Advertencia de eliminación permanente',
          message: '¿Desea eliminar la competentecia de forma permanente.?',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            // Acción para eliminar el registro
            this.deleteCompetencia(item.iCompetenciaId);
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

  insertarCompetencia(item: any) {
    const params = {
      iCredEntPerfId: this.perfil.iCredEntPerfId ?? null,
      iCredId: this.perfil.iCredId ?? null,
      iCompetenciaId: item.iCompetenciaId ?? null,
      cCompetenciaNombre: item.cCompetenciaNombre ?? null,
      cCompetenciaNro: item.cCompetenciaNro ?? null,
      iCurrId: this.iCurrId ?? null,
      iEstado: item.iEstado ?? 0,
    };
    this.query.insertarCompetencia(params).subscribe({
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
        //this.inicializacion();
        if (!this.bUpdate) {
          this.formCompetencia.reset();
          this.visible_competencia = false;
        }
      },
    });
  }

  deleteCompetencia(id: number) {
    const params = {
      esquema: 'acad',
      tabla: 'curriculo_competencias',
      campo: 'iCompetenciaId',
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
        this.visible_competencia = false;
        // this.obtenerDatosIniciales();
      },
    });
  }

  accionesCompetencias: IActionContainer[] = [
    {
      labelTooltip: 'Agregar competencias',
      text: 'Agregar',
      icon: 'pi pi-plus',
      accion: 'agregar',
      class: 'p-button-success',
    },
    {
      labelTooltip: 'Regresar',
      text: 'Regresar',
      icon: 'pi pi-arrow-left',
      accion: 'regresar',
      class: 'p-button-info',
    },
  ];

  accionesTablacompetencias: IActionTable[] = [
    {
      labelTooltip: 'Editar competencias',
      icon: 'pi pi-pencil',
      accion: 'editar',
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
  competenciasColumns = [
    {
      type: 'text',
      width: '5%',
      field: 'cCompetenciaNro',
      header: '',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '70%',
      field: 'cCompetenciaNombre',
      header: 'Competencia',
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
      width: '20%',
      field: 'actions',
      header: 'Acciones',
      text_header: 'center',
      text: 'center',
    },
  ];
}
