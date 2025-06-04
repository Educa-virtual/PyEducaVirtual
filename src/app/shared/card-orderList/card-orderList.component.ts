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
    @Input() inputSearch: boolean = true
    @Input() mostrarImagen: boolean = false
    @Output() datoSeleccionado = new EventEmitter<any>() // Evento para el padre

    seleccionado: any = null

    ngOnChanges(changes: SimpleChanges) {
        if (changes['data']) {
            this.data = changes['data']?.currentValue
        }
        if (changes['mostrarImagen']) {
            this.mostrarImagen = changes['mostrarImagen']?.currentValue
        }
        if (changes['inputSearch']) {
            this.inputSearch = changes['inputSearch']?.currentValue
        }
    }
    obtenerDatos(data: any) {
        if (!data) return // Si no hay datos, no hacemos nada
        this.datoSeleccionado.emit(data) // Emitimos el estudiante seleccionado
    }
    // Estructura de datos que se esperaF
    // data = [
    //     {cTitulo:'',cImgUrl:'',cDescripcion:''}
    // ]
    // en esta forma se puede importar el componente
    // <app-card-orderlist
    //     [data]="estudianteMatriculadosxGrado"
    //     (datoSeleccionado)="obtenerCursoEstudiante($event)"
    // ></app-card-orderlist>
}
