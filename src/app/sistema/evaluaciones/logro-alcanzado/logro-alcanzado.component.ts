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
//import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-logro-alcanzado',
  standalone: true,
  imports: [
    PrimengModule,
    TablePrimengComponent,
    RegistrarLogroAlcanzadoComponent,
    BoletaLogroComponent,
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

  gradosSecciones: any[] = [];
  grados: any[] = [];
  secciones: any[] = [];
  iGradoId: string = '';
  iSeccionId: string = '';

  //estudiante,cargando estudiante
  public estudiantes: any[] = [];
  public cargandoEstudiantes = false;
  //dropdowns  properties
  public opcionesNivel: any[] = [];
  public opcionesSeccion: any[] = [];
  public periodos: any[] = [];
  // Estados de carga para cada dropdown
  public cargandoNiveles = false;
  public cargandoSecciones = false;
  public cargandoPeriodos = false;
  // properties seleccionables
  private nivelSeleccionado: any = null;
  private seccionSeleccionado: any = null;
  public iPeriodoId: number; //periodoSeleccionado: any = null;

  private _ConstantesService = inject(ConstantesService);
  private _CalendarioPeriodosEvalacionesService = inject(CalendarioPeriodosEvalacionesService);
  private _GeneralService = inject(GeneralService);
  // dataSugerencias = [
  //   {
  //     item: 1,
  //     iLogroAlcanzadoId: 1,
  //     cAsunto: 'Mejora en materiales de clase',
  //     cNombreEstudiante: 'Gómez Torres Luis Alberto',
  //     cNivelLogroAlcanzado: '4to',
  //     cSeccion: 'c',
  //     docuento_identidad: '48783215',
  //   },
  //   {
  //     item: 2,
  //     iLogroAlcanzadoId: 2,
  //     //dtFechaCreacion: new Date('2025-04-20'),
  //     cAsunto: 'Mejora en materiales de clase',
  //     cNombreEstudiante: 'perez perez luis fernando',
  //     cNivelLogroAlcanzado: '4to',
  //     cSeccion: 'A',
  //     docuento_identidad: '46983215',
  //   },
  // ];

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
      width: '5rem',
      field: 'cNombreEstudiante',
      header: 'Apellidos y Nombre',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '5rem',
      field: 'cNivelLogroAlcanzado',
      header: 'Nivel',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '12rem',
      field: 'cSeccion',
      header: 'Sección',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '8rem',
      field: 'docuento_identidad',
      header: 'DNI/CE',
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
    private ApiEvaluacionesService: ApiEvaluacionesService
    //private http: HttpClient
  ) {}
  ngOnInit() {
    console.log('Logro alcanzado');
    this.obtenerPeriodosxiYAcadIdxiSedeIdxFaseRegular();
    //this.cargarPeriodosEvaluacion();
  }
  registroLogroAlcanzado() {
    const nombreEstudiante = this.selectedItem?.cNombreEstudiante || 'Estudiante';
    this.registroTitleModal = `Registro : ${nombreEstudiante}`;
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

  generarListaEstudiante() {
    //console.log("Invocando al servicio para generar la lista de estudiantes...");
    this.cargandoEstudiantes = true;
    this.estudiantes = [];

    // 2. Aquí, el método del componente (`generarListaEstudiante`)
    //    llama al método del servicio (`generarListaEstudiantesSedeSeccionGrado`).
    this.ApiEvaluacionesService.generarListaEstudiantesSedeSeccionGrado().subscribe({
      // 3. Esto se ejecuta cuando el servicio devuelve una respuesta exitosa.
      next: respuesta => {
        console.log('Servicio respondió con éxito:', respuesta);
        this.estudiantes = respuesta; // Guardamos los datos en nuestra variable local.
        this.cargandoEstudiantes = false;
      },

      // 4. Esto se ejecuta si hubo un error en la llamada.
      error: err => {
        console.error('El servicio falló al generar la lista:', err);
        this.cargandoEstudiantes = false; // Importante detener la carga también en caso de error.
      },
    });
  }
  // getPeriodosEvaluacion() {
  //   return this.http.get<any>('/api/evaluaciones/periodos-evaluacion');
  // }
  /*
  cargarPeriodosEvaluacion() {
    this.ApiEvaluacionesService.getPeriodosEvaluacion().subscribe({
      next: response => {
        console.log('Response del backend períodos:', response);

        if (response.validated && response.data) {
          // Transformar los datos para el dropdown
          this.periodos = response.data.map(periodo => ({
            label: periodo.iPeriodoEvalCantidad, //   Campo que viene del backend
            value: periodo.iPeriodoEvalId, // ID del período
          }));

        }

        this.cargandoPeriodos = false;
      },
      error: err => {
        console.error('Error cargando períodos:', err);
        this.cargandoPeriodos = false;
      },
    });
  } */

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
          console.error('Error fetching Servicios de Atención:', error);
        },
        complete: () => {
          //   console.log('Request completed')
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
  }

  obtenerPeriodosxiYAcadIdxiSedeIdxFaseRegular() {
    const iYAcadId = this._ConstantesService.iYAcadId;
    const iSedeId = this._ConstantesService.iSedeId;
    const params = { iCredId: this._ConstantesService.iCredId };

    this.cargandoPeriodos = true;

    this._CalendarioPeriodosEvalacionesService
      .obtenerPeriodosxiYAcadIdxiSedeIdxFaseRegular(iYAcadId, iSedeId, params)
      .subscribe({
        next: resp => {
          if (resp.validated) {
            this.periodos = resp.data;
            console.log(resp.data);
            if (this.periodos.length > 0) {
              this.iPeriodoId = this.periodos[0].iPeriodoEvalAperId;
            }
          }
        },
        // error: error => this.mostrarErrores(error),
      });
  }
}
