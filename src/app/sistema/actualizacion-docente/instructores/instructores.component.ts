import { Component, inject, OnInit } from '@angular/core'
import { ToolbarPrimengComponent } from '../../../shared/toolbar-primeng/toolbar-primeng.component'
import { PrimengModule } from '@/app/primeng.module'
import {
    IActionTable,
    IColumn,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { InstructorFormComponent } from './instructor-form/instructor-form.component'
import { TiposIdentificacionesService } from '@/app/servicios/grl/tipos-identificaciones.service'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { GeneralService } from '@/app/servicios/general.service'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { MessageService } from 'primeng/api'

@Component({
    selector: 'app-instructores',
    standalone: true,
    imports: [
        ToolbarPrimengComponent,
        PrimengModule,
        TablePrimengComponent,
        InstructorFormComponent,
    ],
    templateUrl: './instructores.component.html',
    styleUrl: './instructores.component.scss',
})
export class InstructoresComponent implements OnInit {
    private _TiposIdentificacionesService = inject(TiposIdentificacionesService)
    private _constantesService = inject(ConstantesService)
    private GeneralService = inject(GeneralService)
    private _confirmService = inject(ConfirmationModalService)

    data: any[] = []
    tiposIdentificaciones: any[] = []
    showModal: boolean = false
    instructor // obtene datos del instructor
    accion //variable para las acciones en el modal

    constructor(private messageService: MessageService) {}

    public columnasTabla: IColumn[] = [
        {
            type: 'item',
            width: '0.5rem',
            field: 'index',
            header: 'Nro',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'item-innerHtml',
            width: '10rem',
            field: 'cDatosInstructor',
            header: 'Datos Personales del Instructor',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'item-checkList',
            width: '2rem',
            field: 'bCredencial',
            header: '¿Tiene Credencial?',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'item-innerHtml',
            width: '2rem',
            field: 'cEstado',
            header: 'Estado',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'actions',
            width: '1rem',
            field: '',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ]

    public accionesTabla: IActionTable[] = [
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-pencil',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-succes p-button-text',
        },
        {
            labelTooltip: 'Eliminar',
            icon: 'pi pi-trash',
            accion: 'eliminar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
    ]
    // para mas delante ji
    // obtenerIcono(accion: string, estado: string): string {
    //     const iconos = {
    //         editar: {
    //             activo: 'pi pi-pencil',
    //             inactivo: 'pi pi-ban',
    //         },
    //         eliminar: {
    //             Activo: 'pi pi-trash',
    //             Eliminado: 'pi pi-check',
    //         },
    //     };
    //     return iconos[accion][estado] || 'pi pi-question'; // Ícono por defecto si el estado no coincide
    // //     cambiarEstado(accion: string, nuevoEstado: string) {
    // //     this.accionesTabla = this.accionesTabla.map((accionItem) => {
    // //         if (accionItem.accion === accion) {
    // //             return { ...accionItem, estado: nuevoEstado, icon: this.obtenerIcono(accionItem.accion, nuevoEstado) };
    // //         }
    // //         return accionItem;
    // //     });
    // // }
    // }

    ngOnInit(): void {
        this.obtenerTipoIdentificaciones()
        this.obtenerInstructores()
    }
    accionBnt({ accion, item }: { accion: string; item?: any }): void {
        switch (accion) {
            case 'close-modal':
                this.showModal = false
                this.obtenerInstructores()
                break
            case 'guardar':
                this.accion = accion
                this.showModal = true
                break
            case 'editar':
                this.accion = accion
                console.log(item)
                this.instructor = item
                this.showModal = true
                break
            case 'eliminar':
                this.eliminarInstructor(item)
                break
        }
    }
    obtenerTipoIdentificaciones(): void {
        this._TiposIdentificacionesService
            .obtenerTipoIdentificaciones()
            .subscribe({
                next: (response: any) => {
                    this.tiposIdentificaciones = response.data
                },
                error: (error) => {
                    console.error(
                        'Error al obtener tipos de identificaciones:',
                        error
                    )
                },
            })
    }
    eliminarInstructor(item: any): void {
        const data = item
        this._confirmService.openConfirm({
            header:
                '¿Esta seguro de eliminar instructor:  ' +
                data.cPersNombre +
                ' ' +
                data.cPersPaterno +
                ' ?',
            accept: () => {
                const params = {
                    petition: 'delete',
                    group: 'cap',
                    prefix: 'instructores',
                    ruta: data.iInstId,
                    params: {
                        iCredId: this._constantesService.iCredId,
                    },
                }
                // Servicio para obtener los instructores
                this.GeneralService.getGralPrefixx(params).subscribe({
                    next: (resp) => {
                        if (resp.validated) {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Acción exitosa',
                                detail: resp.message,
                            })
                            this.obtenerInstructores()
                        }
                    },
                })
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

    mostrarModalGuarda() {
        this.showModal = true
    }
    // metodo para obtener instructores
    obtenerInstructores() {
        const params = {
            petition: 'get',
            group: 'cap',
            prefix: 'instructores',
            params: {
                iCredId: this._constantesService.iCredId,
            },
        }
        // Servicio para obtener los instructores
        this.GeneralService.getGralPrefixx(params).subscribe((Data) => {
            this.data = (Data as any)['data']
            // console.log('Datos persona:', this.data);
        })
    }
}
