import { IconComponent } from '@/app/shared/icon/icon.component'
import { IColumn } from '@/app/shared/table-primeng/table-primeng.component'
import { ILeyendaItem } from '@/app/sistema/aula-virtual/sub-modulos/actividades/components/leyenda-tareas/leyenda-item/leyenda-item.component'
import { Component, inject, Input, OnChanges, OnInit } from '@angular/core'
import { provideIcons } from '@ng-icons/core'
import { matListAlt, matPeople } from '@ng-icons/material-icons/baseline'
import { DialogService } from 'primeng/dynamicdialog'
import { CalificarTareaFormComponent } from '../calificar-tarea-form/calificar-tarea-form.component'
import { MODAL_CONFIG } from '@/app/shared/constants/modal.config'
import { PrimengModule } from '@/app/primeng.module'
import { FileUploadPrimengComponent } from '../../../../../../shared/file-upload-primeng/file-upload-primeng.component'
import { FormGrupoComponent } from '../form-grupo/form-grupo.component'
import { GeneralService } from '@/app/servicios/general.service'
import { environment } from '@/environments/environment.template'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { FormTransferirGrupoComponent } from '../form-transferir-grupo/form-transferir-grupo.component'
import { FormBuilder, FormGroup } from '@angular/forms'
import { ApiAulaService } from '@/app/sistema/aula-virtual/services/api-aula.service'
import { ConfirmationService, MessageService } from 'primeng/api'

@Component({
    selector: 'app-tarea-room',
    standalone: true,
    imports: [
        IconComponent,
        PrimengModule,
        FileUploadPrimengComponent,
        FormGrupoComponent,
        FormTransferirGrupoComponent,
    ],

    templateUrl: './tarea-room.component.html',
    styleUrl: './tarea-room.component.scss',
    providers: [provideIcons({ matListAlt, matPeople }), DialogService],
})
export class TareaRoomComponent implements OnChanges, OnInit {
    @Input() iTareaId: string
    private _dialogService = inject(DialogService)
    private GeneralService = inject(GeneralService)
    private _constantesService = inject(ConstantesService)
    private _confirmService = inject(ConfirmationModalService)
    private _formBuilder = inject(FormBuilder)
    private _aulaService = inject(ApiAulaService)
    private confirmationService = inject(ConfirmationService)

    students: any

    iPerfilId: number
    constructor(private messageService: MessageService) {}
    public entregarEstud: FormGroup = this._formBuilder.group({
        cTareaEstudianteUrlEstudiante: [''],
        //iEstudianteId: [],
        iEstudianteId: [1],
    })

    ngOnInit() {
        this.iPerfilId = this._constantesService.iPerfilId
        if (Number(this.iPerfilId) == 8) {
            this.obtenerTareaxiTareaidxiEstudianteId()
        } else {
            this.obtenerEscalaCalificaciones()
        }
    }
    ngOnChanges(changes) {
        if (changes.iTareaId?.currentValue) {
            this.iTareaId = changes.iTareaId.currentValue
            this.getTareasxiTareaid()
        }
    }
    showModal: boolean = false
    estudiantes = []
    grupos = []
    public leyendaTareas: ILeyendaItem[] = [
        {
            color: 'bg-red-100',
            total: 3,
            nombre: 'Faltan',
        },
        {
            color: 'bg-yellow-100',
            total: 20,
            nombre: 'En Proceso',
        },
        {
            color: 'bg-green-100',
            total: 3,
            nombre: 'Enviados',
        },
    ]
    columnas: IColumn[] = [
        {
            field: 'id',
            header: '#',
            text: 'actividad',
            text_header: 'left',
            width: '3rem',
            type: 'text',
        },
        {
            field: 'nombre',
            header: 'Estudiantes',
            text: 'actividad',
            text_header: 'left',
            width: '5rem',
            type: 'text',
        },

        {
            field: 'cActividad',
            header: 'Estado',
            text: 'Estado',
            text_header: 'left',
            width: '5rem',
            type: 'text',
        },

        {
            field: 'cActividad',
            header: 'Nota',
            text: 'actividad',
            text_header: 'left',
            width: '5rem',
            type: 'text',
        },

        {
            field: '',
            header: 'Acciones',
            text: '',
            text_header: 'left',
            width: '5rem',
            type: 'actions',
        },
    ]
    data
    grupoSeleccionado
    iTareaEstudianteId
    cTareaTitulo: string
    cTareaDescripcion: string
    tareaAsignar: number
    FilesTareas = []
    tareaOptions = [
        { name: 'Individual', value: 0 },
        { name: 'Grupal', value: 1 },
    ]
    escalaCalificaciones = []
    iEscalaCalifId
    cTareaEstudianteComentarioDocente
    getInformation(params, condition) {
        this.GeneralService.getGralPrefix(params).subscribe({
            next: (response) => {
                this.accionBtnItem({ accion: condition, item: response.data })
            },
            complete: () => {},
            error: (error) => {
                console.log(error)
            },
        })
    }

