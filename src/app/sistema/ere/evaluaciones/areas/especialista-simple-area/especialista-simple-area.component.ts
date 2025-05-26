import { Component } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { DialogGenerarCuadernilloComponent } from '../dialog-generar-cuadernillo/dialog-generar-cuadernillo.component'

@Component({
    selector: 'app-especialista-simple-area',
    standalone: true,
    imports: [PrimengModule, DialogGenerarCuadernilloComponent],
    templateUrl: './especialista-simple-area.component.html',
    styleUrl: './especialista-simple-area.component.scss',
})
export class EspecialistaSimpleAreaComponent {}
