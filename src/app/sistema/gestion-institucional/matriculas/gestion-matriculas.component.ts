import { Component, inject, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'

import { Router } from '@angular/router'
import { MessageService } from 'primeng/api'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { InputNumberModule } from 'primeng/inputnumber'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { DatosMatriculaService } from '../services/datos-matricula.service'
import { FormBuilder, FormGroup } from '@angular/forms'

@Component({
    selector: 'app-gestion-matriculas',
    standalone: true,
    imports: [
        PrimengModule,
        ContainerPageComponent,
        InputNumberModule,
        TablePrimengComponent,
    ],
    templateUrl: './gestion-matriculas.component.html',
    styleUrl: './gestion-matriculas.component.scss',
})
export class GestionMatriculasComponent implements OnInit {
    form: FormGroup

    sede: any[]
    iSedeId: number
    iYAcadId: number
    matriculas: any[]
    option: boolean = false

    visible: boolean = false //mostrar dialogo
    caption: string = '' // titulo o cabecera de dialogo
    c_accion: string //valos de las acciones

    grados_secciones_turnos: Array<object>
    tipo_documentos: Array<object>
    nivel_grados: Array<object>
    turnos: Array<object>
    secciones: Array<object>
    tipo_matriculas: Array<object>
    estados_civiles: Array<object>
    sexos: Array<object>

    private _MessageService = inject(MessageService) // dialog Mensaje simple
    private _confirmService = inject(ConfirmationModalService) // componente de dialog mensaje

    constructor(
        private router: Router,
        private messageService: MessageService,
        private store: LocalStoreService,
        private constantesService: ConstantesService,
        private datosMatriculaService: DatosMatriculaService,
        private fb: FormBuilder
    ) {
        const perfil = this.store.getItem('dremoPerfil')
        console.log(perfil, 'perfil dremo', this.store)
        this.iSedeId = perfil.iSedeId
    }

    ngOnInit(): void {
        this.iYAcadId = this.store.getItem('dremoiYAcadId')

        try {
            this.form = this.fb.group({
                iNivelGradoId: [null],
                iTurnoId: [null],
                iSeccionId: [null],
                iTipoMatrId: [null],
            })
        } catch (error) {
            console.log(error, 'error de formulario')
        }
        this.searchMatriculas()
        this.searchGradoSeccionTurno()

        this.form.get('iNivelGradoId').valueChanges.subscribe((value) => {
            this.filterTurnos(value)
        })
        this.form.get('iTurnoId').valueChanges.subscribe((value) => {
            this.filterSecciones(value)
        })
    }

    accionBtnItemTable({ accion }) {
        if (accion === 'editar') {
            // TODO : Editar matricula
        }
        if (accion === 'anular') {
            // TODO: Anular matricula
        }
    }
    accionBtnItem(accion) {
        switch (accion) {
            case 'agregar':
                this.router.navigate([
                    '/gestion-institucional/matricula-individual',
                ])
                break
        }
    }

    searchMatriculas() {
        this.datosMatriculaService
            .searchMatriculas({
                iSedeId: this.iSedeId,
                iYAcadId: this.iYAcadId,
                iCredSesionId: this.constantesService.iCredId,
            })
            .subscribe({
                next: (data: any) => {
                    this.matriculas = data.data
                    console.log(this.matriculas, 'matriculas')
                },
                error: (error) => {
                    console.error('Error al obtener matriculas:', error)
                },
                complete: () => {},
            })
    }

    searchGradoSeccionTurno() {
        this.datosMatriculaService
            .searchGradoSeccionTurno({
                opcion: 'TODO',
                iSedeId: this.iSedeId,
                iYAcadId: this.iYAcadId,
                iCredSesionId: this.constantesService.iCredId,
            })
            .subscribe({
                next: (data: any) => {
                    console.log(data.data)
                    this.grados_secciones_turnos = data.data
                    this.filterGrados()
                },
                error: (error) => {
                    console.error('Error consultando nivel grados:', error)
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    filterGrados() {
        this.nivel_grados = this.grados_secciones_turnos.reduce(
            (prev: any, current: any) => {
                const x = prev.find(
                    (item) =>
                        item.id === current.iNivelGradoId &&
                        item.nombre === current.cGradoNombre
                )
                if (!x) {
                    return prev.concat([
                        {
                            id: current.iNivelGradoId,
                            nombre: current.cGradoNombre,
                        },
                    ])
                } else {
                    return prev
                }
            },
            []
        )
        console.log(this.nivel_grados, 'nivel grados')
    }

    filterTurnos(iNivelGradoId: any) {
        this.turnos = this.grados_secciones_turnos.reduce(
            (prev: any, current: any) => {
                const x = prev.find(
                    (item) =>
                        item.id === current.iTurnoId &&
                        item.nombre === current.cTurnoNombre
                )
                if (!x && current.iNivelGradoId === iNivelGradoId) {
                    return prev.concat([
                        {
                            id: current.iTurnoId,
                            nombre: current.cTurnoNombre,
                        },
                    ])
                } else {
                    return prev
                }
            },
            []
        )
        console.log(this.turnos, 'turnos')
    }

    filterSecciones(iNivelGradoId: any) {
        this.secciones = this.grados_secciones_turnos.reduce(
            (prev: any, current: any) => {
                const x = prev.find(
                    (item) =>
                        item.id === current.iSeccionId &&
                        item.nombre === current.cSeccionNombre
                )
                if (!x && current.iNivelGradoId === iNivelGradoId) {
                    return prev.concat([
                        {
                            id: current.iSeccionId,
                            nombre: current.cSeccionNombre,
                        },
                    ])
                } else {
                    return prev
                }
            },
            []
        )
        console.log(this.secciones, 'secciones')
    }

    //Maquetar tablas
    handleActions(actions) {
        console.log(actions)
    }

    agregarMatricula() {
        this.router.navigate(['/gestion-institucional/matricula-individual'])
    }

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
            labelTooltip: 'Registrar en esta sección',
            icon: 'pi pi-plus',
            accion: 'registrar',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
        },
    ]

    actionsLista: IActionTable[]

    columns = [
        {
            type: 'item',
            width: '1rem',
            field: 'item',
            header: '',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '10rem',
            field: '_cPersNomape',
            header: 'Estudiante',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cGradoAbreviacion',
            header: 'Grado',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cSeccionNombre',
            header: 'Seccion',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '6rem',
            field: 'cTurnoNombre',
            header: 'Turno',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cTipoMatrNombre',
            header: 'Tipo',
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
}
