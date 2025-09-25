import { Component, inject, OnInit } from '@angular/core';
import { GeneralService } from '@/app/servicios/general.service';
import { PrimengModule } from '@/app/primeng.module';

import { ConfHorariosComponent } from '@/app/shared/horario/conf-horario.component';
import { ToolbarPrimengComponent } from '../../../../shared/toolbar-primeng/toolbar-primeng.component';
import { ConstantesService } from '@/app/servicios/constantes.service';
import {
  IActionTable,
  TablePrimengComponent,
} from '../../../../shared/table-primeng/table-primeng.component';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { MostrarErrorComponent } from '@/app/shared/components/mostrar-error/mostrar-error.component';
interface Curso {
  iCursoId: number;
  cCursoNombre: string;
  nombre_completo: string;
  nombre_corto: string;
  nCursoTotalHoras: number;
  iDocHoraAsignada: number;
  horario: any;
}

@Component({
  selector: 'app-configuracion-horario',
  standalone: true,
  templateUrl: './configuracion-horario.component.html',
  styleUrls: ['./configuracion-horario.component.scss'],
  imports: [PrimengModule, ConfHorariosComponent, ToolbarPrimengComponent, TablePrimengComponent],
})
export class ConfiguracionHorarioComponent extends MostrarErrorComponent implements OnInit {
  gradosSecciones: any[] = [];
  grados: any[] = [];
  secciones: any[] = [];
  iGradoId: string = '';
  iSeccionId: string = '';

  cursos: Curso[] = [];
  dias: any = [];
  bloques: number = 0;
  horarios: any = [];
  horario: number;

  lista_horas: any = [];
  vbloques: boolean = false;

  displayDialog: boolean = false;
  titulo: string = '';
  formDistribucion: FormGroup;
  iSedeId: number;
  dremoYear: number;
  dremoiYAcadId: number;
  iCredId: number;
  horario_ies: any[] = []; // Variable para almacenar los horarios obtenidos de la base de datos
  conf_bloques: any[] = []; // Variable para almacenar los bloques de configuración obtenidos de la base de datos
  conf_detalle_bloques: any[] = []; // Variable para almacenar los detalles de los bloques de configuración obtenidos de la base de datos
  filtrar_grado: any = [];
  accionBtn(elemento): void {
    const { accion } = elemento;
    const { item } = elemento;
    switch (accion) {
      case 'agregar-horario':
      case 'remover-horario':
        this.guardarRemoverCursosDiasHorarios(item);
        break;
      default:
        break;
    }
  }

  private _GeneralService = inject(GeneralService);
  private _ConstantesService = inject(ConstantesService);
  private _confirmService = inject(ConfirmationModalService);
  private fb = inject(FormBuilder);
  private store = inject(LocalStoreService);

  async ngOnInit() {
    const perfil = this.store.getItem('dremoPerfil');

    this.iSedeId = perfil.iSedeId;
    this.dremoYear = this.store.getItem('dremoYear');
    this.dremoiYAcadId = this.store.getItem('dremoiYAcadId');
    this.iCredId = perfil.iCredId;

    this.obtenerGradoSeccion();
    this.getHorarios_ies();
    this.getConfBloques();
    this.formDistribucion = this.fb.group({
      iGradoId: [null, Validators.required],
      iSeccionId: [{ value: null, disabled: true }, Validators.required],
      iConfBloqueId: [null, Validators.required],
    });
  }

  obtenerGradoSeccion() {
    this._GeneralService
      .searchCalendario({
        json: JSON.stringify({
          iSedeId: this._ConstantesService.iSedeId,
          iYAcadId: this._ConstantesService.iYAcadId,
        }),
        _opcion: 'getGradoSeccionXiSedeIdXiYAcadId',
      })
      .subscribe({
        next: (data: any) => {
          this.gradosSecciones = data.data;
          this.grados = this.removeDuplicatesByiGradoId(this.gradosSecciones);
        },
        error: error => {
          console.error('Error fetching Servicios de Atención:', error);
        },
      });
  }

  obtenerSecciones() {
    this.secciones = this.gradosSecciones.filter(item => item.iGradoId === this.iGradoId);
  }

