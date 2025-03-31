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
    selector: 'app-usuario-perfil',
    standalone: true,
    imports: [PrimengModule, TablePrimengComponent, ContainerPageComponent],
    templateUrl: './usuario-perfil.component.html',
    styleUrl: './usuario-perfil.component.scss',
})
export class UsuarioPerfilComponent implements OnChanges, OnInit {
    // @Input() option: string // opcion segun el modulo Director, Especialista DREMO, especialista UGEL
    @Input() usuario: any // Usuario seleccionado

    form_perfil: FormGroup

    //variables
    search_perfiles: any = [] //lista de perfiles

    lista_Entidad: any[] = []
    lista_ugel: any[] = []
    lista_modulos: any[] = []
    lista_iIE: any[] = []
    lista_sedes: any[] = []
    option: any[] = [
        {
            label: 'DREMO',
            value: '1',
        },
        { label: 'UGEL', value: '2' },
        { label: 'INSTITUCIONES EDUCATIVAS', value: 3 },
    ]

    lista_curso_grado: any[] = []

    perfil_usuario: any
    iEntidadId: number = 0
    iOptionId: number = 0
    iPerfilId: number = 0
    iUgelId: number = 0
    iDremoId: number = 0
    iIieeId: number = 0
    iSedeId: number = 0 // id de isntitucion educativa
    iIeId: number = 0 // id de isntitucion educativa

    selectedItemsPerfil = [] //Seleccion de usuario (perfil)

