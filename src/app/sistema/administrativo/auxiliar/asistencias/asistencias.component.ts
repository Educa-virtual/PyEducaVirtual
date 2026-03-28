import { Component, OnInit, inject } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { GeneralService } from '@/app/servicios/general.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { MessageService } from 'primeng/api';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import {
  trigger,
  // state,
  style,
  transition,
  animate,
} from '@angular/animations';
@Component({
  selector: 'app-asistencias',
  standalone: true,
  imports: [PrimengModule, ZXingScannerModule],
  templateUrl: './asistencias.component.html',
  styleUrl: './asistencias.component.scss',
  animations: [
    trigger('desvanecer', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' })),
      ]),
    ]),
  ],
})
export class AsistenciasComponent implements OnInit {
  private servicioGeneral = inject(GeneralService);
  dremoiYAcadId: any;
  dremoPerfil: any;
  grado: any;
  seccion: any;
  aulas: any = [];
  datos: any = {};
  registro: any = [];
  alumnos: any[] = [];
  estudiante: any = [];
  codigo: any = [];
  registrar: boolean = false;
  visible: boolean = false;
  visibleJusticar: boolean = false;
  finalizar: boolean = false;
  scanner: boolean = false;
  progreso: boolean = false;
  registrarEstudiante: boolean = false;
  estado: boolean = false;
  temporal: any = [];
  archivos: any = [];
  marcador: Date = new Date();
  buscar: boolean = true;
  messages = [
    { severity: 'info', detail: 'Este Registro solo marca la hora de Ingreso del Alumnado' },
  ];
  tipoAsistencia = [
    {
      iTipoAsiId: '1',
      cTipoAsiLetra: 'X',
      cTipoAsiNombre: 'Asistio (A)',
      textColor: 'green-50-boton',
      bgColor: 'text-green-500',
    },
    {
      iTipoAsiId: '2',
      cTipoAsiLetra: 'T',
      cTipoAsiNombre: 'Tardanza (T)',
      textColor: 'orange-50-boton',
      bgColor: 'text-orange-500',
    },
    {
      iTipoAsiId: '3',
      cTipoAsiLetra: 'I',
      cTipoAsiNombre: 'Inasistencia (I)',
      textColor: 'red-50-boton',
      bgColor: 'text-red-500',
    },
    {
      iTipoAsiId: '4',
      cTipoAsiLetra: 'J',
      cTipoAsiNombre: 'Inasistencia Justificada (IJ)',
      textColor: 'primary-50-boton',
      bgColor: 'text-primary-500',
    },
    {
      iTipoAsiId: '9',
      cTipoAsiLetra: 'P',
      cTipoAsiNombre: 'Tardanza Justificada (TJ)',
      textColor: 'yellow-50-boton',
      bgColor: 'text-yellow-500',
    },
  ];

  estados: any[] = [
    {
      iTipoAsiId: '1',
      cTipoAsiLetra: 'A',
      bgColor: 'text-green-500',
    },
    {
      iTipoAsiId: '2',
      cTipoAsiLetra: 'T',
      bgColor: 'text-orange-500',
    },
    {
      iTipoAsiId: '3',
      cTipoAsiLetra: 'I',
      bgColor: 'text-red-500',
    },
    {
      iTipoAsiId: '4',
      cTipoAsiLetra: 'IJ',
      bgColor: 'text-primary-500',
    },
    {
      iTipoAsiId: '9',
      cTipoAsiLetra: 'TJ',
      bgColor: 'text-yellow-500',
    },
  ];

  busqueda: any[] = [
    {
      value: 1,
      label: 'Grado y Sección',
    },
    {
      value: 2,
      label: 'Documento o Codigo de Estudiante',
    },
  ];

  tipoBusqueda: any = 1;

  constructor(
    private messageService: MessageService,
    private store: LocalStoreService
  ) {
    this.dremoiYAcadId = this.store.getItem('dremoiYAcadId');
    this.dremoPerfil = this.store.getItem('dremoPerfil');
  }

  ngOnInit() {
    this.buscarAulas();
    this.fechaActual();
  }

  fechaActual() {
    this.datos.dtAsistencia = new Date();
  }

  seleccionarEstado(event: any, alumno: any) {
    alumno.iTipoAsiId = event.value ? event.value : '7';
    if (alumno.iTipoAsiId === '3' || alumno.iTipoAsiId === '4') {
      alumno.dtAsistenciaHora = '00:00';
      alumno.habilitar = true;
    } else {
      alumno.habilitar = false;
    }
  }

