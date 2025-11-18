import {
  ChangeDetectorRef,
  Component,
  // EventEmitter,
  inject,
  Input,
  //  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Button } from 'primeng/button';
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { NoDataComponent } from '@/app/shared/no-data/no-data.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Message, MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { DialogModule } from 'primeng/dialog';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
//import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { GeneralService } from '@/app/servicios/general.service';
import { InputSwitchModule } from 'primeng/inputswitch';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component';

import { ToggleButtonModule } from 'primeng/togglebutton';

@Component({
  selector: 'app-curricula-competencia-capacidades',
  standalone: true,
  imports: [
    Button,
    TablePrimengComponent,
    CommonModule,
    FormsModule,
    ToastModule,
    InputNumberModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    MessagesModule,
    TablePrimengComponent,
    DialogModule,
    InputTextModule,
    DropdownModule,
    InputTextareaModule,
    InputSwitchModule,
    ToggleButtonModule,
    NoDataComponent,
    ContainerPageComponent,
  ],
  templateUrl: './curricula-competencia-capacidades.component.html',
  styleUrl: './curricula-competencia-capacidades.component.scss',
})
export class CurriculaCompetenciaCapacidadesComponent implements OnChanges {
  @Input() iCompetenciaId: number = 0;

  capacidades: any[] = [];
  messages: Message[] | undefined;
  formCapacidades: FormGroup;
  bUpdate: boolean = false; //variable para identificar modificacion
  perfil: any;

  //private _confirmService = inject(ConfirmationModalService);
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
      // Si iCurrId cambió y tiene valor válido
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
        }
      },
    });
  }

  accionBtnItem(event: any) {
    const item = event.item || null;
    const accion = event.accion || null;

    switch (accion) {
      case 'agregar':
        this.formCapacidades.reset();
        this.formCapacidades.patchValue({
          iEstado: 1,
        });
        this.bUpdate = false;
        break;

      case 'guardar_capacidad':
        this.insertarCompetenciaCapacidad(item);
        this.bUpdate = false;
        break;

      case 'actualizar_capacidad':
        this.insertarCompetenciaCapacidad(item);
        this.bUpdate = true;
        break;

      case 'editar_competencia':
        this.formCapacidades.patchValue({
          iCapacidadId: item.iCapacidadId,
          iCompetenciaId: this.iCompetenciaId,
          cCapacidadNombre: item.cCapacidadNombre,
          cCapacidadDescripcion: item.cCapacidadDescripcion,
          iEstado: Number(item.iEstado ?? 0),
        });
        this.bUpdate = true;
        break;

      default:
        break;
    }
  }

  columns = [
    {
      type: 'item',
      width: '10%',
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
      width: '35%',
      field: 'cCapacidadDescripcion',
      header: 'Descripción',
      text_header: 'center',
      text: 'left',
    },

    {
      type: 'estado-activo',
      width: '15%',
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
      accion: 'editar_competencia',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
    },
    // {
    //   labelTooltip: 'Eliminar capacidades',
    //   icon: 'pi pi-trash',
    //   accion: 'eliminar_capacidades',
    //   type: 'item',
    //   class: 'p-button-rounded p-button-danger p-button-text',
    // },
  ];

  actionsContainer = [
    {
      labelTooltip: 'Agregar',
      text: 'Agregar capacidades',
      icon: 'pi pi-plus',
      accion: 'agregar',
      class: 'p-button-success',
    },
  ];
}
