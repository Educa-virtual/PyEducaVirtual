import { CompartirIdEvaluacionService } from './../../../services/ereEvaluaciones/compartir-id-evaluacion.service'
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
    @Input() _iEvaluacionId: number

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

    constructor(
        private cdr: ChangeDetectorRef,
        private compartirIdEvaluacionService: CompartirIdEvaluacionService,
        private _config: DynamicDialogConfig, // Inyectar configuración
        private evaluacionesService: ApiEvaluacionesRService // Inyecta el servicio -> Evaliacion Copiar
    ) {}
    public allIEs = [] // Lista completa de IE para filtrar los no participantes
    esModoEdicion: boolean = false // Cambiar a true si estás en modo edición
    iEvaluacionId: number // Aquí se vincula el valor seleccionado

    ngOnInit() {
        console.log('Iniciando componente con config:', this._config.data)

        // Determinar el modo
        //this.accion = this._config.data?.accion || 'crear'
        //this.esModoEdicion = this.accion === 'editar'
        this.accion = this._config.data?.accion || 'crear'
        console.log('Acción actual:', this.accion)

        this.obtenerIE()
        this.obtenerNivelTipo()
        this.obtenerugel()
        this.obtenerEvaluacionesCopia()

        this.nivelTipo = [
            { cNivelTipoNombre: 'Primaria', iNivelTipoId: 'NY' },
            { cNivelTipoNombre: 'Secundaria', iNivelTipoId: 'RM' },
        ]
        // Inicializar según el modo
        if (this.accion === 'crear') {
            this.targetProducts = [] // Asegurar que la lista destino esté vacía
            this.obtenerIE() // Solo obtener la lista de IEs disponibles
        }
        if (this.accion === 'ver') {
            this.obtenerParticipaciones(
                this.compartirIdEvaluacionService.iEvaluacionId
            )
            //this.isDisabled = true // Deshabilita visualmente la sección
        }
        if (this.accion === 'editar') {
            this.obtenerParticipaciones(this._iEvaluacionId)
            //this.isDisabled = true // Deshabilita visualmente la sección
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
                        cUgelNombre: item.cUgelNombre, // Asegúrate de incluir esta propiedad
                    }))

                    // Filtra las IE que no están en `targetProducts`
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
    IEparticipan(event: any) {
        const itemsMoved = event.items
        // console.log('Moviendo a Participan:', itemsMoved)
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

    IEnoparticipan(event: any) {
        const itemsMoved = event.items
        // console.log(
        //     'Elementos movidos de IEnoparticipan a IEparticipan:',
        //     itemsMoved
        // )

        // Obtenemos los objetos con iIieeId e iEvaluacionId para eliminarlos
        const participacionesToDelete = itemsMoved.map((item) => ({
            iIieeId: item.iIieeId,
            iEvaluacionId: this.compartirIdEvaluacionService.iEvaluacionId, // Asumiendo que iEvaluacionId está disponible en el componente
        }))

        if (participacionesToDelete.length > 0) {
            // Realizamos la eliminación en bloque enviando los objetos necesarios
            this._apiEre
                .eliminarParticipacion(participacionesToDelete)
                .subscribe(
                    (response) => {
                        console.log('Eliminación exitosa:', response)
                    },
                    (error) => {
                        console.error('Error al eliminar:', error)
                    }
                )
        } else {
            console.warn('No hay elementos para eliminar.')
        }
    }
    IEparticipanall(event: any) {
        const itemsMoved = event.items
        // console.log('Moviendo a Participan:', itemsMoved)
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
    IEnoparticipanall(event: any) {
        const itemsMoved = event.items
        // console.log(
        //     'Elementos movidos de IEnoparticipan a IEparticipan:',
        //     itemsMoved
        // )

        // Obtenemos los objetos con iIieeId e iEvaluacionId para eliminarlos
        const participacionesToDelete = itemsMoved.map((item) => ({
            iIieeId: item.iIieeId,
            iEvaluacionId: this.compartirIdEvaluacionService.iEvaluacionId, // Asumiendo que iEvaluacionId está disponible en el componente
        }))

        if (participacionesToDelete.length > 0) {
            // Realizamos la eliminación en bloque enviando los objetos necesarios
            this._apiEre
                .eliminarParticipacion(participacionesToDelete)
                .subscribe(
                    (response) => {
                        console.log('Eliminación exitosa:', response)
                    },
                    (error) => {
                        console.error('Error al eliminar:', error)
                    }
                )
        } else {
            console.warn('No hay elementos para eliminar.')
        }
    }
    seleccionados() {
        // alert(JSON.stringify(this.targetProducts))
        //console.log('Seleccionados:', this.targetProducts)
    }
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
                            // console.log(
                            //     'Participantes copiados para nueva evaluación:',
                            //     this.targetProducts
                            // )
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
    }
    //Filtro
    filterIEs() {
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

            return nivelTipoMatch && ugelMatch
        })

        // console.log(
        //     'Instituciones no participantes (filtradas):',
        //     this.sourceProducts
        // )
    }
    onNivelTipoChange(event: any) {
        this.selectedNivelTipo = event.value
        this.filterIEs() // Filtrar los elementos al cambiar el nivel tipo
    }

    onUgelChange(event: any) {
        this.selectedUgeles = event.value
        this.filterIEs() // Filtrar los elementos al cambiar el ugel
    }
    onChange() {}
}
