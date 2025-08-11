import { PrimengModule } from '@/app/primeng.module';
import { Component, inject, Input, OnInit } from '@angular/core';
import {
  TablePrimengComponent,
  IColumn,
  IActionTable,
} from '@/app/shared/table-primeng/table-primeng.component';
import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component';
import { MessageService } from 'primeng/api';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { ConstantesService } from '@/app/servicios/constantes.service';
import imagenesRecursos from '@/app/shared/imagenes/recursos';
import { GalleriaModule } from 'primeng/galleria';
import { CapacitacionesService } from '@/app/servicios/cap/capacitaciones.service';
import { environment } from '@/environments/environment';
import { ESPECIALISTA_DREMO } from '@/app/servicios/seg/perfiles';
import { MostrarErrorComponent } from '@/app/shared/components/mostrar-error/mostrar-error.component';
import { NivelPedagogicosService } from '@/app/servicios/cap/nivel-pedagogicos.service';
import { TipoPublicosService } from '@/app/servicios/cap/tipo-publicos.service';
import { ValidacionFormulariosService } from '@/app/servicios/validacion-formularios.service';
import { InstructoresService } from '@/app/servicios/cap/instructores.service';
import { finalize } from 'rxjs';
import { AsignarHorarioCapacitacionComponent } from '../asignar-horario-capacitacion/asignar-horario-capacitacion.component';
import { DatePipe } from '@angular/common';

interface Image {
  id: number;
  url: string;
  title: string;
}

@Component({
  selector: 'app-apertura-curso',
  standalone: true,
  templateUrl: './apertura-curso.component.html',
  styleUrls: ['./apertura-curso.component.scss'],
  imports: [
    PrimengModule,
    ToolbarPrimengComponent,
    TablePrimengComponent,
    GalleriaModule,
    AsignarHorarioCapacitacionComponent,
  ],
  providers: [MessageService],
})
export class AperturaCursoComponent extends MostrarErrorComponent implements OnInit {
  @Input() tipoCapacitacion: any[] = [];

  portada = imagenesRecursos;

  backend = environment.backend;

  private _formBuilder = inject(FormBuilder);
  private _confirmService = inject(ConfirmationModalService);
  private _ConstantesService = inject(ConstantesService);
  private _CapacitacionesService = inject(CapacitacionesService);
  private _NivelPedagogicosService = inject(NivelPedagogicosService);
  private _TipoPublicosService = inject(TipoPublicosService);
  private _ValidacionFormulariosService = inject(ValidacionFormulariosService);
  private _InstructoresService = inject(InstructoresService);

  CAP_EXT = 'CAP-EXT';
  loadingGuardar: boolean = false;

  nivelPedagogico: any[] = [];
  publicoObjetivo: any[] = [];
  cursos: any[] = [];
  showModalHorarios: boolean = false;
  showVistaPrevia: boolean = false;
  instructores: any;
  selectedImageId: any;

  isDisabled: boolean = this._ConstantesService.iPerfilId === ESPECIALISTA_DREMO;

  modoFormulario: 'crear' | 'editar' = 'crear';

