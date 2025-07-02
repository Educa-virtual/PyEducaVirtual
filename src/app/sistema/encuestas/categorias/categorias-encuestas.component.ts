import { Component, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { StringCasePipe } from '@shared/pipes/string-case.pipe'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { NuevaCategoriaComponent } from '../lista-categorias/nueva-categoria/nueva-categoria.component'
import { CategoriasService } from '../services/categorias.service'
import { environment } from '@/environments/environment'
import { MessageService } from 'primeng/api'
import { ICategoria } from '../interfaces/categoria.interface'

@Component({
    selector: 'app-categorias-encuestas',
    standalone: true,
    imports: [
        PrimengModule,
        CommonModule,
        StringCasePipe,
        FormsModule,
        NuevaCategoriaComponent,
    ],
    templateUrl: './categorias-encuestas.component.html',
    styleUrl: './categorias-encuestas.component.scss',
})
export class CategoriasEncuestaComponent implements OnInit {
    titleEncuestasPorCategoria: string = 'Categorías de encuestas'
    mostrarDialogNuevaCategoria: boolean = false
    backend = environment.backend
    /*nuevaCategoria = {
        cCategoriaNombre: '',
        cDescripcion: '',
    }*/

    categorias: ICategoria[] = []

    constructor(
        private categoriasService: CategoriasService,
        private messageService: MessageService
    ) {}

    //backend = environment.backend

    ngOnInit(): void {
        this.obtenerCategorias()
    }

    obtenerCategorias() {
        this.categoriasService.obtenerCategorias().subscribe({
            next: (respuesta: any) => {
                this.categorias = respuesta.data
                console.log('Categorías obtenidas:', this.categorias)
            },
        })
    }

    updateUrl(item) {
        item.cImagenUrl = 'cursos/images/no-image.jpg'
    }

    // Métodos para el dialog Nueva Categoría
    abrirDialogNuevaCategoria() {
        this.mostrarDialogNuevaCategoria = true
    }

    cerrarDialogNuevaCategoria() {
        this.mostrarDialogNuevaCategoria = false
        this.limpiarFormulario()
    }

    /*finalizarCreacionCategoria() {
        if (this.nuevaCategoria.cCategoriaNombre.trim()) {
            const categoria: IEncuestaCategoria = {
                iCategoriaEncuestaId: Date.now(), // ID temporal
                cCategoriaEncuestaNombre: this.nuevaCategoria.cCategoriaNombre,
                cCategoriaEncuestaImagen: 'categorias/images/default.jpg',
                iCantidadEncuestas: 0,
            }
            this.categorias.push(categoria)
            //console.log('Nueva categoría creada:', categoria)
            this.cerrarDialogNuevaCategoria()
        }
    }*/

    cancelarCreacionCategoria() {
        this.cerrarDialogNuevaCategoria()
    }

    private limpiarFormulario() {
        /*this.nuevaCategoria = {
            cCategoriaNombre: '',
            cDescripcion: '',
        }*/
    }

    // Mantiene compatibilidad con el componente NuevaCategoriaComponent
    onCategoriaCreada(nuevaCategoria: ICategoria) {
        this.categorias.push(nuevaCategoria)
        console.log('Nueva categoría creada:', nuevaCategoria)
    }
}
