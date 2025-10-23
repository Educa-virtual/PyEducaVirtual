import { GeneralService } from '@/app/servicios/general.service';
import { ValidacionFormulariosService } from '@/app/servicios/validacion-formularios.service';
import { MostrarErrorComponent } from '@/app/shared/components/mostrar-error/mostrar-error.component';
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component';
import {
  Component,
  inject,
  input,
  output,
  signal,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MantenimientoIeService, Sede } from '../mantenimiento-ie.service';
import { PrimengModule } from '@/app/primeng.module';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { ConstantesService } from '@/app/servicios/constantes.service';

@Component({
  selector: 'app-form-sedes',
  standalone: true,
  imports: [ModalPrimengComponent, PrimengModule, ReactiveFormsModule],
  templateUrl: './form-sedes.component.html',
  styleUrl: './form-sedes.component.scss',
})
export class FormSedesComponent extends MostrarErrorComponent implements OnInit, OnChanges {
  showModal = input<boolean>(false);
  iIieeId = input<string | number>(null);
  data = input(null);

  closeModal = output<void>();
  recargarLista = output<void>();

  isLoading = signal<boolean>(false);
  serviciosEducativos = signal<any[]>([]);
  private _GeneralService = inject(GeneralService);
  private _ValidacionFormulariosService = inject(ValidacionFormulariosService);
  private _MantenimientoIeService = inject(MantenimientoIeService);
  private _FormBuilder = inject(FormBuilder);
  private _LocalStoreService = inject(LocalStoreService);
  private _ConstantesService = inject(ConstantesService);

  formSedes: FormGroup = this._FormBuilder.group({
    cSedeNombre: ['', [Validators.required, Validators.maxLength(200)]],
    cSedeDireccion: [null, Validators.required],
    iIieeId: [null, Validators.required],
    iServEdId: [null, Validators.required],
    iSesionId: [1],

    iSedeId: [],
    iCredEntPerfId: [],

    cSedeTelefono: [null, Validators.required],
    iEstado: [null, Validators.required],
  });
  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      const data = changes['data'].currentValue;
      data.iEstado = Number(data.iEstado);
      if (data?.iSedeId) {
        this.formSedes.patchValue(data);

        this.formSedes.get('iIieeId')?.clearValidators();
        this.formSedes.get('iIieeId')?.updateValueAndValidity();
      } else {
        this.formSedes.reset();

        this.formSedes.get('iIieeId')?.setValidators(Validators.required);
        this.formSedes.get('iIieeId')?.updateValueAndValidity();
      }
    }
  }
  ngOnInit() {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales() {
    forkJoin({
      serviciosEducativos: this._GeneralService
        .getServicioEducativos()
        .pipe(catchError(() => of({ data: [] }))),
    }).subscribe({
      next: (response: any) => {
        this.serviciosEducativos.set(response.serviciosEducativos.data);
      },
    });
  }
  enviarFormulario() {
    if (this.isLoading()) return;
    this.isLoading.set(true);

    const perfil = this._LocalStoreService.getItem('dremoPerfil');

    this.formSedes.patchValue({
      iIieeId: this.iIieeId(),
      iCredEntPerfId: perfil?.iCredEntPerfId,
      iCredId: this._ConstantesService.iCredId,
    });

    const nombresCampos: Record<string, string> = {
      iCredEntPerfId: 'Credencial Entidad',
      cSedeNombre: 'Nombre de la sede',
      iServEdId: 'Servicio Educativo',
      cSedeTelefono: 'Teléfono',
      cSedeDireccion: 'Dirección',
      iIieeId: 'Institución Educativa',
      iCredId: 'Credencial',
    };

    const { valid, message } = this._ValidacionFormulariosService.validarFormulario(
      this.formSedes,
      nombresCampos
    );

    if (!valid && message) {
      this.mostrarMensajeToast(message);
      this.isLoading.set(false);
      return;
    }

    this.guardarSede();
  }

  guardarSede() {
    const datosSedes: Sede = this.formSedes.value;
    datosSedes.iEstado = this.formSedes.value.iEstado ? 1 : 0;
    this._MantenimientoIeService
      .crearSede(datosSedes)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: response => {
          if (response.validated) {
            this.mostrarMensajeToast({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Institución educativa creada correctamente',
            });
            this.formSedes.reset();
            this.closeModal.emit();
            this.recargarLista.emit();
          } else {
            this.mostrarMensajeToast({
              severity: 'error',
              summary: 'Error',
              detail: response.mensaje || 'Error al crear la sede',
            });
          }
        },
        error: error => {
          this.mostrarErrores(error);
        },
      });
  }
}
