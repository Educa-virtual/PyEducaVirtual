import { Component, Input, Output, EventEmitter, effect, signal } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';

@Component({
  selector: 'app-card-orderlist-ie',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './card-orderlist-ie.component.html',
  styleUrl: './card-orderlist-ie.component.scss',
})
export class CardOrderlistIeComponent {
  // 🔹 Signals internos
  public _data = signal<any[]>([]);
  public _seleccionado = signal<any>(null);

  // 🔹 Input para la data
  @Input() set data(value: any[]) {
    this._data.set(value || []);
  }

  get data() {
    return this._data();
  }

  // 🔹 Input para seleccionado
  @Input() set seleccionado(value: any) {
    this._seleccionado.set(value);
  }

  get seleccionadoValue() {
    return this._seleccionado();
  }

  // 🔹 Otros inputs
  @Input() inputSearch = true;
  @Input() mostrarImagen = false;

  // 🔹 Output
  @Output() datoSeleccionado = new EventEmitter<any>();
  constructor() {
    // Este effect se ejecuta automáticamente cuando `data` cambia
    effect(() => {
      //const lista = this._data();
      const sel = this._seleccionado();
      // console.log('✅ Data cambió en CardOrderList:', lista);

      // Aquí puedes aplicar lógica: actualizar focus, reordenar, etc.
      // Aquí podrías agregar focus automático, por ejemplo:
      if (sel) {
        queueMicrotask(() => {
          const el = document.querySelector(
            `.list-item-custom[data-id="${sel.iIieeId}"]`
          ) as HTMLElement;
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.focus();
          }
        });
      }
    });
  }

  // obtenerDatos(data: any) {
  //   if (!data) return;
  //   this._seleccionado.set(data);
  //   this.datoSeleccionado.emit(data);
  // }
  obtenerDatos(item: any) {
    this._seleccionado.set(item);
    this.datoSeleccionado.emit(item);
  }

  esSeleccionado(item: any): boolean {
    return this._seleccionado()?.iIieeId === item.iIieeId;
  }
}
