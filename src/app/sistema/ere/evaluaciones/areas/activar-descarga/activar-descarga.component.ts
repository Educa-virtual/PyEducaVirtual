import { Component, Output, Input, OnInit, EventEmitter } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { FormBuilder, FormGroup } from '@angular/forms'

@Component({
    selector: 'app-activar-descarga',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './activar-descarga.component.html',
    styleUrl: './activar-descarga.component.scss',
})
export class ActivarDescargaComponent implements OnInit {
    @Input() visible: boolean = false
    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() mostrarActivarDescargas = new EventEmitter<any>()

    checked: boolean = false
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
