// import {
//     Component,
//     ChangeDetectorRef,
//     inject,
//     OnInit,
//     Output,
//     EventEmitter,
// }
import { Component, ChangeDetectorRef, inject, OnInit } from '@angular/core'
/*import { Product } from '@domain/product';
import { ProductService } from '@service/productservice';*/
import { Product } from 'src/app/demo/api/product'
import { ProductService } from 'src/app/demo/service/product.service'
import { PickListModule } from 'primeng/picklist'

import { ApiEvaluacionesRService } from '../../../services/api-evaluaciones-r.service'
import { Subject, takeUntil } from 'rxjs'
//import dayjs from 'dayjs'
import { FormsModule } from '@angular/forms'
import { DropdownModule } from 'primeng/dropdown'
import { IconFieldModule } from 'primeng/iconfield'
import { InputIconModule } from 'primeng/inputicon'
import { InputTextModule } from 'primeng/inputtext'

import { ButtonModule } from 'primeng/button'

/*interface City {
  name: string;
  code: string;
}*/
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
    private unsubscribe$: Subject<boolean> = new Subject()
    public params = {
        iCompentenciaId: 0,
        iCapacidadId: 0,
        iDesempenioId: 0,
        bPreguntaEstado: -1,
    }
    public data = []

    private _apiEre = inject(ApiEvaluacionesRService)
    sourceProducts!: Product[]

    targetProducts!: Product[]

    nivelTipo: NivelTipo[] | undefined
    selectedNivelTipo: NivelTipo | undefined

    Ugeles: Ugeles[] | undefined
    selectedUgeles: Ugeles | undefined

    constructor(
        private carService: ProductService,
        private cdr: ChangeDetectorRef
    ) {}
    ngOnInit() {
        this.carService.getProductsSmall().then((products) => {
            this.sourceProducts = products
            this.cdr.markForCheck()
        })
        this.targetProducts = []

        this.obtenerIE()
        this.obtenerNivelTipo()
        this.obtenerugel()

        this.nivelTipo = [
            { cNivelTipoNombre: 'Primaria', iNivelTipoId: 'NY' },
            { cNivelTipoNombre: 'Secundaria', iNivelTipoId: 'RM' },
        ]
    }

    obtenerIE() {
        this._apiEre
            .obtenerIE(this.params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (resp: unknown) => {
                    /*.competencias = resp['data']
                    this.competencias.unshift({
                        iCompentenciaId: 0,
                        cCompetenciaDescripcion: 'Todos',
                    })*/
                    console.log('Datos obtenidos de obtenerIE:', resp) // Imprime la respuesta completa
                    this.data = resp['data']
                    console.log('Data asignada a this.data:', this.data) // Imprime los datos asignados
                    this.sourceProducts = this.data
                    //is.data = resp['data'] //aqui recueprar
                    //alert(JSON.stringify(this.data))
                    //this.sourceProducts = this.data //aqui recuperar
                },
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
    IEnoparticipan(event: any) {
        // Obtener los elementos movidos
        const itemsMoved = event.items
        console.log(
            'Elementos movidos de IEnoparticipan a IEparticipan:',
            itemsMoved
        )
    }
    // IEparticipan(event: any) {
    //     // Obtener los elementos movidos
    //     const itemsMoved = event.items
    //     console.log(
    //         'Elementos movidos de IEpertenece a IEnopertenece :',
    //         itemsMoved
    //     )
    // }
    // Cuando se mueve un elemento a "Participan"
    IEparticipan(event: any) {
        const itemsMoved = event.items
        console.log('Moviendo a Participan:', itemsMoved)
        const payload = {
            items: itemsMoved.map((item) => ({
                iEvaluacionId: 107, //!ESTA EN MODO MANUAL; CAMBIAR POR EL ID DE LA EVALUACION
                iIieeId: item.iIieeId,
            })),
        }
        this._apiEre.guardarParticipacion(payload).subscribe(
            (response) => console.log('Guardado exitoso:', response),
            (error) => console.error('Error al guardar:', error)
        )
    }

    // Cuando se mueve un elemento a "No participan"
    // IEnoparticipan(event: any) {
    //     const itemsMoved = event.items
    //     console.log('Moviendo a No participan:', itemsMoved)
    //     this._apiEre.eliminarParticipacion(itemsMoved).subscribe(
    //         (response) => console.log('Eliminación exitosa:', response),
    //         (error) => console.error('Error al eliminar:', error)
    //     )
    // }

    IEnoparticipanall(event: any) {
        // Obtener los elementos movidos
        const itemsMoved = event.items
        console.log(
            'Elementos movidos de IEnoparticipan a IEparticipan:',
            itemsMoved
        )
    }
    IEparticipanall(event: any) {
        const itemsMoved = event.items
        console.log('Moviendo a Participan:', itemsMoved)
        const payload = {
            items: itemsMoved.map((item) => ({
                iEvaluacionId: 107, //!ESTA EN MODO MANUAL; CAMBIAR POR EL ID DE LA EVALUACION
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
        console.log('Seleccionados:', this.targetProducts)
    }
    onChange() {
        //alert(v)
        // alert(JSON.stringify(event))
        //this.verSeleccion = this.opcionSeleccionado;
    }
}
