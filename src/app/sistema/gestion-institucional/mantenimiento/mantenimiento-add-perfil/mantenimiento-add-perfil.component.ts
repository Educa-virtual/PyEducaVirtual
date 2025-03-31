import {
    Component,
    inject,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from '@angular/core'

import { PrimengModule } from '@/app/primeng.module'
import {
    ContainerPageComponent,
    IActionContainer,
} from '@/app/shared/container-page/container-page.component'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'

//para formularios
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MessageService } from 'primeng/api'
import { GeneralService } from '@/app/servicios/general.service'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'

@Component({
    selector: 'app-mantenimiento-add-perfil',
    standalone: true,
    imports: [PrimengModule, TablePrimengComponent, ContainerPageComponent],
    templateUrl: './mantenimiento-add-perfil.component.html',
    styleUrl: './mantenimiento-add-perfil.component.scss',
})
export class MantenimientoAddPerfilComponent implements OnChanges, OnInit {
    //@Output() select_perfil = new EventEmitter() // emite usuario selecionado

    // @Input() data_usuarios // array de usuarios a mostrar
    @Input() option: string // opcion segun el modulo Director, Especialista DREMO, especialista UGEL
    @Input() usuario // Usuario seleccionado
    @Input() search_perfiles: any = [] //lista de perfiles
    @Input() iSedeId: number = 0 // id de isntitucion educativa

    form_perfil: FormGroup

    //variables
    perfil_usuario: any
    selectedItemsPerfil = [] //Seleccion de usuario (perfil)

    private _confirmService = inject(ConfirmationModalService)
    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private query: GeneralService
    ) {}
    ngOnInit() {
        this.form_perfil = this.fb.group({
            iPerfilId: ['', [Validators.required]],
        })
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (this.search_perfiles || this.option) {
            this.getPerfilUsuario(this.usuario)
            //this.getAccesos(this.option);
            //console.log(this.area, ' registro en com if visible_horario');
            //this.mostrarModal();
        }
        if (changes['usuario'] && changes['usuario'].currentValue) {
            this.getPerfilUsuario(this.usuario)
        }
    }
    accionBtnItemTable({ accion, item }) {
        if (accion === 'eliminar_perfiles') {
            this.btnItem(
                'eliminar_perfiles',
                '¿Desea eliminar todos los perfiles del usuario seleccionado?'
            )
        }

        if (accion === 'eliminar_perfil') {
            // elimina perfil seleccionado
            this.selectedItemsPerfil = item
            this.btnItem(
                'eliminar_perfil',
                '¿Desea eliminar el perfil seleccionado?'
            )
        }
    }

    btnItem(accion: string, mensaje: string) {
        this._confirmService.openConfiSave({
            header: 'Advertencia de procesamiento',
            message: mensaje,
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if (accion === 'perfil') {
                    // agrega perfil seleccionado
                    this.asignar_perfil()
                    console.log('perfil', this.form_perfil.value.iPerfilId)
                }

                if (accion === 'eliminar_perfiles') {
                    // elimina todos los perfiles del usuario seleccionado
                    this.eliminar_perfiles(0)
                }
                if (accion === 'eliminar_perfil') {
                    // elimina perfil seleccionado del usuario
                    this.eliminar_perfiles(
                        this.selectedItemsPerfil['iPerfilId']
                    )
                }
            },
            reject: () => {
                // Mensaje de cancelación (opcional)
                this.messageService.add({
                    severity: 'error',
                    summary: 'Cancelado',
                    detail: 'Acción cancelada',
                })
            },
        })
    }

    //peticion de prefiles de usuario
    getPerfilUsuario(usuario: any) {
        // obtiene los perfiles de los usuarios
        this.query
            .searchCalendario({
                json: JSON.stringify({
                    iCredEntId: usuario.iCredEntId,
                }),
                _opcion: 'getPerfilesUsuarioSede',
            })
            .subscribe({
                next: (data: any) => {
                    this.perfil_usuario = data.data

                    console.log(data.data, 'perfil_usuario')
                },
                error: (error) => {
                    console.error(
                        'Error fetching Servicios de Atención:',
                        error
                    )
                },
                complete: () => {
                    //   console.log('Request completed')
                },
            })
    }

    //funciones de perfiles

    eliminar_perfiles(id: number) {
        let params = {}
        if (id === 0) {
            params = {
                esquema: 'seg',
                tabla: 'credenciales_entidades_perfiles',
                campo: 'iCredEntId',
                valorId: this.usuario.iCredEntId,
            }
        } else {
            params = {
                esquema: 'seg',
                tabla: 'credenciales_entidades_perfiles',
                campo: 'iPerfilId',
                valorId: id,
            }
        }

        this.query.deleteAcademico(params).subscribe({
            next: (data: any) => {
                console.log(data.data)
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Mensaje',
                    detail: 'Error. No se proceso petición ' + error,
                })
            },
            complete: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Mensaje',
                    detail: 'Proceso exitoso',
                })
                console.log('Request completed')
                this.getPerfilUsuario(this.usuario)
            },
        })
    }

    asignar_perfil() {
        this.query
            .addCalAcademico({
                json: JSON.stringify({
                    iCredEntId: this.usuario.iCredEntId,
                    iPerfilId: this.form_perfil.value.iPerfilId,
                }),
                _opcion: 'addPerfil',
            })
            .subscribe({
                next: (data: any) => {
                    console.log(data, 'addPerfil')
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Mensaje',
                        detail: 'Error. No se proceso petición ' + error,
                    })
                },
                complete: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Mensaje',
                        detail: 'Proceso exitoso',
                    })
                    console.log('Request completed')
                    this.getPerfilUsuario(this.usuario)
                },
            })
    }

    //estructura de contenedor
    accionesPerfil: IActionContainer[] = [
        {
            labelTooltip: 'Eliminar todos los perfiles',
            text: 'Eliminar perfiles',
            icon: 'pi pi-trash',
            accion: 'eliminar_perfiles',
            class: 'p-button-danger',
        },
    ]
    //estructura de tabla
    actionsPerfil: IActionTable[] = [
        {
            labelTooltip: 'Eliminar perfil',
            icon: 'pi pi-trash', // pi pi-ban
            accion: 'eliminar_perfil',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
    ]

    columa_perfil = [
        {
            type: 'item',
            width: '10%',
            field: 'item',
            header: 'N°',
            text_header: 'left',
            text: 'left',
        },

        {
            type: 'text',
            width: '60%',
            field: 'cPerfilNombre',
            header: 'Perfil',
            text_header: 'center',
            text: 'center',
        },

        {
            type: 'actions',
            width: '20%',
            field: 'actions',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ] // iCredEntId  iCredEntEstado
}
