import { Component } from '@angular/core'
import { ButtonModule } from 'primeng/button'

/*import { Product } from '@domain/product';
import { ProductService } from '@service/productservice';*/
import { TableModule } from 'primeng/table'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'app-alternativas',
    standalone: true,
    imports: [ButtonModule, TableModule, CommonModule],
    templateUrl: './alternativas.component.html',
    styleUrl: './alternativas.component.scss',
})
export class AlternativasComponent {}