    estadoCheckbox: boolean = false

    changeEstadoCheckbox() {
        this.estadoCheckbox = !this.estadoCheckbox
        //this.estudiantes.map((i) => (i.iCheckbox = this.estadoCheckbox))
    }

    documentos = [
        {
            iDocumentoId: '1',
            url: '',
            cDocumento: 'Proyecto Virtual',
        },
    ]
    public acciones = [
        {
            labelTooltip: 'Agregar',
            icon: 'pi pi-plus',
            accion: 'calificar',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
        },
    ]
    tareasFalta: number = 0
    tareasCulminado: number = 0
    gruposFalta: number = 0
    gruposCulminado: number = 0
    FilesTareasEstudiantes = []
    iEstadoEstudianteTarea: string = ''
    notaTareaEstudiante: string = ''
    comentarioTareaEstudiante: string = ''

    iEstadoEstudianteTareaGrupal: string = ''
    notaTareaEstudianteGrupal: string = ''
    comentarioTareaEstudianteGrupal: string = ''
    FilesTareasEstudiantesGrupal = []
    public accionBtnItem(elemento) {
        const { accion } = elemento
        const { item } = elemento
        let falta
        let culminado
        switch (accion) {
            case 'calificar':
                this._dialogService.open(CalificarTareaFormComponent, {
                    ...MODAL_CONFIG,
                    header: 'Calificar Actividad',
                })
                break
            case 'close-modal':
                this.showModal = false
                break
            case 'get-tarea-estudiantes':
                this.estudiantes = item
                falta = this.estudiantes.filter((i) => i.cEstado === '0')
                culminado = this.estudiantes.filter((i) => i.cEstado === '1')

                this.tareasFalta = falta.length
                this.tareasCulminado = culminado.length

                break
            case 'update-tareas':
                !this.tareaAsignar
                    ? this.getTareaEstudiantes()
                    : this.getTareaCabeceraGrupos()

                break
            case 'get-tarea-cabecera-grupos':
                this.grupos = item
                this.grupos.forEach((i) => {
                    i.json_estudiantes = i.json_estudiantes
                        ? JSON.parse(i.json_estudiantes)
                        : []
                })

                this.grupos.forEach((i) => {
                    i.json_estudiantes_asignado = i.json_estudiantes.filter(
                        (j) => j.bAsignado === 1
                    )
                })

                falta = this.grupos.filter((i) => i.cEstado === '0')
                culminado = this.grupos.filter((i) => i.cEstado === '1')

                this.tareasFalta = falta.length
                this.tareasCulminado = culminado.length
                break
            case 'save-tarea-cabecera-grupos':
                this.showModal = false
                !this.tareaAsignar
                    ? this.getTareaEstudiantes()
                    : this.getTareaCabeceraGrupos()
                break
            case 'get-tareas':
                this.data = item.length ? item[0] : []
                this.cTareaTitulo = this.data?.cTareaTitulo
                this.cTareaDescripcion = this.data?.cTareaDescripcion
                this.FilesTareas = this.data?.cTareaArchivoAdjunto
                    ? JSON.parse(this.data?.cTareaArchivoAdjunto)
                    : []
                this.tareaAsignar = Number(this.data?.bTareaEsGrupal)
                this.tareaAsignar !== null
                    ? this.accionBtnItem({
                          accion: 'save-tarea-cabecera-grupos',
                          item: [],
                      })
                    : null

                break
            case 'get-escala-calificaciones':
                this.escalaCalificaciones = item
                break
            case 'guardar-calificacion-docente':
                this.iEscalaCalifId = null
                this.estudianteSeleccionado = null
                this.getTareaEstudiantes()
                break
            case 'eliminar-tarea-cabecera-grupos':
                this.grupoSeleccionadoCalificar = []
                this.getTareaCabeceraGrupos()
                break
            case 'guardar-calificacion-tarea-cabecera-grupos-docente':
                this.iEscalaCalifId = null
                this.grupoSeleccionadoCalificar = []
                this.getTareaCabeceraGrupos()
                break
            case 'close-modal-transferir':
                this.showModalTransferir = false
                break
            case 'save-modal-transferir':
                this.showModalTransferir = false
                this.getTareaCabeceraGrupos()
                break
            case 'subir-archivo-tareas-estudiantes':
                this.FilesTareasEstudiantes.push({
                    type: 1, //1->file
                    nameType: 'file',
                    name: item.file.name,
                    size: item.file.size,
                    ruta: item.name,
                })
                break
            case 'subir-archivo-tarea-cabecera-grupos':
                this.FilesTareasEstudiantesGrupal.push({
                    type: 1, //1->file
                    nameType: 'file',
                    name: item.file.name,
                    size: item.file.size,
                    ruta: item.name,
                })
                break
            case 'obtenerTareaxiTareaidxiEstudianteId':
                const data = item.length ? item[0] : []
                this.FilesTareasEstudiantes = data.cTareaEstudianteUrlEstudiante
                    ? JSON.parse(data.cTareaEstudianteUrlEstudiante)
                    : []
                this.iEstadoEstudianteTarea = data.cEstadoIndividual
                this.iEstadoEstudianteTareaGrupal = data.cEstadoGrupal
                this.notaTareaEstudiante = data.cEscalaCalifNombre
                this.comentarioTareaEstudiante =
                    data.cTareaEstudianteComentarioDocente

                this.notaTareaEstudianteGrupal = data.cEscalaCalifNombre
                this.comentarioTareaEstudianteGrupal =
                    data.cTareaGrupoComentarioDocente
                this.FilesTareasEstudiantesGrupal = data.cTareaGrupoUrl
                    ? JSON.parse(data.cTareaGrupoUrl)
                    : []
                break
            case 'eliminar-tareas-estudiantes':
                this.getTareaCabeceraGrupos()
                break
            case 'entregar-estudiante-tarea':
            case 'entregar-estudiante-tarea-grupal':
                this.obtenerTareaxiTareaidxiEstudianteId()
                break
            default:
                break
        }
    }

