import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output,
  inject,
} from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
//periodo Service
import { CalendarioPeriodosEvalacionesService } from '@/app/servicios/acad/calendario-periodos-evaluaciones.service';
import { DatosMatriculaService } from '@/app/sistema/gestion-institucional/services/datos-matricula.service';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { ApiEvaluacionesService } from '@/app/sistema/aula-virtual/services/api-evaluaciones.service';

@Component({
  selector: 'app-registrar-logro-alcanzado',
  standalone: true,
  imports: [PrimengModule, FormsModule],
  templateUrl: './registrar-logro-alcanzado.component.html',
  styleUrl: './registrar-logro-alcanzado.component.scss',
  providers: [MessageService],
})
export class RegistrarLogroAlcanzadoComponent implements OnChanges {
  @Input() selectedItem: any;
  //variables para las competencias
  @Input() competencias: any = [];
  @Input() area: any = [];
  @Input() iCredId: number; // Variable para almacenar el crédito seleccionado
  //@Input() curso: any = [];
  @Input() periodos: any[] = [];
  @Input() iPeriodoId: string = '0'; // Variable para almacenar el periodo seleccionado
  @Input() mostrarDialog: boolean = false;
  @Output() registraLogroAlcanzado = new EventEmitter<boolean>();
  //periodo array

  cargarPeriodo: boolean = true;
  area_nombre: string = ''; // Variable para almacenar el área del curso seleccionado
  conversion: any[] = [
    // tabla de conversion
    {
      iCalifId: 1,
      logro: 'AD',
      max: 20,
      min: 18,
      descripcion: 'Logro Destacado, Excelente, Muy Bueno.',
    },
    {
      iCalifId: 2,
      logro: 'A',
      max: 17.99,
      min: 14,
      descripcion: 'Bueno, Satisfactorio, Logro Esperado.',
    },
    { iCalifId: 3, logro: 'B', max: 13.99, min: 11, descripcion: 'En Proceso, Regular.' },
    {
      iCalifId: 4,
      logro: 'C',
      max: 10.99,
      min: 0,
      descripcion: 'Deficiente, En Inicio, Reprobado.',
    },
  ];

  mostrarBotonFinalizar: boolean = false;

  //variables
  nCalifIdPeriodo1: number = 0; // Variable para almacenar el periodo seleccionado
  nCalifIdPeriodo2: number = 0; // Variable para almacenar el periodo seleccionado
  nCalifIdPeriodo3: number = 0; // Variable para almacenar el periodo seleccionado
  nCalifIdPeriodo4: number = 0; // Variable para almacenar el periodo seleccionado

  iCalifIdPeriodo1: string = ''; // Variable para almacenar el periodo seleccionado
  iCalifIdPeriodo2: string = ''; // Variable para almacenar el periodo seleccionado
  iCalifIdPeriodo3: string = ''; // Variable para almacenar el periodo seleccionado
  iCalifIdPeriodo4: string = ''; // Variable para almacenar el periodo seleccionado
  iPromedio: string = ''; // Variable para almacenar el periodo seleccionado
  nPromedio: number;

  cDetMatrConclusionDesc1: string = ''; // Variable para almacenar el periodo seleccionado
  cDetMatrConclusionDesc2: string = ''; // Variable para almacenar el periodo seleccionado
  cDetMatrConclusionDesc3: string = ''; // Variable para almacenar el periodo seleccionado
  cDetMatrConclusionDesc4: string = ''; // Variable para almacenar el periodo seleccionado
  cDetMatrConclusionDescPromedio: string = ''; // Variable para almacenar el periodo seleccionado

