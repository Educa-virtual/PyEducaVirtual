import { Component, inject, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { RegistrarLogroAlcanzadoComponent } from './registrar-logro-alcanzado/registrar-logro-alcanzado.component';
import { BoletaLogroComponent } from './boleta-logro/boleta-logro.component';
import { ApiEvaluacionesService } from '@/app/sistema/aula-virtual/services/api-evaluaciones.service';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { CalendarioPeriodosEvalacionesService } from '@/app/servicios/acad/calendario-periodos-evaluaciones.service';
import { GeneralService } from '@/app/servicios/general.service';
import { MessageService } from 'primeng/api';
//import { CursosComponent } from '../../aula-virtual/sub-modulos/cursos/cursos/cursos.component';
import { CursoCardComponent } from '../../aula-virtual/sub-modulos/cursos/components/curso-card/curso-card.component';
import { ICurso } from '../../aula-virtual/sub-modulos/cursos/interfaces/curso.interface';
import { Subject, takeUntil } from 'rxjs';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { DOCENTE, ESTUDIANTE } from '@/app/servicios/perfilesConstantes';
//import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-logro-alcanzado',
  standalone: true,
  imports: [
    PrimengModule,
    TablePrimengComponent,
    RegistrarLogroAlcanzadoComponent,
    BoletaLogroComponent,
    CursoCardComponent,
  ],
  templateUrl: './logro-alcanzado.component.html',
  styleUrl: './logro-alcanzado.component.scss',
})
export class LogroAlcanzadoComponent implements OnInit {
  //breadCrumbHome: MenuItem
  dialogRegistrarLogroAlcanzado: boolean = false;
  registroTitleModal: string;
  dialogBoletaLogroAlcanzado: boolean = false;
  boletaTitleModal: string;
  selectedItem: any;

  public data: ICurso[] = [];
  public cursos: ICurso[] = [];
  public area: any; //area curricular seleccionada

  //estudiante,cargando estudiante
  public estudiantes: any[] = [];

  //dropdowns  properties

  public periodos: any[] = [];

  // properties seleccionables
  public seleccionar: boolean = false;
  public iPeriodoId: string; //periodoSeleccionado: any = null;

  private _ConstantesService = inject(ConstantesService);
  private _CalendarioPeriodosEvalacionesService = inject(CalendarioPeriodosEvalacionesService);
  private _GeneralService = inject(GeneralService);
  private unsubscribe$ = new Subject<boolean>();
  private _store = inject(LocalStoreService);