    estudianteSeleccionado
    cTareaEstudianteUrlEstudiante
    getTareaRealizada(item) {
        this.estudianteSeleccionado = item
        this.cTareaEstudianteUrlEstudiante = item.cTareaEstudianteUrlEstudiante
            ? JSON.parse(item.cTareaEstudianteUrlEstudiante)
            : []
        this.iTareaEstudianteId = item.iTareaEstudianteId
        this.iEscalaCalifId = item.iEscalaCalifId
        this.cTareaEstudianteComentarioDocente =
            item.cTareaEstudianteComentarioDocente
    }

    updateTareas() {
        this.estudianteSeleccionado = null
        const params = {
            petition: 'post',
            group: 'aula-virtual',
            prefix: 'tareas',
            ruta: 'updatexiTareaId',
            data: {
                opcion: 'ACTUALIZARxiTareaId',
                iTareaId: this.iTareaId,
                bTareaEsGrupal: this.tareaAsignar ? true : false,
            },
            params: { skipSuccessMessage: true },
        }
        this.getInformation(params, 'update-tareas')
    }

    getTareaEstudiantes() {
        const params = {
            petition: 'post',
            group: 'aula-virtual',
            prefix: 'tarea-estudiantes',
            ruta: 'list',
            data: {
                opcion: 'CONSULTAR-ASIGNACIONxiTareaId',
                iTareaId: this.iTareaId,
            },
            params: { skipSuccessMessage: true },
        }
        this.getInformation(params, 'get-' + params.prefix)
    }

    getTareaCabeceraGrupos() {
        const params = {
            petition: 'post',
            group: 'aula-virtual',
            prefix: 'tarea-cabecera-grupos',
            ruta: 'list',
            data: {
                opcion: 'CONSULTAR-ASIGNACIONxiTareaId',
                iTareaId: this.iTareaId,
            },
            params: { skipSuccessMessage: true },
        }
        this.getInformation(params, 'get-' + params.prefix)
    }

    getTareasxiTareaid() {
        const params = {
            petition: 'post',
            group: 'aula-virtual',
            prefix: 'tareas',
            ruta: 'list',
            data: {
                opcion: 'CONSULTARxiTareaId',
                iTareaId: this.iTareaId,
            },
            params: { skipSuccessMessage: true },
        }
        this.getInformation(params, 'get-' + params.prefix)
    }

