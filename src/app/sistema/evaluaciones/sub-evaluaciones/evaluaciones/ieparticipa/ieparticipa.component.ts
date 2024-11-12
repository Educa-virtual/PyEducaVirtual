//Agregar Servicio de Evaluacion
import { CompartirIdEvaluacionService } from './../../../services/ereEvaluaciones/compartir-id-evaluacion.service'
import { Component, ChangeDetectorRef, inject, OnInit } from '@angular/core'
import { Product } from 'src/app/demo/api/product'
import { ProductService } from 'src/app/demo/service/product.service'
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
    ],
    templateUrl: './ieparticipa.component.html',
    styleUrl: './ieparticipa.component.scss',
    providers: [ProductService],
})
export class IeparticipaComponent implements OnInit {
    public evaluacionFormGroup: any

    private unsubscribe$: Subject<boolean> = new Subject()

    public params = {
        iCompentenciaId: 0,
        iCapacidadId: 0,
        iDesempenioId: 0,
        bPreguntaEstado: -1,
    }
    public data = []
    accion: string // Nueva propiedad para controlar la acción
    esModoEdicion: boolean = false // Para controlar el modo edición
    private _apiEre = inject(ApiEvaluacionesRService)
    public sourceProducts: any[] = [] // IEs no participantes
    public targetProducts: any[] = [] // IEs participantes
    nivelTipo: NivelTipo[] | undefined
    selectedNivelTipo: NivelTipo | undefined
    Ugeles: Ugeles[] | undefined
    selectedUgeles: Ugeles | undefined
    EvaluacionCopia: EvaluacionCopia[] | undefined
    selectedEvaluacionCopia: EvaluacionCopia | number

    itemsToDelete: any
    //Evaluaciones Copia
    evaluaciones: any[] = [] // Array para almacenar las evaluaciones obtenidas del API
    selectedEvaluacionId: number // ID de la evaluación seleccionada en el dropdown
    constructor(
        private carService: ProductService,
        private cdr: ChangeDetectorRef,
        private compartirIdEvaluacionService: CompartirIdEvaluacionService,
        private _config: DynamicDialogConfig, // Inyectar configuración
        private evaluacionesService: ApiEvaluacionesRService // Inyecta el servicio -> Evaliacion Copiar
    ) {}
    public allIEs: Product[] = [] // Lista completa de IE para filtrar los no participantes
    ngOnInit() {
        console.log('Iniciando componente con config:', this._config.data)

        // Determinar el modo
        this.accion = this._config.data?.accion || 'crear'
        this.esModoEdicion = this.accion === 'editar'

        console.log('Modo actual:', this.accion)
        console.log('Es modo edición:', this.esModoEdicion)

        this.carService.getProductsSmall().then((products) => {
            this.sourceProducts = products
            this.cdr.markForCheck()
        })

        this.obtenerIE()
        this.obtenerNivelTipo()
        this.obtenerugel()

        // Inicializar según el modo
        if (this.accion === 'crear') {
            console.log('Inicializando en modo crear')
            this.targetProducts = [] // Asegurar que la lista destino esté vacía
            this.obtenerIE() // Solo obtener la lista de IEs disponibles
        } else if (this.accion === 'editar' || this.accion === 'ver') {
            console.log('Inicializando en modo editar/ver')
            const evaluacionId =
                this._config.data?.evaluacionId ||
                this.compartirIdEvaluacionService.iEvaluacionId
            if (evaluacionId) {
                this.obtenerParticipaciones(evaluacionId)
            }
        }
        // Llamamos al servicio para obtener las evaluaciones
        this.obtenerEvaluacionesCopia()

        this.nivelTipo = [
            { cNivelTipoNombre: 'Primaria', iNivelTipoId: 'NY' },
            { cNivelTipoNombre: 'Secundaria', iNivelTipoId: 'RM' },
        ]
    }

    private initializeCreateMode() {
        // En modo crear, solo obtenemos la lista completa de IE
        this.obtenerIE()
        // Inicializamos targetProducts como vacío ya que es una nueva selección
        this.targetProducts = []
    }