  seleccionarEstadoEstudiante(event: any, rowIndex: any) {
    this.estudiante[rowIndex].iTipoAsiId = event.value ? event.value : '7';
    if (
      this.estudiante[rowIndex].iTipoAsiId === '3' ||
      this.estudiante[rowIndex].iTipoAsiId === '4'
    ) {
      this.estudiante[rowIndex].dtAsistenciaHora = '00:00';
      this.estudiante[rowIndex].habilitar = true;
    } else {
      this.estudiante[rowIndex].habilitar = false;
    }
  }

  // busca las aulas de la institucion para el dropdown
  buscarAulas() {
    this.finalizar = true;

    const buscar = {
      iSedeId: this.dremoPerfil.iSedeId,
      iYAcadId: this.dremoiYAcadId,
    };

    this.servicioGeneral
      .getRecibirDatos({
        petition: 'post',
        group: 'acad',
        prefix: 'calendarioAcademico',
        ruta: 'searchAcademico',
        data: {
          json: JSON.stringify(buscar),
          _opcion: 'getGradoSeccionXiSedeIdXiYAcadId',
        },
      })
      .subscribe({
        next: data => {
          this.aulas = data.data;
          this.grado = this.removeDuplicatesByiGradoId(this.aulas);
        },
        error: err => {
          console.log(err);
        },
        complete: () => {
          this.finalizar = false;
        },
      });
  }

