import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component';
import { EmptySectionComponent } from '@/app/shared/components/empty-section/empty-section.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfiguracionesComponent } from '../configuraciones/configuraciones.component';

@Component({
  selector: 'app-componentes',
  standalone: true,
  imports: [
    CommonInputComponent,
    EmptySectionComponent,
    FormsModule,
    ReactiveFormsModule,
    ConfiguracionesComponent,
  ],
  templateUrl: './componentes.component.html',
  styleUrl: './componentes.component.scss',
})
export class ComponentesComponent implements OnInit {
  form: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  // ngOnInit(): void {}

  // ngOnDestroy(): void {
  //     // Limpiar la suscripción al destruir el componente
  // }
}
