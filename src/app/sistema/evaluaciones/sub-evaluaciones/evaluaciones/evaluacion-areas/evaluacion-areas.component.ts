import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core'
import { InputTextModule } from 'primeng/inputtext'
import { FormsModule } from '@angular/forms'
import { CardModule } from 'primeng/card'
import { CommonModule } from '@angular/common'
import { DividerModule } from 'primeng/divider'
import { Subject, takeUntil } from 'rxjs'
import { ICurso } from '../../../../aula-virtual/sub-modulos/cursos/interfaces/curso.interface'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { GeneralService } from '@/app/servicios/general.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { DataViewModule, DataView } from 'primeng/dataview'
import { CompartirIdEvaluacionService } from '../../../services/ereEvaluaciones/compartir-id-evaluacion.service'
import { CheckboxModule } from 'primeng/checkbox'
import { ApiEvaluacionesRService } from '../../../services/api-evaluaciones-r.service'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { ButtonModule } from 'primeng/button'
import { ReactiveFormsModule } from '@angular/forms' // Importar ReactiveFormsModule
import { DropdownModule } from 'primeng/dropdown'
import { MessageService } from 'primeng/api'
//import { ToastModule } from 'primeng/toast'
interface NivelTipo {
    cNivelTipoNombre: string
    iNivelTipoId: string
}
interface EvaluacionCopia {
    iEvaluacionId: number
    cEvaluacionNombre: string
}
export type Layout = 'list' | 'grid'
@Component({
    selector: 'app-evaluacion-areas',
    standalone: true,
    imports: [
        InputTextModule,
        FormsModule,
        CardModule,
        CommonModule,
        DividerModule,
        InputTextModule,
        DataViewModule,
        CheckboxModule,
        ButtonModule,
        ReactiveFormsModule, // Asegúrate de que ReactiveFormsModule esté importado
        DropdownModule,
    ],
    templateUrl: './evaluacion-areas.component.html',
    styleUrl: './evaluacion-areas.component.scss',
})
export class EvaluacionAreasComponent implements OnDestroy, OnInit {
    @Input() _iEvaluacionId: number

    public cursos: any[] = [] // Asegúrate de tener esta variable declarada en tu componente
    public data: ICurso[] = []
    NivelCurso: any = [] // Inicializa la propiedad como un array o con el valor adecuado
    public selectedCursos: any[] = []

    esModoEdicion: boolean = false // Para controlar el modo edición
    nivelTipo: NivelTipo[] | undefined

    selectedEvaluacionCopia: EvaluacionCopia | number
    EvaluacionCopia: EvaluacionCopia[] | undefined

    private _ref = inject(DynamicDialogRef)
    public sortField: string = ''
    public sortOrder: number = 0
    public layout: Layout = 'list'
    options = ['list', 'grid']
    public searchText: Event
    public text: string = ''

    private unsubscribe$ = new Subject<boolean>()
    private _constantesService = inject(ConstantesService)
    private _generalService = inject(GeneralService)
    private _store = inject(LocalStoreService)
    private _apiEre = inject(ApiEvaluacionesRService)
    public params = {
        iCompentenciaId: 0,
        iCapacidadId: 0,
        iDesempenioId: 0,
        bPreguntaEstado: -1,
    }
    private _MessageService = inject(MessageService) //!Agregando Mensaje
    visible: boolean = false //Accion Editar, Ver, crear
    accion: string //Accion Editar, Ver, crear
    isDisabled: boolean

    // Definimos el Output que va a emitir el evento
    @Output() closeModalEvent = new EventEmitter<any>()

