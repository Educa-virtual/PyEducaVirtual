import { Component, OnInit, Input, Output, EventEmitter, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from '@/app/primeng.module';
import { MantenimientoIeService, InstitucionEducativa } from '../mantenimiento-ie.service';
import { MessageService } from 'primeng/api';
import { GeneralService } from '@/app/servicios/general.service';

@Component({
  selector: 'app-agregar-mantenimiento-ie',
  standalone: true,
  imports: [PrimengModule, ReactiveFormsModule],
  templateUrl: './agregar-mantenimiento-ie.component.html',
  styleUrl: './agregar-mantenimiento-ie.component.scss',
})
export class AgregarMantenimientoIeComponent implements OnInit {
  @Input() selectedItem: any = null;
  @Output() eventAgregarMantenimientoIe = new EventEmitter<boolean>();
  private generalService = inject(GeneralService);
  formulario!: FormGroup;
  guardando: boolean = false;
  distritos = [];
  distritoSeleccionado: any;
  zonaSeleccionado: any;
  sectorSeleccionado: any;
  nivelSeleccionado: any;
  ugelSeleccionado: any;

  zonas = [];
  Niveles = [];
  ugeles = [];
  sectores = [];
  constructor(
    private fb: FormBuilder,
    private mantenimientoIeService: MantenimientoIeService,
    private messageService: MessageService
  ) {
    this.crearFormulario();
  }

  ngOnInit() {
    console.log('AgregarMantenim`ientoIeComponent2222');
    this.cargarDistritos();
    this.cargarZonas();
    this.cargarSectores();
    this.cargarNiveles();
    this.cargarUgeles();
    console.log('pas0');
  }

  cargarUgeles() {
    const data = {
      petition: 'post',
      group: 'acad',
      prefix: 'mantenimiento-ie',
      ruta: 'getData',
      data: {
        esquema: 'acad',
        tabla: 'ugeles',
        campos: '*',
        where: '',
      },
    };

    this.generalService.getGralPrefix(data).subscribe({
      next: response => {
        this.ugeles = response.data;
      },
      complete: () => {},
      error: error => {
        console.log(error);
      },
    });
  }

  cargarNiveles() {
    const data = {
      petition: 'post',
      group: 'acad',
      prefix: 'mantenimiento-ie',
      ruta: 'getData',
      data: {
        esquema: 'acad',
        tabla: 'nivel_tipos',
        campos: '*',
        where: '',
      },
    };

    this.generalService.getGralPrefix(data).subscribe({
      next: response => {
        this.Niveles = response.data;
      },
      complete: () => {},
      error: error => {
        console.log(error);
      },
    });
  }

  cargarDistritos() {
    const data = {
      petition: 'post',
      group: 'acad',
      prefix: 'mantenimiento-ie',
      ruta: 'getData',
      data: {
        esquema: 'grl',
        tabla: 'distritos',
        campos: '*',
        where: 'iPrvnId in (147,148,149)',
      },
    };

    this.generalService.getGralPrefix(data).subscribe({
      next: response => {
        this.distritos = response.data;
      },
      complete: () => {},
      error: error => {
        console.log(error);
      },
    });
  }

  cargarZonas() {
    const data = {
      petition: 'post',
      group: 'acad',
      prefix: 'mantenimiento-ie',
      ruta: 'getData',
      data: {
        esquema: 'acad',
        tabla: 'zonas',
        campos: '*',
        where: '',
      },
    };
    this.generalService.getGralPrefix(data).subscribe({
      next: response => {
        this.zonas = response.data;
      },
      complete: () => {},
      error: error => {
        console.log(error);
      },
    });
  }

  cargarSectores() {
    const data = {
      petition: 'post',
      group: 'acad',
      prefix: 'mantenimiento-ie',
      ruta: 'getData',
      data: {
        esquema: 'grl',
        tabla: 'tipos_sectores',
        campos: '*',
        where: '',
      },
    };
    this.generalService.getGralPrefix(data).subscribe({
      next: response => {
        this.sectores = response.data;
      },
      complete: () => {},
      error: error => {
        console.log(error);
      },
    });
  }

  crearFormulario() {
    this.formulario = this.fb.group({
      cIieeCodigoModular: [
        '',
        [Validators.required, Validators.minLength(7), Validators.maxLength(8)],
      ],
      cIieeNombre: ['', [Validators.required, Validators.maxLength(200)]],
      iDsttId: [null, Validators.required],
      iZonaId: [null],
      iTipoSectorId: [null, Validators.required],
      cIieeRUC: ['', [Validators.minLength(11), Validators.maxLength(11)]],
      cIieeDireccion: [''],
      iNivelTipoId: [null],
      iUgelId: [null],
      iSedeId: [null],
      iSesionId: [1],
    });
  }

  btnCancelar() {
    this.formulario.reset();
    this.eventAgregarMantenimientoIe.emit(false);
  }

  btnGuardar() {
    if (this.formulario.valid) {
      this.guardarInstitucion();
    } else {
      this.mostrarErroresValidacion();
    }
  }

  guardarInstitucion() {
    this.guardando = true;

    const datosInstitucion: InstitucionEducativa = this.formulario.value;

    console.log('Datos a enviar:', datosInstitucion);

    this.mantenimientoIeService.crearInstitucionEducativa(datosInstitucion).subscribe({
      next: response => {
        this.guardando = false;

        if (response.validated) {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Institución educativa creada correctamente',
          });

          this.formulario.reset();
          this.eventAgregarMantenimientoIe.emit(false);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.mensaje || 'Error al crear la institución',
          });
        }
      },
      error: error => {
        this.guardando = false;
        console.error('Error al crear institución:', error);

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al crear la institución educativa',
        });
      },
    });
  }

  mostrarErroresValidacion() {
    Object.keys(this.formulario.controls).forEach(key => {
      const control = this.formulario.get(key);
      if (control && control.invalid) {
        control.markAsTouched();
      }
    });

    this.messageService.add({
      severity: 'warn',
      summary: 'Formulario incompleto',
      detail: 'Por favor complete los campos requeridos',
    });
  }

  convertirMayusculas(event: any) {
    const input = event.target;
    const valor = input.value.toUpperCase();
    input.value = valor;

    const controlName = input.getAttribute('formControlName') || input.getAttribute('id');
    if (controlName && this.formulario.get(controlName)) {
      this.formulario.get(controlName)?.setValue(valor);
    }
  }

  soloNumeros(event: any) {
    const input = event.target;
    const valor = input.value.replace(/[^0-9]/g, '');
    input.value = valor;

    const controlName = input.getAttribute('formControlName') || input.getAttribute('id');
    if (controlName && this.formulario.get(controlName)) {
      this.formulario.get(controlName)?.setValue(valor);
    }
  }

  esInvalido(campo: string): boolean {
    const control = this.formulario.get(campo);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  obtenerMensajeError(campo: string): string {
    const control = this.formulario.get(campo);

    if (control?.errors) {
      if (control.errors['required']) return `${campo} es requerido`;
      if (control.errors['minlength'])
        return `${campo} debe tener al menos ${control.errors['minlength'].requiredLength} caracteres`;
      if (control.errors['maxlength'])
        return `${campo} debe tener máximo ${control.errors['maxlength'].requiredLength} caracteres`;
    }

    return '';
  }
}
