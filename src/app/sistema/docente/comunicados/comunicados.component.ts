import { Component } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'

@Component({
    selector: 'app-comunicados',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './comunicados.component.html',
    styleUrl: './comunicados.component.scss',
})
export class ComunicadosComponent {}
