import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PrimengModule } from '@/app/primeng.module';
import { ValidacionFormulariosService } from '@/app/servicios/validacion-formularios.service';
import { MostrarErrorComponent } from '@/app/shared/components/mostrar-error/mostrar-error.component';

@Component({
  selector: 'app-form-desercion',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './form-desercion.component.html',
  styleUrl: './form-desercion.component.scss',
})
export class FormDesercionComponent extends MostrarErrorComponent implements OnChanges {
  @Input() matricula: any = {};
  @Input() matriculas_filtradas: any = []; //matriculas activas o matriculas de desercion
  @Input() titulo: string = 'Registrar deserciones en IE';
  @Input() tipo_deserciones: any = [];
  @Input() grado: string = '';
  @Input() desercion: any = {};
  @Input() bValido: boolean = false;
  @Output() accionBtnItem = new EventEmitter<{ accion: string; item: any }>();

  mensaje: string = '';
  sever: string;
  estudiante: string = '';
  bUpdate: boolean = false;
  seccion: string = '';
  fechaInvalida: boolean = false;

  private _confirmService = inject(ConfirmationModalService);
  private _ValidacionFormulariosService = inject(ValidacionFormulariosService);
  private fb = inject(FormBuilder);

  formDesercion = this.fb.group({
    iDesercionId: [null],
    cPersDocumento: [null],
    iMatrId: [null, Validators.required],
    iTipoDesercionId: ['0', Validators.required],
    cMotivoDesercion: [null, Validators.required],
    dInicioDesercion: this.fb.control<Date | null>(null, Validators.required),
    dFinDesercion: this.fb.control<Date | null>(null, Validators.required),
    iEstado: [false],
  });

  ngOnChanges(changes: SimpleChanges): void {
    this.matricula = {};
    this.desercion = {};

    // if(this.desercion.length>0){this.bValido = true}else{this.bValido = false}
    if (changes['matricula']?.currentValue) {
      this.matricula = changes['matricula'].currentValue;
      this.inicializar();
    }

    if (changes['titulo']?.currentValue) {
      this.titulo = changes['titulo'].currentValue;
    }

    if (changes['tipo_deserciones']?.currentValue) {
      this.tipo_deserciones = changes['tipo_deserciones'].currentValue;
    }

    if (changes['matriculas_filtradas']?.currentValue) {
      this.matriculas_filtradas = changes['matriculas_filtradas'].currentValue;
    }
    if (changes['grado']?.currentValue) {
      this.grado = changes['grado'].currentValue;
    }

    if (changes['desercion']?.currentValue) {
      this.desercion = changes['desercion'].currentValue;
      this.cargarDatos();
    }
    if (changes['bValido']?.currentValue) {
      this.bValido = changes['bValido'].currentValue;
    }
  }

  limpiar() {
    this.formDesercion.patchValue({
      iDesercionId: null,
      cPersDocumento: null,
      dInicioDesercion: null,
      dFinDesercion: null,
      iTipoDesercionId: '0',
      cMotivoDesercion: null,
    });

    this.bUpdate = false;
  }

  cargarDatos(): void {
    const item = this.desercion ?? {};

    if (item.iDesercionId > 0) {
      this.formDesercion.reset();
      this.formDesercion.setValue({
        cPersDocumento: this.matricula?.cPersDocumento ?? null,
        iDesercionId: item?.iDesercionId ?? null,
        iMatrId: item?.iMatrId ?? null,

        iTipoDesercionId: String(item?.iTipoDesercionId ?? null),
        cMotivoDesercion: item?.cMotivoDesercion ?? null,
        dInicioDesercion: item.dInicioDesercion ? new Date(item.dInicioDesercion) : null,
        dFinDesercion: item.dFinDesercion ? new Date(item.dFinDesercion) : null,

        iEstado: Boolean(Number(item?.iEstado ?? 0)),
      });

      this.bUpdate = true;
    }
    //this.form.get('iTipoDesercionId')?.setValue(item.iTipoDesercionId);
    // this.validarDocumento();
  }

