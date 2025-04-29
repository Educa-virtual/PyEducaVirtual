import { PrimengModule } from '@/app/primeng.module'
//import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { Component, OnInit } from '@angular/core' //inject,
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
//import { MessageService } from 'primeng/api'
//import { Router } from '@angular/router'
import { DerivarSugerenciaComponent } from './derivar-sugerencia/derivar-sugerencia.component'
import { RegistrarSugerenciaComponent } from './registrar-sugerencia/registrar-sugerencia.component'
//import { BuzonSugerenciasService } from './services/buzon-sugerencias.service'

@Component({
    selector: 'app-buzon-sugerencias',
    standalone: true,
    imports: [
        PrimengModule,
        TablePrimengComponent,
        DerivarSugerenciaComponent,
        RegistrarSugerenciaComponent,
    ],
    templateUrl: './buzon-sugerencias.component.html',
    styleUrl: './buzon-sugerencias.component.scss',
})
export class BuzonSugerenciasComponent implements OnInit {
    prioridades: Array<object>
    formularioNuevoHeader: string
    perfil: any = JSON.parse(localStorage.getItem('dremoPerfil'))
    usuarioEstudiante: boolean = this.perfil.iPerfilId == 80
    form: FormGroup
    dataSugerencias: any[]
    /**
     * Columnas de la tabla
     * @type {any[]}
     */
    columns = [
        {
            type: 'item',
            width: '1rem',
            field: 'item',
            header: '#',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'date',
            width: '3rem',
            field: 'fecha',
            header: 'Fecha',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '15rem',
            field: 'asunto',
            header: 'Asunto',
            text_header: 'center',
            text: 'left',
        },
        {
            type: 'tag',
            width: '2rem',
            field: 'prioridad',
            header: 'Prioridad',
            styles: {
                Alta: 'danger',
                Baja: 'success',
                Media: 'warning',
            },
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '8rem',
            field: 'text',
            header: 'Mensaje respuesta',
            text_header: 'center',
            text: 'left',
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
    mostrarFormularioNuevo: boolean = false
    //private buzonSugerenciasService = inject(BuzonSugerenciasService)
    constructor(
        private fb: FormBuilder
        //private router: Router,
    ) {} //private buzonSugerenciasService: BuzonSugerenciasService

    ngOnInit(): void {
        this.prioridades = [
            { id: 1, nombre: 'Baja' },
            { id: 2, nombre: 'Media' },
            { id: 3, nombre: 'Alta' },
        ]
        this.form = this.fb.group({
            iPrioridadId: [null, Validators.required],
            iDestinoId: [null, Validators.required],
            cAsunto: [null, Validators.required],
            cSugerencia: [null, Validators.required],
        })
    }

    escucharEsVisible(event: any) {
        //return (this.mostrarFormularioNuevo = event.value)
        this.mostrarFormularioNuevo = event.value
    }

    nuevaSugerencia() {
        this.formularioNuevoHeader = 'Nueva sugerencia'
        this.mostrarFormularioNuevo = true
        //this.disable_form = false
        //this.registrar_visible = true
        //this.resetearInputs()
        //this.disableForm(false)
    }

    resetearInputs() {
        this.form.reset()
    }

    guardarSugerencia() {
        console.log('ok')
        /**/
        /*this.datosSugerenciaService
            .guardarSugerencia(this.form.value)
            .subscribe({
                next: (data: any) => {
                    this.sugerencia_registrada = true
                    this._MessageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Estudiante registrado',
                    })
                    console.log(data, 'agregar estudiante')
                    this.registrar_visible = false
                },
                error: (error) => {
                    console.error('Error guardando estudiante:', error)
                    this._MessageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error,
                    })
                },
                complete: () => {
                    console.log('Request completed')
                },
            })*/
    }

    /*sede: any[]
    iSedeId: number
    iYAcadId: number


    derivar_visible: boolean = false
    caption: string = ''
    c_accion: string


    sugerencia_registrada: boolean = false

    destinos: Array<object>

    uploadedFiles: any[] = []
    perfil: any = JSON.parse(localStorage.getItem('dremoPerfil'))
    es_estudiante: boolean = this.perfil.iPerfilId == 80
    disable_form: boolean = false
*/
    //private _MessageService = inject(MessageService) // dialog Mensaje simple
    //private _confirmService = inject(ConfirmationModalService) // componente de dialog mensaje

    /*

    derivacionVisible(event: any) {
        return (this.derivar_visible = event.value)
    }*/

    /**
     * Buscar sugerencias segun criterios de busqueda
     */
    /*buscarSugerencias() {
        this.sugerencias = [
            {
                id: 1,
                destino_id: [1, 3],
                fecha: '2024-01-01',
                asunto: 'Notificarme cuando el profesar ponga nota a mi examen',
                estado_id: 2,
                estado: 'RECIBIDO',
                prioridad: 'Media',
                prioridad_id: 2,
                sugerencia:
                    '<h1>Notificarme cuando el profesar ponga nota a mi examen</h1><strong>Texto de prueba</strong><em>Texto resaltado</em><br><br>Salto de linea.',
            },
            {
                id: 2,
                destino_id: [1],
                fecha: '2024-01-02',
                asunto: 'Opciones de preguntas deben ser mas grandes en celular',
                estado_id: 1,
                estado: 'PENDIENTE',
                prioridad: 'Baja',
                prioridad_id: 1,
                sugerencia:
                    '<h1>Opciones de preguntas deben ser mas grandes en celular</h1><strong>Texto de prueba</strong><em>Texto resaltado</em><br><br>Salto de linea.',
            },
            {
                id: 3,
                destino_id: [1, 2],
                fecha: '2024-01-03',
                asunto: 'Explicar como se calcula promedio final',
                estado_id: 3,
                estado: 'ATENDIDO',
                prioridad: 'Alta',
                prioridad_id: 3,
                sugerencia:
                    '<h1>Explicar como se calcula promedio final</h1><strong>Texto de prueba</strong><em>Texto resaltado</em><br><br>Salto de linea.',
            },
            {
                id: 4,
                destino_id: [4],
                fecha: '2024-01-04',
                asunto: 'Mas explicaciones en examenes de matematica',
                estado_id: 4,
                estado: 'DERIVADO',
                prioridad: 'BAJA',
                prioridad_id: 2,
                sugerencia:
                    '<h1>Mas explicaciones en examenes de matematica</h1><strong>Texto de prueba</strong><em>Texto resaltado</em><br><br>Salto de linea.',
            },
        ]
    }*/

    /*buscarDestinos() {
        this.destinos = [
            { id: 1, nombre: 'EQUIPO TECNICO' },
            { id: 2, nombre: 'DIRECCION' },
            { id: 3, nombre: 'PROFESORES' },
            { id: 4, nombre: 'ESPECIALISTAS' },
        ]
    }*/

    /**
     * Mostrar modal para agregar nueva sugerencia
     */

    /**
     * Enviar datos de nueva sugerencia a backend
     */

    /**
     * Eliminar sugerencia segun id
     * @param item sugerencia a eliminar
     */
    eliminarSugerencia(item: any) {
        console.log(item)
        /*this._confirmService.openConfirm({
            header: 'Eliminar sugerencia',
            icon: 'pi pi-exclamation-triangle',
            message: '¿Está seguro de eliminar la sugerencia seleccionada?',
            accept: () => {
                this.datosSugerenciaService.eliminarSugerencia(item).subscribe({
                    next: (data: any) => {
                        this._MessageService.add({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: 'Sugerencia eliminada',
                        })
                        console.log(data, 'eliminar sugerencia')
                        this.sugerencias = this.sugerencias.filter(
                            (sug: any) =>
                                sug.iSugerenciaId !== item.iSugerenciaId
                        )
                    },
                    error: (error) => {
                        console.error('Error eliminando sugerencia:', error)
                        this._MessageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: error,
                        })
                    },
                    complete: () => {
                        console.log('Request completed')
                    },
                })
            },
        })*/
    }

    /**
     * Mostrar modal para editar sugerencia
     * @param item sugerencia seleccionada en tabla
     */
    /*editarSugerencia(item: any) {
        this.formularioHeader = 'Editar sugerencia'
        this.disable_form = false
        this.setFormSugerencia(item)
        this.registrar_visible = true
    }*/

    /**
     * Mostrar modal para ver sugerencia
     * @param item sugerencia seleccionada en tabla
     */
    /*mostrarSugerencia(item: any) {
        this.formularioHeader = 'Ver sugerencia'
        this.disable_form = true
        this.setFormSugerencia(item)
        this.registrar_visible = true
        this.disableForm(true)
    }*/

    /**
     * Actualizar sugerencia segun formulario
     */
    actualizarSugerencia() {
        /*this.datosSugerenciaService
            .actualizarSugerencia(this.form.value)
            .subscribe({
                next: (data: any) => {
                    this._MessageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Sugerencia eliminada',
                    })
                    console.log(data, 'actualizar sugerencia')
                },
                error: (error) => {
                    console.error('Error actualizando sugerencia:', error)
                    this._MessageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error,
                    })
                },
                complete: () => {
                    console.log('Request completed')
                },
            })*/
    }

    /**
     * Ir a vista para dar seguimiento a sugerencia
     * @param item sugerencia seleccionada en tabla
     */
    /*seguimientoSugerencia(item: any) {
        console.log(item, 'seguimientoSugerencia')
    }*/

    /**
     * Limpiar formulario
     */

    /**
     * Deshabilitar inputs de formulario
     * @param disable booleano para deshabilitar o habilitar
     */
    /*disableForm(disable: boolean) {
        if (disable) {
            this.form.get('cAsunto')?.disable()
            this.form.get('cSugerencia')?.enable()
            this.form.get('iDestinoId')?.disable()
            this.form.get('iPrioridadId')?.disable()
        } else {
            this.form.get('cAsunto')?.enable()
            this.form.get('cSugerencia')?.enable()
            this.form.get('iDestinoId')?.enable()
            this.form.get('iPrioridadId')?.enable()
        }
    }*/

    /**
     * Rellenar formulario con datos de sugerencia
     * @param item sugerencia seleccionada en tabla
     */
    /*setFormSugerencia(item: any) {
        this.form.get('cAsunto')?.setValue(item.asunto)
        this.form.get('cSugerencia')?.setValue(item.sugerencia)
        this.form.get('iDestinoId')?.setValue(item.destino_id)
        this.form.get('iPrioridadId')?.setValue(item.prioridad_id)
        this.registrar_visible = true
    }

    onUpload(event: any) {
        this.uploadedFiles = event.files
    }*/

    /**
     * Acciones para botones en cada fila de tabla
     * @param {object} accion accion seleccionada
     * @param {object} item datos de la fila seleccionada
     */
    accionBtnItemTable({ accion, item }) {
        console.log(accion, item)
        /*if (accion === 'editar') {
            this.editarSugerencia(item)
        }
        if (accion === 'ver') {
            this.mostrarSugerencia(item)
        }
        if (accion === 'seguimiento') {
            this.router.navigate([
                '/gestion-institucional/seguimiento-sugerencia',
            ])
        }
        if (accion === 'derivar') {
            this.derivar_visible = true
        }
        if (accion === 'anular') {
            this.eliminarSugerencia(item)
        }*/
    }

    selectedItems = []

    /**
     * Definir botones de cada fila en la tabla
     * @type {IActionTable[]}
     */
    actions: IActionTable[] = [
        /*{
            labelTooltip: 'Derivar',
            icon: 'pi pi-send',
            accion: 'derivar',
            type: 'item',
            class: 'p-button-rounded p-button-success p-button-text',
            isVisible: (row) => {
                return row.estado_id === 1
            },
        },
        {
            labelTooltip: 'Anular sugerencia',
            icon: 'pi pi-trash',
            accion: 'anular',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
            isVisible: (row) => {
                return row.estado_id === 1 && 2 == this.perfil.iCredId
            },
        },*/
        {
            labelTooltip: 'Ver sugerencia',
            icon: 'pi pi-eye',
            accion: 'ver',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
        },
        /*{
            labelTooltip: 'Seguimiento',
            icon: 'pi pi-search',
            accion: 'seguimiento',
            type: 'item',
            class: 'p-button-rounded p-button-secondary p-button-text',
        },*/
    ]

    actionsLista: IActionTable[]
}
