import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { MessageService } from 'primeng/api';
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

@Component({
  selector: 'app-curricula-competencia',
  standalone: true,
  imports: [TablePrimengComponent, Button, NoDataComponent, ContainerPageComponent, PrimengModule],
  templateUrl: './curricula-competencia.component.html',
  styleUrl: './curricula-competencia.component.scss',
})
export class CurriculaCompetenciaComponent implements OnChanges {
  @Output() asignarcompetencia = new EventEmitter();

  @Input() iCurrId: number = 0;
  @Input() caption: string = '';

  titulo: string = 'Gestión de Competencias';
  competencias: any[];
  visible: boolean = false;
  bUpdate = false;
  iCompetenciaId: number;
  perfil: any;

  private _ConstantesService = inject(ConstantesService);
  private _confirmService = inject(ConfirmationModalService);
  private _LocalStoreService = inject(LocalStoreService);

  constructor(
    private fb: FormBuilder,
    public cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private query: GeneralService
  ) {
    this.perfil = this._LocalStoreService.getItem('dremoPerfil');
  }

  formCompetencia = this.fb.group({
    iCompetenciaId: [0],
    iCurrId: [0, Validators.required],
    cCompetenciaDescripcion: [''],
    CompetenciaNombre: ['', Validators.required],
    cCompetenciaNro: [null, Validators.required],
    iEstado: [1],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['iCurrId'] && changes['iCurrId'].currentValue) {
      // Si iCurrId cambió y tiene valor válido
      this.inicializacion();

      // this.getTipoCurso();
      // this.getCapacidades();
    }

    if (changes['caption'] && changes['caption'].currentValue) {
      // Si curriculas cambió
      this.caption = changes['caption'].currentValue;
    }
  }

  inicializacion() {
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
        this.titulo = 'Formulario para agregar  área curricular (' + this.caption + ')';
        this.visible = true;
        this.iCompetenciaId = 0;
        this.bUpdate = false;
        this.formCompetencia.reset();
        this.formCompetencia.patchValue({
          iCurrId: Number(this.iCurrId),
          iEstado: 1,
        });
        break;

      case 'editar':
        this.titulo = 'Formulario para editar áreas curriculares (' + this.caption + ')';
        this.formCompetencia.reset();
        this.iCompetenciaId = item.iCompetenciaId;
        this.visible = true;
        this.accionBtnItem({ accion: 'select_modalidad', item: { iNivelId: item.iNivelId } });
        this.formCompetencia.patchValue({
          iCompetenciaId: item.iCompetenciaId,
          iCurrId: Number(this.iCurrId),
          cCompetenciaDescripcion: item.cCompetenciaDescripcion,
          CompetenciaNombre: item.CompetenciaNombre,
          cCompetenciaNro: item.cCompetenciaNro,
          iEstado: Number(item.iEstado) || 0,
        });
        this.bUpdate = true;
        break;

      case 'agregar_competencia':
        break;

      case 'actualizar_competencia':
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
      cCompetenciaNro: item.cCompetenciaNro ?? null,
      iCurrId: this.iCurrId ?? null,
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
        // this.getCompetenciasCurso(this.iCompetenciaId);
        if (!this.bUpdate) {
          this.formCompetencia.reset();
        }
      },
    });
  }
  accionesCompetencias: IActionContainer[] = [
    {
      labelTooltip: 'Agregar competencias',
      text: '',
      icon: 'pi pi-plus',
      accion: 'agregar',
      class: 'p-button-primary',
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
    {
      labelTooltip: 'Eliminar competencias',
      icon: 'pi pi-trash',
      accion: 'eliminar_curricula',
      type: 'item',
      class: 'p-button-rounded p-button-danger p-button-text',
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
