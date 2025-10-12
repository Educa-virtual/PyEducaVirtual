import { PrimengModule } from '@/app/primeng.module';
import { GeneralService } from '@/app/servicios/general.service';
import { Component, OnInit, Input, inject, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { CalendarOptions } from '@fullcalendar/core';
import { Data } from '../interfaces/asistencia.interface'; // * exportando intefaces
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es'; // * traduce el Modulo de calendario a español
import { MessageService } from 'primeng/api';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { ReporteAsistenciaComponent } from './reporte-asistencia/reporte-asistencia.component';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-asistencia',
  standalone: true,
  imports: [
    // ContainerPageComponent,
    PrimengModule,
    // TablePrimengComponent,
    ReporteAsistenciaComponent,
  ],
  templateUrl: './asistencia.component.html',
  styleUrl: './asistencia.component.scss',
})
export class AsistenciaComponent implements OnInit {
  @ViewChildren('subirJustificacion') uploaders!: QueryList<FileUpload>;

  @Input() iCursoId: string;
  @Input() idDocCursoId: string;
  @Input() iGradoId: string;
  @Input() iNivelGradoId: string;
  @Input() iSeccionId: string;
  @Input() iCicloId: string;
  @Input() iNivelId: string;

  iDocenteId: string;
  iYAcadId: string;
  iIieeId: string;
  iSedeId: string;
  cNivelTipoNombre: string;
  cNivelNombre: string;
  cPersNombreLargo: string;
  cIieeNombre: string;
  detalles = []; // guarda los detalles del encabezado
  year: string;
  encabezado = [];
  archivo: any = [];

  private GeneralService = inject(GeneralService);
  private unsubscribe$ = new Subject<boolean>();
  private _LocalStoreService = inject(LocalStoreService);
  private _ConstantesService = inject(ConstantesService);

  cCursoNombre: string;
  constructor(
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.year = this._ConstantesService.year;
    this.cIieeNombre = this._ConstantesService.cIieeNombre;
    this.iDocenteId = this._ConstantesService.iDocenteId;
    this.iYAcadId = this._ConstantesService.iYAcadId;
    this.iIieeId = this._ConstantesService.iIieeId;
    this.iSedeId = this._ConstantesService.iSedeId;
    this.cPersNombreLargo = this._ConstantesService.nombres;
    this.cNivelTipoNombre = this._ConstantesService.cNivelTipoNombre;
    this.cNivelNombre = this._ConstantesService.cNivelNombre;
    this.activatedRoute.params.subscribe(params => {
      this.iCursoId = params['iCursoId'];
      this.cCursoNombre = params['cCursoNombre'];
    });
  }

  ngOnInit() {
    this.getCursoHorario();
    this.detalleCurricular();
  }

  // busca los datos para el encabezado
  detalleCurricular() {
    const params = {
      petition: 'post',
      group: 'acad',
      prefix: 'docente',
      ruta: 'detalle_curricular',
      data: {
        iGradoId: this.iGradoId,
        iCursoId: this.iCursoId,
        iCicloId: this.iCicloId,
        iSeccionId: this.iSeccionId,
        iNivelId: this.iNivelId,
      },
    };

    this.getConexion(params, 'get_detalle_curricular');
  }

  /**
   * @param fechaActual Guarda la fecha actual para la asistencia
   */

  formatoFecha: Date = new Date();
  calendarioMes = '';
  calendarioYear = '';
  fechaActual = this.formatoFecha.toISOString().split('T')[0];
  limitado = this.formatoFecha.getDay();

  confFecha: any = {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  fechaEspecifica = this.formatoFecha.toLocaleDateString('es-PE', this.confFecha);

  /**
   * calendarOptions
   * * Se encarga de mostrar el calendario
   * @param locales Traduce el calendario a español
   * @param events Se encarga de mostrar las actividades programadas por hora y fecha
   * @param dayMaxEvents limita los eventos del dia para que se desborden del calendario
   */

  events: any[] = [];
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    slotLabelFormat: { hour: 'numeric', minute: '2-digit', hour12: false },
    initialView: 'dayGridMonth',
    locales: [esLocale],
    weekends: true,
    selectable: true,
    dayMaxEvents: true,
    height: 600,
    dayCellDidMount: data => {
      // Si el día es sábado o domingo
      if (data.dow === 6 || data.dow === 0) {
        data.el.style.backgroundColor = '#ffd7d7';
      }
    },
    datesSet: dateInfo => {
      const calendarioMes = dateInfo.view.currentStart.toLocaleString('default', {
        month: 'numeric',
      });
      const calendarioYear = dateInfo.view.currentStart.toLocaleString('default', {
        year: 'numeric',
      });
      this.calendarioMes = calendarioMes;
      this.calendarioYear = calendarioYear;
      //this.countAsistencias()
      this.getFechasImportantes();
    },
    dateClick: item => this.handleDateClick(item),
    headerToolbar: {
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
      center: 'title',
      start: 'prev,next today',
    },
  };

