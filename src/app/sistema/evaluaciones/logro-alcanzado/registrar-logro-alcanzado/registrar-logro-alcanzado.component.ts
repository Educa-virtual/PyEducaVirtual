import { Component, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
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
export class RegistrarLogroAlcanzadoComponent implements OnChanges {
  @Input() selectedItem: any;
  //variables para las competencias
  @Input() competencias: any = [];
  @Input() area: any = [];
  //@Input() curso: any = [];
  @Input() iPeriodoId: string = '0'; // Variable para almacenar el periodo seleccionado
  @Input() mostrarDialog: boolean = false;
  @Output() registraLogroAlcanzado = new EventEmitter<boolean>();
  //periodo array
  periodos: any[] = [];
  cargarPeriodo: boolean = true;
  area_nombre: string = ''; // Variable para almacenar el área del curso seleccionado

  mostrarBotonFinalizar: boolean = false;

  //variables
  iCalifIdPeriodo1: string = ''; // Variable para almacenar el periodo seleccionado
  iCalifIdPeriodo2: string = ''; // Variable para almacenar el periodo seleccionado
  iCalifIdPeriodo3: string = ''; // Variable para almacenar el periodo seleccionado
  iCalifIdPeriodo4: string = ''; // Variable para almacenar el periodo seleccionado
  iPromedio: string = ''; // Variable para almacenar el periodo seleccionado

  cDetMatrConclusionDesc1: string = ''; // Variable para almacenar el periodo seleccionado
  cDetMatrConclusionDesc2: string = ''; // Variable para almacenar el periodo seleccionado
  cDetMatrConclusionDesc3: string = ''; // Variable para almacenar el periodo seleccionado
  cDetMatrConclusionDesc4: string = ''; // Variable para almacenar el periodo seleccionado
  cDetMatrConclusionDescPromedio: string = ''; // Variable para almacenar el periodo seleccionado

  /* competencia = [
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
*/
  constructor(
    private messageService: MessageService,
    private calendarioPeriodosService: CalendarioPeriodosEvalacionesService,
    private DatosMatriculaService: DatosMatriculaService
    //private DetalleMatriculasServic: DetalleMatriculasService,
    //private ConstantesService: ConstantesService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedItem']) {
      if (Array.isArray(this.selectedItem) && this.selectedItem.length > 0) {
        console.log(this.selectedItem, 'selectedItem');
        this.messageService.add({
          severity: 'warn',
          summary: 'Mensaje del sistema',
          detail: 'Se detecto cambios en información del estudiante',
          life: 3000,
        });
      }
      // this.filtrarArea();
    }
    if (changes['competencias']) {
      if (Array.isArray(this.competencias) && this.competencias.length > 0) {
        this.actualizarArea(); //actualizar los valores de las variables con los datos del selectedItem

        this.messageService.add({
          severity: 'warn',
          summary: 'Mensaje del sistema',
          detail: 'Se detecto cambios en información del competencias',
          life: 3000,
        });
      }
    }
  }

  actualizarArea() {
    this.iCalifIdPeriodo1 = this.selectedItem[0].iCalifIdPeriodo1 ?? '';
    this.iCalifIdPeriodo2 = this.selectedItem[0].iCalifIdPeriodo2 ?? '';
    this.iCalifIdPeriodo3 = this.selectedItem[0].iCalifIdPeriodo3 ?? '';
    this.iCalifIdPeriodo4 = this.selectedItem[0].iCalifIdPeriodo4 ?? '';
    this.iPromedio = this.selectedItem[0].iPromedio ?? '';

    this.cDetMatrConclusionDesc1 = this.selectedItem[0].cDetMatrConclusionDesc1 ?? '';
    this.cDetMatrConclusionDesc2 = this.selectedItem[0].cDetMatrConclusionDesc2 ?? '';
    this.cDetMatrConclusionDesc3 = this.selectedItem[0].cDetMatrConclusionDesc3 ?? '';
    this.cDetMatrConclusionDesc4 = this.selectedItem[0].cDetMatrConclusionDesc4 ?? '';
    this.cDetMatrConclusionDescPromedio = this.selectedItem[0].cDetMatConclusionDescPromedio ?? '';
  }

  cerrarDialog() {
    this.registraLogroAlcanzado.emit(false);
  }
  /*
  filtrarArea() {
    let areas: any[] = [];
  
    try {
      // Parsear el string a un array real
      areas = JSON.parse(this.selectedItem?.json_cursos || '[]');
    } catch (e) {
      console.error('Error parseando json_cursos:', e);
      return;
    }
  
    // Filtrar por el curso seleccionado
    const curso = areas.filter((item: any) =>
      item.cCursoNombre === this.selectedItem.cCursoNombre
    );
  
    console.log('Curso filtrado:', curso);
  }*/

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
  /* CompetenciasAPeriodos() {
   
  }*/

  guardarLogro() {
    this.messageService.add({
      severity: 'success',
      summary: 'Guardado',
      detail: 'Guardado Exitosamente',
      life: 3000,
    });
    const datosCompletos = {
      estudiante: this.selectedItem,
      matematica: this.competencias,
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
            // this.CompetenciasAPeriodos();
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
