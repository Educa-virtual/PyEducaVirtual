import {
  Component,
  OnInit,
  SimpleChanges,
  OnChanges,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from '@/app/primeng.module';
import { MantenimientoIeService } from '../mantenimiento-ie.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { MessageService } from 'primeng/api';
import { ReactiveFormService } from '@/app/servicios/reactive-form.service';

@Component({
  selector: 'app-agregar-mantenimiento-ie',
  standalone: true,
  imports: [PrimengModule, ReactiveFormsModule],
  templateUrl: './agregar-mantenimiento-ie.component.html',
  styleUrl: './agregar-mantenimiento-ie.component.scss',
})
export class AgregarMantenimientoIeComponent implements OnInit, OnChanges {
  @Input() showModal: boolean = false;
  @Input() ie: any = null;
  @Output() closeModal = new EventEmitter();
  @Output() recargarLista = new EventEmitter();

  perfil: any;
  formInstitucion: FormGroup;

  niveles_tipos: any[] = [];
  distritos: any[] = [];
  zonas: any[] = [];
  ugeles: any[] = [];
  sectores: any[] = [];
  estados = [
    { value: 1, label: 'HABILITADO' },
    { value: 0, label: 'DESHABILITADO' },
  ];

  constructor(
    private formService: ReactiveFormService,
    private ieService: MantenimientoIeService,
    private fb: FormBuilder,
    private store: LocalStoreService,
    private messageService: MessageService
  ) {
    this.perfil = this.store.getItem('dremoPerfil');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ie'] && this.formInstitucion) {
      const ie = changes['ie']?.currentValue;
      if (ie?.iIieeId) {
        this.setFormInstitucion(ie);
      } else {
        this.setFormInstitucion(null);
      }
    }
  }

  ngOnInit() {
    this.formInstitucion = this.fb.group({
      iIieeId: [null],
      iNivelTipoId: [null, Validators.required],
      cIieeCodigoModular: [
        '',
        [Validators.required, Validators.minLength(7), Validators.maxLength(8)],
      ],
      cIieeNombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      iDsttId: [null, Validators.required],
      iZonaId: [null],
      iTipoSectorId: [null, Validators.required],
      cIieeRUC: ['', [Validators.minLength(11), Validators.maxLength(11)]],
      cIieeDireccion: ['', [Validators.minLength(2), Validators.required]],
      iUgelId: [null, Validators.required],
      iSedeId: [null],
      cIieeEmail: [null, [Validators.email]],
      cIieeTelefono: [null, Validators.pattern(/^[0-9]+$/)],
      cIieeRslCreacion: [null],
      dtIieeRslCreacion: [null],
      iEstado: [null, Validators.required],
      cIieeDirector: [null],
      cIieeNlat: [null],
      cIieeNlog: [null],
    });
    this.ieService.crearInstitucionEducativa({}).subscribe((data: any) => {
      this.zonas = this.ieService.getZonas(data?.zonas);
      this.sectores = this.ieService.getTiposSectores(data?.tipos_sectores);
      this.ugeles = this.ieService.getUgeles(data?.ugeles);
      this.distritos = this.ieService.getDistritos(data?.distritos);
      this.niveles_tipos = this.ieService.getNivelTipos(data?.nivel_tipos);
    });
  }

  setFormInstitucion(ie: any) {
    this.formInstitucion.reset({
      iEstado: 1,
    });
    this.formService.validarFormulario(this.formInstitucion);
    if (!ie) {
      return;
    }
    this.formInstitucion.patchValue(ie);
    this.formService.formatearFormControl(
      this.formInstitucion,
      'iNivelTipoId',
      ie.iNivelTipoId,
      'number'
    );
    this.formService.formatearFormControl(this.formInstitucion, 'iUgelId', ie.iUgelId, 'number');
    this.formService.formatearFormControl(this.formInstitucion, 'iDsttId', ie.iDsttId, 'number');
    this.formService.formatearFormControl(this.formInstitucion, 'iZonaId', ie.iZonaId, 'number');
    this.formService.formatearFormControl(
      this.formInstitucion,
      'iTipoSectorId',
      ie.iTipoSectorId,
      'number'
    );
    this.formService.formatearFormControl(this.formInstitucion, 'iEstado', ie.iEstado, 'number');
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

  cerrarModal() {
    this.closeModal.emit();
    this.formInstitucion.reset();
    this.formInstitucion.controls['iEstado'].setValue(1);
  }

  modalCerrado(visible: boolean) {
    if (!visible) {
      this.cerrarModal();
    }
  }

  guardarInstitucion() {
    if (this.formInstitucion.invalid) {
      this.messageService.add({
        severity: 'warning',
        summary: 'Adveretencia',
        detail: 'Complete los campos requeridos',
      });
      this.formService.validarFormulario(this.formInstitucion);
    }
    this.ieService.guardarInstitucionEducativa(this.formInstitucion.value).subscribe({
      next: () => {
        this.cerrarModal();
        this.recargarLista.emit(true);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Se realizó la operación correctamente',
        });
      },
      error: error => {
        console.error(error, 'Error al guardar la institución');
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || 'Ocurrió un error',
        });
      },
    });
  }

  actualizarInstitucion() {
    if (this.formInstitucion.invalid) {
      this.messageService.add({
        severity: 'warning',
        summary: 'Adveretencia',
        detail: 'Complete los campos requeridos',
      });
      this.formService.validarFormulario(this.formInstitucion);
    }
    this.ieService.actualizarInstitucionEducativa(this.formInstitucion.value).subscribe({
      next: () => {
        this.cerrarModal();
        this.recargarLista.emit(true);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Se realizó la operación correctamente',
        });
      },
      error: error => {
        console.error(error, 'Error al guardar la institución');
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || 'Ocurrió un error',
        });
      },
    });
  }
}