  /**
   *
   * @param checkbox Muestra si el estado del checkbox es true or false
   * @param valor Se encarga de enviar el tipo de filtro que se aplique en el calendario
   */
  filterCalendario(checkbox: any, valor: any) {
    this.events.map(evento => {
      if (evento.grupo == valor && checkbox.mostrar == true) {
        evento.display = 'block';
      }
      if (evento.grupo == valor && checkbox.mostrar == false) {
        evento.display = 'none';
      }
    });
    this.calendarOptions.events = Object.assign([], this.events);
  }

  mostrarModal: number = 0;
  fechaCaptura = this.fechaActual;
  // * Se encarga de seleccionar la fecha de Asistencia
  handleDateClick(item) {
    this.fechaActual = item.dateStr;
    const dia = new Date(this.fechaActual + 'T00:00:00');
    this.limitado = dia.getDay();
    this.fechaEspecifica = dia.toLocaleDateString('es-PE', this.confFecha);
    this.horario.map(fecha => {
      if (fecha.dtHorarioFecha == this.fechaActual && this.limitado != 6 && this.limitado != 0) {
        if (this.fechaCaptura == this.fechaActual) {
          this.mostrarModal++;
          if (this.mostrarModal == 1) {
            this.verAsistencia = true;
            this.mostrarModal = 0;
            this.fechaCaptura = '';
            this.getAsistencia(item.dateStr);
          }
          this.mostrarModal = 0;
        } else {
          this.fechaCaptura = this.fechaActual;
          this.mostrarModal = 0;
        }
      }
    });
  }
  showModal = false;
  modalReporte() {
    this.showModal = true;
    // this.verReporte = true
  }

  /**
   * updateActividad
   * * Muestra una ventana Modal para poder cambiar el nombre de la programacion de actividad
   */

  fechaDia = new Date();
  verAsistencia: boolean = false; // * Muestra la ventana modal
  strId: string = ''; // * Almacena el id de la actividad
  strTitulo: string = ''; // * Almacena el titulo de la actividad

  editActividad(id: any, titulo: any) {
    this.verAsistencia = true;
    this.strId = id;
    this.strTitulo = titulo;
  }

  escapeModal() {
    this.verAsistencia = false;
    this.strId = '';
    this.strTitulo = '';
  }

  captura = '';
  capturarMes = 0;
  countAsistencias() {
    // agregamos un contador desde 0 para agregar el total de asistencia, faltas y etc de los estudiantes
    this.leyenda.filter(index => {
      index.contar = 0;
    });

    this.events.filter(index => {
      this.captura = index.title.split(' : ');

      if (this.captura.length > 1) {
        const capturar = this.captura[0]; // Capturamos el tipo de asistencia
        const suma = parseInt(this.captura[1]); // Capturamos la cantidad del registro y lo convertimos en enteros
        const capturarFecha = index.start.split('-'); // Dividimos la fechas en año, mes y dia para obtener la cantidad de asistencias del mes
        const fechaAsistencia = capturarFecha[0] + '-' + capturarFecha[1];
        const fechaCalendario =
          this.calendarioYear +
          '-' +
          (this.calendarioMes.length > 1 ? this.calendarioMes : '0' + this.calendarioMes);

        this.leyenda[0].contar +=
          capturar == 'Asistio' && fechaCalendario == fechaAsistencia ? suma : 0;
        this.leyenda[1].contar +=
          capturar == 'Inasistencia' && fechaCalendario == fechaAsistencia ? suma : 0;
        this.leyenda[2].contar +=
          capturar == 'Inasistencia Justificada' && fechaCalendario == fechaAsistencia ? suma : 0;
        this.leyenda[3].contar +=
          capturar == 'Tardanza' && fechaCalendario == fechaAsistencia ? suma : 0;
        this.leyenda[4].contar +=
          capturar == 'Tardanza Justificada' && fechaCalendario == fechaAsistencia ? suma : 0;
        this.leyenda[5].contar +=
          capturar == 'Sin Registro' && fechaCalendario == fechaAsistencia ? suma : 0;
      }
    });
  }
  countAsistenciasModal() {
    // devuelve en 0 las cantidades de tipos de asistencias
    this.leyendaModal.forEach(index => {
      return (index.contar = 0);
    });

    this.data.filter(index => {
      const suma = 1;
      this.captura = index.iTipoAsiId;
      this.leyendaModal[0].contar += this.captura == '1' ? suma : 0;
      this.leyendaModal[1].contar += this.captura == '3' ? suma : 0;
      this.leyendaModal[2].contar += this.captura == '4' ? suma : 0;
      this.leyendaModal[3].contar += this.captura == '2' ? suma : 0;
      this.leyendaModal[4].contar += this.captura == '9' ? suma : 0;
      this.leyendaModal[5].contar += this.captura == '7' ? suma : 0;
    });
  }

