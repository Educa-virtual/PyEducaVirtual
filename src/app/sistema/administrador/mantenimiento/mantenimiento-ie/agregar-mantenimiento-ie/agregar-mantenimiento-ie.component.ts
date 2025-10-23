import {
  Component,
  OnInit,
  inject,
  input,
  output,
  signal,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from '@/app/primeng.module';
import { MantenimientoIeService, InstitucionEducativa } from '../mantenimiento-ie.service';
import { GeneralService } from '@/app/servicios/general.service';
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { MostrarErrorComponent } from '@/app/shared/components/mostrar-error/mostrar-error.component';
import { ValidacionFormulariosService } from '@/app/servicios/validacion-formularios.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';

@Component({
  selector: 'app-agregar-mantenimiento-ie',
  standalone: true,
  imports: [PrimengModule, ReactiveFormsModule, ModalPrimengComponent],
  templateUrl: './agregar-mantenimiento-ie.component.html',
  styleUrl: './agregar-mantenimiento-ie.component.scss',
})
export class AgregarMantenimientoIeComponent
  extends MostrarErrorComponent
  implements OnInit, OnChanges
{
  showModal = input<boolean>(false);
  iNivelTipoId = input<string | number>(null);
  data = input(null);

  closeModal = output<void>();
  recargarLista = output<void>();

  isLoading = signal<boolean>(false);
  distritos = signal<any[]>([]);
  zonas = signal<any[]>([]);
  ugeles = signal<any[]>([]);
  sectores = signal<any[]>([]);

  private _GeneralService = inject(GeneralService);
  private _ValidacionFormulariosService = inject(ValidacionFormulariosService);
  private _MantenimientoIeService = inject(MantenimientoIeService);
  private _FormBuilder = inject(FormBuilder);
  private _LocalStoreService = inject(LocalStoreService);

  formInstitucion: FormGroup = this._FormBuilder.group({
    cIieeCodigoModular: [
      '',
      [Validators.required, Validators.minLength(7), Validators.maxLength(8)],
    ],
    cIieeNombre: ['', [Validators.required, Validators.maxLength(200)]],
    iDsttId: [null, Validators.required],
    iZonaId: [null],
    iTipoSectorId: [null, Validators.required],
    cIieeRUC: ['', [Validators.minLength(11), Validators.maxLength(11)]],
    cIieeDireccion: ['', Validators.required],
    iNivelTipoId: [null, Validators.required],
    iUgelId: [null, Validators.required],
    iSedeId: [null],
    iSesionId: [1],

    iIieeId: [],
    iCredEntPerfId: [],

    cIieeEmail: [null, [Validators.required, Validators.email]],
    cIieeTelefono: [null, Validators.required],
    iEstado: [null, Validators.required],
    cIieeDirector: [null, Validators.required],
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      const data = changes['data'].currentValue;
      if (data?.iIieeId) {
        data.iEstado = Number(data.iEstado);
        this.formInstitucion.patchValue(data);
      } else {
        this.formInstitucion.reset();
        this.formInstitucion.controls['iEstado'].setValue(1);
      }
    }
  }

  ngOnInit() {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales() {
    forkJoin({
      ugeles: this._GeneralService.getUgeles().pipe(catchError(() => of({ data: [] }))),
      distritos: this._GeneralService.getDistritos().pipe(catchError(() => of({ data: [] }))),
      zonas: this._GeneralService.getZonas().pipe(catchError(() => of({ data: [] }))),
      sectores: this._GeneralService.getTipoSector().pipe(catchError(() => of({ data: [] }))),
    }).subscribe({
      next: (response: any) => {
        this.ugeles.set(response.ugeles.data);
        this.distritos.set(response.distritos.data);
        this.zonas.set(response.zonas.data);
        this.sectores.set(response.sectores.data);
      },
    });
  }

  convertirMayusculas(event: any) {
    const input = event.target;
    const valor = input.value.toUpperCase();
    input.value = valor;

    const controlName = input.getAttribute('formControlName') || input.getAttribute('id');
    if (controlName && this.formInstitucion.get(controlName)) {
      this.formInstitucion.get(controlName)?.setValue(valor);
    }
  }

  soloNumeros(event: any) {
    const input = event.target;
    const valor = input.value.replace(/[^0-9]/g, '');
    input.value = valor;

    const controlName = input.getAttribute('formControlName') || input.getAttribute('id');
    if (controlName && this.formInstitucion.get(controlName)) {
      this.formInstitucion.get(controlName)?.setValue(valor);
    }
  }

  enviarFormulario() {
    if (this.isLoading()) return;
    this.isLoading.set(true);

    const perfil = this._LocalStoreService.getItem('dremoPerfil');

    this.formInstitucion.patchValue({
      iNivelTipoId: this.iNivelTipoId(),
      iCredEntPerfId: perfil?.iCredEntPerfId,
    });

    const nombresCampos: Record<string, string> = {
      iCredEntPerfId: 'Credencial Entidad',
      cIieeCodigoModular: 'Código Modular',
      cIieeNombre: 'Nombre de la I.E.',
      cIieeDirector: 'Nombre del(a) Director(a)',
      cIieeEmail: 'Correo electrónico',
      cIieeTelefono: 'Teléfono',
      iDsttId: 'Distrito',
      iTipoSectorId: 'Tipo Sector',
      cIieeRUC: 'RUC',
      cIieeDireccion: 'Dirección',
      iNivelTipoId: 'Nivel tipo',
      iUgelId: 'Ugel',
    };

    const { valid, message } = this._ValidacionFormulariosService.validarFormulario(
      this.formInstitucion,
      nombresCampos
    );

    if (!valid && message) {
      this.mostrarMensajeToast(message);
      this.isLoading.set(false);
      return;
    }

    this.guardarInstitucion();
  }

  guardarInstitucion() {
    const datosInstitucion: InstitucionEducativa = this.formInstitucion.value;
    datosInstitucion.iEstado = this.formInstitucion.value.iEstado ? 1 : 2;
    this._MantenimientoIeService
      .crearInstitucionEducativa(datosInstitucion)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: response => {
          if (response.validated) {
            this.mostrarMensajeToast({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Institución educativa creada correctamente',
            });
            this.formInstitucion.reset();
            this.closeModal.emit();
            this.recargarLista.emit();
          } else {
            this.mostrarMensajeToast({
              severity: 'error',
              summary: 'Error',
              detail: response.mensaje || 'Error al crear la institución',
            });
          }
        },
        error: error => {
          this.mostrarErrores(error);
        },
      });
  }
}
