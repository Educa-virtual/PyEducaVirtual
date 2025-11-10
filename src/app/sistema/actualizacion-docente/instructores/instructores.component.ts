import { Component, inject, OnInit } from '@angular/core';
import { ToolbarPrimengComponent } from '../../../shared/toolbar-primeng/toolbar-primeng.component';
import { PrimengModule } from '@/app/primeng.module';
import {
  IActionTable,
  IColumn,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { InstructorFormComponent } from './instructor-form/instructor-form.component';
import { TiposIdentificacionesService } from '@/app/servicios/grl/tipos-identificaciones.service';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { GeneralService } from '@/app/servicios/general.service';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { MessageService } from 'primeng/api';
import { ActualizacionDocenteService } from '../actualizacion-docente.service';

@Component({
  selector: 'app-instructores',
  standalone: true,
  imports: [ToolbarPrimengComponent, PrimengModule, TablePrimengComponent, InstructorFormComponent],
  templateUrl: './instructores.component.html',
  styleUrl: './instructores.component.scss',
})
export class InstructoresComponent implements OnInit {
  private _TiposIdentificacionesService = inject(TiposIdentificacionesService);
  private _constantesService = inject(ConstantesService);
  private GeneralService = inject(GeneralService);
  private _confirmService = inject(ConfirmationModalService);

  instructores: any[] = [];
  tiposIdentificaciones: any[] = [];
  showModal: boolean = false;
  instructor; // obtene datos del instructor
  accion; //variable para las acciones en el modal

  constructor(
    private messageService: MessageService,
    private actDocService: ActualizacionDocenteService
  ) {}

  public columnasTabla: IColumn[] = [
    {
      type: 'item',
      width: '0.5rem',
      field: 'index',
      header: 'Nro',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'item-innerHtml',
      width: '10rem',
      field: 'cDatosInstructor',
      header: 'Datos Personales del Instructor',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'item-checkList',
      width: '2rem',
      field: 'bCredencial',
      header: '¿Tiene Credencial?',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'tag',
      width: '2rem',
      field: 'cEstado',
      header: 'Estado',
      text_header: 'center',
      text: 'center',
      styles: {
        ACTIVO: 'success',
        INACTIVO: 'secondary',
      },
    },
    {
      type: 'actions',
      width: '1rem',
      field: '',
      header: 'Acciones',
      text_header: 'center',
      text: 'center',
    },
  ];

  public accionesTabla: IActionTable[] = [
    {
      labelTooltip: 'Editar',
      icon: 'pi pi-pencil',
      accion: 'editar',
      type: 'item',
      class: 'p-button-rounded p-button-succes p-button-text',
    },
    {
      labelTooltip: 'Eliminar',
      icon: 'pi pi-trash',
      accion: 'eliminar',
      type: 'item',
      class: 'p-button-rounded p-button-danger p-button-text',
      isVisible: row => Number(row.iTotalCapacitaciones) === 0,
    },
    {
      labelTooltip: 'Activar',
      icon: 'pi pi-check',
      accion: 'estado',
      type: 'item',
      class: 'p-button-rounded p-button-success p-button-text',
      isVisible: row => Number(row.iEstado) === 10,
    },
    {
      labelTooltip: 'Desactivar',
      icon: 'pi pi-times',
      accion: 'estado',
      type: 'item',
      class: 'p-button-rounded p-button-danger p-button-text',
      isVisible: row => Number(row.iEstado) === 1,
    },
  ];
  public btnAccion = [
    {
      label: 'Nuevo Instructor',
      icon: 'pi pi-plus',
      class: 'p-button-success',
      action: () => this.accionBnt({ accion: 'guardar' }),
    },
  ];

  ngOnInit(): void {
    this.obtenerTipoIdentificaciones();
    this.obtenerInstructores();
  }
  accionBnt({ accion, item }: { accion: string; item?: any }): void {
    switch (accion) {
      case 'close-modal':
        this.showModal = false;
        this.obtenerInstructores();
        break;
      case 'guardar':
        this.accion = accion;
        this.showModal = true;
        break;
      case 'editar':
        this.accion = accion;
        console.log(item);
        this.instructor = item;
        this.showModal = true;
        break;
      case 'eliminar':
        this.eliminarInstructor(item);
        break;
      case 'estado':
        this.cambiarEstadoInstructor(item);
    }
  }
  obtenerTipoIdentificaciones(): void {
    const params = {
      iCredId: this._constantesService.iCredId,
    };
    this._TiposIdentificacionesService.obtenerTipoIdentificaciones(params).subscribe({
      next: (response: any) => {
        this.tiposIdentificaciones = response.data;
      },
      error: error => {
        console.error('Error al obtener tipos de identificaciones:', error);
      },
    });
  }
  eliminarInstructor(item: any): void {
    const data = item;
    this._confirmService.openConfirm({
      header: '¿Esta seguro de eliminar este registro?',
      message: `INSTRUCTOR: ${data.cPersApeNombres}`,
      accept: () => {
        const params = {
          petition: 'delete',
          group: 'cap',
          prefix: 'instructores',
          ruta: data.iInstId,
          params: {
            iCredId: this._constantesService.iCredId,
          },
        };
        // Servicio para obtener los instructores
        this.GeneralService.getGralPrefixx(params).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Acción exitosa',
              detail: 'Se eliminó el registro',
            });
            this.obtenerInstructores();
          },
        });
      },
      reject: () => {},
    });
  }

  cambiarEstadoInstructor(item) {
    this._confirmService.openConfirm({
      header: `¿Realmente desea cambiar el estado?`,
      message: `Instructor: ${item.cPersApeNombres}`,
      accept: () => {
        this.actDocService
          .estadoInstructor({
            iInstId: item.iInstId,
          })
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Acción exitosa',
                detail: 'Se actualizó el instructor',
              });
              this.obtenerInstructores();
            },
            error: error => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error?.error?.message || 'Ocurrió un error inesperado',
              });
            },
          });
      },
      reject: () => {},
    });
  }

  mostrarModalGuarda() {
    this.showModal = true;
  }

  // metodo para obtener instructores
  obtenerInstructores() {
    this.actDocService
      .listarInstructores({
        iCredId: this._constantesService.iCredId,
      })
      .subscribe({
        next: (response: any) => {
          this.instructores = response.data;
          this.instructores.forEach(instructor => {
            instructor.cDatosInstructor = `<b>Apellidos y Nombres:</b> ${instructor.cPersApeNombres}<br/>
            <b>Correo electrónico:</b> ${instructor.cPersCorreo ? instructor.cPersCorreo : ''}<br/>
            <b>Celular:</b> ${instructor.cPersCelular ? instructor.cPersCelular : ''}`;
          });
        },
        error: error => {
          console.error('Error obteniendo datos:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo obtener los instructores',
          });
        },
      });
  }
}
