import { Component, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { RegistrarLogroAlcanzadoComponent } from './registrar-logro-alcanzado/registrar-logro-alcanzado.component'
import { BoletaLogroComponent } from './boleta-logro/boleta-logro.component'
@Component({
    selector: 'app-logro-alcanzado',
    standalone: true,
    imports: [
        PrimengModule,
        TablePrimengComponent,
        RegistrarLogroAlcanzadoComponent,
        BoletaLogroComponent,
    ],
    templateUrl: './logro-alcanzado.component.html',
    styleUrl: './logro-alcanzado.component.scss',
})
export class LogroAlcanzadoComponent implements OnInit {
    //breadCrumbHome: MenuItem
    dialogRegistrarLogroAlcanzado: boolean = false
    registroTitleModal: string
    dialogBoletaLogroAlcanzado: boolean = false
    boletaTitleModal: string
    selectedItem: any
    dataSugerencias = [
        {
            item: 1,
            iLogroAlcanzadoId: 1,
            dtFechaCreacion: new Date('2025-04-20'),
            cAsunto: 'Mejora en materiales de clase',
            cNombreEstudiante: 'Gómez Torres Luis Alberto',
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
        this.registroTitleModal =
            'Registro : Gómez Torres Luis Alberto - Nivel: 4to - Sección: C'
        this.dialogRegistrarLogroAlcanzado = true
    }
    listenDialogRegistrarLogro(event: boolean) {
        if (event == false) {
            this.dialogRegistrarLogroAlcanzado = false
        }
    }
    boletaLogroImprimir() {
        this.boletaTitleModal = 'Boleta de Logros de'
        this.dialogBoletaLogroAlcanzado = true
    }
    listenDialogBoleta(event: boolean) {
        if (event == false) {
            this.dialogBoletaLogroAlcanzado = false
        }
    }
    accionBtnItemTable({ accion, item }) {
        switch (accion) {
            case 'Resistrar':
                this.selectedItem = item
                this.registroLogroAlcanzado()
                break
            case 'Imprimir':
                this.selectedItem = item
                this.boletaLogroImprimir()
                break
        }
    }
    actions: IActionTable[] = [
        {
            labelTooltip: 'Resistrar logro',
            icon: 'pi pi-file-edit',
            accion: 'Resistrar',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
        },
        {
            labelTooltip: 'Imprimir Boleta',
            icon: 'pi pi-print',
            accion: 'Imprimir',
            type: 'item',
            class: 'p-button-rounded p-button-success p-button-text',
        },
    ]
}
