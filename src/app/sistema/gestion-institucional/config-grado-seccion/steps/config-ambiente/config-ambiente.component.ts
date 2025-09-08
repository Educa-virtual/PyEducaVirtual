import { AdmStepGradoSeccionService } from '@/app/servicios/adm/adm-step-grado-seccion.service';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  ContainerPageComponent,
  IActionContainer,
} from '@/app/shared/container-page/container-page.component';
import { GeneralService } from '@/app/servicios/general.service';

import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { PrimengModule } from '@/app/primeng.module';
//import { StepsModule } from 'primeng/steps'
import { StepperModule } from 'primeng/stepper';
import { DialogModule } from 'primeng/dialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';

@Component({
  selector: 'app-config-ambiente',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    //StepsModule,
    StepperModule,
    ContainerPageComponent,
    TablePrimengComponent,
    DialogModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    InputSwitchModule,
    PrimengModule,
  ],
  templateUrl: './config-ambiente.component.html',
  styleUrl: './config-ambiente.component.scss',
})
export class ConfigAmbienteComponent implements OnInit {
  form: FormGroup;
  // iSedeId: number
  //iYAcadId: number
  items: MenuItem[];
  caption: string;
  visible: boolean = false;
  mensaje: string;
  option: string;
  anio: [];
  tipo_ambiente: [];
  tipo_ubicacion: [];
  uso_ambientes: [];
  piso_ambiente: [];
  condicion_ambiente: [];
  configuracion: any[];

  ambientes: any[];
  private _confirmService = inject(ConfirmationModalService);

  constructor(
    private stepService: AdmStepGradoSeccionService,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private query: GeneralService
  ) {
    //this.iSedeId = this.stepService.iSedeId
    this.items = this.stepService.itemsStep;
    //this.iYAcadId = this.stepService.iYAcadId
    this.anio = this.stepService.anio;
    this.configuracion = this.stepService.configuracion;
  }

  async ngOnInit(): Promise<void> {
    try {
      //bd iiee_ambientes
      //this.visible = true
      this.form = this.fb.group({
        iIieeAmbienteId: [0], //codigo de tabla_iiee_ambientes
        iTipoAmbienteId: [0, Validators.required], // tabla_iiee_ambientes (FK)
        iEstadoAmbId: [0, Validators.required], // tabla_iiee_ambientes (FK)
        iUbicaAmbId: [0, Validators.required], // tabla_iiee_ambientes (FK)
        iUsoAmbId: [0, Validators.required], // tabla_iiee_ambientes (FK)
        iPisoAmbid: [0, Validators.required], // tabla_iiee_ambientes (FK)
        iYAcadId: [this.configuracion[0].iYAcadId], // tabla_iiee_ambientes (FK)
        iSedeId: [this.configuracion[0].iSedeId], // tabla_iiee_ambientes (FK)
        bAmbienteEstado: [0],
        cAmbienteNombre: ['', Validators.required],
        cAmbienteDescripcion: ['', Validators.required],
        iAmbienteArea: [0, Validators.required],
        iAmbienteAforo: [0, Validators.required],
        cAmbienteObs: [''],
        // ambiente: [''],
        cYAcadNombre: [this.configuracion[0].cYAcadNombre],
        // campo adicional para la vista
      });
    } catch (error) {
      this.router.navigate(['/gestion-institucional/configGradoSeccion']);
    }
    this.ambientes = this.stepService.ambientes ?? (await this.stepService.getAmbientes()); // devuelve arrays de tabla acad.ambientes
    this.tipo_ambiente =
      this.stepService.tipo_ambiente ?? (await this.stepService.getTipoAmbiente());
    this.tipo_ubicacion =
      this.stepService.tipo_ubicacion ?? (await this.stepService.getTipoUbicacion());
    this.uso_ambientes =
      this.stepService.uso_ambientes ?? (await this.stepService.getUsoAmbiente());
    this.piso_ambiente =
      this.stepService.piso_ambiente ?? (await this.stepService.getPisoAmbiente());
    this.condicion_ambiente =
      this.stepService.condicion_ambiente ?? (await this.stepService.getCondicionAmbiente());
  }
  // //Consultyas a tablas
  // getAmbientes() {
  //   this.query
  //     .searchAmbienteAcademico({
  //       json: JSON.stringify({
  //         iSedeId: this.stepService.configuracion[0].iSedeId,
  //         iYAcadId: this.stepService.configuracion[0].iYAcadId,
  //       }),
  //       _opcion: 'getAmbientesSedeYear',
  //     })
  //     .subscribe({
  //       next: (data: any) => {
  //         this.ambientes = data.data;
  //       },
  //       error: error => {
  //         this.messageService.add({
  //           severity: 'danger',
  //           summary: 'Mensaje del Sistema',
  //           detail: 'Error en lista de configuraciones:' + error.error.message,
  //         });
  //       },
  //       complete: () => {
  //         this.messageService.add({
  //           severity: 'success',
  //           summary: 'Mensaje del Sistema',
  //           detail: 'Lista de ambientes obtenida correctamente',
  //         });
  //         this.stepService.ambientes = this.ambientes; //SE ACTUALIZA EL ARRAY DE AMBIENTES
  //         // this.getYearCalendarios(this.formCalendario.value)
  //       },
  //     });
  // }
  // getTipoAmbiente() {

