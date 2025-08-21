import { PrimengModule } from '@/app/primeng.module';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-primeng',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './modal-primeng.component.html',
  styleUrl: './modal-primeng.component.scss',
})
export class ModalPrimengComponent {
  @Output() accionBtnItem = new EventEmitter();

  @Input() title: string;
  @Input() showModal: boolean = false;
  @Input() option: string; //position: 'center' || 'top' || 'bottom' || 'left' || 'right' || 'topleft' || 'topright' || 'bottomleft' || 'bottomright'
  @Input() width: string = '25rem';

  accionBtn(accion, item) {
    const data = {
      accion,
      item,
    };
    this.accionBtnItem.emit(data);
  }

  get dialogStyle() {
    return {
      maxWidth: this.width,
      width: this.width,
    };
  }
}
