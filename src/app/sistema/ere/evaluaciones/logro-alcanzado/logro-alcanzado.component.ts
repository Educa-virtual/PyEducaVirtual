import { Component, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
@Component({
    selector: 'app-logro-alcanzado',
    standalone: true,
    imports: [PrimengModule, TablePrimengComponent],
    templateUrl: './logro-alcanzado.component.html',
    styleUrl: './logro-alcanzado.component.scss',
})
export class LogroAlcanzadoComponent implements OnInit {
    //breadCrumbHome: MenuItem
    formularioRegistro: string
    selectedItem: any
    dataSugerencias = [
        {
            item: 1,
            iLogroAlcanzadoId: 1,
            dtFechaCreacion: new Date('2025-04-20'),
            cAsunto: 'Mejora en materiales de clase',
            cNombreEstudiante: 'Juan Pérez',
            cRespuesta: '',
            cSugerencia:
                'Sería bueno tener acceso a más material digital para las clases de matemáticas.',
        },
        {
            item: 2,
            iLogroAlcanzadoId: 2,
            dtFechaCreacion: new Date('2025-04-20'),
            cAsunto: 'Mejora en materiales de clase',
            cNombreEstudiante: 'Ana Lopez',
            cRespuesta: '',
            cSugerencia:
                'Sería bueno tener acceso a más material digital para las clases de matemáticas.',
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
            type: 'date',
            width: '3rem',
            field: 'dtFechaCreacion',
            header: 'Apellidos y Nombre',
            text_header: 'center',
            text: 'center',
        },

        {
            type: 'text',
            width: '5rem',
            field: 'cNombreEstudiante',
            header: 'Nivel',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '12rem',
            field: 'cAsunto',
            header: 'Sección',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '8rem',
            field: 'cRespuesta',
            header: 'Nivel',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '8rem',
            field: '',
            header: 'DNI/CE',
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
    ngOnInit() {
        console.log('Logro alcanzado')
    }
    registroLogroAlcanzado() {
        this.formularioRegistro = 'Logro alcanzado'
        //this.mostrarFormularioVer = true
    }
    accionBtnItemTable({ accion, item }) {
        switch (accion) {
            case 'ver':
                this.selectedItem = item
                this.registroLogroAlcanzado()
                break
        }
    }
    actions: IActionTable[] = [
        {
            labelTooltip: 'Ver sugerencia',
            icon: 'pi pi-file-edit',
            accion: 'ver',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
        },
        {
            labelTooltip: 'Responder sugerencia',
            icon: 'pi pi-print',
            accion: 'responder',
            type: 'item',
            class: 'p-button-rounded p-button-success p-button-text',
        },
    ]
}
