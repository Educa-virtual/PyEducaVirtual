import { Component, inject, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { GeneralService } from '@/app/servicios/general.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { catchError, map, throwError } from 'rxjs';
import { ApiEvaluacionesService } from '../../aula-virtual/services/api-evaluaciones.service';
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-portafolio',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent],
  templateUrl: './portafolio.component.html',
  styleUrl: './portafolio.component.scss',
})
export class PortafolioComponent implements OnInit {
  private _ConstantesService = inject(ConstantesService);
  private _GeneralService = inject(GeneralService);
  private _MessageService = inject(MessageService);
  private http = inject(HttpClient);
  private _LocalStoreService = inject(LocalStoreService);
  private _evaluacionApiService = inject(ApiEvaluacionesService);
  private router = inject(Router);
  nuevaRubrica: boolean = false;
  backend = environment.backend;
  private backendApi = environment.backendApi;

  cPortafolioFichaPermanencia;
  cPortafolioPerfilEgreso;
  cPortafolioPlanEstudios;
  cPortafolioItinerario = [];
  cPortafolioProgramaCurricular;
  cPortafolioFichasDidacticas;
  cPortafolioSesionesAprendizaje;

  portafolio: any = {};
  reglamento = [];
  rubricas = [];
  cursos = [];
  showModalRubricas: boolean = false;
  eventoRubrica: boolean = false;
  public columnasTabla = [
    {
      type: 'text',
      width: '5rem',
      field: 'cInstrumentoNombre',
      header: 'Instrumento de Evaluación',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'text',
      width: '10rem',
      field: 'cInstrumentoDescripcion',
      header: 'Descripcion',
      text_header: 'left',
      text: 'left',
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

  public accionesTabla: any[] = [
    {
      labelTooltip: 'Editar',
      icon: 'pi pi-pencil',
      accion: 'editar',
      type: 'item',
      class: 'p-button-rounded p-button-succes p-button-text',
    },
    {
      labelTooltip: 'Eliminar',
      icon: 'pi pi-trash',
      accion: 'eliminar',
      type: 'item',
      class: 'p-button-rounded p-button-danger p-button-text',
    },
  ];

  ngOnInit() {
    this.obtenerPortafolios();
    this.obtenerCuadernosCampo();
    this.obtenerRubricas();
  }
  getInformation(params, accion) {
    this._GeneralService.getGralPrefix(params).subscribe({
      next: response => {
        if (accion === 'docente-obtenerPortafolios') {
          const data = response?.reglamento;
          this.reglamento = [];
          const reglamento = data.length
            ? data[0]['cIieeUrlReglamentoInterno']
              ? JSON.parse(data[0]['cIieeUrlReglamentoInterno'])
              : []
            : [];
          this.reglamento.push(reglamento);
        }
        this.accionBtnItem({ accion, item: response?.data });
      },
      error: error => {
        this._MessageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error,
        });
      },
    });
  }

  accionBtnItem(elemento): void {
    const { accion } = elemento;
    const { item } = elemento;
    switch (accion) {
      case 'docente-obtenerPortafolios':
        item.length
          ? (this.cPortafolioItinerario = item[0]['cPortafolioItinerario']
              ? JSON.parse(item[0]['cPortafolioItinerario'])
              : [])
          : [];

        break;
      case 'docente-obtenerCuadernosCampo':
        this.cursos = item;

        this.cursos.forEach(
          item =>
            (item.cCuadernoUrl = item.cCuadernoUrl
              ? JSON.parse(item.cCuadernoUrl)
              : item.cCuadernoUrl)
        );
        this.cursos.forEach(item => {
          const data = item.cCuadernoUrl;

          const fichas = data ? data.find(fi => fi.typePortafolio === 1) : null;
          item.bFichas = fichas?.name ? true : false;
          const cuadernos = data ? data.find(fi => fi.typePortafolio === 2) : null;
          item.bCuadernos = cuadernos?.name ? true : false;
          const instrumentos = data ? data.find(fi => fi.typePortafolio === 3) : null;
          item.binstrumentos = instrumentos?.name ? true : false;
        });

        break;
      case 'docente-guardarItinerario':
        this.obtenerPortafolios();
        break;
      case 'docente-guardarFichasCuadernosCampo':
        this.obtenerCuadernosCampo();
        break;
    }
  }
  obtenerPortafolios() {
    const params = {
      petition: 'post',
      group: 'docente',
      prefix: 'portafolios',
      ruta: 'obtenerPortafolios',
      data: {
        iDocenteId: this._ConstantesService.iDocenteId,
        iYAcadId: this._ConstantesService.iYAcadId,
        iCredId: this._ConstantesService.iCredId,
        iIieeId: this._ConstantesService.iIieeId,
      },
      params: { skipSuccessMessage: true },
    };
    this.getInformation(params, params.group + '-' + params.ruta);
  }

