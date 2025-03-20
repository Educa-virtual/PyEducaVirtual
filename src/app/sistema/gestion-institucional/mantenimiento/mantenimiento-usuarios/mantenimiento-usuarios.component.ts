import { Component, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'

import { MessageService } from 'primeng/api'
import { GeneralService } from '@/app/servicios/general.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'

import { MantenimientoSearchUsuarioComponent } from '../mantenimiento-search-usuario/mantenimiento-search-usuario.component'
import { MantenimientoAddPerfilComponent } from '../mantenimiento-add-perfil/mantenimiento-add-perfil.component'

@Component({
    selector: 'app-mantenimiento-usuarios',
    standalone: true,
    imports: [
        PrimengModule,
        MantenimientoSearchUsuarioComponent,
        MantenimientoAddPerfilComponent,
    ],

    templateUrl: './mantenimiento-usuarios.component.html',
    styleUrl: './mantenimiento-usuarios.component.scss',
})
export class MantenimientoUsuariosComponent implements OnInit {
    iSedeId: number

    perfiles = [] // lista de perfiles
    search_perfiles: any[] = [] // lista de perfiles

    usuario: any //Informacion del usuario seleccionado
    perfil_usuario: any //Informacion del perfil seleccionado
    perfil: number = 0

    modal_visible: boolean = false

    constructor(
        private store: LocalStoreService,
        private messageService: MessageService,
        private query: GeneralService
    ) {
        const perfil = this.store.getItem('dremoPerfil')

        this.iSedeId = perfil.iSedeId
    }

    ngOnInit(): void {
        this.getPerfilSedes()
    }

    getPerfilSedes() {
        // obtiene los perfiles para la sede
        this.query
            .searchCalAcademico({
                esquema: 'seg',
                tabla: 'perfiles',
                campos: '*',
                condicion:
                    'iTipoPerfilId = 7 or iTipoPerfilId = 4 or iTipoPerfilId = 10 or iTipoPerfilId = 12 or iTipoPerfilId = 9 or iTipoPerfilId = 8',
            })
            .subscribe({
                next: (data: any) => {
                    this.search_perfiles = data.data
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
                    // this.search_perfiles.unshift({
                    //     iPerfilId: '0',
                    //     cPerfilNombre: 'Todos los perfiles',
                    // }) // console.log('Request completed')
                },
            })
    }

    accionBtnItemTable({ accion, item }) {
        // console.log(this.selectedItems, 'selectedItems')
        console.log(accion, 'accion', item, 'item')
        if (accion === 'editar') {
            console.log(item, 'btnTable')
        }
        if (accion === 'asignar_perfil') {
            // envia la informacion del perfil seleccionado
            this.usuario = item
            // this.getPerfilUsuario()
        }
        if (accion === 'nuevo_perfil') {
            // envia la informacion del perfil seleccionado

            this.modal_visible = true //Mostrar modal para registro de usuarior
            // this.getPerfilUsuario()
        }
        //86824892 Maria 18195497  73952413 Lisbeth
    }
}
