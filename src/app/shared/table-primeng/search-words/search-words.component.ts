import { PrimengModule } from '@/app/primeng.module'
import { Component, OnInit, Output, EventEmitter } from '@angular/core'

@Component({
    selector: 'app-search-words',
    standalone: true,
    templateUrl: './search-words.component.html',
    styleUrls: ['./search-words.component.scss'],
    imports: [PrimengModule],
})
export class SearchWordsComponent implements OnInit {
    searchTerm: string = ''
    @Output() searchChange: EventEmitter<string> = new EventEmitter<string>()

    constructor() {}

    ngOnInit() {
        console.log('xikitas')
    }
    onSearch(event: any) {
        this.searchTerm = event.target.value
        this.searchChange.emit(this.searchTerm) // 🔥 Emitimos el valor al padre
    }
    filtrarDatos(event: any) {
        this.searchTerm = event.target.value
        this.searchChange.emit(this.searchTerm) // 🔥 Emitimos el valor al padre
    }
}
