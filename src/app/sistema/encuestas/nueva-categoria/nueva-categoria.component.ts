import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { EncuestasService } from '../services/encuestas.services';

@Component({
  selector: 'app-nueva-categoria',
  standalone: true,
  imports: [PrimengModule, CommonModule, FormsModule],
  templateUrl: './nueva-categoria.component.html',
  styleUrl: './nueva-categoria.component.scss',
})
export class NuevaCategoriaComponent implements OnInit {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() categoriaCreada = new EventEmitter<any>();
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private encuestasService: EncuestasService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      bPuedeCrearDirector: [false],
      bPuedeCrearEspDremo: [false],
      bPuedeCrearEspUgel: [false],
      cDescripcion: [''], // cDescripcion es un string
      cImagenUrl: [''],
      cNombre: ['', Validators.required],
    });
  }

  onHide() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.limpiarFormulario();
  }

  guardarCategoria() {
    this.encuestasService.guardarCategoria(this.form.value).subscribe({
      next: (respuesta: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Categoría creada',
          detail: respuesta.message,
        });
        this.categoriaCreada.emit();
        this.onHide();
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

  cancelar() {
    this.onHide();
  }

  private limpiarFormulario() {
    this.form.reset();
  }
}
