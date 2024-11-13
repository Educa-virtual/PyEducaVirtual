import {
    ChangeDetectorRef,
    Component,
    inject,
    OnDestroy,
    OnInit,
} from '@angular/core'
import { InputTextModule } from 'primeng/inputtext'
import { FormsModule } from '@angular/forms'
import { CardModule } from 'primeng/card'
import { CommonModule } from '@angular/common'
import { DividerModule } from 'primeng/divider'
// abajo
//import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { Subject, takeUntil } from 'rxjs'
//import { ICurso } from '../interfaces/curso.interface'
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

// interface NivelCurso {
//     //iCursoId: int
//     cCursoNombre: string
// }

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
        //ContainerPageComponent,
        InputTextModule,
        //Subject,
        //ConstantesService,
        DataViewModule,
        CheckboxModule,
        ButtonModule,
        ReactiveFormsModule, // Asegúrate de que ReactiveFormsModule esté importado
    ],
    templateUrl: './evaluacion-areas.component.html',
    styleUrl: './evaluacion-areas.component.scss',
})
export class EvaluacionAreasComponent implements OnDestroy, OnInit {
    public cursos: any[] = [] // Asegúrate de tener esta variable declarada en tu componente
    public data: ICurso[] = []
    NivelCurso: any = [] // Inicializa la propiedad como un array o con el valor adecuado
    public selectedCursos: any[] = []
    accion: string // Nueva propiedad para controlar la acción
    esModoEdicion: boolean = false // Para controlar el modo edición

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
    constructor(
        private store: LocalStoreService,
        private compartirIdEvaluacionService: CompartirIdEvaluacionService,
        private _config: DynamicDialogConfig, // Inyección de configuración
        private cdRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        console.log(this.compartirIdEvaluacionService.iEvaluacionId)
        alert(this.compartirIdEvaluacionService.iEvaluacionId)
        //***
        console.log('Iniciando componente con config:', this._config.data)
        // Determinar el modo
        this.accion = this._config.data?.accion || 'crear'
        this.esModoEdicion = this.accion === 'editar'
        console.log('Modo actual:', this.accion)
        console.log('Es modo edición:', this.esModoEdicion)
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
        if (this.accion === 'crear') {
            console.log('INICIAMOS CREANDO UNO NUEVO CURSO')
            //this.targetProducts = [] // Asegurar que la lista destino esté vacía
            this.obtenerCursos() // Solo obtener la lista de IEs disponibles
        } else if (this.accion === 'editar' || this.accion === 'ver') {
            console.log('Inicializando en modo editar/ver')
            const evaluacionId =
                this._config.data?.evaluacionId ||
                this.compartirIdEvaluacionService.iEvaluacionId
            if (evaluacionId) {
                console.log(
                    'Obteniendo cursos para evaluación con ID:',
                    evaluacionId
                )
                this.obtenerCursosEvaluacion()
            } else {
                console.warn('EvaluacionId no está definido')
            }
        }
        this.obtenerCursosEvaluacion()
    }
    // Función para obtener los cursos
    // obtenerCursos(): void {
    //     this._apiEre
    //         .obtenerCursos(this.params)
    //         .pipe(takeUntil(this.unsubscribe$))
    //         .subscribe({
    //             next: (resp: any) => {
    //                 console.log('Datos obtenidos de Cursos:', resp)
    //                 // Asegúrate de que todos los cursos tengan la propiedad 'isSelected'
    //                 this.cursos = resp.data.map((curso: any) => ({
    //                     ...curso,
    //                     isSelected: curso.isSelected || false, // Asigna un valor predeterminado
    //                 }))
    //                 // Forzar la detección de cambios para que se actualice la vista
    //                 this.cdRef.detectChanges()
    //             },
    //             error: (err) => {
    //                 console.error('Error al obtener cursos:', err)
    //             },
    //         })
    // }
    // Función para insertar los cursos seleccionados en la base de datos
    // insertarCursos(): void {
    //     const iEvaluacionId = this.compartirIdEvaluacionService.iEvaluacionId

    //     // Llamar al servicio para insertar los cursos seleccionados
    //     this._apiEre
    //         .insertarCursos(iEvaluacionId, this.selectedCursos)
    //         .pipe(takeUntil(this.unsubscribe$))
    //         .subscribe({
    //             next: (resp) => {
    //                 console.log('Cursos insertados correctamente:', resp)
    //             },
    //             error: (err) => {
    //                 console.error('Error al insertar los cursos:', err)
    //             },
    //         })
    // }
    // Función de prueba para verificar los datos seleccionados

    // Función para insertar los cursos seleccionados en la base de datos
    // insertarCursos(): void {
    //     const iEvaluacionId = this.compartirIdEvaluacionService.iEvaluacionId