    private _confirmService = inject(ConfirmationModalService)
    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private query: GeneralService
    ) {}
    ngOnInit() {
        this.form_perfil = this.fb.group({
            iEntId: ['', [Validators.required]],
            iOption: ['', [Validators.required]],
            iDremoId: [''],
            iUgelId: [''],
            iIieeId: [''],

            iSedeId: [''],
            iCursosNivelGradId: [''],

            iPerfilId: ['', [Validators.required]],
        })
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['usuario'] && changes['usuario'].currentValue) {
            this.getPerfilUsuario(this.usuario)
            this.getInstituciones()
        }
    }
    getInstituciones() {
        this.query
            .searchCalAcademico({
                esquema: 'grl',
                tabla: 'entidades',
                campos: ' iEntId, cEntNombreCorto, cEntNombreLargo,iEntEstado',
                condicion: 'iEntEstado=1',
            })
            .subscribe({
                next: (data: any) => {
                    this.lista_Entidad = data.data
                    // const item = data.data
                    // this.lista_Entidad = item.map((entidad) => ({
                    //     ...entidad,
                    //     nombre_completo: (
                    //         entidad.cPersPaterno +
                    //         ' ' +
                    //         entidad.cPersMaterno +
                    //         ' ' +
                    //         entidad.cPersNombre
                    //     ).trim(),
                    // }))
                },
                error: (error) => {
                    console.error('Error fetching Años Académicos:', error)
                    this.messageService.add({
                        severity: 'danger',
                        summary: 'Mensaje',
                        detail: error,
                    })
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
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
                    //this.asignar_perfil()
                    switch (this.iOptionId) {
                        case 1: //DREMO
                            const tipo =
                                this.iDremoId == 1012
                                    ? 'EspecialistaDre'
                                    : 'PerfilModuloDre'
                            this.asignar_pefil_dremo(tipo)
                            this.iDremoId
                            break
                        case 2: //UGEL
                            this.asignar_perfil_ugel()
                            break
                        case 3: //IE
                            this.asignar_perfil_ie()
                            break
                    }

                    //console.log('perfil', this.form_perfil.value.iPerfilId)
                }
                if (accion === 'entidad') {
                    // seleciona entidad
                    // elimina todos los perfiles del usuario seleccionado
                    this.iEntidadId = this.form_perfil.value.iEntId
                }
                if (accion === 'option') {
                    // seleciona entidad
                    // elimina todos los perfiles del usuario seleccionado
                    this.iOptionId = Number(this.form_perfil.value.iOption)

                    this.iDremoId = 0
                    this.iUgelId = 0
                    this.iIieeId = 0
                    this.iSedeId = 0
                    this.form_perfil.value.iDremoId = 0
                    this.form_perfil.value.iUgelId = 0
                    this.form_perfil.value.iIieeId = 0
                    this.form_perfil.value.iSedeId = 0
                    this.form_perfil.value.iCursosNivelGradId = 0
                    this.form_perfil.value.iPerfilId = 0
                    this.search_perfiles = []

                    switch (this.iOptionId) {
                        case 1:
                            // this.condicion = 'iDremoId'
                            this.getModulosAdministrativos()
                            this.iDremoId = this.form_perfil.value.iDremoId
                            break
                        case 2:
                            this.getUgeles()
                            this.iUgelId = this.form_perfil.value.iUgelId
                            break
                        case 3:
                            this.getInstitucionesEducativas()
                            this.iIieeId = this.form_perfil.value.iIieeId
                            break
                    }
                }
                if (accion === 'ie') {
                    this.iIieeId = this.form_perfil.value.iIieeId
                    this.getSedeEducativas(this.iIieeId)
                }

                if (accion === 'sede') {
                    // agrega perfil seleccionado

                    this.iSedeId = this.form_perfil.value.iSedeId
                    const condicion_sede = `iTipoPerfilId in (4,7,8)`
                    this.getPerfilOpcion(condicion_sede)
                }
                if (accion === 'ugel') {
                    // agrega perfil seleccionado
                    this.iUgelId = this.form_perfil.value.iUgelId
                    this.getCursosNivelGrado()
                }

                if (accion === 'CursosNivelGrado') {
                    ///this.iIieeId = this.form_perfil.value.iIieeId
                    const condicion_ugel = `iTipoPerfilId in (5)`
                    this.getPerfilOpcion(condicion_ugel)
                }
                if (accion === 'CursosNivelGradoDRE') {
                    ///this.iIieeId = this.form_perfil.value.iIieeId
                    const condicion_dremo = `iTipoPerfilId in (6)`
                    this.getPerfilOpcion(condicion_dremo)
                }

                if (accion === 'dremo') {
                    this.iDremoId = Number(this.form_perfil.value.iDremoId)

                    if (this.iDremoId == 1012) {
                        // id de modulo especialista DREMO

                        this.getCursosNivelGrado()
                    } else {
                        const condicion_dremo = `iTipoPerfilId in (1,2)`
                        this.getPerfilOpcion(condicion_dremo)
                    }
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

    getModulosAdministrativos() {
        this.query
            .searchCalAcademico({
                esquema: 'seg',
                tabla: 'modulos',
                campos: ' iModuloId, cModuloNombre, iModuloOrden,iModuloEstado,iPerfilId',
                condicion:
                    'iModuloId=1012 and iModuloEstado=1 or iModuloId<10 and iModuloEstado=1',
            })
            .subscribe({
                next: (data: any) => {
                    this.lista_modulos = data.data
                },
                error: (error) => {
                    console.error(
                        'Error lista de módulos Administrativos:',
                        error
                    )
                    this.messageService.add({
                        severity: 'danger',
                        summary: 'Mensaje',
                        detail: error,
                    })
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }
    getInstitucionesEducativas() {
        this.query
            .searchCalAcademico({
                esquema: 'acad',
                tabla: 'institucion_educativas',
                campos: 'iIieeId, cIieeCodigoModular, cIieeNombre, cIieeRslCreacion, cIieeDireccion, cIieeLogo, iEstado, iNivelTipoId',
                condicion: 'iEstado=1',
            })
            .subscribe({
                next: (data: any) => {
                    const item = data.data
                    this.lista_iIE = item.map((ie) => ({
                        ...ie,
                        nombre_completo: (
                            ie.cIieeCodigoModular +
                            ' ' +
                            ie.cIieeNombre +
                            '-' +
                            (ie.iNivelTipoId == 3 ? 'PRIMARIA' : 'SECUNDARIA')
                        ).trim(),
                    }))
                },
                error: (error) => {
                    console.error('Error lista de I.E.:', error)
                    this.messageService.add({
                        severity: 'danger',
                        summary: 'Mensaje',
                        detail: error,
                    })
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    getUgeles() {
        this.query
            .searchCalAcademico({
                esquema: 'acad',
                tabla: 'ugeles',
                campos: 'iUgelId, cUgelNombre, cUgelSigla',
                condicion: '1=1',
            })
            .subscribe({
                next: (data: any) => {
                    this.lista_ugel = data.data
                },
                error: (error) => {
                    console.error('Error fetching Años Académicos:', error)
                    this.messageService.add({
                        severity: 'danger',
                        summary: 'Mensaje',
                        detail: error,
                    })
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    getSedeEducativas(id: number) {
        this.query
            .searchCalAcademico({
                esquema: 'acad',
                tabla: 'sedes',
                campos: 'iSedeId, iIieeId, cSedeNombre, iEstado',
                condicion: 'iIieeId= ' + id,
            })
            .subscribe({
                next: (data: any) => {
                    this.lista_sedes = data.data
                },
                error: (error) => {
                    console.error('Error lista de Sedes:', error)
                    this.messageService.add({
                        severity: 'danger',
                        summary: 'Mensaje de error de Sedes',
                        detail: error,
                    })
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }
    // lista de cursos
    getCursosNivelGrado() {
        // obtiene los perfiles de los usuarios
        this.query
            .searchCalendario({
                json: JSON.stringify({
                    id: this.usuario.iPersId,
                }),
                _opcion: 'getCursoNivelGrado',
            })
            .subscribe({
                next: (data: any) => {
                    this.lista_curso_grado = data.data
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

    //peticion de prefiles de usuario
    getPerfilUsuario(usuario: any) {
        this.query
            .searchCalendario({
                json: JSON.stringify({
                    id: usuario.iPersId,
                }),
                _opcion: 'getPerfilesUsuario',
            })
            .subscribe({
                next: (data: any) => {
                    this.perfil_usuario = data.data
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

    getPerfilOpcion(condicion: string) {
        this.query
            .searchCalAcademico({
                esquema: 'seg',
                tabla: 'perfiles',
                campos: 'iPerfilId, cPerfilNombre,iPerfilOrden',
                condicion: condicion,
            })
            .subscribe({
                next: (data: any) => {
                    this.search_perfiles = data.data
                },
                error: (error) => {
                    console.error('Error lista de perfiles:', error)
                    this.messageService.add({
                        severity: 'danger',
                        summary: 'Mensaje de error de Sedes',
                        detail: error,
                    })
                },
                complete: () => {
                    console.log('Request completed')
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

    asignar_perfil_ie() {
        this.query
            .addCalAcademico({
                json: JSON.stringify({
                    iSedeId: this.form_perfil.value.iSedeId,
                    iPersId: this.usuario.iPersId,
                    iEntId: this.form_perfil.value.iEntId,
                    iPerfilId: this.form_perfil.value.iPerfilId,
                }),
                _opcion: 'addPerfilSede',
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

    asignar_pefil_dremo(tipo: string) {
        this.query
            .addCalAcademico({
                json: JSON.stringify({
                    iEntId: this.form_perfil.value.iEntId,
                    iPerfilId: this.form_perfil.value.iPerfilId,
                    iPersId: this.usuario.iPersId,
                    iCursosNivelGradId:
                        this.form_perfil.value.iCursosNivelGradId,
                    cTipo: tipo,
                }),
                _opcion: 'addPerfilDremo',
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

    asignar_perfil_ugel() {
        this.query
            .addCalAcademico({
                json: JSON.stringify({
                    iUgelId: this.form_perfil.value.iUgelId,
                    iEntId: this.form_perfil.value.iEntId,
                    iPerfilId: this.form_perfil.value.iPerfilId,
                    iPersId: this.usuario.iPersId,
                    iCursosNivelGradId:
                        this.form_perfil.value.iCursosNivelGradId,
                }),
                _opcion: 'addPerfilUgel',
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
            field: 'nom_perffil',
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
