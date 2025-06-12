import { Component, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { StringCasePipe } from '@shared/pipes/string-case.pipe'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { NuevaCategoriaComponent } from '../lista-categorias/nueva-categoria/nueva-categoria.component'
import { environment } from '@/environments/environment'
export interface IEncuestaCategoria {
    iCategoriaEncuestaId: number
    cCategoriaEncuestaNombre: string
    cCategoriaEncuestaImagen: string
    iCantidadEncuestas: number
}

@Component({
    selector: 'app-encuestas-por-categoria',
    standalone: true,
    imports: [
        PrimengModule,
        CommonModule,
        StringCasePipe,
        FormsModule,
        NuevaCategoriaComponent,
    ],
    templateUrl: './encuestas-por-categoria.component.html',
    styleUrl: './encuestas-por-categoria.component.scss',
})
export class EncuestasPorCategoriaComponent implements OnInit {
    titleEncuestasPorCategoria: string = 'Encuestas por categoría'
    backend = environment.backend
    mostrarDialogNuevaCategoria: boolean = false
    nuevaCategoria = {
        cCategoriaNombre: '',
        cDescripcion: '',
    }

    categorias: IEncuestaCategoria[] = [
        {
            iCategoriaEncuestaId: 1,
            cCategoriaEncuestaNombre: 'Censo DRE / UGEL',
            cCategoriaEncuestaImagen: 'categorias/images/censo-dre.jpg',
            iCantidadEncuestas: 2,
        },
        {
            iCategoriaEncuestaId: 2,
            cCategoriaEncuestaNombre: 'Encuesta Trimestral Docente',
            cCategoriaEncuestaImagen:
                'categorias/images/trimestral-docente.jpg',
            iCantidadEncuestas: 3,
        },
        {
            iCategoriaEncuestaId: 3,
            cCategoriaEncuestaNombre: 'Satisfacción Estudiantil',
            cCategoriaEncuestaImagen:
                'categorias/images/satisfaccion-estudiantil.jpg',
            iCantidadEncuestas: 5,
        },
        {
            iCategoriaEncuestaId: 4,
            cCategoriaEncuestaNombre: 'Evaluación Económica Estudiantil',
            cCategoriaEncuestaImagen:
                'categorias/images/evaluacion-economica.jpg',
            iCantidadEncuestas: 2,
        },
    ]

    ngOnInit(): void {
        console.log('ngOnInit')
    }

    updateUrl(item) {
        item.cCategoriaEncuestaImagen = 'categorias/images/no-image.jpg'
    }

    // Métodos para el dialog Nueva Categoría
    abrirDialogNuevaCategoria() {
        this.mostrarDialogNuevaCategoria = true
    }

    cerrarDialogNuevaCategoria() {
        this.mostrarDialogNuevaCategoria = false
        this.limpiarFormulario()
    }

    finalizarCreacionCategoria() {
        if (this.nuevaCategoria.cCategoriaNombre.trim()) {
            const categoria: IEncuestaCategoria = {
                iCategoriaEncuestaId: Date.now(), // ID temporal
                cCategoriaEncuestaNombre: this.nuevaCategoria.cCategoriaNombre,
                cCategoriaEncuestaImagen: 'categorias/images/default.jpg',
                iCantidadEncuestas: 0,
            }
            this.categorias.push(categoria)
            console.log('Nueva categoría creada:', categoria)
            this.cerrarDialogNuevaCategoria()
        }
    }

    cancelarCreacionCategoria() {
        this.cerrarDialogNuevaCategoria()
    }

    private limpiarFormulario() {
        this.nuevaCategoria = {
            cCategoriaNombre: '',
            cDescripcion: '',
        }
    }

    // Mantiene compatibilidad con el componente NuevaCategoriaComponent
    onCategoriaCreada(nuevaCategoria: IEncuestaCategoria) {
        this.categorias.push(nuevaCategoria)
        console.log('Nueva categoría creada:', nuevaCategoria)
    }
}
