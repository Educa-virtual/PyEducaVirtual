import { PrimengModule } from '@/app/primeng.module';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { CarpetasService } from '@/app/servicios/repo/carpetas.service';
import { ValidacionFormulariosService } from '@/app/servicios/validacion-formularios.service';
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component';
import { Component, signal, input, output, effect } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';

interface CarpetaForm {
  iCarpetaId: string;
  cNombre: string;
  iPersId: number;
  iParentCarpetaId: number | null;
  iCredId: number;
  iRegistroId: number;
}

@Component({
  selector: 'app-form-carpeta',
  standalone: true,
  imports: [ModalPrimengComponent, PrimengModule],
  templateUrl: './form-carpeta.component.html',
  styleUrl: './form-carpeta.component.scss',
})
export class FormCarpetaComponent {
  showModal = input<boolean>(false);
  action = input<'actualizar' | 'guardar'>('guardar');
  data = input<Partial<CarpetaForm> | null>(null);

  closeModal = output<void>();
  recargarLista = output<void>();

  iCarpetaPadreId = input<number | null>(null);
  isLoading = signal(false);

  private perfil: any;

  constructor(
    private fb: FormBuilder,
    private validadorService: ValidacionFormulariosService,
    private messageService: MessageService,
    private carpetasService: CarpetasService,
    private store: LocalStoreService
  ) {
    this.perfil = this.store.getItem('dremoPerfil');
    effect(() => {
      const d = this.data();
      if (d) {
        this.formCarpetas.patchValue(d);
        this.formCarpetas.controls.iCarpetaId.setValue(d.iRegistroId ?? null);
      } else {
        this.formCarpetas.reset();
      }
    });
  }

  formCarpetas = this.fb.nonNullable.group({
    iCarpetaId: [null],
    cNombre: ['', Validators.required],
    iPersId: [0, Validators.required],
    iParentCarpetaId: [null],
  });

  enviarFormulario() {
    if (this.isLoading()) return;
    this.isLoading.set(true);
    this.formCarpetas.patchValue({
      iPersId: this.perfil.iPersId,
      iParentCarpetaId: this.iCarpetaPadreId() ?? null,
    });

    const nombresCampos: Record<string, string> = {
      cNombre: 'Nombre de la carpeta',
      iPersId: 'Identificador de la persona',
    };

    const { valid, message } = this.validadorService.validarFormulario(
      this.formCarpetas,
      nombresCampos
    );

    if (!valid && message) {
      this.messageService.add(message);
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
    this.carpetasService
      .guardarCarpeta(this.formCarpetas.value)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data: any) => {
          if (data.data) {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Carpeta creada con éxito',
            });
            this.formCarpetas.reset();
            this.recargarLista.emit();
            this.closeModal.emit();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: data.message,
            });
          }
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message || 'Error desconocido',
          });
        },
      });
  }
  actualizarCarpeta() {
    this.carpetasService
      .actualizarCarpeta(this.formCarpetas.value)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data: any) => {
          if (data.data) {
            this.messageService.add({
              severity: 'success',
              summary: 'Exito',
              detail: data.message,
            });
            this.recargarLista.emit();
            this.closeModal.emit();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: data.data.error,
            });
          }
        },
        error: error =>
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message || 'Error desconocido',
          }),
      });
  }
}