    constructor(
        private store: LocalStoreService,
        private compartirIdEvaluacionService: CompartirIdEvaluacionService,
        private _config: DynamicDialogConfig, // Inyección de configuración
        private cdRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        console.log(this.compartirIdEvaluacionService.iEvaluacionId)
        //alert(this.compartirIdEvaluacionService.iEvaluacionId)
        console.log('Iniciando componente con config:', this._config.data)
        // Determinar el modo
        this.accion = this._config.data?.accion || 'crear'
        console.log('Acción actual:', this.accion)
        // console.log('Modo actual:', this.accion)
        // console.log('Es modo edición:', this.esModoEdicion)
        const modulo = this._store.getItem('dremoModulo')
        switch (Number(modulo.iModuloId)) {
            case 2:
                this.layout = 'list'
                break
            case 1:
                this.layout = 'grid'
                break
            default:
                break
        }

        this.obtenerEvaluacionesCopia()
        console.log('ESTE ES LA ACCION', this.accion)
        // Inicializar según el modo
        if (this.accion === 'nuevo') {
            console.log('Inicializando en modo crear')
            this.cursos = [] // Asegurar que la lista destino esté vacía
            this.obtenerCursosEvaluacion(
                this.compartirIdEvaluacionService.iEvaluacionId
            )
            //this.insertarCursos([], this._iEvaluacionId)
        }
        if (this.accion === 'ver') {
            this.obtenerCursosEvaluacion(
                this.compartirIdEvaluacionService.iEvaluacionId
            )
            this.isDisabled = true // Deshabilita visualmente la sección
        }
        if (this.accion === 'editar') {
            console.log('VIENE DATOS COMO ', this._iEvaluacionId)
            this.obtenerCursosEvaluacion(
                this.compartirIdEvaluacionService.iEvaluacionId
            )
        }
        this.obtenerCursosEvaluacion(this._iEvaluacionId)
    }
    // Obtener los cursos
    obtenerCursos(): void {
        console.log('Ejecutando obtenerCursos') // Para verificar si se está llamando

        this._apiEre
            .obtenerCursos(this.params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (resp: any) => {
                    console.log(
                        'Datos obtenidos de Cursos de ObtenerCursos:',
                        resp
                    )
                    this.cursos = resp.data.map((curso: any) => ({
                        ...curso,
                        isSelected: curso.isSelected || false,
                    }))
                },
                error: (err) => {
                    console.error('Error al obtener cursos:', err)
                },
            })
    }

    //!Funcion de oncoruseSelect
    onCursoSelect(curso: any): void {
        const iEvaluacionId = this.compartirIdEvaluacionService.iEvaluacionId
        const iEvaluacionId_ = this._iEvaluacionId
        console.log(
            `Estado seleccionado para ${curso.cCursoNombre}: ${curso.isSelected}`
        )
        if (curso.isSelected) {
            this.insertarCursos([curso], iEvaluacionId_)
        } else {
            this.eliminarCursos([curso], iEvaluacionId)
        }
        // Actualizar la base de datos con los cursos seleccionados o deseleccionados
        //this.actualizarCursosSeleccionados()
    }
    //! Función para insertar o eliminar cursos seleccionados
    actualizarCursosSeleccionados(): void {
        const iEvaluacionId = this.compartirIdEvaluacionService.iEvaluacionId // Obtener el iEvaluacionId
        //const iEvaluacionId = this._iEvaluacionId
        // Filtra los cursos seleccionados y crea un array con `iCursoId` y `isSelected`
        this.selectedCursos = this.cursos.map((curso) => ({
            iCursoId: curso.iCursoId,
            isSelected: curso.isSelected,
        }))

        // Dividir los cursos en seleccionados y deseleccionados
        const cursosSeleccionados = this.selectedCursos.filter(
            (curso) => curso.isSelected
        )
        const cursosDeseleccionados = this.selectedCursos.filter(
            (curso) => !curso.isSelected
        )

        // Si hay cursos seleccionados, insertarlos en la base de datos
        if (cursosSeleccionados.length > 0) {
            this.insertarCursos(cursosSeleccionados, iEvaluacionId)
        }

        // Si hay cursos deseleccionados, eliminarlos de la base de datos
        if (cursosDeseleccionados.length > 0) {
            this.eliminarCursos(cursosDeseleccionados, iEvaluacionId)
        }
    }
    // !Función para insertar los cursos seleccionados en la base de datos
    insertarCursos(cursos: any[], iEvaluacionId: number): void {
        // Determinar qué valor de iEvaluacionId usar
        const id =
            iEvaluacionId || this.compartirIdEvaluacionService.iEvaluacionId

        // Si ambos valores son null o undefined, se muestra un error o mensaje adecuado
        if (!id) {
            console.error('No se ha proporcionado un iEvaluacionId válido')
            this._MessageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se ha proporcionado un iEvaluacionId válido.',
            })
            return
        }

        this._apiEre
            .insertarCursos({
                iEvaluacionId: id, // Aseguramos que se pasa el iEvaluacionId
                selectedCursos: cursos, // Y los cursos seleccionados
            })
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (resp: any) => {
                    if (this.accion == 'nuevo') {
                        this._MessageService.add({
                            severity: 'success',
                            summary: 'Cursos registrados',
                            detail: 'El curso se registrado correctamente.',
                        })
                        console.log('Cursos insertados:', resp)
                    }
                    if (this.accion == 'editar') {
                        this._MessageService.add({
                            severity: 'success',
                            summary: 'Cursos editados',
                            detail: 'El curso se ha editado correctamente.',
                        })
                        console.log('Cursos editados:', resp)
                    }
                    // this._MessageService.add({
                    //     severity: 'success',
                    //     summary: 'Cursos registrados',
                    //     detail: 'El curso se registró correctamente.',
                    // })
                    // console.log('Cursos insertados:', resp)
                },
                error: (err) => {
                    console.error('Error al insertar cursos:', err)
                },
            })
    }
    //! Función para eliminar los cursos deseleccionados de la base de datos
    eliminarCursos(cursos: any[], iEvaluacionId: number): void {
        this._apiEre
            .eliminarCursos({
                iEvaluacionId: iEvaluacionId,
                selectedCursos: cursos,
            })
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (resp: any) => {
                    if (this.accion == 'nuevo') {
                        this._MessageService.add({
                            severity: 'success',
                            summary: 'Curso eliminado',
                            detail: 'El curso se eliminó correctamente.',
                        })
                        console.log('Cursos insertados:', resp)
                    }
                    if (this.accion == 'editar') {
                        this._MessageService.add({
                            severity: 'success',
                            summary: 'Curso eliminado',
                            detail: 'El curso se eliminó correctamente.',
                        })
                        console.log('Cursos eliminados:', resp)
                    }
                    // this._MessageService.add({
                    //     severity: 'success',
                    //     summary: 'Curso eliminado',
                    //     detail: 'El curso se eliminó correctamente.',
                    // })
                    // console.log('Cursos insertados:', resp)
                },
                error: (err) => {
                    console.error('Error al eliminar cursos:', err)
                },
            })
    }

    obtenerEvaluacionesCopia(): void {
        this._apiEre
            .obtenerEvaluacionesCopia(this.params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (resp: unknown) => {
                    console.log('DATOS OBTENIDOS DE EVALUACIONES:', resp) // Imprime la respuesta completa
                    this.EvaluacionCopia = resp['data']
                    console.log(
                        'Nivel tipo asignado a this.ugel:',
                        this.nivelTipo
                    )
                },
            })
    }

    // Método para actualizar cursos en el backend
    actualizarCursos(): void {
        const iEvaluacionId = this.compartirIdEvaluacionService.iEvaluacionId

        // Filtra los cursos seleccionados y crea un array con `iCursoId` y `isSelected`
        this.selectedCursos = this.cursos.map((curso) => ({
            iCursoId: curso.iCursoId,
            isSelected: curso.isSelected,
        }))

        // Verifica que haya cursos seleccionados
        if (this.selectedCursos.length === 0) {
            console.log('No hay cursos seleccionados para actualizar')
            return
        }
        console.log(
            'Cursos seleccionados para actualizar:',
            this.selectedCursos
        )
        // Llama al servicio para actualizar cursos
        this._apiEre
            .actualizarCursos(iEvaluacionId, this.selectedCursos)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (resp) => {
                    console.log('Cursos actualizados correctamente:', resp)
                    // Aquí podrías agregar alguna lógica adicional, como notificaciones al usuario
                },
                error: (err) => {
                    console.error('Error al actualizar los cursos:', err)
                },
                complete: () => {
                    console.log('AQUIIIIIIII')
                    this.closeModalEvent.emit(null) // Emitir el evento de cierre del modal
                },
            })
    }

    public onFilter(dv: DataView, event: Event) {
        const text = (event.target as HTMLInputElement).value
        this.cursos = this.data
        dv.value = this.data
        if (text.length > 1) {
            dv.filter(text)
            this.cursos = dv.filteredValue
        }
        if (this.layout === 'list') {
            this.searchText = event
        }
    }

    getCursos() {
        const year = this.store.getItem('dremoYear')
        const params = {
            petition: 'post',
            group: 'docente',
            prefix: 'docente-cursos',
            ruta: 'list', //'getDocentesCursos',
            data: {
                opcion: 'CONSULTARxiPersIdxiYearId',
                iCredId: this._constantesService.iCredId,
                valorBusqueda: year, //iYearId
                iSemAcadId: null,
                iIieeId: null,
            },
            params: { skipSuccessMessage: true },
        }
        this._generalService
            .getGralPrefix(params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (response) => {
                    this.cursos = response.data.map((curso) => ({
                        iCursoId: curso.idDocCursoId,
                        ...curso,
                    }))
                    this.data = this.cursos
                },
                complete: () => {},
                error: (error) => {
                    console.log(error)
                },
            })
    }

    obtenerCursosEvaluacion(evaluacionId: number) {
        console.log('Evaluacion ID VIENE EN CHAR:', evaluacionId)
        return new Promise((resolve, reject) => {
            const evaluacionId =
                this.compartirIdEvaluacionService.iEvaluacionId ||
                this._iEvaluacionId
            console.log(
                'evaluacionId DE SERVICIO OBTENERPARTICIPACIONES:',
                evaluacionId
            )
            console.log('DE _IEVALUACIONS:', this._iEvaluacionId) // Asegúrate de que sea un número

            this._apiEre
                .obtenerCursosEvaluacion(evaluacionId) //! Llamada al backend con el ID de evaluación tenia el "evaluacionId"
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe({
                    next: (resp: any) => {
                        console.log(
                            'Cursos obtenidos desde el backend:',
                            resp.cursos
                        )

                        this.cursos = resp.cursos.map((curso: any) => ({
                            ...curso,
                            isSelected: curso.isSelected === '1' ? true : false, // Asegúrate de convertir '1' a true y '0' a false
                        }))
                        resolve(resp.cursos)
                        console.log('MUESTRAME EL RESP', resp.cursos)
                        // Forzar detección de cambios para que se actualice la vista si es necesario
                        this.cdRef.markForCheck()
                    },
                    error: (err) => {
                        console.error('Error al obtener cursos:', err)
                        reject(err) // Rechazar la promesa en caso de error
                    },
                })
        })
    }

    ngOnDestroy() {
        this.unsubscribe$.next(true)
    }
    onChange() {}
    closeModal(data) {
        this._ref.close(data)
        console.log('Formulario de evaluación cancelado')
    }
}
