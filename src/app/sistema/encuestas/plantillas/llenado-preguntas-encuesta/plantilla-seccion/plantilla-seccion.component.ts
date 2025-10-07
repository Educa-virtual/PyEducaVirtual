import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MessageService } from 'primeng/api';
import { EncuestasService } from '../../../services/encuestas.services';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-plantilla-seccion',
  standalone: true,
  imports: [PrimengModule, TextFieldModule],
  templateUrl: './plantilla-seccion.component.html',
  styleUrl: './plantilla-seccion.component.scss',
})
export class PlantillaSeccionComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Input() iPlanSeccionId: number;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() seccionModificada = new EventEmitter<boolean>();

  iPlanId: number;
  tipos_preguntas: Array<object> = [];
  formSeccion: FormGroup;
  seccion_registrada: boolean = false;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private encuestasService: EncuestasService,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe((params: any) => {
      this.iPlanId = params.params.iPlanId || null;
    });
  }

  ngOnInit(): void {
    try {
      this.formSeccion = this.fb.group({
        iPlanId: this.iPlanId,
        iPlanSeccionId: [null],
        cPlanSeccionTitulo: ['', [Validators.required, Validators.maxLength(100)]],
        cPlanSeccionDescripcion: [''],
        iPlanSeccionOrden: [null],
      });
    } catch (error) {
      console.error('Error al inicializar el formulario', error);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.iPlanSeccionId && changes['visible']?.currentValue === true) {
      this.verPlantillaSeccion();
    } else {
      this.clearForm();
    }
  }

  verPlantillaSeccion() {
    this.encuestasService
      .verPlantillaSeccion({
        iPlanSeccionId: this.iPlanSeccionId,
      })
      .subscribe({
        next: (data: any) => {
          this.setFormSeccion(data.data);
        },
        error: error => {
          console.error('Error obteniendo sección:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  setFormSeccion(seccion: any) {
    this.formSeccion.patchValue(seccion);
    this.formSeccion.get('iPlanId').patchValue(this.iPlanId);
    this.seccion_registrada = true;
    this.formSeccion.markAsDirty();
  }

  clearForm() {
    this.iPlanSeccionId = null;
    this.seccion_registrada = false;
    if (this.formSeccion) {
      this.formSeccion.reset();
      this.formSeccion.get('iPlanId').patchValue(this.iPlanId);
    }
  }

  guardar() {
    if (this.formSeccion.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Complete los campos obligatorios',
      });
      this.encuestasService.formMarkAsDirty(this.formSeccion);
      return;
    }
    this.encuestasService.guardarPlantillaSeccion(this.formSeccion.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: 'Se registraron los datos',
        });
        this.seccionModificada.emit(true);
        this.salir();
      },
      error: error => {
        console.error('Error guardando sección:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  actualizar() {
    if (this.formSeccion.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Complete los campos obligatorios',
      });
      this.encuestasService.formMarkAsDirty(this.formSeccion);
      return;
    }
    this.encuestasService.actualizarPlantillaSeccion(this.formSeccion.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Actualización exitosa',
          detail: 'Se actualizaron los datos',
        });
        this.seccionModificada.emit(true);
        this.salir();
      },
      error: error => {
        console.error('Error actualizando sección:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  onHide() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  salir() {
    this.onHide();
  }
}
