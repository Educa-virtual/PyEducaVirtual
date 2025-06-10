import { Component, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
//import { PrimeIcons } from 'primeng/api'

@Component({
    selector: 'app-encuestas-por-categoria',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './encuestas-por-categoria.component.html',
    styleUrl: './encuestas-por-categoria.component.scss',
})
export class EncuestasPorCategoriaComponent implements OnInit {
    ngOnInit(): void {
        console.log('ngOnInit')
    }
}