  obtenerCuadernosCampo() {
    const params = {
      petition: 'post',
      group: 'docente',
      prefix: 'cuadernos-campo',
      ruta: 'obtenerCuadernosCampo',
      data: {
        iYAcadId: this._ConstantesService.iYAcadId,
        iDocenteId: this._ConstantesService.iDocenteId,
      },
      params: { skipSuccessMessage: true },
    };
    this.getInformation(params, params.group + '-' + params.ruta);
  }

  guardarItinerario() {
    const params = {
      petition: 'post',
      group: 'docente',
      prefix: 'portafolios',
      ruta: 'guardarItinerario',
      data: {
        iDocenteId: this._ConstantesService.iDocenteId,
        iYAcadId: this._ConstantesService.iYAcadId,
        cPortafolioItinerario: JSON.stringify(this.cPortafolioItinerario),
      },
      params: { skipSuccessMessage: true },
    };
    this.getInformation(params, params.group + '-' + params.ruta);
  }

  guardarFichasCuadernosCampo(item) {
    const params = {
      petition: 'post',
      group: 'docente',
      prefix: 'cuadernos-campo',
      ruta: 'guardarFichasCuadernosCampo',
      data: {
        iSilaboId: item.iSilaboId,
        cCuadernoUrl: item.cCuadernoUrl.length ? JSON.stringify(item.cCuadernoUrl) : [],
      },
      params: { skipSuccessMessage: true },
    };
    this.getInformation(params, params.group + '-' + params.ruta);
  }

  obtenerRubricas() {
    const params = {
      iDocenteId: this._ConstantesService.iDocenteId,
    };
    this._evaluacionApiService.obtenerRubricas(params).subscribe({
      next: data => {
        this.rubricas = data;
      },
    });
  }

  rubricasCurso = [];
  obtenerRubricasxiCursoId(item) {
    this.rubricasCurso = [];
    this.rubricasCurso = this.rubricas.filter(i => i.iCursoId === item.iCursoId);
    this.showModalRubricas = true;
    this.portafolio.iCursoId = this.rubricasCurso[0].iCursoId;
    this.portafolio.idDocCursoId = this.rubricasCurso[0].idDocCursoId;
  }

  getCursosDocente(item) {
    const year = this._LocalStoreService.getItem('dremoYear');
    const params = {
      petition: 'post',
      group: 'docente',
      prefix: 'docente-cursos',
      ruta: 'list', //'getDocentesCursos',
      data: {
        opcion: 'CONSULTARxiPersIdxiYearIdxiCursoId',
        iCredId: this._ConstantesService.iCredId,
        valorBusqueda: year, //iYearId
        iSemAcadId: null,
        iIieeId: null,
        idDocCursoId: item.iCursoId,
      },
      params: { skipSuccessMessage: true },
    };
    this._GeneralService.getGralPrefix(params).subscribe({
      next: response => {
        if (response.validated) {
          const data = response.data;
          if (data.length) {
            const curso = data[0];
            this.router.navigate(['aula-virtual/areas-curriculares/', item.iSilaboId], {
              queryParams: {
                cCursoNombre: curso.cCursoNombre,
                cNivelTipoNombre: curso.cNivelTipoNombre,
                cGradoAbreviacion: curso.cGradoAbreviacion,
                cSeccionNombre: curso.cSeccion,
                cCicloRomanos: curso.cCicloRomanos,
                cNivelNombreCursos: curso.cNivelNombreCursos,
                iCursoId: item.iCursoId,
                idDocCursoId: item.idDocCursoId,
                iNivelCicloId: item.iNivelCicloId,
                iIeCursoId: item.iIeCursoId,
                iSeccionId: item.iSeccionId,
                iNivelGradoId: item.iNivelGradoId,
                tab: 2,
              },
            });
          }
        }
      },
      complete: () => {},
      error: error => {
        console.log(error);
      },
    });
  }

