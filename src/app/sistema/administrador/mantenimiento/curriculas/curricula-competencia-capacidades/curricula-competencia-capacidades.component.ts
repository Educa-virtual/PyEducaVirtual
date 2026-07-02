import {
  ChangeDetectorRef,
  Component,
  inject,
  Input,
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
import { GeneralService } from '@/app/servicios/general.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { PrimengModule } from '@/app/primeng.module';

@Component({
  selector: 'app-curricula-competencia-capacidades',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent, NoDataComponent],
  templateUrl: './curricula-competencia-capacidades.component.html',
  styleUrl: './curricula-competencia-capacidades.component.scss',
})
export class CurriculaCompetenciaCapacidadesComponent implements OnChanges {
  @Input() iCompetenciaId: number = 0;

  capacidades: any[] = [];
  messages: Message[] | undefined;
  formCapacidades: FormGroup;
  bUpdate: boolean = false;
  perfil: any;
  activeTab: number = 0;

  estados_capacidades: any[] = [
    { label: 'ACTIVO', value: 1 },
    { label: 'INACTIVO', value: 0 },
  ];

  private _LocalStoreService = inject(LocalStoreService);

  constructor(
    private fb: FormBuilder,
    public cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private query: GeneralService
  ) {
    this.formCapacidades = this.fb.group({
      iCapacidadId: [''],
      iCompetenciaId: [null, Validators.required],
      cCapacidadNombre: [null, Validators.required],
      cCapacidadDescripcion: [''],
      iEstado: [1],
    });

    this.perfil = this._LocalStoreService.getItem('dremoPerfil');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['iCompetenciaId'] && changes['iCompetenciaId'].currentValue) {
      this.inicializacion();
      this.formCapacidades.patchValue({
        iCompetenciaId: this.iCompetenciaId,
      });
    }
  }

  inicializacion() {
    this.query
      .searchCalAcademico({
        esquema: 'acad',
        tabla: 'curriculo_capacidades',
        campos: '*',
        condicion: 'iCompetenciaId=' + this.iCompetenciaId,
      })
      .subscribe({
        next: (data: any) => {
          this.capacidades = data.data;
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

  cambiarTab(index: number) {
    this.activeTab = index;
    if (index === 1) {
      this.inicializacionForm();
    }
  }

  inicializacionForm() {
    this.formCapacidades.reset();
    this.formCapacidades.patchValue({
      iCompetenciaId: this.iCompetenciaId,
      iEstado: 1,
    });
  }

  insertarCompetenciaCapacidad(item: any) {
    const params = {
      iCredEntPerfId: this.perfil.iCredEntPerfId ?? null,
      iCredId: this.perfil.iCredId ?? null,
      iCapacidadId: item.iCapacidadId ?? null,
      iCompetenciaId: item.iCompetenciaId ?? null,
      cCapacidadNombre: item.cCapacidadNombre ?? null,
      cCapacidadDescripcion: item.cCapacidadDescripcion ?? null,
      iEstado: item.iEstado ?? 0,
    };
    this.query.insertarCompetenciaCapacidad(params).subscribe({
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
        this.inicializacion();
        if (!this.bUpdate) {
          this.formCapacidades.reset();
          this.formCapacidades.patchValue({
            iCompetenciaId: this.iCompetenciaId,
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
        this.inicializacionForm();
        this.bUpdate = false;
        this.activeTab = 1;
        break;

      case 'guardar_capacidad':
        this.insertarCompetenciaCapacidad(item);
        this.bUpdate = false;
        break;

      case 'actualizar_capacidad':
        this.insertarCompetenciaCapacidad(item);
        this.bUpdate = true;
        break;

      case 'editar_capacidad':
        this.formCapacidades.patchValue({
          iCapacidadId: item.iCapacidadId,
          iCompetenciaId: this.iCompetenciaId,
          cCapacidadNombre: item.cCapacidadNombre,
          cCapacidadDescripcion: item.cCapacidadDescripcion,
          iEstado: Number(item.iEstado ?? 0),
        });
        this.bUpdate = true;
        this.activeTab = 1;
        break;

      default:
        break;
    }
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
      width: '25%',
      field: 'cCapacidadNombre',
      header: 'Nombre',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '45%',
      field: 'cCapacidadDescripcion',
      header: 'Descripción',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'estado-activo',
      width: '10%',
      field: 'iEstado',
      header: '',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'actions',
      width: '15%',
      field: 'actions',
      header: 'Acciones',
      text_header: 'center',
      text: 'center',
    },
  ];

  actions: IActionTable[] = [
    {
      labelTooltip: 'Editar capacidades',
      icon: 'pi pi-pencil',
      accion: 'editar_capacidad',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
    },
  ];

  actionsContainer = [
    {
      labelTooltip: 'Agregar',
      text: 'Agregar capacidad',
      icon: 'pi pi-plus',
      accion: 'agregar',
      class: 'p-button-success',
    },
  ];
}
