import { Component, OnInit, Input, inject, OnChanges, SimpleChanges } from '@angular/core';
import {
  TablePrimengComponent,
  IColumn,
  IActionTable,
} from '@/app/shared/table-primeng/table-primeng.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EVALUACION, FORO, TAREA } from '@/app/sistema/aula-virtual/interfaces/actividad.interface';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { PrimengModule } from '@/app/primeng.module';
import { ApiAulaService } from '@/app/sistema/aula-virtual/services/api-aula.service';
import { MessageService } from 'primeng/api';
import { finalize, Subject, takeUntil } from 'rxjs';
import { DOCENTE, ESTUDIANTE } from '@/app/servicios/perfilesConstantes';
import { CardOrderListComponent } from '@/app/shared/card-orderList/card-orderList.component';
import { SelectButtonChangeEvent } from 'primeng/selectbutton';
import { DetalleMatriculasService } from '@/app/servicios/acad/detalle-matriculas.service';
import { CalendarioPeriodosEvalacionesService } from '@/app/servicios/acad/calendario-periodos-evaluaciones.service';
import { MostrarErrorComponent } from '@/app/shared/components/mostrar-error/mostrar-error.component';
import { EscalaCalificacionesService } from '@/app/servicios/eval/escala-calificaciones.service';
import { NoDataComponent } from '@/app/shared/no-data/no-data.component';
import { GeneralService } from '@/app/servicios/general.service';
import { INSTRUCTOR } from '@/app/servicios/seg/perfiles';
import { TabResultadosService } from '@/app/servicios/aula/tab-resultados.service';

