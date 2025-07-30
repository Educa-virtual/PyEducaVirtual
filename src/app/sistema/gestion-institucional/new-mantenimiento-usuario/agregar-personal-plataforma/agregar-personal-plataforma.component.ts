import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-agregar-personal-plataforma',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    TooltipModule,
    DialogModule,
  ],
  templateUrl: './agregar-personal-plataforma.component.html',
  styleUrl: './agregar-personal-plataforma.component.scss',
})
export class AgregarPersonalPlataformaComponent implements OnInit {
  personalForm!: FormGroup;
  sexoOptions = [
    { label: 'Masculino', value: 'M' },
    { label: 'Femenino', value: 'F' },
    { label: 'Otro', value: 'O' },
  ];

  constructor(private fb: FormBuilder) {}

  // Propiedades para el diálogo
  @Input() visible: boolean = false;
  @Input() personalData: any = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() rolAsignado = new EventEmitter<any>();

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.personalForm = this.fb.group({
      dni: ['', Validators.required],
      numero: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      nombres: ['', Validators.required],
      sexo: ['', Validators.required],
    });
  }

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  validar() {
    if (this.personalForm.valid) {
      console.log('Formulario válido:', this.personalForm.value);
    } else {
      console.log('Formulario inválido, complete todos los campos');
      this.personalForm.markAllAsTouched();
    }
  }

  agregarYAsignarRol() {
    if (this.personalForm.valid) {
      console.log('Agregando personal y asignando rol:', this.personalForm.value);
    } else {
      console.log('Formulario inválido, complete todos los campos');
      this.personalForm.markAllAsTouched();
    }
  }
}
