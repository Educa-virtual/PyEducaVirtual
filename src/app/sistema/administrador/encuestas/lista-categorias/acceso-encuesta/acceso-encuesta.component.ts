import { Component, EventEmitter, Input, Output } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'

@Component({
    selector: 'app-acceso-encuesta',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './acceso-encuesta.component.html',
    styleUrl: './acceso-encuesta.component.scss',
})
export class AccesoEncuestaComponent {
    @Input() visible: boolean = false
    @Output() visibleChange = new EventEmitter<boolean>()
}
