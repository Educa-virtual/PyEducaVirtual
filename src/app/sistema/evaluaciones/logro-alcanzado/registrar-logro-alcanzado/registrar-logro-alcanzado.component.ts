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
  @Output() registraLogroAlcanzado = new EventEmitter<boolean>();

  formCompetencias: FormGroup;

  /** Copia inicial (pristina) de cada fila, indexada igual que controles_logros */
  logros_iniciales: any[] = [];
  escalas_filtradas: any[] = [];

  iYAcadId: number;

  get controles_logros(): FormArray {
    return this.formCompetencias.get('controles_logros') as FormArray;
  }

  constructor(
    private messageService: MessageService,
    private logroAlcanzadoService: LogroAlcanzadoService,
    private formService: ReactiveFormService,
    private fb: FormBuilder,
    private store: LocalStoreService
  ) {
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
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
    // Cuando ngOnChanges se ejecuta antes de ngOnInit (estudiante ya asignado) los logros se cargan aquí
    if (this.estudiante) {
      this.obtenerLogrosRegistrados();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.reiniciarSugerencias();
    if (changes['estudiante'] && this.estudiante && this.formCompetencias) {
      this.logros_iniciales = [];
      this.formCompetencias.reset();
      this.obtenerLogrosRegistrados();
    }
  }

  /* Sugerencias del autocomplete de escalas (si no hay texto se muestra el catálogo completo) */
  filtrarEscala(event: any) {
    const texto = String(event?.query ?? '')
      .trim()
      .toLowerCase();
    const catalogo = this.escalas ?? [];
    // Siempre se asigna un arreglo nuevo: PrimeNG solo refresca el panel de sugerencias
    // (y quita el indicador de carga) cuando cambia la referencia de [suggestions]
    this.escalas_filtradas = texto
      ? catalogo.filter(item =>
          String(item?.label ?? '')
            .toLowerCase()
            .includes(texto)
        )
      : catalogo.slice();
  }

  /* Al abrir el panel se muestra siempre el catálogo completo de escalas */
  reiniciarSugerencias() {
    // Arreglo nuevo para que PrimeNG refresque el panel de sugerencias
    this.escalas_filtradas = (this.escalas ?? []).slice();
  }

  /* Normaliza un valor para comparar: null, undefined y cadena vacía se consideran el mismo valor */
  normalizarValor(valor: any): any {
    if (valor === undefined || valor === null) return null;
    if (typeof valor === 'string' && valor.trim() === '') return null;
    return valor;
  }

  /* Compara dos valores de los controles evitando falsos positivos por formato ('', null, undefined) */
  sonIguales(valorA: any, valorB: any): boolean {
    const a = this.normalizarValor(valorA);
    const b = this.normalizarValor(valorB);
    if (a === null || b === null) return a === b;
    if (!isNaN(Number(a)) && !isNaN(Number(b))) return Number(a) === Number(b);
    return String(a).trim() === String(b).trim();
  }

  /* Obtiene la copia inicial de una fila; se indexa igual que controles_logros y si no existe se busca por competencia */
  obtenerInicial(index: number): any {
    const inicial = this.logros_iniciales ? this.logros_iniciales[index] : null;
    if (inicial) return inicial;
    const logro = this.controles_logros.at(index)?.value;
    return (
      this.logros_iniciales?.find(item =>
        this.sonIguales(item?.iCompCursoId, logro?.iCompCursoId)
      ) ?? null
    );
  }

  /* Determina si la fila tiene cambios respecto a su estado inicial (solo campos editables) */
  hayCambios(index: number): boolean {
    const control = this.controles_logros.at(index);
    const inicial = this.obtenerInicial(index);
    if (!control || !inicial) return false;
    const logro = control.value;
    return (
      !this.sonIguales(inicial.iEscalaCalifId, logro?.iEscalaCalifId) ||
      !this.sonIguales(inicial.cEscalaCalifLetra, logro?.cEscalaCalifLetra) ||
      !this.sonIguales(inicial.cDescripcion, logro?.cDescripcion)
    );
  }

  /* Activa o desactiva los botones de guardar/deshacer de la fila según sus cambios */
  validarCambios(index: number) {
    const control = this.controles_logros.at(index);
    if (!control) return;
    const bMostrarBoton = this.hayCambios(index);
    if (control.value?.bMostrarBoton !== bMostrarBoton) {
      control.patchValue({ bMostrarBoton }, { emitEvent: false });
    }
  }

  crearControlesLogros(logros_competencias: Array<object>) {
    const formArray = this.formCompetencias.get('controles_logros') as FormArray;
    formArray.clear();
    (this.competencias ?? []).forEach((param: any) => {
      const logro_competencia = logros_competencias
        ? logros_competencias.find(
            (registro: any) => Number(registro?.iCompCursoId) === Number(param?.iCompCursoId)
          )
        : null;
      // Se usa la letra del catálogo de escalas para que el autocomplete y el id queden consistentes
      const escala_catalogo = (this.escalas ?? []).find(
        (escala: any) => Number(escala?.value) === Number(logro_competencia?.['iEscalaCalifId'])
      );
      const grupo: FormGroup = this.fb.group({
        iCompCursoId: [param.iCompCursoId],
        iResultadoCompId: [logro_competencia ? logro_competencia['iResultadoCompId'] : null],
        iPeriodoId: [this.iPeriodoId],
        iDetMatrId: [this.estudiante?.iDetMatrId],
        iResultado: [logro_competencia ? logro_competencia['iResultado'] : null],
        iEscalaCalifId: [logro_competencia ? logro_competencia['iEscalaCalifId'] : null],
        cEscalaCalifLetra: [
          escala_catalogo
            ? escala_catalogo.label
            : logro_competencia
              ? (logro_competencia['cEscalaCalifLetra'] ?? '')
              : '',
        ],
        cDescripcion: [logro_competencia ? (logro_competencia['cDescripcion'] ?? '') : ''],
        bMostrarBoton: [false],
      });
      formArray.push(grupo);
    });
    this.reiniciarSugerencias();
    // Copia inicial por fila, respetando el mismo índice que controles_logros
    this.logros_iniciales = formArray.controls.map(control => ({ ...control.getRawValue() }));
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
          // Se reconstruyen las filas vacías para que el docente pueda registrar los logros
          this.crearControlesLogros([]);
          this.messageService.add({
            severity: 'error',
            summary: 'Ocurrió un error',
            detail: error.message ?? 'No se pudo obtener la información de logros.',
          });
        },
      });
  }

  /* Normaliza el texto del autocomplete con el catálogo de escalas; si no coincide restaura el valor inicial */
  mantenerValorSeleccionado(index: number) {
    const control = this.controles_logros.at(index);
    if (!control) return;
    const valorActual = control.value?.cEscalaCalifLetra;
    // Cuando el autocomplete entrega la opción completa (objeto) no se modifica nada
    if (valorActual && typeof valorActual === 'object') return;
    const texto = String(valorActual ?? '')
      .trim()
      .toLowerCase();
    const escala = texto
      ? (this.escalas ?? []).find(
          item =>
            String(item?.label ?? '')
              .trim()
              .toLowerCase() === texto
        )
      : null;
    this.reiniciarSugerencias();
    if (escala) {
      control.patchValue(
        { iEscalaCalifId: Number(escala.value), cEscalaCalifLetra: escala.label },
        { emitEvent: false }
      );
    } else {
      // Texto vacío o no reconocido: se restaura la escala inicial para no perder el registro
      const inicial = this.obtenerInicial(index);
      control.patchValue(
        {
          iEscalaCalifId: inicial?.iEscalaCalifId ?? null,
          cEscalaCalifLetra: inicial?.cEscalaCalifLetra ?? '',
        },
        { emitEvent: false }
      );
    }
    this.validarCambios(index);
  }

  /* Permite escribir el nivel de logro y confirmarlo con Enter (Tab y clic ya se resuelven en onBlur) */
  mantenerValorSeleccionadoTeclado(event: Event, index: number) {
    if (String((event as KeyboardEvent)?.key ?? '').toLowerCase() !== 'enter') return;
    // Evita el envío implícito del formulario al presionar Enter
    event.preventDefault();
    this.mantenerValorSeleccionado(index);
  }

  seleccionarEscala(event: any, index: number) {
    const control = this.controles_logros.at(index);
    const escala = event?.value;
    if (!control || !escala) return;
    control.patchValue(
      { iEscalaCalifId: Number(escala.value), cEscalaCalifLetra: escala.label },
      { emitEvent: false }
    );
    this.reiniciarSugerencias();
    this.validarCambios(index);
  }

  /* Función para guardar nuevo logro y actualizar logro existente */
  actualizarLogrosRegistrados(index: number) {
    this.messageService.clear();
    const control = this.controles_logros.at(index) as FormGroup;
    if (!control) return;
    const form = control.value;
    if (form.iResultado === null && form.iEscalaCalifId === null) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe indicar el nivel de logro alcanzado.',
      });
      this.formService.validarFormulario(control);
      return;
    }
    this.logroAlcanzadoService
      .actualizarResultadosCompetencias({
        iYAcadId: this.iYAcadId,
        iEstudianteId: this.estudiante?.iEstudianteId,
        iPeriodoId: this.iPeriodoId,
        iDetMatrId: this.estudiante?.iDetMatrId,
        iCompCursoId: form.iCompCursoId,
        iResultadoCompId: form.iResultadoCompId,
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
          // La copia inicial de la misma fila queda con los datos recién guardados (incluye la letra de la escala)
          const logro_inicial = {
            ...control.getRawValue(),
            iResultadoCompId: form.iResultadoCompId ?? response?.data?.iResultadoCompId,
            bMostrarBoton: false,
          };
          this.logros_iniciales[index] = logro_inicial;
          control.patchValue(
            {
              iResultadoCompId: logro_inicial.iResultadoCompId,
              bMostrarBoton: false,
            },
            { emitEvent: false }
          );
        },
        error: error => {
          console.error('Error al guardar el logro:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Ocurrió un error',
            detail: error.message ?? 'No se pudo guardar el logro.',
          });
        },
      });
  }

  /* Devuelve la fila a su estado inicial (incluye la letra de la escala del autocomplete) */
  restaurarInicial(index: number) {
    const control = this.controles_logros.at(index);
    if (!control) return;
    const inicial = this.obtenerInicial(index);
    control.patchValue(
      {
        iResultado: inicial?.iResultado ?? null,
        iResultadoCompId: inicial?.iResultadoCompId ?? null,
        iEscalaCalifId: inicial?.iEscalaCalifId ?? null,
        cEscalaCalifLetra: inicial?.cEscalaCalifLetra ?? '',
        cDescripcion: inicial?.cDescripcion ?? '',
        bMostrarBoton: false,
      },
      { emitEvent: false }
    );
    this.validarCambios(index);
  }
}
