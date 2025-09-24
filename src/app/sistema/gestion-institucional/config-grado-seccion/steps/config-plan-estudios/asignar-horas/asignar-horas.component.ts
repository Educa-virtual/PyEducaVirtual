import { Component, HostListener, inject, OnInit } from '@angular/core';
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component';
import {
  TablePrimengComponent,
  IActionTable,
} from '@/app/shared/table-primeng/table-primeng.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { GeneralService } from '@/app/servicios/general.service';
import { PrimengModule } from '@/app/primeng.module';
import { Router } from '@angular/router';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { AdmStepGradoSeccionService } from '@/app/servicios/adm/adm-step-grado-seccion.service';

@Component({
  selector: 'app-asignar-horas',
  standalone: true,
  imports: [
    ContainerPageComponent,
    TablePrimengComponent,
    ReactiveFormsModule,
    FormsModule,
    PrimengModule,
  ],
  templateUrl: './asignar-horas.component.html',
  styleUrl: './asignar-horas.component.scss',
})
export class AsignarHorasComponent implements OnInit {
  grados: any[] = null;
  areas_curriculas: any[] = [];
  perfil: any[] = [];
  configuracion: any[];
  serv_horas: number = 0; // Variable para almacenar las horas del servicio educativo
  total_horas_grado: number = 0; // Variable para almacenar el total de horas del grado
  mensaje: string = '';
  horaEditar: number = 0;

  programacion_curricular: any[] = [];
  servicio_educativo: any[] = [];
  grados_unicos: any[] = []; // Para almacenar los grados únicos
  mostrar: boolean = true;
  filtrado_programacion_curricular: any[] = []; // Para almacenar la programación curricular filtrada
  hora_adicional: any[] = []; // Para almacenar las horas adicionales
  formFiltrado: FormGroup;
  formNivelGrado: FormGroup;

