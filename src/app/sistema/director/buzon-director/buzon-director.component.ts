import { PrimengModule } from '@/app/primeng.module'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { Component, OnInit } from '@angular/core'
import { MessageService } from 'primeng/api'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { VerSugerenciaComponent } from '../../estudiante/buzon-sugerencias/ver-sugerencia/ver-sugerencia.component'

@Component({
    selector: 'app-buzon-director',
    standalone: true,
    imports: [PrimengModule, TablePrimengComponent, VerSugerenciaComponent],
    templateUrl: './buzon-director.component.html',
    styleUrl: './buzon-director.component.scss',
})
export class BuzonDirectorComponent implements OnInit {
    title: string = 'Buzón de sugerencias - Director'
    prioridades: any[]
    formularioVerHeader: string
    mostrarFormularioVer: boolean = false
    formularioResponderHeader: string
    mostrarFormularioResponder: boolean = false
    perfil: any = JSON.parse(localStorage.getItem('dremoPerfil'))
    dataSugerencias: any[]
    selectedItem: any

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
            header: 'Fecha',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '12rem',
            field: 'cAsunto',
            header: 'Asunto',
            text_header: 'center',
            text: 'left',
        },
        {
            type: 'tag',
            width: '2rem',
            field: 'cPrioridadNombre',
            header: 'Prioridad',
            styles: {
                Alta: 'danger',
                Baja: 'success',
                Media: 'warning',
            },
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cNombreEstudiante',
            header: 'Estudiante',
            text_header: 'center',
            text: 'left',
        },
        {
            type: 'text',
            width: '8rem',
            field: 'cRespuesta',
            header: 'Estado de respuesta',
            text_header: 'center',
            text: 'left',
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
    buzonSugerenciasService: any

    constructor(
        //private buzonSugerenciasService: BuzonSugerenciasService,
        private messageService: MessageService,
        private confirmationModalService: ConfirmationModalService
    ) {}

    ngOnInit() {
        this.obtenerListaSugerencias()
    }

    listenDialogVerSugerencia(event: boolean) {
        if (event == false) {
            this.mostrarFormularioVer = false
        }
    }

    listenSugerenciaRespondida(event: boolean) {
        if (event == true) {
            this.mostrarFormularioResponder = false
            this.obtenerListaSugerencias()
        }
    }

    verSugerencia() {
        this.formularioVerHeader = 'Ver sugerencia'
        this.mostrarFormularioVer = true
    }

    responderSugerencia() {
        this.formularioResponderHeader = 'Responder sugerencia'
        this.mostrarFormularioResponder = true
    }

    obtenerListaSugerencias() {
        this.buzonSugerenciasService.obtenerListaSugerencias().subscribe({
            next: (data: any) => {
                this.dataSugerencias = data.data
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Problema al obtener sugerencias',
                    detail: error,
                })
            },
        })
    }

    accionBtnItemTable({ accion, item }) {
        switch (accion) {
            case 'ver':
                this.selectedItem = item
                this.verSugerencia()
                break
            case 'responder':
                this.selectedItem = item
                this.responderSugerencia()
                break
        }
    }

    actions: IActionTable[] = [
        {
            labelTooltip: 'Ver sugerencia',
            icon: 'pi pi-eye',
            accion: 'ver',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
        },
        {
            labelTooltip: 'Responder sugerencia',
            icon: 'pi pi-reply',
            accion: 'responder',
            type: 'item',
            class: 'p-button-rounded p-button-success p-button-text',
            isVisible: (row) => {
                return !row.cRespuesta || row.cRespuesta === ''
            },
        },
    ]
}
/* import { Component } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { TablePrimengComponent, IActionTable } from '@/app/shared/table-primeng/table-primeng.component';
import { IActionContainer } from '@/app/shared/container-page/container-page.component';

@Component({
  selector: 'app-buzon-director',
  standalone: true,
  imports: [
    PrimengModule,
    TablePrimengComponent,
  ],
  templateUrl: './buzon-director.component.html',
  styleUrl: './buzon-director.component.scss'
})
export class BuzonDirectorComponent  {
  title: string = 'Buzón de sugerencias';
} */
