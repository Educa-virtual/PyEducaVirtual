import { PrimengModule } from '@/app/primeng.module';
import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-search-words',
  standalone: true,
  templateUrl: './search-words.component.html',
  styleUrls: ['./search-words.component.scss'],
  imports: [PrimengModule],
})
export class SearchWordsComponent {
  searchTerm: string = '';
  @Output() searchChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() placeholder = 'Buscar';

  constructor() {}

  filtrarDatos(event: any) {
    this.searchTerm = event.target.value;
    this.searchChange.emit(this.searchTerm); // 🔥 Emitimos el valor al padre
  }
}
