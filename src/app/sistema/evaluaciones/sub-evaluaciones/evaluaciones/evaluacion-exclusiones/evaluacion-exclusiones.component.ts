import { PrimengModule } from '@/app/primeng.module'
import { Component, inject, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { EvaluacionExclusionesService } from '../../../services/evaluacion-exclusiones.service'
import { MenuItem, MessageService } from 'primeng/api'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { DIRECTOR_IE } from '@/app/servicios/seg/perfiles'
import { TextFieldModule } from '@angular/cdk/text-field'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'

@Component({
    selector: 'app-evaluacion-exclusiones',
    standalone: true,
    imports: [PrimengModule, TextFieldModule, TablePrimengComponent],
    templateUrl: './evaluacion-exclusiones.component.html',
    styleUrl: './evaluacion-exclusiones.component.scss',
})
export class EvaluacionExclusionesComponent implements OnInit {
    @ViewChild('filtro') filtro: any
    cEvaluacionKey: string
    evaluacion: any
    breadCrumbItems: MenuItem[]
    breadCrumbHome: MenuItem
    perfil: any

    formExclusion: FormGroup
    exclusiones: Array<any>
    exclusiones_filtradas: Array<any>

    dialog_header: string
    dialog_visible: boolean

    es_director: boolean = false

    private _messageService = inject(MessageService)

    constructor(
        private exclusionesService: EvaluacionExclusionesService,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private store: LocalStoreService,
        private router: Router
    ) {
        this.perfil = this.store.getItem('dremoPerfil')
        this.es_director = Number(this.perfil.iPerfilId) === Number(DIRECTOR_IE)
        this.route.paramMap.subscribe((params) => {
            this.cEvaluacionKey = params.get('iEvaluacionId')
        })
        this.breadCrumbHome = {
            icon: 'pi pi-home',
            routerLink: '/',
        }
    }

    ngOnInit() {
        try {
            this.formExclusion = this.fb.group({
                iCredEntPerfId: [
                    this.perfil.iCredEntPerfId,
                    Validators.required,
                ],
                iEvaluacionId: [null, Validators.required],
                iEvalExcluId: [null],
                cEvalExcluMotivo: [null],
                dEvalExcluArchivo: [null],
                cEstCodigo: [null],
                cPersNombreApellidos: [null],
                iMatrId: [null],
            })
        } catch (error) {
            console.error('Error al crear el formulario:', error)
        }

        if (this.cEvaluacionKey) {
            this.exclusionesService
                .verEvaluacion(this.cEvaluacionKey)
                .subscribe({
                    next: (data: any) => {
                        if (data.data) {
                            this.evaluacion = data.data
                            if (this.evaluacion) {
                                this.breadCrumbItems = [
                                    {
                                        label: 'Evaluaciones',
                                        routerLink: ['/ere/evaluaciones'],
                                    },
                                    {
                                        label: this.evaluacion
                                            ?.cEvaluacionNombre,
                                    },
                                    {
                                        label: 'Gestionar exclusiones',
                                    },
                                ]
                            }
                        }
                    },
                    error: (error) => {
                        console.error('Error obteniendo evaluación:', error)
                        this._messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: error.error.message,
                        })
                    },
                })
        }
        this.exclusionesService
            .verExclusiones({
                iCredEntPerfId: this.perfil.iCredEntPerfId,
                iEvaluacionId: this.cEvaluacionKey,
            })
            .subscribe({
                next: (data: any) => {
                    this.exclusiones = data.data
                    this.exclusiones_filtradas = this.exclusiones
                },
                error: (error) => {
                    console.error('Error obteniendo exclusiones:', error)
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error.message,
                    })
                },
            })
    }

    agregarExclusion() {
        this.dialog_header = 'Registrar exclusión'
        this.dialog_visible = true
    }

    dialogVisible(visible: boolean) {
        this.dialog_visible = visible
    }

    filtrarExclusiones() {
        this.exclusiones_filtradas = this.exclusiones.filter((ex) => {
            return ex.cExclusionNombre
                .toLowerCase()
                .includes(this.filtro.value.toLowerCase())
        })
    }

    editarExclusion(data: any) {
        this.dialog_header = 'Editar exclusión'
        this.dialog_visible = true
        this.obtenerExclusion(data)
    }

    verExclusion(data: any) {
        this.dialog_header = 'Ver exclusión'
        this.dialog_visible = true
        this.obtenerExclusion(data)
    }

    obtenerExclusion(data: any) {
        this.exclusionesService
            .verExclusion({
                iCredEntPerfId: this.perfil.iCredEntPerfId,
                iEvalExcluId: data.iEvalExcluId,
            })
            .subscribe({
                next: (data: any) => {
                    if (data.data) {
                        this.setFormExclusion(data.data)
                    }
                },
                error: (error) => {
                    console.error('Error obteniendo encuesta:', error)
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error.message,
                    })
                },
            })
    }

    setFormExclusion(data: any) {
        this.formExclusion.patchValue({
            iCredEntPerfId: this.perfil.iCredEntPerfId,
            iEvaluacionId: this.evaluacion.iEvaluacionId,
            cEstCodigo: data.cEstCodigo,
            cEvalExcluMotivo: data.cEvalExcluMotivo,
            dEvalExcluArchivo: data.dEvalExcluArchivo,
            iMatrId: +data.iMatrId,
        })
    }

    guardarExclusion() {
        this.exclusionesService
            .guardarExclusion(this.formExclusion.value)
            .subscribe({
                next: () => {
                    this.salir()
                },
                error: (error) => {
                    console.error('Error obteniendo encuesta:', error)
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error.message,
                    })
                },
            })
    }

    buscarMatricula() {
        console.log('matricula')
    }

    subirArchivo(event: any) {
        console.log(event)
    }

    salir() {
        this.dialogVisible(false)
        this.formExclusion.reset()
        this.formExclusion.patchValue({
            iCredEntPerfId: this.perfil.iCredEntPerfId,
            iEvaluacionId: this.evaluacion.iEvaluacionId,
        })
    }

    columnasTabla: any[] = [
        {
            field: 'item',
            type: 'item',
            width: '5%',
            header: 'N°',
            text_header: 'center',
            text: 'center',
            class: 'hidden md:table-cell',
        },
        {
            field: 'cPersNombreApellidos',
            type: 'text',
            width: '40%',
            header: 'Estudiante',
            text_header: 'left',
            text: 'left',
        },
        {
            field: 'cGradoNombre',
            type: 'text',
            width: '10%',
            header: 'Grado',
            text_header: 'center',
            text: 'center',
        },
        {
            field: 'cSeccionNombre',
            type: 'text',
            width: '10%',
            header: 'Sección',
            text_header: 'center',
            text: 'center',
        },
        {
            field: 'cIieeCodigoModular',
            type: 'text',
            width: '5%',
            header: 'I.E.',
            text_header: 'center',
            text: 'center',
            class: 'hidden md:table-cell',
        },
        {
            field: 'cIieeNombre',
            type: 'text',
            width: '20%',
            header: 'I.E. Nombre',
            text_header: 'center',
            text: 'center',
            class: 'hidden md:table-cell',
        },
        {
            field: '',
            type: 'actions',
            width: '10%',
            header: 'Acciones',
            text_header: 'right',
            text: 'right',
        },
    ]

    accionesTabla: any[] = [
        {
            labelTooltip: 'Ver',
            icon: 'pi pi-eye',
            accion: 'ver',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
        },
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-file-edit',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-success p-button-text',
        },
    ]

    accionBnt(event: { accion: string; item: any }) {
        switch (event.accion) {
            case 'editar':
                this.editarExclusion(event.item)
                break
            case 'ver':
                this.editarExclusion(event.item)
                break
        }
    }
}