  async onUploadChange(evt: any, tipo: any, item: any) {
    const file = evt.target.files[0];
    if (file) {
      const dataFile = await this.objectToFormData({
        file: file,
        nameFile: tipo,
      });
      this.http
        .post(`${this.backendApi}/general/subir-archivo?` + 'skipSuccessMessage=true', dataFile)
        .pipe(
          map((event: any) => {
            if (event.validated) {
              switch (tipo) {
                case 'itinerario':
                  this.cPortafolioItinerario = [];
                  this.cPortafolioItinerario.push({
                    name: file.name,
                    ruta: event.data,
                  });
                  this.guardarItinerario();
                  break;
                case 'fichas-aprendizaje':
                  //1:fichas-aprendizaje
                  //2:cuadernos-campo
                  const cuadernos = item.cCuadernoUrl
                    ? item.cCuadernoUrl.filter(
                        i => i.typePortafolio === 2 || i.typePortafolio === 3
                      )
                    : [];
                  item.cCuadernoUrl = [];
                  item.cCuadernoUrl.push({
                    typePortafolio: 1,
                    name: file.name,
                    ruta: event.data,
                  });
                  if (cuadernos.length) {
                    item.cCuadernoUrl.push(cuadernos[0]);
                    item.cCuadernoUrl.push(cuadernos[1]);
                  }
                  this.guardarFichasCuadernosCampo(item);
                  break;
                case 'cuadernos-campo':
                  const fichas = item.cCuadernoUrl
                    ? item.cCuadernoUrl.filter(
                        i => i.typePortafolio === 1 || i.typePortafolio === 3
                      )
                    : [];

                  item.cCuadernoUrl = [];
                  if (fichas.length) {
                    item.cCuadernoUrl.push(fichas[0]);
                    item.cCuadernoUrl.push(fichas[1]);
                  }
                  item.cCuadernoUrl.push({
                    typePortafolio: 2,
                    name: file.name,
                    ruta: event.data,
                  });

                  this.guardarFichasCuadernosCampo(item);
                  break;
                case 'instrumentos-evaluacion':
                  const instrumentos = item.cCuadernoUrl
                    ? item.cCuadernoUrl.filter(
                        i => i.typePortafolio === 1 || i.typePortafolio === 2
                      )
                    : [];

                  item.cCuadernoUrl = [];

                  if (instrumentos.length) {
                    item.cCuadernoUrl.push(instrumentos[0]);
                    item.cCuadernoUrl.push(instrumentos[1]);
                  }

                  item.cCuadernoUrl.push({
                    typePortafolio: 3,
                    name: file.name,
                    ruta: event.data,
                  });

                  this.guardarFichasCuadernosCampo(item);
                  break;
              }
            }
          }),
          catchError((err: any) => {
            return throwError(err.message);
          })
        )
        .toPromise();
    }
  }

  objectToFormData(obj: any) {
    const formData = new FormData();
    Object.keys(obj).forEach(key => {
      if (obj[key] !== '') {
        formData.append(key, obj[key]);
      }
    });

    return formData;
  }

  openLink(item) {
    if (!item) return;
    const ruta = environment.backend + '/' + item;
    window.open(ruta, '_blank');
  }

  agregarInstrumentos() {
    const parametros = {
      petition: 'post',
      group: 'evaluaciones-docente',
      prefix: 'instrumentos',
      ruta: 'guardar-instrumentos',
      data: {
        iDocenteId: this._ConstantesService.iDocenteId,
        idDocCursoId: this.portafolio.idDocCursoId,
        iCursoId: this.portafolio.iCursoId,
        cInstrumentoNombre: this.portafolio.cInstrumentoNombre,
        cInstrumentoDescripcion: this.portafolio.cInstrumentoDescripcion,
      },
    };

    this.conexion(parametros);
  }

  editarInstrumentos() {
    const parametros = {
      petition: 'post',
      group: 'evaluaciones-docente',
      prefix: 'instrumentos',
      ruta: 'editar-instrumentos',
      data: {
        iInstrumentoId: this.portafolio.iInstrumentoId,
        iDocenteId: this._ConstantesService.iDocenteId,
        idDocCursoId: this.portafolio.idDocCursoId,
        iCursoId: this.portafolio.iCursoId,
        cInstrumentoNombre: this.portafolio.cInstrumentoNombre,
        cInstrumentoDescripcion: this.portafolio.cInstrumentoDescripcion,
      },
    };

    this.conexion(parametros);
  }

  eliminarInstrumentos() {
    const parametros = {
      petition: 'post',
      group: 'evaluaciones-docente',
      prefix: 'instrumentos',
      ruta: 'eliminar-instrumentos',
      data: {
        iInstrumentoId: this.portafolio.iInstrumentoId,
      },
    };

    this.conexion(parametros);
  }

  /**
   *
   * @param eventoRubrica Determina el nombre del titulo si sera Editar(true) o Guardar(false)
   * @param nuevaRubrica Muestra el modal para la creacion o edicion de instrumentos
   */

  accionBnt(event: any) {
    switch (event.accion) {
      case 'editar':
        this.nuevaRubrica = true;
        this.eventoRubrica = true;
        this.portafolio = event.item;
        break;
      case 'eliminar':
        this.portafolio = event.item;
        this.eliminarInstrumentos();
        break;
    }
  }

  /**
   * Permite hacer la recepcion y envio de datos
   */

  conexion(enlace: any) {
    this._GeneralService.getRecibirDatos(enlace).subscribe({
      next: response => {
        const respuesta = response.data[0].resultado;
        if (respuesta > 0) {
          this._MessageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Accion Completada',
          });
        } else {
          this._MessageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error en la Peticion',
          });
        }
        this.obtenerRubricas();
      },
      error: () => {
        this.eventoRubrica = false;
        this.limpiar();
      },
      complete: () => {
        this.limpiar();
        this.obtenerRubricas();
      },
    });
  }

  limpiar() {
    this.showModalRubricas = false;
    this.nuevaRubrica = false;
    this.eventoRubrica = false;
    this.portafolio = {
      cInstrumentoNombre: null,
      cInstrumentoDescripcion: null,
    };
  }
}
