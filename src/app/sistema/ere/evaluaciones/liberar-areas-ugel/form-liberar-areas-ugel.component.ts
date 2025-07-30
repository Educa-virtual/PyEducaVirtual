import { PrimengModule } from '@/app/primeng.module';
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component';
import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';

@Component({
  selector: 'app-form-liberar-areas-ugel',
  standalone: true,
  imports: [ModalPrimengComponent, PrimengModule],
  templateUrl: './form-liberar-areas-ugel.component.html',
  styleUrl: './form-liberar-areas-ugel.component.scss',
})
export class FormLiberarAreasUgelComponent implements OnChanges {
  @Output() accionBtnItem = new EventEmitter();
  @Input() titulo: string = '';
  @Input() data;
  @Input() showModal: boolean = true;

  ngOnChanges(changes) {
    if (changes.data?.currentValue) {
      this.data = changes.data.currentValue;
    }
  }
  accionBtn(elemento): void {
    const { accion } = elemento;
    const { item } = elemento;

    switch (accion) {
      case 'close-modal':
        this.accionBtnItem.emit({ accion, item });
        break;
    }
  }
}
