import { Component, inject, OnInit } from '@angular/core';
import { StepsModule } from 'primeng/steps';
import { PrimengModule } from '@/app/primeng.module';
import { AdmStepGradoSeccionService } from '@/app/servicios/adm/adm-step-grado-seccion.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { GeneralService } from '@/app/servicios/general.service';
import { StepConfirmationService } from '@/app/servicios/confirm.service';
import {
  ContainerPageComponent,
  IActionContainer,
} from '@/app/shared/container-page/container-page.component';
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
//import { IesPersonalComponent } from '../../../ies-personal/ies-personal.component';
import { FormDocenteComponent } from './form-docente/form-docente.component';

@Component({
  selector: 'app-config-hora-docente',
  standalone: true,
  imports: [
    StepsModule,
    PrimengModule,
    ContainerPageComponent,
    TablePrimengComponent,
    // IesPersonalComponent,
    FormDocenteComponent,
  ],
  templateUrl: './config-hora-docente.component.html',
  styleUrls: ['./config-hora-docente.component.scss'], // ✅ corregido
})
export class ConfigHoraDocenteComponent implements OnInit {
  items: MenuItem[];
  form: FormGroup;

  configuracion: any = [];
  showCaption: string;
  caption: string;
  docentes: any[];

  showFormulario = false;
  docente: any = {};
  config: any = {};
  c_accion: string = 'agregar'; // editar | agregar

  private _confirmService = inject(ConfirmationModalService);
  constructor(
    private stepService: AdmStepGradoSeccionService,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private query: GeneralService,
    private msg: StepConfirmationService
  ) {
    this.form = this.fb.group({}); // evita undefined
    this.items = this.stepService.itemsStep;
    this.configuracion = this.stepService.configuracion;
  }

