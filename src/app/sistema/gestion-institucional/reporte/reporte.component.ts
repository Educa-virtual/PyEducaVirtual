import { Component, inject } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { CommonModule } from '@angular/common';
import { GeneralService } from '@/app/servicios/general.service';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { ReporteProgresoService } from '../../estudiante/reportes-academicos/reporte-progreso/services/reporte-progreso.service';
import { TablaReporteProgresoComponent } from '../../estudiante/reportes-academicos/tabla-reporte-progreso/tabla-reporte-progreso.component';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-reporte',
  standalone: true,
  imports: [PrimengModule, CommonModule, FormsModule, TablaReporteProgresoComponent],
  templateUrl: './reporte.component.html',
  styleUrl: './reporte.component.scss',
  providers: [MessageService],
})
export class ReporteComponent {
  private GeneralService = inject(GeneralService);
  persona = false;
  historico = false;
  datos = [];
  secciones = [];
  columna = []; // almacena los años y grados de los estudiantes por busqueda por estudiante
  fila = []; // almacena el area curricular y sus notas las notas de los estudiantes por busqueda por estudiante
  documento = '';
  showGrados = false;
  showAlumnos = false;
  iiee = '';
  grados = [];
  years = [];
  identidad: any;
  historial: any[];
  final: any;
  curricular = [];
  selectYear: any[];
  selectGrado: any[];
  areasColumnas: string[];
  estudianteFilas: string[];
  academicoGrado: string[];
  notas: string[];
  ListGarados: string;
  alumnos = [];
  habilitar = true;
  balanceFrozen: boolean = false;
  selSeccion: string;
  cursos: string[] = [];
  tablaEstudiantes: any[] = [];
  iYAcadId: number;
  anioEscolar: number;
  courses: any = []; //Para la tabla del reporte

  constructor(
    private messageService: MessageService,
    private ConstantesService: ConstantesService,
    private store: LocalStoreService,
    private reporteProgresoService: ReporteProgresoService
  ) {
    this.iiee = this.ConstantesService.iIieeId;
    this.grados = JSON.parse(this.ConstantesService.grados);
    this.years = this.ConstantesService.years;
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.anioEscolar = this.store.getItem('dremoYear');
  }

  limpiar() {
    this.fila = [];
    this.columna = [];
    this.documento = '';
    this.persona = false;
    this.historico = false;
    this.courses = [];
  }
  buscarAlumnos(grupo: string) {
    this.selSeccion = grupo;
    this.notas.map(item => {
      if (item['cSeccionNombre'] == grupo) {
        this.alumnos.push(item);
      }
    });
    this.showAlumnos = true;
    this.organizarEstudiantes();
  }

  organizarEstudiantes() {
    this.cursos = Array.from(new Set(this.alumnos.map(e => e.cCursoNombre))); // Obtener lista de cursos únicos.
    this.tablaEstudiantes = [];

    // Agrupar los estudiantes por nombre y agregar las notas correspondientes.
    const estudiantesAgrupados = this.alumnos.reduce(
      (
        acc,
        { iEstudianteId, cEstNombres, cEstPaterno, cEstMaterno, cCursoNombre, nDetMatrPromedio }
      ) => {
        if (!acc[iEstudianteId]) {
          acc[iEstudianteId] = {
            cEstNombres,
            cEstPaterno,
            cEstMaterno,
          }; // Inicializar el objeto del estudiante.
        }
        acc[iEstudianteId][cCursoNombre] = nDetMatrPromedio; // Agregar la nota al curso correspondiente.
        return acc;
      },
      {}
    );
    // Convertir el objeto en un array para la tabla
    this.tablaEstudiantes = Object.values(estudiantesAgrupados);
    this.habilitar = false;
  }
  calcularPromedio(estudiante: any): number {
    const notas = this.cursos
      .map(curso => estudiante[curso])
      .filter(nota => typeof nota === 'number');
    if (notas.length === 0) return 0;
    const suma = notas.reduce((acc, nota) => acc + ((nota * 3) / 8 + 2.5), 0);
    return suma / notas.length;
  }
  limpiarGrado() {
    this.habilitar = true;
    this.cursos = [];
    this.tablaEstudiantes = [];
    this.selSeccion = '';
    this.cursos = [];
    this.alumnos = [];
    this.academicoGrado = [];
    this.notas = [];
    this.showGrados = false;
    this.showAlumnos = false;
    //this.generarListaGrados()
  }

