import { PrimengModule } from '@/app/primeng.module'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'

@Component({
    selector: 'app-card-orderlist',
    standalone: true,
    templateUrl: './card-orderList.component.html',
    styleUrls: ['./card-orderList.component.scss'],
    imports: [PrimengModule],
})
export class CardOrderListComponent implements OnInit {
    @Input() data: any[] = [] // Lista de datos
    @Output() datoSeleccionado = new EventEmitter<any>() // Evento para el padre
    constructor() {}

    ngOnInit() {
        console.log('')
    }
    obtenerDatos(estudiante: any) {
        this.datoSeleccionado.emit(estudiante) // Emitimos el estudiante seleccionado
    }
    // en esta forma se puede importar el componente
    // <app-card-orderlist
    //     [data]="estudianteMatriculadosxGrado"
    //     (datoSeleccionado)="obtenerCursoEstudiante($event)"
    // ></app-card-orderlist>
}
