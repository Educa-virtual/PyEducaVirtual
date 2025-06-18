import { Component, inject, OnInit } from '@angular/core'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import {
    IActionTable,
    IColumn,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'
import { MessageService } from 'primeng/api'
import { GeneralService } from '@/app/servicios/general.service'
import { PrimengModule } from '@/app/primeng.module'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
@Component({
    selector: 'app-mantenimiento-ciclo',
    standalone: true,
    imports: [
        ContainerPageComponent,
        TablePrimengComponent,
        ReactiveFormsModule,
        FormsModule,
        PrimengModule,
    ],
    templateUrl: './mantenimiento-ciclo.component.html',
    styleUrl: './mantenimiento-ciclo.component.scss',
})
export class MantenimientoCicloComponent implements OnInit {
    form: FormGroup

    perfil: any
    ciclos: any[] = []
    selectedItems: any

    private _confirmService = inject(ConfirmationModalService)

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        public query: GeneralService,
        private store: LocalStoreService
    ) {}

    ngOnInit(): void {
        this.perfil = this.store.getItem('dremoPerfil')
        //const iNivelTipoId = this.perfil.iNivelTipoId
        console.log(this.perfil)

        // throw new Error('Method not implemented.')
        this.getCiclos()

        try {
            this.form = this.fb.group({
                iCicloId: [{ value: 0 }],
                cCicloNombre: ['', Validators.required],
                cCicloRomanos: ['', Validators.required],
                cCicloAbreviacion: [
                    { value: 0, disabled: true },
                    Validators.required,
                ],
                iEstado: [1, Validators.required],
            })
        } catch (error) {
            this.messageService.add({
                severity: 'danger',
                summary: 'Mensaje del sistema',
                detail: 'Error en el registro de formulario',
            })
            //this.router.navigate(['/gestion-institucional/configGradoSeccion'])
        }
    }

    getCiclos() {
        this.query
            .searchCalAcademico({
                esquema: 'acad',
                tabla: 'ciclos',
                campos: '*',
                condicion: '1=1',
            })
            .subscribe({
                next: (data: any) => {
                    this.ciclos = data.data
                },
                error: (error) => {
                    console.error('Error fetching Tipo documentos:', error)
                    this.messageService.add({
                        severity: 'danger',
                        summary: 'Mensaje',
                        detail: 'Error en ejecución',
                    })
                },
                complete: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Mensaje del sistema',
                        detail: 'Se recepcionó correctamente los datos de Ciclos Academicos',
                    })
                },
            })
    }

    accionBtnItemTable(event) {
        if (event.action === 'agregar') {
            const header = 'Formulario de registro'
            const mensaje = '¿Desea registrar un nuevo ciclo académico?'
            const option = 'registrar'
            const id = 0 // No hay ID para registrar un nuevo ciclo
            this.confirmar(mensaje, header, option, id)
        }
    }

    accion() {}

    registrarCiclo() {}

    editarCiclo(id: number) {
        console.log('editar', id)
    }

    confirmar(mensaje: string, header, option: string, id: number) {
        // const cant = this.selectRowData.length()
        this._confirmService.openConfiSave({
            header: header,
            message: mensaje,
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                switch (option) {
                    case 'registrar':
                        this.registrarCiclo()
                        break
                    case 'editar':
                        this.editarCiclo(id)
                        break
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

    //  accionesPrincipal: IActionContainer[] = [
    //   {
    //       labelTooltip: 'Agregar ciclos académicos',
    //       text: 'Agregar ciclos',
    //       icon: 'pi pi-plus',
    //       accion: 'agregar',
    //       class: 'p-button-primary',
    //   },
    // ]

    //datos de la table
    columns: IColumn[] = [
        {
            type: 'item',
            width: '1rem',
            field: 'item',
            header: 'N°',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cCicloNombre',
            header: 'Descripción',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '3rem',
            field: 'cCicloRomanos',
            header: 'N° Romano',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cCicloAbreviacion',
            header: 'Abreviación',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'estado-activo',
            width: '1rem',
            field: 'iEstado',
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

    actions: IActionTable[] = [
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-pencil',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
    ]
}
