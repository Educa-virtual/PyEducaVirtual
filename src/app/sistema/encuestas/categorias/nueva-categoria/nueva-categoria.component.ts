import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { CommonModule } from '@angular/common'
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms'
import { MessageService } from 'primeng/api'
import { CategoriasService } from '../../services/categorias.service'
import { ICategoria } from '../../interfaces/categoria.interface'

@Component({
    selector: 'app-nueva-categoria',
    standalone: true,
    imports: [PrimengModule, CommonModule, FormsModule],
    templateUrl: './nueva-categoria.component.html',
    styleUrl: './nueva-categoria.component.scss',
})
export class NuevaCategoriaComponent implements OnInit {
    @Input() visible: boolean = false
    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() categoriaCreada = new EventEmitter<any>()
    form: FormGroup

    constructor(
        private fb: FormBuilder,
        private categoriasService: CategoriasService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.form = this.fb.group({
            bPuedeCrearDirector: [false],
            bPuedeCrearEspDremo: [false],
            bPuedeCrearEspUgel: [false],
            cDescripcion: [''], // cDescripcion es un string
            cImagenUrl: [''],
            cNombre: ['', Validators.required],
        })
    }
    // Modelo del formulario
    /*nuevaCategoria = {
        cCategoriaNombre: '',
        cDescripcion: '',
    }*/

    onHide() {
        this.visible = false
        this.visibleChange.emit(this.visible)
        this.limpiarFormulario()
    }

    registrarCategoria() {
        const categoria: ICategoria = {
            ...this.form.value,
            iTotalEncuestas: 0,
        }

        this.categoriasService.registrarCategoria(categoria).subscribe({
            next: (respuesta: any) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Categoría creada',
                    detail: respuesta.message,
                })
                categoria.iCategoriaEncuestaId = respuesta.data.id
                this.categoriaCreada.emit(categoria)
                this.onHide()
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error al crear categoría',
                    detail: error.error.message,
                })
            },
        })
    }

    /*finalizar() {
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
    }*/

    cancelar() {
        this.onHide()
    }

    private limpiarFormulario() {
        this.form.reset()
    }
}