  private _confirmService = inject(ConfirmationModalService);
  constructor(
    private messageService: MessageService,
    private calendarioPeriodosService: CalendarioPeriodosEvalacionesService,
    private DatosMatriculaService: DatosMatriculaService,
    private ApiEvaluacionesService: ApiEvaluacionesService
    //private DetalleMatriculasServic: DetalleMatriculasService,
    //private ConstantesService: ConstantesService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes['selectedItem']) {
    //   if (Array.isArray(this.selectedItem) && this.selectedItem.length > 0) {

    //     this.messageService.add({
    //       severity: 'warn',
    //       summary: 'Mensaje del sistema',
    //       detail: 'Se detecto cambios en información del estudiante',
    //       life: 3000,
    //     });
    //   }
    //   // this.filtrarArea();
    // }
    if (changes['competencias']) {
      if (Array.isArray(this.competencias) && this.competencias.length > 0) {
        this.actualizarArea(); //actualizar los valores de las variables con los datos del selectedItem

        // this.messageService.add({
        //   severity: 'warn',
        //   summary: 'Mensaje del sistema',
        //   detail: 'Se detecto cambios en información del competencias',
        //   life: 3000,
        // });
      }
    }
  }

  actualizarArea() {
    this.iCalifIdPeriodo1 = this.selectedItem[0].iCalifIdPeriodo1 ?? '';
    this.iCalifIdPeriodo2 = this.selectedItem[0].iCalifIdPeriodo2 ?? '';
    this.iCalifIdPeriodo3 = this.selectedItem[0].iCalifIdPeriodo3 ?? '';
    this.iCalifIdPeriodo4 = this.selectedItem[0].iCalifIdPeriodo4 ?? '';
    this.iPromedio = this.selectedItem[0].iPromedio ?? '';
    this.nPromedio = this.selectedItem[0].nDetMatrPromedio ?? 0;

    this.nCalifIdPeriodo1 = this.selectedItem[0].nDetMatrPeriodo1 ?? 0;
    this.nCalifIdPeriodo2 = this.selectedItem[0].nDetMatrPeriodo2 ?? 0;
    this.nCalifIdPeriodo3 = this.selectedItem[0].nDetMatrPeriodo3 ?? 0;
    this.nCalifIdPeriodo4 = this.selectedItem[0].nDetMatrPeriodo4 ?? 0;

    this.cDetMatrConclusionDesc1 = this.selectedItem[0].cDetMatrConclusionDesc1 ?? '';
    this.cDetMatrConclusionDesc2 = this.selectedItem[0].cDetMatrConclusionDesc2 ?? '';
    this.cDetMatrConclusionDesc3 = this.selectedItem[0].cDetMatrConclusionDesc3 ?? '';
    this.cDetMatrConclusionDesc4 = this.selectedItem[0].cDetMatrConclusionDesc4 ?? '';
    this.cDetMatrConclusionDescPromedio = this.selectedItem[0].cDetMatConclusionDescPromedio ?? '';
  }

  cerrarDialog() {
    this.registraLogroAlcanzado.emit(false);
  }

  finalizarRegistro() {
    this.registraLogroAlcanzado.emit(false);
    this.mostrarBotonFinalizar = false;
  }

