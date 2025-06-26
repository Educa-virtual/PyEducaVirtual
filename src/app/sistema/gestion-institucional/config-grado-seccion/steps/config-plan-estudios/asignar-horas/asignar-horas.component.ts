import { Component, HostListener, inject, OnInit } from '@angular/core'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import {
    TablePrimengComponent,
    IActionTable,
} from '@/app/shared/table-primeng/table-primeng.component'
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms'
import { MessageService } from 'primeng/api'
import { GeneralService } from '@/app/servicios/general.service'
import { PrimengModule } from '@/app/primeng.module'
import { Router } from '@angular/router'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { AdmStepGradoSeccionService } from '@/app/servicios/adm/adm-step-grado-seccion.service'

@Component({
    selector: 'app-asignar-horas',
    standalone: true,
    imports: [
        ContainerPageComponent,
        TablePrimengComponent,
        ReactiveFormsModule,
        FormsModule,
        PrimengModule,
    ],
    templateUrl: './asignar-horas.component.html',
    styleUrl: './asignar-horas.component.scss',
})
export class AsignarHorasComponent implements OnInit {
    grados: any[] = []
    areas_curriculas: any[] = []
    perfil: any[] = []
    configuracion: any[]

    programacion_curricular: any[] = []
    servicio_educativo: any[] = []
    gradosUnicos: any[] = [] // Para almacenar los grados únicos
    mostrar: boolean = false

    formFiltrado: FormGroup
    formNivelGrado: FormGroup

