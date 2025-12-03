import { PrimengModule } from '@/app/primeng.module';
import { Component, Input, inject, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DatePipe } from '@angular/common';
import { ConstantesService } from '@/app/servicios/constantes.service';
import {
  IActividad,
  VIDEO_CONFERENCIA,
} from '@/app/sistema/aula-virtual/interfaces/actividad.interface';
import { MostrarErrorComponent } from '@/app/shared/components/mostrar-error/mostrar-error.component';
import { ValidacionFormulariosService } from '@/app/servicios/validacion-formularios.service';
import { ReunionVirtualesService } from '@/app/servicios/aula/reunion-virtuales.service';
import { finalize } from 'rxjs';
import { IColumn, TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component';
import { GeneralService } from '@/app/servicios/general.service';

@Component({
  selector: 'app-videoconferencia-form-container',
  standalone: true,
  templateUrl: './videoconferencia-form-container.component.html',
  styleUrls: ['./videoconferencia-form-container.component.scss'],
  imports: [PrimengModule, InputTextModule, InputGroupModule, TablePrimengComponent],
})
export class VideoconferenciaFormContainerComponent
  extends MostrarErrorComponent
  implements OnChanges, OnInit
{
  @Input() contenidoSemana;
  actividad: IActividad | undefined;
  action: string;
  @Input() iProgActId: string;
  @Input() ixActivadadId: string;
  @Input() iActTopId: number;

  pipe = new DatePipe('es-ES');
  date = this.ajustarAHorarioDeMediaHora(new Date());

  private _formBuilder = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
  private dialogConfig = inject(DynamicDialogConfig);
  private _ConstantesService = inject(ConstantesService);
  private _ValidacionFormulariosService = inject(ValidacionFormulariosService);
  private _ReunionVirtualesService = inject(ReunionVirtualesService);
  public query = inject(GeneralService);

  semana: Message[] = [];

  competencias = []; // agregado
  selectedItems = []; // agregado

  public formConferencia = this._formBuilder.group({
    iRVirtualId: [''],
    cRVirtualTema: ['', [Validators.required, Validators.maxLength(250)]],
    dtRVirtualInicio: [this.date, [Validators.required]],
    dtRVirtualFin: [
      new Date(this.ajustarAHorarioDeMediaHora(new Date()).setHours(this.date.getHours() + 1)),
      [Validators.required],
    ],
    cRVirtualUrlJoin: ['', [Validators.required]],

    iContenidoSemId: ['', Validators.required],
    iActTipoId: [0, Validators.required],
    idDocCursoId: [''],
    iCredId: ['', Validators.required],

    iCapacitacionId: [''],
    iYAcadId: ['', Validators.required],
    bCompetencia: [false],
  });

  opcion: string = 'GUARDAR';
  isLoading: boolean = false;

  ngOnInit() {
    this.contenidoSemana = this.dialogConfig.data.contenidoSemana;
    this.action = this.dialogConfig.data.action;
    this.actividad = this.dialogConfig.data.actividad;
    this.buscarCompetencias(this.dialogConfig.data.idDocCursoId);
    const data = this.dialogConfig.data;

    if (this.actividad.ixActivadadId && data.action == 'ACTUALIZAR') {
      this.obtenerReunionVirtualPorId(this.actividad.ixActivadadId);
    }

    this.semana = [
      {
        severity: 'info',
        detail: this.contenidoSemana?.cContenidoSemTitulo,
      },
    ];
  }
  ngOnChanges(changes) {
    if (changes.ixActivadadId?.currentValue) {
      this.ixActivadadId = changes.ixActivadadId.currentValue;
    }
  }

  obtenerReunionVirtualPorId(ixActivadadId) {
    const params = {
      iCredId: this._ConstantesService.iCredId,
    };
    this._ReunionVirtualesService
      .obtenerReunionVirtualxiRVirtualId(ixActivadadId, params)
      .subscribe({
        next: resp => {
          if (resp.validated) {
            const [data] = resp.data;
            this.formConferencia.patchValue({
              iRVirtualId: data.iRVirtualId,
              cRVirtualTema: data.cRVirtualTema,
              dtRVirtualInicio: new Date(data.dtRVirtualInicio),
              dtRVirtualFin: new Date(data.dtRVirtualFin),
              cRVirtualUrlJoin: data.cRVirtualUrlJoin,
            });

            //se agrego validacion de competencias si ya existen
            const idsCompetencias = data.jCompetencias
              ? JSON.parse(data.jCompetencias).map((x: any) => Number(x))
              : [];

            this.selectedItems = this.competencias.filter(x =>
              idsCompetencias.includes(Number(x.iCompetenciaId))
            );
          }
        },
        error: error => {
          this.mostrarErrores(error);
        },
      });
  }

  enviarFormulario() {
    if (this.isLoading) return; // evitar doble clic
    this.isLoading = true;

    this.formConferencia.patchValue({
      iContenidoSemId: this.contenidoSemana?.iContenidoSemId,
      idDocCursoId: this.dialogConfig.data.idDocCursoId,
      iCapacitacionId: this.dialogConfig.data.iCapacitacionId,
      iActTipoId: VIDEO_CONFERENCIA,
      iCredId: this._ConstantesService.iCredId,
      iYAcadId: this._ConstantesService.iYAcadId,
    });

    const nombresCampos: Record<string, string> = {
      cRVirtualTema: 'Título de la tarea',
      dtRVirtualInicio: 'Fecha de inicio',
      dtRVirtualFin: 'Fecha de fin',
      cRVirtualUrlJoin: 'Url de la reunión',
      iContenidoSemId: 'Semana de contenido',
      iActTipoId: 'Tipo de actividad',
      iCredId: 'Credencial',
      iYAcadId: 'Año académico',
    };
    const { valid, message } = this._ValidacionFormulariosService.validarFormulario(
      this.formConferencia,
      nombresCampos
    );

    if (!valid && message) {
      this.mostrarMensajeToast(message);
      this.isLoading = false;
      return;
    }

    const { idDocCursoId, iCapacitacionId } = this.formConferencia.value;

    const soloUnoPresente = Boolean(idDocCursoId) !== Boolean(iCapacitacionId);

    if (!soloUnoPresente) {
      this.mostrarMensajeToast({
        severity: 'error',
        summary: 'Error',
        detail: 'No se encontró el curso',
      });
      this.isLoading = false;
      return;
    }
    const ids = this.selectedItems.map(x => Number(x.iCompetenciaId));

    const data = {
      ...this.formConferencia.value,
      dtRVirtualInicio: this.formConferencia.value.dtRVirtualInicio
        ? this.pipe.transform(this.formConferencia.value.dtRVirtualInicio, 'dd/MM/yyyy HH:mm:ss')
        : null,

      dtRVirtualFin: this.formConferencia.value.dtRVirtualFin
        ? this.pipe.transform(this.formConferencia.value.dtRVirtualFin, 'dd/MM/yyyy HH:mm:ss')
        : null,

      jCompetencias: JSON.stringify(ids),
    };

    if (this.actividad.ixActivadadId) {
      this.actualizarReunionVirtual(data);
    } else {
      this.guardarReunionVirtual(data);
    }
  }

  setSelectedItems(event) {
    this.selectedItems = event;
  }

  guardarReunionVirtual(data) {
    this._ReunionVirtualesService
      .guardarReunionVirtual(data)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: resp => {
          if (resp.validated) {
            this.mostrarMensajeToast({
              severity: 'success',
              summary: '¡Genial!',
              detail: resp.message,
            });
            setTimeout(() => {
              this.closeModal(resp);
            }, 500);
          }
        },
        error: error => {
          this.mostrarErrores(error);
        },
      });
  }

  actualizarReunionVirtual(data) {
    const params = {
      ...data,
      iCredId: this._ConstantesService.iCredId,
    };
    this._ReunionVirtualesService
      .actualizarReunionVirtualxiRVirtualId(this.actividad.ixActivadadId, params)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: resp => {
          if (resp.validated) {
            this.mostrarMensajeToast({
              severity: 'success',
              summary: '¡Genial!',
              detail: resp.message,
            });
            setTimeout(() => {
              this.closeModal(resp);
            }, 500);
          }
        },
        error: error => {
          this.mostrarErrores(error);
        },
      });
  }

  ajustarAHorarioDeMediaHora(fecha) {
    const minutos = fecha.getMinutes(); // Obtener los minutos actuales
    const minutosAjustados = minutos <= 30 ? 30 : 0; // Decidir si ajustar a 30 o 0 (hora siguiente)
    if (minutos > 30) {
      fecha.setHours(fecha.getHours() + 1); // Incrementar la hora si los minutos pasan de 30
    }
    fecha.setMinutes(minutosAjustados); // Ajustar los minutos
    fecha.setSeconds(0); // Opcional: Resetear los segundos a 0
    fecha.setMilliseconds(0); // Opcional: Resetear los milisegundos a 0
    return fecha;
  }

  closeModal(data) {
    this.ref.close(data);
  }
  buscarCompetencias(idDocCursoId: number) {
    this.query
      .searchCalendario({
        json: JSON.stringify({
          idDocCursoId: idDocCursoId,
        }),
        _opcion: 'competenciaXidDocCursoId',
      })
      .subscribe({
        next: (data: any) => {
          this.competencias = data.data;
          this.selectedItems = data.data;
        },
        error: error => {
          this.messageService.add({
            summary: 'Mensaje de sistema',
            detail: 'Error al cargar secciones de IE.' + error.error.message,
            life: 3000,
            severity: 'error',
          });
        },
      });
  }

  columns: IColumn[] = [
    {
      type: 'item',
      width: '5%',
      field: 'item',
      header: 'Item',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '90%',
      field: 'cCompetenciaNombre',
      header: 'Competencia',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'checkbox',
      width: '5%',
      field: 'checked',
      header: '',
      text_header: 'center',
      text: 'center',
    },
  ];
}
