import { Component } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { FormsModule } from '@angular/forms'
import { ContenidosComponent } from './contenidos/contenidos.component'
import { GruposComponent } from './grupos/grupos.component'
@Component({
    selector: 'app-comunicados',
    standalone: true,
    imports: [PrimengModule, FormsModule, ContenidosComponent, GruposComponent],
    templateUrl: './comunicados.component.html',
    styleUrls: ['./comunicados.component.scss'],
})
export class ComunicadosComponent {}
