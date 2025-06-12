import { Component } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { IActionTable } from '@/app/shared/table-primeng/table-primeng.component'
import { MessageService } from 'primeng/api'
@Component({
    selector: 'app-lista-categorias',
    standalone: true,
    imports: [PrimengModule,TablePrimengComponent],
    templateUrl: './lista-categorias.component.html',
    styleUrl: './lista-categorias.component.scss',
})
export class ListaCategoriasComponent {
    titleListaCategoria: string = 'Censo DRE/UGEL'
    selectedItem: any

    dataCategorias = [
        {
            item: 1,
            iCategoriaId: 1,
            cTituloEncuesta: 'Evaluación de Satisfacción Académica',
            cTiempo: '15 min',
            dtFechaInicio: new Date('2025-06-15'),
            dtFechaFin: new Date('2025-06-30'),
        },
    ]

    columns = [
        {
            type: 'item',
            width: '1rem',
            field: 'item',
            header: '#',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '8rem',
            field: 'cTituloEncuesta',
            header: 'Título de encuesta',
            text_header: 'center',
            text: 'left',
        },
        {
            type: 'text',
            width: '2rem',
            field: 'cTiempo',
            header: 'Tiempo',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'date',
            width: '3rem',
            field: 'dtFechaInicio',
            header: 'Fecha inicio',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'date',
            width: '3rem',
            field: 'dtFechaFin',
            header: 'Fecha fin',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'actions',
            width: '3rem',
            field: 'actions',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ]

    actions: IActionTable[] = [
        {
            labelTooltip: 'Ver encuesta',
            icon: 'pi pi-eye',
            accion: 'ver',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
        },
        {
            labelTooltip: 'Editar encuesta',
            icon: 'pi pi-pen-to-square',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
        {
            labelTooltip: 'Eliminar encuesta',
            icon: 'pi pi-trash',
            accion: 'eliminar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
    ]

    constructor(private messageService: MessageService) {}

    ngOnInit() {
        console.log('Inicializando lista de categorías')
    }

    accionBtnItemTable({ accion, item }) {
        switch (accion) {
            case 'ver':
                this.selectedItem = item
                this.verCategoria()
                break
            case 'editar':
                this.selectedItem = item
                this.editarCategoria()
                break
            case 'eliminar':
                this.selectedItem = item
                this.eliminarCategoria()
                break
        }
    }

    verCategoria() {
        console.log('Ver encuesta:', this.selectedItem)
        this.messageService.add({
            severity: 'info',
            summary: 'Ver encuesta',
            detail: `Viendo encuesta: ${this.selectedItem.cTituloEncuesta}`,
        })
    }

    editarCategoria() {
        console.log('Editar encuesta:', this.selectedItem)
        this.messageService.add({
            severity: 'info',
            summary: 'Editar encuesta',
            detail: `Editando encuesta: ${this.selectedItem.cTituloEncuesta}`,
        })
    }

    eliminarCategoria() {
        console.log('Eliminar encuesta:', this.selectedItem)
        // Aquí agregas tu lógica para eliminar la encuesta
        this.messageService.add({
            severity: 'warn',
            summary: 'Eliminar encuesta',
            detail: `Eliminando encuesta: ${this.selectedItem.cTituloEncuesta}`,
        })
    }
}