  //   this.query
  //     .searchCalAcademico({
  //       esquema: 'acad',
  //       tabla: 'tipo_ambientes',
  //       campos: 'iTipoAmbienteId, cTipoAmbienteNombre',
  //       condicion: '1=1',
  //     })
  //     .subscribe({
  //       next: (data: any) => {
  //         this.tipo_ambiente = data.data;
  //       },
  //       error: error => {
  //         this.messageService.add({
  //           severity: 'danger',
  //           summary: 'Mensaje del Sistema',
  //           detail: 'Error en lista de tipos de ambientes:' + error.error.message,
  //         });
  //         // Manejo de error
  //       },
  //       complete: () => {
  //         this.stepService.tipo_ambiente = this.tipo_ambiente;
  //       },
  //     });
  // }

  // getTipoUbicacion() {
  //   this.query
  //     .searchCalAcademico({
  //       esquema: 'acad',
  //       tabla: 'ubicacion_ambientes',
  //       campos: 'iUbicaAmbId, cUbicaAmbNombre',
  //       condicion: '1=1',
  //     })
  //     .subscribe({
  //       next: (data: any) => {
  //         this.tipo_ubicacion = data.data;
  //       },
  //       error: error => {
  //         this.messageService.add({
  //           severity: 'danger',
  //           summary: 'Mensaje del Sistema',
  //           detail: 'Error en lista de ubicaciones de ambientes:' + error.error.message,
  //         });
  //       },
  //       complete: () => {
  //         this.stepService.tipo_ubicacion = this.tipo_ubicacion;
  //       },
  //     });
  // }

  // getUsoAmbiente() {
  //   this.query
  //     .searchCalAcademico({
  //       esquema: 'acad',
  //       tabla: 'uso_ambientes',
  //       campos: 'iUsoAmbId, cUsoAmbNombre, cUsoAmbDescripcion',
  //       condicion: '1=1',
  //     })
  //     .subscribe({
  //       next: (data: any) => {
  //         this.uso_ambientes = data.data;
  //       },
  //       error: error => {
  //         this.messageService.add({
  //           severity: 'danger',
  //           summary: 'Mensaje del Sistema',
  //           detail: 'Error en lista de usos de ambientes:' + error.error.message,
  //         });
  //       },
  //       complete: () => {
  //         this.stepService.uso_ambientes = this.uso_ambientes;
  //       },
  //     });
  // }

  // getCondicionAmbiente() {
  //   this.query
  //     .searchCalAcademico({
  //       esquema: 'acad',
  //       tabla: 'estado_ambientes',
  //       campos: 'iEstadoAmbId, cEstadoAmbNombre',
  //       condicion: '1=1',
  //     })
  //     .subscribe({
  //       next: (data: any) => {
  //         this.condicion_ambiente = data.data;
  //       },
  //       error: error => {
  //         this.messageService.add({
  //           severity: 'danger',
  //           summary: 'Mensaje del Sistema',
  //           detail: 'Error en lista de condiciones de ambientes:' + error.error.message,
  //         });
  //       },
  //       complete: () => {
  //         this.stepService.condicion_ambiente = this.condicion_ambiente;
  //       },
  //     });
  // }

  // getPisoAmbiente() {
  //   this.query
  //     .searchCalAcademico({
  //       esquema: 'acad',
  //       tabla: 'piso_ambientes',
  //       campos: 'iPisoAmbid, cPisoAmbNombre, cPisoAmbDescripcion',
  //       condicion: '1=1',
  //     })
  //     .subscribe({
  //       next: (data: any) => {
  //         this.piso_ambiente = data.data;
  //       },
  //       error: error => {
  //         this.messageService.add({
  //           severity: 'danger',
  //           summary: 'Mensaje del Sistema',
  //           detail: 'Error en lista de pisos de ambientes:' + error.error.message,
  //         });
  //       },
  //       complete: () => {
  //         this.stepService.piso_ambiente = this.piso_ambiente;
  //       },
  //     });
  // }

