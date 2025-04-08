import { CompartirIdEvaluacionService } from './../../../services/ereEvaluaciones/compartir-id-evaluacion.service'
import { CompartirFormularioEvaluacionService } from './../../../services/ereEvaluaciones/compartir-formulario-evaluacion.service'
import {
    Component,
    inject,
    OnInit,
    Input,
    Output,
    EventEmitter,
} from '@angular/core'
import { ApiEvaluacionesRService } from '../../../services/api-evaluaciones-r.service'
import {
    catchError,
    map,
    Observable,
    Subject,
    takeUntil,
    throwError,
} from 'rxjs'
import { DynamicDialogConfig } from 'primeng/dynamicdialog'
import { MessageService } from 'primeng/api'
import { PrimengModule } from '@/app/primeng.module'
interface NivelTipo {
    cNivelTipoNombre: string
    iNivelTipoId: number | string
}
interface Ugeles {
    cUgelNombre: string
    iUgelId: number | string
}
interface EvaluacionCopia {
    iEvaluacionId: number
    cEvaluacionNombre: string
}
@Component({
    selector: 'app-ieparticipa',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './ieparticipa.component.html',
    styleUrl: './ieparticipa.component.scss',
})
export class IeparticipaComponent implements OnInit {
    nivelTipo: NivelTipo[] | undefined
    selectedNivelTipo: NivelTipo | undefined
    Ugeles: Ugeles[] | undefined = [
        {
            iUgelId: 0,
            cUgelNombre: 'Todos',
        },
    ]
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
        private compartirIdEvaluacionService: CompartirIdEvaluacionService,
        private compartirFormularioEvaluacionService: CompartirFormularioEvaluacionService,
        private _config: DynamicDialogConfig // Inyectar configuración
    ) {}

    ngOnInit() {
        //Cambios servicio form
        this.cEvaluacionNombre =
            this.compartirFormularioEvaluacionService.getcEvaluacionNombre()
        this.accion = this._config.data?.accion || 'crear'
        this.obtenerNivelTipo()
        this.obtenerugel()
        this.obtenerIEYParticipaciones()
    }

    obtenerIE(): Observable<any[]> {
        this.allIEs = []
        this.sourceProducts = []
        this.targetProducts = [] // Asegúrate de que se inicializa correctamente

        return this._apiEre.obtenerIE(this.params).pipe(
            takeUntil(this.unsubscribe$),
            map((resp: any) => {
                // Mapear todas las IEs
                this.allIEs = resp.data

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
                    this.nivelTipo = [
                        {
                            iNivelTipoId: 0,
                            cNivelTipoNombre: 'Todos',
                        },
                        ...resp['data'],
                    ]
                },
            })
    }
    obtenerugel() {
        this._apiEre
            .obtenerUgeles(this.params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (resp: unknown) => {
                    this.Ugeles = [
                        {
                            iUgelId: 0,
                            cUgelNombre: 'Todos',
                        },
                        ...resp['data'],
                    ]
                },
            })
    }
    IEparticipan(event: any) {
        if (this.accion === 'ver') {
            return
        }
        const itemsMoved = event.items

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
                console.log(response)
            },
            (error) => console.error('Error al guardar:', error)
        )

        // Actualiza los conteos (si es necesario)
        this.actualizarConteos()
    }
    //
    IEnoparticipan(event: any) {
        if (this.accion === 'ver') {
            return
        }
        const itemsMoved = event.items

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
        if (this.accion === 'ver') {
            return
        }
        const itemsMoved = event.items

        // Filtrar los elementos movidos según los filtros seleccionados (nivel y ugel)
        const filteredItems = itemsMoved.filter((item) => {
            const nivelTipoMatch =
                this.selectedNivelTipo &&
                this.selectedNivelTipo?.iNivelTipoId !== 0
                    ? Number(item.iNivelTipoId) ===
                      Number(this.selectedNivelTipo.iNivelTipoId)
                    : true

            const ugelMatch =
                this.selectedUgeles && this.selectedUgeles?.iUgelId !== 0
                    ? Number(item.iUgelId) ===
                      Number(this.selectedUgeles.iUgelId)
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
                    response
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
        if (this.accion === 'ver') {
            return
        }
        const itemsMoved = event.items

        // Filtrar los elementos movidos según los filtros seleccionados (nivel y ugel)
        const filteredItems = itemsMoved.filter((item) => {
            const nivelTipoMatch =
                this.selectedNivelTipo &&
                this.selectedNivelTipo?.iNivelTipoId !== 0
                    ? Number(item.iNivelTipoId) ===
                      Number(this.selectedNivelTipo.iNivelTipoId)
                    : true

            const ugelMatch =
                this.selectedUgeles && this.selectedUgeles?.iUgelId !== 0
                    ? Number(item.iUgelId) ===
                      Number(this.selectedUgeles.iUgelId)
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
        const evaluacionId = this._iEvaluacionId
        if (!evaluacionId) {
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
                const evaluacionId =
                    this.compartirIdEvaluacionService.iEvaluacionId ||
                    this._iEvaluacionId

                if (this.accion === 'nuevo') {
                    // Modo "nuevo": todas las instituciones están en no participantes
                    this.sourceProducts = [...instituciones]
                    this.targetProducts = [] // Vacío porque no hay participantes
                    // Actualizar los conteos después de asignar los datos
                    this.actualizarConteos()
                } else if (evaluacionId) {
                    // Si hay una evaluación activa (editar o ver), manejar participaciones
                    this.obtenerParticipaciones().subscribe({
                        next: (participantes: any[]) => {
                            if (participantes.length > 0) {
                                this.targetProducts = instituciones.filter(
                                    (ie) =>
                                        participantes.some(
                                            (participa) =>
                                                participa.iIieeId === ie.iIieeId
                                        )
                                )
                                this.sourceProducts = instituciones.filter(
                                    (ie) =>
                                        !participantes.some(
                                            (participa) =>
                                                participa.iIieeId === ie.iIieeId
                                        )
                                )
                            } else {
                                this.sourceProducts = [...instituciones]
                                this.targetProducts = []
                            }
                            // Actualizar los conteos después de procesar los datos
                            this.actualizarConteos()
                        },
                        error: (error) =>
                            console.error(
                                'Error al obtener participaciones:',
                                error
                            ),
                    })
                } else {
                    console.error('Error: Acción o estado no manejado.')
                }
            },
            error: (error) => console.error('Error al obtener IEs:', error),
        })
    }

    filterIEs(): void {
        console.log('llamado')
        // Filtrar los elementos en sourceProducts (No Participan)
        this.sourceProducts = this.allIEs.filter((ie) => {
            // Filtrar por nivelTipo si hay uno seleccionado
            const nivelTipoMatch =
                this.selectedNivelTipo &&
                this.selectedNivelTipo?.iNivelTipoId !== 0
                    ? Number(ie.iNivelTipoId) ===
                      Number(this.selectedNivelTipo.iNivelTipoId)
                    : true

            // Filtrar por ugel si hay uno seleccionado
            const ugelMatch =
                this.selectedUgeles && this.selectedUgeles?.iUgelId !== 0
                    ? Number(ie.iUgelId) === Number(this.selectedUgeles.iUgelId)
                    : true

            // Asegurarse de que el elemento no esté en targetProducts
            const notInTarget = !this.targetProducts.some(
                (target) => target.iIieeId === ie.iIieeId
            )

            return nivelTipoMatch && ugelMatch && notInTarget
        })

        // Filtrar los productos en targetProducts que están presentes en allIEs
        const totalIEparticipan = this.targetProducts.filter((product) => {
            return this.allIEs.some((ie) => ie.iIieeId === product.iIieeId)
        })

        // Reemplazar targetProducts con los productos válidos
        this.targetProducts = totalIEparticipan

        // Debugging: Verificar los productos en targetProducts
        console.log(this.targetProducts)

        // Actualizar los conteos de los productos
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
    actualizarConteos(): void {
        // Validar que sourceProducts y targetProducts tengan datos
        if (!this.sourceProducts || !this.targetProducts) {
            // console.error(
            //     'Error: sourceProducts o targetProducts no están definidos.'
            // )
            this.participanCount = 0
            this.noParticipanCount = 0
            return
        }

        // Aplicar los filtros
        const filteredNoParticipan = this.sourceProducts.filter((item) => {
            const nivelTipoMatch =
                this.selectedNivelTipo &&
                this.selectedNivelTipo?.iNivelTipoId !== 0
                    ? Number(item.iNivelTipoId) ===
                      Number(this.selectedNivelTipo.iNivelTipoId)
                    : true
            const ugelMatch =
                this.selectedUgeles && this.selectedUgeles?.iUgelId !== 0
                    ? Number(item.iUgelId) ===
                      Number(this.selectedUgeles.iUgelId)
                    : true
            return nivelTipoMatch && ugelMatch
        })

        // Actualizar los conteos
        this.participanCount = this.targetProducts.length
        this.noParticipanCount = filteredNoParticipan.length
    }

    onMove(event) {
        console.log(this.accion)
        event.preventDefault()
    }
}