  inicializar(): void {
    this.formDesercion.reset();
    this.bUpdate = false;
    this.bValido = false;
    this.estudiante = '';

    this.formDesercion.get('cPersDocumento')?.setValue(this.matricula?.cPersDocumento ?? null);
    this.formDesercion.get('iMatrId')?.setValue(this.matricula?.iMatrId ?? null);

    if (this.matricula?.cPersDocumento) {
      this.validarDocumento();
    }
  }
  //metos para abrir y cerrar modal
  procesar(accion: string) {
    const nombresCampos: Record<string, string> = {
      iTipoDesercionId: 'Tipo de deserción',
      cMotivoDesercion: 'Motivo',
      dInicioDesercion: 'Fecha de inicio',
      dFinDesercion: 'Fecha de término',
    };

    const { valid, message } = this._ValidacionFormulariosService.validarFormulario(
      this.formDesercion,
      nombresCampos
    );

    if (!valid && message) {
      this.mostrarMensajeToast(message);
      return;
    }

    this.validarFechas();
    if (this.fechaInvalida) return;
    this._confirmService.openConfirm({
      header: '¿Está seguro de guardar los cambios?',
      accept: () => {
        switch (accion) {
          case 'actualizar':
            this.accionBtnItem.emit({ accion: accion, item: this.formDesercion.value });
            break;
          case 'registrar':
            this.accionBtnItem.emit({ accion: accion, item: this.formDesercion.value });
            break;
          // default:
          //   this.accionBtnItem.emit({ accion: 'close', item: this.formDesercion.value });
          //   break;
        }
      },
      reject: () => {
        this.accionBtnItem.emit({ accion: 'close', item: this.formDesercion.value });
      },
    });
  }

  // validarDocumento(){
  //   const documento = this.formDesercion.get('cPersDocumento')?.value;
  //   const matricula = this.matriculas_activas.find(n => n.cPersDocumento === documento);
  //       console.log(matricula, 'matricula')
  //   if(matricula){
  //     //this.formDesercion.get('iMatrId')?.setValue(matricula.iMatrId);
  //     this.formDesercion.get('iMatrId')?.setValue(matricula.iMatrId ?? null);
  //     const seccion = matricula.cSeccionNombre;
  //     const mensaje =  matricula.estudiante+'\n (Grado: ' +this.grado +' | Sección : '+ seccion + ' ) '
  //     this.estudiante = mensaje;

  //   }else{
  //     this.estudiante = 'No se encontró estudiante con ese documento';
  //   }
  // }

  validarFechas(): void {
    const inicio = this.formDesercion.get('dInicioDesercion')?.value as Date | string | null;
    const fin = this.formDesercion.get('dFinDesercion')?.value as Date | string | null;

    // Validar que haya fecha de inicio
    if (!inicio) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Error',
        detail: 'Debe ingresar una fecha válida.',
      });
      this.fechaInvalida = true; // Se marca inválida
      return;
    }

    // Si no hay fecha de fin, no hay más que validar
    if (!fin) {
      this.fechaInvalida = false;
      return;
    }

    // Convertir a Date si son string
    const fechaInicio = inicio instanceof Date ? inicio : new Date(inicio);
    const fechaFin = fin instanceof Date ? fin : new Date(fin);

    if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Error',
        detail: 'Fechas no válidas.',
      });
      this.fechaInvalida = true;
      return;
    }

    // Validar rango correcto
    if (fechaFin < fechaInicio) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'La fecha de fin no puede ser anterior a la fecha de inicio.',
      });
      this.formDesercion.get('dFinDesercion')?.setValue(null);
      this.fechaInvalida = true;
    } else {
      this.messageService.add({
        severity: 'success',
        summary: 'Validación',
        detail: 'La fecha de fin es válida.',
      });
      this.fechaInvalida = false;
    }
  }

  validarDocumento(): void {
    let documento;
    const nombre = this.matricula._cPersNomape?.trim() || this.matricula.estudiante?.trim() || '';

    if (this.desercion.iDesercionId > 0) {
      this.seccion = `(Grado: ${this.grado} | Sección: ${this.matricula.cSeccionNombre})`;

      this.estudiante = `${this.matricula.cPersDocumento} :${nombre}`;

      this.formDesercion.get('iMatrId')?.setValue(this.matricula.iMatrId);
      this.formDesercion.get('iDesercionId')?.setValue(this.matricula.iDesercionId);
      this.bUpdate = true;
      return;
    }
    if (this.matricula.cPersDocumento.length > 0) {
      this.bValido = true;
      this.estudiante = `${this.matricula.cPersDocumento} :${nombre}`;

      this.seccion = `(Grado: ${this.grado} | Sección: ${this.matricula.cSeccionNombre})`;
      this.formDesercion.get('iMatrId')?.setValue(this.matricula.iMatrId);
      this.bUpdate = false;
      return;
    } else {
      documento = this.matricula.cPersDocumento.trim();
    }

    if (!documento) {
      this.estudiante = 'Ingrese un número de documento.';
      this.formDesercion.get('iMatrId')?.reset();
      this.bUpdate = false;
      return;
    }

    const matricula = this.matriculas_filtradas.find(
      (n: any) => String(n.cPersDocumento).trim() === documento
    );

    if (matricula) {
      const { iMatrId, cSeccionNombre, estudiante } = matricula;
      this.formDesercion.get('iMatrId')?.setValue(iMatrId ?? null);

      this.estudiante = `${estudiante}\n(Grado: ${this.grado} | Sección: ${cSeccionNombre})`;
    } else {
      this.formDesercion.get('iMatrId')?.reset();
      this.estudiante = 'No se encontró estudiante con ese documento.';
    }
  }
}
