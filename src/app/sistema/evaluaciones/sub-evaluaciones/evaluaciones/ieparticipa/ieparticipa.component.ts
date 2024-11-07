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
    // sourceProducts!: Product[]

    // targetProducts!: Product[]
    // sourceProducts: Product[]

    // targetProducts: Product[]
    public sourceProducts: any[] = [] // IEs no participantes
    public targetProducts: any[] = [] // IEs participantes
    nivelTipo: NivelTipo[] | undefined
    selectedNivelTipo: NivelTipo | undefined

    Ugeles: Ugeles[] | undefined
    selectedUgeles: Ugeles | undefined
    itemsToDelete: any

    constructor(
        private carService: ProductService,
        private cdr: ChangeDetectorRef,
        private compartirIdEvaluacionService: CompartirIdEvaluacionService,
        private _config: DynamicDialogConfig // Inyectar configuración
    ) {}
    //public sourceProducts: Product[] = []
    //public targetProducts: Product[] = [] // Lista de IE que participan
    public allIEs: Product[] = [] // Lista completa de IE para filtrar los no participantes
    ngOnInit() {
        // Obtener la acción del config
        // this.accion = this._config.data?.accion || 'crear' // bien
        // this.esModoEdicion = this.accion === 'editar'    //bien
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
        //this.targetProducts = []

        this.obtenerIE()
        this.obtenerNivelTipo()
        this.obtenerugel()

        // console.log('Acción:', this.accion)
        // console.log(
        //     'ID Evaluación del config:',
        //     this._config.data?.evaluacionId
        // )
        // console.log(
        //     'ID Evaluación del servicio:',
        //     this.compartirIdEvaluacionService.iEvaluacionId
        // )

        // // Si estamos en modo "ver", deshabilitamos las interacciones
        // if (this.accion === 'ver') {
        //     this.evaluacionFormGroup?.disable()
        // }

        // // Obtener participaciones solo si tenemos un ID válido
        // const evaluacionId =
        //     this._config.data?.evaluacionId ||
        //     this.compartirIdEvaluacionService.iEvaluacionId
        // if (evaluacionId) {
        //     console.log(
        //         'Llamando a obtenerParticipaciones con ID:',
        //         evaluacionId
        //     )
        //     this.obtenerParticipaciones(evaluacionId)
        // } else {
        //     console.warn('No se encontró ID de evaluación válido')
        // }

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
    // obtenerIE() {
    //     this._apiEre
    //         .obtenerIE(this.params)
    //         .pipe(takeUntil(this.unsubscribe$))
    //         .subscribe({
    //             // next: (resp: unknown) => {
    //             next: (resp: any) => {
    //                 console.log('Datos de IEs recibidos:', resp)
    //                 // En modo crear, todos los IEs van a sourceProducts
    //                 this.sourceProducts = resp.data.map((item: any) => ({
    //                     ...item,
    //                     iIieeId: item.iIieeId,
    //                     cIieeNombre: item.cIieeNombre,
    //                     cIieeCodigoModular: item.cIieeCodigoModular,
    //                     cNivelTipoNombre: item.cNivelTipoNombre,
    //                 }))
    //                 this.targetProducts = [] // Mantener la lista destino vacía
    //                 console.log(
    //                     'Source Products actualizados:',
    //                     this.sourceProducts
    //                 )
    //                 console.log('Target Products vacíos:', this.targetProducts)
    //             },
    //             error: (error) => {
    //                 console.error('Error al obtener IEs:', error)

    //                 // if (this.accion === 'crear') {
    //                 //     // En modo crear, todos los IE van a sourceProducts
    //                 //     this.sourceProducts = resp.data
    //                 //     this.targetProducts = [] // Aseguramos que targetProducts esté vacío
    //                 // }
    //                 // console.log('Datos obtenidos de obtenerIE:', resp) // Imprime la respuesta completa
    //                 // this.data = resp['data']
    //                 // console.log('Data asignada a this.data:', this.data) // Imprime los datos asignados
    //                 // this.sourceProducts = this.data
    //             },
    //         })
    // }

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
        const itemsMoved = event.items
        console.log(
            'Elementos movidos de IEnoparticipan a IEparticipan:',
            itemsMoved
        )
        itemsMoved.forEach((item) => {
            console.log('ID a eliminar:', item.iIieeId)
            console.log('Nombre a eliminar:', item.cIieeNombre)
            console.log('Codigo Modular a eliminar:', item.iIeeParticipaId)

            this._apiEre.eliminarParticipacion(item.iIieeId).subscribe(
                (response) => console.log('Eliminación exitosa:', response),
                (error) => console.error('Error al eliminar:', error)
            )
        })
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
    //iEvaluacionId: number
    // obtenerParticipaciones(iEvaluacionId: number) {
    //     console.log(
    //         'Valor de iEvaluacionId antes de la llamada:',
    //         this.compartirIdEvaluacionService.iEvaluacionId
    //     )
    //     console.log('ID de evaluación enviado:', iEvaluacionId)

    //     this._apiEre
    //         .obtenerParticipaciones(iEvaluacionId)
    //         .pipe(takeUntil(this.unsubscribe$))
    //         .subscribe({
    //             next: (resp: any) => {
    //                 console.log('Participaciones obtenidas:', resp)

    //                 // Dividir los datos entre los que participan y no participan
    //                 this.sourceProducts = resp.data.filter(
    //                     (item: any) => !item.participa
    //                 )
    //                 this.targetProducts = resp.data.filter(
    //                     (item: any) => item.participa
    //                 )
    //             },
    //             error: (error) => {
    //                 console.error('Error al obtener participaciones:', error)
    //             },
    //         })
    // }
    //CAMBIOS

    //BIEN
    // obtenerParticipaciones(iEvaluacionId: number) {
    //     if (!iEvaluacionId) {
    //         console.warn('obtenerParticipaciones llamado sin ID válido')
    //         return
    //     }
    //     console.log('ID de evaluación enviado:', iEvaluacionId)

    //     this._apiEre
    //         .obtenerParticipaciones(iEvaluacionId)
    //         .pipe(takeUntil(this.unsubscribe$))
    //         .subscribe({
    //             next: (resp: any) => {
    //                 // Verifica la estructura de la respuesta completa
    //                 console.log('Estructura completa de resp:', resp)
    //                 // Asegúrate de que `resp.data` tiene los datos esperados
    //                 console.log('Datos en resp.data:', resp.data)

    //                 // Dividir datos en base a `participa`
    //                 this.targetProducts = resp.data
    //                     .filter((item: any) => !item.participa) // IE no participan
    //                     .map((item: any) => ({
    //                         ...item,
    //                         cIieeNombre: item.cIieeNombre,
    //                         cIieeCodigoModular: item.cIieeCodigoModular,
    //                         cNivelTipoNombre: item.cNivelTipoNombre,
    //                     }))

    //                 this.sourceProducts = resp.data
    //                     .filter((item: any) => item.participa) // IE participan
    //                     .map((item: any) => ({
    //                         ...item,
    //                         cIieeNombre: item.cIieeNombre,
    //                         cIieeCodigoModular: item.cIieeCodigoModular,
    //                         cNivelTipoNombre: item.cNivelTipoNombre,
    //                     }))

    //                 console.log('IE No participan:', this.sourceProducts)
    //                 console.log('IE Participan:', this.targetProducts)
    //             },
    //             error: (error) => {
    //                 console.error('Error al obtener participaciones:', error)
    //             },
    //         })
    // }

    // obtenerParticipaciones(iEvaluacionId: number) {
    //     console.log(
    //         'Obteniendo participaciones para modo editar/ver, ID:',
    //         iEvaluacionId
    //     )
    //     if (!iEvaluacionId) {
    //         console.warn('ID de evaluación no válido')
    //         return
    //     }

    //     this._apiEre
    //         .obtenerParticipaciones(iEvaluacionId)
    //         .pipe(takeUntil(this.unsubscribe$))
    //         .subscribe({
    //             next: (resp: any) => {
    //                 console.log('Datos de participaciones recibidos:', resp)

    //                 // Separar IEs que participan y no participan
    //                 this.sourceProducts = resp.data
    //                     .filter((item: any) => item.participa)
    //                     .map((item: any) => ({
    //                         ...item,
    //                         iIieeId: item.iIieeId,
    //                         cIieeNombre: item.cIieeNombre,
    //                         cIieeCodigoModular: item.cIieeCodigoModular,
    //                         cNivelTipoNombre: item.cNivelTipoNombre,
    //                     }))

    //                 this.targetProducts = resp.data
    //                     .filter((item: any) => !item.participa)
    //                     .map((item: any) => ({
    //                         ...item,
    //                         iIieeId: item.iIieeId,
    //                         cIieeNombre: item.cIieeNombre,
    //                         cIieeCodigoModular: item.cIieeCodigoModular,
    //                         cNivelTipoNombre: item.cNivelTipoNombre,
    //                     }))

    //                 console.log(
    //                     'Source Products actualizados:',
    //                     this.sourceProducts
    //                 )
    //                 console.log(
    //                     'Target Products actualizados:',
    //                     this.targetProducts
    //                 )
    //             },
    //             error: (error) => {
    //                 console.error('Error al obtener participaciones:', error)
    //             },
    //         })
    // }

    obtenerParticipaciones(evaluacionId: number) {
        this._apiEre
            .obtenerParticipaciones(evaluacionId)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (resp: any) => {
                    this.targetProducts = resp.data.map((item: any) => ({
                        iIieeId: item.iIieeId,
                        cIieeNombre: item.cIieeNombre,
                        cIieeCodigoModular: item.cIieeCodigoModular,
                        cNivelTipoNombre: item.cNivelTipoNombre,
                    }))

                    // Llama a obtenerIE para filtrar las IE no participantes
                    this.obtenerIE()
                },
                error: (error) =>
                    console.error('Error al obtener participaciones:', error),
            })
    }
    onChange() {
        //alert(v)
        // alert(JSON.stringify(event))
        //this.verSeleccion = this.opcionSeleccionado;
    }
}
