import { PrimengModule } from '@/app/primeng.module';
import { Component, EventEmitter, Input, Output, OnChanges, OnInit } from '@angular/core';
import { ModalPrimengComponent } from '../modal-primeng/modal-primeng.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { RecoverPasswordService } from './services/recover-password.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [PrimengModule, ModalPrimengComponent],
  templateUrl: './recover-password.component.html',
  styleUrl: './recover-password.component.scss',
})
export class RecoverPasswordComponent implements OnChanges, OnInit {
  @Output() accionBtnItem = new EventEmitter();
  @Input() showModal: boolean = true;
  formCredencial!: FormGroup;
  isLoading: boolean = false;
  reenviandoCodigo: boolean = false;
  correoMasked: string = '';
  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  paso: number = 1;

  showPassword: boolean = false;
  showPasswordConfir: boolean = false;

  constructor(
    private fb: FormBuilder,
    private recoverService: RecoverPasswordService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.formCredencial = this.fb.group(
      {
        cCredUsuario: ['', Validators.required],
        cCodigoRecuperacion: ['', Validators.required],
        cResetToken: ['', Validators.required],
        contrasenaNueva: [
          '',
          [Validators.required, Validators.minLength(8), Validators.pattern(this.passwordPattern)],
        ],
        confirmarContrasena: ['', Validators.required],
      },
      {
        validators: this.validadorCoincidenciaPassword,
      }
    );
  }

  validadorCoincidenciaPassword(formGroup: FormGroup) {
    const contrasenaNueva = formGroup.get('contrasenaNueva')?.value;
    const confirmarContrasena = formGroup.get('confirmarContrasena')?.value;

    if (contrasenaNueva !== confirmarContrasena) {
      formGroup.get('confirmarContrasena')?.setErrors({ noCoinciden: true });
      return { noCoinciden: true };
    } else {
      formGroup.get('confirmarContrasena')?.setErrors(null);
      return null;
    }
  }

  ngOnChanges(changes) {
    this.paso = 1;
    if (this.formCredencial) {
      this.formCredencial.reset();
    }

    if (changes.showModal?.currentValue) {
      this.showModal = changes.showModal.currentValue;
    }
  }

  enviarCodigoRecuperacion(mostrarMensaje: boolean) {
    this.isLoading = true;
    this.reenviandoCodigo = true;
    this.recoverService
      .enviarCodigoRecuperacion(this.formCredencial.get('cCredUsuario').value)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.reenviandoCodigo = false;
        })
      )
      .subscribe({
        next: (response: any) => {
          this.correoMasked = response.data.correo;
          this.paso = 2;
          if (mostrarMensaje) {
            this.messageService.add({
              severity: 'success',
              summary: 'Código enviado',
              detail: response.message,
            });
          }
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Problema al enviar código',
            detail: error.error.message || 'Problema al enviar código',
          });
        },
      });
  }

  validarCodigoRecuperacion() {
    this.isLoading = true;
    this.recoverService
      .validarCodigoRecuperacion(
        this.formCredencial.get('cCredUsuario').value,
        this.formCredencial.get('cCodigoRecuperacion').value
      )
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response: any) => {
          this.paso = 3;
          this.formCredencial.get('cResetToken').setValue(response.data.token);
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Problema al validar código',
            detail: error.error.message || 'Problema al enviar código',
          });
        },
      });
  }

  cambiarPassword() {
    this.isLoading = true;
    this.recoverService
      .cambiarPassword(this.formCredencial.value)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.paso = 4;
          //this.formCredencial.get('cResetToken').setValue(response.token);
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Problema al validar código',
            detail: error.error.message || 'Problema al enviar código',
          });
        },
      });
  }

  accionBtn(elemento): void {
    const { accion } = elemento;
    const { item } = elemento;

    switch (accion) {
      case 'close-modal':
        this.accionBtnItem.emit({ accion, item });
        break;
    }
  }
}