  // BUSCADOR DE PAOLO EN FRONT
  buscarLogrosDelEstudiante(iMatriculaId: number) {
    this.DatosMatriculaService.searchGradoSeccionTurno(iMatriculaId).subscribe({
      next: (response: any) => {
        if (response.validated && response.data) {
          console.log('Logros encontrados:', response.data);
          // Mapea la respuesta a tus arrays de competencias
          // Ejemplo: this.competenciasMatematica = response.data.matematica;
        } else {
          console.warn('No se encontraron logros para este estudiante.');
        }
      },
      error: error => {
        console.error('Error al buscar logros:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo obtener la información de logros.',
          life: 3000,
        });
      },
    });
  }

  insertarResultadoXcompetencias(json: any, iCredId: number, option: string) {
    this.ApiEvaluacionesService.insertarResultadoXcompetencias({
      json: JSON.stringify(json),
      opcion: option,
      iCredId: iCredId,
    }).subscribe({
      // 3. Esto se ejecuta cuando el servicio devuelve una respuesta exitosa.
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Mensaje del sistema',
          detail: 'No se pudo guardar el logro.' + error.message,
          life: 3000,
        });
      },
      complete: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Mensaje del sistema',
          detail: 'Logro guardado exitosamente.',
          life: 3000,
        });
      },
    });
  }

  convertirLogroCompetencias(event: any, index: number, competencia: any) {
    //this.nPromedio = parseFloat(this.nPromedio.toFixed(2));

    let json: any;
    let valor: any;
    let rango: any;

    this._confirmService.openConfiSave({
      message: 'Desea procesar el Nivel de logro',
      header: 'Advertencia de  procesamiento',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        switch (this.iPeriodoId) {
          case '1':
            valor = this.competencias[index].iResultado_1;
            rango = this.conversion.find(item => valor >= item.min && valor <= item.max);
            //sctualizar
            // this.competencias[index].cDescripcion_1 = (this.competencias[index].cDescripcion_1 ?? '') +
            //   ' ' +  (rango ? rango.descripcion : '');
            this.competencias[index].cNivelLogro_1 = rango ? rango.logro : '';
            this.competencias[index].iResultado_1 = parseFloat(parseFloat(valor).toFixed(2));
            //procesar
            json = {
              iResultadoCompId: 0,
              iDetMatrId: Number(competencia.iDetMatrId ?? 0),
              iCompetenciaId: Number(competencia.iCompetenciaId),
              iPeriodoId: Number(this.iPeriodoId),
              iResultado: this.competencias[index].iResultado_1,
              cNivelLogro: this.competencias[index].cNivelLogro_1,
              cDescripcion: this.competencias[index].cDescripcion_1,
            };
            this.insertarResultadoXcompetencias(json, this.iCredId, 'full');
            break;
          case '2':
            valor = this.competencias[index].iResultado_2;
            rango = this.conversion.find(item => valor >= item.min && valor <= item.max);
            // this.competencias[index].cDescripcion_2 = (this.competencias[index].cDescripcion_2 ?? '') +
            //   ' ' +  (rango ? rango.descripcion : '');
            this.competencias[index].cNivelLogro_2 = rango ? rango.logro : '';
            this.competencias[index].iResultado_2 = parseFloat(parseFloat(valor).toFixed(2));
            //procesar
            json = {
              iResultadoCompId: 0,
              iDetMatrId: Number(competencia.iDetMatrId ?? 0),
              iCompetenciaId: Number(competencia.iCompetenciaId),
              iPeriodoId: Number(this.iPeriodoId),
              iResultado: this.competencias[index].iResultado_2,
              cNivelLogro: this.competencias[index].cNivelLogro_2,
              cDescripcion: this.competencias[index].cDescripcion_2,
            };
            this.insertarResultadoXcompetencias(json, this.iCredId, 'full');
            break;

          case '3':
            valor = this.competencias[index].iResultado_3;
            rango = this.conversion.find(item => valor >= item.min && valor <= item.max);
            // this.competencias[index].cDescripcion_3 = (this.competencias[index].cDescripcion_3 ?? '') +
            // ' ' +  (rango ? rango.descripcion : '');
            this.competencias[index].cNivelLogro_3 = rango ? rango.logro : '';
            this.competencias[index].iResultado_3 = parseFloat(parseFloat(valor).toFixed(2));
            //procesar
            json = {
              iResultadoCompId: 0,
              iDetMatrId: Number(competencia.iDetMatrId ?? 0),
              iCompetenciaId: Number(competencia.iCompetenciaId),
              iPeriodoId: Number(this.iPeriodoId),
              iResultado: this.competencias[index].iResultado_3,
              cNivelLogro: this.competencias[index].cNivelLogro_3,
              cDescripcion: this.competencias[index].cDescripcion_3,
            };
            this.insertarResultadoXcompetencias(json, this.iCredId, 'full');
            break;

          case '4':
            valor = this.competencias[index].iResultado_4;
            rango = this.conversion.find(item => valor >= item.min && valor <= item.max);
            // this.competencias[index].cDescripcion_4 = (this.competencias[index].cDescripcion_4 ?? '') +
            // ' ' +  (rango ? rango.descripcion : '');
            this.competencias[index].cNivelLogro_4 = rango ? rango.logro : '';
            this.competencias[index].iResultado_4 = parseFloat(parseFloat(valor).toFixed(2));
            //procesar
            json = {
              iResultadoCompId: 0,
              iDetMatrId: Number(competencia.iDetMatrId ?? 0),
              iCompetenciaId: Number(competencia.iCompetenciaId),
              iPeriodoId: Number(this.iPeriodoId),
              iResultado: this.competencias[index].iResultado_4,
              cNivelLogro: this.competencias[index].cNivelLogro_4,
              cDescripcion: this.competencias[index].cDescripcion_4,
            };
            this.insertarResultadoXcompetencias(json, this.iCredId, 'full');
            break;

          case '5':
            valor = this.competencias[index].iResultado_5;
            rango = this.conversion.find(item => valor >= item.min && valor <= item.max);
            // this.competencias[index].cDescripcion_4 = (this.competencias[index].cDescripcion_4 ?? '') +
            // ' ' +  (rango ? rango.descripcion : '');
            this.competencias[index].cNivelLogro_5 = rango ? rango.logro : '';
            this.competencias[index].iResultado_5 = parseFloat(parseFloat(valor).toFixed(2));
            //procesar
            json = {
              iResultadoCompId: 0,
              iDetMatrId: Number(competencia.iDetMatrId ?? 0),
              iCompetenciaId: Number(competencia.iCompetenciaId),
              iPeriodoId: Number(this.iPeriodoId),
              iResultado: this.competencias[index].iResultado_5,
              cNivelLogro: this.competencias[index].cNivelLogro_5,
              cDescripcion: this.competencias[index].cDescripcion_5,
            };
            this.insertarResultadoXcompetencias(json, this.iCredId, 'full');
            break;
        }
      },
      reject: () => {
        // Mensaje de cancelación (opcional)
        this.messageService.add({
          severity: 'error',
          summary: 'Mensaje de sistema',
          detail: 'Acción cancelada',
        });
      },
    });
  }

  actualizarResultadoXperiodoDetMatricula(json) {
    this.ApiEvaluacionesService.actualizarResultadoXperiodoDetMatricula({
      json: JSON.stringify(json),
      iCredId: this.iCredId,
    }).subscribe({
      // 3. Esto se ejecuta cuando el servicio devuelve una respuesta exitosa.
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Mensaje del sistema',
          detail: 'No se pudo guardar el logro.' + error.message,
          life: 3000,
        });
      },
      complete: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Mensaje del sistema',
          detail: 'Logro guardado exitosamente.',
          life: 3000,
        });
      },
    });
  }
}

