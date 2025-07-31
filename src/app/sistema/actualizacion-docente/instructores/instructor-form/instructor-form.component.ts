import { PrimengModule } from '@/app/primeng.module';
import { InstructoresService } from '@/app/servicios/cap/instructores.service';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { GeneralService } from '@/app/servicios/general.service';
import { ValidacionFormulariosService } from '@/app/servicios/validacion-formularios.service';
import { MostrarErrorComponent } from '@/app/shared/components/mostrar-error/mostrar-error.component';
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component';
import { GestionUsuariosService } from '@/app/sistema/administrador/gestion-usuarios/services/gestion-usuarios.service';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-instructor-form',
  standalone: true,
  imports: [PrimengModule, ModalPrimengComponent],
  templateUrl: './instructor-form.component.html',
  styleUrl: './instructor-form.component.scss',
})
export class InstructorFormComponent extends MostrarErrorComponent implements OnChanges {
  @Output() accionCloseForm = new EventEmitter<void>();
  @Output() accionBtnItem = new EventEmitter();

  @Input() instructor: any = {};
  @Input() tiposIdentificaciones: any[] = [];
  @Input() showModal: boolean = false;
  @Input() action: string;

  private _constantesService = inject(ConstantesService);
  private GeneralService = inject(GeneralService);
  private _GestionUsuariosService = inject(GestionUsuariosService);
  private _InstructoresService = inject(InstructoresService);
  private _ValidacionFormulariosService = inject(ValidacionFormulariosService);

  dropdownStyle: boolean = false;
  loadingBuscar: boolean = false;
  loading: boolean = false;
  persona: any; // variable para guardar al buscar dni
  accion: string;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['instructor']) {
      this.instructorForm.patchValue(changes['instructor'].currentValue);
    }
    if (changes['tiposIdentificaciones']) {
      const tiposIdentificaciones = changes['tiposIdentificaciones'].currentValue;
      if (tiposIdentificaciones && tiposIdentificaciones.length > 0) {
        this.instructorForm.controls['iTipoIdentId'].setValue(
          tiposIdentificaciones[0].iTipoIdentId
        );
      }
    }
    if (changes['showModal']) {
      this.instructorForm.patchValue(changes['showModal'].currentValue);
    }
    if (this.action === 'editar') {
      this.accion = 'Editar Instructor';
    } else {
      this.accion = 'Nuevo Instructor';
      this.instructorForm.reset();
    }
  }

  instructorForm: FormGroup = new FormGroup({
    iTipoIdentId: new FormControl(null, Validators.required),
    iInstructorId: new FormControl(null),
    cPersDocumento: new FormControl(null),
    cPersNombre: new FormControl(null, Validators.required),
    cPersPaterno: new FormControl(null, Validators.required),
    cPersMaterno: new FormControl(null, Validators.required),
    cPersDireccion: new FormControl(null, Validators.required),
    cPersCorreo: new FormControl(null, Validators.required),
    cPersCelular: new FormControl(null, Validators.required),
    iPersId: new FormControl(null),
    iCredId: new FormControl(this._constantesService.iCredId),
  });

  // metodo para buscar x dni
  buscarDni() {
    const idtipoDocumento = Number(this.instructorForm.get('iTipoIdentId')?.value);
    const dni = this.instructorForm.get('cPersDocumento')?.value;
    if (this.loadingBuscar) return; // evitar doble clic
    this.loadingBuscar = true;

    if (!idtipoDocumento) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Seleccione un Tipo de documento',
      });
      this.loadingBuscar = false;
      return;
    }

    switch (idtipoDocumento) {
      case 1: // DNI
        const dniControl = this.instructorForm.get('cPersDocumento');
        dniControl?.setValidators([Validators.required, Validators.pattern(/^\d{8}$/)]);
        dniControl?.updateValueAndValidity();

        if (!dni || dni.toString().length !== 8) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ingrese un DNI válido de 8 dígitos numéricos',
          });
          this.loadingBuscar = false;
          return;
        }

        this._GestionUsuariosService.buscarPersonaPorDocumento(idtipoDocumento, dni).subscribe({
          next: (data: any) => {
            this.persona = data.data;
            this.instructorForm.patchValue({
              cPersNombre: this.persona.cPersNombre,
              cPersPaterno: this.persona.cPersPaterno, // corregido
              cPersMaterno: this.persona.cPersMaterno, // corregido
              cPersDireccion: this.persona.cPersDomicilio,
              cPersCorreo: this.persona.cPersConCorreoElectronico || null,
              cPersCelular: this.persona.cPersConTelefonoMovil || null,
              iPersId: this.persona.iPersId || null,
            });

            this.messageService.add({
              severity: 'success',
              summary: 'Datos encontrados',
              detail: 'Se obtuvo la información de la persona',
            });
            this.loadingBuscar = false;
          },
          error: error => {
            this.mostrarErrores(error);
            this.loadingBuscar = false;
          },
        });
        break;

      case 2: // RUC
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'RUC no disponible',
        });
        this.loadingBuscar = false;
        break;

      default:
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Tipo de documento no disponible',
        });
        this.loadingBuscar = false;
        break;
    }
  }

  data;
  // método para guardar instructor
  guardarInstructor() {
    if (this.loading) return; // evitar doble clic
    this.loading = true;

    this.instructorForm.patchValue({
      iPersId: this.persona?.iPersId || null,
      iCredId: this._constantesService.iCredId,
    });

    const nombresCampos: Record<string, string> = {
      iTipoIdentId: 'Tipo de identificación',
      cPersDocumento: 'Número de documento',
      cPersNombre: 'Nombre(s)',
      cPersPaterno: 'Apellido Paterno',
      cPersMaterno: 'Apellido Materno',
      cPersCelular: 'Celular',
      cPersCorreo: 'Correo electrónico',
      cPersDireccion: 'Dirección',
      iCredId: 'Credencial',
    };
    const { valid, message } = this._ValidacionFormulariosService.validarFormulario(
      this.instructorForm,
      nombresCampos
    );

    if (!valid && message) {
      this.mostrarMensajeToast({
        summary: message.summary,
        detail: message.detail,
        severity: message.severity,
      });
      this.loading = false;
      return;
    }
    // Servicio para obtener los instructores
    this._InstructoresService.guardarInstructores(this.instructorForm.value).subscribe({
      next: resp => {
        if (resp.validated) {
          this.mostrarMensajeToast({
            severity: 'success',
            summary: 'Acción exitosa',
            detail: resp.message,
          });
          this.showModal = false;
          this.instructorForm.reset();
        }
      },
      error: error => {
        this.mostrarErrores(error);
      },
    });
  }
  // Metodo para actualizar instructor
  actualizarInstructor() {
    const id = this.instructor;
    const docn = this.instructorForm.value;

    const data = {
      cOpcion: 'ACTUALIZAR',
      cPersCelular: docn.cPersCelular,
      cPersCorreo: docn.cPersCorreo,
      cPersDireccion: docn.cPersDireccion,
      iCredId: this._constantesService.iCredId,
    };
    const params = {
      petition: 'put',
      group: 'cap',
      prefix: 'instructores',
      ruta: id.iInstId,
      data: data,
      params: {
        iCredId: this._constantesService.iCredId,
      },
    };
    // console.log(params)
    // Servicio para obtener los instructores
    this.GeneralService.getGralPrefixx(params).subscribe({
      next: resp => {
        if (resp.validated) {
          this.messageService.add({
            severity: 'success',
            summary: 'Acción exitosa',
            detail: resp.message,
          });
          this.showModal = false;
        }
      },
      error: error => {
        this.mostrarErrores(error);
      },
    });
  }
}
