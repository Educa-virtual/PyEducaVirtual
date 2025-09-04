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
import { EncuestasService } from '../../services/encuestas.services';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-seccion',
  standalone: true,
  imports: [PrimengModule, TextFieldModule],
  templateUrl: './seccion.component.html',
  styleUrl: './../../lista-categorias/lista-categorias.component.scss',
})
export class SeccionComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Input() iSeccionId: number;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() seccionModificada = new EventEmitter<boolean>();

  iEncuId: number;
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
      this.iEncuId = params.params.iEncuId || null;
    });
  }

  ngOnInit(): void {
    try {
      this.formSeccion = this.fb.group({
        iEncuId: this.iEncuId,
        iSeccionId: [null],
        cSeccionTitulo: ['', [Validators.required, Validators.maxLength(100)]],
        cSeccionDescripcion: [''],
        iSeccionOrden: [null],
      });
    } catch (error) {
      console.error('Error al inicializar el formulario', error);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.iSeccionId && changes['visible'].currentValue) {
      this.verSeccion();
    } else {
      this.clearForm();
    }
  }

  verSeccion() {
    this.encuestasService
      .verSeccion({
        iSeccionId: this.iSeccionId,
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
    this.formSeccion.get('iEncuId').patchValue(this.iEncuId);
    this.seccion_registrada = true;
    this.formSeccion.markAsDirty();
  }

  clearForm() {
    this.iSeccionId = null;
    this.seccion_registrada = false;
    if (this.formSeccion) {
      this.formSeccion.reset();
      this.formSeccion.get('iEncuId').patchValue(this.iEncuId);
    }
  }

  guardar() {
    if (this.formSeccion.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Formulario no válido',
      });
      return;
    }
    this.encuestasService.guardarSeccion(this.formSeccion.value).subscribe({
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
        detail: 'Formulario no válido',
      });
      return;
    }
    this.encuestasService.actualizarSeccion(this.formSeccion.value).subscribe({
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
