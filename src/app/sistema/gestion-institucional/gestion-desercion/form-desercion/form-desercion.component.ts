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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { PrimengModule } from '@/app/primeng.module';

@Component({
  selector: 'app-form-desercion',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './form-desercion.component.html',
  styleUrl: './form-desercion.component.scss',
})
export class FormDesercionComponent implements OnChanges {
  formDesercion: FormGroup;
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

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService

    // private confirmationService: ConfirmationService,
  ) {
    this.formDesercion = this.fb.group({
      iDesercionId: [null],
      cPersDocumento: [null],
      iMatrId: [null, Validators.required],
      iTipoDesercionId: [0, Validators.required],
      cMotivoDesercion: [null],
      dInicioDesercion: [null, Validators.required],
      dFinDesercion: [null], // ← inicialmente deshabilitado
      iEstado: [0],
    });
  }

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
    this.formDesercion.get('iDesercionId')?.reset();
    this.formDesercion.get('cPersDocumento')?.reset();
    this.formDesercion.get('dInicioDesercion')?.reset();
    this.formDesercion.get('dFinDesercion')?.reset();
    this.formDesercion.get('iTipoDesercionId')?.setValue(0);
    this.formDesercion.get('cMotivoDesercion')?.reset();
    this.formDesercion.get('iEstado')?.setValue(0);
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
    const inicio = this.formDesercion.get('dInicioDesercion')?.value;
    const fin = this.formDesercion.get('dFinDesercion')?.value;

    if (inicio === null || inicio === undefined || inicio === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Error',
        detail: 'Debe ingresar una fecha valida.',
      });
      this.fechaInvalida = false;
      return;
    } else {
      this.fechaInvalida = true;
    }

    if (fin != null && fin != undefined && fin != '') {
      const fechaInicio = new Date(inicio);
      const fechaFin = new Date(fin);

      // Validar rango
      if (fechaFin < fechaInicio) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'La fecha de fin no puede ser anterior a la fecha de inicio.',
        });
        this.formDesercion.get('dFinDesercion')?.setValue(null);
      } else {
        this.messageService.add({
          severity: 'success',
          summary: 'Mensaje de validación',
          detail: 'La fecha de fin válida.',
        });
      }
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
