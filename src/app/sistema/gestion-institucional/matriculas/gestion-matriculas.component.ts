import { Component, inject, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'

import { Router } from '@angular/router'
import { FormBuilder, FormGroup } from '@angular/forms'
import { MessageService } from 'primeng/api'
import { GeneralService } from '@/app/servicios/general.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { InputNumberModule } from 'primeng/inputnumber'
import {
    ContainerPageComponent,
    IActionContainer,
} from '@/app/shared/container-page/container-page.component'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { ConstantesService } from '@/app/servicios/constantes.service'

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
    formMatricula: FormGroup
    formEstudiante: FormGroup
    formRepresentante: FormGroup

    activeStep: number = 0 // Paso activo
    totalSteps = 3 // Total de pasos del stepper

    sede: any[]
    iSedeId: number
    iYAcadId: number
    matriculas: any[]
    option: boolean = false

    visible: boolean = false //mostrar dialogo
    caption: string = '' // titulo o cabecera de dialogo
    c_accion: string //valos de las acciones

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
        private fb: FormBuilder,
        private messageService: MessageService,
        private query: GeneralService,
        private store: LocalStoreService,
        private constantesService: ConstantesService
    ) {
        const perfil = this.store.getItem('dremoPerfil')
        console.log(perfil, 'perfil dremo', this.store)
        this.iSedeId = perfil.iSedeId
    }

    get isLastStep(): boolean {
        return this.activeStep === this.totalSteps - 1
    }

    ngOnInit(): void {
        this.iYAcadId = this.store.getItem('dremoiYAcadId')

        this.searchMatriculas()
        this.getNivelGrados()
    }

    accionBtnItemTable({ accion }) {
        if (accion === 'editar') {
            this.c_accion = accion
            this.caption = 'Editar solicitud'
            this.visible = true
        }
        if (accion === 'registrar') {
            this.router.navigate(['/estudiante/registro'])
        }
    }
    accionBtnItem(accion) {
        switch (accion) {
            case 'editar':
                this.updateMatricula()
                this.visible = false
                break
        }
    }

    searchMatriculas() {
        this.query
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

    updateMatricula() {
        if (this.formMatricula.valid) {
            const params = {
                esquema: 'acad',
                tabla: 'matricula',
                json: JSON.stringify({
                    iGradoId: this.formMatricula.value.iGradoId,
                    iTipoMatrId: this.formMatricula.value.iTipoMatrId,
                    iTurnoId: this.formMatricula.value.iTurnoId,
                }),
                campo: 'iMatrId',
                condicion: this.formMatricula.get('iMatrId')?.value,
            }

            console.log(params, 'parametros update')
            this.query.updateAcademico(params).subscribe({
                next: (data: any) => {
                    console.log(data.data)
                },
                error: (error) => {
                    console.log(error, 'error al actualizar')
                },
                complete: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Mensaje',
                        detail: 'Proceso exitoso',
                    })
                },
            })
        } else {
            console.log('Formulario no válido', this.formMatricula.invalid)
        }
    }

    clearForm() {
        this.formEstudiante.reset()
        this.formRepresentante.reset()
        this.formMatricula.reset()
        this.formMatricula.get('iMatrId')?.setValue(0)
        this.formMatricula.get('iEstudianteId')?.setValue(0)
        this.formEstudiante.get('iPersIdEstudiante')?.setValue(0)
        this.formRepresentante.get('iPersIdRepresentante')?.setValue(0)
    }

    getNivelGrados() {
        this.query
            .searchGradoCiclo({
                iNivelTipoId: 3,
            })
            .subscribe({
                next: (data: any) => {
                    const item = data.data
                    this.nivel_grados = item.map((grado) => ({
                        id: grado.iNivelGradoId,
                        nombre:
                            grado.cNivelTipoNombre +
                            ' ' +
                            grado.cGradoAbreviacion +
                            ' (' +
                            grado.cGradoNombre +
                            ')',
                    }))
                    console.log(this.nivel_grados, 'nivel grados')
                },
                error: (error) => {
                    console.error('Error consultando nivel grados:', error)
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

    getSecciones() {
        this.query
            .searchDataEnUrl(
                {
                    iNivelTipoId: 3,
                },
                '/acad/matricula/searchSecciones'
            )
            .subscribe({
                next: (data: any) => {
                    const item = data.data
                    this.nivel_grados = item.map((grado) => ({
                        id: grado.iNivelGradoId,
                        nombre:
                            grado.cNivelTipoNombre +
                            ' ' +
                            grado.cGradoAbreviacion +
                            ' (' +
                            grado.cGradoNombre +
                            ')',
                    }))
                    console.log(this.nivel_grados, 'nivel grados')
                },
                error: (error) => {
                    console.error('Error consultando nivel grados:', error)
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

    //Maquetar tablas
    handleActions(actions) {
        console.log(actions)
    }

    accionesPrincipal: IActionContainer[] = [
        {
            labelTooltip: 'Registrar solicitud',
            text: 'Registrar solicitud',
            icon: 'pi pi-plus',
            accion: 'agregar',
            class: 'p-button-primary',
        },
    ]

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
            field: 'nombreCompleto',
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
            type: 'boolean',
            width: '5rem',
            field: '',
            header: 'Estado',
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
