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
      this.obtenerEscalasRegistradas();
    }
  }

  crearControlesEscalas(escalas_registradas: Array<object>) {
    this.formEscala
      .get('iTipoCalificacionId')
      .patchValue(
        escalas_registradas.length > 0
          ? this.CALIFICACION_EQUIVALENTE
          : this.CALIFICACION_CUANTITATIVA
      );
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
}