  // eventos de record set
  confirm() {
    this._confirmService.openConfiSave({
      message: '¿Estás seguro de que deseas guardar y continuar?',
      header: 'Advertencia de autoguardado',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Acción para eliminar el registro
        this.router.navigate(['/gestion-institucional/seccion']);
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
    if (accion === 'editar') {
      this.visible = true;
      this.caption = 'Editar ambientes';
      this.option = 'editar';
      this.form.get('iIieeAmbienteId')?.setValue(item.iIieeAmbienteId);
      this.form.get('cAmbienteNombre')?.setValue(item.cAmbienteNombre);
      this.form.get('cAmbienteDescripcion')?.setValue(item.cAmbienteDescripcion);
      this.form.get('iTipoAmbienteId')?.setValue(item.iTipoAmbienteId);
      this.form.get('iUbicaAmbId')?.setValue(item.iUbicaAmbId);
      this.form.get('iUsoAmbId')?.setValue(item.iUsoAmbId);
      this.form.get('iEstadoAmbId')?.setValue(item.iEstadoAmbId);
      this.form.get('iAmbienteAforo')?.setValue(item.iAmbienteAforo);
      this.form.get('iAmbienteArea')?.setValue(item.iAmbienteArea);
      this.form.get('iPisoAmbid')?.setValue(item.iPisoAmbid);
      this.form.get('cAmbienteObs')?.setValue(item.cAmbienteObs);
      this.form.get('bAmbienteEstado')?.setValue(item.bAmbienteEstado);
      if (item.bAmbienteEstado == 1) {
        this.form.get('bAmbienteEstado')?.setValue(1);
      } else {
        this.form.get('bAmbienteEstado')?.setValue(0);
      }
    }
    if (accion === 'agregar') {
      this.visible = true;
      this.caption = 'Registrar ambientes';
      this.option = 'crear';
      this.clearForm();
    }
    if (accion === 'eliminar') {
      this._confirmService.openConfirm({
        message: '¿Está seguro de que desea eliminar este elemento?',
        header: 'Confirmación de eliminación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          // Acción a realizar al confirmar
          const params = {
            esquema: 'acad',
            tabla: 'iiee_ambientes',
            campo: 'iIieeAmbienteId',
            valorId: item.iIieeAmbienteId,
          };
          this.query.deleteAcademico(params).subscribe({
            // next: (data: any) => {
            //   console.log(data.data);
            // },
            error: error => {
              this.messageService.add({
                severity: 'danger',
                summary: 'Mensaje de sistema',
                detail: 'Error en el proceso de eliminar: ' + error.error.message,
              });
            },
            complete: async () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Mensaje',
                detail: 'Proceso exitoso',
              });

              this.ambientes = await this.stepService.getAmbientes();
              this.visible = false;
              this.clearForm();
            },
          });
        },
        reject: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje',
            detail: 'Proceso cancelado',
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
          this.router.navigate(['/gestion-institucional/config']);
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

  accionBtnItem(accion) {
    if (accion === 'guardar') {
      this.visible = true;
      this.caption = 'Registrar ambientes';
      if (this.form.valid) {
        //ALMACENAR LA INFORMACION
        this.query
          .addAmbienteAcademico({
            json: JSON.stringify(this.form.value),
            _opcion: 'addAmbiente',
          })
          .subscribe({
            error: error => {
              this.messageService.add({
                severity: 'danger',
                summary: 'Mensaje de sistema',
                detail: 'Error en el proceso: ' + error.error.message,
              });
            },
            complete: async () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Mensaje',
                detail: 'Proceso exitoso',
              });

              this.ambientes = await this.stepService.getAmbientes();
              this.visible = false;
              this.clearForm();
            },
          });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Mensaje',
          detail: 'Llenado de formulario incorrecto',
        });
      }
    }
    //updateAcademico
    if (accion === 'editar') {
      if (this.form.valid) {
        const params = {
          esquema: 'acad',
          tabla: 'iiee_ambientes',
          json: JSON.stringify({
            iTipoAmbienteId: this.form.get('iTipoAmbienteId')?.value,
            iEstadoAmbId: this.form.get('iEstadoAmbId')?.value,
            iUbicaAmbId: this.form.get('iUbicaAmbId')?.value,
            iUsoAmbId: this.form.get('iUsoAmbId')?.value,
            iPisoAmbid: this.form.get('iPisoAmbid')?.value,
            iYAcadId: this.form.get('iYAcadId')?.value,
            iSedeId: this.form.get('iSedeId')?.value,
            bAmbienteEstado: this.form.get('bAmbienteEstado')?.value,
            cAmbienteNombre: this.form.get('cAmbienteNombre')?.value,
            cAmbienteDescripcion: this.form.get('cAmbienteDescripcion')?.value,
            iAmbienteArea: this.form.get('iAmbienteArea')?.value,
            iAmbienteAforo: this.form.get('iAmbienteAforo')?.value,
            cAmbienteObs: this.form.get('cAmbienteObs')?.value,
          }),
          campo: 'iIieeAmbienteId',
          condicion: this.form.get('iIieeAmbienteId')?.value,
        };

        this.query.updateAcademico(params).subscribe({
          error: error => {
            this.messageService.add({
              severity: 'danger',
              summary: 'Mensaje de sistema',
              detail: 'Error en el proceso de actualizar: ' + error.error.message,
            });
          },
          complete: async () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Mensaje de sistema',
              detail: 'Proceso exitoso',
            });

            this.ambientes = await this.stepService.getAmbientes();
            this.visible = false;
            this.clearForm();
          },
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Mensaje',
          detail: 'Llenado de formulario incorrecto',
        });
      }
    }
  }
  clearForm() {
    this.form.get('iIieeAmbienteId')?.setValue(0);
    this.form.get('cAmbienteNombre')?.setValue('');
    this.form.get('cAmbienteDescripcion')?.setValue('');
    this.form.get('iTipoAmbienteId')?.setValue(0);
    this.form.get('iUbicaAmbId')?.setValue(0);
    this.form.get('iUsoAmbId')?.setValue(0);
    this.form.get('iEstadoAmbId')?.setValue(0);
    this.form.get('iAmbienteAforo')?.setValue('');
    this.form.get('iAmbienteArea')?.setValue('');
    this.form.get('iPisoAmbid')?.setValue(0);
    this.form.get('cAmbienteObs')?.setValue('');
    this.form.get('bAmbienteEstado')?.setValue(0);
  }

  saveInformation() {
    if (this.caption == 'create') {
      alert('Mensaje 0 save');
    } else {
      alert('Mensaje 1 save');
    }
  }
  nextPage() {
    alert('mensaje de next');
  }

  //ESTRUCTURASS DE TABLA
  //Maquetar tablas
  // handleActions(actions) {
  //   console.log(actions);
  // }
  accionesPrincipal: IActionContainer[] = [
    {
      labelTooltip: 'Retornar',
      text: 'Retornar',
      icon: 'pi pi-arrow-circle-left',
      accion: 'retornar',
      class: 'p-button-warning',
    },
    {
      labelTooltip: 'Crear Ambiente',
      text: 'Crear ambientes',
      icon: 'pi pi-plus',
      accion: 'agregar',
      class: 'p-button-primary',
    },

    // {
    //     labelTooltip: 'Unificar Ambiente',
    //     text: 'Unificar ambientes',
    //     icon: 'pi pi-arrow-down-left-and-arrow-up-right-to-center',
    //     accion: 'unificar',
    //     class: 'p-button-secondary',
    // },
    // {
    //     labelTooltip: 'Dividir Ambiente',
    //     text: 'Dividir ambientes',
    //     icon: 'pi pi-arrow-up-right-and-arrow-down-left-from-center',
    //     accion: 'dividir',
    //     class: 'p-button-secondary',
    // },
  ];
  selectedItems = [];
  actions: IActionTable[] = [
    {
      labelTooltip: 'Editar',
      icon: 'pi pi-pencil',
      accion: 'editar',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
    },
    {
      labelTooltip: 'Eliminar',
      icon: 'pi pi-trash',
      accion: 'eliminar',
      type: 'item',
      class: 'p-button-rounded p-button-danger p-button-text',
    },
  ];

  columns = [
    // {
    //     type: 'checkbox',
    //     width: '2rem',
    //     field: 'checked',
    //     header: '',
    //     text_header: '',
    //     text: 'left',
    // },
    {
      type: 'item',
      width: '5rem',
      field: 'item',
      header: 'N°',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '5rem',
      field: 'cAmbienteNombre',
      header: 'Ambiente',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '5rem',
      field: 'iAmbienteArea',
      header: 'Area m2',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '5rem',
      field: 'iAmbienteAforo',
      header: 'Aforo',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '5rem',
      field: 'cTipoAmbienteNombre',
      header: 'Tipo de ambiente',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '5rem',
      field: 'cEstadoAmbNombre',
      header: 'Condición',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '5rem',
      field: 'cUbicaAmbNombre',
      header: 'Ubicación',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'estado-activo',
      width: '5rem',
      field: 'bAmbienteEstado',
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

// "{"iTipoAmbienteId":"1",
// "iEstadoAmbId":"1",
// "iUbicaAmbId":"1",
// "iUsoAmbId":"1",
// "iPisoAmbid":"2",
// "iYAcadId":"3",
// "iSedeId":"1",
// "bAmbienteEstado":0,
// "cAmbienteNombre":"aula 104",
// "cAmbienteDescripcion":"de primaria",
// "iAmbienteArea":"50",
// "iAmbienteAforo":"30",
// "cAmbienteObs":"ninguna"}"
