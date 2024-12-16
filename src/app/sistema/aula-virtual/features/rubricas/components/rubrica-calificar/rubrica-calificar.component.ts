// import { Component, inject, OnDestroy, OnInit } from '@angular/core'
// import { AccordionModule } from 'primeng/accordion'
// import { CommonModule } from '@angular/common'
// import {
//     IColumn,
//     TablePrimengComponent,
// } from '@/app/shared/table-primeng/table-primeng.component'
// import { Subject, takeUntil } from 'rxjs'
// import { ApiEvaluacionesService } from '@/app/sistema/aula-virtual/services/api-evaluaciones.service'
// import { ActivatedRoute } from '@angular/router'

// @Component({
//     selector: 'app-rubrica-calificar',
//     standalone: true,
//     imports: [AccordionModule, CommonModule, TablePrimengComponent],

//     templateUrl: './rubrica-calificar.component.html',
//     styleUrl: './rubrica-calificar.component.scss',
// })
// export class RubricaCalificarComponent implements OnInit, OnDestroy {
//     columns: IColumn[] = [
//         {
//             type: 'text',
//             width: '5rem',
//             field: 'cNivel1',
//             header: 'Nivel 1',
//             text_header: 'left',
//             text: 'left',
//         },
//         {
//             type: 'text',
//             width: '5rem',
//             field: 'cNivel2',
//             header: 'Nivel 2',
//             text_header: 'left',
//             text: 'left',
//         },
//         {
//             type: 'text',
//             width: '5rem',
//             field: 'cNivel3',
//             header: 'Nivel 3',
//             text_header: 'left',
//             text: 'left',
//         },
//     ]

//     rubrica
//     params = {
//         iInstrumentoId: undefined,
//     }
//     data

//     _unsubscribe$ = new Subject<boolean>()

//     private _evaluacionApiService = inject(ApiEvaluacionesService)

//     constructor(private route: ActivatedRoute) {}

//     ngOnInit(): void {
//         this.route.queryParamMap.subscribe((params) => {

//             this.params.iInstrumentoId = params.get('iInstrumentoId')

//             this.getRubrica()
//         })
//     }

//     selection(data) {
//         console.log(data)
//     }

//     getRubrica() {
//         if (this.params?.iInstrumentoId) {
//             this._evaluacionApiService
//                 .obtenerRubrica(this.params)
//                 .pipe(takeUntil(this._unsubscribe$))
//                 .subscribe({
//                     next: (data) => {
//                         this.data = data
//                         console.log(data)
//                     },
//                 })
//         }
//     }

//     ngOnDestroy() {
//         this._unsubscribe$.next(true)
//         this._unsubscribe$.complete()
//     }
// }
