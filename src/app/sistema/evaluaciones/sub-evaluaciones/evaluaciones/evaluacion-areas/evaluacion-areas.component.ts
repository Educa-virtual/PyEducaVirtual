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
import { forkJoin, Subject, takeUntil } from 'rxjs'
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
// interface EvaluacionCopia {//!
//     iEvaluacionId: number
//     cEvaluacionNombre: string
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
    lista: any[] = [] //Aqui se guarda Lista Cursos Nivel Tipo.
    public cursosTipo: any[] = [] //Aqui se guarda Lista Cursos Nivel Tipo.
    objectKeys = Object.keys
    @Input() _iEvaluacionId: number
    @Input() datosRecIeParticipanToAreas: any[] = [] // Recibir el dato desde el padre
    datosPrimaria: any[] = []
    datosSecundaria: any[] = []
    public cursos: any[] = [] // Asegúrate de tener esta variable declarada en tu componente
    public data: ICurso[] = []
    //NivelCurso: any = [] //! Inicializa la propiedad como un array o con el valor adecuado
    public selectedCursos: any[] = []

    //esModoEdicion: boolean = false //! Para controlar el modo edición
    nivelTipo: NivelTipo[] | undefined
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
        private cdRef: ChangeDetectorRef,
        private query: GeneralService //!Usar para obtener Nivel y Curso.
    ) {}

    ngOnInit(): void {
        console.log(
            'Datos recibidos desde IeParticipan, por medio de FormularioPadre:',
            this.datosRecIeParticipanToAreas
        )
        this.separarPorNivelIeParticipan() //Visualiza IE
        console.log('Iniciando componente con config:', this._config.data)
        // Determinar el modo
        this.accion = this._config.data?.accion || 'crear'
        console.log('Acción actual:', this.accion)
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

        // this.obtenerEvaluacionesCopia()//!
        console.log('ESTE ES LA ACCION', this.accion)
        // Inicializar según el modo
        if (this.accion === 'nuevo') {
            console.log('Inicializando en modo crear')
            this.cursos = [] // Asegurar que la lista destino esté vacía
            this.obtenerCursosEvaluacion(
                this.compartirIdEvaluacionService.iEvaluacionId
            )
        }
        if (this.accion === 'ver') {
            this.obtenerCursosEvaluacion(
                this.compartirIdEvaluacionService.iEvaluacionId
            )
            console.log(
                'iEvaluacionId recibido Ver:',
                this.obtenerCursosEvaluacion(
                    this.compartirIdEvaluacionService.iEvaluacionId
                )
            )
            this.isDisabled = true // Deshabilita visualmente la sección
        }
        if (this.accion === 'editar') {
            console.log('VIENE DATOS COMO ', this._iEvaluacionId)
            this.obtenerCursosEvaluacion(
                this.compartirIdEvaluacionService.iEvaluacionId
            )
            console.log(
                'iEvaluacionId recibido Editar:',
                this.obtenerCursosEvaluacion(
                    this.compartirIdEvaluacionService.iEvaluacionId
                )
            )
        }

        this.obtenerCursosEvaluacion(this._iEvaluacionId)
        this.searchAmbienteAcademico()
    }
    separarPorNivelIeParticipan() {
        // Filtrar los datos para Educación Primaria
        const datosPrimaria = this.datosRecIeParticipanToAreas.filter(
            (item: any) => item.cNivelTipoNombre === 'Educación Primaria'
        )

        // Filtrar los datos para Educación Secundaria
        const datosSecundaria = this.datosRecIeParticipanToAreas.filter(
            (item: any) => item.cNivelTipoNombre === 'Educación Secundaria'
        )

        console.log('Datos de Educación Primaria:', datosPrimaria)
        console.log('Datos de Educación Secundaria:', datosSecundaria)

        // Opcional: Almacena los datos en propiedades para usarlos en el componente
        this.datosPrimaria = datosPrimaria
        this.datosSecundaria = datosSecundaria
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
        //const iEvaluacionId = this.compartirIdEvaluacionService.iEvaluacionId
        const iEvaluacionId_ = this._iEvaluacionId
        if (curso.isSelected) {
            this.insertarCursos([curso], iEvaluacionId_)
        } else {
            this.eliminarCursos([curso], iEvaluacionId_)
        }
    }
    //! Función para insertar o eliminar cursos seleccionados
    actualizarCursosSeleccionados(): void {
        const iEvaluacionId = this.compartirIdEvaluacionService.iEvaluacionId // Obtener el iEvaluacionId

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
    insertarCursos(cursos: any[], iEvaluacionId: number): void {
        // Determinar qué valor de iEvaluacionId usar
        const id =
            iEvaluacionId || this.compartirIdEvaluacionService.iEvaluacionId

        // Validar si se proporcionó un `iEvaluacionId` válido
        if (!id) {
            console.error('No se ha proporcionado un iEvaluacionId válido')
            this._MessageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se ha proporcionado un iEvaluacionId válido.',
            })
            return
        }

        // Validar si los cursos contienen el campo `iCursoNivelGradId`
        if (!cursos.every((curso) => curso.iCursoNivelGradId)) {
            console.error(
                'Error: Algunos cursos no contienen iCursoNivelGradId'
            )
            this._MessageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Algunos cursos no contienen iCursoNivelGradId.',
            })
            return
        }

        // Llamar a la API para insertar los cursos
        this._apiEre
            .insertarCursos({
                iEvaluacionId: id,
                selectedCursos: cursos, // Cursos con iCursoNivelGradId
            })
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (resp: any) => {
                    if (this.accion == 'nuevo') {
                        this._MessageService.add({
                            severity: 'success',
                            summary: 'Cursos registrados',
                            detail: 'Los cursos se han registrado correctamente.',
                        })
                    } else if (this.accion == 'editar') {
                        this._MessageService.add({
                            severity: 'success',
                            summary: 'Cursos editados',
                            detail: 'Los cursos se han editado correctamente.',
                        })
                    }
                    console.log('Respuesta de la API:', resp)
                },
                error: (err) => {
                    console.error('Error al insertar cursos:', err)
                },
            })
    }

    eliminarCursos(cursos: any[], iEvaluacionId: number): void {
        const evaluacionId =
            this.compartirIdEvaluacionService.iEvaluacionId ||
            this._iEvaluacionId
        console.log(
            'evaluacionId DE SERVICIO OBTENERPARTICIPACIONES:',
            evaluacionId
        )
        // Asegúrate de que iEvaluacionId y cursos están definidos
        if (!evaluacionId || !cursos || cursos.length === 0) {
            console.error(
                'Datos incompletos para eliminar cursos.',
                iEvaluacionId
            )
            this._MessageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se proporcionaron datos válidos para eliminar cursos.',
            })
            return
        }

        this._apiEre
            .eliminarCursos({
                iEvaluacionId: evaluacionId, // ID de la evaluación
                selectedCursos: cursos, // Lista de cursos seleccionados
            })
            .pipe(takeUntil(this.unsubscribe$)) // Para manejar la suscripción y evitar fugas de memoria
            .subscribe({
                next: (resp: any) => {
                    // Notifica el éxito
                    this._MessageService.add({
                        severity: 'success',
                        summary: 'Curso eliminado',
                        detail: 'El curso se eliminó correctamente.',
                    })
                    console.log('Cursos eliminados:', resp)
                },
                error: (err) => {
                    // Notifica el error
                    console.error('Error al eliminar cursos:', err)
                    this._MessageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No se pudo eliminar el curso.',
                    })
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
        console.log('Evaluacion ID:', evaluacionId)

        return new Promise((resolve, reject) => {
            const evaluacionId =
                this.compartirIdEvaluacionService.iEvaluacionId ||
                this._iEvaluacionId

            this._apiEre
                .obtenerCursosEvaluacion(evaluacionId)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe({
                    next: (resp: any) => {
                        console.log(
                            'Cursos obtenidos desde el backend:',
                            resp.cursos
                        )

                        // Crear un mapa con los cursos obtenidos del backend
                        const cursosSeleccionados = new Map(
                            resp.cursos.map((curso: any) => [
                                curso.iCursoNivelGradId,
                                curso.isSelected === '1', // Convertir "1" a true
                            ])
                        )

                        // Actualizar el estado de los cursos en la estructura actual
                        this.lista.forEach((nivel: any) => {
                            Object.keys(nivel.grados).forEach((grado) => {
                                nivel.grados[grado].forEach((curso: any) => {
                                    curso.isSelected =
                                        cursosSeleccionados.get(
                                            curso.iCursoNivelGradId
                                        ) || false
                                })
                            })
                        })

                        console.log(
                            'Lista actualizada con selección:',
                            this.lista
                        )

                        // Forzar detección de cambios para actualizar la vista
                        this.cdRef.markForCheck()

                        resolve(resp.cursos)
                    },
                    error: (err) => {
                        console.error('Error al obtener cursos:', err)
                        reject(err)
                    },
                })
        })
    }
    // Llamar a la función para obtener los datos de primaria y secundaria
    searchAmbienteAcademico() {
        // Realizamos ambas solicitudes al mismo tiempo utilizando forkJoin
        forkJoin({
            primaria: this.query.searchAmbienteAcademico({
                json: JSON.stringify({
                    iNivelGradoId: 3, // Primaria
                }),
                _opcion: 'getCursosNivelGrado',
            }),
            secundaria: this.query.searchAmbienteAcademico({
                json: JSON.stringify({
                    iNivelGradoId: 4, // Secundaria
                }),
                _opcion: 'getCursosNivelGrado',
            }),
        }).subscribe({
            next: (data: any) => {
                // Procesamos los datos de primaria y secundaria
                console.log('Datos recibidos de Primaria:', data.primaria)
                console.log('Datos recibidos de Secundaria:', data.secundaria)

                // Combinamos los datos
                this.lista = [
                    ...this.extraerAsignatura(data.primaria.data),
                    ...this.extraerAsignatura(data.secundaria.data),
                ]

                console.log('Lista combinada:', this.lista)
            },
            error: (err: any) => {
                console.error('Error al obtener los datos:', err)
            },
        })
    }
    // Función para estructurar los datos
    extraerAsignatura(data: any): any[] {
        console.log('Datos recibidos en extraerAsignatura:', data)

        if (!Array.isArray(data)) {
            console.error('Error: Los datos no son un arreglo')
            return []
        }

        // Estructuramos los datos por nivel y grado
        const groupedData = data.reduce((acc: any, item: any) => {
            const nivel = item.cNivelTipoNombre ?? 'Sin Descripción'
            const grado = item.cGradoAbreviacion ?? 'Sin Abreviación'

            if (!acc[nivel]) {
                acc[nivel] = {} // Cada nivel contiene grados
            }

            if (!acc[nivel][grado]) {
                acc[nivel][grado] = [] // Cada grado contiene cursos
            }

            acc[nivel][grado].push({
                iCursoNivelGradId: item.iCursosNivelGradId, // Nuevo campo
                cCursoNombre: item.cCursoNombre ?? 'Sin Nombre',
                isSelected: false, // Propiedad para checkbox
            })

            return acc
        }, {})

        console.log('Datos agrupados:', groupedData)

        // Convertir el objeto agrupado en un arreglo
        return Object.keys(groupedData).map((nivel) => ({
            nivel,
            grados: groupedData[nivel],
        }))
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
