import { Component, EventEmitter, Input, Output } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

@Component({
    selector: 'app-nueva-categoria',
    standalone: true,
    imports: [PrimengModule, CommonModule, FormsModule],
    templateUrl: './nueva-categoria.component.html',
    styleUrl: './nueva-categoria.component.scss',
})
export class NuevaCategoriaComponent {
    @Input() visible: boolean = false
    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() categoriaCreada = new EventEmitter<any>()

    // Modelo del formulario
    nuevaCategoria = {
        cCategoriaNombre: '',
        cDescripcion: '',
    }

    onHide() {
        this.visible = false
        this.visibleChange.emit(this.visible)
        this.limpiarFormulario()
    }

    finalizar() {
        if (this.nuevaCategoria.cCategoriaNombre.trim()) {
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
    }

    cancelar() {
        this.onHide()
    }

    private limpiarFormulario() {
        this.nuevaCategoria = {
            cCategoriaNombre: '',
            cDescripcion: '',
        }
    }
}
