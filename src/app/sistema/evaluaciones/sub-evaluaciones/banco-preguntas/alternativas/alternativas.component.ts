import { Component, inject } from '@angular/core'
import { ButtonModule } from 'primeng/button'

/*import { Product } from '@domain/product';
import { ProductService } from '@service/productservice';*/
import { TableModule } from 'primeng/table'
import { CommonModule } from '@angular/common'

/* modal  */
import { DialogService } from 'primeng/dynamicdialog'
import { AlternativasFormComponent } from '../alternativas/alternativas-form/alternativas-form.component'
import { MODAL_CONFIG } from '@/app/shared/constants/modal.config'
@Component({
    selector: 'app-alternativas',
    standalone: true,
    imports: [ButtonModule, TableModule, CommonModule],
    templateUrl: './alternativas.component.html',
    styleUrl: './alternativas.component.scss',
    providers: [DialogService],
})
export class AlternativasComponent {
    private _dialogService = inject(DialogService)

    agregarAlternativa() {
        this._dialogService.open(AlternativasFormComponent, {
            ...MODAL_CONFIG,
            header: 'Alternativa',
        })
    }
}
