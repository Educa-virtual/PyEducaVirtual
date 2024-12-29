import { CompartirIdEvaluacionService } from './../../../services/ereEvaluaciones/compartir-id-evaluacion.service'
import { CompartirFormularioEvaluacionService } from './../../../services/ereEvaluaciones/compartir-formulario-evaluacion.service'

import {
    Component,
    ChangeDetectorRef,
    inject,
    OnInit,
    Input,
    Output,
    EventEmitter,
} from '@angular/core'
import { PickListModule } from 'primeng/picklist'
import { ApiEvaluacionesRService } from '../../../services/api-evaluaciones-r.service'
import {
    catchError,
    map,
    Observable,
    Subject,
    takeUntil,
    throwError,
} from 'rxjs'
import { FormsModule } from '@angular/forms'
import { DropdownModule } from 'primeng/dropdown'
import { IconFieldModule } from 'primeng/iconfield'
import { InputIconModule } from 'primeng/inputicon'
import { InputTextModule } from 'primeng/inputtext'
import { ButtonModule } from 'primeng/button'
import { DynamicDialogConfig } from 'primeng/dynamicdialog'
import { ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { MessageService } from 'primeng/api'
interface NivelTipo {
    cNivelTipoNombre: string
    iNivelTipoId: string
}
interface Ugeles {
    cUgelNombre: string
    iUgelId: string
}
interface EvaluacionCopia {
    iEvaluacionId: number
    cEvaluacionNombre: string
}
@Component({
    selector: 'app-ieparticipa',
    standalone: true,
    imports: [
        PickListModule,
        ButtonModule,
        InputTextModule,
        DropdownModule,
        FormsModule,
        IconFieldModule,
        InputIconModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
    ],
    templateUrl: './ieparticipa.component.html',
    styleUrl: './ieparticipa.component.scss',
})
export class IeparticipaComponent implements OnInit {
    nivelTipo: NivelTipo[] | undefined
    selectedNivelTipo: NivelTipo | undefined
    Ugeles: Ugeles[] | undefined
    selectedUgeles: Ugeles | undefined
    EvaluacionCopia: EvaluacionCopia[] | undefined
    selectedEvaluacionCopia: EvaluacionCopia | number
    itemsToDelete: any
    evaluaciones: any[] = [] // Array para almacenar las evaluaciones obtenidas del API
    selectedEvaluacionId: number // ID de la evaluación seleccionada en el dropdown
    visible: boolean = false //Accion Editar, Ver, crear
    accion: string //Accion Editar, Ver, crear
    isDisabled: boolean // Indica si la sección está deshabilitada
    //Conteo de Ie participan y Ie no participan
    participanCount: number = 0 // Conteo de instituciones que participan
    noParticipanCount: number = 0 // Conteo de instituciones que no participan
    esModoEdicion: boolean = false // Cambiar a true si estás en modo edición
    iEvaluacionId: number // Aquí se vincula el valor seleccionado

    @Input() _iEvaluacionId: number //ID de la evaluacion Form
    @Output() datosEmitIeParticipan = new EventEmitter<any>() // Output para enviar el dato al padre

    public allIEs = [] // Lista completa de IE para filtrar los no participantes
    public cEvaluacionNombre: string | null = null //Nombre del formulario Evaluacion
    public evaluacionFormGroup: any
    public params = {
        iCompentenciaId: 0,
        iCapacidadId: 0,
        iDesempenioId: 0,
        bPreguntaEstado: -1,
    }
    public sourceProducts: any[] = [] // IEs no participantes
    public targetProducts: any[] = [] // IEs participantes
    public insParticipan: any[] = [] // InsParticipan
    public data = []
    private unsubscribe$: Subject<boolean> = new Subject()
    private _apiEre = inject(ApiEvaluacionesRService)
    private _MessageService = inject(MessageService) //Agregando Mensaje

    constructor(
        private cdr: ChangeDetectorRef,
        private compartirIdEvaluacionService: CompartirIdEvaluacionService,
        private compartirFormularioEvaluacionService: CompartirFormularioEvaluacionService,
        private _config: DynamicDialogConfig, // Inyectar configuración
        private evaluacionesService: ApiEvaluacionesRService // Inyecta el servicio -> Evaliacion Copiar
    ) {}

    ngOnInit() {
        // console.log('Valor recibido en _iEvaluacionId:', this._iEvaluacionId)
        // console.log('Iniciando componente con config:', this._config.data)
        // //console.log('iEvaluacionId recibido:', this._iEvaluacionId)
        // console.log(
        //     'iEvaluacionId recibido:',
        //     this.compartirIdEvaluacionService
        // )
        //Cambios servicio form
        this.cEvaluacionNombre =
            this.compartirFormularioEvaluacionService.getcEvaluacionNombre()
        //console.log('Valor obtenido desde el servicio:', this.cEvaluacionNombre)
        //Cambios servicio form
        this.accion = this._config.data?.accion || 'crear'
        //console.log('Acción actual:', this.accion)

        this.obtenerNivelTipo()
        this.obtenerugel()

        this.nivelTipo = [
            { cNivelTipoNombre: 'Primaria', iNivelTipoId: 'NY' },
            { cNivelTipoNombre: 'Secundaria', iNivelTipoId: 'RM' },
        ]

        // Inicializar según el modo
        if (this.accion === 'nuevo') {
            this.obtenerIEYParticipaciones()
        }
        if (this.accion === 'ver') {
            this.obtenerIEYParticipaciones()
        }
        if (this.accion === 'editar') {
            this.obtenerIEYParticipaciones()
        }
    }

    obtenerIE(): Observable<any[]> {
        this.allIEs = []
        this.sourceProducts = []
        this.targetProducts = [] // Asegúrate de que se inicializa correctamente

        return this._apiEre.obtenerIE(this.params).pipe(
            takeUntil(this.unsubscribe$),
            map((resp: any) => {
                // Mapear todas las IEs
                this.allIEs = resp.data.map((item: any) => ({
                    iIieeId: item.iIieeId,
                    cIieeNombre: item.cIieeNombre,
                    cIieeCodigoModular: item.cIieeCodigoModular,
                    cNivelTipoNombre: item.cNivelTipoNombre,
                    cUgelNombre: item.cUgelNombre,
                }))

                // Si no hay un ID de evaluación, asignar todas las instituciones a sourceProducts (no participan)
                if (!this.compartirIdEvaluacionService.iEvaluacionId) {
                    this.sourceProducts = [...this.allIEs]
                }
                this.actualizarConteos()
                return this.allIEs
            }),
            catchError((error) => {
                console.error('Error al obtener IEs:', error)
                return throwError(error) // Manejo de error adecuado
            })
        )
    }

    obtenerNivelTipo() {
        this._apiEre
            .obtenerNivelTipo(this.params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (resp: unknown) => {
                    console.log('Datos obtenidos de obtenerNivelTipo:', resp) // Imprime la respuesta completa
                    this.nivelTipo = resp['data']
                    console.log(
                        'Nivel tipo asignado a this.nivelTipo:',
                        this.nivelTipo
                    )
                },
            })
    }
    obtenerugel() {
        this._apiEre
            .obtenerUgeles(this.params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (resp: unknown) => {
                    //console.log('Datos obtenidos de Ugel:', resp) // Imprime la respuesta completa
                    this.Ugeles = resp['data']
                },
            })
    }
    IEparticipan(event: any) {
        const itemsMoved = event.items
        console.log('Moviendo a Participan AQUI:', itemsMoved)

        // Elimina de sourceProducts los elementos que se mueven a targetProducts
        itemsMoved.forEach((item) => {
            this.sourceProducts = this.sourceProducts.filter(
                (sourceItem) => sourceItem.iIieeId !== item.iIieeId
            )
        })

        const payload = {
            items: itemsMoved.map((item) => ({
                iEvaluacionId:
                    this._iEvaluacionId ??
                    this.compartirIdEvaluacionService.iEvaluacionId,
                iIieeId: item.iIieeId,
            })),
        }

        this._apiEre.guardarParticipacion(payload).subscribe(
            (response) => {
                // Mostrar mensaje tipo toast en caso de éxito
                if (this.accion === 'nuevo') {
                    this._MessageService.add({
                        severity: 'success',
                        summary: 'Guardado completado',
                        detail: 'Las instituciones educativas se han guardado correctamente en el sistema.',
                    })
                }
                if (this.accion === 'editar') {
                    this._MessageService.add({
                        severity: 'success',
                        summary: 'Edición completada',
                        detail: 'Las instituciones educativas se han editado correctamente en el sistema.',
                    })
                }
                console.log('Guardado exitoso:', response)
            },
            (error) => console.error('Error al guardar:', error)
        )

        // Actualiza los conteos (si es necesario)
        this.actualizarConteos()
    }

    IEnoparticipan(event: any) {
        const itemsMoved = event.items
        console.log('Moviendo a No Participan AQUI:', itemsMoved)

        // Elimina de targetProducts los elementos que se mueven a sourceProducts
        itemsMoved.forEach((item) => {
            this.targetProducts = this.targetProducts.filter(
                (targetItem) => targetItem.iIieeId !== item.iIieeId
            )
        })

        const participacionesToDelete = itemsMoved.map((item) => ({
            iEvaluacionId:
                this._iEvaluacionId ??
                this.compartirIdEvaluacionService.iEvaluacionId,
            iIieeId: item.iIieeId,
        }))

        if (participacionesToDelete.length > 0) {
            this._apiEre
                .eliminarParticipacion(participacionesToDelete)
                .subscribe(
                    (response) => {
                        // Mostrar mensaje tipo toast en caso de éxito
                        this._MessageService.add({
                            severity: 'success',
                            summary: 'Eliminación realizada',
                            detail: 'La institución educativa fue eliminada correctamente del sistema.',
                        })
                        console.log('Eliminado exitoso:', response)
                    },
                    (error) => console.error('Error al eliminar:', error)
                )
        } else {
            console.warn('No hay elementos para eliminar.')
        }

        // Actualiza los conteos (si es necesario)
        this.actualizarConteos()
    }
    IEparticipanall(event: any) {
        const itemsMoved = event.items

        // Filtrar los elementos movidos según los filtros seleccionados (nivel y ugel)
        const filteredItems = itemsMoved.filter((item) => {
            const nivelTipoMatch = this.selectedNivelTipo
                ? item.cNivelTipoNombre ===
                  this.selectedNivelTipo.cNivelTipoNombre
                : true

            const ugelMatch = this.selectedUgeles
                ? item.cUgelNombre === this.selectedUgeles.cUgelNombre
                : true

            return nivelTipoMatch && ugelMatch
        })

        // Si hay elementos filtrados para guardar
        if (filteredItems.length > 0) {
            const payload = {
                items: filteredItems.map((item) => ({
                    iEvaluacionId:
                        this._iEvaluacionId ??
                        this.compartirIdEvaluacionService.iEvaluacionId,
                    iIieeId: item.iIieeId,
                })),
            }

            this._apiEre.guardarParticipacion(payload).subscribe(
                (response) => {
                    this._MessageService.add({
                        severity: 'success',
                        summary: 'Guardado exitoso',
                        detail: 'Las instituciones educativas han sido registradas con éxito.',
                    })
                    console.log('IE Registradas exitosas:', response)
                },
                (error) => console.error('Error al guardar:', error)
            )
        } else {
            console.warn(
                'No hay instituciones educativas que coincidan con los filtros.'
            )
        }

        this.actualizarConteos() // Actualizar el conteo después de la operación
    }
    IEnoparticipanall(event: any) {
        const itemsMoved = event.items

        // Filtrar los elementos movidos según los filtros seleccionados (nivel y ugel)
        const filteredItems = itemsMoved.filter((item) => {
            const nivelTipoMatch = this.selectedNivelTipo
                ? item.cNivelTipoNombre ===
                  this.selectedNivelTipo.cNivelTipoNombre
                : true

            const ugelMatch = this.selectedUgeles
                ? item.cUgelNombre === this.selectedUgeles.cUgelNombre
                : true

            return nivelTipoMatch && ugelMatch
        })

        // Si hay elementos filtrados para eliminar
        if (filteredItems.length > 0) {
            const participacionesToDelete = filteredItems.map((item) => ({
                iEvaluacionId:
                    this._iEvaluacionId ??
                    this.compartirIdEvaluacionService.iEvaluacionId,
                iIieeId: item.iIieeId,
            }))

            this._apiEre
                .eliminarParticipacion(participacionesToDelete)
                .subscribe(
                    (response) => {
                        this._MessageService.add({
                            severity: 'success',
                            summary: 'Eliminación realizada',
                            detail: 'Se han eliminado todas las instituciones educativas seleccionadas de los participantes.',
                        })
                        console.log('Eliminación de varios exitoso:', response)
                    },
                    (error) => {
                        console.error('Error al eliminar:', error)
                    }
                )
        } else {
            console.warn(
                'No hay instituciones educativas que coincidan con los filtros para eliminar.'
            )
        }

        this.actualizarConteos() // Actualizar el conteo después de la operación
    }
    obtenerParticipaciones(): Observable<any[]> {
        // const evaluacionId =
        //     this.compartirIdEvaluacionService.iEvaluacionId ||
        //     this._iEvaluacionId

        const evaluacionId = this._iEvaluacionId

        console.log(
            'CompartiEvaluacion',
            this.compartirIdEvaluacionService.iEvaluacionId
        )
        console.log('iEvaluacionId:', this._iEvaluacionId)
        console.log('Evaluacion ID para obtener participaciones:', evaluacionId)

        if (!evaluacionId) {
            // Si no hay un ID de evaluación, devolver las instituciones sin participaciones
            console.log(
                'No se ha definido un ID de evaluación, cargando instituciones...'
            )
            // Llamar a obtenerIE() y devolver el resultado
            return this.obtenerIE() // Ya es un Observable<any[]>, las instituciones no participan
        }

        // Si hay un ID de evaluación válido, obtener participaciones
        return this._apiEre.obtenerParticipaciones(evaluacionId).pipe(
            takeUntil(this.unsubscribe$),
            map((resp: any) => {
                if (resp.status) {
                    // Mapear los datos de la respuesta
                    return resp.data.map((item: any) => ({
                        iIieeId: item.iIieeId,
                        cIieeNombre: item.cIieeNombre,
                        cIieeCodigoModular: item.cIieeCodigoModular,
                        cNivelTipoNombre: item.cNivelTipoNombre,
                    }))
                } else {
                    throw new Error('Error en la respuesta: ' + resp.message)
                }
            }),
            catchError((error) => {
                console.error('Error al obtener participaciones:', error)
                return throwError(error) // Manejo de error adecuado
            })
        )
    }

    obtenerIEYParticipaciones() {
        this.obtenerIE().subscribe({
            next: (instituciones: any[]) => {
                // Verificar si hay una evaluación activa
                // const evaluacionId =
                //     this.compartirIdEvaluacionService.iEvaluacionId

                const evaluacionId =
                    this.compartirIdEvaluacionService.iEvaluacionId ||
                    this._iEvaluacionId

                console.log(
                    'CompartiEvaluacion obtenerIEYParticipaciones',
                    this.compartirIdEvaluacionService.iEvaluacionId
                )
                console.log(
                    'iEvaluacionId obtenerIEYParticipaciones:',
                    this._iEvaluacionId
                )
                console.log(
                    'Evaluacion ID para obtener participaciones obtenerIEYParticipaciones:',
                    evaluacionId
                )
                if (!evaluacionId) {
                    // Si no hay una evaluación activa (creando una nueva), asignar todas las instituciones a sourceProducts
                    this.sourceProducts = [...instituciones]
                    this.targetProducts = [] // Asegurarse de que targetProducts esté vacío

                    console.log(
                        'Instituciones no participantes (todas):',
                        this.sourceProducts
                    )
                    console.log(
                        'Instituciones participantes (vacío para nueva evaluación):',
                        this.targetProducts
                    )
                } else {
                    // Si hay una evaluación activa, obtener las participaciones
                    this.obtenerParticipaciones().subscribe({
                        next: (participantes: any[]) => {
                            if (participantes.length > 0) {
                                // Filtrar las instituciones que participan (targetProducts)
                                this.targetProducts = instituciones.filter(
                                    (ie) =>
                                        participantes.some(
                                            (participa) =>
                                                participa.iIieeId === ie.iIieeId
                                        )
                                )

                                // Filtrar las instituciones que no participan (sourceProducts)
                                this.sourceProducts = instituciones.filter(
                                    (ie) =>
                                        !participantes.some(
                                            (participa) =>
                                                participa.iIieeId === ie.iIieeId
                                        )
                                )
                            } else {
                                // Si no hay participaciones, asignar todo a sourceProducts
                                this.sourceProducts = [...instituciones]
                            }

                            console.log(
                                'Instituciones participantes:',
                                this.targetProducts
                            )
                            console.log(
                                'Instituciones no participantes:',
                                this.sourceProducts
                            )

                            this.datosEmitIeParticipan.emit(this.targetProducts)
                            this.actualizarConteos()
                        },
                        error: (error) =>
                            console.error(
                                'Error al obtener participaciones:',
                                error
                            ),
                    })
                }
            },
            error: (error) => console.error('Error al obtener IEs:', error),
        })
    }
    filterIEs(): void {
        // Filtrar los elementos en sourceProducts (No Participan)
        this.sourceProducts = this.allIEs.filter((ie) => {
            // Filtrar por nivelTipo si hay uno seleccionado
            const nivelTipoMatch = this.selectedNivelTipo
                ? ie.cNivelTipoNombre ===
                  this.selectedNivelTipo.cNivelTipoNombre
                : true

            // Filtrar por ugel si hay uno seleccionado
            const ugelMatch = this.selectedUgeles
                ? ie.cUgelNombre === this.selectedUgeles.cUgelNombre
                : true

            // Asegurarse de que el elemento no esté en targetProducts
            const notInTarget = !this.targetProducts.some(
                (target) => target.iIieeId === ie.iIieeId
            )

            return nivelTipoMatch && ugelMatch && notInTarget
        })
        this.targetProducts = this.targetProducts.filter((product) => {
            return this.allIEs.some((ie) => ie.iIieeId === product.iIieeId)
        })
        this.actualizarConteos()
    }
    onNivelTipoChange(event: any) {
        this.selectedNivelTipo = event.value
        this.filterIEs() // Filtrar los elementos al cambiar el nivel tipo
    }

    onUgelChange(event: any) {
        this.selectedUgeles = event.value
        this.filterIEs() // Filtrar los elementos al cambiar el ugel
    }
    // Función para actualizar los conteos con base en los filtros actuales
    actualizarConteos(): void {
        // Aplicar los filtros
        const filteredParticipan = this.targetProducts.filter((item) => {
            const nivelTipoMatch = this.selectedNivelTipo
                ? item.cNivelTipoNombre ===
                  this.selectedNivelTipo.cNivelTipoNombre
                : true
            const ugelMatch = this.selectedUgeles
                ? item.cUgelNombre === this.selectedUgeles.cUgelNombre
                : true
            return nivelTipoMatch && ugelMatch
        })

        const filteredNoParticipan = this.sourceProducts.filter((item) => {
            const nivelTipoMatch = this.selectedNivelTipo
                ? item.cNivelTipoNombre ===
                  this.selectedNivelTipo.cNivelTipoNombre
                : true
            const ugelMatch = this.selectedUgeles
                ? item.cUgelNombre === this.selectedUgeles.cUgelNombre
                : true
            return nivelTipoMatch && ugelMatch
        })

        // Actualizar los conteos
        this.participanCount = filteredParticipan.length
        this.noParticipanCount = filteredNoParticipan.length
        console.log('Datos actuales de targetProducts:', this.targetProducts)
    }
}
