import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { EncuestasService } from '../services/encuestas.services';
import { TextFieldModule } from '@angular/cdk/text-field';

@Component({
  selector: 'app-nueva-categoria',
  standalone: true,
  imports: [PrimengModule, CommonModule, FormsModule, TextFieldModule],
  templateUrl: './nueva-categoria.component.html',
  styleUrl: './../lista-categorias/lista-categorias.component.scss',
})
export class NuevaCategoriaComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Input() iCateId: number;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() categoriaModificada = new EventEmitter<any>();

  archivoSeleccionado: File;
  dialogTitle: string = 'Nueva categoría';

  form: FormGroup;
  categoria_registrada: boolean = false;
  categoria: any = null;

  constructor(
    private fb: FormBuilder,
    private encuestasService: EncuestasService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    try {
      this.form = this.fb.group({
        iCateId: [null],
        cCateNombre: ['', Validators.required],
        cCateDescripcion: [''], // cDescripcion es un string
        cCateImagenNombre: [''],
        archivo: [null],
      });
    } catch (error) {
      console.error('Error creando categoría:', error);
    }
  }

  ngOnChanges(): void {
    if (this.iCateId) {
      this.dialogTitle = 'Editar categoría';
      this.verCategoria();
    } else {
      this.dialogTitle = 'Nueva categoría';
      this.clearForm();
    }
  }

  verCategoria() {
    this.encuestasService
      .verCategoria({
        iCateId: this.iCateId,
      })
      .subscribe({
        next: (data: any) => {
          this.setFormCategoria(data.data);
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error al obtener la categoría',
            detail: error.error.message,
          });
        },
      });
  }

  setFormCategoria(categoria: any) {
    this.categoria = categoria;
    this.form.patchValue(categoria);
    this.categoria_registrada = true;
    this.form.markAsDirty();
  }

  clearForm() {
    this.categoria = null;
    if (this.form) {
      this.form.reset();
    }
    this.categoria_registrada = false;
  }

  onHide() {
    this.iCateId = null;
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.clearForm();
  }

  handleArchivo(event: any) {
    const file = event.files && event.files.length > 0 ? event.files[0] : null;
    if (file) {
      this.archivoSeleccionado = file;
      this.form.get('archivo').setValue(file);
    } else {
      this.archivoSeleccionado = null;
      this.form.get('archivo').setValue(null);
    }
  }

  getFormData() {
    const formData: FormData = new FormData();
    formData.append('iCateId', String(this.iCateId));
    formData.append('cCateNombre', this.form.value.cCateNombre);
    formData.append('cCateDescripcion', this.form.value.cCateDescripcion);
    formData.append(
      'cCateImagenNombre',
      this.form.value.cCateImagenNombre ? this.form.value.cCateImagenNombre : ''
    );
    if (this.archivoSeleccionado) {
      formData.append('archivo', this.form.value.archivo);
    }
    return formData;
  }

  guardar() {
    if (this.form.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Complete los campos obligatorios',
      });
      return;
    }
    this.encuestasService.guardarCategoria(this.getFormData()).subscribe({
      next: (respuesta: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Categoría creada',
          detail: respuesta.message,
        });
        this.categoriaModificada.emit();
        this.salir();
      },
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al crear categoría',
          detail: error.error.message,
        });
      },
    });
  }

  actualizar() {
    if (this.form.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Complete los campos obligatorios',
      });
      return;
    }
    this.encuestasService.actualizarCategoria(this.getFormData()).subscribe({
      next: (respuesta: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Categoría actualizada',
          detail: respuesta.message,
        });
        this.categoriaModificada.emit();
        this.salir();
      },
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al actualizar categoría',
          detail: error.error.message,
        });
      },
    });
  }

  quitarImagen() {
    if (this.categoria && this.categoria.cCateImagenNombre) {
      this.categoria.cCateImagenNombre = null;
    }
    this.form.get('cCateImagenNombre')?.setValue(null);
    this.archivoSeleccionado = null;
    this.form.get('archivo').setValue(null);
  }

  salir() {
    this.onHide();
  }
}