  leyenda = [
    {
      significado: 'Asistio',
      simbolo: 'X',
      contar: 0,
      divColor: 'green-50-boton',
      bgColor: 'green-boton',
    },
    {
      significado: 'Inasistencia',
      simbolo: 'I',
      contar: 0,
      divColor: 'red-50-boton',
      bgColor: 'red-boton',
    },
    {
      significado: 'Inasistencia Justificada',
      simbolo: 'J',
      contar: 0,
      divColor: 'primary-50-boton',
      bgColor: 'primary-boton',
    },
    {
      significado: 'Tardanza',
      simbolo: 'T',
      contar: 0,
      divColor: 'orange-50-boton',
      bgColor: 'orange-boton',
    },
    {
      significado: 'Tardanza Justificada',
      simbolo: 'P',
      contar: 0,
      divColor: 'yellow-50-boton',
      bgColor: 'yellow-boton',
    },
    {
      significado: 'Sin Registro',
      simbolo: '-',
      contar: 0,
      divColor: 'cyan-50-boton',
      bgColor: 'cyan-boton',
    },
  ];

  leyendaModal = [
    {
      significado: 'Asistio',
      iTipoAsiId: '1',
      simbolo: 'X',
      contar: 0,
      divColor: 'green-50-boton',
      bgColor: 'green-boton',
    },
    {
      significado: 'Inasistencia',
      iTipoAsiId: '3',
      simbolo: 'I',
      contar: 0,
      divColor: 'red-50-boton',
      bgColor: 'red-boton',
    },
    {
      significado: 'Inasistencia Justificada',
      iTipoAsiId: '4',
      simbolo: 'J',
      contar: 0,
      divColor: 'primary-50-boton',
      bgColor: 'primary-boton',
    },
    {
      significado: 'Tardanza',
      iTipoAsiId: '2',
      simbolo: 'T',
      contar: 0,
      divColor: 'orange-50-boton',
      bgColor: 'orange-boton',
    },
    {
      significado: 'Tardanza Justificada',
      iTipoAsiId: '9',
      simbolo: 'P',
      contar: 0,
      divColor: 'yellow-50-boton',
      bgColor: 'yellow-boton',
    },
    {
      significado: 'Sin Registro',
      iTipoAsiId: '7',
      simbolo: '-',
      contar: 0,
      divColor: 'cyan-50-boton',
      bgColor: 'cyan-boton',
    },
  ];

  valSelect1: string = '';
  valSelect2: number = 0;

  data = [];

  /**
   * changeAsistencia
   * * Esta funcion cambia los estados de asistencia del alumno
   * @param tipoMarcado guarda los estados del boton de asistencia
   * @indice limite el cambio de los valores del boton
   * @iTipoAsiId extraemos el indice
   */

  tipoAsistencia = [
    {
      iTipoAsiId: '1',
      cTipoAsiLetra: 'X',
      cTipoAsiNombre: 'Asistio',
      bgColor: 'bg-green-500',
    },
    {
      iTipoAsiId: '2',
      cTipoAsiLetra: 'T',
      cTipoAsiNombre: 'Tardanza',
      bgColor: 'bg-orange-500',
    },
    {
      iTipoAsiId: '3',
      cTipoAsiLetra: 'I',
      cTipoAsiNombre: 'Inasistencia',
      bgColor: 'bg-red-500',
    },
    {
      iTipoAsiId: '4',
      cTipoAsiLetra: 'J',
      cTipoAsiNombre: 'Inasistencia Justificada',
      bgColor: 'bg-primary-500',
    },
    {
      iTipoAsiId: '9',
      cTipoAsiLetra: 'P',
      cTipoAsiNombre: 'Tardanza Justificada',
      bgColor: 'bg-yellow-500',
    },
    {
      iTipoAsiId: '7',
      cTipoAsiLetra: '-',
      cTipoAsiNombre: 'Sin Registro',
      bgColor: 'bg-cyan-500',
    },
  ];