    obtenerEscalaCalificaciones() {
        const params = {
            petition: 'post',
            group: 'evaluaciones',
            prefix: 'escala-calificaciones',
            ruta: 'list',
            data: {
                opcion: 'CONSULTAR',
            },
            params: { skipSuccessMessage: true },
        }
        this.getInformation(params, 'get-' + params.prefix)
    }
    guardarTareaEstudiantesxDocente() {
        if (!this.iEscalaCalifId) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Campo vacio',
                detail: 'Seleccione una calaficación',
            })
            return
        }
        // Verifica que los datos requeridos estén completos antes de continuar
        if (this.iTareaEstudianteId && this.iEscalaCalifId) {
            const params = {
                petition: 'post',
                group: 'aula-virtual',
                prefix: 'tarea-estudiantes',
                ruta: 'guardar-calificacion-docente',
                data: {
                    opcion: 'GUARDAR-CALIFICACION-DOCENTE',
                    iTareaEstudianteId: this.iTareaEstudianteId,
                    iEscalaCalifId: this.iEscalaCalifId,
                    cTareaEstudianteComentarioDocente:
                        this.cTareaEstudianteComentarioDocente,
                    nTareaEstudianteNota: 0,
                },
            }
            this.getInformation(params, 'guardar-calificacion-docente')
        }
    }

    goLinkDocumento(ruta: string) {
        const backend = environment.backend
        window.open(backend + '/' + ruta, '_blank')
    }
    buscarEstudiante() {
        const params = {
            petition: 'get',
            group: 'aula-virtual',
            prefix: 'tareas',
            ruta: 'list',
            data: {
                opcion: 'CONSULTARxiTareaId',
                iTareaId: this.iTareaId,
            },
            params: { skipSuccessMessage: true },
        }
        this.getInformation(params, 'get-' + params.prefix)
    }
    eliminarTareaCabeceraGrupos(item) {
        this._confirmService.openConfirm({
            header:
                '¿Esta seguro de eliminar el grupo ' +
                item.cTareaGrupoNombre +
                ' ?',
            accept: () => {
                const params = {
                    petition: 'post',
                    group: 'aula-virtual',
                    prefix: 'tarea-cabecera-grupos',
                    ruta: 'eliminarTareaCabeceraGrupos',
                    data: item,
                    params: { skipSuccessMessage: true },
                }
                this.getInformation(params, 'eliminar-' + params.prefix)
            },
        })
    }
    iTareaCabGrupoId
    cTareaGrupoUrl
    cTareaGrupoComentarioDocente
    grupoSeleccionadoCalificar = []
    nTareaGrupoNota

    seleccionarGrupo(item) {
        console.log(item)
        this.grupoSeleccionadoCalificar = []
        this.grupoSeleccionadoCalificar.push(item)
        this.iTareaCabGrupoId = item.iTareaCabGrupoId
        this.cTareaGrupoUrl = item.cTareaGrupoUrl
            ? JSON.parse(item.cTareaGrupoUrl)
            : []
        this.iEscalaCalifId = item.iEscalaCalifId
        this.cTareaGrupoComentarioDocente = item.cTareaGrupoComentarioDocente
    }

    guardarTareaCabeceraGruposxDocente() {
        if (!this.iEscalaCalifId) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Campo vacio',
                detail: 'Seleccione una calaficación',
            })
            return
        }

        const params = {
            petition: 'post',
            group: 'aula-virtual',
            prefix: 'tarea-cabecera-grupos',
            ruta: 'guardarCalificacionTareaCabeceraGruposDocente',
            data: {
                opcion: 'GUARDAR-CALIFICACION-DOCENTE',
                iTareaCabGrupoId: this.iTareaCabGrupoId,
                iEscalaCalifId: this.iEscalaCalifId,
                cTareaGrupoComentarioDocente: this.cTareaGrupoComentarioDocente,
                nTareaGrupoNota: 0,
            },
        }
        this.getInformation(
            params,
            'guardar-calificacion-tarea-cabecera-grupos-docente'
        )
    }
    grupoTransferir
    showModalTransferir: boolean = false
    iTareaEstudianteIdGrupo
    iEstudianteIdGrupo
    transferirEstudiante(item) {
        this.iTareaEstudianteIdGrupo = item.iTareaEstudianteId
        this.iEstudianteIdGrupo = item.iEstudianteId
        this.grupos.forEach((i) => {
            i.json_estudiantes_respaldo.filter((j) => {
                if (j.iEstudianteId == item.iEstudianteId) {
                    const iTareaCabGrupoId = i.iTareaCabGrupoId

                    this.grupoTransferir = this.grupos.filter(
                        (k) => k.iTareaCabGrupoId !== iTareaCabGrupoId
                    )
                }
            })
        })
        this.showModalTransferir = true
        // console.log(this.grupoTransferir)
    }

    eliminarEstudiante(item) {
        this.confirmationService.confirm({
            message:
                'Deseas eliminar del grupo al estudiante ' +
                item.cPersNombre +
                ' ?',
            header: 'Eliminar Bibliografía',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: 'p-button-danger p-button-text',
            rejectButtonStyleClass: 'p-button-text p-button-text',
            acceptIcon: 'none',
            rejectIcon: 'none',
            acceptLabel: 'Si',
            rejectLabel: 'No',

            accept: () => {
                const params = {
                    petition: 'post',
                    group: 'aula-virtual',
                    prefix: 'tarea-estudiantes',
                    ruta: 'eliminarEstudianteTarea',
                    data: {
                        opcion: 'ACTUALIZARxiTareaEstudianteIdxiEstudianteId-iTareaCabGrupoId',
                        iTareaEstudianteId: item.iTareaEstudianteId,
                        iEstudianteId: item.iEstudianteId,
                    },
                }
                this.getInformation(params, 'eliminar-tareas-estudiantes')
                //this.messageService.add({ severity: 'info', summary: 'Confirmado', detail: 'Eliminando Metodología' });
            },
            reject: () => {
                //this.messageService.add({ severity: 'error', summary: '', detail: 'You have rejected' });
            },
        })
    }

    entregartaraeaestudiante() {
        const comment = this.entregarEstud.value
        comment.iTareaId = this.iTareaId
        console.log('Enviar Tarea', comment)
        this._aulaService.guardarRespuesta(comment).subscribe(
            (response) => {
                console.log('Comentario Guardado:', response)

                this.entregarEstud.get('cForoRptaRespuesta')?.reset()
            },
            (error) => {
                console.error('Comentario:', error)
            }
        )
        //console.log(this.grupoTransferir)
    }
    entregarEstudianteTarea() {
        if (!this.FilesTareasEstudiantes.length) return
        const params = {
            petition: 'post',
            group: 'aula-virtual',
            prefix: 'tarea-estudiantes',
            ruta: 'entregarEstudianteTarea',
            data: {
                cTareaEstudianteUrlEstudiante: JSON.stringify(
                    this.FilesTareasEstudiantes
                ),
                iTareaId: this.iTareaId,
                iEstudianteId: this._constantesService.iEstudianteId,
            },
        }
        this.getInformation(params, 'entregar-estudiante-tarea')
    }

    entregarEstudianteTareaGrupal() {
        if (!this.FilesTareasEstudiantesGrupal.length) return
        const params = {
            petition: 'post',
            group: 'aula-virtual',
            prefix: 'tarea-cabecera-grupos',
            ruta: 'entregarEstudianteTareaGrupal',
            data: {
                cTareaGrupoUrl: JSON.stringify(
                    this.FilesTareasEstudiantesGrupal
                ),
                iTareaId: this.iTareaId,
                iEstudianteId: this._constantesService.iEstudianteId,
            },
        }
        this.getInformation(params, 'entregar-estudiante-tarea-grupal')
    }
    obtenerTareaxiTareaidxiEstudianteId() {
        const params = {
            petition: 'post',
            group: 'aula-virtual',
            prefix: 'tareas',
            ruta: 'obtenerTareaxiTareaidxiEstudianteId',
            data: {
                iTareaId: this.iTareaId,
                iEstudianteId: this._constantesService.iEstudianteId,
            },
        }
        this.getInformation(params, params.ruta)
    }
    validarEscalaCalifId(): void {
        if (
            this.iEscalaCalifId == 1 ||
            this.iEscalaCalifId === '' ||
            isNaN(this.iEscalaCalifId)
        ) {
            alert(
                'Error: El ID de la escala de calificación no puede estar vacío y debe ser un número válido.'
            )
        } else {
            console.log('El ID de la escala de calificación es válido.')
            // Continúa con la lógica si la validación es exitosa
        }
    }
    // Estilos - eliminar y trabajo grupal
    nEstudiante: number = null
    nGrupal: number = null
}
