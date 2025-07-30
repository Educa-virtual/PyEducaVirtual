import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { PrimengModule } from 'src/app/primeng.module';
import { IconComponent } from '../icon/icon.component';
import { IIcon } from '../icon/icon.interface';
import { IsIconTypePipe } from '../pipes/is-icon-type.pipe';

export interface IActionContainer {
  labelTooltip: string;
  text: string;
  icon: string | IIcon;
  accion: string;
  class: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-container-page',
  standalone: true,
  imports: [PrimengModule, IconComponent, IsIconTypePipe],
  templateUrl: './container-page.component.html',
  styleUrl: './container-page.component.scss',
})
export class ContainerPageComponent implements OnChanges {
  @Output() accionBtnItem = new EventEmitter();
  @Input() title: string = 'Titulo';
  @Input() subtitle?: string;
  @Input() actions: IActionContainer[] = [
    {
      labelTooltip: 'Agregar',
      text: 'Agregar',
      icon: 'pi pi-plus',
      accion: 'agregar',
      class: 'p-button-primary',
    },
    {
      labelTooltip: 'Descargar Pdf',
      text: 'Descargar Pdf',
      icon: 'pi pi-file-pdf',
      accion: 'descargar_pdf',
      class: 'p-button-danger',
    },
    {
      labelTooltip: 'Descargar Excel',
      text: 'Descargar Excel',
      icon: 'pi pi-download',
      accion: 'Descargar Excel',
      class: 'p-button-success',
    },
  ];

  accionBtn(accion, item) {
    const data = {
      accion,
      item,
    };
    this.accionBtnItem.emit(data);
  }

  ngOnChanges(changes): void {
    if (changes.actions?.currentValue) {
      this.actions = changes.actions.currentValue;
    }
  }
}