  columns = [
    {
      type: 'item',
      width: '1rem',
      field: 'item',
      header: '#',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '8rem',
      field: 'cPersDocumento',
      header: 'DNI/CE',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '5rem',
      field: 'Estudiante',
      header: 'Apellidos y Nombre',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '5rem',
      field: 'cCursoNombre',
      header: 'Área curricular',
      text_header: 'center',
      text: 'center',
    },

    {
      type: 'text',
      width: '5rem',
      field: 'cGradoAbreviacion',
      header: 'Nivel',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '12rem',
      field: 'cSeccionNombre',
      header: 'Sección',
      text_header: 'center',
      text: 'center',
    },

    {
      type: 'actions',
      width: '3rem',
      field: 'actions',
      header: 'Acciones',
      text_header: 'center',
      text: 'center',
    },
  ];
  constructor(
    private ApiEvaluacionesService: ApiEvaluacionesService,
    private _messageService: MessageService
    //private http: HttpClient
  ) {}
  ngOnInit() {
    // console.log('Logro alcanzado');
    this.obtenerPerfil();
    //this.obtenerGradoSeccion();
    this.obtenerPeriodosxiYAcadIdxiSedeIdxFaseRegular();
    //this.cargarPeriodosEvaluacion();
  }
  registroLogroAlcanzado() {
    const nombreEstudiante = this.selectedItem?.Estudiante || 'Estudiante';
    const gradoEstudiante = this.selectedItem?.cGradoAbreviacion || 'cGradoAbreviacion';
    const secciconEstudiante = this.selectedItem?.cSeccionNombre || 'cSeccionNombre';
    this.registroTitleModal = `Registro : ${nombreEstudiante} - Nivel: ${gradoEstudiante} - Seccion: ${secciconEstudiante}`;
    this.dialogRegistrarLogroAlcanzado = true;
  }
  listenDialogRegistrarLogro(event: boolean) {
    if (event == false) {
      this.dialogRegistrarLogroAlcanzado = false;
    }
  }
  boletaLogroImprimir() {
    this.boletaTitleModal = 'Boleta de Logros de';
    this.dialogBoletaLogroAlcanzado = true;
  }
  listenDialogBoleta(event: boolean) {
    if (event == false) {
      this.dialogBoletaLogroAlcanzado = false;
    }
  }
  accionBtnItemTable({ accion, item }) {
    switch (accion) {
      case 'Resistrar':
        console.log(item, 'item seleccionado');
        this.selectedItem = item;
        this.registroLogroAlcanzado();
        break;
      case 'Imprimir':
        this.selectedItem = item;
        this.boletaLogroImprimir();
        break;
    }
  }
  actions: IActionTable[] = [
    {
      labelTooltip: 'Resistrar logro',
      icon: 'pi pi-file-edit',
      accion: 'Resistrar',
      type: 'item',
      class: 'p-button-rounded p-button-primary p-button-text',
    },
    {
      labelTooltip: 'Imprimir Boleta',
      icon: 'pi pi-print',
      accion: 'Imprimir',
      type: 'item',
      class: 'p-button-rounded p-button-success p-button-text',
    },
  ];

  /*
  obtenerGradoSeccion() {
    this._GeneralService
      .searchCalendario({
        json: JSON.stringify({
          iSedeId: this._ConstantesService.iSedeId,
          iYAcadId: this._ConstantesService.iYAcadId,
        }),
        _opcion: 'getGradoSeccionXiSedeIdXiYAcadId',
      })
      .subscribe({
        next: (data: any) => {
          this.gradosSecciones = data.data;
          this.grados = this.removeDuplicatesByiGradoId(this.gradosSecciones);
        },
        error: error => {
          this._messageService.add({
            severity: 'error',
            summary: 'Mensaje del sistema',
            detail: 'Error en el procesamiento.' + error.message,
          });

          //console.error('Error fetching Servicios de Atención:', error);
        },
        complete: () => {
          this._messageService.add({
            severity: 'success',
            summary: 'Mensaje del sistema',
            detail: 'Se cargaron los grados y secciones',
          });
        },
      });
  }

  obtenerSecciones() {
    this.secciones = this.gradosSecciones.filter(item => item.iGradoId === this.iGradoId);
  }

  removeDuplicatesByiGradoId(array: any[]): any[] {
    const seen = new Set<number>();
    return array.filter(item => {
      if (seen.has(item.iGradoId)) {
        return false;
      }
      seen.add(item.iGradoId);
      return true;
    });
  } */

  seleccionarCurso() {
    this.seleccionar = false;
  }

  obtenerPeriodosxiYAcadIdxiSedeIdxFaseRegular() {
    const iYAcadId = this._ConstantesService.iYAcadId;
    const iSedeId = this._ConstantesService.iSedeId;
    const params = { iCredId: this._ConstantesService.iCredId };

    //this.cargandoPeriodos = true;

    this._CalendarioPeriodosEvalacionesService
      .obtenerPeriodosxiYAcadIdxiSedeIdxFaseRegular(iYAcadId, iSedeId, params)
      .subscribe({
        next: resp => {
          if (resp.validated) {
            this.periodos = resp.data;
            console.log(resp.data);
            if (this.periodos.length > 0) {
              this.iPeriodoId = '1';
            }
          }
        },
        // error: error => this.mostrarErrores(error),
      });
  }

