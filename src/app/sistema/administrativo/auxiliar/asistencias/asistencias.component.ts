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
  finalizar: boolean = false;
  scanner: boolean = false;
  progreso: boolean = false;
  registrarEstudiante: boolean = false;
  temporal: any = [];
  tipoAsistencia = [
    {
      iTipoAsiId: '1',
      cTipoAsiLetra: 'X',
      cTipoAsiNombre: 'Asistio',
      textColor: 'green-50-boton',
      bgColor: 'green-boton',
    },
    {
      iTipoAsiId: '2',
      cTipoAsiLetra: 'T',
      cTipoAsiNombre: 'Tardanza',
      textColor: 'red-50-boton',
      bgColor: 'red-boton',
    },
    {
      iTipoAsiId: '3',
      cTipoAsiLetra: 'I',
      cTipoAsiNombre: 'Inasistencia',
      textColor: 'primary-50-boton',
      bgColor: 'primary-boton',
    },
    {
      iTipoAsiId: '4',
      cTipoAsiLetra: 'J',
      cTipoAsiNombre: 'Inasistencia Justificada',
      textColor: 'orange-50-boton',
      bgColor: 'orange-boton',
    },
    {
      iTipoAsiId: '9',
      cTipoAsiLetra: 'P',
      cTipoAsiNombre: 'Tardanza Justificada',
      textColor: 'cyan-50-boton',
      bgColor: 'cyan-boton',
    },
    {
      iTipoAsiId: '7',
      cTipoAsiLetra: '-',
      cTipoAsiNombre: 'Sin Registro',
      textColor: 'yellow-50-boton',
      bgColor: 'yellow-boton',
    },
  ];

  constructor(
    private messageService: MessageService,
    private store: LocalStoreService
  ) {
    this.dremoiYAcadId = this.store.getItem('dremoiYAcadId');
    this.dremoPerfil = this.store.getItem('dremoPerfil');
  }

  ngOnInit() {
    this.buscarAulas();
  }

  // busca las aulas de la institucion
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
    if (this.datos.iGradoId && this.datos.iSeccionId && this.datos.dtAsistencia) {
      this.finalizar = true;

      const enlace = {
        petition: 'post',
        group: 'asi',
        prefix: 'grupos',
        ruta: 'buscar-lista-estudiantes',
        data: {
          opcion: 'buscar-grupo',
          dtAsistencia: this.datos.dtAsistencia,
          iGradoId: this.datos.iGradoId,
          iSeccionId: this.datos.iSeccionId,
          iSedeId: this.dremoPerfil.iSedeId,
          iYAcadId: this.dremoiYAcadId,
        },
      };

      this.servicioGeneral.getRecibirDatos(enlace).subscribe({
        next: data => {
          this.alumnos = data.data;
          this.alumnos.forEach(item => {
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
    if (this.datos.cEstCodigo || this.datos.cPersDocumento) {
      const enlace = {
        petition: 'post',
        group: 'asi',
        prefix: 'grupos',
        ruta: 'buscar-lista-estudiantes',
        data: {
          opcion: 'buscar-estudiante',
          cEstCodigo: this.datos.cEstCodigo,
          dtAsistencia: this.datos.dtAsistencia,
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
    }
  }
  escaner(qr: string) {
    this.scanner = false;
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
          opcion: 'buscar-estudiante',
          cEstCodigo: this.datos.cEstCodigo,
          cPersDocumento: this.datos.cPersDocumento,
          iSedeId: this.dremoPerfil.iSedeId,
          iYAcadId: this.dremoiYAcadId,
        },
      };

      this.servicioGeneral.getRecibirDatos(enlace).subscribe({
        next: data => {
          this.codigo = data.data[0];
          const fecha = new Date();
          const fechas =
            fecha.getFullYear() +
            '-' +
            (fecha.getMonth() + 1).toString().padStart(2, '0') +
            '-' +
            fecha.getDate().toString().padStart(2, '0');
          const hora =
            fecha.getHours().toString().padStart(2, '0') +
            ':' +
            fecha.getMinutes().toString().padStart(2, '0') +
            ':' +
            fecha.getSeconds().toString().padStart(2, '0');
          const fechaCompleta = new Date(fechas + ' ' + hora);
          this.codigo.dtAsistencia = fechaCompleta;
          const marcar = this.codigo.dtTurnoInicia > fechaCompleta ? 1 : 2;
          this.codigo.iTipoAsiId = marcar;
        },
        error: () => {
          this.mensajeError('Mensaje del sistema', 'Error al buscar alumnos');
        },
      });
    }
  }

  guardarAsistenciaSacnner() {
    const enlace = {
      petition: 'post',
      group: 'asi',
      prefix: 'grupos',
      ruta: 'guardar-asistencia',
      data: {
        iEstudianteId: this.codigo.iEstudianteId,
        iMatrId: this.codigo.iMatrId,
        iNivelGradoId: this.codigo.iNivelGradoId,
        iTipoAsiId: this.codigo.iTipoAsiId,
        iSeccionId: this.codigo.iSeccionId,
        iSedeId: this.dremoPerfil.iSedeId,
        iYAcadId: this.dremoiYAcadId,
        dtAsistencia: this.codigo.dtAsistencia,
        idAsistencia: this.codigo.idAsistencia,
      },
    };

    this.servicioGeneral.getRecibirDatos(enlace).subscribe({
      next: data => {
        const resultado = parseInt(data.data[0].resultado);
        if (resultado > 0) {
          this.temporal.push(this.codigo);
        }
        this.mensajeSuccess('Mensaje del sistema', 'Existo al guardar asistencia');
        this.visible = false;
      },
      error: () => {
        this.mensajeError('Mensaje del sistema', 'Error al guardar asistencia');
        this.visible = false;
      },
    });
  }

  guardarAsistenciaAula() {
    console.log(this.alumnos);
    /*
    const enlace = {
      petition: 'post',
      group: 'asi',
      prefix: 'grupos',
      ruta: 'guardar-asistencia-aula',
      data: {
        asistencia: JSON.stringify(this.alumnos),
        dtAsistencia: this.datos.dtAsistencia,
        iSedeId: this.dremoPerfil.iSedeId,
        iYAcadId: this.dremoiYAcadId,
      },
    };

    this.servicioGeneral.getRecibirDatos(enlace).subscribe({
      next: () => {
        this.buscarGrupo();
        this.mensajeSuccess('Mensaje del sistema', 'Existo al guardar asistencia');
      },
      error: () => {
        this.buscarGrupo();
        this.mensajeError('Mensaje del sistema', 'Error al guardar asistencia');
      },
    });*/
  }

  guardarAsistencia() {
    const enlace = {
      petition: 'post',
      group: 'asi',
      prefix: 'grupos',
      ruta: 'guardar-asistencia',
      data: {
        iMatrId: this.estudiante[0].iMatrId,
        iEstudianteId: this.estudiante[0].iEstudianteId,
        iNivelGradoId: this.estudiante[0].iNivelGradoId,
        iTipoAsiId: this.estudiante[0].iTipoAsiId,
        iSeccionId: this.estudiante[0].iSeccionId,
        iSedeId: this.dremoPerfil.iSedeId,
        iYAcadId: this.dremoiYAcadId,
        dtAsistencia: this.datos.dtAsistencia,
        idAsistencia: this.estudiante[0].idAsistencia,
      },
    };

    this.servicioGeneral.getRecibirDatos(enlace).subscribe({
      next: () => {
        this.mensajeSuccess('Mensaje del sistema', 'Existo al guardar asistencia');
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

  // cambiar estado de asistencia
  /**
   *
   * @param valor encontrar el indice de tipoAsistencia
   * @param tipoAsistencia es el array de objetos de los tipo de asistencia
   * @param indice le asignamos un nuevo indice con un limitador
   */
  cambiarEstado(index: any, item: any) {
    const valor = this.tipoAsistencia.findIndex(valor => valor.iTipoAsiId == item);
    const indice = (Number(valor) + 1) % this.tipoAsistencia.length;
    this.alumnos[index].iTipoAsiId = this.tipoAsistencia[indice].iTipoAsiId;
    this.alumnos[index].cTipoAsiLetra = this.tipoAsistencia[indice].cTipoAsiLetra;
    this.alumnos[index].cTipoAsiNombre = this.tipoAsistencia[indice].cTipoAsiNombre;
  }
  cambiarEstadoEstudiante(index: any, item: any) {
    const valor = this.tipoAsistencia.findIndex(valor => valor.iTipoAsiId == item);
    const indice = (Number(valor) + 1) % this.tipoAsistencia.length;
    this.estudiante[index].iTipoAsiId = this.tipoAsistencia[indice].iTipoAsiId;
    this.estudiante[index].cTipoAsiLetra = this.tipoAsistencia[indice].cTipoAsiLetra;
    this.estudiante[index].cTipoAsiNombre = this.tipoAsistencia[indice].cTipoAsiNombre;
  }
  camaraEncontrada() {
    this.progreso = false;
  }
  seleccionarFolder(event: any, alumno: any, fileUpload: any) {
    fileUpload.clear();
    const archivo = event.files[0];
    if (archivo) {
      alumno.cJustificar = archivo;
      // Limpia el fileUpload para permitir volver a subir el mismo archivo
    } else {
      fileUpload.name = archivo.name[0];
    }
  }
}
