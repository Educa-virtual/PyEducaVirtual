import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
@Component({
    selector: 'app-agregar-seccion-encuesta',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './agregar-seccion-encuesta.component.html',
    styleUrl: './agregar-seccion-encuesta.component.scss',
})
export class AgregarSeccionEncuestaComponent implements OnInit {
    @Input() visible: boolean = false
    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() AgregarSeccionEncuesta = new EventEmitter<any>()

    nuevaSeccion: string = ''

    ngOnInit(): void {
        console.log('OnInit')
    }

    onHide() {
        this.visible = false
        this.visibleChange.emit(this.visible)
    }

    cancelar() {
        this.onHide()
    }
    /*finalizar() {
        if (this.nuevaCategoria.trim()) {
            // Emitir la nueva categoría
            this.categoriaCreada.emit({
                ...this.nuevaCategoria,
                iCategoriaEncuestaId: Date.now(), // ID temporal
                cCategoriaEncuestaImagen: 'categorias/images/default.jpg',
                iCantidadEncuestas: 0,
            })

            // Cerrar diálogo
            this.onHide()
        }
    }*/
    finalizar() {
        this.onHide()
    }
}
