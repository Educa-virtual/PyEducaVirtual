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
import { FormArray, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';
import { ActivatedRoute } from '@angular/router';
import { LogroAlcanzadoService } from '../../services/logro-alcanzado.service';
import { ReactiveFormService } from '@/app/servicios/reactive-form.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';

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
  @Input() escalas: any[] = [];
  @Input() competencias: any = [];
  @Input() estudiante: any;
  @Input() ie_curso: any;
  @Input() iPeriodoId: number = 0;
  @Input() mostrarDialog: boolean = false;
  @Input() bTieneEscalaNumerica: boolean = false;
  @Output() registraLogroAlcanzado = new EventEmitter<boolean>();

  idDocCursoId: string;
  logros: any[] = [];

  formCompetencias: FormGroup;
  formLogro: FormGroup;
  forms_competencias: FormArray;

  logros_iniciales: any;
  escalas_filtradas: any[] = [];

  get controles_logros(): FormArray {
    return this.formCompetencias.get('controles_logros') as FormArray;
  }

  mostrarBotonFinalizar: boolean = false;

  perfil: any;
  iYAcadId: number;

  constructor(
    private messageService: MessageService,
    private logroAlcanzadoService: LogroAlcanzadoService,
    private formService: ReactiveFormService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private store: LocalStoreService
  ) {
    this.perfil = this.store.getItem('dremoPerfil');
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
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
  }

  filtrarEscala(event: any) {
    const texto = event.query ?? '';
    this.escalas_filtradas = this.escalas.filter(item => {
      const label = item.label ?? '';
      return label.toLowerCase().includes(texto.toLowerCase());
    });
  }

  validarCambios(index: number) {
    const control = this.controles_logros.at(index);
    const logro = control.value;
    if (this.logros_iniciales.length === 0) {
      control.patchValue({ bMostrarBoton: false }, { emitEvent: false });
    } else {
      const logro_inicial: any = this.logros_iniciales.find(
        (logro_inicial: any) =>
          Number(logro_inicial?.iCompetenciaId) === Number(logro?.iCompetenciaId)
      );
      if (
        control &&
        (Number(logro_inicial?.iResultado) !== Number(logro?.iResultado) ||
          Number(logro_inicial?.iEscalaCalifId) !== Number(logro?.iEscalaCalifId) ||
          String(logro_inicial?.cDescripcion ?? '') !== String(logro?.cDescripcion ?? ''))
      ) {
        control.patchValue({ bMostrarBoton: true }, { emitEvent: false });
      } else {
        control.patchValue({ bMostrarBoton: false }, { emitEvent: false });
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.escalas_filtradas = this.escalas;
    if (changes['estudiante'] && this.estudiante) {
      this.logros_iniciales = [];
      this.formCompetencias.reset();
      this.obtenerLogrosRegistrados();
    }
  }

  crearControlesLogros(logros_competencias: Array<object>) {
    const formArray = this.formCompetencias.get('controles_logros') as FormArray;
    formArray.clear();
    this.competencias.map((param: any) => {
      const logro_competencia: any = logros_competencias
        ? logros_competencias.find(
            (registro: any) => Number(registro?.iCompetenciaId) === Number(param?.iCompetenciaId)
          )
        : null;
      let logro_periodo: any = null;
      if (logro_competencia && logro_competencia?.periodos) {
        const periodos = JSON.parse(logro_competencia?.periodos);
        if (Array.isArray(periodos)) {
          logro_periodo = periodos.find(
            (periodo: any) => Number(periodo.iPeriodoId) === Number(this.iPeriodoId)
          );
        } else {
          logro_periodo = null;
        }
      }
      let grupo: FormGroup = null;
      grupo = this.fb.group({
        iCompetenciaId: [param.iCompetenciaId],
        iResultadoCompId: [logro_periodo ? logro_periodo['iResultadoCompId'] : null],
        iPeriodoId: [this.iPeriodoId],
        iDetMatrId: [this.estudiante?.iDetMatrId],
        iResultado: [logro_periodo ? logro_periodo['iResultado'] : null],
        iEscalaCalifId: [logro_periodo ? logro_periodo['iEscalaCalifId'] : null],
        cEscalaCalifLetra: [logro_periodo ? logro_periodo['cEscalaCalifLetra'] : ''],
        cDescripcion: [logro_periodo ? logro_periodo['cDescripcion'] : ''],
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
      .verResultadosCompetencias({
        iYAcadId: this.iYAcadId,
        iEstudianteId: this.estudiante?.iEstudianteId,
        iPeriodoId: this.iPeriodoId,
        iDetMatrId: this.estudiante?.iDetMatrId,
      })
      .subscribe({
        next: (data: any) => {
          this.crearControlesLogros(data.data);
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
    if (form.iResultado === null && form.iEscalaCalifId === null) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe indicar el nivel de logro alcanzado.',
      });
      this.formService.validarFormulario(form);
      return;
    }
    this.logroAlcanzadoService
      .actualizarLogro({
        idDocCursoId: this.idDocCursoId,
        iPeriodoId: this.iPeriodoId,
        iDetMatrId: this.estudiante?.iDetMatrId,
        iCompetenciaId: form.iCompetenciaId,
        iResultadoCompId: form.iResultadoCompId,
        iResultado: form.iResultado,
        cDescripcion: form.cDescripcion,
        iEscalaCalifId: form.iEscalaCalifId,
      })
      .subscribe({
        next: (response: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Registro exitoso',
            detail: 'Logro guardado exitosamente.',
          });
          // Actualizar logros_iniciales con datos actualizados
          this.logros_iniciales.forEach((logro_inicial: any, index: number) => {
            if (Number(logro_inicial.iCompetenciaId) === Number(form.iCompetenciaId)) {
              logro_inicial.iResultado = form.iResultado;
              logro_inicial.iEscalaCalifId = form.iEscalaCalifId;
              logro_inicial.cDescripcion = form.cDescripcion;
              logro_inicial.iResultadoCompId =
                form.iResultadoCompId ?? response.data.iResultadoCompId;
              this.controles_logros.at(index).patchValue(
                {
                  iResultado: logro_inicial.iResultado,
                  iEscalaCalifId: logro_inicial.iEscalaCalifId,
                  cDescripcion: logro_inicial.cDescripcion,
                  iResultadoCompId: logro_inicial.iResultadoCompId,
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

  seleccionarEscala(event: any, index: number) {
    const control = this.controles_logros.at(index);
    const escala = event.value;
    control.patchValue(
      { iEscalaCalifId: Number(escala.value), cEscalaCalifLetra: escala.label },
      { emitEvent: false }
    );
    this.validarCambios(index);
  }

  mantenerValorSeleccionado(index: number) {
    const control = this.controles_logros.at(index);
    const valorActual = control.value?.cEscalaCalifLetra;
    // Si valor es nulo o texto en blanco se valida
    if (valorActual === undefined || valorActual === null || !String(valorActual ?? '').trim()) {
      this.validarCambios(index);
      return;
    }
    // Si es texto, buscar id correspondiente si existe o restablecer
    const escalaEncontrada = this.escalas.find(
      escala =>
        String(escala?.label ?? '')
          .toLowerCase()
          .trim() === String(valorActual).toLowerCase().trim()
    );
    this.escalas_filtradas = this.escalas;
    if (escalaEncontrada) {
      control.patchValue(
        {
          iEscalaCalifId: Number(escalaEncontrada.value),
          cEscalaCalifLetra: escalaEncontrada.label,
        },
        { emitEvent: false }
      );
    } else {
      control.patchValue(
        {
          iEscalaCalifId: null,
          cEscalaCalifLetra: '',
        },
        { emitEvent: false }
      );
    }
    this.validarCambios(index);
  }

  restaurarInicial(index) {
    const logro = this.controles_logros.at(index).value;
    const logro_inicial = this.logros_iniciales.find(
      (logro_inicial: any) =>
        Number(logro_inicial?.iCompetenciaId) === Number(logro?.iCompetenciaId)
    );
    this.controles_logros.at(index).patchValue(
      {
        iResultado: logro_inicial.iResultado,
        iEscalaCalifId: logro_inicial.iEscalaCalifId,
        cDescripcion: logro_inicial.cDescripcion,
        bMostrarBoton: false,
      },
      { emitEvent: false }
    );
  }
}
