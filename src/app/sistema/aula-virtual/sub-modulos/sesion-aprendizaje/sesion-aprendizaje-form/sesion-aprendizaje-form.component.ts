import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component';
import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'app-sesion-aprendizaje-form',
  standalone: true,
  imports: [ModalPrimengComponent, NgIf],
  templateUrl: './sesion-aprendizaje-form.component.html',
  styleUrl: './sesion-aprendizaje-form.component.scss',
})
export class SesionAprendizajeFormComponent implements OnChanges {
  @Output() accionCloseForm = new EventEmitter<void>();
  @Input() showModal: boolean = false;

  ngOnChanges(changes) {
    if (changes['showModal']) {
      this.showModal = changes['showModal'].currentValue;
    }
  }
}