@Component({
  selector: 'app-tab-resultados',
  standalone: true,
  templateUrl: './tab-resultados.component.html',
  styleUrls: ['./tab-resultados.component.scss'],
  imports: [TablePrimengComponent, PrimengModule, CardOrderListComponent, NoDataComponent],
})
export class TabResultadosComponent extends MostrarErrorComponent implements OnInit, OnChanges {
  @Input() iSilaboId;
  @Input() iCursoId;
  @Input() idDocCursoId;
  @Input() curso;
  @Input() contenidoSemanas = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['contenidoSemanas']) {
      this.contenidoSemanas = changes['contenidoSemanas']?.currentValue;
      const yaExisteTodas = this.contenidoSemanas.some(semana => semana.iContenidoSemId === 0);

      if (!yaExisteTodas) {
        this.contenidoSemanas.unshift({
          iContenidoSemId: 0,
          cContenidoSemTitulo: 'Todas las semanas',
        });
      }
    }
  }
  private GeneralService = inject(GeneralService);
  private _serviceResultados = inject(TabResultadosService);
  private _formBuilder = inject(FormBuilder);
  private _aulaService = inject(ApiAulaService);
  private _ConstantesService = inject(ConstantesService);
  private _DetalleMatriculasService = inject(DetalleMatriculasService);
  private _MessageService = inject(MessageService);
  private _CalendarioPeriodosEvalacionesService = inject(CalendarioPeriodosEvalacionesService);
  private _EscalaCalificacionesService = inject(EscalaCalificacionesService);

  loading = false;
  reporteNotasFinales: any[] = [];
  detalleActividades: any[] = [];
  estudianteEv: any[] = [];
  estudianteSeleccionado: any;
  estudianteSelect = null;

  iEstudianteId: number;
  iPerfilId: number;
  iDocenteId: number;
  iIntructorId: number;

  mostrarModalConclusionDesc = false;
  descrip: string;

  public DOCENTE = DOCENTE;
  public ESTUDIANTE = ESTUDIANTE;
  public INSTRUCTOR = INSTRUCTOR;

  public conclusionDescrp: FormGroup = this._formBuilder.group({
    bEsPorPeriodo: [],
    iNumeroPeriodo: [],
    iEscalaCalifId: ['', [Validators.required]],
    cDetMatConclusionDescPromedio: ['', [Validators.required]],
    iNroNota: ['', [Validators.required]],
  });

  calificacion: any[] = [];

  periodos = [];

  iTabSeleccionado = '1';
  seleccionarResultado = '1';
  actividadSeleccionado = TAREA;

  private unsbscribe$ = new Subject<boolean>();

  stateOptions = [
    { label: 'Resumen', value: '1' },
    { label: 'Detalle Completo', value: '2' },
  ];

  listarActividades = [
    { label: 'Actividad de Aprendizaje', value: TAREA, styleClass: 'btn-success' },
    { label: 'Foro', value: FORO, styleClass: 'btn-success' },
    { label: 'Evaluación', value: EVALUACION, styleClass: 'btn-danger' },
  ];
  notas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  columnasTabla: IColumn[] = [
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
      width: '10rem',
      field: 'completoalumno',
      header: 'Nombre estudiante',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'text',
      width: '10rem',
      field: 'iEscalaCalifIdPeriodo1Final',
      header: 'Período 1',
      text_header: 'center',
      text: 'center',
      isVisible: () => !this.curso?.iCapacitacionId,
    },
    {
      type: 'text',
      width: '10rem',
      field: 'iEscalaCalifIdPeriodo2Final',
      header: 'Período 2',
      text_header: 'center',
      text: 'center',
      isVisible: () => !this.curso?.iCapacitacionId,
    },
    {
      type: 'text',
      width: '10rem',
      field: 'iEscalaCalifIdPeriodo3Final',
      header: 'Período 3',
      text_header: 'center',
      text: 'center',
      isVisible: () => !this.curso?.iCapacitacionId,
    },
    {
      type: 'text',
      width: '10rem',
      field: 'iEscalaCalifIdPeriodo4Final',
      header: 'Período 4',
      text_header: 'center',
      text: 'center',
      isVisible: () => !this.curso?.iCapacitacionId,
    },
    {
      type: 'text',
      width: '10rem',
      field: 'iEscalaCalifIdPromedioFinal',
      header: 'Promedio Final',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '10rem',
      field: 'cDetMatConclusionDescPromedio',
      header: 'Conclusión descriptiva',
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

  accionesTabla: IActionTable[] = [
    {
      labelTooltip: 'Agregar Conclusión descriptiva',
      icon: 'pi pi-cog',
      accion: 'agregarConclusion',
      type: 'item',
      class: 'p-button-rounded p-button-danger p-button-text',
      isVisible: () => this.iPerfilId === this.DOCENTE || this.iPerfilId === this.INSTRUCTOR,
    },
  ];
  get columnasVisibles(): IColumn[] {
    return this.columnasTabla.filter(col => {
      if (typeof col.isVisible === 'function') {
        return col.isVisible();
      }
      return col.isVisible !== false; // por defecto visible si no se indica
    });
  }

  ngOnInit() {
    this.iEstudianteId = this._ConstantesService.iEstudianteId;
    this.iPerfilId = this._ConstantesService.iPerfilId;
    this.iDocenteId = this._ConstantesService.iDocenteId;
    // this.iIntructorId = this._ConstantesService.iIntructorId;
    console.log('iIntructorId', this.iPerfilId, this.INSTRUCTOR);

    this.obtenerEscalaCalificaciones();

    if (!this.curso?.iCapacitacionId) {
      this.obtenerPeriodosxiYAcadIdxiSedeIdxFaseRegular();
      this.obtenerReporteDenotasFinales();
    }

    this.obtenerEsctudiantes();
  }

  periodoSeleccionado: number | string | null = null;

  obtenerPeriodosxiYAcadIdxiSedeIdxFaseRegular() {
    const iYAcadId = this._ConstantesService.iYAcadId;
    const iSedeId = this._ConstantesService.iSedeId;
    const params = { iCredId: this._ConstantesService.iCredId };

    this._CalendarioPeriodosEvalacionesService
      .obtenerPeriodosxiYAcadIdxiSedeIdxFaseRegular(iYAcadId, iSedeId, params)
      .subscribe({
        next: resp => {
          if (resp.validated) {
            this.periodos = resp.data;
            if (this.periodos.length > 0) {
              this.periodoSeleccionado = this.periodos[0].iPeriodoEvalAperId;
            }
          }
        },
        error: error => this.mostrarErrores(error),
      });
  }
  capacitacion: any;
  // obtener los alumnos de la capacitación
  obtenerEsctudiantes() {
    // const icapacitacion = this.curso.iCapacitacionId

    // const data = {
    //   petition: 'get',
    //   group: 'cap',
    //   prefix: 'notas',
    //   ruta: this.curso.iCapacitacionId.toString(),
    //   params: {
    //     iCredId: this._ConstantesService.iCredId, // Asignar el ID del crédito
    //   },
    // };
    const data = this.curso.iCapacitacionId;
    this._serviceResultados.obtenerAlumnos(data).subscribe({
      next: resp => {
        // this.capacitacion = resp.data.length ? resp.data[0] : null;
        // this.reporteNotasFinales = {
        //   ...this.capacitacion,
        //   // iEscalaCalifIdPromedioFinal: this.capacitacion.iNroNota,
        //   // cDetMatConclusionDescPromedio: this.capacitacion.cConclusion
        // }
        this.capacitacion = resp['data'] || [];
        this.reporteNotasFinales = this.capacitacion.map(item => ({
          ...item,
          iEscalaCalifIdPromedioFinal: item.iNroNota,
          cDetMatConclusionDescPromedio: item.cConclusion,
        }));

        // console.log(this.capacitacion);

        // if (resp?.data?.length) {
        //   this.capacitacion = resp.data[0];

        // } else {
        //   console.warn('No se encontraron datos para la capacitación.');
        //   // this.closeModal(resp?.validated);
        // }

        // console.log('Respuesta de la capacitación:', this.capacitacion);
      },
      error: err => {
        console.error('Error obteniendo cuestionario:', err);
      },
    });
  }
  semanaSeleccionado: number | string | null = null;

  accionBnt({ accion, item }) {
    if (accion === 'agregarConclusion') {
      this.enviarDatosFinales(item, false);
    }
  }

  enviarDatosFinales(item: any, periodo: boolean) {
    this.mostrarModalConclusionDesc = true;
    this.estudianteSelect = item;
    console.log(this.estudianteSelect);
    // Limpiar el formulario antes de aplicar nuevos valores
    this.conclusionDescrp.reset();

    if (!periodo) {
      this.conclusionDescrp.patchValue({
        bEsPorPeriodo: false,
        iNumeroPeriodo: null,
        iEscalaCalifId: item.iEscalaCalifIdPromedio,
        cDetMatConclusionDescPromedio: item.cDetMatConclusionDescPromedio,
        iNroNota: this.estudianteSelect.iNroNota,
      });
    } else {
      const nPeriodo = this.periodos.find(p => p.iPeriodoEvalAperId === this.periodoSeleccionado);
      if (!nPeriodo) return;
      const conclusionKey = `cDetMatrConclusionDesc${nPeriodo.iNumeroPeriodo}`;
      const calificacionKey = `iEscalaCalifIdPeriodo${nPeriodo.iNumeroPeriodo}`;

      this.conclusionDescrp.patchValue({
        bEsPorPeriodo: true,
        iNumeroPeriodo: nPeriodo.iNumeroPeriodo,
        iEscalaCalifId: item[calificacionKey],
        cDetMatConclusionDescPromedio: item[conclusionKey],
      });
    }
  }

  obtenerComnt(estudiantes) {
    this.estudianteEv = estudiantes.completoalumno;
    this.estudianteSeleccionado = estudiantes;

    this._aulaService
      .obtenerResultados({
        iEstudianteId: estudiantes.iEstudianteId,
        idDocCursoId: this.idDocCursoId,
      })
      .pipe(takeUntil(this.unsbscribe$))
      .subscribe({
        next: resp => (this.detalleActividades = resp),
        error: error => this.mostrarErrores(error),
      });
  }

  generarReporteDeLogrosPdf() {
    this._aulaService
      .generarReporteDeLogrosPdf({
        iIeCursoId: this.iCursoId,
        idDocCursoId: this.idDocCursoId,
      })
      .subscribe(response => {
        const blob = response as Blob;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'Reporte_logros.pdf';
        link.click();
      });
  }

  obtenerReporteDenotasFinales() {
    const params = {
      iIeCursoId: this.curso.iIeCursoId,
      iYAcadId: this._ConstantesService.iYAcadId,
      iSedeId: this._ConstantesService.iSedeId,
      iSeccionId: this.curso.iSeccionId,
      iNivelGradoId: this.curso.iNivelGradoId,
      iEstudianteId:
        this.iPerfilId === this.ESTUDIANTE ? this._ConstantesService.iEstudianteId : null,
    };

    this._aulaService.obtenerReporteFinalDeNotas(params).subscribe((Data: any) => {
      this.reporteNotasFinales = (Data?.data || []).map((item: any, index) => ({
        ...item,
        cTitulo: `${index + 1}.- ${item.completoalumno}`,
      }));
      console.log(this.reporteNotasFinales, this.curso);
    });
  }

  isLoading: boolean = false;
  guardarConclusionDescriptiva() {
    // if (this.isLoading) return; // evitar doble clic
    // this.isLoading = true;

    if (this.iPerfilId === this.INSTRUCTOR) {
      const datos = {
        iInscripId: this.capacitacion.map(item => item.iInscripId).join(','),
        iCapacitacionId: this.capacitacion.map(item => item.iCapacitacionId).join(','),
        iNroNota: this.conclusionDescrp.value.iNroNota,
        cConclusion: this.conclusionDescrp.value.cDetMatConclusionDescPromedio,
        iCredId: this._ConstantesService.iCredId,
      };
      console.log('Datos a guardar:', datos);

      this._serviceResultados.guardarDescripcion(datos).subscribe({
        next: resp => {
          this.capacitacion = resp.data.length ? resp.data[0] : null;
          this.reporteNotasFinales = resp.data;
          this.messageService.add({
            severity: 'success',
            summary: '¡Genial!',
            detail: 'Acción éxitosa',
          });

          this.estudianteSeleccionado = null;
          this.obtenerEsctudiantes();
          this.mostrarModalConclusionDesc = false;
          this.conclusionDescrp.reset();
          // console.log(this.capacitacion);
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
    } else {
      const { bEsPorPeriodo, iNumeroPeriodo, iEscalaCalifId, cDetMatConclusionDescPromedio } =
        this.conclusionDescrp.value;

      const params = {
        iEscalaCalifIdPromedio: iEscalaCalifId,
        iEstudianteId: this.estudianteSelect.iEstudianteId,
        iMatrId: this.estudianteSelect.iMatrId,
        iDetMatrId: this.estudianteSelect.iDetMatrId,
        iIeCursoId: this.curso.iIeCursoId,
        iSeccionId: this.curso.iSeccionId,
        idDocCursoId: this.idDocCursoId,
        cDetMatConclusionDescPromedio,
        bEsPorPeriodo,
        iNumeroPeriodo,
        iEscalaCalifIdPeriodo: iEscalaCalifId,
        cDetMatrConclusionDescPeriodo: cDetMatConclusionDescPromedio,
        iCredId: this._ConstantesService.iCredId,
      };

      const nombresCampos: Record<string, string> = {
        iEscalaCalifIdPromedio: 'Escala de calificación',
        cDetMatConclusionDescPromedio: 'Conclusión descriptiva',
        iEscalaCalifIdPeriodo: 'Escala de calificación',
        cDetMatrConclusionDescPeriodo: 'Conclusión descriptiva',
        iEstudianteId: 'Estudiante',
        iMatrId: 'Matrícula',
        iDetMatrId: 'Detalle matrícula',
        iIeCursoId: 'Curso',
        iSeccionId: 'Sección',
        idDocCursoId: 'Docente del curso',
        iCredId: 'Credencial',
      };

      // Validación manual basada en campos requeridos según bEsPorPeriodo
      const camposRequeridos = [
        'iEstudianteId',
        'iMatrId',
        'iDetMatrId',
        'iIeCursoId',
        'iSeccionId',
        'idDocCursoId',
        'iCredId',
        bEsPorPeriodo ? 'iEscalaCalifIdPeriodo' : 'iEscalaCalifIdPromedio',
        bEsPorPeriodo ? 'cDetMatrConclusionDescPeriodo' : 'cDetMatConclusionDescPromedio',
      ];

      // Validación
      let valid = true;
      let message = '';

      for (const campo of camposRequeridos) {
        if (
          params[campo] === null ||
          params[campo] === undefined ||
          (typeof params[campo] === 'string' && params[campo].trim() === '')
        ) {
          valid = false;
          message = `El campo "${nombresCampos[campo] ?? campo}" es obligatorio.`;
          break;
        }
      }

      // Resultado
      if (!valid) {
        this._MessageService.add({
          severity: 'warn',
          summary: 'Validación',
          detail: message,
        });
        this.isLoading = false;
        return;
      }

      this._DetalleMatriculasService
        .guardarConclusionDescriptiva(this.estudianteSelect.iDetMatrId, params)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: response => {
            this.estudianteSeleccionado = null;
            this.obtenerReporteDenotasFinales();
            this.mostrarModalConclusionDesc = false;
            this.conclusionDescrp.reset();

            if (response.validated) {
              this._MessageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Calificación guardada correctamente.',
              });
            }
          },
          error: error => this.mostrarErrores(error),
        });
    }
  }

  obtenerEscalaCalificaciones() {
    this._EscalaCalificacionesService.obtenerEscalaCalificaciones().subscribe({
      next: resp => {
        if (resp.validated) this.calificacion = resp.data;
      },
      error: error => this.mostrarErrores(error),
    });
  }

  obtenerTab(evn: SelectButtonChangeEvent) {
    this.iTabSeleccionado = evn?.value || this.iTabSeleccionado;
    this.seleccionarResultado = this.iTabSeleccionado;
  }

  obtenerActividadesxiActTipoId() {
    const tiposActividad = {
      [TAREA]: 'tarea',
      [FORO]: 'foro',
      [EVALUACION]: 'evaluacion',
    };

    const key = tiposActividad[this.actividadSeleccionado];
    const lista = this.detalleActividades?.[key] ?? [];

    if (!this.periodoSeleccionado && !this.semanaSeleccionado) return lista;

    return lista.filter(
      item =>
        (!this.periodoSeleccionado || item.iPeriodoEvalAperId === this.periodoSeleccionado) &&
        (!this.semanaSeleccionado ||
          this.semanaSeleccionado === 0 ||
          item.iContenidoSemId === this.semanaSeleccionado)
    );
  }

  obtenerStyleActividad() {
    const colores = {
      [TAREA]: '--green-500',
      [FORO]: '--yellow-500',
      [EVALUACION]: '--red-500',
    };
    const color = colores[this.actividadSeleccionado];
    return `border-left:15px solid var(${color});`;
  }

  asignarColorActividad(): string {
    const clases = {
      [TAREA]: 'background-tarea',
      [FORO]: 'background-evaluacion',
      [EVALUACION]: 'background-foro',
    };
    return clases[this.actividadSeleccionado] || '';
  }

  obtenerCalificacionxPeriodo() {
    const nPeriodo = this.periodos.find(p => p.iPeriodoEvalAperId === this.periodoSeleccionado);
    if (!nPeriodo || !this.estudianteSeleccionado) return '';
    const calificacionKey = `iEscalaCalifIdPeriodo${nPeriodo.iNumeroPeriodo}Final`;
    return this.estudianteSeleccionado[calificacionKey];
  }

  obtenerSeverityCalificacion(): 'success' | 'warning' | 'danger' | undefined {
    const calificacion = this.obtenerCalificacionxPeriodo();
    switch (calificacion) {
      case 'AD':
      case 'A':
        return 'success';
      case 'B':
        return 'warning';
      case 'C':
        return 'danger';
      default:
        return undefined; // O puedes devolver 'secondary' u otro si quieres estilo neutro
    }
  }

  obteneSemanasxiPeriodoEvalAperId(): any[] {
    if (!this.periodoSeleccionado) return [];
    return this.contenidoSemanas.filter(
      semana =>
        semana.iContenidoSemId === 0 || semana.iPeriodoEvalAperId === this.periodoSeleccionado
    );
  }
}
