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
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
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
        ContainerPageComponent,
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
    // selectedCursos: any[] = [] // Para almacenar los cursos seleccionados
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
    //selectedCursos: NivelCurso | undefined
    constructor(
        private store: LocalStoreService,
        private compartirIdEvaluacionService: CompartirIdEvaluacionService,
        private _config: DynamicDialogConfig, // Inyección de configuración
        private cdRef: ChangeDetectorRef
    ) {}
    // ngOnInit(): void
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
        //***
        //console.log('Iniciando componente con config:', this._config.data)
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
        //this.obtenerCursos()

        if (this.accion === 'ver' || this.accion === 'editar') {
            this.obtenerCursosEvaluacion() // Muestra los cursos seleccionados
        }
        this.obtenerCursosEvaluacion() // Llamar a la función al inicio
    }
    // Obtener los cursos
    obtenerCursos(): void {
        this._apiEre
            .obtenerCursos(this.params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (resp: any) => {
                    console.log(
                        'Datos obtenidos de Cursos de ObtenerCursos:',
                        resp
                    )
                    // Asignar los cursos a la propiedad 'cursos', asegurando que cada uno tenga 'isSelected'
                    this.cursos = resp.data.map((curso: any) => ({
                        ...curso,
                        isSelected: curso.isSelected || false, // Establecer un valor predeterminado
                    }))
                    // Forzar la detección de cambios
                    //this.cdRef.detectChanges()
                },
                error: (err) => {
                    console.error('Error al obtener cursos:', err)
                },
            })
    }
    onCursoSelect(curso: any): void {
        if (this.esModoEdicion) {
            // Solo permitir cambios si es modo edición
            if (!curso.isSelected) {
                if (
                    !this.selectedCursos.some(
                        (c) => c.cCursoNombre === curso.cCursoNombre
                    )
                ) {
                    this.selectedCursos.push(curso)
                }
            } else {
                const index = this.selectedCursos.findIndex(
                    (c) => c.cCursoNombre === curso.cCursoNombre
                )
                if (index !== -1) {
                    this.selectedCursos.splice(index, 1)
                }
            }
        }
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
    // Funcion para obtener los cursos seleccionados.
    // obtenerCursosEvaluacion(): void {
    //     const iEvaluacionId = this.compartirIdEvaluacionService.iEvaluacionId
    //     this._apiEre
    //         .obtenerCursosEvaluacion(iEvaluacionId)
    //         .pipe(takeUntil(this.unsubscribe$))
    //         .subscribe({
    //             next: (resp: any) => {
    //                 // Mostrar los cursos registrados y no registrados por separado
    //                 console.log('Cursos registrados:', resp.registrados)
    //                 console.log('Cursos no registrados:', resp.no_registrados)
    //             },
    //             error: (err) => {
    //                 console.error('Error al obtener cursos:', err)
    //             },
    //         })
    // }
    // Obtener los cursos registrados y no registrados
    // obtenerCursosEvaluacion(): void {
    //     const iEvaluacionId = this.compartirIdEvaluacionService.iEvaluacionId
    //     this._apiEre
    //         .obtenerCursosEvaluacion(iEvaluacionId)
    //         .pipe(takeUntil(this.unsubscribe$))
    //         .subscribe({
    //             next: (resp: any) => {
    //                 console.log('Cursos registrados:', resp.registrados)
    //                 console.log('Cursos no registrados:', resp.no_registrados)

    //                 // Combinamos cursos registrados y no registrados en un solo array
    //                 this.cursos = [
    //                     ...resp.registrados.map((curso: any) => ({
    //                         ...curso,
    //                         isSelected: true, // Los cursos registrados están seleccionados
    //                     })),
    //                     ...resp.no_registrados.map((curso: any) => ({
    //                         ...curso,
    //                         isSelected: false, // Los cursos no registrados no están seleccionados
    //                     })),
    //                 ]
    //                 this.cdRef.markForCheck() // Marca el componente para la detección de cambios
    //                 // Verifica el valor de isSelected de cada curso
    //                 console.log('Cursos con isSelected:', this.cursos)

    //                 //this.cdRef.detectChanges() // Asegúrate de que Angular detecte los cambios
    //             },
    //             error: (err) => {
    //                 console.error('Error al obtener cursos:', err)
    //             },
    //         })
    // }
    // obtenerCursosEvaluacion(): void {
    //     const iEvaluacionId = this.compartirIdEvaluacionService.iEvaluacionId
    //     this._apiEre
    //         .obtenerCursosEvaluacion(iEvaluacionId)
    //         .pipe(takeUntil(this.unsubscribe$))
    //         .subscribe({
    //             next: (resp: any) => {
    //                 // Solo loguear los datos que llegan del backend
    //                 console.log('Datos del backend:', resp)
    //             },
    //             error: (err) => {
    //                 console.error('Error al obtener cursos:', err)
    //             },
    //         })
    // }
    // obtenerCursosEvaluacion(): void {
    //     const iEvaluacionId = this.compartirIdEvaluacionService.iEvaluacionId
    //     this._apiEre
    //         .obtenerCursosEvaluacion(iEvaluacionId)
    //         .pipe(takeUntil(this.unsubscribe$))
    //         .subscribe({
    //             next: (resp: any) => {
    //                 // Loguear los datos para ver qué llega del backend
    //                 console.log('Datos del backend:', resp)

    //                 // Almacenar los cursos en la variable de clase
    //                 this.cursos = resp.cursos
    //             },
    //             error: (err) => {
    //                 console.error('Error al obtener cursos:', err)
    //             },
    //         })
    // }
    obtenerCursosEvaluacion(): void {
        const iEvaluacionId = this.compartirIdEvaluacionService.iEvaluacionId
        this._apiEre
            .obtenerCursosEvaluacion(iEvaluacionId)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (resp: any) => {
                    console.log('Datos del backend:', resp)

                    // Convertir valores de isSelected a booleanos (true/false) si son cadenas "1" y "0"
                    this.cursos = resp.cursos.map((curso: any) => {
                        console.log(
                            'Valor de isSelected antes de la conversión:',
                            curso.isSelected
                        )

                        // Convertimos la cadena "1" a true y "0" a false
                        curso.isSelected = curso.isSelected === '1' // Si isSelected es "1", será true, sino false

                        console.log('Curso después de la conversión:', curso) // Verificar el resultado
                        return curso
                    })

                    console.log(
                        'Cursos con isSelected convertido:',
                        this.cursos
                    )
                },
                error: (err) => {
                    console.error('Error al obtener cursos:', err)
                },
            })
    }

    // toggleCursoSeleccionado(curso: any): void {
    //     curso.isSelected = !curso.isSelected // Cambia el valor de isSelected
    // }
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
