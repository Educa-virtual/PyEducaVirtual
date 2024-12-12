import { PrimengModule } from '@/app/primeng.module'
import { Component } from '@angular/core'

@Component({
    selector: 'app-no-data',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './no-data.component.html',
    styleUrl: './no-data.component.scss',
})
export class NoDataComponent {
    recargar() {
        window.location.reload()
    }
}
