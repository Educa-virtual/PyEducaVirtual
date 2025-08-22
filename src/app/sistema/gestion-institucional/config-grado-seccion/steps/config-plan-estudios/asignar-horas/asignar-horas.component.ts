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
  grados: any[] = [];
  areas_curriculas: any[] = [];
  perfil: any[] = [];
  configuracion: any[];
  serv_horas: number = 0; // Variable para almacenar las horas del servicio educativo
  total_horas_grado: number = 0; // Variable para almacenar el total de horas del grado
  mensaje: string = '';

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
    this.grados = this.stepService.grados;

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
        iTotalHoras: [0, Validators.required], // Control para "Total de horas semanales"
        cDeclaracionJurada: [false, Validators.requiredTrue],
        iHorasMiniminas: [0], // Control para "Declaración jurada"
        // Control para "Descripcion año"
      });
    } catch (error) {
      //revisar
      this.router.navigate(['/gestion-institucional/configGradoSeccion']);
    }

    this.formFiltrado = this.fb.group({
      iGradoId: [0],
      iServEdId: [0], // Control para "Servicio educativo"
    });
    this.getServicioEducativo();

    setInterval(() => {
      // this.mostrar = true
    }, 3000); // Cambia a true después de 1 segundo
  }

  @HostListener('window:keydown.control.b', ['$event'])
  onCtrlB(event: KeyboardEvent) {
    event.preventDefault(); // Evita acciones predeterminadas del navegador
    this.confirm();
  }

  accionBtnItemTable(event: any) {
    // Aquí puedes manejar el evento de cambio si es necesario
    // const seccionIdSeleccionada = event.value
    if (event.accion === 'editar') {
      this.mostrar = false; // Mostrar el formulario de edición
      // Lógica para editar el grado seleccionado
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
    if (event.accion === 'registrar') {
      const totalHoras = Number(this.formNivelGrado.value.iTotalHoras);
      const iHorasMiniminas = Number(this.formNivelGrado.value.iHorasMiniminas);

      if (totalHoras < iHorasMiniminas) {
        this._confirmService.openConfiSave({
          header: 'Advertencia de procesamiento',
          message: 'Esta ingresando un valor menor a ' + iHorasMiniminas,
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            //Validar documento
            this.messageService.add({
              severity: 'success',
              summary: 'Mensaje de sistema',
              detail: 'Se registro distribución de horas',
            });
          },
          reject: () => {
            // Mensaje de cancelación (opcional)
            this.messageService.add({
              severity: 'error',
              summary: 'Mensaje del sistema ',
              detail: 'Acción cancelada',
            });
          },
        });
      } else {
        this.messageService.add({
          severity: 'success',
          summary: 'Mensaje de sistema',
          detail: 'Se registro distribución de horas',
        });
      }
    } else {
      return;
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
    this.query
      .searchAmbienteAcademico({
        json: JSON.stringify({
          iNivelTipoId: this.configuracion[0].iNivelTipoId,
          iServEdId: this.formFiltrado.value.iServEdId,
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
                mensaje: <number>item.Total > 0 ? 'Grados registrados: ' + item.Total : 'Pendiente',
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
          this.filtrado_programacion_curricular = [];
          this.formFiltrado.patchValue({ iGradoId: 0 }); // Reiniciar el valor del grado al completar la carga
          const filtrado = this.servicio_educativo.filter(
            item => item.iServEdId === this.formFiltrado.value.iServEdId
          );
          this.serv_horas = filtrado[0].iServEdHorasTotal;
        },
      });
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
      const adicional = filtrado.filter(
        item => item.iTipoCursoId === '5' // 5 es el tipo de curso para "Adicional"
      );

      this.hora_adicional = adicional;
      this.serv_horas = Number(this.serv_horas) || 0;

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
      }
    }
  }
  // Aquí puedes ejecutar cualquier lógica
  // eventos de record set
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
      iHorasSemPresencial: this.formNivelGrado.value.iHorasSemPresencial, // iHorasSemPresencial es el valor del campo de horas semanales presenciales
      iHorasSemDomicilio: this.formNivelGrado.value.iHorasSemDomicilio, // iHorasSemDomicilio es el valor del campo de horas semanales domiciliarias
      iTotalHoras: this.formNivelGrado.value.iTotalHoras, // iTotalHoras es el valor del campo de total de horas semanales
      iEstado: 1, // iEstado es el estado del registro (1 para activo)
      iSesionId: this.stepService.iCredId, // iSesionId es el ID de la sesión del usuario
    });

    this._confirmService.openConfiSave({
      header: 'Advertencia del sistema',
      message: 'Desea registrar la distribución de horas?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        //Validar documento
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
                detail: 'Error en en proceso de registro: ' + error.error.message,
              });
            },
            complete: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Mensaje del sistema',
                detail: 'Proceso de registro de horas exitoso',
              });
              this.getCurriculaNivelServicioEducativo();
              this.mostrar = true; // Ocultar el formulario de edición
            },
          });
      },
    });
  }

  selectedItems = [];

  actions: IActionTable[] = [
    {
      labelTooltip: 'Editar',
      icon: 'pi pi-pencil',
      accion: 'editar',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
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
      field: 'cCursoNombre',
      header: 'Área curricular',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '2rem',
      field: 'iHorasSemPresencial',
      header: 'H Presenciales',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '2rem',
      field: 'iHorasSemDomicilio',
      header: 'H Domiciliarias',
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
