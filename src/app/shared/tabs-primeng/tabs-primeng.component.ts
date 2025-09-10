import { PrimengModule } from '@/app/primeng.module';
import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface TabsPrimeng {
  title: string;
  icon?: string;
  tab?: string;
  isVisible?: boolean;
}

@Component({
  selector: 'app-tabs-primeng',
  standalone: true,
  imports: [PrimengModule, NgFor, NgIf],
  templateUrl: './tabs-primeng.component.html',
  styleUrl: './tabs-primeng.component.scss',
})
export class TabsPrimengComponent {
  @Output() updateTab = new EventEmitter();

  @Input() activeIndex: number = 0;
  @Input() tabs: TabsPrimeng[];
  @Input() classColumn: boolean = false;
  @Input() getIndex: boolean = true;
  @Input() icon: boolean = true; // para mostrar el icon delante de los title
  @Input() list: boolean = false; // Para ordenar los tab, listar por el index

  ngOnChange(changes) {
    if (changes.activeIndex?.currentValue) {
      this.activeIndex = changes.activeIndex.currentValue;
      this.updateTab.emit(this.activeIndex);
    }
    if (changes.tabs?.currentValue) {
      this.tabs = changes.tabs.currentValue;
    }

    if (changes.classColumn?.currentValue) {
      this.classColumn = changes.classColumn.currentValue;
    }
  }
  onActiveIndexChange(index: number): void {
    const tabsVisibles = this.tabs.filter(tab => !tab.isVisible);
    const tabSeleccionado = tabsVisibles[index];
    this.getIndex ? this.updateTab.emit(this.activeIndex) : this.updateTab.emit(tabSeleccionado);
  }

  className(vista: 'VIEW' | 'PANEL') {
    return !this.classColumn
      ? ''
      : (this.classColumn && vista) === 'VIEW'
        ? 'actividad-tabs'
        : 'flex-column';
  }
}
