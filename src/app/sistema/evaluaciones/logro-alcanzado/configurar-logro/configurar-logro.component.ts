import { PrimengModule } from '@/app/primeng.module';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LogroAlcanzadoService } from '../../services/logro-alcanzado.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-configurar-logro',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './configurar-logro.component.html',
  styleUrl: './configurar-logro.component.scss',
})
export class ConfigurarLogroComponent implements OnInit, OnChanges {
  @Input() curso: any;
  @Output() configuraEscala = new EventEmitter<boolean>();

  formEscala: any;

  tipos_calificacion: any[] = [];
  escalas: any[] = [];
  idDocCursoId: string;
  verInputsEscalas: boolean = false;

  valor_anterior: any;

  CALIFICACION_CUANTITATIVA = this.logroAlcanzadoService.CALIFICACION_CUANTITATIVA;
  CALIFICACION_EQUIVALENTE = this.logroAlcanzadoService.CALIFICACION_EQUIVALENTE;

  get controles_escalas(): FormArray {
    return this.formEscala.get('controles_escalas') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private logroAlcanzadoService: LogroAlcanzadoService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.tipos_calificacion = this.logroAlcanzadoService.getTiposCalificacion();
    try {
      this.formEscala = this.fb.group({
        iTipoCalificacionId: [null, Validators.required],
        controles_escalas: this.fb.array([]),
      });
    } catch (error) {
      console.error('Error al inicializar el formulario:', error);
    }
    this.formEscala.get('iTipoCalificacionId')?.valueChanges.subscribe(tipo => {
      if (tipo === this.CALIFICACION_CUANTITATIVA) {
        this.verInputsEscalas = false;
      } else {
        this.verInputsEscalas = true;
      }
    });
    this.formEscala.get('iTipoCalificacionId').patchValue(this.CALIFICACION_CUANTITATIVA);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['curso'] && this.curso?.idDocCursoId) {
      this.formEscala.reset();
      this.obtenerEscalasRegistradas();
    }
  }

  revisarConfigEscala(escalas_registradas: Array<object>) {
    const escalas_configuradas = escalas_registradas.filter((escala: any) => {
      console.log(escala.idDocCursoId, 'escala');
      if (escala.idDocCursoId !== null) return escala;
    });
    if (escalas_configuradas.length > 0) {
      this.formEscala.get('iTipoCalificacionId').patchValue(this.CALIFICACION_EQUIVALENTE);
    } else {
      this.formEscala.get('iTipoCalificacionId').patchValue(this.CALIFICACION_CUANTITATIVA);
    }
  }

  crearControlesEscalas(escalas_registradas: Array<object>) {
    const formArray = this.formEscala.get('controles_escalas') as FormArray;
    formArray.clear();
    escalas_registradas.map((escala: any) => {
      let grupo: FormGroup = null;
      grupo = this.fb.group({
        iEscalaCalifId: [escala.iEscalaCalifId, Validators.required],
        cEscalaCalifLetraNombre: [escala.cEscalaCalifLetraNombre],
        nEscalaCalifMin: [escala ? escala['nEscalaCalifMin'] : null, Validators.required],
        nEscalaCalifMax: [escala ? escala['nEscalaCalifMax'] : null, Validators.required],
      });
      formArray.push(grupo);
    });
    this.escalas = formArray.value;
  }

  obtenerEscalasRegistradas() {
    this.messageService.clear();
    this.logroAlcanzadoService
      .obtenerEscalasCalificacion({
        idDocCursoId: this.curso?.idDocCursoId,
      })
      .subscribe({
        next: (response: any) => {
          this.revisarConfigEscala(response.data);
          this.crearControlesEscalas(response.data);
        },
        error: error => {
          console.error('Error al buscar escalas:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Ocurrió un error',
            detail: error.message ?? 'No se pudo obtener la información de escalas.',
          });
        },
      });
  }

  salirResetearForm() {
    this.formEscala.reset();
    this.configuraEscala.emit(false);
  }

  actualizarEscala() {
    this.messageService.clear();

    this.logroAlcanzadoService
      .actualizarEscalaCalificacion({
        idDocCursoId: this.curso?.idDocCursoId,
        iTipoCalificacionId: this.formEscala.value.iTipoCalificacionId,
        jsonEscalas: JSON.stringify(this.formEscala.value.controles_escalas),
      })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Actualización exitosa',
            detail: 'Datos actualizados exitosamente.',
          });
          this.formEscala.reset();
          this.configuraEscala.emit(false);
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Ocurrió un error',
            detail: error.message ?? 'No se pudo actualizar.',
          });
        },
      });
  }

  guardarValorAnterior(event) {
    this.valor_anterior = event?.target?.value;
  }

  validarEscala(tipo: 'min' | 'max', index: number) {
    this.messageService.clear();
    const formArray = this.controles_escalas;
    if (!formArray || index < 0 || index >= formArray.length) return;

    const grupo = formArray.at(index) as FormGroup;
    const valorMin = Number(grupo.get('nEscalaCalifMin')?.value ?? NaN);
    const valorMax = Number(grupo.get('nEscalaCalifMax')?.value ?? NaN);
    const valorAnterior = Number(
      String(this.valor_anterior)
        .replace(/[^0-9\-,.]/g, '')
        .replace(',', '.')
    );

    if (tipo === 'min') {
      if (valorMin >= valorMax) {
        grupo.get('nEscalaCalifMin')?.setValue(valorAnterior, { emitEvent: false });
        grupo.get('nEscalaCalifMin')?.updateValueAndValidity();
        (grupo as FormGroup).markAsDirty();
        this.escalas = formArray.value;
        this.messageService.add({
          severity: 'warn',
          summary: 'Advertencia',
          detail: 'El valor mínimo debe ser menor al valor máximo',
        });
        return;
      }
      if (index > 0 && !isNaN(valorMin)) {
        const prev = formArray.at(index - 1) as FormGroup;
        const nuevoMaxPrev = parseFloat((valorMin - 0.01).toFixed(2));
        prev.get('nEscalaCalifMax')?.setValue(nuevoMaxPrev, { emitEvent: false });
        prev.get('nEscalaCalifMax')?.updateValueAndValidity();
        (prev as FormGroup).markAsDirty();
      }
    } else {
      if (valorMax <= valorMin) {
        grupo.get('nEscalaCalifMax')?.setValue(valorAnterior, { emitEvent: false });
        grupo.get('nEscalaCalifMax')?.updateValueAndValidity();
        (grupo as FormGroup).markAsDirty();
        this.escalas = formArray.value;
        this.messageService.add({
          severity: 'warn',
          summary: 'Advertencia',
          detail: 'El valor máximo debe ser mayor al valor mínimo',
        });
        return;
      }
      if (index < formArray.length - 1 && !isNaN(valorMax)) {
        const next = formArray.at(index + 1) as FormGroup;
        const nuevoMinNext = parseFloat((valorMax + 0.01).toFixed(2));
        next.get('nEscalaCalifMin')?.setValue(nuevoMinNext, { emitEvent: false });
        next.get('nEscalaCalifMin')?.updateValueAndValidity();
        (next as FormGroup).markAsDirty();
      }
    }
    this.escalas = formArray.value;
  }
}