  public formNuevaCapacitacion = this._formBuilder.group({
    iCapacitacionId: [''],
    iTipoCapId: ['', Validators.required],
    cCapTitulo: ['', Validators.required],
    iNivelPedId: ['', Validators.required],
    iTipoPubId: ['', Validators.required],
    cCapDescripcion: ['', Validators.required],
    iTotalHrs: ['', Validators.required],
    dFechaInicio: [new Date(), Validators.required],
    dFechaFin: [new Date(), Validators.required],
    iCosto: [0],
    nCosto: [''],
    iInstId: [''], // sin required directo
    cHorario: [''],
    iCantidad: [0],
    cImagenUrl: [''],
    iImageAleatorio: [0],
    cLink: [''],
    jsonHorario: [''],
    iCredId: ['', Validators.required],
  });

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5,
    },
    {
      breakpoint: '768px',
      numVisible: 3,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
    },
  ];

  ngOnInit() {
    this.obtenerNivelPedagogico();
    this.obtenerTipodePublico();
    this.obtenerCapacitaciones();
    this.obtenerInstructoresCurso();

    //
    this.responsiveOptions = [
      {
        breakpoint: '1400px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1,
      },
      {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }
  // mostrar los headr de las tablas
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
      type: 'text',
      width: '8rem',
      field: 'cCapTitulo',
      header: 'Título del curso',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'text',
      width: '2rem',
      field: 'dFechaFin',
      header: 'Fecha Fin',
      text_header: 'center',
      text: 'center',
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

  // mostrar los botones de la tabla
  public accionesTabla: IActionTable[] = [
    {
      labelTooltip: 'Publicar',
      icon: 'pi pi-send',
      accion: 'publicar',
      type: 'item',
      class: 'p-button-rounded p-button-success p-button-text',
      isVisible: row => ['1'].includes(row.iEstado),
    },
    {
      labelTooltip: 'Finalizar',
      icon: 'pi pi-ban',
      accion: 'finalizar',
      type: 'item',
      class: 'p-button-rounded p-button-danger p-button-text',
      isVisible: row => ['2'].includes(row.iEstado),
    },
    {
      labelTooltip: 'Editar',
      icon: 'pi pi-pencil',
      accion: 'editar',
      type: 'item',
      class: 'p-button-rounded p-button-warn p-button-text',
      isVisible: row => ['1', '2'].includes(row.iEstado),
    },
    {
      labelTooltip: 'Eliminar',
      icon: 'pi pi-trash',
      accion: 'eliminar',
      type: 'item',
      class: 'p-button-rounded p-button-danger p-button-text',
      isVisible: row => row.iEstado === '1',
    },
  ];

  datosprevios: any;
  // mostrar modal de visualizacion de una vista previa del curso creado
  showVistaPreviaCurso() {
    this.showVistaPrevia = true;
    this.datosprevios = this.formNuevaCapacitacion.value;
  }

  //
  seleccionarImagen(event: any) {
    const index = event.detail.index; // Acceder al índice correcto
    this.portada[index]; // Obtiene la imagen según el índice
  }

  selectImage(image: any) {
    this.selectedImageId = image.id;

    const data = {
      id: image.id,
      name: image.name,
      url: image.url,
    };
    const jsonData = JSON.stringify(data);
    this.formNuevaCapacitacion.patchValue({
      cImagenUrl: jsonData,
    });
  }

  isSelected(image: Image): boolean {
    return this.selectedImageId === image.id;
  }

  // asignar la accion a los botones de la tabla
  accionBnt({ accion, item }): void {
    switch (accion) {
      case 'editar':
        this.modoFormulario = 'editar';
        const itemFormateado = {
          ...item,
          dFechaInicio: new Date(item.dFechaInicio + 'T00:00:00'),
          dFechaFin: new Date(item.dFechaFin + 'T00:00:00'),
        };
        this.formNuevaCapacitacion.patchValue(itemFormateado);
        this.selectedImageId = item.cImagenUrl ? JSON.parse(item.cImagenUrl).id : null;
        this.capacitacionExterna(item.iTipoCapId);
        break;
      case 'eliminar':
        this.eliminarCapacitacion(item);
        break;
      case 'publicar':
      case 'finalizar':
        item.bEstado = accion === 'publicar' ? false : true;
        this.cambiarEstadoPublicacionCapacitacion(item);
        break;
    }
  }

  // metodo para guardar el curso creado
  enviarFormulario() {
    if (this.loadingGuardar) return; // evitar doble clic
    this.loadingGuardar = true;

    this.formNuevaCapacitacion.patchValue({
      jsonHorario: JSON.stringify(this.dias),
      iCredId: this._ConstantesService.iCredId,
    });

    const nombresCampos: Record<string, string> = {
      iTipoCapId: 'Tipo de capacitación',
      cCapTitulo: 'Título',
      iNivelPedId: 'Nivel pedagógico',
      iTipoPubId: 'Tipo de público',
      cCapDescripcion: 'Descripción',
      iTotalHrs: 'Total de horas',
      dFechaInicio: 'Fecha de inicio',
      dFechaFin: 'Fecha de término',
      iCredId: 'Credencial',
    };

    const { valid, message } = this._ValidacionFormulariosService.validarFormulario(
      this.formNuevaCapacitacion,
      nombresCampos
    );

    if (!valid && message) {
      this.mostrarMensajeToast(message);
      this.loadingGuardar = false;
      return;
    }

    const instId = this.formNuevaCapacitacion.value.iInstId;
    const cLink = this.formNuevaCapacitacion.value.cLink;

    if (this.codCapacitacion === this.CAP_EXT) {
      const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=.]+)?$/i;
      if (!cLink || !urlRegex.test(cLink)) {
        this.mostrarMensajeToast({
          severity: 'error',
          summary: '¡Error!',
          detail: 'Debe ingresar un link válido para la capacitación externa.',
        });
        this.loadingGuardar = false;
        return;
      }
    }

    if (this.codCapacitacion !== this.CAP_EXT && !instId) {
      this.mostrarMensajeToast({
        severity: 'error',
        summary: '¡Error!',
        detail: 'Debe seleccionar un instructor para esta capacitación.',
      });
      this.loadingGuardar = false;
      return;
    }
    this.guardarOActualizarCapacitacion();
  }

  guardarOActualizarCapacitacion() {
    const accion =
      this.modoFormulario === 'editar'
        ? this._CapacitacionesService.actualizarCapacitacion(this.formNuevaCapacitacion.value)
        : this._CapacitacionesService.guardarCapacitacion(this.formNuevaCapacitacion.value);

    accion
      .pipe(
        finalize(() => {
          this.loadingGuardar = false;
          this.formNuevaCapacitacion.reset();
          this.modoFormulario = 'crear';
        })
      )
      .subscribe({
        next: (resp: any) => {
          if (resp.validated) {
            this.mostrarMensajeToast({
              severity: 'success',
              summary: '¡Genial!',
              detail: resp.message,
            });
            this.limpiarFormulario();
            this.obtenerCapacitaciones();
          }
        },
        error: error => this.mostrarErrores(error),
      });
  }

  // eliminar capacitación
  eliminarCapacitacion(item) {
    const titulo = item.cCapTitulo;
    const data = {
      iCapacitacionId: item.iCapacitacionId,
      iCredId: this._ConstantesService.iCredId,
    };
    // alert antes de guardar el curso creado
    this._confirmService.openConfiSave({
      message: 'Recuerde que no podra retroceder',
      header: `¿Esta seguro que desea Eliminar: ${titulo} ?`,
      accept: () => {
        // console.log('Eliminado', data)
        this._CapacitacionesService.eliminarCapacitacion(data).subscribe({
          next: (resp: any) => {
            // Mensaje de guardado(opcional)
            this.messageService.add({
              severity: 'danger',
              summary: 'Eliminado',
              detail: 'Acción éxitosa',
            });
            // para refrescar la pagina
            if (resp?.validated) {
              this.obtenerCapacitaciones();
            }
          },
          error: error => {
            this.mostrarErrores(error);
          },
        });
      },
      reject: () => {
        // Mensaje de cancelación (opcional)
        this.messageService.add({
          severity: 'error',
          summary: 'Cancelado',
          detail: 'Capacitación no Eliminado',
        });
      },
    });
  }

  // cambiar estado (publicar y despublicar) capacitación
  cambiarEstadoPublicacionCapacitacion(item) {
    const titulo = item.cCapTitulo;
    const data = {
      iCapacitacionId: item.iCapacitacionId,
      iCredId: this._ConstantesService.iCredId,
      bEstado: item.bEstado,
    };
    const accion = !item.bEstado ? 'Publicar' : 'Finalizar';
    this._confirmService.openConfiSave({
      message: 'Recuerde que no podra retroceder',
      header: `¿Esta seguro que desea ${accion}: ${titulo} ?`,
      accept: () => {
        // console.log('Eliminado', data)
        this._CapacitacionesService.actualizarEstadoCapacitacion(data).subscribe({
          next: (resp: any) => {
            if (resp?.validated) {
              this.messageService.add({
                severity: 'success',
                summary: '¡Genial!',
                detail: 'Acción éxitosa',
              });
              this.obtenerCapacitaciones();
            }
          },
          error: error => {
            this.mostrarErrores(error);
          },
        });
      },
      reject: () => {
        // Mensaje de cancelación (opcional)
        this.messageService.add({
          severity: 'error',
          summary: 'Cancelado',
          detail: 'Acción cancelado',
        });
      },
    });
  }

  // Obtener el nivel pedagógico:
  obtenerNivelPedagogico() {
    this._NivelPedagogicosService.obtenerNivelPedagogico().subscribe(data => {
      this.nivelPedagogico = data;
    });
  }
  // método para obtener el tipo de publico
  obtenerTipodePublico() {
    this._TipoPublicosService.obtenerTipoPublico().subscribe(data => {
      this.publicoObjetivo = data;
    });
  }

  // obtener las capacitaciones
  obtenerCapacitaciones() {
    const iCredId = this._ConstantesService.iCredId;
    const params = {
      iCredId: iCredId,
    };
    this._CapacitacionesService.obtenerCapacitacion(params).subscribe((resp: any) => {
      this.cursos = resp.data;
    });
  }

  obtenerInstructoresCurso() {
    const iEstado = 1;
    const iCredId = Number(this._ConstantesService.iCredId);
    const data = {
      iEstado: iEstado,
      iCredId: iCredId,
    };

    this._InstructoresService.obtenerIntructores(data).subscribe(Data => {
      this.instructores = Data['data'].map(instructor => ({
        ...instructor, // Mantiene los datos existentes
        nombreLargo: `${instructor.cPersNombre} ${instructor.cPersPaterno} ${instructor.cPersMaterno}`, // Concatenar nombres
      }));
    });
  }

  // metodo para limpiar el formulario
  limpiarFormulario() {
    this.formNuevaCapacitacion.reset();
    this.modoFormulario = 'crear';
    this.codCapacitacion = null;
    setTimeout(() => {
      this.formNuevaCapacitacion.get('dFechaInicio')?.setValue(new Date());
      this.formNuevaCapacitacion.get('dFechaFin')?.setValue(new Date());
    });

    this.formNuevaCapacitacion.markAsPristine();
    this.formNuevaCapacitacion.markAsUntouched();
  }

  codCapacitacion: string;
  capacitacionExterna(data: string) {
    const seleccionado = this.tipoCapacitacion.find(t => t.iTipoCapId === data);
    if (seleccionado) {
      this.codCapacitacion = seleccionado.cTipoCapDesc;
    }
  }
  isValidForm(): boolean {
    const tipoCapId = this.formNuevaCapacitacion.value.iTipoCapId;
    const instId = this.formNuevaCapacitacion.value.iInstId;
    const cLink = this.formNuevaCapacitacion.value.cLink;

    if (!tipoCapId) {
      return false;
    }

    if (tipoCapId && this.codCapacitacion === this.CAP_EXT) {
      const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w-]*)*\/?(\?.*)?(#.*)?$/;
      if (!urlRegex.test(cLink)) return false;

      try {
        new URL(cLink);
        return true;
      } catch (_) {
        return false;
      }
    }
    return !!instId;
  }

  pipe = new DatePipe('es-ES');
  dias = [];
  guardarHorarioCapacitacion(event: any) {
    const diasSeleccionados = event.dias || [];
    this.dias = diasSeleccionados.map(dia => ({
      iDiaId: dia.iDiaId,
      iHoraInicio: dia.iHoraInicio ? this.pipe.transform(dia.iHoraInicio, 'HH:mm') : null,
      iHoraFin: dia.iHoraFin ? this.pipe.transform(dia.iHoraFin, 'HH:mm') : null,
      iHorarioUniforme: dia.iHorarioUniforme ? 1 : 0,
    }));
    this.showModalHorarios = false;
    this.formNuevaCapacitacion.patchValue({
      jsonHorario: JSON.stringify(this.dias),
    });
  }
}
