import { Component, Output, Input, OnInit, EventEmitter } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { FormBuilder, FormGroup } from '@angular/forms'

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

    form: FormGroup
    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        console.log('inicializando OnInit')
        this.form = this.fb.group({})
    }

    onHide() {
        this.visible = false
        this.visibleChange.emit(this.visible)
    }
}