  //obtener cursos del docente
  obtenerPerfil() {
    const perfil = this._store.getItem('dremoPerfil');
    switch (Number(perfil.iPerfilId)) {
      case DOCENTE:
        this.getCursosDocente();
        break;
      case ESTUDIANTE:
        //this.layout = 'grid';
        this.getCursosEstudiante();
        break;
    }
  }
  // muestra en la area curriculares los cursos del docente,grado y seccion
  getCursosDocente() {
    const params = {
      petition: 'post',
      group: 'acad',
      prefix: 'docente',
      ruta: 'docente_curso',
      data: {
        opcion: 2,
        iDocenteId: this._ConstantesService.iDocenteId,
        iYAcadId: this._ConstantesService.iYAcadId,
        iSedeId: this._ConstantesService.iSedeId,
        iIieeId: this._ConstantesService.iIieeId,
      },
      params: { skipSuccessMessage: true },
    };
    this.obtenerCursos(params);
  }

  getCursosEstudiante() {
    const params = {
      petition: 'post',
      group: 'acad',
      prefix: 'estudiantes',
      ruta: 'obtenerCursosXEstudianteAnioSemestre',
      data: {
        iEstudianteId: this._ConstantesService.iEstudianteId,
        iYAcadId: this._ConstantesService.iYAcadId,
        iSedeId: this._ConstantesService.iSedeId,
        iIieeId: this._ConstantesService.iIieeId,
      },
      params: { skipSuccessMessage: true },
    };
    this.obtenerCursos(params);
  }

  obtenerCursos(params) {
    this._GeneralService
      .getGralPrefix(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          this.cursos = response.data.map(curso => ({
            iCursoId: curso.idDocCursoId,
            ...curso,
          }));
          this.data = this.cursos;
        },
        complete: () => {},
        error: error => {
          console.log(error);
        },
      });
  }
  filtrarCurso($event) {
    this.generarListaEstudiante($event);

    this.area = $event;
    console.log('Curso seleccionado:', this.area);
  }

  generarListaEstudiante(area: any) {
    //console.log("Invocando al servicio para generar la lista de estudiantes...");

    this.estudiantes = [];

    // 2. Aquí, el método del componente (`generarListaEstudiante`)
    //    llama al método del servicio (`generarListaEstudiantesSedeSeccionGrado`).
    const params = {
      iSedeId: this._ConstantesService.iSedeId,
      iSeccionId: area.iSeccionId,
      iYAcadId: this._ConstantesService.iYAcadId,
      iNivelGradoId: area.iGradoId,
    };

    this.ApiEvaluacionesService.generarListaEstudiantesSedeSeccionGrado(params).subscribe({
      // 3. Esto se ejecuta cuando el servicio devuelve una respuesta exitosa.
      next: respuesta => {
        // console.log('Servicio respondió con éxito:', respuesta);
        this.estudiantes = respuesta; // Guardamos los datos en nuestra variable local.
      },

      // 4. Esto se ejecuta si hubo un error en la llamada.
      error: err => {
        // console.error('El servicio falló al generar la lista:', err);

        this._messageService.add({
          severity: 'error',
          summary: 'Mensaje del sistema',
          detail: 'No se pudo generar la lista de estudiantes' + err.message,
        });
      },
      complete: () => {
        this.seleccionar = true;

        this.estudiantes = this.estudiantes.map(estudiante => ({
          ...estudiante, // Mantener todas las propiedades originales
          cGradoAbreviacion: this.area?.cGradoAbreviacion || '', // Evitar error si no encuentra
          cSeccionNombre: this.area?.cSeccionNombre || '', // Evitar error si no encuentra
        }));

        this._messageService.add({
          severity: 'success',
          summary: 'Mensaje del sistema',
          detail: 'Se selecciono con exito el área curricular',
        });
      },
    });
  }
}
