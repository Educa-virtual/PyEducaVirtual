import { PrimengModule } from '@/app/primeng.module';
import { TipoPublicosService } from '@/app/servicios/cap/tipo-publicos.service';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { ValidacionFormulariosService } from '@/app/servicios/validacion-formularios.service';
import { MostrarErrorComponent } from '@/app/shared/components/mostrar-error/mostrar-error.component';
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component';
import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-form-tipo-publico',
  standalone: true,
  imports: [ModalPrimengComponent, PrimengModule],
  templateUrl: './form-tipo-publico.component.html',
  styleUrl: './form-tipo-publico.component.scss',
})
export class FormTipoPublicoComponent extends MostrarErrorComponent {
  showModal = input<boolean>(false);
  data = input(null);
  closeModal = output<void>();
  recargarLista = output<void>();

  private _FormBuilder = inject(FormBuilder);
  private _ConstantesService = inject(ConstantesService);
  private _ValidacionFormulariosService = inject(ValidacionFormulariosService);
  private _TipoPublicosService = inject(TipoPublicosService);

  isLoading = signal<boolean>(false);

  formTipoPublicos = this._FormBuilder.nonNullable.group({
    iTipoPubId: [null],
    cTipoPubNombre: ['', Validators.required],
    iCredId: [0, Validators.required],
  });

  constructor() {
    super();

    effect(() => {
      const d = this.data();
      if (d) {
        this.formTipoPublicos.patchValue(d);
        this.formTipoPublicos.controls.iTipoPubId.setValue(d.iTipoPubId ?? null);
      } else {
        this.formTipoPublicos.reset();
      }
    });
  }

  enviarFormulario() {
    if (this.isLoading()) return;
    this.isLoading.set(true);
    this.formTipoPublicos.patchValue({
      iCredId: this._ConstantesService.iCredId,
    });

    const nombresCampos: Record<string, string> = {
      cTipoPubNombre: 'Nombre',
      iCredId: 'Credencial',
    };

    const { valid, message } = this._ValidacionFormulariosService.validarFormulario(
      this.formTipoPublicos,
      nombresCampos
    );

    if (!valid && message) {
      this.mostrarMensajeToast(message);
      this.isLoading.set(false);
      return;
    }

    if (this.formTipoPublicos.value.iTipoPubId) {
      this.actualizarTipoPublicos();
    } else {
      this.guardarTipoPublicos();
    }
  }

  guardarTipoPublicos() {
    this._TipoPublicosService
      .guardarTipoPublico(this.formTipoPublicos.value)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (resp: any) => {
          if (resp.validated) {
            this.mostrarMensajeToast({
              severity: 'success',
              summary: '¡Genial!',
              detail: resp.message,
            });
            this.formTipoPublicos.reset();
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
  actualizarTipoPublicos() {
    this._TipoPublicosService
      .actualizarTipoPublico(this.formTipoPublicos.value)
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
