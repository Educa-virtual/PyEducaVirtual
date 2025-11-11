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

  turnos: any = [];

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

  formSedes: FormGroup;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      const data = changes['data'].currentValue;
      if (!data) return;

      console.log('🔹 Valor recibido de iIieeId:', this.iIieeId());

      data.iEstado = Number(data.iEstado ?? 0);

      if (!this.formSedes) return;

      if (data.iSedeId) {
        this.formSedes.patchValue(data);
        //this.formSedes.get('iIieeId')?.clearValidators();
        this.formSedes.get('iIieeId')?.setValue(this.iIieeId());
      } else {
        this.formSedes.reset();
        this.formSedes.get('iIieeId')?.setValidators(Validators.required);
      }
      this.formSedes.get('iIieeId')?.updateValueAndValidity();
    }
  }

  ngOnInit() {
    this.initForm();
    this.cargarDatosIniciales();
    this.getTurnos();
  }

  initForm() {
    this.formSedes = this._FormBuilder.group({
      iCredEntPerfId: [],
      iCredId: [1], //iCredId: [],
      iSedeId: [null],
      iIieeId: [this.iIieeId(), Validators.required],
      cSedeNombre: ['', [Validators.required, Validators.maxLength(200)]],
      cSedeDireccion: [null, Validators.required],
      cSedeRslCreacion: [null],
      dSedeRslCreacion: [null],
      iEstado: [0],
      iServEdId: [null, Validators.required],
      cSedeTelefono: [null],
      iTurnoId: [0, Validators.required],
      cSedeEmail: [null, [Validators.required, Validators.email]],
      cSedeDirector: [null],
    });
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

  getTurnos() {
    this._GeneralService.getTurno().subscribe({
      next: (response: any) => {
        this.turnos = response.data;
      },
    });
  }
  enviarFormulario() {
    //if (this.isLoading()) return;

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
    console.log(this.formSedes.value);

    // return;

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
