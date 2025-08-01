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
            cAsunto: 'Mejora en materiales de clase',
            cNombreEstudiante: 'Gómez Torres Luis Alberto',
            cNivelLogroAlcanzado: '4to',
            cSeccion: 'c',
            docuento_identidad: '48783215',
        },
        {
            item: 2,
            iLogroAlcanzadoId: 2,
            //dtFechaCreacion: new Date('2025-04-20'),
            cAsunto: 'Mejora en materiales de clase',
            cNombreEstudiante: 'perez perez luis fernando',
            cNivelLogroAlcanzado: '4to',
            cSeccion: 'A',
            docuento_identidad: '46983215',
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
            width: '5rem',
            field: 'cNombreEstudiante',
            header: 'Apellidos y Nombre',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cNivelLogroAlcanzado',
            header: 'Nivel',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '12rem',
            field: 'cSeccion',
            header: 'Sección',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '8rem',
            field: 'docuento_identidad',
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
