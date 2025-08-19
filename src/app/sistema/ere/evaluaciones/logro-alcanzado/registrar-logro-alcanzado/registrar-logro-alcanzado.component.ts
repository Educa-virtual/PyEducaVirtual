import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
//periodo Service
import { CalendarioPeriodosEvalacionesService } from '@/app/servicios/acad/calendario-periodos-evaluaciones.service';
//matricula service
//import { DetalleMatriculasService } from '@/app/servicios/acad/detalle-matriculas.service'
import { DatosMatriculaService } from '@/app/sistema/gestion-institucional/services/datos-matricula.service';
import { ApiEvaluacionesService } from '@/app/sistema/aula-virtual/services/api-evaluaciones.service';
//import { ConstantesService } from '@/app/servicios/constantes.service'
//import { ApiEvaluacionesService } from '@/app/sistema/aula-virtual/services/api-evaluaciones.service'
@Component({
  selector: 'app-registrar-logro-alcanzado',
  standalone: true,
  imports: [PrimengModule, FormsModule],
  templateUrl: './registrar-logro-alcanzado.component.html',
  //styleUrl: './registrar-logro-alcanzado.component.scss',
  //styleUrls: ['./registrar-logro-alcanzado.component.scss'],
  providers: [MessageService],
})
export class RegistrarLogroAlcanzadoComponent implements OnInit {
  @Input() selectedItem: any;
  @Output() registraLogroAlcanzado = new EventEmitter<boolean>();
  //periodo array
  periodos: any[] = [];
  cargarPeriodo: boolean = true;
  //competencias
  todasLasCompetencias: any[] = [];
  mostrarBotonFinalizar: boolean = false;
  competenciasMatematica = [
    // {
    //   descripcion:
    //     'Analiza y aplica procedimientos matemáticos para resolver situaciones que involucran cantidades.',
    //   b1_nl: '',
    //   b1_desc: '',
    //   b2_nl: '',
    //   b2_desc: '',
    //   b3_nl: '',
    //   b3_desc: '',
    //   b4_nl: '',
    //   b4_desc: '',
    //   nl_final: '',
    // },
    // {
    //   descripcion: 'Interpreta y modela relaciones algebraicas y funciones en diversos contextos.',
    //   b1_nl: '',
    //   b1_desc: '',
    //   b2_nl: '',
    //   b2_desc: '',
    //   b3_nl: '',
    //   b3_desc: '',
    //   b4_nl: '',
    //   b4_desc: '',
    //   nl_final: '',
    // },
    // {
    //   descripcion:
    //     'Argumenta afirmaciones sobre propiedades geométricas y transformaciones en el espacio.',
    //   b1_nl: '',
    //   b1_desc: '',
    //   b2_nl: '',
    //   b2_desc: '',
    //   b3_nl: '',
    //   b3_desc: '',
    //   b4_nl: '',
    //   b4_desc: '',
    //   nl_final: '',
    // },
    // {
    //   descripcion:
    //     'Organiza, analiza e interpreta datos para la toma de decisiones bajo condiciones de incertidumbre.',
    //   b1_nl: '',
    //   b1_desc: '',
    //   b2_nl: '',
    //   b2_desc: '',
    //   b3_nl: '',
    //   b3_desc: '',
    //   b4_nl: '',
    //   b4_desc: '',
    //   nl_final: '',
    // },
  ];

  competenciasComunicacion = [
    {
      descripcion: 'Se comunica oralmente en su lengua materna.',
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
      descripcion: 'Lee diversos tipos de textos escritos en su lengua materna.',
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
      descripcion: 'Escribe diversos tipos de textos en su lengua materna.',
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

  competenciasIngles = [
    {
      descripcion: 'Se comunica oralmente en inglés como lengua extranjera.',
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
      descripcion: 'Lee diversos tipos de textos escritos en inglés como lengua extranjera.',
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
      descripcion: 'Escribe diversos tipos de textos en inglés como lengua extranjera.',
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

  competenciasPersonalSocial = [
    {
      descripcion: 'Construye su identidad.',
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
      descripcion: 'Convive y participa democráticamente en la búsqueda del bien común.',
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
      descripcion: 'Construye interpretaciones históricas.',
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

  competenciasReligiosa = [
    {
      descripcion: 'Construye su identidad como persona humana, amada por Dios.',
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
      descripcion: 'Asume la experiencia del encuentro personal y comunitario con Dios.',
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
    private DatosMatriculaService: DatosMatriculaService,
    private apiService: ApiEvaluacionesService
    //private DetalleMatriculasServic: DetalleMatriculasService,
    //private ConstantesService: ConstantesService,
  ) {}

  ngOnInit() {
    console.log('registrar-logro-alcanzado');
    this.cargarPeriodo;
    this.cargarTodasLasCompetencias();
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
      matematica: this.competenciasMatematica,
      comunicacion: this.competenciasComunicacion,
      ingles: this.competenciasIngles,
      personalSocial: this.competenciasPersonalSocial,
      religiosa: this.competenciasReligiosa,
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
  // Cargar periodos // eliminar
  // cargarPeriodos() {
  //   this.apiService.obtenerTodasLasCompetencias().subscribe({
  //     next: (data) =>  {
  //       console.log('datos recibidos', data);
  //     },
  //     error: (error) => {
  //       console.error('error', error);
  //     }
  //   })
  // }
  cargarTodasLasCompetencias() {
    const params = {
      iMatriculaId: this.selectedItem?.iMatriculaId,
      // agrega otros parámetros que necesites
    };

    this.apiService.obtenerTodasLasCompetencias(params).subscribe({
      next: data => {
        console.log('Competencias recibidas:', data);
        this.cargarTodasLasCompetencias = data;
        // this.competenciasMatematica = data.filter(item =>
        //   item.materia === 'MATEMATICA' || item.area === 'MAT'
        // );

        // this.competenciasComunicacion = data.filter(item =>
        //   item.materia === 'COMUNICACION' || item.area === 'COM'
        // );

        // this.competenciasIngles = data.filter(item =>
        //   item.materia === 'INGLES' || item.area === 'ING'
        // );

        // this.competenciasPersonalSocial = data.filter(item =>
        //   item.materia === 'PERSONAL_SOCIAL' || item.area === 'PS'
        // );

        // this.competenciasReligiosa = data.filter(item =>
        //   item.materia === 'RELIGIOSA' || item.area === 'REL'
        // );
      },
      error: error => {
        console.error('Error al cargar competencias:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las competencias',
          life: 3000,
        });
      },
    });
  }
  onlyNumbers(event: any): void {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }
  hola() {
    console.log('hola');
  }
}