  iTipoAsiId = 0;
  indice = 0;

  changeAsistencia(index, item) {
    const valor = this.tipoAsistencia.findIndex(valor => valor.iTipoAsiId == item);
    const indice = (Number(valor) + 1) % this.tipoAsistencia.length;
    this.data[index].iTipoAsiId = this.tipoAsistencia[indice].iTipoAsiId;
    this.data[index].cTipoAsiLetra = this.tipoAsistencia[indice].cTipoAsiLetra;
    this.data[index].cTipoAsiNombre = this.tipoAsistencia[indice].cTipoAsiNombre;
    this.data[index].bgColor = this.tipoAsistencia[indice].bgColor;

    this.countAsistenciasModal();
  }

  goAreasEstudio() {
    this.router.navigate(['aula-virtual/areas-curriculares']);
  }

  estado = {
    '1': 'bt-green',
    '2': 'bt-orange',
    '3': 'bt-red',
    '4': 'bt-primary',
    '7': 'bt-cyan',
    '9': 'bt-yellow',
  };
  horario = [];
  accionBtnItem(elemento): void {
    const { accion } = elemento;
    const { item } = elemento;

    switch (accion) {
      case 'ingresar':
        this.router.navigate(['./docente/detalle-asistencia']);
        break;
      case 'get_data':
        this.getFechasImportantes();
        this.verAsistencia = false;
        break;
      case 'get_asistencia':
        this.data = item;
        this.data.forEach(item => {
          const seleccionar = this.tipoAsistencia.find(
            lista => lista.iTipoAsiId == item.iTipoAsiId
          );
          item.bgColor = seleccionar.bgColor;
          item.cTipoAsiNombre = seleccionar.cTipoAsiNombre;
        });
        this.countAsistenciasModal();
        break;
      case 'get_curso_horario':
        this.horario = item;
        break;
      case 'get_fecha_importante':
        this.calendarOptions.events = item;
        this.events = item;
        this.countAsistencias();
        break;
      case 'close-modal':
        this.showModal = false;
        break;
      case 'get_detalle_curricular':
        this.encabezado = this.encabezado.concat(item);
        break;
      default:
        break;
    }
  }

  /**
   * updateActividad
   * * Se encarga de actualizar las tareas del calendario
   * @param iTareaId Es el id de tareas
   * @param cTareaTitulo Es el titulo de la tarea
   */

  updateActividad() {
    const params = {
      petition: 'post',
      group: 'aula-virtual',
      prefix: 'tareas',
      ruta: 'update',
      data: {
        opcion: 'ACTUALIZAR_TITULO_TAREA',
        iTareaId: this.strId,
        cTareaTitulo: this.strTitulo,
      },
    };

    this.getConexion(params, 'get_data');

    this.strId = '';
    this.strTitulo = '';
    this.verAsistencia = false;
  }

  // * Registro de asistencia del alumno

