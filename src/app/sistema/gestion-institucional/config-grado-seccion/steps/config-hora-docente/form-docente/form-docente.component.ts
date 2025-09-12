import {
  Component,
  Output,
  EventEmitter,
  Input,
  inject,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { GeneralService } from '@/app/servicios/general.service';

@Component({
  selector: 'app-form-docente',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './form-docente.component.html',
  styleUrl: './form-docente.component.scss',
})
export class FormDocenteComponent implements OnChanges {
  form: FormGroup;
  @Input() configuracion: any = {};
  @Input() docente: any = {};
  @Input() c_accion: string = 'agregar'; // editar | agregar    @Output() accionBtnItem = new EventEmitter()

  @Output() accionBtnItem = new EventEmitter<{ accion: string; item: any }>();

  persona: any = {};
  mensaje: string = '';
  titulo: string = 'Registrar Docente en IE';
  sever: string;

  private _confirmService = inject(ConfirmationModalService); // componente de dialog mensaje

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private query: GeneralService
    // private confirmationService: ConfirmationService,
  ) {
    this.form = this.fb.group({
      iPersIeId: [0],
      iPersId: [0, [Validators.required, Validators.min(1)]],
      iYAcadId: [0, [Validators.required, Validators.min(1)]],
      iPersCargoId: [3, [Validators.required]], //docente
      iSedeId: [null, [Validators.required, Validators.min(1)]],
      iHorasLabora: [null, [Validators.required, Validators.min(6), Validators.max(40)]],
      cTipoTrabajador: [null],
      cMotivo: [null],
      dtPersIeInicio: [null],
      dtPersIeFin: [null],
      iEstado: [1],
      cCodigoPlaza: [null],
      dni: [null],
    });
  }
  //metodo para inicializar el formulario
  ngOnChanges(changes: SimpleChanges): void {
    // Cuando cambia configuración
    if (
      changes['configuracion']?.currentValue != null &&
      changes['configuracion'].previousValue !== changes['configuracion'].currentValue
    ) {
      this.configuracion = changes['configuracion'].currentValue;
      this.inicializar();
    }

    // Cuando cambia docente
    if (
      changes['docente']?.currentValue != null &&
      changes['docente'].previousValue !== changes['docente'].currentValue
    ) {
      this.docente = changes['docente'].currentValue;
      this.inicializar();

      const nombre = this.docente?.nombre_completo?.trim();
      if (nombre && nombre.length > 0) {
        this.mensaje = nombre;
        this.sever = 'success';
      } else {
        this.mensaje = 'No se encontró nombre del Docente';
        this.sever = 'error';
      }
    }
  }

  inicializar(): void {
    this.form.setValue({
      iPersIeId: this.docente?.iPersIeId ?? 0,
      iPersId: this.docente?.iPersId ?? 0,
      iYAcadId: this.docente?.iYAcadId ?? this.configuracion.iYAcadId ?? 0,
      iPersCargoId: 3,
      iSedeId: this.docente?.iSedeId ?? this.configuracion.iSedeId ?? 0,
      iHorasLabora: this.docente?.iHorasLabora ?? null,
      cTipoTrabajador: this.docente?.cTipoTrabajador ?? null,
      cMotivo: this.docente?.cMotivo ?? null,
      dtPersIeInicio: this.docente?.dtPersIeInicio ?? null,
      dtPersIeFin: this.docente?.dtPersIeFin ?? null,
      iEstado: this.docente?.iEstado ?? 0,
      cCodigoPlaza: this.docente?.cCodigoPlaza ?? null,
      dni: this.docente?.cPersDocumento ?? null,
    });
  }

  buscarDni() {
    const dni = String(this.form.get('dni')?.value);
    this.query
      .searchCalendario({
        json: JSON.stringify({
          cPersDocumento: dni,
        }),
        _opcion: 'getPersona',
      })
      .subscribe({
        next: (data: any) => {
          this.persona = data.data;
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del Sistema',
            detail: 'Error al obtener datos del docuemento: ' + error.message,
          });
        },
        complete: () => {
          if (this.persona.length > 0) {
            this.mensaje = this.persona[0].NombreCompleto;
            this.sever = 'success';
            this.form.patchValue({
              iPersId: this.persona[0].iPersId,
            });
          } else {
            this.mensaje = dni + ' No cuenta con registro comunicarse con el Administrador';
            this.sever = 'error';
          }
        },
      });
  }
  //metos para abrir y cerrar modal
  procesar(accion: string) {
    this._confirmService.openConfirm({
      header: '¿Está seguro de guardar los cambios?',
      accept: () => {
        switch (accion) {
          case 'actualizar':
            this.accionBtnItem.emit({ accion: accion, item: this.form.value });
            break;
          case 'registrar':
            this.accionBtnItem.emit({ accion: accion, item: this.form.value });
            break;
          default:
            this.accionBtnItem.emit({ accion: 'close', item: this.form.value });
            break;
        }
      },
      reject: () => {
        this.accionBtnItem.emit({ accion: 'close', item: this.form.value });
      },
    });
  }
}
