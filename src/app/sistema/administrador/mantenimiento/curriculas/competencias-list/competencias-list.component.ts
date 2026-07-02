import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { GeneralService } from '@/app/servicios/general.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { PrimengModule } from '@/app/primeng.module';
import { NoDataComponent } from '@/app/shared/no-data/no-data.component';
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import {
  ContainerPageComponent,
  IActionContainer,
} from '@/app/shared/container-page/container-page.component';
import { CurriculaCompetenciaCapacidadesComponent } from '../curricula-competencia-capacidades/curricula-competencia-capacidades.component';

@Component({
  selector: 'app-competencias-list',
  standalone: true,
  imports: [
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
    TablePrimengComponent,
    ContainerPageComponent,
    NoDataComponent,
    CurriculaCompetenciaCapacidadesComponent,
  ],
  templateUrl: './competencias-list.component.html',
  styleUrl: './competencias-list.component.scss',
})
export class CompetenciasListComponent implements OnInit {
  iCurrId: number = 0;
  caption: string = '';

  titulo: string = 'Gestión de Competencias';
  competencias: any[];
  visible_competencia: boolean = false;
  bUpdate = false;
  iCompetenciaId: number;
  perfil: any;

  private _ConstantesService = inject(ConstantesService);
  private _confirmService = inject(ConfirmationModalService);
  private _LocalStoreService = inject(LocalStoreService);

  breadCrumbHome: MenuItem = { icon: 'pi pi-home' };
  breadCrumbItems: MenuItem[] = [
    { label: 'Currículas', routerLink: ['/administrador/mantenimiento-curricula'] },
    { label: 'Competencias' },
  ];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private query: GeneralService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.perfil = this._LocalStoreService.getItem('dremoPerfil');
  }

  formCompetencia = this.fb.group({
    iCompetenciaId: [0],
    iCurrId: [0, Validators.required],
    cCompetenciaDescripcion: [''],
    cCompetenciaNombre: ['', Validators.required],
    cCompetenciaNro: [null],
    iEstado: [1],
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: any) => {
      this.iCurrId = Number(params.params.iCurrId) || 0;
      this.caption = params.params.caption || '';
      if (this.iCurrId > 0) {
        this.inicializacion();
      }
    });
  }

  inicializacion() {
    this.competencias = [];
    this.query
      .searchCalendario({
        json: JSON.stringify({ iCurrId: this.iCurrId }),
        _opcion: 'getCompetenciasXiCurriculaId',
      })
      .subscribe({
        next: (data: any) => {
          this.competencias = data.data;
        },
        error: (error: any) => {
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
          }
        },
      });
  }

  accionBtnItem(event: any) {
    const item = event.item || null;
    const accion = event.accion || null;

    switch (accion) {
      case 'agregar':
        this.titulo =
          'Formulario para agregar competencia curricular (Curricula: ' + this.caption + ')';
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
          'Formulario para editar competencia curricular (Curricula: ' + this.caption + ')';
        this.formCompetencia.reset();
        this.iCompetenciaId = item.iCompetenciaId;
        this.visible_competencia = true;
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
          message: '¿Desea eliminar la competencia de forma permanente?',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.deleteCompetencia(item.iCompetenciaId);
          },
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
      error: (error: any) => {
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
          detail: 'Se actualizó correctamente',
        });
        if (!this.bUpdate) {
          this.formCompetencia.reset();
          this.visible_competencia = false;
        }
        this.inicializacion();
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
      error: (error: any) => {
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
          detail: 'Se eliminó la competencia correctamente.',
        });
        this.visible_competencia = false;
      },
    });
  }

  salir() {
    this.router.navigate(['/administrador/mantenimiento-curricula']);
  }

  accionesCompetencias: IActionContainer[] = [
    {
      labelTooltip: 'Agregar competencias',
      text: '',
      icon: 'pi pi-plus',
      accion: 'agregar',
      class: 'p-button-success',
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