  ngOnInit(): void {
    console.log('implemntacion docente');

    try {
      this.form = this.fb.group({
        iConfigId: [this.configuracion[0].iConfigId],
      });
      this.searchPersonalDocente();
    } catch (error) {
      this.router.navigate(['/gestion-institucional/configGradoSeccion']);
    }
  }
  confirm() {
    this._confirmService.openConfiSave({
      message: '¿Estás seguro de que deseas guardar y continuar?',
      header: 'Advertencia de autoguardado',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Acción para eliminar el registro
        this.router.navigate(['/gestion-institucional/asignar-grado']);
      },
      reject: () => {
        // Mensaje de cancelación (opcional)
        this.messageService.add({
          severity: 'error',
          summary: 'Cancelado',
          detail: 'Acción cancelada',
        });
      },
    });
  }

  accionBtnItemTable({ accion, item }) {
    if (accion === 'verificar_docente') {
      this._confirmService.openConfiSave({
        header: 'Advertencia de sistema',
        message: '¿Desea generar perfil docente?',

        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          // Acción para eliminar el registro
          this.verificarDocentes(item);
        },
        reject: () => {
          // Mensaje de cancelación (opcional)
          this.messageService.add({
            severity: 'error',
            summary: 'Cancelado',
            detail: 'Acción cancelada',
          });
        },
      });
    }

    if (accion === 'verificar') {
      this._confirmService.openConfiSave({
        header: 'Advertencia de sistema',
        message: '¿Desea verificar y generar perfiles a docentes?',

        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          // Acción para eliminar el registro
          this.verificarDocentes(item);
        },
        reject: () => {
          // Mensaje de cancelación (opcional)
          this.messageService.add({
            severity: 'error',
            summary: 'Cancelado',
            detail: 'Acción cancelada',
          });
        },
      });
    }
    if (accion === 'retornar') {
      this._confirmService.openConfiSave({
        message: '¿Estás seguro de que deseas regresar al paso anterior?',
        header: 'Advertencia de autoguardado',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          // Acción para eliminar el registro
          this.router.navigate(['/gestion-institucional/plan-estudio']);
        },
        reject: () => {
          // Mensaje de cancelación (opcional)
          this.messageService.add({
            severity: 'error',
            summary: 'Cancelado',
            detail: 'Acción cancelada',
          });
        },
      });
    }
    if (accion === 'agregar') {
      this.docente = {};
      this.config = this.configuracion[0];
      this.c_accion = 'agregar';
      this.showFormulario = true;
    }
    if (accion === 'editar') {
      this.c_accion = 'editar';
      this.config = this.configuracion[0];
      this.docente = item;
      this.showFormulario = true;
    }

    if (accion === 'registrar') {
      this.registrarDocente(item);
    }

    if (accion === 'actualizar') {
      this.registrarDocente(item);
    }

    if (accion === 'eliminar') {
      this._confirmService.openConfiSave({
        message: '¿Estás seguro de que deseas eliminar registro?',
        header: 'Advertencia del sistema',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          // Acción para eliminar el registro
          this.eliminarDocente(item);
        },
        reject: () => {
          // Mensaje de cancelación (opcional)
          this.messageService.add({
            severity: 'error',
            summary: 'Cancelado',
            detail: 'Acción cancelada',
          });
        },
      });
    }
    if (accion === 'habilitar') {
      this._confirmService.openConfiSave({
        message: '¿Estás seguro de que deseas habilitar registro?',
        header: 'Advertencia del sistema',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          // Acción para eliminar el registro
          this.habilitarDocente(item);
        },
        reject: () => {
          // Mensaje de cancelación (opcional)
          this.messageService.add({
            severity: 'error',
            summary: 'Cancelado',
            detail: 'Acción cancelada',
          });
        },
      });
    }
  }

  verificarDocentes(item: any) {
    this.query
      .addAmbienteAcademico({
        json: JSON.stringify({
          iPersId: item.iPersId ?? 0,
          iSedeId: this.configuracion[0].iSedeId,
          iYAcadId: this.configuracion[0].iYAcadId,
          iEntId: this.configuracion[0].iEntId ?? 10,
          iCredId: this.configuracion[0].iCredId ?? 0,
        }),
        _opcion: 'verificarDocentesSede',
      })
      .subscribe({
        next: (data: any) => {
          console.log(data, 'verificarDocentes');
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del sistema',
            detail: 'Error en el procedimiento de búsqueda de docentes : ' + error.menssage,
          });
        },
        complete: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Mensaje del sistema',
            detail: 'Se realizó actualización de docentes',
          });
          this.searchPersonalDocente();
        },
      });
  }

  eliminarDocente(item: any) {
    if (item.iPersId > 0) {
      const params = {
        esquema: 'acad',
        tabla: 'personal_ies',
        json: JSON.stringify({
          iEstado: 0,
        }),
        campo: 'iPersId',
        condicion: item.iPersId,
      };

      this.query.updateAcademico(params).subscribe({
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje',
            detail: 'Error. No se proceso petición ' + error.menssage,
          });
        },
        complete: () => {
          this.messageService.add({
            summary: 'Mensaje del sistema',
            severity: 'success',
            detail: 'Se elimino el registro de docente',
          });

          this.searchPersonalDocente();
        },
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Mensaje de sistema',
        detail:
          'Error en el procedimiento de eliminación de docente ID: ' + item.iPersId + ' incorrecto',
      });
    }
  }

  habilitarDocente(item: any) {
    if (item.iPersId > 0) {
      const params = {
        esquema: 'acad',
        tabla: 'personal_ies',
        json: JSON.stringify({
          iEstado: 1,
        }),
        campo: 'iPersId',
        condicion: item.iPersId,
      };

      this.query.updateAcademico(params).subscribe({
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje',
            detail: 'Error. No se proceso petición ' + error.menssage,
          });
        },
        complete: () => {
          this.messageService.add({
            summary: 'Mensaje del sistema',
            severity: 'success',
            detail: 'Se habilito el registro de docente',
          });

          this.searchPersonalDocente();
        },
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Mensaje de sistema',
        detail:
          'Error en el procedimiento de eliminación de docente ID: ' + item.iPersId + ' incorrecto',
      });
    }
  }

  searchPersonalDocente() {
    this.docentes = [];
    this.query
      .searchAmbienteAcademico({
        json: JSON.stringify({
          iSedeId: this.configuracion[0].iSedeId,
          iYAcadId: this.configuracion[0].iYAcadId,
        }),
        _opcion: 'getDocentesSede',
      })
      .subscribe({
        next: (data: any) => {
          const item = data.data;

          this.docentes = item.map(persona => ({
            ...persona,
            nombre_completo: (
              persona.cPersDocumento +
              ' ' +
              persona.cPersPaterno +
              ' ' +
              persona.cPersMaterno +
              ' ' +
              persona.cPersNombre
            ).trim(),
          }));
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del sistema',
            detail: 'Error en el procedimiento de búsqueda de docentes : ' + error.menssage,
          });
        },
        complete: () => {
          this.stepService.docentes = this.docentes;
        },
      });
  }

  registrarDocente(item) {
    this.query
      .addAmbienteAcademico({
        json: JSON.stringify({
          iPersIeId: item.iPersIeId ?? 0,
          iPersId: item.iPersId ?? 0,
          iYAcadId: item.iYAcadId ?? this.configuracion.iYAcadId ?? 0,
          iPersCargoId: 3,
          iSedeId: item.iSedeId ?? this.configuracion.iSedeId ?? 0,
          iHorasLabora: item.iHorasLabora ?? null,
          cTipoTrabajador: item.cTipoTrabajador ?? null,
          cMotivo: item.cMotivo ?? null,
          dtPersIeInicio: item.dtPersIeInicio ?? null,
          dtPersIeFin: item.dtPersIeFin ?? null,
          cCodigoPlaza: item.cCodigoPlaza ?? null,

          iSesionId: this.configuracion[0].iCredId ?? 0,
        }),
        _opcion: 'addDocenteIE',
      })
      .subscribe({
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del sistema',
            detail: 'Error en el procedimiento de búsqueda de docentes : ' + error.error.menssage,
          });
        },
        complete: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Mensaje del sistema',
            detail: 'Se realizó actualización de docentes',
          });
          this.searchPersonalDocente();
          this.showFormulario = false;
        },
      });
  }

  accionesPrincipal: IActionContainer[] = [
    {
      labelTooltip: 'Retornar',
      text: 'Retornar',
      icon: 'pi pi-arrow-circle-left',
      accion: 'retornar',
      class: 'p-button-warning',
    },
    {
      labelTooltip: 'Verificar docentes',
      text: 'Verificar docentes',
      icon: 'pi pi-check-circle',
      accion: 'verificar',
      class: 'p-button-success',
    },
    {
      labelTooltip: 'Agregar docente',
      text: 'Asignar docente',
      icon: 'pi pi-plus',
      accion: 'agregar',
      class: 'p-button-primary',
    },
    // {
    //     labelTooltip: 'Exportar PDF',
    //     text: 'Reporte',
    //     icon: 'pi pi-file-pdf',
    //     accion: 'agregar',
    //     class: 'p-button-danger',
    // },
  ];

  selectedItems = [];
  actions: IActionTable[] = [
    {
      labelTooltip: 'Verificar docentes',
      icon: 'pi pi-spinner',
      type: 'item',
      accion: 'verificar_docente',
      class: 'p-button-rounded p-button-default p-button-text',
    },
    {
      labelTooltip: 'Editar docentes',
      icon: 'pi pi-pen-to-square',
      type: 'item',
      accion: 'editar',
      class: 'p-button-rounded p-button-warning p-button-text',
    },
    {
      labelTooltip: 'Habilitar',
      icon: 'pi pi-check-circle',
      accion: 'habilitar',
      type: 'item',
      class: 'p-button-rounded p-button-success p-button-text',
      isVisible: rowData => {
        return rowData.iEstado === '0' || rowData.iEstado === null;
      },
    },
    {
      labelTooltip: 'Deshabilitar',
      icon: 'pi pi-ban',
      accion: 'eliminar',
      type: 'item',
      class: 'p-button-rounded p-button-danger p-button-text',
      isVisible: rowData => {
        return rowData.iEstado === '1';
      },
    },
  ];
  actionsLista: IActionTable[];
  columns = [
    {
      type: 'item',
      width: '1rem',
      field: 'item',
      header: '',
      text_header: 'left',
      text: 'left',
    },

    {
      type: 'text',
      width: '3rem',
      field: 'cPersDocumento',
      header: 'Documento',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '5rem',
      field: 'cPersPaterno',
      header: 'Apellido paterno',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '5rem',
      field: 'cPersMaterno',
      header: 'Apellido materno',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '5rem',
      field: 'cPersNombre',
      header: 'Nombres',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '5rem',
      field: 'iHorasLabora',
      header: 'Total de horas',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'estado-activo',
      width: '3rem',
      field: 'docente',
      header: 'Reg docente',
      text_header: 'center',
      text: 'center',
    },

    {
      type: 'estado-activo',
      width: '3rem',
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
