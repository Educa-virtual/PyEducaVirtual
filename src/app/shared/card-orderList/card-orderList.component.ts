import { PrimengModule } from '@/app/primeng.module'
import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnChanges,
    SimpleChanges,
} from '@angular/core'

@Component({
    selector: 'app-card-orderlist',
    standalone: true,
    templateUrl: './card-orderList.component.html',
    styleUrls: ['./card-orderList.component.scss'],
    imports: [PrimengModule],
})
export class CardOrderListComponent implements OnChanges {
    @Input() data: any[] = [] // Lista de datos
    @Input() mostrarImagen: boolean = false // Lista de datos
    @Output() datoSeleccionado = new EventEmitter<any>() // Evento para el padre

    ngOnChanges(changes: SimpleChanges) {
        if (changes['data']) {
            this.data = changes['data']?.currentValue
        }
        if (changes['mostrarImagen']) {
            this.mostrarImagen = changes['mostrarImagen']?.currentValue
        }
    }
    obtenerDatos(data: any) {
        this.datoSeleccionado.emit(data) // Emitimos el estudiante seleccionado
    }
    // en esta forma se puede importar el componente
    // <app-card-orderlist
    //     [data]="estudianteMatriculadosxGrado"
    //     (datoSeleccionado)="obtenerCursoEstudiante($event)"
    // ></app-card-orderlist>
}
