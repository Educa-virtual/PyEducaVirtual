import { Component } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { FormsModule } from '@angular/forms'
import { ContenidosComponent } from './contenidos/contenidos.component'
@Component({
    selector: 'app-comunicados',
    standalone: true,
    imports: [PrimengModule, FormsModule, ContenidosComponent],
    templateUrl: './comunicados.component.html',
    styleUrls: ['./comunicados.component.scss'],
})
export class ComunicadosComponent {}