    private _confirmService = inject(ConfirmationModalService)

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private messageService: MessageService,
        public query: GeneralService,
        private stepService: AdmStepGradoSeccionService
    ) {
        this.perfil = this.stepService.perfil
        this.configuracion = this.stepService.configuracion
        this.grados = this.stepService.grados
        //this.secciones_asignadas =// this.stepService.secciones_asignadas
    }

    ngOnInit(): void {
        try {
            this.formNivelGrado = this.fb.group({
                iCursosNivelGradId: [0], // Control para "Grado" (iCursosNivelGradId)
                iIeCursoId: [0], // Control para "Curso" (iIeCursoId)
                cCursoNombre: [{ value: '', disabled: true }], // Control para "Área curricular"
                iHorasSemPresencial: [0, []], // Control para "Horas semanales presenciales"
                iHorasSemDomicilio: [0, []],
                iTotalHoras: [0, []], // Control para "Total de horas semanales"
                // Control para "Descripcion año"
            })
        } catch (error) {
            this.router.navigate(['/gestion-institucional/configGradoSeccion'])
        }

        this.formFiltrado = this.fb.group({
            iGradoId: [0],

            iServEdId: [0], // Control para "Servicio educativo"
        })
        this.getServicioEducativo()

        setInterval(() => {
            this.mostrar = true
        }, 3000) // Cambia a true después de 1 segundo
    }

    @HostListener('window:keydown.control.b', ['$event'])
    onCtrlB(event: KeyboardEvent) {
        event.preventDefault() // Evita acciones predeterminadas del navegador
        console.log('Ctrl + B presionado')
        this.confirm()
    }

    accionBtnItemTable(event: any) {
        console.log(event)
        // Aquí puedes manejar el evento de cambio si es necesario
        // const seccionIdSeleccionada = event.value
    }

    getServicioEducativo() {
        this.query
            .searchAmbienteAcademico({
                json: JSON.stringify({
                    iNivelTipoId: this.configuracion[0].iNivelTipoId,
                }),
                _opcion: 'getServicioEducativo',
            })
            .subscribe({
                next: (data: any) => {
                    this.servicio_educativo = data.data
                    console.log(
                        this.servicio_educativo,
                        'desde getServicioEducativo'
                    ) // Verifica que se obtenga el servicio educativo
                },

                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Mensaje del sistema',
                        detail:
                            'Error en carga de servicio educativo: ' +
                            error.error.message,
                    })
                },
                complete: () => {
                    this.stepService.servicio_educativo =
                        this.servicio_educativo
                    // console.log(this.lista, 'desde getSeccionesAsignadas')
                },
            })
    }

    getCurriculaNivelServicioEducativo() {
        this.query
            .searchAmbienteAcademico({
                json: JSON.stringify({
                    iNivelTipoId: this.configuracion[0].iNivelTipoId,
                    iServEdId: this.formFiltrado.value.iServEdId,
                    iConfigId: this.configuracion[0].iConfigId,
                }),
                _opcion: 'getCurriculaNivelServicioEducativo',
            })
            .subscribe({
                next: (data: any) => {
                    this.programacion_curricular = data.data
                    console.log(data.data)
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Mensaje del sistema',
                        detail: 'Peticion de curricula exitosa ' + data.message,
                    })

                    this.gradosUnicos = data.data.reduce((acc, item) => {
                        // Verifica si ya hay un item con ese iGradoId
                        const existe = acc.some(
                            (obj) => obj.iGradoId === item.iGradoId
                        )

                        // Si no existe, lo agrega
                        if (!existe) {
                            // Contar cuántas veces aparece este iGradoId en el JSON original
                            //const total = data.data.filter(x => x.iGradoId === item.iGradoId).length;
                            acc.push({
                                ...item,
                                mensaje:
                                    <number>item.Total > 0
                                        ? 'Grados registrados: ' + item.Total
                                        : 'Pendiente',
                            })
                        }

                        return acc
                    }, [])
                },

                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Mensaje del sistema',
                        detail:
                            'Error en carga de servicio educativo: ' +
                            error.error.message,
                    })
                },
                complete: () => {
                    this.stepService.programacion_curricular =
                        this.programacion_curricular

                    console.log(
                        this.gradosUnicos,
                        'desde getCurriculaNivelServicioEducativo'
                    ) // Verifica que se obtenga el servicio educativo
                    // console.log(this.lista, 'desde getSeccionesAsignadas')
                },
            })
    }

    // Aquí puedes ejecutar cualquier lógica
    // eventos de record set
    confirm() {
        const filtrarGrado = Number(this.formFiltrado.value.iGradoId)
        const curso = Number(this.formNivelGrado.value.cCursoNombre)

        //validar documento
        if (!filtrarGrado || filtrarGrado < 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Cancelado',
                detail: 'No selecciono grado a filtrar',
            })
            return
        } else {
            const menssage =
                '¿Estás seguro de que deseas Actualizar las horas de ' +
                curso +
                '?'
            this._confirmService.openConfiSave({
                header: 'Advertencia de procesamiento',
                message: menssage,
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    //Validar documento
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Cancelado',
                        detail: 'No selecciono el tipo de documento',
                    })
                },
            })
            return
        }
    }
    /*
      getAreaCurricular(){
        this.query
          .get('configuracion/area-curricular')
          .subscribe((resp: any) => {
            this.areas_curriculas = resp.data
          })
      } */

    selectedItems = []

    actions: IActionTable[] = [
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-pencil',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
        // {
        //     labelTooltip: 'Eliminar',
        //     icon: 'pi pi-trash',
        //     accion: 'eliminar',
        //     type: 'item',
        //     class: 'p-button-rounded p-button-danger p-button-text',
        // },
    ]

    columns = [
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
            field: 'cCursoNombre',
            header: 'Área curricular',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '2rem',
            field: 'iHorasSemPresencial',
            header: 'H Presenciales',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '2rem',
            field: 'iHorasSemDomicilio',
            header: 'H Domiciliarias',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '2rem',
            field: 'cGradoAbreviacion',
            header: 'Grado',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'estado-activo',
            width: '2rem',
            field: 'iEstado',
            header: 'Estado',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'actions',
            width: '2rem',
            field: 'actions',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ]
}
