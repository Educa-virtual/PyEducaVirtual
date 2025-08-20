import { Component, OnInit, inject } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component';
import { GeneralService } from '@/app/servicios/general.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-asistencias',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent],
  templateUrl: './asistencias.component.html',
  styleUrl: './asistencias.component.scss',
})
export class AsistenciasComponent implements OnInit {
  private servicioGeneral = inject(GeneralService);
  dremoiYAcadId: any;
  dremoPerfil: any;
  grado: any;
  seccion: any;
  aulas: any = [];
  finalizar: boolean = false;
  datos: any = {};
  registro: any = [];
  alumnos: any = [];

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
      iTipoAsiId: '7',
      cTipoAsiLetra: '-',
      cTipoAsiNombre: 'Sin Registro',
      textColor: 'yellow-50-boton',
      bgColor: 'yellow-boton',
    },
    {
      iTipoAsiId: '9',
      cTipoAsiLetra: 'P',
      cTipoAsiNombre: 'Tardanza Justificada',
      textColor: 'cyan-50-boton',
      bgColor: 'cyan-boton',
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
    if (this.datos.iGradoId && this.datos.iSeccionId) {
      this.finalizar = true;
      this.servicioGeneral
        .getRecibirDatos({
          petition: 'post',
          group: 'asi',
          prefix: 'grupos',
          ruta: 'buscar-grado-seccion',
          data: {
            dtFecha: this.datos.fecha,
            iGradoId: this.datos.iGradoId,
            iSeccionId: this.datos.iSeccionId,
            iSedeId: this.dremoPerfil.iSedeId,
            iYAcadId: this.dremoiYAcadId,
          },
        })
        .subscribe({
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
            console.log('verificar #1 ', this.alumnos);
          },
          error: err => {
            console.log(err);
          },
          complete: () => {
            this.finalizar = false;
          },
        });
    } else {
      this.mensajeError('Mensaje del sistema', 'Debes Seleccionar un Grado');
    }
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
}
