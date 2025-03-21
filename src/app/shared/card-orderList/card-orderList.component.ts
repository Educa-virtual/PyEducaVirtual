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
    @Input() estudianteMatriculadosxGrado: any[] = [] // Lista de estudiantes
    @Output() estudianteSeleccionado = new EventEmitter<any>() // Evento para el padre
    constructor() {}

    ngOnInit() {
        console.log('')
    }
    obtenerCursoEstudiante(estudiante: any) {
        this.estudianteSeleccionado.emit(estudiante) // Emitimos el estudiante seleccionado
    }
    // en esta forma se puede importar el componente
    // <app-card-orderList
    //                   [estudianteMatriculadosxGrado]="estudianteMatriculadosxGrado"
    //                   (estudianteSeleccionado)="obtenerCursoEstudiante($event)"
    //               ></app-card-orderList>
}
