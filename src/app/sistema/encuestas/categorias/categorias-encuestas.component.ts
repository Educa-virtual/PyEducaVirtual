import { Component, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { StringCasePipe } from '@shared/pipes/string-case.pipe'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { NuevaCategoriaComponent } from './nueva-categoria/nueva-categoria.component'
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
    categoriasInicial: ICategoria[] = []
    constructor(
        private categoriasService: CategoriasService,
        private messageService: MessageService
    ) {}

    //backend = environment.backend

    ngOnInit(): void {
        this.obtenerCategorias()
    }

    onFilter(event: Event) {
        //Elimina acentos (á, é, etc.) y convierte a minúsculas
        const normalizeText = (str: string) =>
            str
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
        const text = normalizeText((event.target as HTMLInputElement).value)
        this.categorias = this.categoriasInicial
        if (text.length > 1) {
            this.categorias = this.categorias.filter((categoria) =>
                normalizeText(categoria.cNombre).includes(text)
            )
        }
    }

    obtenerCategorias() {
        this.categoriasService.obtenerCategorias().subscribe({
            next: (respuesta: any) => {
                this.categoriasInicial = respuesta.data.map(
                    (categoria: ICategoria) => ({
                        ...categoria,
                    })
                )
                this.categorias = this.categoriasInicial
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
    }
}
