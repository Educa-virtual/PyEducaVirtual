import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
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
        this.getCursos()
        this.obtenerCursos()
        this.obtenerEvaluacionesCopia()

        // Inicializar según el modo
        if (this.accion === 'crear') {
            console.log('Inicializando en modo crear')
            this.cursos = [] // Asegurar que la lista destino esté vacía
            this.obtenerCursos() // Solo obtener la lista de IEs disponibles
        }
        if (this.accion === 'ver') {
            this.obtenerCursosEvaluacion(
                this.compartirIdEvaluacionService.iEvaluacionId
            )
            this.isDisabled = true // Deshabilita visualmente la sección
        }
        if (this.accion === 'editar') {
            this.obtenerCursosEvaluacion(
                this.compartirIdEvaluacionService.iEvaluacionId
            )
        }
        this.obtenerCursosEvaluacion(
            this.compartirIdEvaluacionService.iEvaluacionId
        )
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

    // Función que maneja la selección o deselección de los cursos
    onCursoSelect(curso: any): void {
        if (!curso.isSelected) {
            // Si el curso está seleccionado, agrégalo al array de seleccionados
            if (
                !this.selectedCursos.some(
                    (c) => c.cCursoNombre === curso.cCursoNombre
                )
            ) {
                this.selectedCursos.push(curso)
            }
        } else {
            // Si el curso está deseleccionado, elimínalo del array de seleccionados
            const index = this.selectedCursos.findIndex(
                (c) => c.cCursoNombre === curso.cCursoNombre
            )
            if (index !== -1) {
                this.selectedCursos.splice(index, 1)
            }
        }

        // Mostrar en consola el estado del array de cursos seleccionados
        console.log('Cursos seleccionados:', this.selectedCursos)
    }

    // Función para enviar los cursos seleccionados al backend
    insertarCursos(): void {
        const iEvaluacionId = this.compartirIdEvaluacionService.iEvaluacionId
        this.selectedCursos = this.cursos
            .filter((curso) => curso.isSelected)
            .map((curso) => ({ iCursoId: curso.iCursoId }))
        console.log(
            'Cursos seleccionados antes de enviar:',
            this.selectedCursos
        )

        if (this.selectedCursos.length === 0) {
            console.log('No hay cursos seleccionados')
            return
        }
        console.log('iEvaluacionId:', iEvaluacionId)
        this._apiEre
            .insertarCursos({
                iEvaluacionId: iEvaluacionId,
                //iEvaluacionId,
                selectedCursos: this.selectedCursos,
            }) // Use one object
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (resp: any) => {
                    console.log('Respuesta de la inserción de cursos:', resp)
                    this.cursos = this.cursos.map((curso) => ({
                        ...curso,
                        isSelected: false, // Reset selection
                    }))
                },
                error: (err) => {
                    console.error('Error al insertar los cursos:', err)
                    const errorMessage =
                        err?.error?.message || 'Error desconocido'
                    console.error('Mensaje de error:', errorMessage)
                },
                complete: () => {
                    console.log('AQUIIIIIIII')
                    this.closeModalEvent.emit(null) // Emitir el evento de cierre del modal
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
    // Usando Promise : Función para obtener los cursos de la evaluación original
    obtenerCursosEvaluacion(evaluacionId: number): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this._apiEre
                .obtenerCursosEvaluacion(evaluacionId) // Llamada al backend con el ID de evaluación
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
    //Copiar y guardar evaluaciones de una evaluacion
    copiarCursos(): void {
        if (
            !this.selectedEvaluacionCopia ||
            typeof this.selectedEvaluacionCopia === 'number'
        ) {
            console.error('No se ha seleccionado una evaluación para copiar')
            return
        }

        const evaluacionIdCopiar = this.selectedEvaluacionCopia.iEvaluacionId
        console.log('Evaluación a copiar:', evaluacionIdCopiar)

        // Obtener los cursos de la evaluación seleccionada
        this.obtenerCursosEvaluacion(evaluacionIdCopiar)
            .then((cursos) => {
                const cursosSeleccionados = cursos.filter(
                    (curso: any) => curso.isSelected === '1' // Filtrar los cursos seleccionados
                )

                if (cursosSeleccionados.length === 0) {
                    console.warn(
                        'No hay cursos seleccionados en la evaluación original'
                    )
                    return
                }

                // Crear el payload con la estructura adecuada para el backend
                const payload = {
                    iEvaluacionId:
                        this.compartirIdEvaluacionService.iEvaluacionId, // ID de la nueva evaluación
                    selectedCursos: cursosSeleccionados.map((curso: any) => ({
                        iCursoId: curso.iCursoId, // ID del curso seleccionado
                    })),
                }

                // Llamada al backend para guardar los cursos seleccionados en la nueva evaluación
                this._apiEre.insertarCursos(payload).subscribe(
                    (response) => {
                        console.log('Cursos copiados exitosamente:', response)
                    },
                    (error) => {
                        console.error('Error al guardar los cursos:', error)
                    }
                )
            })
            .catch((error) => {
                console.error(
                    'Error al obtener los cursos de la evaluación original:',
                    error
                )
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
