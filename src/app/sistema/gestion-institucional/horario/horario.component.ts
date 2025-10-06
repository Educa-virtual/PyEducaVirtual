import { Component, inject, OnInit } from '@angular/core';
import { GeneralService } from '@/app/servicios/general.service';
import { PrimengModule } from '@/app/primeng.module';
import { MessageService } from 'primeng/api';
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import {
  ContainerPageComponent,
  IActionContainer,
} from '../../../shared/container-page/container-page.component';
import { BlockHorarioComponent } from './block-horario/block-horario.component';

@Component({
  selector: 'app-gestion-institucional',
  standalone: true,
  imports: [
    PrimengModule,
    ReactiveFormsModule,
    TablePrimengComponent,
    ContainerPageComponent,
    BlockHorarioComponent,
  ],
  templateUrl: './horario.component.html',
  // styleUrl: '',
})
export class HorarioComponent implements OnInit {
  formHorario: FormGroup;

  //Variables
  horarios: any[] = [];

  visible: boolean = false;
  visible_detalle: boolean = false;
  caption: string = 'Formulario de configuración de horarios';
  option: string = '';

  iConfBloqueId: number = 0; // ID del bloque de horario seleccionado para editar o eliminar

  private _confirmService = inject(ConfirmationModalService);
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private query: GeneralService
  ) {}

  async ngOnInit() {
    try {
      this.formHorario = this.fb.group({
        iConfBloqueId: [0],
        cDescripcion: ['', Validators.required],
        iNumBloque: [0, Validators.required],
        iBloqueInter: [0, Validators.required],
        iEstado: [0],
        tInicio: ['', Validators.required],
        tFin: ['', Validators.required],
      });

      this.getHorario();
    } catch (error) {
      this.messageService.add({
        severity: 'danger',
        summary: 'Mensaje del Sistema',
        detail: 'Error las variables del formulario:' + error,
      });
    }
  }

  getHorario() {
    this.query
      .searchCalAcademico({
        esquema: 'hor',
        tabla: 'configuracion_bloques',
        campos: '*',
        condicion: '1=1',
      })
      .subscribe({
        next: (data: any) => {
          this.horarios = data.data;
        },
        error: error => {
          this.messageService.add({
            severity: 'danger',
            summary: 'Mensaje del Sistema',
            detail: 'Error. al cargar los datos del horario: ' + error.error.message,
          });
        },
        complete: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Mensaje del Sistema',
            detail: 'Se cargaron los registros del horario correctamente',
          });
        },
      });
  }

  accionBtnItem(accion: string) {
    if (accion === 'guardar') {
      const params = JSON.stringify({
        iConfBloqueId: this.formHorario.get('iConfBloqueId')?.value || 0, // Aseguramos que sea un número
        cDescripcion: this.formHorario.get('cDescripcion')?.value || '',
        iNumBloque: this.formHorario.get('iNumBloque')?.value || 0, // Aseguramos que sea un número
        iBloqueInter: this.formHorario.get('iBloqueInter')?.value || 0, // Aseguramos que sea un número
        iEstado: 0, //this.formHorario.get('iEstado')?.value || 0, // Aseguramos que sea un número
        //tInicio: this.formHorario.get('tInicio')?.value ? this.formHorario.get('tInicio')?.value.toTimeString().slice(0, 8) : '',
        tInicio: this.toHHMMSS(this.formHorario.get('tInicio')?.value),
        tFin: this.toHHMMSS(this.formHorario.get('tFin')?.value),
        //tFin: this.formHorario.get('tFin')?.value ? this.formHorario.get('tFin')?.value.toTimeString().slice(0, 8) : '',
      });
      this.query
        .addCalAcademico({
          json: params, //this.formHorario.getRawValue(),
          _opcion: 'addConfigBloque',
        })
        .subscribe({
          error: error => {
            this.messageService.add({
              severity: 'error',
              summary: 'Mensaje del sistema',
              detail: 'Error. No se proceso petición de registro: ' + error.message,
            });
          },
          complete: () => {
            this.getHorario();
            this.messageService.add({
              severity: 'success',
              summary: 'Mensaje del sistema',
              detail: 'Proceso exitoso',
            });

            this.visible = false; // Ocultar el formulario después de guardar
          },
        });
    }

    if (accion === 'editar') {
      //this.visible = true;
      this.caption = 'Formulario de edición de bloque de horarios ';
      this.option = 'editar';
    }
  }

  toHHMMSS(value: any): string {
    if (!value) return '';

    if (value instanceof Date) {
      return value.toTimeString().slice(0, 8);
    }

    if (typeof value === 'string') {
      // Si ya está en formato 'HH:mm:ss' o 'HH:mm'
      if (/^\d{2}:\d{2}(:\d{2})?$/.test(value)) {
        return value.length === 5 ? value + ':00' : value;
      }

      // Intentar parsear si es otra string de fecha
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        return d.toTimeString().slice(0, 8);
      }
    }
    return '';
  }

  accionBtnItemTable({ accion, item }) {
    if (accion === 'agregar') {
      this.visible = true;
      this.caption = 'Formulario de creación de horarios';
      this.option = 'agregar';
      this.formHorario.reset();
    }

    if (accion === 'editar') {
      this.iConfBloqueId = item.iConfBloqueId; // Guardar el ID del bloque de horario seleccionado

      this.formHorario.get('iConfBloqueId')?.setValue(item.iConfBloqueId);
      this.formHorario.get('cDescripcion')?.setValue(item.cDescripcion);
      this.formHorario.get('iNumBloque')?.setValue(item.iNumBloque);
      this.formHorario.get('iBloqueInter')?.setValue(item.iBloqueInter);
      this.formHorario.get('iEstado')?.setValue(Number(item.iEstado));

      if (item.tInicio) {
        const partes = item.tInicio.split(':');
        const fecha = new Date();
        fecha.setHours(+partes[0], +partes[1], +partes[2] || 0);
        this.formHorario.get('tInicio')?.setValue(fecha);
      } else {
        this.formHorario.get('tInicio')?.setValue(null);
      }
      if (item.tFin) {
        const partes = item.tFin.split(':');
        const fecha = new Date();
        fecha.setHours(+partes[0], +partes[1], +partes[2] || 0);
        this.formHorario.get('tFin')?.setValue(fecha);
      } else {
        this.formHorario.get('tFin')?.setValue(null);
      }
      //this.formHorario.get('tInicio')?.setValue(item.tInicio);
      //this.formHorario.get('tFin')?.setValue(item.tFin);

      this.visible = true;
      this.option = 'editar';
      this.caption = 'Formulario de edición de bloque de horarios ';
    }

    if (accion === 'finalizar') {
      this.finalizarConfiguracion(item);
    }
    if (accion === 'bloques') {
      this.option = 'bloques';
      this.caption = 'Distribucion de bloque de horarios ';
      this.iConfBloqueId = item.iConfBloqueId; // Guardar el ID del bloque de horario seleccionado

      this.formHorario.get('iConfBloqueId')?.setValue(item.iConfBloqueId);
      this.formHorario.get('cDescripcion')?.setValue(item.cDescripcion);
      this.formHorario.get('iNumBloque')?.setValue(item.iNumBloque);
      this.formHorario.get('iBloqueInter')?.setValue(item.iBloqueInter);
      this.formHorario.get('iEstado')?.setValue(1);
      this.visible_detalle = true; // Mostrar el formulario de bloques de horario
    }
  }

  finalizarConfiguracion(item: any) {
    this.query
      .updateCalAcademico({
        json: JSON.stringify(item), //JSON.stringify(item),
        _opcion: 'updateConfiguracioBloques',
      })
      .subscribe({
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje',
            detail: 'Error. No se proceso petición ' + error.message,
          });
        },
        complete: () => {
          this.visible = false;
          this.getHorario();
          this.messageService.add({
            severity: 'success',
            summary: 'Mensaje',
            detail: 'Proceso exitoso',
          });
          this.visible = false; // Ocultar el formulario

          // this.formHorario.reset(); // Limpiar el formulario
          //   this.iConfBloqueId = 0; // Reiniciar el ID del bloque de horario seleccionado
        },
      });
  }

  accionesPrincipal: IActionContainer[] = [
    {
      labelTooltip: 'Crear horario',
      text: 'Crear horario',
      icon: 'pi pi-plus',
      accion: 'agregar',
      class: 'p-button-primary',
    },
  ];

  selectedItems = [];
  actions: IActionTable[] = [
    {
      labelTooltip: 'Calendario',
      icon: 'pi pi-calendar-plus',
      accion: 'bloques',
      type: 'item',
      class: 'p-button-rounded p-button-primary p-button-text',
      isVisible: rowData => {
        return rowData.iEstado === '1'; // Mostrar solo si el estado es 1 (activo)
      },
    },
    {
      labelTooltip: 'Editar',
      icon: 'pi pi-pencil',
      accion: 'editar',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
      isVisible: rowData => {
        return rowData.iEstado === '0'; // Mostrar solo si el estado es 1 (activo)
      },
    },
    // {
    //     labelTooltip: 'Eliminar',
    //     icon: 'pi pi-trash',
    //     accion: 'eliminar',
    //     type: 'item',
    //     class: 'p-button-rounded p-button-danger p-button-text',
    // },
  ];

  columns = [
    {
      type: 'item',
      width: '1rem',
      field: 'item',
      header: 'N°',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '5rem',
      field: 'cDescripcion',
      header: 'Descripción del horario',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '3rem',
      field: 'iNumBloque',
      header: 'Cantidad de bloques',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '3rem',
      field: 'iBloqueInter',
      header: 'Intervalo',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'time',
      width: '5rem',
      field: 'tInicio',
      header: 'Hora inicio',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'time',
      width: '5rem',
      field: 'tFin',
      header: 'Hora término',
      text_header: 'center',
      text: 'center',
    },

    {
      type: 'estado-activo',
      width: '5rem',
      field: 'iEstado',
      header: 'Activo',
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
