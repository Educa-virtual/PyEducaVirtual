import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';
@Component({
  selector: 'app-seccion',
  standalone: true,
  imports: [PrimengModule, TextFieldModule],
  templateUrl: './seccion.component.html',
  styleUrl: './../../lista-categorias/lista-categorias.component.scss',
})
export class SeccionComponent implements OnInit {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() AgregarSeccionEncuesta = new EventEmitter<any>();

  tipos_preguntas: Array<object> = [];
  formSeccion: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    try {
      this.formSeccion = this.fb.group({
        iSeccionId: [null],
        cSeccionTitulo: ['', [Validators.required, Validators.maxLength(100)]],
        cSeccionDescripcion: [''],
        iSeccionOrden: [null],
      });
    } catch (error) {
      console.error('Error al inicializar el formulario', error);
    }
  }

  onHide() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  cancelar() {
    this.onHide();
  }

  finalizar() {
    this.onHide();
  }
}