  private _confirmService = inject(ConfirmationModalService);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    public query: GeneralService,
    private stepService: AdmStepGradoSeccionService
  ) {
    this.perfil = this.stepService.perfil;
    this.configuracion = this.stepService.configuracion;

    //this.secciones_asignadas =// this.stepService.secciones_asignadas
  }

  ngOnInit(): void {
    try {
      this.formNivelGrado = this.fb.group({
        iCursosNivelGradId: [null, Validators.required], // Control para "Grado" (iCursosNivelGradId)
        iIeCursoId: [0], // Control para "Curso" (iIeCursoId)
        cCursoNombre: [{ value: '', disabled: true }, Validators.required], // Control para "Área curricular"
        iHorasSemPresencial: [0, Validators.required], // Control para "Horas semanales presenciales"
        iHorasSemDomicilio: [0, Validators.required],
        iTotalHoras: [{ value: 0 }, Validators.required], // Control para "Total de horas semanales"
        cDeclaracionJurada: [false, Validators.requiredTrue],
        iHorasMiniminas: [0], // Control para "Declaración jurada"
        // Control para "Descripcion año"
      });
    } catch (error) {
      //revisar
      this.router.navigate(['/gestion-institucional/configGradoSeccion']);
    }
    this.getGrados();

    this.formFiltrado = this.fb.group({
      iGradoId: [0],
      iServEdId: [{ value: 0, disabled: true }], // deshabilitado desde el inicio
      iServEdHorasTotal: [0],
    });
    this.getServicioEducativo();
    setInterval(() => {
      // this.mostrar = true
    }, 3000); // Cambia a true después de 1 segundo
    this.getCurriculaNivelServicioEducativo();
  }

  @HostListener('window:keydown.control.b', ['$event'])
  onCtrlB(event: KeyboardEvent) {
    event.preventDefault(); // Evita acciones predeterminadas del navegador
    this.confirm();
  }

  async getGrados() {
    this.grados = this.stepService.grados ?? (await this.stepService.getGrado());
  }
  accionBtnItemTable(event: any) {
    // Aquí puedes manejar el evento de cambio si es necesario
    // const seccionIdSeleccionada = event.value
    if (event.accion === 'editar') {
      this.mostrar = false; // Mostrar el formulario de edición
      // Lógica para editar el grado seleccionado
      this.horaEditar = Number(event.item.iTotalHoras);
      this.formNivelGrado.patchValue({
        iCursosNivelGradId: Number(event.item.iCursosNivelGradId),
        iIeCursoId: Number(event.item.iIeCursoId),
        cCursoNombre: event.item.cCursoNombre,
        iHorasSemPresencial: Number(event.item.iHorasSemPresencial),
        iHorasSemDomicilio: Number(event.item.iHorasSemDomicilio),
        iTotalHoras: Number(event.item.iTotalHoras),
        iHorasMiniminas: Number(event.item.iHorasMiniminas),
      });
    }
    if (event.accion === 'eliminar') {
      this._confirmService.openConfiSave({
        header: 'Advertencia del sistema',
        message: 'Desea eliminar la distribución de horas?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          //Validar documento
          this.query
            .deleteCalAcademico({
              json: JSON.stringify({
                iCursosNivelGradId: Number(event.item.iCursosNivelGradId),
                iIeCursoId: Number(event.item.iIeCursoId),
                iEstado: 0, // Cambiar el estado a 0 para desactivar
                iSesionId: this.stepService.iCredId, // iSesionId es el ID de la sesión del usuario
              }),
              _opcion: 'deleteDistribucionHoras',
            })
            .subscribe({
              error: error => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Mensaje del sistema',
                  detail: 'Error en en proceso de eliminación: ' + error.error.message,
                });
              },
              complete: () => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Mensaje del sistema',
                  detail: 'Proceso de eliminación de horas exitoso',
                });
                //  this.getCurriculaNivelServicioEducativo();
                this.mostrar = true; // Ocultar el formulario de edición

                //Eliminar el registro
                this.programacion_curricular = this.programacion_curricular.filter(
                  item => item.iCursosNivelGradId !== String(event.item.iCursosNivelGradId)
                );
                //Eliminar el registro
                this.filtrado_programacion_curricular =
                  this.filtrado_programacion_curricular.filter(
                    item => item.iCursosNivelGradId !== String(event.item.iCursosNivelGradId)
                  );
              },
            });
        },
      });
    }
  }

  getServicioEducativo() {
    this.query
      .searchAmbienteAcademico({
        json: JSON.stringify({
          iNivelTipoId: this.configuracion[0].iNivelTipoId,
        }),
        _opcion: 'getServicioEducativo',
      })
      .subscribe({
        next: (data: any) => {
          this.servicio_educativo = data.data;
        },

        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del sistema',
            detail: 'Error en carga de servicio educativo: ' + error.error.message,
          });
        },
        complete: () => {
          this.stepService.servicio_educativo = this.servicio_educativo;
        },
      });
  }

  getCurriculaNivelServicioEducativo() {
    this.mensaje = null; //limpiar mensaje
    const val = this.configuracion[0].iServEdId ?? 0;
    this.formFiltrado.get('iServEdId')?.setValue(val);
    this.query
      .searchAmbienteAcademico({
        json: JSON.stringify({
          iNivelTipoId: this.configuracion[0].iNivelTipoId,
          iServEdId: this.configuracion[0].iServEdId,
          iConfigId: this.configuracion[0].iConfigId,
        }),
        _opcion: 'getCurriculaNivelServicioEducativo',
      })
      .subscribe({
        next: (data: any) => {
          this.programacion_curricular = data.data;
          this.messageService.add({
            severity: 'success',
            summary: 'Mensaje del sistema',
            detail: 'Peticion de curricula exitosa ' + data.message,
          });

          this.grados_unicos = data.data.reduce((acc, item) => {
            // Verifica si ya hay un item con ese iGradoId
            const existe = acc.some(obj => obj.iGradoId === item.iGradoId);

            // Si no existe, lo agrega
            if (!existe) {
              // Contar cuántas veces aparece este iGradoId en el JSON original
              //const total = data.data.filter(x => x.iGradoId === item.iGradoId).length;
              acc.push({
                ...item,
                mensaje: <number>item.Total > 0 ? 'Área Curricular: ' + item.Total : 'Pendiente',
              });
            }
            return acc;
          }, []);
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del sistema',
            detail: 'Error en carga de servicio educativo: ' + error.error.message,
          });
        },
        complete: () => {
          this.stepService.programacion_curricular = this.programacion_curricular;
          //Validar si hay menores a las horas mínimas
          this.programacion_curricular = this.programacion_curricular.map(item => {
            if (item.iTotalHoras < item.iHorasMiniminas) {
              return {
                ...item, // mantenemos lo demás igual
                bActive: 0,
                bError: 1, // Actualiza bActive según la condición
              };
            }
            return item;
          });

          this.filtrado_programacion_curricular = [];
          this.formFiltrado.patchValue({ iGradoId: 0 }); // Reiniciar el valor del grado al completar la carga
          const filtrado = this.servicio_educativo.filter(
            item => item.iServEdId === this.configuracion[0].iServEdId
          );
          if (filtrado && filtrado.length > 0) {
            this.serv_horas = Number(filtrado[0].iServEdHorasTotal ?? 0);
          } else {
            this.serv_horas = 0;
          }
        },
      });
  }

  validarHorasMinimas() {
    const totalHoras = parseInt(this.formNivelGrado.value.iTotalHoras);
    const iHorasMiniminas = Number(this.formNivelGrado.value.iHorasMiniminas);

    if (totalHoras < iHorasMiniminas) {
      this._confirmService.openConfirm({
        header: 'Advertencia de procesamiento',
        message: 'Esta ingresando un valor menor a ' + iHorasMiniminas + ' (Horas mínimas)',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.addDistribucionHoras();
        },
      });
    } else {
      this._confirmService.openConfirm({
        header: 'Advertencia de procesamiento',
        message: '¿Desea registar ' + totalHoras + ' (Horas) en el área curricular?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.addDistribucionHoras();
        },
      });
    }
  }
  calcularTotal() {
    const presencial = Number(this.formNivelGrado.get('iHorasSemPresencial')?.value ?? 0);
    const domicilio = Number(this.formNivelGrado.get('iHorasSemDomicilio')?.value ?? 0);
    const suma = presencial + domicilio;

    this.formNivelGrado.get('iTotalHoras')?.setValue(suma);
  }

  getFiltradoGrado() {
    // Obtener el grado seleccionado
    this.mensaje = null; //limpiar mensaje
    const iGradoId = Number(this.formFiltrado.value.iGradoId);

    // Validar si se ha seleccionado un grado
    if (!iGradoId || iGradoId < 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Mensaje del sistema',
        detail: 'Error: No selecciono un Grado válido ',
      });
    } else {
      this.actualizarSumatoria();
    }
  }
  // Aquí puedes ejecutar cualquier lógica
  // eventos de record set
  //calculo de de valores

  confirm() {
    const filtrarGrado = Number(this.formFiltrado.value.iGradoId);
    const curso = Number(this.formNivelGrado.value.cCursoNombre);

    //validar documento
    if (!filtrarGrado || filtrarGrado < 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Cancelado',
        detail: 'No selecciono grado a filtrar',
      });
      return;
    } else {
      const menssage = '¿Estás seguro de que deseas Actualizar las horas de ' + curso + '?';
      this._confirmService.openConfiSave({
        header: 'Advertencia de procesamiento',
        message: menssage,
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          //Validar documento
          this.messageService.add({
            severity: 'error',
            summary: 'Cancelado',
            detail: 'No selecciono el tipo de documento',
          });
        },
      });
      return;
    }
  }
  /*
      getAreaCurricular(){
        this.query
          .get('configuracion/area-curricular')
          .subscribe((resp: any) => {
            this.areas_curriculas = resp.data
          })
      } */

  addDistribucionHoras() {
    const params = JSON.stringify({
      iIeCursoId: this.formNivelGrado.value.iIeCursoId, // iIeCursoId es el ID del curso seleccionado
      iProgId: this.stepService.configuracion[0].iProgId, // iProgId es el ID del grado seleccionado
      iCursosNivelGradId: this.formNivelGrado.value.iCursosNivelGradId, // iCursosNivelGradId es el ID del curso seleccionado
      iConfigId: this.stepService.configuracion[0].iConfigId, // iConfigId es el ID de la configuración
      iHorasSemPresencial: Number(this.formNivelGrado.value.iHorasSemPresencial) ?? 0, // iHorasSemPresencial es el valor del campo de horas semanales presenciales
      iHorasSemDomicilio: Number(this.formNivelGrado.value.iHorasSemDomicilio) ?? 0, // iHorasSemDomicilio es el valor del campo de horas semanales domiciliarias
      iTotalHoras: Number(this.formNivelGrado.value.iTotalHoras) ?? 0, // iTotalHoras es el valor del campo de total de horas semanales
      iEstado: 1, // iEstado es el estado del registro (1 para activo)
      iSesionId: this.stepService.iCredId, // iSesionId es el ID de la sesión del usuario
    });

    //validar sumatoria de horas
    const limiteHora = Number(this.formNivelGrado.value.iTotalHoras) ?? 0;
    const sumatoria = Number(this.total_horas_grado) + Number(limiteHora) - this.horaEditar;

    if (sumatoria > Number(this.serv_horas)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Mensaje de sistema',
        detail:
          'La distribución de horas del grado ' +
          (Number(this.total_horas_grado) + Number(limiteHora)) +
          'Hras sobrepasa las totales horas del servicio educativo ' +
          this.serv_horas +
          ' Hras',
      });
      return;
    }
    //continua el procesamiento
    this.query
      .addAmbienteAcademico({
        json: params,
        _opcion: 'addDistribucionHoras',
      })
      .subscribe({
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del sistema',
            detail: 'Error en el proceso de registro: ' + (error.error?.message ?? error.message),
          });
        },
        complete: () => {
          this.actualizarRegistros();

          this.messageService.add({
            severity: 'success',
            summary: 'Mensaje del sistema',
            detail: 'Proceso de registro de horas exitoso',
          });
          this.mostrar = true; // Ocultar el formulario de edición
          this.actualizarSumatoria();
        },
      });
  }
  actualizarSumatoria() {
    const iGradoId = Number(this.formFiltrado.value.iGradoId);
    const filtrado = this.programacion_curricular.filter(
      item => item.iGradoId === String(iGradoId)
    );
    this.filtrado_programacion_curricular = filtrado;
    //suma los tosales
    let sumatoria = 0;
    filtrado.forEach(item => {
      sumatoria += Number(item.iTotalHoras || 0);
    });

    this.total_horas_grado = sumatoria;

    if (Number(sumatoria) !== Number(this.serv_horas)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Mensaje de sistema',
        detail:
          'La distribución de horas del grado ' +
          sumatoria +
          'Hras no coinciden los totales horas del servicio educativo ' +
          this.serv_horas +
          ' Hras',
      });
      this.mensaje =
        'Observación: Total de horas semanales ' +
        sumatoria +
        'Hras, diferentes al servicio educativo ' +
        +this.serv_horas +
        ' Hras';
    } else {
      this.mensaje = null;
    }
  }
  actualizarRegistros() {
    const iCursosNivelGradId = this.formNivelGrado.value.iCursosNivelGradId;
    const iHorasSemPresencial = Number(this.formNivelGrado.value.iHorasSemPresencial) ?? 0;
    const iHorasSemDomicilio = Number(this.formNivelGrado.value.iHorasSemDomicilio) ?? 0;
    const iHorasMiniminas = Number(this.formNivelGrado.value.iHorasMiniminas) ?? 0;
    const iTotalHoras = Number(this.formNivelGrado.value.iTotalHoras) ?? 0;
    const cumpleCondicion = iHorasMiniminas > 0 && iTotalHoras >= iHorasMiniminas;
    this.programacion_curricular = this.programacion_curricular.map(item => {
      if (item.iCursosNivelGradId === String(iCursosNivelGradId)) {
        return {
          ...item, // mantenemos lo demás igual
          iHorasSemPresencial: iHorasSemPresencial,
          iHorasSemDomicilio: iHorasSemDomicilio,
          iTotalHoras: iTotalHoras,
          bActive: cumpleCondicion ? 1 : 0,
          bError: cumpleCondicion ? 0 : 1, // Actualiza bActive según la condición
        };
      }
      return item;
    });

    this.filtrado_programacion_curricular = this.filtrado_programacion_curricular.map(item => {
      if (item.iCursosNivelGradId === String(iCursosNivelGradId)) {
        return {
          ...item, // mantenemos lo demás igual
          iHorasSemPresencial: iHorasSemPresencial,
          iHorasSemDomicilio: iHorasSemDomicilio,
          iTotalHoras: iTotalHoras,
          bActive: cumpleCondicion ? 1 : 0, // Actualiza bActive según la condición
          bError: cumpleCondicion ? 0 : 1,
        };
      }
      return item;
    });
  }

  cerrarEditar() {
    this.mostrar = true;
  }

  selectedItems = [];

  actions: IActionTable[] = [
    {
      labelTooltip: 'Editar',
      icon: 'pi pi-pencil',
      accion: 'editar',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
      // isVisible: rowData => {
      //   return Number(rowData.bActive) === 1 || Number(rowData.bError) === 1;
      // },
    },
    {
      labelTooltip: 'Eliminar',
      icon: 'pi pi-trash',
      accion: 'eliminar',
      type: 'item',
      class: 'p-button-rounded p-button-danger p-button-text',
      isVisible: rowData => {
        return Number(rowData.bActive) === 0 && Number(rowData.bError) != 1;
      },
    },
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
      field: 'cCursoNombre',
      header: 'Área curricular',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '2rem',
      field: 'iHorasMiniminas',
      header: 'H min',
      text_header: 'center',
      text: 'center',
    },

    {
      type: 'text',
      width: '2rem',
      field: 'iHorasSemPresencial',
      header: 'H Pres',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '2rem',
      field: 'iHorasSemDomicilio',
      header: 'H Dom',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '2rem',
      field: 'iTotalHoras',
      header: 'H Total',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '2rem',
      field: 'cGradoAbreviacion',
      header: 'Grado',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'estado-activo',
      width: '2rem',
      field: 'iEstado',
      header: 'Estado',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'estado-activo',
      width: '2rem',
      field: 'bActive',
      header: 'Verificado',
      text_header: 'center',
      text: 'center',
    },

    {
      type: 'actions',
      width: '2rem',
      field: 'actions',
      header: 'Acciones',
      text_header: 'center',
      text: 'center',
    },
  ];
}