  // busca la lista de alumnos por grados y seccion
  buscarGrupo() {
    if (this.datos.dtAsistencia) {
      this.finalizar = true;

      const enlace = {
        petition: 'post',
        group: 'asi',
        prefix: 'grupos',
        ruta: 'buscar-lista-estudiantes',
        data: {
          opcion: 'buscar-grupo',
          dtAsistencia: this.formatoFecha(this.datos.dtAsistencia),
          iGradoId: this.datos.iGradoId,
          iSeccionId: this.datos.iSeccionId,
          iSedeId: this.dremoPerfil.iSedeId,
          iYAcadId: this.dremoiYAcadId,
        },
      };

      this.servicioGeneral.getRecibirDatos(enlace).subscribe({
        next: data => {
          this.alumnos = data.data;
          const horaAsistencia = new Date(this.datos.dtAsistencia).toLocaleTimeString('es-PE', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          });
          this.alumnos.forEach(item => {
            if (!item.dtAsistenciaHora) {
              item.dtAsistenciaHora = horaAsistencia;
            }
          });

          this.alumnos.sort((a, b) => {
            const cGradoAbreviacion = a.cGradoAbreviacion.localeCompare(b.cGradoAbreviacion);
            if (cGradoAbreviacion !== 0) {
              return cGradoAbreviacion;
            }
            return a.cSeccionNombre.localeCompare(b.cSeccionNombre);
          });
        },
        error: () => {
          this.mensajeError('Mensaje del sistema', 'Error al buscar alumnos');
          this.finalizar = false;
        },
        complete: () => {
          this.finalizar = false;
          this.registrar = true;
        },
      });
    } else {
      this.mensajeError(
        'Mensaje del sistema',
        'Debes Ingresar los Grado, Seccion y Fecha de Asistencia'
      );
    }
  }

  buscarCodigo() {
    if ((this.datos.cEstCodigo || this.datos.cPersDocumento) & this.datos.dtAsistencia) {
      const enlace = {
        petition: 'post',
        group: 'asi',
        prefix: 'grupos',
        ruta: 'buscar-lista-estudiantes',
        data: {
          opcion: 'buscar-estudiante',
          cEstCodigo: this.datos.cEstCodigo,
          dtAsistencia: this.formatoFecha(this.datos.dtAsistencia),
          cPersDocumento: this.datos.cPersDocumento,
          iSedeId: this.dremoPerfil.iSedeId,
          iYAcadId: this.dremoiYAcadId,
        },
      };

      this.servicioGeneral.getRecibirDatos(enlace).subscribe({
        next: data => {
          this.estudiante = data.data;
          this.estudiante.forEach(item => {
            const seleccionar = this.tipoAsistencia.find(
              lista => lista.iTipoAsiId == item.iTipoAsiId
            );
            item.textColor = seleccionar.textColor;
            item.bgColor = seleccionar.bgColor;
            item.cTipoAsiNombre = seleccionar.cTipoAsiNombre;
          });
        },
        error: () => {
          this.mensajeError('Mensaje del sistema', 'Error al buscar alumnos');
        },
        complete: () => {
          this.finalizar = false;
          this.registrarEstudiante = true;
        },
      });
    } else {
      this.mensajeError('Mensaje del sistema', 'Debes Ingresar los Datos Solicitados');
    }
  }

  /**
   * @param buscar se encarga de permitir la busqueda evita que se repita la accion
   * cada vez que se escanea un codigo
   * @param extraer se encarga de separar el dni y codigo
   */
  escaner(qr: string) {
    if (this.buscar) {
      this.buscar = false;
      const extraer = qr.split('|');

      if (extraer.length > 0) {
        this.visible = true;
        this.datos.cEstCodigo = extraer[1];
        this.datos.cPersDocumento = extraer[0];

        const enlace = {
          petition: 'post',
          group: 'asi',
          prefix: 'grupos',
          ruta: 'buscar-lista-estudiantes',
          data: {
            opcion: 'buscar-estudiante-qr',
            cEstCodigo: this.datos.cEstCodigo,
            cPersDocumento: this.datos.cPersDocumento,
            iSedeId: this.dremoPerfil.iSedeId,
            iYAcadId: this.dremoiYAcadId,
          },
        };

        this.servicioGeneral.getRecibirDatos(enlace).subscribe({
          next: data => {
            this.codigo = data.data[0] ? data.data[0] : [];
            if (this.codigo.length == 0) {
              this.mensajeError('Mensaje del sistema', 'No se encontro el registro');
              return;
            }
            this.codigo.dtAsistencia = this.marcador;
          },
          error: () => {
            this.mensajeError('Mensaje del sistema', 'Error al buscar alumnos');
            this.buscar = true;
          },
        });
      }
    }
  }

  guardarAsistenciaScanner() {
    const marcar = this.codigo.dtAperTurnoInicio > this.codigo.dtAsistencia ? 1 : 2;
    this.codigo.iTipoAsiId = marcar;
    const enlace = {
      petition: 'post',
      group: 'asi',
      prefix: 'grupos',
      ruta: 'guardar-asistencia',
      data: {
        opcion: 'escaner',
        iEstudianteId: this.codigo.iEstudianteId,
        iMatrId: this.codigo.iMatrId,
        iNivelGradoId: this.codigo.iNivelGradoId,
        iTipoAsiId: this.codigo.iTipoAsiId,
        iSeccionId: this.codigo.iSeccionId,
        iSedeId: this.dremoPerfil.iSedeId,
        iYAcadId: this.dremoiYAcadId,
        dtAsistencia: this.formatoFecha(this.codigo.dtAsistencia),
        idAsistencia: this.codigo.idAsistencia,
      },
    };

    this.servicioGeneral.getRecibirDatos(enlace).subscribe({
      next: data => {
        const idAsistencia = parseInt(data.data[0]);
        const verificar = this.temporal.find(item => item.idAsistencia == idAsistencia);
        if (verificar) {
          this.mensajeSuccess('Mensaje del sistema', 'Éxito al guardar asistencia');
        } else {
          this.mensajeSuccess('Mensaje del sistema', 'Ya fue registrado el alumno');
        }
        this.temporal.push(this.codigo);
        this.visible = false;
        this.buscar = true;
      },
      error: () => {
        this.mensajeError('Mensaje del sistema', 'Error al guardar asistencia');
        this.visible = false;
        this.buscar = true;
      },
    });
  }

  formatoFecha(fecha: any) {
    const f = new Date(fecha);
    const year = f.getFullYear();
    const mes = String(f.getMonth() + 1).padStart(2, '0');
    const dia = String(f.getDate()).padStart(2, '0');
    const hora = String(f.getHours()).padStart(2, '0');
    const minuto = String(f.getMinutes()).padStart(2, '0');
    const segundo = String(f.getSeconds()).padStart(2, '0');

    return `${year}-${mes}-${dia}T${hora}:${minuto}:${segundo}`;
  }

  guardarAsistenciaAula() {
    this.alumnos.forEach(item => {
      if (item.dtAsistenciaHora) {
        const separado = item.dtAsistenciaHora.toString().split(':');
        item.dtAsistenciaHora = separado[0].slice(-2) + ':' + separado[1].slice(0, 2);
      }
    });

    const enviar = new FormData();
    enviar.append('asistencia', JSON.stringify(this.alumnos));
    enviar.append('iPersId', this.dremoPerfil.iPersId);
    enviar.append('iSedeId', this.dremoPerfil.iSedeId);
    enviar.append('iYAcadId', this.dremoiYAcadId);
    enviar.append('dtAsistencia', this.formatoFecha(this.datos.dtAsistencia));

    this.alumnos.forEach((item: any, index: number) => {
      if (item.subir) {
        enviar.append(`archivos[${index}]`, item.subir);
      }
    });

    const enlace = {
      petition: 'post',
      group: 'asi',
      prefix: 'grupos',
      ruta: 'guardar-asistencia-aula',
      data: enviar,
    };

    this.servicioGeneral.getMultipleMedia(enlace).subscribe({
      next: () => {
        this.buscarGrupo();
        this.mensajeSuccess('Mensaje del sistema', 'Éxito al guardar asistencia');
      },
      error: () => {
        this.buscarGrupo();
        this.mensajeError('Mensaje del sistema', 'Error al guardar asistencia');
      },
    });
  }

  guardarAsistencia() {
    const enviar = new FormData();
    enviar.append('opcion', 'estudiante');
    enviar.append('iMatrId', this.estudiante[0].iMatrId);
    enviar.append('iEstudianteId', this.estudiante[0].iEstudianteId);
    enviar.append('iNivelGradoId', this.estudiante[0].iNivelGradoId);
    enviar.append('iTipoAsiId', this.estudiante[0].iTipoAsiId);
    enviar.append('iSeccionId', this.estudiante[0].iSeccionId);
    enviar.append('iSedeId', this.dremoPerfil.iSedeId);
    enviar.append('iYAcadId', this.dremoiYAcadId);
    enviar.append('dtAsistencia', this.formatoFecha(this.datos.dtAsistencia));
    enviar.append('idAsistencia', this.estudiante[0].idAsistencia);
    enviar.append('iPersId', this.dremoPerfil.iPersId);
    enviar.append(`archivos`, this.estudiante[0].subir);

    const enlace = {
      petition: 'post',
      group: 'asi',
      prefix: 'grupos',
      ruta: 'guardar-asistencia',
      data: enviar,
    };

    this.servicioGeneral.getRecibirDatos(enlace).subscribe({
      next: () => {
        this.mensajeSuccess('Mensaje del sistema', 'Éxito al guardar asistencia');
        this.buscarCodigo();
      },
      error: () => {
        this.mensajeError('Mensaje del sistema', 'Error al guardar asistencia');
        this.buscarCodigo();
      },
    });
  }
  /**
   * filtramos las secciones
   * En caso de que se generen duplicados desde la DB, estos son eliminados
   */

  filtrarSeccion() {
    const gruposUnicos = new Set();
    this.seccion = this.aulas
      .filter(item => item.iGradoId === this.datos.iGradoId)
      .filter(item => {
        if (gruposUnicos.has(item.iSeccionId)) return false;
        gruposUnicos.add(item.iSeccionId);
        return true;
      });
  }

  mensajeSuccess(resumen: string, detalle: string) {
    this.messageService.add({
      severity: 'success',
      summary: resumen,
      detail: detalle,
    });
  }

  mensajeError(resumen: string, detalle: string) {
    this.messageService.add({
      severity: 'error',
      summary: resumen,
      detail: detalle,
    });
  }

  // filtramos extraemos los grados no repetidos
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

  camaraEncontrada() {
    this.estado = false;
    this.progreso = false;
  }

  seleccionarFolder(event: any, seleccionado: any, fileUpload: any) {
    const archivo = event.files[0];
    if (archivo) {
      seleccionado.subir = archivo;
      fileUpload.name = archivo.name[0];
    }
  }

  limpiar(fileUpload: any) {
    fileUpload.clear();
  }

  descargarArchivo(archivo: any) {
    const params = {
      petition: 'post',
      group: 'asi',
      prefix: 'asistencia',
      ruta: 'descargar-justificacion',
      data: {
        cJustificar: archivo,
      },
    };

    this.servicioGeneral.getRecibirMultimedia(params).subscribe({
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

  horaGeneral: any;

  aplicarHora() {
    this.alumnos.forEach(item => {
      item.dtAsistenciaHora = this.datos.dtAsistencia;
      item.habilitar = false;
    });
  }

  general: any[] = [
    {
      iTipoAsiId: '1',
      cTipoAsiLetra: 'A',
      bgColor: 'text-green-500',
    },
    {
      iTipoAsiId: '2',
      cTipoAsiLetra: 'T',
      bgColor: 'text-orange-500',
    },
  ];

  marcarUniversal: any;
  marcarTodo(event: any) {
    this.alumnos.forEach(item => {
      item.iTipoAsiId = event.value;
    });
  }
}
