import { Component, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MessageService } from 'primeng/api'
import { GeneralService } from '@/app/servicios/general.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import {
    ContainerPageComponent,
    IActionContainer,
} from '@/app/shared/container-page/container-page.component'

@Component({
    selector: 'app-mantenimiento-usuarios',
    standalone: true,
    imports: [PrimengModule, TablePrimengComponent, ContainerPageComponent],
    templateUrl: './mantenimiento-usuarios.component.html',
    styleUrl: './mantenimiento-usuarios.component.scss',
})
export class MantenimientoUsuariosComponent implements OnInit {
    form_usuario: FormGroup // formulario para gestionar mantenimiento-usuarios
    iSedeId: number
    iYAcadId: number
    lista_accesos: any[] = [] // lista de accesos

    constructor(
        private fb: FormBuilder,
        private store: LocalStoreService,
        private messageService: MessageService,
        private query: GeneralService
    ) {
        const perfil = this.store.getItem('dremoPerfil')
        console.log(perfil, 'perfil dremo', this.store)
        this.iSedeId = perfil.iSedeId
    }

    ngOnInit(): void {
        this.form_usuario = this.fb.group({
            cUsuario: ['', [Validators.required]],
            cContrasena: ['', [Validators.required]],
            cNombres: ['', [Validators.required]],
            cApellidos: ['', [Validators.required]],
            cCorreo: ['', [Validators.required]],
            cTelefono: ['', [Validators.required]],
            iRolId: ['', [Validators.required]],
            iEstadoId: ['', [Validators.required]],
            iSedeId: ['', [Validators.required]],
            iYAcadId: ['', [Validators.required]],
        })
        this.getAccesosSedes()
    }
    getAccesosSedes() {
        this.query
            .obtenerCredencialesSede({
                iSedeId: 1,
            })
            .subscribe({
                next: (data: any) => {
                    const item = data.data
                    this.lista_accesos = item.map((persona) => ({
                        ...persona,
                        nombre_completo: (
                            persona.cPersPaterno +
                            ' ' +
                            persona.cPersMaterno +
                            ' ' +
                            persona.cPersNombre
                        ).trim(),
                    }))
                    console.log(this.lista_accesos, ' lista de cargos')
                },
                error: (error) => {
                    console.error('Error fetching Años Académicos:', error)
                    this.messageService.add({
                        severity: 'danger',
                        summary: 'Mensaje',
                        detail: 'Error en ejecución',
                    })
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }
    // metodos

    accionBtnItemTable({ accion, item }) {
        if (accion === 'editar') {
            console.log(item, 'btnTable')
        }
        // if (accion === 'agregar') {

        // }
        // if (accion === 'eliminar') {

        // }
    }
    // container
    accionesPrincipal: IActionContainer[] = [
        {
            labelTooltip: 'Asignar personal',
            text: 'Asignar personal',
            icon: 'pi pi-plus',
            accion: 'agregar',
            class: 'p-button-primary',
        },
        {
            labelTooltip: 'Clonar personal',
            text: 'Clonar personal',
            icon: 'pi pi-copy',
            accion: 'clonar',
            class: 'p-button-warning',
        },
    ]

    // variables para table-primeng

    selectedItems = []
    actions: IActionTable[] = [
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-pencil',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
        {
            labelTooltip: 'Eliminar',
            icon: 'pi pi-trash',
            accion: 'eliminar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
    ]

    columns = [
        {
            type: 'item',
            width: '5%',
            field: 'item',
            header: 'N°',
            text_header: 'left',
            text: 'left',
        },

        {
            type: 'text',
            width: '20%',
            field: 'cPersDocumento',
            header: 'Documento',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '70%',
            field: 'nombre_completo',
            header: 'Nombre y apellidos',
            text_header: 'center',
            text: 'center',
        },

        {
            type: 'actions',
            width: '5%',
            field: 'actions',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ]
}
