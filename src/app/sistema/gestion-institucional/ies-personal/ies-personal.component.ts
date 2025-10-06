import { Component, inject, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';

import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { GeneralService } from '@/app/servicios/general.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { InputNumberModule } from 'primeng/inputnumber';
import {
  ContainerPageComponent,
  IActionContainer,
} from '@/app/shared/container-page/container-page.component';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { DatosEstudianteService } from '../services/datos-estudiante-service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-ies-personal',
  standalone: true,
  imports: [PrimengModule, ContainerPageComponent, InputNumberModule, TablePrimengComponent],
  templateUrl: './ies-personal.component.html',
  styleUrls: ['./ies-personal.component.scss'],
})
export class IesPersonalComponent implements OnInit {
  form: FormGroup;

  sede: any[];
  iSedeId: number;
  iYAcadId: number;
  personal_ies: any[];
  option: boolean = false;

  visible: boolean = false; //mostrar dialogo
  caption: string = ''; // titulo o cabecera de dialogo
  c_accion: string; //valos de las acciones

  persona: any;
  personas: Array<object>;
  docentes: Array<object>;
  lista: Array<object>;
  cargos: Array<object>;
  mensaje: string;
  tipos_documentos: Array<object>;
  sever: string = 'default';

  private _confirmService = inject(ConfirmationModalService); // componente de dialog mensaje

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private query: GeneralService,
    private store: LocalStoreService,
    private datosEstudianteService: DatosEstudianteService
    // private confirmationService: ConfirmationService,
  ) {
    const perfil = this.store.getItem('dremoPerfil');

    this.iSedeId = perfil.iSedeId;
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
  }

  ngOnInit(): void {
    this.searchPersonal();

    this.getDocente();
    this.getCargos();
    this.datosEstudiante();

    try {
      this.form = this.fb.group({
        iPersIeId: [0], // PK tabla acad.personal_ies
        iPersId: [{ value: 0, disabled: true }, Validators.required], // FK tabla grl.persona
        iTipoIdentId: [1, Validators.required], // tipo de documento 1:DNI
        cPersDocumento: [null, Validators.required],
        iYAcadId: [this.iYAcadId, Validators.required], // FK tabla acad.year_academico
        iPersCargoId: [null, Validators.required], // FK tabla acad.personal_cargos
        iSedeId: [this.iSedeId, Validators.required], // FK tabla acad.sedes
        iHorasLabora: [0, [Validators.pattern(/^\d+$/), Validators.min(1), Validators.max(40)]],

        dtInicio: [''],
        dtFin: [''],
        cResolucion: [''],
        iCodigoNexus: [],
        cObservacion: [''],
      });
    } catch (error) {
      console.log(error, 'error de variables');
    }
  }

  accionBtnItemTable({ accion, item }) {
    if (accion === 'editar') {
      this.c_accion = accion;
      this.caption = 'Editar cargo a personal';
      //cargar valores
      this.form.get('iPersId')?.setValue(item.iPersId);
      this.form.get('iPersId')?.disable();
      this.form.get('iPersIeId')?.setValue(item.iPersIeId);
      this.form.get('iPersCargoId')?.setValue(item.iPersCargoId);
      this.form.get('iHorasLabora')?.setValue(item.iHorasLabora);

      this.visible = true;
      console.log(item, 'btnTable');
    }
    if (accion === 'agregar') {
      this.c_accion = accion;
      this.form.get('iPersId')?.enable();
      this.caption = 'Asignar cargo a personal';
      this.clearForm();
      this.visible = true;
    }
    if (accion === 'eliminar') {
      this.confirmPersonal(item.iPersIeId);
    }
  }
  accionBtnItem(accion) {
    switch (accion) {
      case 'guardar':
        this.addPersonal();
        this.searchPersonal();
        this.visible = false;
        break;
      case 'editar':
        this.updatePersonal();
        this.searchPersonal();
        this.visible = false;
        break;
    }
  }

  onCargoSeleccionado(event: any): void {
    const id = event.value;
    if (id == 3) {
      // 3 es id de docente
      this.lista = this.docentes;
      this.form.get('iPersId')?.enable();
      this.option = true;
    } else {
      this.lista = this.personas;
      this.form.get('iPersId')?.enable();
      this.option = false;
    }
  }

  // buscarDni() {
  //   const cPersDocumento = String(this.form.get('cPersDocumento')?.value);
  //   this.query
  //     .searchCalendario({
  //       json: JSON.stringify({
  //         cPersDocumento: cPersDocumento,
  //       }),
  //       _opcion: 'getPersona',
  //     })
  //     .subscribe({
  //       next: (data: any) => {
  //         this.persona = data.data;
  //       },
  //       error: error => {
  //         this.messageService.add({
  //           severity: 'error',
  //           summary: 'Mensaje del Sistema',
  //           detail: 'Error al obtener datos del docuemento: ' + error.message,
  //         });
  //       },
  //       complete: () => {
  //         if (this.persona.length > 0) {
  //           this.mensaje = this.persona[0].NombreCompleto;
  //           this.form.patchValue({
  //             iPersId: this.persona[0].iPersId,
  //           });
  //         } else {
  //           this.mensaje = cPersDocumento + ' No cuenta con registro comunicarse con el Administrador';
  //         }
  //       },
  //     });
  // }

  validarPersona() {
    this.mensaje = '';
    const dni = this.form.get('cPersDocumento')?.value;
    this.datosEstudianteService
      .validarPersona({
        iTipoIdentId: this.form.get('iTipoIdentId')?.value,
        cPersDocumento: dni,
      })
      .subscribe({
        next: (data: any) => {
          this.persona = data.data;
          console.log(this.persona, 'persona dni');
          console.log(data, 'id persona dni');
          //this.setFormApoderado(data.data);

          this.messageService.add({
            severity: 'success',
            summary: ':Mensaje del sistema',
            detail: data.message,
          });
        },
        error: (error: HttpErrorResponse) => {
          // mensaje propio del backend
          const backendMsg = error.error?.message;

          this.messageService.add({
            severity: 'error',
            summary: 'mensaje del sistema',
            detail: backendMsg || 'Ocurrió un error en la validación.',
          });

          this.sever = 'error';
          this.mensaje = dni + ' No cuenta con registro comunicarse con el Administrador';
        },
        complete: () => {
          const cPersPaterno = this.persona.cPersPaterno ?? '';
          const cPersMaterno = this.persona.cPersMaterno ?? '';
          const cPersNombre = this.persona.cPersNombre ?? '';
          const nombre_completo = cPersPaterno + ' ' + cPersMaterno + ', ' + cPersNombre;

          this.form.patchValue({
            iPersId: this.persona.iPersId,
          });

          if (nombre_completo.length > 0) {
            this.mensaje = nombre_completo;
            this.sever = 'success';
          } else {
            this.sever = 'error';
            this.mensaje = dni + ' No cuenta con registro comunicarse con el Administrador';
          }
        },
      });
  }

  datosEstudiante() {
    this.datosEstudianteService.getTiposDocumentos().subscribe(data => {
      this.tipos_documentos = data;
    });
  }

  searchPersonal() {
    this.query
      .searchPersonalIes({
        iSedeId: this.iSedeId,
        iYAcadId: this.iYAcadId,
      })
      .subscribe({
        next: (data: any) => {
          this.personal_ies = data.data;
        },
        error: (error: HttpErrorResponse) => {
          // mensaje propio del backend
          const backendMsg = error.error?.message;

          this.messageService.add({
            severity: 'error',
            summary: 'mensaje del sistema',
            detail: backendMsg || 'Ocurrió un error en la validación.',
          });
        },
        complete: () => {
          console.log('Request completed');
          // this.getYearCalendarios(this.formCalendario.value)
        },
      });
  }
  addPersonal() {
    this.query
      .addMaestro({
        esquema: 'acad',
        tabla: 'personal_ies',
        datosJSON: JSON.stringify({
          iPersId: this.form.value.iPersId,
          iYAcadId: this.form.value.iYAcadId,
          iPersCargoId: this.form.value.iPersCargoId,
          iSedeId: this.form.value.iSedeId,
          iHorasLabora: this.form.value.iHorasLabora,
        }),
      })
      .subscribe({
        next: (data: any) => {
          console.log(data, 'agregar personal');
        },
        error: error => {
          console.error('Error fetching Años Académicos:', error);
          this.messageService.add({
            severity: 'danger',
            summary: 'Mensaje',
            detail: 'Error en ejecución',
          });
        },
        complete: () => {
          console.log('Request completed');
        },
      });
  }
  updatePersonal() {
    if (this.form.valid) {
      const params = {
        esquema: 'acad',
        tabla: 'personal_ies',
        json: JSON.stringify({
          iPersCargoId: this.form.value.iPersCargoId,
          iHorasLabora: this.form.value.iHorasLabora,
        }),
        campo: 'iPersIeId',
        condicion: this.form.get('iPersIeId')?.value,
      };

      console.log(params, 'parametros dem uodate');
      this.query.updateAcademico(params).subscribe({
        next: (data: any) => {
          console.log(data.data);
        },
        error: error => {
          console.log(error, 'error al actualizar');
          // if(error && error.message){
          //   //  console.error(error?.message || 'Error en la respuesta del servicio');
          // }
        },
        complete: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Mensaje',
            detail: 'Proceso exitoso',
          });
        },
      });
    } else {
      console.log('Formulario no válido', this.form.invalid);
    }
  }

  confirmPersonal(recordId: number) {
    this._confirmService.openConfirm({
      message: '¿Estás seguro de que deseas eliminar este registro?',
      header: 'Confirmación de eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Acción para eliminar el registro
        this.deletePersonal(recordId);
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
  deletePersonal(id: number) {
    const params = {
      esquema: 'acad',
      tabla: 'personal_ies',
      campo: 'iPersIeId',
      valorId: id,
    };
    this.query.deleteAcademico(params).subscribe({
      next: (data: any) => {
        console.log(data.data);
      },
      error: error => {
        console.error('Error fetching ambiente:', error);
      },
      complete: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Registro eliminado correctamente',
        });
        console.log('Request completed');
        this.searchPersonal();
      },
    });
  }
  clearForm() {
    // limpiar valores
    this.form.get('iPersId')?.setValue(0);
    this.form.get('iPersIeId')?.setValue(0);
    this.form.get('iPersCargoId')?.setValue(0);
    this.form.get('iHorasLabora')?.setValue(0);
  }

  getDocente() {
    this.query
      .searchAmbienteAcademico({
        json: JSON.stringify({
          iDocenteId: 0,
        }),
        _opcion: 'getDocentes',
      })
      .subscribe({
        next: (data: any) => {
          const item = data.data;
          this.docentes = item.map(persona => ({
            ...persona,
            nombre_completo: (
              (persona.cPersDocumento ?? '') +
              ' ' +
              (persona.cPersPaterno ?? '') +
              ' ' +
              (persona.cPersMaterno ?? '') +
              ' ' +
              (persona.cPersNombre ?? '')
            ).trim(),
          }));

          //   console.log(this.seccionesAsignadas,' seccionesAsignadas')
        },
        error: error => {
          console.error('Error fetching  seccionesAsignadas:', error);
        },
        complete: () => {},
      });
  }

  // detalleMaestro(){
  //     const datos= []
  //     this.query.searchTablaXwhere({
  //         Esquema: 'aula',
  //         TablaMaestra: 'foros',
  //         DatosJSONDetalles: JSON.stringify([ { iEstudianteId: 2, iDocenteId : 1},{ iEstudianteId: 24, iDocenteId : 1}]),
  //         TablaDetalle: 'foro_respuestas',
  //         DatosJSONMaestro: JSON.stringify({
  //             "cForoTitulo":datos.cForoTitulo,
  //             "cForoDescripcion": datos.cForoDescripcion,
  //             "iForoCatId": datos.iForoCatId,
  //             "dtForoInicio":new Date(datos.dtForoInicio),
  //             "iEstado":1,
  //             "dtForoPublicacion":new Date(datos.dtForoPublicacion),
  //             "dtForoFin": new Date(datos.dtForoFin),
  //             "cForoUrl": datos.cForoUrl,
  //             "cForoCatDescripcion":datos.cForoCatDescripcionl,
  //             "dtInicio": new Date(datos.dtInicio),
  //             "dtFin": new Date(datos.dtFin)}),
  //         campoFK : 'iForoId'
  //     })
  //     .subscribe({
  //         next: (data: any) => {
  //             this.cargos = data.data

  //             console.log(this.cargos, ' lista de cargos')
  //         },
  //         error: (error) => {
  //             console.error('Error fetching Años Académicos:', error)
  //         }
  //     })
  // }

  getCargos() {
    this.query
      .searchTablaXwhere({
        esquema: 'acad',
        tabla: 'personal_cargos',
        campos: '*',
        condicion: '1 = 1',
      })
      .subscribe({
        next: (data: any) => {
          this.cargos = data.data;

          console.log(this.cargos, ' lista de cargos');
        },
        error: error => {
          console.error('Error fetching Años Académicos:', error);
          this.messageService.add({
            severity: 'danger',
            summary: 'Mensaje',
            detail: 'Error en ejecución',
          });
        },
      });
  }

  //Maquetar tablas
  handleActions(actions) {
    console.log(actions);
  }
  accionesPrincipal: IActionContainer[] = [
    {
      labelTooltip: 'Asignar personal',
      text: 'Asignar personal',
      icon: 'pi pi-plus',
      accion: 'agregar',
      class: 'p-button-primary',
    },
    // {
    //   labelTooltip: 'Clonar personal',
    //   text: 'Clonar personal',
    //   icon: 'pi pi-copy',
    //   accion: 'clonar',
    //   class: 'p-button-warning',
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
      field: 'cPersCargoNombre',
      header: 'Cargo',
      text_header: 'center',
      text: 'center',
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
      width: '10rem',
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
      type: 'actions',
      width: '3rem',
      field: 'actions',
      header: 'Acciones',
      text_header: 'center',
      text: 'center',
    },
  ];
}
