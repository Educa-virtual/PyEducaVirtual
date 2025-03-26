import { Component, OnInit } from '@angular/core'

import { MessageService } from 'primeng/api'
import { GeneralService } from '@/app/servicios/general.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'

import { MantenimientoAddUserComponent } from '../../gestion-institucional/mantenimiento/mantenimiento-add-user/mantenimiento-add-user.component'
import { MantenimientoAddPerfilComponent } from '../../gestion-institucional/mantenimiento/mantenimiento-add-perfil/mantenimiento-add-perfil.component'
import { MantenimientoSearchUsuarioComponent } from '../../gestion-institucional/mantenimiento/mantenimiento-search-usuario/mantenimiento-search-usuario.component'
import { PrimengModule } from '@/app/primeng.module'

@Component({
    selector: 'app-usuario',
    standalone: true,
    imports: [
        PrimengModule,
        MantenimientoSearchUsuarioComponent,
        MantenimientoAddPerfilComponent,
        MantenimientoAddUserComponent,
    ],
    templateUrl: './usuario.component.html',
    styleUrl: './usuario.component.scss',
})
export class UsuarioComponent implements OnInit {
    iSedeId: number
    iYAcadId: number
    iCredId: number

    perfiles = [] // lista de perfiles
    search_perfiles: any[] = [] // lista de perfiles

    usuario: any //Informacion del usuario seleccionado
    perfil_usuario: any //Informacion del perfil seleccionado
    perfil: number = 0
    option: string = 'Director'

    modal_visible: boolean = false
    tipo_documentos: any = [] //lista de tipo de documentos
    gestionar: boolean = true
    condicion: string = ''
    titulo: string

    constructor(
        private store: LocalStoreService,
        private messageService: MessageService,
        private query: GeneralService
    ) {
        const perfil = this.store.getItem('dremoPerfil')

        this.iSedeId = perfil.iSedeId
        this.iYAcadId = this.store.getItem('dremoiYAcadId')

        this.iCredId = perfil.iCredId
    }

    ngOnInit(): void {
        // this.getPerfilSedes();
        this.getTipoDocumento()
    }

    getPerfilSedes() {
        // obtiene los perfiles para la sede
        this.query
            .searchCalAcademico({
                esquema: 'seg',
                tabla: 'perfiles',
                campos: '*',
                condicion: this.condicion,
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

    getTipoDocumento(): void {
        this.query
            .searchCalAcademico({
                esquema: 'grl',
                tabla: 'tipos_Identificaciones',
                campos: '*',
                condicion: '1=1',
            })
            .subscribe({
                next: (data: any) => {
                    this.tipo_documentos = data.data
                },
                error: (error) => {
                    console.error('Error fetching Tipo documentos:', error)
                    this.messageService.add({
                        severity: 'danger',
                        summary: 'Mensaje',
                        detail: 'Error en ejecución',
                    })
                },
                //    complete: () => {
                //     console.log(this.tipo_documentos)
                //        // console.log('Request completed')
                //    },
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
            this.option = 'Nuevo'
            this.modal_visible = true //Mostrar modal para registro de usuarior
            // this.getPerfilUsuario()
        }
        if (accion === 'nuevo_perfil_generado') {
            // envia la informacion del perfil seleccionado
            this.option = 'Director'

            this.modal_visible = false //Mostrar modal para registro de usuarior
            // this.getPerfilUsuario()
        }

        if (accion === 'Director') {
            alert(accion)
            this.option = 'Director'

            this.modal_visible = false //Mostrar modal para registro de usuarior
            this.option = 'Director'
            ;(this.condicion =
                'iTipoPerfilId = 7 or iTipoPerfilId = 4 or iTipoPerfilId = 10 or iTipoPerfilId = 12 or iTipoPerfilId = 9 or iTipoPerfilId = 8'),
                (this.titulo = 'Accesos de Director')
            this.iSedeId = 1
            this.getPerfilSedes()
        }

        if (accion === 'especialista_ugel') {
            this.gestionar = false
            this.option = 'Especialista_UGEL'
            this.condicion = 'iTipoPerfilId = 5 '
            this.titulo = 'Accesos de Especialista UGEL'
            this.getPerfilSedes()
            // busca los perfiles
        }

        if (accion === 'especialista_dremo') {
            this.gestionar = false
            this.condicion = 'iTipoPerfilId = 6 '
            this.option = 'Especialista_DREMO'
            this.titulo = 'Accesos de Especialista DREMO'
            this.getPerfilSedes()
        }
        if (accion === 'retornar') {
            this.gestionar = true
        }
    }
}
