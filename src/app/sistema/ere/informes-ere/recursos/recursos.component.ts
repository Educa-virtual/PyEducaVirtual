import { PrimengModule } from '@/app/primeng.module'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { Component, OnInit } from '@angular/core'
import { MenuItem, MessageService } from 'primeng/api'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'

@Component({
    selector: 'app-recursos',
    standalone: true,
    imports: [PrimengModule, TablePrimengComponent],
    templateUrl: './recursos.component.html',
    styleUrl: './recursos.component.scss',
})
export class RecursosComponent implements OnInit {
    title: string = 'Recursos'

    // Datos para breadcrumb
    breadCrumbItems: MenuItem[]
    breadCrumbHome: MenuItem

    // Datos para la tabla (hcd)
    datosRecursos: any[] = [
        {
            item: 1,
            nivel: 'Primaria',
            grado: '2do',
            area: 'Matemática',
            tipo: 'PDF',
            archivo: 'matematica_2do_primaria.pdf',
        },
    ]

    selectedItem: any

    // columnas tabla
    columns = [
        {
            type: 'item',
            width: '1rem',
            field: 'item',
            header: 'N°',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '8rem',
            field: 'nivel',
            header: 'Nivel',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '8rem',
            field: 'grado',
            header: 'Grado',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '8rem',
            field: 'area',
            header: 'Área',
            text_header: 'center',
            text: 'left',
        },
        {
            type: 'actions',
            width: '4rem',
            field: 'actions',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ]

    // Definición de acciones tabla
    actions: IActionTable[] = [
        {
            labelTooltip: 'Gestionar recursos',
            icon: 'pi pi-bars',
            accion: 'gestionar',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
        },
    ]

    constructor(
        private messageService: MessageService,
        private confirmationModalService: ConfirmationModalService
    ) {}

    ngOnInit(): void {
        console.log('Inicializando componente Recursos')

        // home / breadcrumb
        this.breadCrumbHome = {
            icon: 'pi pi-home',
            routerLink: '/inicio',
        }

        this.breadCrumbItems = [{ label: 'Recursos' }]
    }

    gestionarRecurso(item: any) {
        this.selectedItem = item
        this.messageService.add({
            severity: 'info',
            summary: 'Ver recurso',
            detail: `Visualizando recurso: ${item.area || 'Seleccionado'}`,
        })
    }

    descargarRecurso(item: any) {
        this.messageService.add({
            severity: 'success',
            summary: 'Descargar recurso',
            detail: `Descargando recurso: ${item.area || 'Seleccionado'}`,
        })
    }

    // Método para manejar acciones de la tabla
    accionBtnItemTable({ accion, item }) {
        switch (accion) {
            case 'gestionar':
                this.gestionarRecurso(item)
                break
            case 'descargar':
                this.descargarRecurso(item)
                break
        }
    }

    cargarRecursos() {
        console.log('cargarRecursos')
    }
}
