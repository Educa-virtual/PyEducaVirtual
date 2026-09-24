import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MantenimientoIeService } from '../mantenimiento-ie.service';
import { PrimengModule } from '@/app/primeng.module';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { ReactiveFormService } from '@/app/servicios/reactive-form.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form-sedes',
  standalone: true,
  imports: [PrimengModule, ReactiveFormsModule],
  templateUrl: './form-sedes.component.html',
  styleUrl: './form-sedes.component.scss',
})
export class FormSedesComponent implements OnInit, OnChanges {
  @Input() showModal: boolean = false;
  @Input() sede: any = null;
  @Input() iNivelTipoId: number = null;
  @Output() closeModal = new EventEmitter();
  @Output() recargarLista = new EventEmitter();

  perfil: any;
  formSede: FormGroup;
  iIieeId: number;

  turnos: any = [];
  servicios_educativos: any[] = [];
  servicios_educativos_filtrados: any[] = [];
  estados = [
    { value: 1, label: 'HABILITADO' },
    { value: 0, label: 'DESHABILITADO' },
  ];

  constructor(
    private formService: ReactiveFormService,
    private ieService: MantenimientoIeService,
    private fb: FormBuilder,
    private store: LocalStoreService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.perfil = this.store.getItem('dremoPerfil');
    this.route.parent?.paramMap.subscribe(params => {
      this.iIieeId = Number(params.get('id'));
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['iNivelTipoId'] && this.servicios_educativos.length) {
      this.filtrarServiciosEducativos();
    }
    if (changes['sede'] && this.formSede) {
      const sede = changes['sede']?.currentValue;
      if (sede?.iSedeId) {
        this.setFormSede(sede);
      } else {
        this.setFormSede(null);
      }
    }
  }

  ngOnInit() {
    this.formSede = this.fb.group({
      iIieeId: [this.iIieeId],
      iSedeId: [null],
      iServEdId: [null],
      iTurnoId: [null],
      cSedeNombre: ['', [Validators.required, Validators.maxLength(200)]],
      cSedeEmail: [null],
      cSedeDireccion: [null],
      cSedeRslCreacion: [null],
      dSedeRslCreacion: [null],
      iEstado: [1],
      cSedeTelefono: [null],
      cSedeDirector: [null],
      cEscNlat: [null],
      cEscNlog: [null],
    });
    this.cargarListasFormulario();
  }

  cargarListasFormulario() {
    this.ieService.crearInstitucionEducativa({}).subscribe((data: any) => {
      this.servicios_educativos =
        this.ieService.getServiciosEducativos(data?.servicios_educativos) || [];
      this.filtrarServiciosEducativos();
      this.turnos = this.ieService.getTurnos(data?.turnos) || [];
    });
  }

  filtrarServiciosEducativos() {
    this.servicios_educativos_filtrados = this.servicios_educativos.filter(servicio => {
      return Number(servicio.iNivelTipoId) === Number(this.iNivelTipoId);
    });
  }

  setFormSede(sede: any) {
    this.formSede.reset({
      iEstado: 1,
    });
    this.formService.validarFormulario(this.formSede);
    if (!sede) {
      return;
    }
    this.formSede.patchValue(sede);
    this.formService.formatearFormControl(this.formSede, 'iTurnoId', sede.iTurnoId, 'number');
    this.formService.formatearFormControl(this.formSede, 'iServEdId', sede.iServEdId, 'number');
    this.formService.formatearFormControl(this.formSede, 'iEstado', sede.iEstado, 'number');
  }

  soloNumeros(event: any) {
    const input = event.target;
    const valor = input.value.replace(/[^0-9]/g, '');
    input.value = valor;

    const controlName = input.getAttribute('formControlName') || input.getAttribute('id');
    if (controlName && this.formSede.get(controlName)) {
      this.formSede.get(controlName)?.setValue(valor);
    }
  }

  convertirMayusculas(event: any) {
    const input = event.target;
    const valor = input.value.toUpperCase();
    input.value = valor;

    const controlName = input.getAttribute('formControlName') || input.getAttribute('id');
    if (controlName && this.formSede.get(controlName)) {
      this.formSede.get(controlName)?.setValue(valor);
    }
  }

  cerrarModal() {
    this.closeModal.emit();
    this.formSede.reset();
    this.formSede.controls['iEstado'].setValue(1);
  }

  modalCerrado(visible: boolean) {
    if (!visible) {
      this.cerrarModal();
    }
  }

  guardarSede() {
    if (this.formSede.invalid) {
      this.messageService.add({
        severity: 'warning',
        summary: 'Adveretencia',
        detail: 'Complete los campos requeridos',
      });
      this.formService.validarFormulario(this.formSede);
    }
    this.ieService.guardarSede(this.formSede.value).subscribe({
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
        console.error(error, 'Error al guardar la sede');
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || 'Ocurrió un error',
        });
      },
    });
  }

  actualizarSede() {
    if (this.formSede.invalid) {
      this.messageService.add({
        severity: 'warning',
        summary: 'Adveretencia',
        detail: 'Complete los campos requeridos',
      });
      this.formService.validarFormulario(this.formSede);
    }
    this.ieService.actualizarSede(this.formSede.value).subscribe({
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
        console.error(error, 'Error al guardar la sede');
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || 'Ocurrió un error',
        });
      },
    });
  }
}