    private initializeEditMode() {
        const evaluacionId =
            this._config.data?.evaluacionId ||
            this.compartirIdEvaluacionService.iEvaluacionId
        if (evaluacionId) {
            this.obtenerParticipaciones(evaluacionId)
        }
    }

    obtenerIE() {
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
                    }))

                    // Filtra las IE que no están en `targetProducts`
                    this.sourceProducts = this.allIEs.filter(
                        (ie) =>
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
                    console.log('Datos obtenidos de Ugel:', resp) // Imprime la respuesta completa
                    this.Ugeles = resp['data']
                    console.log(
                        'Nivel tipo asignado a this.ugel:',
                        this.nivelTipo
                    )
                },
            })
    }
    // Cuando se mueve un elemento a "Participan"
    IEparticipan(event: any) {
        const itemsMoved = event.items
        console.log('Moviendo a Participan:', itemsMoved)
        const payload = {
            items: itemsMoved.map((item) => ({
                iEvaluacionId: this.compartirIdEvaluacionService.iEvaluacionId,
                //!ESTA EN MODO MANUAL; CAMBIAR POR EL ID DE LA EVALUACION
                iIieeId: item.iIieeId,
            })),
        }
        this._apiEre.guardarParticipacion(payload).subscribe(
            (response) => console.log('Guardado exitoso:', response),
            (error) => console.error('Error al guardar:', error)
        )
    }
    // Cuando se mueve un elemento a "No participan"
    IEnoparticipan(event: any) {
        const itemsMoved = event.items
        console.log('Moviendo a No Participan:', itemsMoved)
        itemsMoved.forEach((item) => {
            console.log('Item:', item) // Verifica la estructura
            console.log('ID a eliminar:', item.iIieeId) // Verifica el ID que se va a enviar
            console.log('Nombre a eliminar:', item.cIieeNombre)
            console.log('Codigo Modular a eliminar:', item.iIeeParticipaId)
            this._apiEre.eliminarParticipacion(item.iIieeId).subscribe(
                (response) => console.log('Eliminación exitosa:', response),
                (error) => console.error('Error al eliminar:', error)
            )
        })
        console.log('Moviendo a No Participan:', itemsMoved)
    }
    IEnoparticipanall(event: any) {
        const itemsMoved = event.items // Los elementos movidos de "No Participan"
        console.log(
            'Elementos movidos de IEnoparticipan a IEparticipan:',
            itemsMoved
        )

        // Obtenemos los IDs de las participaciones para eliminarlas
        const idsToDelete = itemsMoved.map((item) => item.iIieeId) // Extraemos solo los iIieeId

        // Realizamos la eliminación en bloque (enviar un arreglo de IDs)
        this._apiEre.eliminarParticipacion(idsToDelete).subscribe(
            (response) => {
                console.log('Eliminación exitosa:', response)
            },
            (error) => {
                console.error('Error al eliminar:', error)
            }
        )
    }
    IEparticipanall(event: any) {
        const itemsMoved = event.items
        console.log('Moviendo a Participan:', itemsMoved)
        const payload = {
            items: itemsMoved.map((item) => ({
                //!ESTA EN MODO MANUAL; CAMBIAR POR EL ID DE LA EVALUACION
                iEvaluacionId: this.compartirIdEvaluacionService.iEvaluacionId,
                iIieeId: item.iIieeId,
            })),
        }
        this._apiEre.guardarParticipacion(payload).subscribe(
            (response) => console.log('Guardado exitoso:', response),
            (error) => console.error('Error al guardar:', error)
        )
    }
    seleccionados() {
        // alert(JSON.stringify(this.targetProducts))
        //console.log('Seleccionados:', this.targetProducts)
    }

    // obtenerParticipaciones(evaluacionId: number, modoCopia: boolean = false) {
    //     this._apiEre
    //         .obtenerParticipaciones(evaluacionId)
    //         .pipe(takeUntil(this.unsubscribe$))
    //         .subscribe({
    //             next: (resp: any) => {
    //                 // this.targetProducts = resp.data.map((item: any) => ({
    //                 //     iIieeId: item.iIieeId,
    //                 //     cIieeNombre: item.cIieeNombre,
    //                 //     cIieeCodigoModular: item.cIieeCodigoModular,
    //                 //     cNivelTipoNombre: item.cNivelTipoNombre,
    //                 // }))
    //                 const participantes = resp.data.map((item: any) => ({
    //                     iIieeId: item.iIieeId,
    //                     cIieeNombre: item.cIieeNombre,
    //                     cIieeCodigoModular: item.cIieeCodigoModular,
    //                     cNivelTipoNombre: item.cNivelTipoNombre,
    //                 }))
    //                 // Cambcio
    //                 if (modoCopia) {
    //                     // Si estamos copiando, setear targetProducts con los participantes copiados
    //                     this.targetProducts = participantes
    //                     this.obtenerIE() // Filtrar los no participantes
    //                     console.log(
    //                         'Participantes copiados para nueva evaluación:',
    //                         this.targetProducts
    //                     )
    //                 } else {
    //                     // Para edición/ver sin copiar, cargar los participantes normalmente
    //                     this.targetProducts = participantes
    //                     this.obtenerIE()
    //                 }
    //                 // cambio
    //                 // Llama a obtenerIE para filtrar las IE no participantes
    //                 this.obtenerIE()
    //             },
    //             error: (error) =>
    //                 console.error('Error al obtener participaciones:', error),
    //         })
    // }
    obtenerParticipaciones(
        evaluacionId: number,
        modoCopia: boolean = false
    ): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this._apiEre
                .obtenerParticipaciones(evaluacionId)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe({
                    next: (resp: any) => {
                        const participantes = resp.data.map((item: any) => ({
                            iIieeId: item.iIieeId,
                            cIieeNombre: item.cIieeNombre,
                            cIieeCodigoModular: item.cIieeCodigoModular,
                            cNivelTipoNombre: item.cNivelTipoNombre,
                        }))
                        if (modoCopia) {
                            this.targetProducts = participantes
                            this.obtenerIE()
                            console.log(
                                'Participantes copiados para nueva evaluación:',
                                this.targetProducts
                            )
                        } else {
                            this.targetProducts = participantes
                            this.obtenerIE()
                        }
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

    // copiarParticipaciones() {
    //     if (this.selectedEvaluacionCopia) {
    //         const evaluacionId = this.selectedEvaluacionCopia.iEvaluacionId
    //         this.obtenerParticipaciones(evaluacionId, true) // Modo copia activado
    //     } else {
    //         console.warn(
    //             'Seleccione una evaluación para copiar las participaciones.'
    //         )
    //     }
    // }
    copiarParticipantes(): void {
        if (
            !this.selectedEvaluacionCopia ||
            typeof this.selectedEvaluacionCopia === 'number'
        ) {
            console.error('No se ha seleccionado una evaluación para copiar')
            return
        }

        const evaluacionIdCopiar = this.selectedEvaluacionCopia.iEvaluacionId

        this.obtenerParticipaciones(evaluacionIdCopiar, true)
            .then((participantes) => {
                this.targetProducts = participantes
                const payload = {
                    items: this.targetProducts.map((participante) => ({
                        iEvaluacionId:
                            this.compartirIdEvaluacionService.iEvaluacionId,
                        iIieeId: participante.iIieeId,
                    })),
                }
                this._apiEre.guardarParticipacion(payload).subscribe(
                    (response) => console.log('Guardado exitoso:', response),
                    (error) => console.error('Error al guardar:', error)
                )
            })
            .catch((error) => {
                console.error('Error al copiar participantes:', error)
            })
    }

    // Evaluaciones Copia
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

        // console.log('Ejecutando obtenerEvaluaciones')
        // this.evaluacionesService.obtenerEvaluacionesCopia().subscribe(
        //     (response) => {
        //         console.log('EVALUACIONES OBTENIDAS:', response)
        //         this.evaluaciones = response // Asignamos el array directamente
        //     },
        //     (error) => {
        //         console.error('Error al obtener las evaluaciones', error)
        //     }
        // )
    }

    onChange() {
        //alert(v)
        // alert(JSON.stringify(event))
        //this.verSeleccion = this.opcionSeleccionado;
    }
}