  storeAsistencia() {
    if (this.limitado != 6 && this.limitado != 0) {
      const enviar = new FormData();
      enviar.append('opcion', 'GUARDAR_ASISTENCIA_ESTUDIANTE');
      enviar.append('iCursoId', this.iCursoId);
      enviar.append('iSeccionId', this.iSeccionId);
      enviar.append('iDocenteId', this.iDocenteId);
      enviar.append('iYAcadId', this.iYAcadId);
      enviar.append('dtCtrlAsistencia', this.fechaActual);
      enviar.append('idDocCursoId', this.idDocCursoId);
      enviar.append('iSedeId', this.iSedeId);
      enviar.append('asistencia_json', JSON.stringify(this.data));
      this.archivo.forEach((item: File, index: number) => {
        enviar.append(`archivos[${index}]`, item);
      });

      const params = {
        petition: 'post',
        group: 'docente',
        prefix: 'asistencia',
        ruta: 'guardarAsistencia',
        data: enviar,
      };

      this.GeneralService.getMultipleMedia(params).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Mensaje',
            detail: 'Asistencia Registrada',
          });
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
        complete: () => {
          this.getFechasImportantes();
          this.verAsistencia = false;
        },
      });
    } else {
      this.messageService.add({
        severity: 'info',
        summary: 'Mensaje',
        detail: 'Fecha no habilitada',
      });
    }
  }

  /**
   * getFechasImportantes
   * * Asistencia del Año escolar
   */

  getFechasImportantes() {
    const params = {
      petition: 'post',
      group: 'docente',
      prefix: 'reporte_asistencia',
      ruta: 'obtenerAsistencia',
      data: {
        iGradoId: this.iGradoId,
        idDocCursoId: this.idDocCursoId,
        iSedeId: this.iSedeId,
        iIieeId: this.iIieeId,
        iCursoId: this.iCursoId,
        iYAcadId: this.iYAcadId,
        iDocenteId: this.iDocenteId,
        iSeccionId: this.iSeccionId,
        iNivelGradoId: this.iNivelGradoId,
      },
    };
    this.getConexion(params, 'get_fecha_importante');
  }

  /**
   * getCursoHorario
   * * Se obtiene los horarios de los cursos para registrar las asistencias
   */

  getCursoHorario() {
    const params = {
      petition: 'post',
      group: 'docente',
      prefix: 'reporte_asistencia',
      ruta: 'obtenerCursoHorario',
      data: {
        iSedeId: this.iSedeId,
        iIieeId: this.iIieeId,
        iCursoId: this.iCursoId,
        iYAcadId: this.iYAcadId,
        iDocenteId: this.iDocenteId,
        iSeccionId: this.iSeccionId,
        iGradoId: this.iGradoId,
        iNivelGradoId: this.iNivelGradoId,
        idDocCursoId: this.idDocCursoId,
        iCicloId: this.iCicloId,
      },
    };
    this.getConexion(params, 'get_curso_horario');
  }

  /**
   * getAsistencia
   * * Se encarga de Obtener la asistencia por dia seleccionado
   */

  getAsistencia(fechas) {
    const params = {
      petition: 'post',
      group: 'docente',
      prefix: 'asistencia',
      ruta: 'obtenerEstudiante',
      data: {
        opcion: 'consultar_asistencia_fecha',
        iCursoId: this.iCursoId,
        iSeccionId: this.iSeccionId,
        iDocenteId: this.iDocenteId,
        iYAcadId: this.iYAcadId,
        iNivelGradoId: this.iNivelGradoId,
        iGradoId: this.iGradoId,
        idDocCursoId: this.idDocCursoId,
        iSedeId: this.iSedeId,
        iIieeId: this.iIieeId,
        dtCtrlAsistencia: fechas,
      },
    };
    this.getConexion(params, 'get_asistencia');
  }

  /**
   * getReportePdf
   * * Obtiene el reporte de asistnecia (Mensual, semana y diario)
   */

  getReportePdf(tipoReporte: number) {
    const iYearId = this._LocalStoreService.getItem('dremoYear');
    const params = {
      petition: 'get',
      group: 'docente',
      prefix: 'reporte_mensual',
      ruta: 'report',
      data: {
        opcion: 'REPORTE_MENSUAL',
        iCursoId: this.iCursoId,
        iYearId: iYearId,
        iSeccionId: this.iSeccionId,
        iNivelGradoId: this.iNivelGradoId,
        iDocenteId: this._ConstantesService.iDocenteId,
        tipoReporte: tipoReporte,
      },
    };
    this.GeneralService.getGralReporte(params);
  }
  getConexion(params, accion) {
    this.GeneralService.getRecibirDatos(params).subscribe({
      next: (response: Data) => {
        this.accionBtnItem({ accion, item: response?.data });
      },
      complete: () => {},
    });
  }

  subirDocumento(event: any, index: number, id: FileUpload) {
    const archivo = event.files?.[0];
    this.archivo[index] = archivo;
    if (archivo) {
      id.clear();
    }
  }

  // Descargar archivo justificacion
  descargarArchivo(iDocenteId: string, cJustificar: string) {
    const params = {
      petition: 'post',
      group: 'asi',
      prefix: 'asistencia',
      ruta: 'descargar-justificacion',
      data: {
        iDocenteId: iDocenteId,
        cJustificar: cJustificar,
      },
    };

    this.GeneralService.getRecibirMultimedia(params).subscribe({
      next: async (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.click();
      },
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }
}
