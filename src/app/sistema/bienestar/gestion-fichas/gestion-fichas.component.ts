import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { PanelModule } from 'primeng/panel'
import { InputTextModule } from 'primeng/inputtext'
import { InputGroupModule } from 'primeng/inputgroup'
import { PrimengModule } from '@/app/primeng.module'
import { Router } from '@angular/router'
import {
    TablePrimengComponent,
    IColumn,
    IActionTable,
} from '@/app/shared/table-primeng/table-primeng.component'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { DatosFichaBienestarService } from '../services/datos-ficha-bienestar.service'
import { MessageService } from 'primeng/api'

interface Ficha {
    iFichaDGId: number
    iPersId: string
    dtFichaDG: string
    cTipoIdentSigla: string
    cPersDocumento: string
    cPersNombresApellidos: string
    cPersSexo: string
    dPersNacimiento: string
}

@Component({
    selector: 'app-gestion-fichas',
    standalone: true,
    imports: [
        TablePrimengComponent,
        ReactiveFormsModule,
        ButtonModule,
        PanelModule,
        InputTextModule,
        InputGroupModule,
        PrimengModule,
    ],
    templateUrl: './gestion-fichas.component.html',
    styleUrls: ['./gestion-fichas.component.scss'],
})
export class GestionFichasComponent implements OnInit {
    fichas: Ficha[] = []
    searchForm: FormGroup
    iIieeId: number
    public datos: any[] = []

    private _MessageService = inject(MessageService)

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private datosFichaBienestarService: DatosFichaBienestarService,
        private store: LocalStoreService,
        private constantesService: ConstantesService
    ) {
        this.searchForm = this.fb.group({
            iCredSesionId: this.constantesService.iCredId,
            iSedeId: this.constantesService.iSedeId,
            nombre: [''],
            apellidos: [''],
            dni: [''],
        })

        {
            //aqui se llama el objeto que trae los datos del perfil
            const perfil = this.store.getItem('dremoPerfil')
            console.log(perfil, 'perfil dremo', this.store)
            this.iIieeId = perfil.iIieeId
        }
    }

    ngOnInit(): void {
        this.listarFichas() //
    }

    listarFichas() {
        this.datosFichaBienestarService
            .listarFichas(this.searchForm.value)
            .subscribe({
                next: (data: any) => {
                    this.fichas = data.data
                },
                error: (error) => {
                    console.error('Error al obtener los estudiantes', error)
                    this._MessageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error,
                    })
                },
            })
    }

    //---Filtrado de estudiantes--------------
    filtrarEstudiantes() {
        // filtrar por nombre y dni
    }

    nuevoIngreso(): void {
        this.router.navigate(['/bienestar/ficha/general'])
    }

    accionBnt({ accion, item }) {
        switch (accion) {
            case 'imprimir':
                this.descargarFicha(item.iPersId, 2025)
                console.log('Imprimir seleccionado')
                break
            case 'editar':
                console.log('Editar seleccionado')
                break
            case 'eliminar':
                console.log('Eliminar seleccionado')
                break
            case 'deshacer':
                console.log('Deshacer seleccionado')
                break
            default:
                console.warn('Acción no reconocida:', accion)
        }
    }

    descargarFicha(id: number, anio: number): void {
        this.datosFichaBienestarService
            .descargarFicha({
                id: id,
                anio: anio,
            })
            .subscribe({
                next: (response) => {
                    // const url = window.URL.createObjectURL(blob)
                    // window.open(url, '_blank')
                    const blob = new Blob([response], {
                        type: 'application/pdf',
                    })
                    const url = window.URL.createObjectURL(blob)
                    const link = document.createElement('a')
                    link.href = url
                    link.target = '_blank'
                    link.click()
                    // window.URL.revokeObjectURL(url)
                },
                error: (err) => {
                    console.error('Error al descargar el PDF:', err)
                    alert('No se pudo generar el PDF')
                },
            })
    }

    public columnasTabla: IColumn[] = [
        {
            field: 'item',
            header: 'N°',
            type: 'item',
            width: '5%',
            text_header: 'N°',
            text: 'N°',
        },
        {
            field: 'cTipoIdentSigla',
            header: 'Tipo Doc.',
            type: 'text',
            width: '10%',
            text_header: 'center',
            text: 'center',
        },
        {
            field: 'cPersDocumento',
            header: 'Doc.',
            type: 'text',
            width: '10%',
            text_header: 'center',
            text: 'center',
        },
        {
            field: 'cPersApellidos',
            header: 'Apellidos',
            type: 'text',
            width: '30%',
            text_header: 'center',
            text: 'left',
        },
        {
            field: 'cPersNombre',
            header: 'Nombres',
            type: 'text',
            width: '25%',
            text_header: 'center',
            text: 'left',
        },
        {
            field: 'dtFichaDG',
            header: 'Fecha',
            type: 'date',
            width: '10%',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'actions',
            width: '10%',
            field: '',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ]

    public accionesTabla: IActionTable[] = [
        {
            labelTooltip: 'Imprimir',
            icon: 'pi pi-print',
            accion: 'imprimir',
            type: 'item',
            class: 'p-button-rounded p-button-secondary p-button-text',
        },
        {
            labelTooltip: 'Ver',
            icon: 'pi pi-eye',
            accion: 'ver',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
        },
    ]
}
