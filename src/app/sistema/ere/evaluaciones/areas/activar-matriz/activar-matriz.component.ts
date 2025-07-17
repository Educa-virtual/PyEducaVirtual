import { Component, Output, Input, OnInit, EventEmitter } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'

@Component({
    selector: 'app-activar-matriz',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './activar-matriz.component.html',
    styleUrl: './activar-matriz.component.scss',
})
export class ActivarMatrizComponent implements OnInit {
    @Input() visible: boolean = false
    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() mostrarActivarMatriz = new EventEmitter<any>()

    ngOnInit() {
        console.log('inicializando OnInit')
    }

    onHide() {
        this.visible = false
        this.visibleChange.emit(this.visible)
    }
}
