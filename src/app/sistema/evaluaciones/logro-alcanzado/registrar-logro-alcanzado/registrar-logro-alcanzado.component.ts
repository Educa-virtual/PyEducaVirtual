import {
  Component,
  Input,
  SimpleChanges,
  EventEmitter,
  Output,
  OnInit,
  OnChanges,
} from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { MessageService } from 'primeng/api';
import { FormArray, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';
import { LogroAlcanzadoService } from '../../services/logro-alcanzado.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-registrar-logro-alcanzado',
  standalone: true,
  imports: [PrimengModule, FormsModule, TextFieldModule],
  templateUrl: './registrar-logro-alcanzado.component.html',
  styleUrl: './registrar-logro-alcanzado.component.scss',
  providers: [MessageService],
})
export class RegistrarLogroAlcanzadoComponent implements OnInit, OnChanges {
  @Input() periodos: any[] = [];
  @Input() competencias: any = [];
  @Input() iDetMatrId: number;
  @Input() cCursoNombre: string = '';
  @Input() iPeriodoId: string = '0';
  @Input() mostrarDialog: boolean = false;
  @Output() registraLogroAlcanzado = new EventEmitter<boolean>();

  idDocCursoId: string;
  logros: any[] = [];

  formCompetencias: FormGroup;
  formLogro: FormGroup;
  forms_competencias: FormArray;

  logros_iniciales: any;

  get controles_logros(): FormArray {
    return this.formCompetencias.get('controles_logros') as FormArray;
  }

  conversion: any[] = [
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

  constructor(
    private messageService: MessageService,
    private logroAlcanzadoService: LogroAlcanzadoService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.idDocCursoId = params['idDocCursoId'];
    });
  }

  ngOnInit() {
    try {
      this.formCompetencias = this.fb.group({
        controles_logros: this.fb.array([]),
      });
    } catch (e) {
      console.error('Error al inicializar el formulario:', e);
    }
    this.crearControlesLogros([]);

    this.formCompetencias.get('controles_logros').valueChanges.subscribe(logros => {
      logros.forEach((logro: any, index: number) => {
        if (this.logros_iniciales) {
          const logro_inicial: any = this.logros_iniciales.find(
            (logro_inicial: any) =>
              Number(logro_inicial?.iCompetenciaId) === Number(logro?.iCompetenciaId)
          );
          const control = this.controles_logros.at(index);
          if (
            control &&
            (Number(logro_inicial.iResultado) !== Number(logro.iResultado) ||
              logro_inicial.cDescripcion !== logro.cDescripcion)
          ) {
            control.patchValue({ bMostrarBoton: true }, { emitEvent: false });
          } else {
            control.patchValue({ bMostrarBoton: false }, { emitEvent: false });
          }
        }
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['iDetMatrId'] && this.iDetMatrId) {
      this.obtenerLogrosRegistrados();
    }
  }

  crearControlesLogros(logros_competencias: Array<object>) {
    const formArray = this.formCompetencias.get('controles_logros') as FormArray;
    formArray.clear();
    this.competencias.map((param: any) => {
      const logro_competencia: any = logros_competencias
        ? logros_competencias.find(
            (registro: any) => Number(registro.iCompetenciaId) === Number(param.iCompetenciaId)
          )
        : null;
      const logro_periodo = JSON.parse(logro_competencia.periodos).find(
        (periodo: any) => Number(periodo.iPeriodoId) === Number(this.iPeriodoId)
      );
      let grupo: FormGroup = null;
      grupo = this.fb.group({
        iCompetenciaId: [param.iCompetenciaId],
        iResultadoCompId: [logro_periodo ? logro_periodo['iResultadoCompId'] : 0],
        iPeriodoId: [this.iPeriodoId],
        iDetMatrId: [this.iDetMatrId],
        iResultado: [logro_periodo ? logro_periodo['iResultado'] : null, Validators.required],
        cDescripcion: [logro_periodo ? logro_periodo['cDescripcion'] : null],
        cNivelLogro: [logro_periodo ? logro_periodo['cNivelLogro'] : null],
        bMostrarBoton: [false],
      });
      formArray.push(grupo);
    });
    this.logros_iniciales = JSON.parse(JSON.stringify(formArray.value));
  }

  cerrarDialog() {
    this.registraLogroAlcanzado.emit(false);
    this.crearControlesLogros([]);
  }

  finalizarRegistro() {
    this.registraLogroAlcanzado.emit(false);
    this.mostrarBotonFinalizar = false;
    this.crearControlesLogros([]);
  }

  obtenerLogrosRegistrados() {
    this.messageService.clear();
    this.logroAlcanzadoService
      .obtenerLogrosEstudiante({
        idDocCursoId: this.idDocCursoId,
        iDetMatrId: this.iDetMatrId,
      })
      .subscribe({
        next: (response: any) => {
          this.crearControlesLogros(response.data);
        },
        error: error => {
          console.error('Error al buscar logros:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Ocurrió un error',
            detail: error.message ?? 'No se pudo obtener la información de logros.',
          });
        },
      });
  }

  /* Función para guardar nuevo logro y actualizar logro existente */
  actualizarLogro(index: number) {
    this.messageService.clear();
    const form = this.formCompetencias.get('controles_logros').value[index];
    if (form.iResultado === null || (form.cNivelLogro === 'C' && form.cDescripcion === '')) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail:
          'Debe indicar el nivel de logro y en caso sea "C" también una conclusión descriptiva.',
      });
      this.logroAlcanzadoService.formMarkAsDirty(form);
      return;
    }
    this.logroAlcanzadoService
      .actualizarLogro({
        idDocCursoId: this.idDocCursoId,
        iPeriodoId: this.iPeriodoId,
        iDetMatrId: this.iDetMatrId,
        iCompetenciaId: form.iCompetenciaId,
        iResultadoCompId: form.iResultadoCompId,
        iResultado: form.iResultado,
        cDescripcion: form.cDescripcion,
        cNivelLogro: form.cNivelLogro,
      })
      .subscribe({
        next: (response: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Registro exitoso',
            detail: 'Logro guardado exitosamente.',
          });
          // Actualizar logros_iniciales con datos actualizados
          this.logros_iniciales.forEach((logro: any, index: number) => {
            if (Number(logro.iCompetenciaId) === Number(form.iCompetenciaId)) {
              logro.iResultado = form.iResultado;
              logro.cDescripcion = form.cDescripcion;
              logro.iResultadoCompId = form.iResultadoCompId ?? response.data.iResultadoCompId;
              this.controles_logros.at(index).patchValue(
                {
                  bMostrarBoton: false,
                },
                { emitEvent: false }
              );
            }
          });
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Ocurrió un error',
            detail: error.message ?? 'No se pudo guardar el logro.',
          });
        },
      });
  }
}
