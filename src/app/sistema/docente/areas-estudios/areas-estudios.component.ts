import { PrimengModule } from '@/app/primeng.module';
import { Component, OnInit, OnDestroy, inject, Input, OnChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from '@/app/servicios/general.service';
import { MessageService } from 'primeng/api';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { Subject, takeUntil } from 'rxjs';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { DOCENTE, ESTUDIANTE } from '@/app/servicios/perfilesConstantes';
interface Data {
  accessToken: string;
  refreshToken: string;
  expires_in: number;
  msg?;
  data?;
  validated?: boolean;
  code?: number;
}
@Component({
  selector: 'app-areas-estudios',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './areas-estudios.component.html',
  styleUrl: './areas-estudios.component.scss',
  providers: [MessageService],
})
export class AreasEstudiosComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('dv') dv!: Table;

  @Input() data = [];
  @Input() searchText: Event;
  private unsubscribe$ = new Subject<boolean>();
  private _constantesService = inject(ConstantesService);
  private _generalService = inject(GeneralService);

  constructor(
    private router: Router,
    private MessageService: MessageService,
    private store: LocalStoreService
  ) {
    this.iYAcadId = this._constantesService.iYAcadId;
    this.iPersId = this._constantesService.iPersId;
    this.iIieeId = this._constantesService.iIieeId;
    this.cIieeCodigoModular = this._constantesService.codModular;
    this.years = this.store.getItem('dremoYear');
  }

  years: any;
  cIieeCodigoModular: any;
  iIieeId: any;
  documentos: any = [];
  opcionCurso = [];
  idDocenteCurso: number;
  seleccionarCurso: any = '';
  cursoSilabos = [];
  visible: boolean = false;
  visibleProgramacion: boolean = false;
  selectedData = [];
  items = [];
  archivos: any = {};
  iYAcadId: any;
  iPersId: any;
  reglamento = [];
  visiblePortafolio: boolean = false;
  iPerfilId: number;
  reglamentoInterno: any;
  itinerarioInterno: any;
  portafolioInterno: any;
  formato: any = [];
  public DOCENTE = DOCENTE;
  public ESTUDIANTE = ESTUDIANTE;
  portafolio: any;
  ngOnInit() {
    this.iPerfilId = this._constantesService.iPerfilId;
    this.items = [
      {
        label: 'Programación curricular',
        icon: 'pi pi-angle-right',
        command: () => {
          this.goSection('silabo');
        },
      },
      {
        label: 'Material Educativo',
        icon: 'pi pi-angle-right',
        command: () => {
          this.goSection('material-educativo');
        },
      },
      {
        label: 'Asistencia',
        icon: 'pi pi-angle-right',
        command: () => {
          this.goSection('asistencia');
        },
      },
      {
        label: 'Resultado de evaluaciones',
        icon: 'pi pi-angle-right',
        command: () => {
          this.goSection('resultados');
        },
      },
      {
        label: 'Portafolio',
        icon: 'pi pi-angle-right',
        command: () => {
          this.goSection('portafolio');
        },
      },
    ];
  }
  ngOnChanges(changes) {
    if (changes.data?.currentValue) {
      this.data = changes.data.currentValue;
    }

    if (changes.searchText?.currentValue) {
      this.searchText = changes.searchText.currentValue;
      this.onGlobalFilter(this.dv, this.searchText);
    }
  }

  onGlobalFilter(table: Table, event: Event) {
    if (!table) return;
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  goSection(section) {
    switch (section) {
      case 'silabo':
        this.visibleProgramacion = true;
        this.archivos.idDocCursoId = this.selectedData['idDocCursoId'];
        this.archivos.iYAcadId = this.iYAcadId;
        this.archivos.iSilaboId = this.selectedData['iSilaboId'];
        this.archivos.iPersId = this.iPersId;
        const formato =
          typeof this.selectedData['cProgramacion'] === 'string'
            ? JSON.parse(this.selectedData['cProgramacion'])
            : this.selectedData['cProgramacion'];
        this.documentos = formato;
        break;
      case 'sesion-aprendizaje':
        this.router.navigateByUrl('docente/sesion-aprendizaje');
        break;
      case 'asistencia':
        this.router.navigateByUrl(
          'docente/asistencia/' +
            this.selectedData['iCursoId'] +
            '/' +
            this.selectedData['iNivelGradoId'] +
            '/' +
            this.selectedData['iSeccionId'] +
            '/' +
            this.selectedData['idDocCursoId'] +
            '/' +
            this.selectedData['iGradoId'] +
            '/' +
            this.selectedData['iCicloId'] +
            '/' +
            this.selectedData['iNivelId']
        );
        break;
      case 'material-educativo':
        this.router.navigateByUrl(
          'docente/material-educativo/' +
            this.selectedData['idDocCursoId'] +
            '/' +
            this.selectedData['cCursoNombre'].replace(/[\^*@!"#$%&/()=?¡!¿':\\]/gi, '') +
            '/' +
            this.selectedData['iCursosNivelGradId']
        );
        break;
      case 'resultados':
        this.router.navigate(
          ['./aula-virtual/areas-curriculares/', this.selectedData['iSilaboId'] || 0], // ruta con parámetro
          {
            queryParams: {
              cCursoNombre: this.selectedData['cCursoNombre'],
              cNivelTipoNombre: this.selectedData['cNivelTipoNombre'],
              cGradoAbreviacion: this.selectedData['cGradoAbreviacion'],
              cSeccionNombre: this.selectedData['cSeccionNombre'] || this.selectedData['cSeccion'],
              cCicloRomanos: this.selectedData['cCicloRomanos'],
              cNivelNombreCursos: this.selectedData['cNivelNombreCursos'],
              iCursoId: this.selectedData['iCursoId'],
              idDocCursoId: this.selectedData['idDocCursoId'],
              iNivelCicloId: this.selectedData['iNivelCicloId'],
              iIeCursoId: this.selectedData['iIeCursoId'],
              iSeccionId: this.selectedData['iSeccionId'],
              iNivelGradoId: this.selectedData['iNivelGradoId'],
              cantidad: this.selectedData['cantidad'],
              tab: 2,
            },
          }
        );
        break;
      case 'portafolio':
        if (this.selectedData['iSilaboId']) {
          this.visiblePortafolio = true;
          this.obtenerPortafolios();
        } else {
          this.MessageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Debes Ingresar un Silabo',
          });
        }

        break;
    }
  }

  descripcion: string;
  // importammos los silabos de los cursos dispnibles para la etiqueta modal
  importarSilabos(docentecurso: string[]) {
    this.descripcion =
      docentecurso['cCursoNombre'] +
      ' ' +
      docentecurso['cGradoAbreviacion'] +
      ' ' +
      docentecurso['cSeccionNombre'];
    this.cursoSilabos = docentecurso;
    // filtra los cursos que tienen un silabos
    const cursoId = docentecurso['iCursoId'];
    this.idDocenteCurso = docentecurso['idDocCursoId'];
    const cursos = this.data
      .filter(item => item.iSilaboId !== null && item.iCursoId == cursoId)
      .map(item => ({
        idDocCursoId: item.idDocCursoId,
        iSilaboId: item.iSilaboId,
        curso: item.cCursoNombre + ' ' + item.cGradoAbreviacion + ' ' + item.cSeccionNombre,
      }));
    this.opcionCurso = cursos;
    this.visible = true;
  }

  guardarImportacion() {
    const seleccionado = this.opcionCurso.filter(
      item => item.idDocCursoId == this.seleccionarCurso
    );

    const params = {
      petition: 'post',
      group: 'acad',
      prefix: 'docente',
      ruta: 'importar_silabos',
      data: {
        idDocCursoId: this.idDocenteCurso,
        iSilaboId: seleccionado[0]['iSilaboId'],
      },
    };

    this._generalService
      .getGralPrefix(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: Data) => {
          this.cursoSilabos['iSilaboId'] = response.data[0];
          this.MessageService.add({
            severity: 'success',
            summary: '¡Genial!',
            detail: 'Importacion Exitosa',
          });
        },
        complete: () => {},
        error: error => {
          console.log(error);
        },
      });
    this.visible = false;
  }
  getSilaboPdf(curso: string, grado: string, seccion: string, iSilaboId) {
    if (!iSilaboId) return;
    const params = {
      petition: 'post',
      group: 'docente',
      prefix: 'silabus_reporte',
      ruta: 'report',
      data: {
        iSilaboId: iSilaboId,
      },
    };
    const fechas = new Date();
    const dia = fechas.getDate();
    const mes =
      fechas.getMonth().toString().length > 1 ? fechas.getMonth() : '0' + fechas.getMonth(); // Se cambia el formato del mes cuando sea 1 digito se le aumentara un 0 adelante
    const years = fechas.getFullYear();
    this._generalService.generarPdf(params).subscribe({
      next: response => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download =
          'silabo_' +
          curso.toLowerCase() +
          '_' +
          grado.toLowerCase() +
          '_' +
          seccion.toLowerCase() +
          '_' +
          dia +
          '_' +
          mes +
          '_' +
          years +
          '.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      complete: () => {},
      error: error => {
        console.log(error);
      },
    });
  }
  ngOnDestroy() {
    this.unsubscribe$.next(true);
  }

  seleccionar(event: any, fileUpload: any) {
    const file = event.files && event.files.length > 0 ? event.files[0] : null;
    if (file) {
      this.archivos.enlace = file;
    } else {
      this.archivos.enlace = null;
    }
    const enviar = new FormData();
    enviar.append('idDocCursoId', this.archivos.idDocCursoId);
    enviar.append('iSilaboId', this.archivos.iSilaboId);
    enviar.append('iYAcadId', this.archivos.iYAcadId);
    enviar.append('iPersId', this.archivos.iPersId);
    enviar.append('archivo', this.archivos.enlace);
    enviar.append('portafolio', 'programacion-curricular');

    const params = {
      petition: 'post',
      group: 'acad',
      prefix: 'docente',
      ruta: 'guardar_programacion',
      data: enviar,
    };

    this._generalService.getRecibirDatos(params).subscribe({
      next: respuesta => {
        const resultado = respuesta.data;
        if (resultado.estado > 0) {
          const index = this.data.findIndex(
            item =>
              this.selectedData['idDocCursoId'] === item.idDocCursoId &&
              this.selectedData['iSeccionId'] === item.iSeccionId &&
              this.selectedData['iCursoId'] === item.iCursoId
          );
          const formato = JSON.parse(resultado.documento);

          this.data[index].iSilaboId = resultado.estado;
          this.data[index].cProgramacion = resultado.estado;

          this.documentos = formato;
          fileUpload.clear();

          this.MessageService.add({
            severity: 'success',
            summary: 'Exito en el Registro',
            detail: 'Programacion Curricular Actualizada',
          });
        } else {
          this.MessageService.add({
            severity: 'warning',
            summary: 'Problemas para Registrar',
            detail: 'Programacion Curricular No Actualizada',
          });
        }
      },
      error: error => {
        console.log(error);
      },
    });
  }

  obtenerPortafolios() {
    const iPortafolioId = this.selectedData['iPortafolioId'];
    const iCuadernoId = this.selectedData['iCuadernoId'];

    const params = {
      petition: 'post',
      group: 'docente',
      prefix: 'portafolios',
      ruta: 'obtenerPortafolios',
      data: {
        iPortafolioId: iPortafolioId,
        iCuadernoId: iCuadernoId,
        iIieeId: this._constantesService.iIieeId,
      },
    };
    this._generalService.getRecibirDatos(params).subscribe({
      next: respuesta => {
        const datos = respuesta.data[0];
        this.reglamentoInterno = JSON.parse(datos.reglamento) || null;
        this.itinerarioInterno = JSON.parse(datos.itinerario) || null;
        this.formato = JSON.parse(datos.portafolio) || null;
        console.log('revicion', this.formato);
      },
      error: err => {
        console.log(err);
      },
    });
  }

  descargarArchivo(archivo: any) {
    const params = {
      petition: 'post',
      group: 'acad',
      prefix: 'docente',
      ruta: 'decargar-documento',
      data: {
        archivo: archivo,
      },
    };

    this._generalService.getRecibirMultimedia(params).subscribe({
      next: async (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.click();
      },
      error: error => {
        console.error('Error obteniendo encuesta:', error);
        this.MessageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  subirPortafolio(event: any, tipo) {
    return new Promise((resolve, reject) => {
      const file = event.files && event.files.length > 0 ? event.files[0] : null;
      if (file) {
        this.archivos.enlace = file;
      } else {
        this.archivos.enlace = null;
        return;
      }

      if (!this.iPersId || !this.iYAcadId || !this.cIieeCodigoModular || !this.years) {
        return;
      }

      const enviar = new FormData();
      enviar.append('tipoPortafolio', tipo);
      enviar.append('iPersId', this.iPersId);
      enviar.append('iYAcadId', this.iYAcadId);
      enviar.append('archivo', this.archivos.enlace);
      enviar.append('cIieeCodigoModular', this.cIieeCodigoModular);
      enviar.append('years', this.years);
      const params = {
        petition: 'post',
        group: 'acad',
        prefix: 'docente',
        ruta: 'guardar_portafolio_documento',
        data: enviar,
      };

      this._generalService.getRecibirDatos(params).subscribe({
        next: respuesta => {
          resolve(respuesta);
        },
        error: error => {
          reject(error);
        },
      });
    });
  }

  async guardarActividades(event: any) {
    try {
      const datos = await this.subirPortafolio(event, 1);
      const direccion = datos['data'];
      this.formato[0] = { tipo: '1', name: event.files[0].name, ruta: direccion };

      const params = {
        petition: 'post',
        group: 'doc',
        prefix: 'portafolio',
        ruta: 'guardar_cuaderno',
        data: {
          cCuadernoUrl: JSON.stringify(this.formato),
          iCuadernoId: this.selectedData['iCuadernoId'],
          iSilaboId: this.selectedData['iSilaboId'],
        },
      };

      this._generalService.getRecibirDatos(params).subscribe({
        next: () => {
          this.MessageService.add({
            severity: 'success',
            summary: 'Exito de Registro',
            detail: 'Se guardo el archivo Actividades',
          });
        },
        error: err => {
          this.MessageService.add({
            severity: 'error',
            summary: 'Error de Registro',
            detail: err,
          });
        },
      });
    } catch (err) {
      this.MessageService.add({
        severity: 'error',
        summary: 'Error de Registro',
        detail: err,
      });
    }
  }
  async guardarCuaderno(event: any) {
    try {
      const datos = await this.subirPortafolio(event, 1);
      const direccion = datos['data'];
      this.formato[1] = { tipo: '2', name: event.files[0].name, ruta: direccion };

      const params = {
        petition: 'post',
        group: 'doc',
        prefix: 'portafolio',
        ruta: 'guardar_cuaderno',
        data: {
          cCuadernoUrl: JSON.stringify(this.formato),
          iCuadernoId: this.selectedData['iCuadernoId'],
          iSilaboId: this.selectedData['iSilaboId'],
        },
      };

      this._generalService.getRecibirDatos(params).subscribe({
        next: () => {
          this.MessageService.add({
            severity: 'success',
            summary: 'Exito de Registro',
            detail: 'Se guardo el archivo Cuaderno de Campo',
          });
        },
        error: err => {
          this.MessageService.add({
            severity: 'error',
            summary: 'Error de Registro',
            detail: err,
          });
        },
      });
    } catch (err) {
      this.MessageService.add({
        severity: 'error',
        summary: 'Error de Registro',
        detail: err,
      });
    }
  }
  async guardarInstrumentos(event: any) {
    try {
      const datos = await this.subirPortafolio(event, 2);
      const direccion = datos['data'];
      this.formato[2] = { tipo: '3', name: event.files[0].name, ruta: direccion };

      const params = {
        petition: 'post',
        group: 'doc',
        prefix: 'portafolio',
        ruta: 'guardar_cuaderno',
        data: {
          cCuadernoUrl: JSON.stringify(this.formato),
          iCuadernoId: this.selectedData['iCuadernoId'],
          iSilaboId: this.selectedData['iSilaboId'],
        },
      };

      this._generalService.getRecibirDatos(params).subscribe({
        next: () => {
          this.MessageService.add({
            severity: 'success',
            summary: 'Exito de Registro',
            detail: 'Se guardo el archivo Itinerario',
          });
        },
        error: err => {
          this.MessageService.add({
            severity: 'error',
            summary: 'Error de Registro',
            detail: err,
          });
        },
      });
    } catch (err) {
      this.MessageService.add({
        severity: 'error',
        summary: 'Error de Registro',
        detail: err,
      });
    }
  }

  async guardarItinerario(event: any) {
    try {
      const datos = await this.subirPortafolio(event, 2);
      const direccion = datos['data'];
      this.itinerarioInterno = [{ name: event.files[0].name, ruta: direccion }];

      const params = {
        petition: 'post',
        group: 'docente',
        prefix: 'portafolios',
        ruta: 'guardarItinerario',
        data: {
          iDocenteId: this._constantesService.iDocenteId,
          iYAcadId: this.iYAcadId,
          cPortafolioItinerario: JSON.stringify(this.itinerarioInterno),
          iSedeId: this._constantesService.iSedeId,
          iSilaboId: this.selectedData['iSilaboId'],
        },
      };

      this._generalService.getRecibirDatos(params).subscribe({
        next: () => {
          this.MessageService.add({
            severity: 'success',
            summary: 'Exito de Registro',
            detail: 'Se guardo el archivo Itinerario',
          });
        },
        error: err => {
          this.MessageService.add({
            severity: 'error',
            summary: 'Error de Registro',
            detail: err,
          });
        },
      });
    } catch (err) {
      this.MessageService.add({
        severity: 'error',
        summary: 'Error de Registro',
        detail: err,
      });
    }
  }
  obtenerReglamento() {
    const params = {
      petition: 'post',
      group: 'docente',
      prefix: 'portafolios',
      ruta: 'obtenerPortafolios',
      data: {
        iYacadId: this.iYAcadId,
        iDocenteId: this._constantesService.iDocenteId,
        iIieeId: this.iIieeId,
      },
    };
    this._generalService.getRecibirDatos(params).subscribe({
      next: respuesta => {
        console.log('ver #1', respuesta);
      },
      error: err => {
        this.MessageService.add({
          severity: 'error',
          summary: 'Error al Obtener Reglamento',
          detail: err,
        });
      },
    });
  }
}
