import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
//periodo Service
import { CalendarioPeriodosEvalacionesService } from '@/app/servicios/acad/calendario-periodos-evaluaciones.service';
import { DatosMatriculaService } from '@/app/sistema/gestion-institucional/services/datos-matricula.service';
@Component({
  selector: 'app-registrar-logro-alcanzado',
  standalone: true,
  imports: [PrimengModule, FormsModule],
  templateUrl: './registrar-logro-alcanzado.component.html',
  styleUrl: './registrar-logro-alcanzado.component.scss',
  providers: [MessageService],
})
export class RegistrarLogroAlcanzadoComponent implements OnInit {
  @Input() selectedItem: any;
  //variables para las competencias
  @Input() competencias: any = [];
  @Input() curso: any = [];
  @Input() mostrarDialog: boolean = false;
  @Output() registraLogroAlcanzado = new EventEmitter<boolean>();
  //periodo array
  periodos: any[] = [];
  cargarPeriodo: boolean = true;

  mostrarBotonFinalizar: boolean = false;
  competencia = [
    {
      descripcion:
        'Analiza y aplica procedimientos matemáticos para resolver situaciones que involucran cantidades.',
      b1_nl: '',
      b1_desc: '',
      b2_nl: '',
      b2_desc: '',
      b3_nl: '',
      b3_desc: '',
      b4_nl: '',
      b4_desc: '',
      nl_final: '',
    },
    {
      descripcion: 'Interpreta y modela relaciones algebraicas y funciones en diversos contextos.',
      b1_nl: '',
      b1_desc: '',
      b2_nl: '',
      b2_desc: '',
      b3_nl: '',
      b3_desc: '',
      b4_nl: '',
      b4_desc: '',
      nl_final: '',
    },
    {
      descripcion:
        'Argumenta afirmaciones sobre propiedades geométricas y transformaciones en el espacio.',
      b1_nl: '',
      b1_desc: '',
      b2_nl: '',
      b2_desc: '',
      b3_nl: '',
      b3_desc: '',
      b4_nl: '',
      b4_desc: '',
      nl_final: '',
    },
    {
      descripcion:
        'Organiza, analiza e interpreta datos para la toma de decisiones bajo condiciones de incertidumbre.',
      b1_nl: '',
      b1_desc: '',
      b2_nl: '',
      b2_desc: '',
      b3_nl: '',
      b3_desc: '',
      b4_nl: '',
      b4_desc: '',
      nl_final: '',
    },
  ];

  constructor(
    private messageService: MessageService,
    private calendarioPeriodosService: CalendarioPeriodosEvalacionesService,
    private DatosMatriculaService: DatosMatriculaService
    //private DetalleMatriculasServic: DetalleMatriculasService,
    //private ConstantesService: ConstantesService,
  ) {}

  ngOnInit() {
    console.log('registrar-logro-alcanzado');
    this.cargarPeriodo;
    console.log('selectedItem completo:', this.selectedItem);
  }
  cerrarDialog() {
    this.registraLogroAlcanzado.emit(false);
  }

  finalizarRegistro() {
    this.registraLogroAlcanzado.emit(false);
    this.mostrarBotonFinalizar = false;
  }
  // cargarPeriodos() {
  //     // Obtener los parámetros necesarios
  //     const iYAcadId = this.selectedItem?.iYAcadId || 2024
  //     const iSedeId = this.selectedItem?.iSedeId || 1
  //     const params = {} // Agregar parámetros si son necesarios

  //     this.calendarioPeriodosService
  //         .obtenerPeriodosxiYAcadIdxiSedeIdxFaseRegular(iYAcadId, iSedeId, params)
  //         .subscribe({
  //             next: (response) => {
  //                 //console.log('Períodos obtenidos:', response)
  //                 this.periodos = response
  //                 // Adaptar las competencias después de obtener los períodos
  //                 this.adaptarCompetenciasAPeriodos()
  //             },
  //             error: (error) => {
  //                 console.error('Error al cargar períodos:', error)
  //                 this.messageService.add({
  //                     severity: 'error',
  //                     summary: 'Error',
  //                     detail: 'No se pudieron cargar los períodos',
  //                     life: 3000
  //                 })
  //             }
  //         })
  // }
  CompetenciasAPeriodos() {
    console.log('competenciaPeriodo');
  }

  guardarLogro() {
    this.messageService.add({
      severity: 'success',
      summary: 'Guardado',
      detail: 'Guardado Exitosamente',
      life: 3000,
    });
    const datosCompletos = {
      estudiante: this.selectedItem,
      matematica: this.competencia,
    };

    this.mostrarBotonFinalizar = true;

    console.log('Datos a guardar:', datosCompletos);
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
  // Cargar periodos
  cargarPeriodos() {
    const iYAcadId = this.selectedItem?.iYAcadId;
    const iSedeId = this.selectedItem?.iSedeId;

    // Parámetros adicionales
    const params = {
      iSeccionId: this.selectedItem?.iSeccionId || null,
      iNivelGradoId: this.selectedItem?.iNivelGradoId || null,
      //agregando parametros necesitados y usados
      //iYAcadId: this.selectedItem?.iYAcadId || null,
      //iSedeId: this.selectedItem?.iSedeId || null
    };

    this.calendarioPeriodosService
      .obtenerPeriodosxiYAcadIdxiSedeIdxFaseRegular(iYAcadId, iSedeId, params)
      .subscribe({
        next: response => {
          console.log('Períodos obtenidos:', response);
          if (response.validated && response.data) {
            this.periodos = response.data;
            this.CompetenciasAPeriodos();
          } else {
            console.error('Respuesta inválida:', response.message);
          }
        },
        error: error => {
          console.error('Error al cargar períodos:', error);
        },
      });
  }
  onlyNumbers(event: any): void {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }
}
