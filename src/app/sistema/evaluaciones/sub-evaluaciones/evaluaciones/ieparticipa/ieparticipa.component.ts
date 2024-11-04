// import {
//     Component,
//     ChangeDetectorRef,
//     inject,
//     OnInit,
//     Output,
//     EventEmitter,
// }
//Agregar Servicio de Evaluacion
import { CompartirIdEvaluacionService } from './../../../services/ereEvaluaciones/compartir-id-evaluacion.service'
import { Component, ChangeDetectorRef, inject, OnInit } from '@angular/core'
/*import { Product } from '@domain/product';
import { ProductService } from '@service/productservice';*/
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
    sourceProducts!: any

    targetProducts!: any

    nivelTipo: NivelTipo[] | undefined
    selectedNivelTipo: NivelTipo | undefined

    Ugeles: Ugeles[] | undefined
    selectedUgeles: Ugeles | undefined
    itemsToDelete: any

    constructor(
        private cdr: ChangeDetectorRef,
        private compartirIdEvaluacionService: CompartirIdEvaluacionService
    ) {}
    ngOnInit() {
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
        console.log('Seleccionados:', this.targetProducts)
    }
    onChange() {
        //alert(v)
        // alert(JSON.stringify(event))
        //this.verSeleccion = this.opcionSeleccionado;
    }
}
