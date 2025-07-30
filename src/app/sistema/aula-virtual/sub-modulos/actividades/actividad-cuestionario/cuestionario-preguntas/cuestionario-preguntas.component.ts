import { PrimengModule } from '@/app/primeng.module';
import { Component, inject, Input, OnInit } from '@angular/core';
import { TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { MenuItem, MessageService } from 'primeng/api';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { NoDataComponent } from '@/app/shared/no-data/no-data.component';
import { CuestionarioFormPreguntasComponent } from '../cuestionario-form-preguntas/cuestionario-form-preguntas.component';
import { GeneralService } from '@/app/servicios/general.service';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { DOCENTE, ESTUDIANTE } from '@/app/servicios/perfilesConstantes';
import { TipoPreguntasService } from '@/app/servicios/enc/actividad-tipos.service';

@Component({
  selector: 'app-cuestionario-preguntas',
  standalone: true,
  templateUrl: './cuestionario-preguntas.component.html',
  styleUrls: ['./cuestionario-preguntas.component.scss'],
  imports: [PrimengModule, NoDataComponent, CuestionarioFormPreguntasComponent],
  providers: [{ provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }],
})
export class CuestionarioPreguntasComponent implements OnInit {
  @Input() datosGenerales: any;

  private _constantesService = inject(ConstantesService);
  private GeneralService = inject(GeneralService);
  private _confirmService = inject(ConfirmationModalService);
  private messageService = inject(MessageService);

  private _TipoPreguntasService = inject(TipoPreguntasService);

  public DOCENTE = DOCENTE;
  public ESTUDIANTE = ESTUDIANTE;

  preguntas: any[] = [];
  showModal: boolean = false;
  titulo: string = '';
  opcion: string = '';
  codigoTipoPregunta: string = '';
  selectedOption!: number;
  selectedDropdown!: number;

  datosPreguntas: any;
  datos: any;
  params: any; // variable para enviar datos para actualizar
  iEstado: number | string;
  iPerfilId: number;

  tiposAgregarPregunta: MenuItem[] = [
    {
      label: 'Nueva pregunta',
      icon: 'pi pi-plus',
      command: () => {
        this.showModal = true;
        this.titulo = 'Nueva pregunta';
        this.opcion = 'GUARDAR';
      },
    },
    // {
    //     label: 'Importar preguntas',
    //     icon: 'pi pi-plus',
    //     command: () => {
    //         //
    //     },
    // },
  ];

  ngOnInit(): void {
    this.obtenerCuestionario();
    this.datos = this.datosGenerales;
    this.obtenerTipoPreguntas();
    this.iEstado = Number(this.datosGenerales.iEstado);
    this.iPerfilId = this._constantesService.iPerfilId;
  }

  tipoPreguntas: any[] = [];
  data: any[] = [];

  loading: boolean = false;

  esBotonDeshabilitado(): boolean {
    return this.iEstado! == 10 || this.iEstado === '2';
  }

  guardarPregunta(data: any) {
    const datos = {
      iCuestionarioId: this.datosGenerales.iCuestionarioId,
      iTipoPregId: data.iTipoPregId,
      cPregunta: data.cPregunta,
      jsonAlternativas: data.jsonAlternativas,
      iCredId: this._constantesService.iCredId,
    };
    const params = {
      petition: 'post',
      group: 'aula-virtual',
      prefix: 'preguntas',
      data: datos,
      params: {
        iCredId: this._constantesService.iCredId,
      },
    };
    // // Servicio para obtener los instructores
    this.GeneralService.getGralPrefixx(params).subscribe({
      next: response => {
        if (response.validated) {
          this.messageService.add({
            severity: 'success',
            summary: 'Acción exitosa',
            detail: response.message,
          });
          this.showModal = false;
          this.obtenerCuestionario();
          // this.instructorForm.reset()
        }
      },
      error: error => {
        const errores = error?.error?.errors;
        if (error.status === 422 && errores) {
          // Recorre y muestra cada mensaje de error
          Object.keys(errores).forEach(campo => {
            errores[campo].forEach((mensaje: string) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error de validación',
                detail: mensaje,
              });
            });
          });
        } else {
          // Error genérico si no hay errores específicos
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.message || 'Ocurrió un error inesperado',
          });
        }
      },
    });
  }

  actualizarPregunta(data: any) {
    const datos = {
      iCuestionarioId: this.datosGenerales.iCuestionarioId,
      iTipoPregId: data.iTipoPregId,
      cPregunta: data.cPregunta,
      jsonAlternativas: data.jsonAlternativas,
      iCredId: this._constantesService.iCredId,
    };
    const params = {
      petition: 'put',
      group: 'aula-virtual',
      prefix: 'preguntas',
      ruta: data.iPregId,
      data: datos,
      params: {
        iCredId: this._constantesService.iCredId,
      },
    };
    // // Servicio para obtener los instructores
    this.GeneralService.getGralPrefixx(params).subscribe({
      next: response => {
        if (response.validated) {
          this.messageService.add({
            severity: 'success',
            summary: 'Acción exitosa',
            detail: response.message,
          });
          this.showModal = false;
          this.obtenerCuestionario();
          // this.instructorForm.reset()
        }
      },
      error: error => {
        const errores = error?.error?.errors;
        if (error.status === 422 && errores) {
          // Recorre y muestra cada mensaje de error
          Object.keys(errores).forEach(campo => {
            errores[campo].forEach((mensaje: string) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error de validación',
                detail: mensaje,
              });
            });
          });
        } else {
          // Error genérico si no hay errores específicos
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.message || 'Ocurrió un error inesperado',
          });
        }
      },
    });
  }
  accionBtnItem(elemento): void {
    const { accion } = elemento;
    const { item } = elemento;

    switch (accion) {
      case 'close-modal':
        this.showModal = false;
        break;
      case 'ACTUALIZAR':
        this.titulo = 'Editar pregunta';
        this.opcion = accion;
        this.params = item;
        this.showModal = true;
        break;
    }
  }
  formpreguntas: any;
  obtenerCuestionario() {
    const params = {
      petition: 'get',
      group: 'aula-virtual',
      prefix: 'preguntas',
      ruta: `cuestionario/${this.datosGenerales.iCuestionarioId}`,
      params: {
        iCredId: this._constantesService.iCredId,
      },
    };

    // Servicio para obtener los instructores
    this.GeneralService.getGralPrefixx(params).subscribe(Data => {
      this.data = (Data as any)['data'];
      this.data = this.data.map(Data => {
        return {
          ...Data,
          jsonAlternativas: JSON.parse(Data.jsonAlternativas),
        };
      });
    });
  }

  eliminarPregunta(data: any) {
    this._confirmService.openConfirm({
      header: '¿Eliminar pregunta:  ' + data.cPregunta + '?',
      accept: () => {
        const params = {
          petition: 'delete',
          group: 'aula-virtual',
          prefix: 'preguntas',
          ruta: data.iPregId,
          params: {
            iCredId: this._constantesService.iCredId,
          },
        };
        // Servicio para obtener los instructores
        this.GeneralService.getGralPrefixx(params).subscribe({
          next: resp => {
            if (resp.validated) {
              this.messageService.add({
                severity: 'success',
                summary: 'Acción exitosa',
                detail: resp.message,
              });
              this.obtenerCuestionario();
            }
          },
        });
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
  tipopregunta: any;
  obtenerTipoPreguntas() {
    this._TipoPreguntasService.obtenerTipoPreguntas().subscribe({
      next: tipoPreguntas => {
        this.tipoPreguntas = tipoPreguntas || [];
      },
    });
  }
}