    //     // Llamar al servicio para insertar los cursos seleccionados
    //     this._apiEre
    //         .insertarCursos(iEvaluacionId, this.selectedCursos)
    //         .pipe(takeUntil(this.unsubscribe$))
    //         .subscribe({
    //             next: (resp) => {
    //                 console.log('Cursos insertados correctamente:', resp)
    //             },
    //             error: (err) => {
    //                 console.error('Error al insertar los cursos:', err)
    //             },
    //         })
    // }
    // Función de prueba para verificar los datos seleccionados
    // insertarCursos(): void {
    //     const iEvaluacionId = this.compartirIdEvaluacionService.iEvaluacionId

    //     // Verifica el estado de los cursos seleccionados antes de enviarlos
    //     console.log(
    //         'Cursos seleccionados antes de enviar:',
    //         this.selectedCursos
    //     )

    //     // Si `selectedCursos` está vacío, muestra un mensaje de advertencia
    //     if (this.selectedCursos.length === 0) {
    //         console.log('No hay cursos seleccionados')
    //         return // No continuar si no hay cursos seleccionados
    //     }

    //     // Verifica que iEvaluacionId no esté vacío
    //     console.log('iEvaluacionId:', iEvaluacionId)

    //     // Enviar los datos seleccionados al backend
    //     this._apiEre
    //         .insertarCursos(this.params, this.selectedCursos)
    //         .pipe(takeUntil(this.unsubscribe$))
    //         .subscribe({
    //             next: (resp: any) => {
    //                 console.log('Respuesta de la inserción de cursos:', resp)

    //                 // Asegúrate de que cada curso tenga la propiedad 'isSelected' inicializada
    //                 this.cursos = resp.data.map((curso) => ({
    //                     ...curso,
    //                     isSelected: false, // Inicializa 'isSelected' a false por defecto
    //                 }))

    //                 console.log('Cursos con propiedad isSelected:', this.cursos) // Verifica los cursos actualizados
    //             },
    //             error: (err) => {
    //                 console.error('Error al insertar los cursos:', err)
    //             },
    //         })
    // }

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
        // Filter out selected courses based on `isSelected` property
        this.selectedCursos = this.cursos
            .filter((curso) => curso.isSelected)
            .map((curso) => ({ iCursoId: curso.iCursoId })) // Only include iCursoId

        // Check the selected courses before sending to backend
        console.log(
            'Cursos seleccionados antes de enviar:',
            this.selectedCursos
        )

        if (this.selectedCursos.length === 0) {
            console.log('No hay cursos seleccionados')
            return
        }
        console.log('iEvaluacionId:', iEvaluacionId)
        // Send selected data to backend
        this._apiEre
            .insertarCursos({
                iEvaluacionId,
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
            })
    }

    //Obtener los cursos registrados y no registrados
    // Función para obtener los cursos en modo 'ver' o 'editar'
    obtenerCursosEvaluacion(): void {
        const iEvaluacionId = this.compartirIdEvaluacionService.iEvaluacionId
        console.log(
            'AQUI ESTA EL ID DE OBTENER CURSOS EVALAUCOIN',
            iEvaluacionId
        )
        this._apiEre
            .obtenerCursosEvaluacion(iEvaluacionId) // Llamada al backend con el ID de evaluación
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
                    // Forzar detección de cambios para que se actualice la vista si es necesario
                    this.cdRef.markForCheck()
                },
                error: (err) => {
                    console.error('Error al obtener cursos:', err)
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

    // // Método para actualizar cursos en el backend
    // actualizarCursosExamen(): void {
    //     const iEvaluacionId = this.compartirIdEvaluacionService.iEvaluacionId

    //     // Filtra los cursos seleccionados (solo envía `iCursoId`)
    //     this.selectedCursos = this.cursos
    //         .filter((curso) => curso.isSelected)
    //         .map((curso) => ({ iCursoId: curso.iCursoId }))

    //     // Verifica que haya cursos seleccionados
    //     if (this.selectedCursos.length === 0) {
    //         console.log('No hay cursos seleccionados para actualizar')
    //         return
    //     }

    //     console.log(
    //         'Cursos seleccionados para actualizar:',
    //         this.selectedCursos
    //     )

    //     // Llama al servicio para actualizar cursos
    //     this._apiEre
    //         .actualizarCursosExamen(iEvaluacionId, this.selectedCursos)
    //         .pipe(takeUntil(this.unsubscribe$))
    //         .subscribe({
    //             next: (resp) => {
    //                 console.log('Cursos actualizados correctamente:', resp)
    //                 // Aquí podrías agregar alguna lógica adicional, como notificaciones al usuario
    //             },
    //             error: (err) => {
    //                 console.error('Error al actualizar los cursos:', err)
    //             },
    //         })
    // }

    ngOnDestroy() {
        this.unsubscribe$.next(true)
    }
    closeModal(data) {
        this._ref.close(data)
        console.log('Formulario de evaluación cancelado')

        // Resetear el formulario si es necesario
        //this.evaluacionFormGroup.reset()
    }
}
