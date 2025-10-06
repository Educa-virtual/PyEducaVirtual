import { PrimengModule } from '@/app/primeng.module';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { CarpetasService } from '@/app/servicios/repo/carpetas.service';
import { ValidacionFormulariosService } from '@/app/servicios/validacion-formularios.service';
import { MostrarErrorComponent } from '@/app/shared/components/mostrar-error/mostrar-error.component';
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component';
import { Component, inject, signal, input, output, effect } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

interface CarpetaForm {
  iCarpetaId: string;
  cNombre: string;
  iPersId: number;
  iParentCarpetaId: number | null;
  iCredId: number;
  iId: string;
}

@Component({
  selector: 'app-form-carpeta',
  standalone: true,
  imports: [ModalPrimengComponent, PrimengModule],
  templateUrl: './form-carpeta.component.html',
  styleUrl: './form-carpeta.component.scss',
})
export class FormCarpetaComponent extends MostrarErrorComponent {
  showModal = input<boolean>(false);
  action = input<'actualizar' | 'guardar'>('guardar');
  data = input<Partial<CarpetaForm> | null>(null);

  closeModal = output<void>();
  recargarLista = output<void>();

  iCarpetaPadreId = input<number | null>(null);

  private _FormBuilder = inject(FormBuilder);
  private _ValidacionFormulariosService = inject(ValidacionFormulariosService);
  private _ConstantesService = inject(ConstantesService);
  private _CarpetasService = inject(CarpetasService);

  formCarpetas = this._FormBuilder.nonNullable.group({
    iCarpetaId: [null],
    cNombre: ['', Validators.required],
    iPersId: [0, Validators.required],
    iParentCarpetaId: [null],
    iCredId: [0, Validators.required],
  });

  isLoading = signal(false);

  constructor() {
    super();

    effect(() => {
      const d = this.data();
      if (d) {
        this.formCarpetas.patchValue(d);
        this.formCarpetas.controls.iCarpetaId.setValue(d.iId ?? null);
      } else {
        this.formCarpetas.reset();
      }
    });
  }

  enviarFormulario() {
    if (this.isLoading()) return;
    this.isLoading.set(true);
    this.formCarpetas.patchValue({
      iPersId: this._ConstantesService.iPersId,
      iCredId: this._ConstantesService.iCredId,
      iParentCarpetaId: this.iCarpetaPadreId() ?? null,
    });

    const nombresCampos: Record<string, string> = {
      cNombre: 'Nombre de la carpeta',
      iPersId: 'Identificador de la persona',
      iCredId: 'Credencial',
    };

    const { valid, message } = this._ValidacionFormulariosService.validarFormulario(
      this.formCarpetas,
      nombresCampos
    );

    if (!valid && message) {
      this.mostrarMensajeToast(message);
      this.isLoading.set(false);
      return;
    }

    if (this.formCarpetas.value.iCarpetaId) {
      this.actualizarCarpeta();
    } else {
      this.guardarCarpeta();
    }
  }

  guardarCarpeta() {
    this._CarpetasService
      .guardarCarpeta(this.formCarpetas.value)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (resp: any) => {
          if (resp.validated) {
            this.mostrarMensajeToast({
              severity: 'success',
              summary: '¡Genial!',
              detail: resp.message,
            });
            this.formCarpetas.reset();
            this.recargarLista.emit();
            this.closeModal.emit();
          } else {
            this.mostrarMensajeToast({
              severity: 'error',
              summary: 'Atención!',
              detail: resp.message,
            });
          }
        },
        error: error => {
          this.mostrarErrores(error);
        },
      });
  }
  actualizarCarpeta() {
    this._CarpetasService
      .actualizarCarpeta(this.formCarpetas.value)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (resp: any) => {
          if (resp.validated) {
            this.mostrarMensajeToast({
              severity: 'success',
              summary: 'Actualizado',
              detail: resp.message,
            });
            this.recargarLista.emit();
            this.closeModal.emit();
          } else {
            this.mostrarMensajeToast({
              severity: 'error',
              summary: 'Atención!',
              detail: resp.message,
            });
          }
        },
        error: error => this.mostrarErrores(error),
      });
  }
}