  accionBtnItemTable(elemento): void {
    const { accion, item } = elemento;
    this.horarios = item;

    this.titulo = 'Distribucion de horarios Grado: ' + item.cGradoNombre;
    this.formDistribucion.get('iGradoId')?.setValue(item.iGradoId);
    this.formDistribucion.get('iSeccionId')?.setValue(item.iSeccionId);
    this.formDistribucion.get('iConfBloqueId')?.setValue(item.iConfBloqueId);
    this.iGradoId = item.iGradoId;
    this.iSeccionId = item.iSeccionId;

    switch (accion) {
      case 'bloques':
        this.displayDialog = true;
        this.vbloques = true;

        if (Array.isArray(this.horarios)) {
          const horarioItem = this.horarios[0] as {
            iHorarioIeId: number;
          };
          if (this.horarios.length > 0 && horarioItem?.iHorarioIeId) {
            this.horario = horarioItem.iHorarioIeId;
            this.getHorasAsignadas(horarioItem.iHorarioIeId);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Mensaje del Sistema',
              detail: 'Error el horario asignado es invalido',
            });
            //   console.error('Horario array is empty or missing iHorarioIeId:', this.horario);
          }
        } else if ((this.horarios as any)?.iHorarioIeId) {
          this.horario = (this.horarios as any).iHorarioIeId;
          this.getHorasAsignadas((this.horarios as any).iHorarioIeId);
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Mensaje del Sistema',
            detail: 'Horario pendiente de asignación',
          });
          //console.error('Invalid horario structure:', this.horario);
        }

        this._confirmService.openAlert({
          header: 'Advertencia ',
          message:
            'Este proceso calcula los días laborables excluyendo los feriados calendarios y fechas especiales',
          icon: 'pi pi-exclamation-triangle',
        });

        break;
      case 'editar':
        this.vbloques = false;
        this.displayDialog = true;

        this.getConfDetalleBloques();

        break;
      default:
        break;
    }
  }

  configurarHorario() {
    this.titulo = 'Distribución de horarios Grado:' + this.secciones[0].cGradoNombre;
    this.formDistribucion.get('iGradoId')?.setValue(this.iGradoId);
    this.displayDialog = true;
    //Filtrar grados
    this.filtrarGradoHorario();
    // this.filtrar_grado = this.horario_ies.filter(
    //     (item) =>
    //         item.iGradoId === this.formDistribucion.get('iGradoId')?.value
    // )
  }

  actualizarHoras() {
    if (!this.horario) {
      this.messageService.add({
        severity: 'error',
        summary: 'Mensaje del Sistema',
        detail: 'Error al asignar fechas al calendario: Horario no válido',
      });
      return;
    }

    this._GeneralService
      .updateCalAcademico({
        json: JSON.stringify({
          iHorarioIeId: this.horario,
        }),
        _opcion: 'updBloqueHorario',
      })
      .subscribe({
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del Sistema',
            detail: 'Error al asignar horas a los bloques: ' + error.message,
          });
        },
        complete: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Mensaje del Sistema',
            detail: 'Se actualizaron los registros del bloque correctamente',
          });
          this.getHorasAsignadas(this.horario);
        },
      });
  }

  actualizarCalendario() {
    if (!this.horario) {
      this.messageService.add({
        severity: 'error',
        summary: 'Mensaje del Sistema',
        detail: 'Error al asignar fechas al calendario: Horario no válido',
      });
      return;
    }
    this._GeneralService
      .updateCalAcademico({
        json: JSON.stringify({
          iHorarioIeId: this.horario,
          iSesionId: this.iCredId,
        }),
        _opcion: 'updFechasHorario',
      })
      .subscribe({
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del Sistema',
            detail: 'Error al asignar fechas al calendario: ' + error.message,
          });
        },
        complete: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Mensaje del Sistema',
            detail: 'Se actualizaron los registros del bloque correctamente',
          });
        },
      });
  }

  guardarHorario() {
    //const formValue = this.formDistribucion.value
    const iConfBloqueId = this.formDistribucion.get('iConfBloqueId')?.value;

    const confHorario = this.conf_bloques.find(item => item.iConfBloqueId === iConfBloqueId);

    const params = JSON.stringify({
      iSedeId: this.iSedeId,
      iYAcadId: this.dremoiYAcadId,
      iGradoId: this.formDistribucion.get('iGradoId')?.value,
      iSeccionId: this.formDistribucion.get('iSeccionId')?.value,
      tHoraInicio: confHorario.tInicio,
      tHoraFin: confHorario.tFin,
      iIntervalo: confHorario.iBloqueInter,
      iConfBloqueId: iConfBloqueId,
      iEstado: 1,
    });

    this._GeneralService
      .addCalAcademico({
        json: params,
        _opcion: 'addHorarioIes',
      })
      .subscribe({
        next: (data: any) => {
          this.horario_ies = data.data;
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del Sistema',
            detail: 'Error al procesar la peticion:: ' + error.message,
          });
        },
        complete: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Mensaje del Sistema',
            detail: 'Se cargaron los registros del horario correctamente',
          });
          this.getHorarios_ies();
          this.configurarHorario();
          this.formDistribucion.get('iGradoId')?.setValue(this.iGradoId);
        },
      });
  }

  getConfBloques() {
    this._GeneralService
      .searchCalAcademico({
        esquema: 'hor',
        tabla: 'configuracion_bloques',
        campos: '*',
        condicion: 'iEstado=1',
      })
      .subscribe({
        next: (data: any) => {
          this.conf_bloques = data.data;
        },
        error: error => {
          this.mostrarErrores(error);
          // this.messageService.add({
          //   severity: 'error',
          //   summary: 'Mensaje del Sistema',
          //   detail: 'Error al cargar los datos del horario: ' + error.message,
          // });
        },
      });
  }

  getConfDetalleBloques() {
    const iConfBloqueId = this.formDistribucion.get('iConfBloqueId')?.value;
    this._GeneralService
      .searchCalAcademico({
        esquema: 'hor',
        tabla: 'detalle_bloques',
        campos: '*',
        condicion: 'iConfBloqueId=' + iConfBloqueId,
      })
      .subscribe({
        next: (data: any) => {
          this.conf_detalle_bloques = data.data;
        },
        error: error => {
          // this.messageService.add({
          //   severity: 'error',
          //   summary: 'Mensaje del Sistema',
          //   detail: 'Error al cargar los datos del horario: ' + error.message,
          // });
          this.mostrarErrores(error);
        },
      });
  }

  getHorarios_ies() {
    this._GeneralService
      .searchCalendario({
        json: JSON.stringify({
          iSedeId: this.iSedeId,
          iYAcadId: this.dremoiYAcadId,
        }),
        _opcion: 'getHorarios_ies',
      })
      .subscribe({
        next: (data: any) => {
          this.horario_ies = data.data;
        },

        error: error => {
          // this.messageService.add({
          //   severity: 'error',
          //   summary: 'Mensaje del Sistema',
          //   detail: 'Error al cargar los datos del horario: ' + error.message,
          // });
          this.mostrarErrores(error);
        },
        complete: () => {
          this.horario_ies = this.horario_ies.map(item => ({
            ...item,
            tHoraInicio: item.tHoraInicio ? String(item.tHoraInicio) : '',
            tHoraFin: item.tHoraFin ? String(item.tHoraFin) : '',
          }));

          if (Number(this.iGradoId) > 0) {
            this.filtrarGradoHorario();
          }

          this.messageService.add({
            severity: 'success',
            summary: 'Mensaje del Sistema',
            detail: 'Se cargaron los registros del horario correctamente',
          });
        },
      });
  }

  filtrarGradoHorario() {
    this.filtrar_grado = this.horario_ies.filter(
      item => item.iGradoId === this.formDistribucion.get('iGradoId')?.value
    );

    this.iGradoId = this.formDistribucion.get('iGradoId')?.value;
    this.iSeccionId = null;
    this.formDistribucion.get('iSeccionId')?.setValue(null);

    // this.iSeccionId = this.formDistribucion.get('iSeccionId')?.value
  }
  //consulta la lista de horas asignadas
  getHorasAsignadas(iHorarioId: number) {
    this._GeneralService
      .searchCalendario({
        json: JSON.stringify({
          iHorarioIeId: iHorarioId,
        }),
        _opcion: 'getBloqueHorario',
      })
      .subscribe({
        next: (data: any) => {
          this.lista_horas = data.data;
        },
        error: error => {
          this.mostrarErrores(error);
          // this.messageService.add({
          //   severity: 'error',
          //   summary: 'Mensaje del Sistema',
          //   detail: 'Error al cargar los datos de distribucion de bloques: ' + error.message,
          // });
        },
        complete: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Mensaje del Sistema',
            detail: 'Carga exitosa de distribución de horas',
          });
        },
      });
  }
  //metodo para obtener todos los grados y secciones de la IE
  obtenerCursosxiGradoIdxiSeccionId() {
    const data = {
      iSedeId: this._ConstantesService.iSedeId,
      iYAcadId: this._ConstantesService.iYAcadId,
      iGradoId: this.iGradoId,
      iSeccionId: this.iSeccionId,
    };
    this._GeneralService.obtenerCursosDiasHorarios(data).subscribe({
      next: (data: any) => {
        const horarioIe = data.data;
        if (horarioIe.length > 0) {
          this.cursos = horarioIe[0]['cursos'] ? JSON.parse(horarioIe[0]['cursos']) : [];

          this.dias = horarioIe[0]['dias'] ? JSON.parse(horarioIe[0]['dias']) : [];
          this.horarios = horarioIe[0]['horarios'] ? JSON.parse(horarioIe[0]['horarios']) : [];
          this.bloques = horarioIe[0]['iTotalBloques'];
        }
      },
      error: error => {
        this.mostrarErrores(error);
      },
    });
  }

  asignarHoras() {
    const num = this.lista_horas.length;

    this._confirmService.openConfiSave({
      message: 'La I.E. contiene ' + num + ' registros. ¿Desea procesar?',
      header: 'Advertencia de Procesamiento',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Mensaje del sistema',
          detail: 'Se procesó petición',
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Cancelado',
          detail: 'Acción cancelada',
        });
      },
    });
  }

  //this.btnInvalido = true

  removeDuplicatesByiGradoId(array: any[]): any[] {
    const seen = new Set<number>();
    return array.filter(item => {
      if (seen.has(item.iGradoId)) {
        return false;
      }
      seen.add(item.iGradoId);
      return true;
    });
  }

  guardarRemoverCursosDiasHorarios(item) {
    this._GeneralService.guardarRemoverCursosDiasHorarios(item).subscribe({
      next: (data: any) => {
        if (data.validated) {
          this.obtenerCursosxiGradoIdxiSeccionId();
        }
      },
      error: error => {
        this.mostrarErrores(error);
      },
    });
  }

  selectedItems = [];
  actions: IActionTable[] = [
    {
      labelTooltip: 'Calendario',
      icon: 'pi pi-calendar-plus',
      accion: 'bloques',
      type: 'item',
      class: 'p-button-rounded p-button-primary p-button-text',
      /*  isVisible: (rowData) => {
                return rowData.iEstado === '1' // Mostrar solo si el estado es 1 (activo)
            },*/
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
      width: '3rem',
      field: 'cGradoNombre',
      header: 'Grado',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '3rem',
      field: 'cSeccionNombre',
      header: 'Sección',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'time',
      width: '3rem',
      field: 'tHoraInicio',
      header: 'Inicio',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'time',
      width: '3rem',
      field: 'tHoraFin',
      header: 'Fin',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '3rem',
      field: 'cHorario',
      header: 'Horario',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '3rem',
      field: 'cEstado',
      header: 'Estado',
      text_header: 'center',
      text: 'center',
    },

    // {
    //     type: 'estado-activo',
    //     width: '5rem',
    //     field: 'iEstado',
    //     header: 'Activo',
    //     text_header: 'center',
    //     text: 'center',
    // },

    {
      type: 'actions',
      width: '3rem',
      field: 'actions',
      header: 'Acciones',
      text_header: 'center',
      text: 'center',
    },
  ];

  columnsDetalle = [
    {
      type: 'item',
      width: '1rem',
      field: 'item',
      header: 'N°',
      text_header: 'center',
      text: 'center',
    },

    {
      type: 'time',
      width: '5rem',
      field: 'tBloqueInicio',
      header: 'Inicio de Bloque',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'time',
      width: '5rem',
      field: 'tBloqueFin',
      header: 'Fin de Bloque',
      text_header: 'center',
      text: 'center',
    },
  ];
  columnsBloque = [
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
      width: '2rem',
      field: 'iBloque',
      header: 'Bloque',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '3rem',
      field: 'cDiaNombre',
      header: 'Dia',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '3rem',
      field: 'cCursoNombre',
      header: 'Dia',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'time',
      width: '3rem',
      field: 'tHoraInicio',
      header: 'inicio',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'time',
      width: '3rem',
      field: 'tHoraFin',
      header: 'fin',
      text_header: 'center',
      text: 'center',
    },
  ];
}