/*
  convertirLogro(campo: string, periodo: string): void {
    const mensaje = 'Este registro se guardará automáticamente: ' + campo + ': ' + this[campo];

    this._confirmService.openConfiSave({
      message: mensaje,
      header: 'Advertencia de autoguardado',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (periodo === this.iPeriodoId) {
          switch (campo) {
            case 'nCalifIdPeriodo1':
              this.getLogroPorValor(this.nCalifIdPeriodo1, periodo);
              break;
            case 'nCalifIdPeriodo2':
              this.getLogroPorValor(this.nCalifIdPeriodo2, periodo);
              break;
            case 'nCalifIdPeriodo3':
              this.getLogroPorValor(this.nCalifIdPeriodo3, periodo);
              break;
            case 'nCalifIdPeriodo4':
              this.getLogroPorValor(this.nCalifIdPeriodo4, periodo);
              break;
            case 'nPromedio':
              this.getLogroPorValor(this.nPromedio, '5');
              break;
            default:
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Por favor, complete todos los campos requeridos.',
                life: 3000,
              });
              break;
          }
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del sistema',
            detail: 'Los periodos no coinciden.',
            life: 3000,
          });
        }
      },
      reject: () => {
        // Mensaje de cancelación (opcional)
        this.messageService.add({
          severity: 'error',
          summary: 'Mensaje de sistema',
          detail: 'Acción cancelada',
        });
      },
    });
  }
*/
/*  
validarLogro(opcion: string) {
    let camposRequeridos = [];
    let json: any = {};
    let rango: any = {};
    const val = opcion === '5' ? '5' : this.iPeriodoId; // Valor para el promedio

    switch (val) {
      case '1':
        rango = this.conversion.find(item => (item.logro = this.iCalifIdPeriodo1));
        camposRequeridos = [this.cDetMatrConclusionDesc1, this.iCalifIdPeriodo1];
        json = {
          iDetMatrId: this.selectedItem[0].iDetMatrId,
          cDetMatrConclusionDesc1: this.cDetMatrConclusionDesc1,
          iEscalaCalifIdPeriodo1: rango.iCalifId,
          nDetMatrPeriodo1: this.nCalifIdPeriodo1,
          opcion: Number(this.iPeriodoId),
        };
        this.actualizarResultadoXperiodoDetMatricula(json);
        break;
      case '2':
        rango = this.conversion.find(item => (item.logro = this.iCalifIdPeriodo1));
        camposRequeridos = [this.cDetMatrConclusionDesc2, this.iCalifIdPeriodo2];
        json = {
          iDetMatrId: this.selectedItem[0].iDetMatrId,
          cDetMatrConclusionDesc2: this.cDetMatrConclusionDesc2,
          iEscalaCalifIdPeriodo2: rango.iCalifId,
          nDetMatrPeriodo2: this.nCalifIdPeriodo2,
          opcion: Number(this.iPeriodoId),
        };
        this.actualizarResultadoXperiodoDetMatricula(json);
        break;
      case '3':
        rango = this.conversion.find(item => (item.logro = this.iCalifIdPeriodo1));
        camposRequeridos = [this.cDetMatrConclusionDesc3, this.iCalifIdPeriodo3];
        json = {
          iDetMatrId: this.selectedItem[0].iDetMatrId,
          cDetMatrConclusionDesc3: this.cDetMatrConclusionDesc3,
          iEscalaCalifIdPeriodo3: rango.iCalifId,
          nDetMatrPeriodo3: this.nCalifIdPeriodo3,
          opcion: Number(this.iPeriodoId),
        };
        this.actualizarResultadoXperiodoDetMatricula(json);
        break;
      case '4':
        rango = this.conversion.find(item => (item.logro = this.iCalifIdPeriodo1));
        camposRequeridos = [this.cDetMatrConclusionDesc4, this.iCalifIdPeriodo4];
        json = {
          iDetMatrId: this.selectedItem[0].iDetMatrId,
          cDetMatrConclusionDesc4: this.cDetMatrConclusionDesc4,
          iEscalaCalifIdPeriodo4: rango.iCalifId,
          nDetMatrPeriodo4: this.nCalifIdPeriodo4,
          opcion: Number(this.iPeriodoId),
        };
        this.actualizarResultadoXperiodoDetMatricula(json);
        break;
      case '5':
        rango = this.conversion.find(item => (item.logro = this.iPromedio));
        camposRequeridos = [this.cDetMatrConclusionDescPromedio, this.iPromedio];
        json = {
          iDetMatrId: this.selectedItem[0].iDetMatrId,
          cDetMatrConclusionDescPromedio: this.cDetMatrConclusionDescPromedio,
          iEscalaCalifIdPromedio: rango.iCalifId,
          nPromedio: this.nPromedio,
          opcion: Number(opcion),
        };
        this.actualizarResultadoXperiodoDetMatricula(json);
        break;
      default:
        this.messageService.add({
          severity: 'error',
          summary: 'Mensaje del sistema',
          detail: 'El periodo seleccionado no es válido.',
          life: 3000,
        });
        break;
    }

    const camposVacios = camposRequeridos.filter(campo => !campo);

    if (camposVacios.length > 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, complete todos los campos requeridos.',
        life: 3000,
      });
    } else {
      console.log('Campos completos:', camposRequeridos, json);
    }
  }
*/