  reporteGrado() {
    const indexGrado = this.grados.findIndex(item => item.iGradoId == this.selectGrado);

    this.ListGarados = this.grados[indexGrado]['cGradoNombre'];

    // this.notas.map((item) => {
    //     const verSeccion = this.secciones.find(
    //         (list) => list['seccion'] == item['cSeccionNombre']
    // )})

    const params = {
      petition: 'post',
      group: 'aula-virtual',
      prefix: 'academico',
      ruta: 'reporte_grado',
      data: {
        cursos: JSON.stringify(this.cursos),
        alumnos: JSON.stringify(this.alumnos),
        iIieeId: this.iiee,
        nombreGrado: this.ListGarados,
        nombreSeccion: this.selSeccion,
      },
    };
    this.getReportePdf(params);
  }
  buscarGrado() {
    if (this.selectGrado != undefined && this.selectYear != undefined) {
      const params = {
        petition: 'post',
        group: 'aula-virtual',
        prefix: 'academico',
        ruta: 'obtener_academico_grado',
        data: {
          iGrado: this.selectGrado,
          iYear: this.selectYear,
          iIieeId: this.iiee,
        },
      };
      this.getInformation(params, 'obtenerAcademicoGrado');
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Mensaje',
        detail: 'No ha seleccionado el grado o Seccion',
      });
    }
  }
  // Genera la tabla de grados
  generarListaGrados() {
    if (this.notas) {
      this.showGrados = true;
      const indexGrado = this.grados.findIndex(item => item.iGradoId == this.selectGrado);
      this.ListGarados = `${this.grados[indexGrado]['cGradoNombre']} (${this.grados[indexGrado]['cGradoAbreviacion']})`;

      this.notas.map(item => {
        const verSeccion = this.secciones.find(list => list['seccion'] == item['cSeccionNombre']);
        if (!verSeccion) {
          this.secciones.push({ seccion: item['cSeccionNombre'] });
        }
        const verArea = this.curricular.find(element => element['area'] == item['cCursoNombre']);
        if (!verArea) {
          this.curricular.push({ area: item['cCursoNombre'] });
        }
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Mensaje',
        detail: 'No existen datos',
      });
    }
  }
  buscarDocumento() {
    if (this.documento != '') {
      this.courses = [];
      this.identidad = [];
      this.persona = false;
      this.reporteProgresoService
        .buscarEstudiantePorDocumentoSede(this.documento, this.iYAcadId)
        .subscribe({
          next: (response: any) => {
            //this.courses = response.data;
            if (response.data) {
              this.persona = true;
              this.identidad = [
                {
                  nombre: response.data.cPersNombre,
                  paterno: response.data.cPersPaterno,
                  materno: response.data.cPersMaterno,
                },
              ];
            } else {
              this.messageService.add({
                severity: 'warn',
                summary: 'Sin datos',
                detail:
                  'No hay datos para el documento ingresado o el estudiante no pertenece a su I.E.',
              });
            }
          },
          error: err => {
            this.messageService.add({
              severity: 'error',
              summary: 'Problema al obtener reporte',
              detail: err.error.message || 'Error desconocido',
            });
          },
        });
      /*const params = {
              petition: 'post',
              group: 'aula-virtual',
              prefix: 'academico',
              ruta: 'obtener_datos',
              data: {
                cPersDocumento: this.documento,
                iIieeId: this.iiee,
              },
            };
            this.getInformation(params, 'obtenerHistorial');*/
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Mensaje',
        detail: 'Debe Ingresar Documento de Identidad',
      });
    }
  }
  mostrarReporte() {
    const params = {
      petition: 'post',
      group: 'aula-virtual',
      prefix: 'academico',
      ruta: 'reporte_academico',
      data: {
        cPersDocumento: this.documento,
        iIieeId: this.iiee,
      },
    };
    this.getReportePdf(params);
  }
  /*mostrarHistorial() {
          this.historial = JSON.parse(this.datos[0]['historial'])
          this.fila = []
          this.columna = []
          this.historial.forEach((item) => {
              const area = this.fila.find(
                  (box) => box.cCursoNombre === item.cCursoNombre
              )
              if (!area) {
                  this.fila.push({
                      cCursoNombre: item.cCursoNombre,
                      nota: [{ promedio: item.nDetMatrPromedio }],
                  })
              } else {
                  const nuevo = this.fila.find(
                      (box) => box.cCursoNombre === item.cCursoNombre
                  )
                  nuevo.nota.push({ promedio: item.nDetMatrPromedio })
              }
              const encabezado = this.columna.find(
                  (box) => box.cGradoAbreviacion === item.cGradoAbreviacion
              )
              if (!encabezado) {
                  this.columna.push({
                      cGradoAbreviacion: item.cGradoAbreviacion,
                      cYAcadNombre: item.cYAcadNombre,
                  })
              }
          })

          this.final = [
              { promedio: '#' },
              { promedio: 'Resultados' },
              { promedio: '-' },
              { promedio: '-' },
              { promedio: '-' },
              { promedio: '-' },
              { promedio: '-' },
          ]

          this.columna.sort((a, b) => {
              return a.cYAcadNombre - b.cYAcadNombre
          })
          this.fila.sort((a, b) => {
              return a.cCursoNombre.localeCompare(b.cCursoNombre)
          })
          this.fila.forEach((box) => {
              box.nota.sort((a, b) => {
                  return a.year - b.year
              })
          })

          this.historico = true
      }*/

  generarReporteEstudiante() {
    this.reporteProgresoService.obtenerReporteDirector(this.documento, this.iYAcadId).subscribe({
      next: (response: any) => {
        this.courses = response.data;
      },
      error: err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Problema al obtener reporte',
          detail: err.error.message || 'Error desconocido',
        });
      },
    });
  }

  async descargarReporteEstudiante() {
    try {
      const response: Blob = await firstValueFrom(
        this.reporteProgresoService.generarReportePdfDirector(this.documento, this.iYAcadId)
      );
      const link = document.createElement('a');
      link.href = URL.createObjectURL(response);
      link.download = 'Reporte de progreso.pdf';
      link.click();
    } catch (err: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Problema al descargar el archivo',
        detail: err?.error?.message || 'Error desconocido',
      });
    }
  }

  getInformation(params, accion) {
    this.GeneralService.getGralPrefix(params).subscribe({
      next: (response: any) => {
        this.accionBtnItem({ accion, item: response?.data });
      },
      complete: () => {},
    });
  }
  getReportePdf(data: any) {
    this.GeneralService.generarPdf(data).subscribe({
      next: response => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'archivo.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      complete: () => {},
      error: error => {
        console.log(error);
      },
    });
  }
  accionBtnItem(event): void {
    const { accion } = event;
    const { item } = event;

    switch (accion) {
      /*case 'obtenerHistorial':
              this.datos = item;
              if (this.datos) {
                this.identidad = [
                  {
                    nombre: this.datos[0]['cEstNombres'],
                    paterno: this.datos[0]['cEstPaterno'],
                    materno: this.datos[0]['cEstMaterno'],
                  },
                ];
                this.persona = true;
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Sin datos para mostrar',
                  detail: 'No se encontraron datos para mostrar con el documento ingresado',
                });
              }
              break;*/
      case 'obtenerAcademicoGrado':
        this.academicoGrado = item;
        this.notas = JSON.parse(this.academicoGrado[0]['notas']);
        this.generarListaGrados();
        break;
      case 'test':
        // console.table(item)
        break;
    }
  }
}
