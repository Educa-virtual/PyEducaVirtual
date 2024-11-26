import { CompartirIdEvaluacionService } from './../../../services/ereEvaluaciones/compartir-id-evaluacion.service'
import { CompartirFormularioEvaluacionService } from './../../../services/ereEvaluaciones/compartir-formulario-evaluacion.service'

import {
    Component,
    ChangeDetectorRef,
    inject,
    OnInit,
    Input,
} from '@angular/core'
import { PickListModule } from 'primeng/picklist'
import { ApiEvaluacionesRService } from '../../../services/api-evaluaciones-r.service'
import { Subject, takeUntil } from 'rxjs'
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
    @Input() _iEvaluacionId: number //ID de la evaluacion Form
    public cEvaluacionNombre: string | null = null //!Nombre del formulario Evaluacion
    public evaluacionFormGroup: any

    private unsubscribe$: Subject<boolean> = new Subject()

    public params = {
        iCompentenciaId: 0,
        iCapacidadId: 0,
        iDesempenioId: 0,
        bPreguntaEstado: -1,
    }
    public data = []

    private _apiEre = inject(ApiEvaluacionesRService)
    public sourceProducts: any[] = [] // IEs no participantes
    public targetProducts: any[] = [] // IEs participantes
    private _MessageService = inject(MessageService) //!Agregando Mensaje
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
    //!Conteo de Ie participan y Ie no participan
    participanCount: number = 0 // Conteo de instituciones que participan
    noParticipanCount: number = 0 // Conteo de instituciones que no participan

    constructor(
        private cdr: ChangeDetectorRef,
        private compartirIdEvaluacionService: CompartirIdEvaluacionService,
        private compartirFormularioEvaluacionService: CompartirFormularioEvaluacionService,
        private _config: DynamicDialogConfig, // Inyectar configuración
        private evaluacionesService: ApiEvaluacionesRService // Inyecta el servicio -> Evaliacion Copiar
    ) {}
    public allIEs = [] // Lista completa de IE para filtrar los no participantes
    esModoEdicion: boolean = false // Cambiar a true si estás en modo edición
    iEvaluacionId: number // Aquí se vincula el valor seleccionado

    ngOnInit() {
        console.log('Valor recibido en _iEvaluacionId:', this._iEvaluacionId)
        console.log('Iniciando componente con config:', this._config.data)
        //console.log('iEvaluacionId recibido:', this._iEvaluacionId)
        console.log(
            'iEvaluacionId recibido:',
            this.compartirIdEvaluacionService
        )
        //!Cambios servicio form
        this.cEvaluacionNombre =
            this.compartirFormularioEvaluacionService.getcEvaluacionNombre()
        console.log('Valor obtenido desde el servicio:', this.cEvaluacionNombre)
        //!Cambios servicio form
        this.accion = this._config.data?.accion || 'crear'
        console.log('Acción actual:', this.accion)

        this.obtenerNivelTipo()
        this.obtenerugel()
        //this.obtenerEvaluacionesCopia()

        this.nivelTipo = [
            { cNivelTipoNombre: 'Primaria', iNivelTipoId: 'NY' },
            { cNivelTipoNombre: 'Secundaria', iNivelTipoId: 'RM' },
        ]

        // Inicializar según el modo
        if (this.accion === 'nuevo') {
            this.obtenerIE()
            this.compartirIdEvaluacionService.iEvaluacionId = this.iEvaluacionId
            this.targetProducts = [] // Vaciar correctamente la lista de productos seleccionados
            this.obtenerParticipaciones(
                this.compartirIdEvaluacionService.iEvaluacionId
            )
        }
        if (this.accion === 'ver') {
            this.obtenerParticipaciones(
                this.compartirIdEvaluacionService.iEvaluacionId
            )
            console.log(
                'iEvaluacionId recibido Ver:',
                this.obtenerParticipaciones(
                    this.compartirIdEvaluacionService.iEvaluacionId
                )
            )
        }
        if (this.accion === 'editar') {
            console.log(
                this.compartirIdEvaluacionService.iEvaluacionId,
                'AQUI ESTA EL ID'
            )
            this.obtenerParticipaciones(
                this.compartirIdEvaluacionService.iEvaluacionId
            )
        }
        // this.obtenerParticipaciones(
        //     this.compartirIdEvaluacionService.iEvaluacionId
        // )
    }

    obtenerIE() {
        this.allIEs = []
        this.sourceProducts = []

        this._apiEre
            .obtenerIE(this.params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (resp: any) => {
                    this.allIEs = resp.data.map((item: any) => ({
                        iIieeId: item.iIieeId,
                        cIieeNombre: item.cIieeNombre,
                        cIieeCodigoModular: item.cIieeCodigoModular,
                        cNivelTipoNombre: item.cNivelTipoNombre,
                        cUgelNombre: item.cUgelNombre, // Asegúrate de incluir esta propiedad
                    }))

                    this.sourceProducts = this.allIEs.filter(
                        (ie) =>
                            !this.targetProducts.some(
                                (participa) => participa.iIieeId === ie.iIieeId
                            )
                    )
                    // Aplica el filtro si se ha seleccionado un nivel y un ugel
                    this.sourceProducts = this.allIEs.filter(
                        (ie) =>
                            (!this.selectedNivelTipo ||
                                ie.cNivelTipoNombre ===
                                    this.selectedNivelTipo.cNivelTipoNombre) &&
                            (!this.selectedUgeles ||
                                ie.cUgelNombre ===
                                    this.selectedUgeles.cUgelNombre) &&
                            !this.targetProducts.some(
                                (participa) => participa.iIieeId === ie.iIieeId
                            )
                    )
                    console.log(
                        'Instituciones participantes:',
                        this.targetProducts
                    )
                    console.log(
                        'Instituciones no participantes:',
                        this.sourceProducts
                    )
                    this.actualizarConteos()
                },
                error: (error) => console.error('Error al obtener IEs:', error),
            })
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
    // Cuando se mueve un elemento a "Participan"
    // IEparticipan(event: any) {
    //     const itemsMoved = event.items
    //     console.log('Moviendo a Participan AQUI:', itemsMoved)

    //     const payload = {
    //         items: itemsMoved.map((item) => ({
    //             //iEvaluacionId: this._iEvaluacionId, //FUNCIONA PARA EDITAR
    //             //iEvaluacionId: this.compartirIdEvaluacionService.iEvaluacionId, //FUNCIONA PARA GUARDAR
    //             iEvaluacionId:
    //                 this._iEvaluacionId ??
    //                 this.compartirIdEvaluacionService.iEvaluacionId,
    //             iIieeId: item.iIieeId,

    //             //iIieeId: item.iIieeId,
    //         })),
    //     }
    //     // const payload = {
    //     //     items: itemsMoved.map((item) => ({
    //     //         iEvaluacionId: this._iEvaluacionId, // Usando el ID recibido como Input
    //     //         iIieeId: item.iIieeId,
    //     //     }))
    //     // }
    //     this._apiEre.guardarParticipacion(payload).subscribe(
    //         //(response) => console.log('Guardado exitoso:', response),
    //         (response) => {
    //             // Mostrar mensaje tipo toast en caso de éxito
    //             if (this.accion === 'nuevo') {
    //                 this._MessageService.add({
    //                     severity: 'success',
    //                     summary: 'Guardado completado',
    //                     detail: 'Las instituciones educativas se han guardado correctamente en el sistema.',
    //                 })
    //             }
    //             if (this.accion === 'editar') {
    //                 this._MessageService.add({
    //                     severity: 'success',
    //                     summary: 'Edicion completado',
    //                     detail: 'Las instituciones educativas se han editado correctamente en el sistema.',
    //                 })
    //             }
    //             console.log('Guardado exitoso:', response)
    //         },
    //         (error) => console.error('Error al guardar:', error)
    //     )
    //     //this.actualizarConteos() //!Se agrego el conteo de datos.
    // }

    // IEnoparticipan(event: any) {
    //     const itemsMoved = event.items
    //     // Obtenemos los objetos con iIieeId e iEvaluacionId para eliminarlos
    //     const participacionesToDelete = itemsMoved.map((item) => ({
    //         //!Cambios Recientes
    //         iEvaluacionId:
    //             this._iEvaluacionId ??
    //             this.compartirIdEvaluacionService.iEvaluacionId,
    //         iIieeId: item.iIieeId,
    //         // iIieeId: item.iIieeId,
    //         // iEvaluacionId: this._iEvaluacionId, // Asumiendo que iEvaluacionId está disponible en el componente
    //     }))

    //     if (participacionesToDelete.length > 0) {
    //         // Realizamos la eliminación en bloque enviando los objetos necesarios
    //         this._apiEre
    //             .eliminarParticipacion(participacionesToDelete)
    //             .subscribe(
    //                 (response) => {
    //                     // Mostrar mensaje tipo toast en caso de éxito
    //                     this._MessageService.add({
    //                         severity: 'success',
    //                         summary: 'Eliminación realizada',
    //                         detail: 'La institución educativa fue eliminada correctamente del sistema.',
    //                     })
    //                     console.log('Eliminado exitoso:', response)
    //                 },
    //                 (error) => {
    //                     console.error('Error al eliminar:', error)
    //                 }
    //             )
    //     } else {
    //         console.warn('No hay elementos para eliminar.')
    //     }
    //     this.actualizarConteos() //!Se agrego el conteo de datos.
    // }

    //!Aqui se cambio
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
    //!CAMBIOS ALL
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

    //!AQUI SE CAMBIO
    // IEparticipanall(event: any) {
    //     const itemsMoved = event.items
    //     // console.log('Moviendo a Participan:', itemsMoved)
    //     const payload = {
    //         items: itemsMoved.map((item) => ({
    //             //!ESTA EN MODO MANUAL; CAMBIAR POR EL ID DE LA EVALUACION
    //             // iEvaluacionId: this._iEvaluacionId,
    //             // iIieeId: item.iIieeId,
    //             //!Cambios recientes
    //             iEvaluacionId:
    //                 this._iEvaluacionId ??
    //                 this.compartirIdEvaluacionService.iEvaluacionId,
    //             iIieeId: item.iIieeId,
    //         })),
    //     }
    //     this._apiEre.guardarParticipacion(payload).subscribe(
    //         //(response) => console.log('Guardado exitoso:', response),
    //         (response) => {
    //             // Mostrar mensaje tipo toast en caso de éxito
    //             this._MessageService.add({
    //                 severity: 'success',
    //                 summary: 'Guardado exitoso',
    //                 detail: 'Las instituciones educativas han sido registradas con éxito.',
    //             })
    //             console.log('IE Resgistradas exitosas:', response)
    //         },
    //         (error) => console.error('Error al guardar:', error)
    //     )
    //     this.actualizarConteos() //!Se agrego el conteo de datos.
    // }
    // IEnoparticipanall(event: any) {
    //     const itemsMoved = event.items
    //     // console.log(
    //     //     'Elementos movidos de IEnoparticipan a IEparticipan:',
    //     //     itemsMoved
    //     // )

    //     // Obtenemos los objetos con iIieeId e iEvaluacionId para eliminarlos
    //     const participacionesToDelete = itemsMoved.map((item) => ({
    //         //!Cambios recientes
    //         iEvaluacionId:
    //             this._iEvaluacionId ??
    //             this.compartirIdEvaluacionService.iEvaluacionId,
    //         iIieeId: item.iIieeId,
    //         // iIieeId: item.iIieeId,
    //         // iEvaluacionId: this._iEvaluacionId, // Asumiendo que iEvaluacionId está disponible en el componente
    //     }))

    //     if (participacionesToDelete.length > 0) {
    //         // Realizamos la eliminación en bloque enviando los objetos necesarios
    //         this._apiEre
    //             .eliminarParticipacion(participacionesToDelete)
    //             .subscribe(
    //                 (response) => {
    //                     // Mostrar mensaje tipo toast en caso de éxito
    //                     this._MessageService.add({
    //                         severity: 'success',
    //                         summary: 'Eliminación realizada',
    //                         detail: 'Se han eliminado todas las instituciones educativas seleccionadas de los participantes.',
    //                     })
    //                     console.log('Eliminacion de varios exitoso:', response)
    //                 },
    //                 (error) => {
    //                     console.error('Error al eliminar:', error)
    //                 }
    //             )
    //     } else {
    //         console.warn('No hay elementos para eliminar.')
    //     }
    //     this.actualizarConteos() //!Se agrego el conteo de datos.
    // }

    obtenerParticipaciones(
        evaluacionId?: number,
        modoCopia: boolean = false
    ): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const id =
                this.compartirIdEvaluacionService.iEvaluacionId ||
                this._iEvaluacionId
            console.log(
                'evaluacionId DE SERVICIO OBTENERPARTICIPACIONES:',
                evaluacionId
            )

            // Llamar a la API para obtener las participaciones
            this._apiEre
                .obtenerParticipaciones(id)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe({
                    //!Error Console Aqui
                    next: (resp: any) => {
                        // Mapear los datos de la respuesta
                        const participantes = resp.data.map((item: any) => ({
                            iIieeId: item.iIieeId,
                            cIieeNombre: item.cIieeNombre,
                            cIieeCodigoModular: item.cIieeCodigoModular,
                            cNivelTipoNombre: item.cNivelTipoNombre,
                        }))

                        if (modoCopia) {
                            // Si es modo copia, asignar directamente a targetProducts
                            this.targetProducts = participantes
                        } else {
                            // Si no es modo copia, reiniciar y obtener IE
                            this.targetProducts = participantes
                            this.obtenerIE() // Actualizar la lista de IEs
                        }
                        console.log('Participantes cargados:', participantes)
                        resolve(participantes)
                    },
                    error: (error) => {
                        console.error(
                            'Error al obtener participaciones:',
                            error
                        )
                        reject(error)
                    },
                })
        })
    }

    // copiarParticipantes(): void {
    //     if (
    //         !this.selectedEvaluacionCopia ||
    //         typeof this.selectedEvaluacionCopia === 'number'
    //     ) {
    //         console.error('No se ha seleccionado una evaluación para copiar')
    //         return
    //     }
    //     const evaluacionIdCopiar = this.selectedEvaluacionCopia.iEvaluacionId
    //     this.obtenerParticipaciones(evaluacionIdCopiar, true)
    //         .then((participantes) => {
    //             this.targetProducts = participantes
    //             const payload = {
    //                 items: this.targetProducts.map((participante) => ({
    //                     iEvaluacionId:
    //                         this.compartirIdEvaluacionService.iEvaluacionId,
    //                     iIieeId: participante.iIieeId,
    //                 })),
    //             }
    //             this._apiEre.guardarParticipacion(payload).subscribe(
    //                 (response) => console.log('Guardado exitoso:', response),
    //                 (error) => console.error('Error al guardar:', error)
    //             )
    //         })
    //         .catch((error) => {
    //             console.error('Error al copiar participantes:', error)
    //         })
    // }
    // Evaluaciones Copia
    // obtenerEvaluacionesCopia(): void {
    //     this._apiEre
    //         .obtenerEvaluacionesCopia(this.params)
    //         .pipe(takeUntil(this.unsubscribe$))
    //         .subscribe({
    //             next: (resp: unknown) => {
    //                 //console.log('DATOS OBTENIDOS DE EVALUACIONES:', resp) // Imprime la respuesta completa
    //                 this.EvaluacionCopia = resp['data']
    //                 console.log(
    //                     'Nivel tipo asignado a this.ugel:',
    //                     this.nivelTipo
    //                 )
    //             },
    //         })
    // }
    //!Filtro
    // filterIEs() {
    //     this.sourceProducts = this.allIEs.filter((ie) => {
    //         // Filtrar por nivelTipo si hay uno seleccionado
    //         const nivelTipoMatch = this.selectedNivelTipo
    //             ? ie.cNivelTipoNombre ===
    //               this.selectedNivelTipo.cNivelTipoNombre
    //             : true

    //         // Filtrar por ugel si hay uno seleccionado
    //         const ugelMatch = this.selectedUgeles
    //             ? ie.cUgelNombre === this.selectedUgeles.cUgelNombre
    //             : true

    //         return nivelTipoMatch && ugelMatch
    //     })
    // }
    //!cambios
    // filterIEs(): void {
    //     // Filtrar los elementos en sourceProducts (No Participan)
    //     this.sourceProducts = this.allIEs.filter((ie) => {
    //         // Filtrar por nivelTipo si hay uno seleccionado
    //         const nivelTipoMatch = this.selectedNivelTipo
    //             ? ie.cNivelTipoNombre ===
    //               this.selectedNivelTipo.cNivelTipoNombre
    //             : true

    //         // Filtrar por ugel si hay uno seleccionado
    //         const ugelMatch = this.selectedUgeles
    //             ? ie.cUgelNombre === this.selectedUgeles.cUgelNombre
    //             : true

    //         // Asegurarse de que el elemento no esté en targetProducts
    //         const notInTarget = !this.targetProducts.some(
    //             (target) => target.iIieeId === ie.iIieeId
    //         )

    //         return nivelTipoMatch && ugelMatch && notInTarget
    //     })

    //     // Filtrar los elementos en targetProducts (Participan)
    //     this.targetProducts = this.allIEs.filter((ie) => {
    //         // Filtrar por nivelTipo si hay uno seleccionado
    //         const nivelTipoMatch = this.selectedNivelTipo
    //             ? ie.cNivelTipoNombre ===
    //               this.selectedNivelTipo.cNivelTipoNombre
    //             : true

    //         // Filtrar por ugel si hay uno seleccionado
    //         const ugelMatch = this.selectedUgeles
    //             ? ie.cUgelNombre === this.selectedUgeles.cUgelNombre
    //             : true

    //         // Asegurarse de que el elemento esté en targetProducts
    //         const inTarget = this.targetProducts.some(
    //             (target) => target.iIieeId === ie.iIieeId
    //         )

    //         return nivelTipoMatch && ugelMatch && inTarget
    //     })

    //     // Actualizar los conteos
    //     this.actualizarConteos()
    // }
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

        // Filtrar los elementos en targetProducts (Participan)
        // Solo se agregarán los productos seleccionados sin eliminar ninguno ya existente
        this.targetProducts = this.targetProducts.filter((product) => {
            return this.allIEs.some((ie) => ie.iIieeId === product.iIieeId)
        })

        // Aquí se pueden agregar nuevos productos a targetProducts si es necesario, como:
        // (por ejemplo, si algún producto es seleccionado de sourceProducts)

        // Actualizar los conteos después de los cambios
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

    //!Cambios Codigo Bueno
    // actualizarConteos(): void {
    //     //!Agrego Recien Actualizar Conteos
    //     this.participanCount = this.targetProducts.length // Total de ieparticipan
    //     this.noParticipanCount = this.sourceProducts.length // Total de ienoparticipan
    // }

    // Función para actualizar los conteos con base en los filtros actuales
    // actualizarConteos(): void {
    //     // Aplicar los filtros
    //     const filteredParticipan = this.targetProducts.filter((item) => {
    //         const nivelTipoMatch = this.selectedNivelTipo
    //             ? item.cNivelTipoNombre ===
    //               this.selectedNivelTipo.cNivelTipoNombre
    //             : true
    //         const ugelMatch = this.selectedUgeles
    //             ? item.cUgelNombre === this.selectedUgeles.cUgelNombre
    //             : true
    //         return nivelTipoMatch && ugelMatch
    //     })

    //     const filteredNoParticipan = this.sourceProducts.filter((item) => {
    //         const nivelTipoMatch = this.selectedNivelTipo
    //             ? item.cNivelTipoNombre ===
    //               this.selectedNivelTipo.cNivelTipoNombre
    //             : true
    //         const ugelMatch = this.selectedUgeles
    //             ? item.cUgelNombre === this.selectedUgeles.cUgelNombre
    //             : true
    //         return nivelTipoMatch && ugelMatch
    //     })

    //     // Actualizar los conteos
    //     this.participanCount = filteredParticipan.length
    //     this.noParticipanCount = filteredNoParticipan.length
    // }
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
    //!Cambios bien
}
