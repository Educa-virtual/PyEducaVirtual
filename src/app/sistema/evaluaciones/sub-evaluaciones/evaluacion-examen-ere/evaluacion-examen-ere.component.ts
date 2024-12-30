import { GeneralService } from '@/app/servicios/general.service'
import { Component, OnInit } from '@angular/core'
import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { DropdownModule } from 'primeng/dropdown' // Importar el módulo
import { forkJoin } from 'rxjs'
import { Router, RouterModule } from '@angular/router'

interface Evaluacion {
    iEvaluacionId: number
    cEvaluacionNombre: string
    dtEvaluacionCreacion: string
    idTipoEvalId: number
    iNivelEvalId: number
}
@Component({
    selector: 'app-evaluacion-examen-ere',
    standalone: true,
    imports: [
        TablePrimengComponent,
        ToolbarPrimengComponent,
        DropdownModule,
        RouterModule,
    ],
    providers: [GeneralService],
    templateUrl: './evaluacion-examen-ere.component.html',
    styleUrl: './evaluacion-examen-ere.component.scss',
})
export class EvaluacionExamenEreComponent implements OnInit {
    evaluacionesEreDrop: Evaluacion[] = []
    evaluacionEreTable: any = []
    selectedEvaluacionId: number | null = null
    tipoEvalMap: any = []
    nivelEvalMap: any = []
    nombreTipoEval: string = ''
    nombreNivelEval: string = ''

    constructor(
        private query: GeneralService,
        private router: Router
    ) {}

    ngOnInit() {
        this.getEvaluacionesEre()
    }
    columns = [
        {
            type: 'item',
            width: '1rem',
            field: 'cItem',
            header: 'Nº',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '8rem',
            field: 'cEvaluacionNombre',
            header: 'Nombre de la Evaluación',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '2rem',
            field: 'dtEvaluacionCreacion',
            header: 'Fecha de la evaluacion',
            text_header: 'justify',
            text: 'justify',
        },
        {
            type: 'text',
            width: '2rem',
            field: 'idTipoEvalId',
            header: 'Tipo de evaluación',
            text_header: 'justify',
            text: 'justify',
        },
        {
            type: 'text',
            width: '2rem',
            field: 'iNivelEvalId',
            header: 'Nivel de la evaluacion',
            text_header: 'justify',
            text: 'justify',
        },
        {
            type: 'actions',
            width: '1rem',
            field: 'actions',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ]
    actions = [
        {
            labelTooltip: 'Examen ERE',
            icon: 'pi pi-external-link',
            accion: 'examenEre',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
    ]
    accionBtnItem(elemento): void {
        const { accion } = elemento
        switch (accion) {
            case 'examenEre':
                // this.router.navigate([
                //     'evaluaciones/sub-evaluaciones/evaluacion-examen-ere/examen-ere',
                // ])
                // console.log('ruta')
                // Navegar a la ruta para cargar el componente hijo en el <router-outlet>
                this.router.navigate([
                    'evaluaciones/sub-evaluaciones/evaluacion-examen-ere/examen-ere',
                ])
                break
        }
    }
    //Función que maneja el evento de selección del dropdown
    onEvaluacionSeleccionada(event: any) {
        if (event && event.value) {
            const selectedEvaluacionId = event.value
            this.filterTableByEvaluacionId(selectedEvaluacionId)
        } else {
            console.error('El evento no contiene el valor esperado:', event)
        }
    }

    filterTableByEvaluacionId(selectedEvaluacionId: number) {
        const formatDate = (date: string) =>
            date ? new Date(date).toLocaleDateString() : 'Fecha no disponible'
        this.evaluacionEreTable = this.evaluacionesEreDrop
            .filter(
                (evaluacion) =>
                    !selectedEvaluacionId ||
                    evaluacion.iEvaluacionId === selectedEvaluacionId
            )
            .map((item) => ({
                cItem: item.iEvaluacionId,
                cEvaluacionNombre: item.cEvaluacionNombre || 'Sin nombre',
                dtEvaluacionCreacion: formatDate(item.dtEvaluacionCreacion),
                idTipoEvalId: this.nombreTipoEval,
                iNivelEvalId: this.nombreNivelEval,
            }))
    }

    //!
    // getEvaluacionesEre() {
    //     this.query
    //         .searchCalAcademico({
    //             esquema: 'ere',
    //             tabla: 'evaluacion',
    //             campos: 'iEvaluacionId,cEvaluacionNombre,dtEvaluacionCreacion,idTipoEvalId,iNivelEvalId',
    //             condicion: '1=1',
    //         })
    //         .subscribe({
    //             next: (data: any) => {
    //                 if (data && data.data && Array.isArray(data.data)) {
    //                     this.evaluacionesEreDrop = data.data.sort(
    //                         (a, b) => b.iEvaluacionId - a.iEvaluacionId
    //                     )
    //                     const tipoEvalIds = Array.from(
    //                         new Set(
    //                             this.evaluacionesEreDrop
    //                                 .map((item) => item.idTipoEvalId)
    //                                 .filter(
    //                                     (id) => id !== undefined && id !== null
    //                                 ) // Filtrar valores inválidos
    //                         )
    //                     )

    //                     const nivelEvalIds = Array.from(
    //                         new Set(
    //                             this.evaluacionesEreDrop
    //                                 .map((item) => item.iNivelEvalId)
    //                                 .filter(
    //                                     (id) => id !== undefined && id !== null
    //                                 ) // Filtrar valores inválidos
    //                         )
    //                     )
    //                     const tipoEval$ = this.query.searchCalAcademico({
    //                         esquema: 'ere',
    //                         tabla: 'tipo_evaluaciones',
    //                         campos: 'idTipoEvalId,cTipoEvalDescripcion',
    //                         condicion: `idTipoEvalId IN (${tipoEvalIds.join(',')})`,
    //                     })

    //                     const nivelEval$ = this.query.searchCalAcademico({
    //                         esquema: 'ere',
    //                         tabla: 'nivel_evaluaciones',
    //                         campos: 'iNivelEvalId,cNivelEvalNombre',
    //                         condicion: `iNivelEvalId IN (${nivelEvalIds.join(',')})`,
    //                     })
    //                     forkJoin([tipoEval$, nivelEval$]).subscribe({
    //                         next: ([tipoEvalData, nivelEvalData]: [
    //                             any,
    //                             any,
    //                         ]) => {
    //                             if (
    //                                 tipoEvalData &&
    //                                 Array.isArray(tipoEvalData.data) &&
    //                                 nivelEvalData &&
    //                                 Array.isArray(nivelEvalData.data)
    //                             ) {
    //                                 const tipoEvalMap =
    //                                     tipoEvalData.data.reduce(
    //                                         (acc, item) => {
    //                                             acc[item.idTipoEvalId] =
    //                                                 item.cTipoEvalDescripcion
    //                                             return acc
    //                                         },
    //                                         {} as { [key: number]: string }
    //                                     )

    //                                 const nivelEvalMap =
    //                                     nivelEvalData.data.reduce(
    //                                         (acc, item) => {
    //                                             acc[item.iNivelEvalId] =
    //                                                 item.cNivelEvalNombre
    //                                             return acc
    //                                         },
    //                                         {} as { [key: number]: string }
    //                                     )
    //                                 this.evaluacionEreTable =
    //                                     this.evaluacionesEreDrop.map(
    //                                         (item: any) => ({
    //                                             cItem: item.iEvaluacionId,
    //                                             cEvaluacionNombre:
    //                                                 item.cEvaluacionNombre ||
    //                                                 'Sin nombre',
    //                                             dtEvaluacionCreacion:
    //                                                 item.dtEvaluacionCreacion
    //                                                     ? new Date(
    //                                                           item.dtEvaluacionCreacion
    //                                                       ).toLocaleDateString()
    //                                                     : 'Fecha no disponible',
    //                                             idTipoEvalId:
    //                                                 tipoEvalMap[
    //                                                     item.idTipoEvalId
    //                                                 ] || 'Desconocido',
    //                                             iNivelEvalId:
    //                                                 nivelEvalMap[
    //                                                     item.iNivelEvalId
    //                                                 ] || 'Desconocido',
    //                                         })
    //                                     )
    //                                 this.nombreTipoEval =
    //                                     this.evaluacionEreTable[4].idTipoEvalId
    //                                 this.nombreNivelEval =
    //                                     this.evaluacionEreTable[4].iNivelEvalId
    //                             }
    //                         },
    //                     })
    //                 }
    //             },
    //             error: (error) => {
    //                 console.error('Error fetching:', error)
    //             },
    //             complete: () => {
    //                 console.log('Request completed')
    //             },
    //         })
    // }

    getEvaluacionesEre() {
        this.query
            .searchCalAcademico({
                esquema: 'ere',
                tabla: 'evaluacion',
                campos: 'iEvaluacionId,cEvaluacionNombre,dtEvaluacionCreacion,idTipoEvalId,iNivelEvalId,iEstado',
                condicion: 'iEstado = 1', // Filtrar directamente en la base de datos
            })
            .subscribe({
                next: (data: any) => {
                    console.log('Datos recibidos:', data) // Verificar que los datos lleguen correctamente
                    if (data && data.data && Array.isArray(data.data)) {
                        // No es necesario filtrar, ya que la base de datos ya devuelve solo las evaluaciones activas
                        this.evaluacionesEreDrop = data.data.sort(
                            (a, b) => b.iEvaluacionId - a.iEvaluacionId
                        )

                        const tipoEvalIds = Array.from(
                            new Set(
                                this.evaluacionesEreDrop
                                    .map((item) => item.idTipoEvalId)
                                    .filter(
                                        (id) => id !== undefined && id !== null
                                    )
                            )
                        )

                        const nivelEvalIds = Array.from(
                            new Set(
                                this.evaluacionesEreDrop
                                    .map((item) => item.iNivelEvalId)
                                    .filter(
                                        (id) => id !== undefined && id !== null
                                    )
                            )
                        )

                        const tipoEval$ = this.query.searchCalAcademico({
                            esquema: 'ere',
                            tabla: 'tipo_evaluaciones',
                            campos: 'idTipoEvalId,cTipoEvalDescripcion',
                            condicion: `idTipoEvalId IN (${tipoEvalIds.join(',')})`,
                        })

                        const nivelEval$ = this.query.searchCalAcademico({
                            esquema: 'ere',
                            tabla: 'nivel_evaluaciones',
                            campos: 'iNivelEvalId,cNivelEvalNombre',
                            condicion: `iNivelEvalId IN (${nivelEvalIds.join(',')})`,
                        })

                        forkJoin([tipoEval$, nivelEval$]).subscribe({
                            next: ([tipoEvalData, nivelEvalData]: [
                                any,
                                any,
                            ]) => {
                                if (
                                    tipoEvalData &&
                                    Array.isArray(tipoEvalData.data) &&
                                    nivelEvalData &&
                                    Array.isArray(nivelEvalData.data)
                                ) {
                                    const tipoEvalMap =
                                        tipoEvalData.data.reduce(
                                            (acc, item) => {
                                                acc[item.idTipoEvalId] =
                                                    item.cTipoEvalDescripcion
                                                return acc
                                            },
                                            {} as { [key: number]: string }
                                        )

                                    const nivelEvalMap =
                                        nivelEvalData.data.reduce(
                                            (acc, item) => {
                                                acc[item.iNivelEvalId] =
                                                    item.cNivelEvalNombre
                                                return acc
                                            },
                                            {} as { [key: number]: string }
                                        )

                                    this.evaluacionEreTable =
                                        this.evaluacionesEreDrop.map(
                                            (item: any) => ({
                                                cItem: item.iEvaluacionId,
                                                cEvaluacionNombre:
                                                    item.cEvaluacionNombre ||
                                                    'Sin nombre',
                                                dtEvaluacionCreacion:
                                                    item.dtEvaluacionCreacion
                                                        ? new Date(
                                                              item.dtEvaluacionCreacion
                                                          ).toLocaleDateString()
                                                        : 'Fecha no disponible',
                                                idTipoEvalId:
                                                    tipoEvalMap[
                                                        item.idTipoEvalId
                                                    ] || 'Desconocido',
                                                iNivelEvalId:
                                                    nivelEvalMap[
                                                        item.iNivelEvalId
                                                    ] || 'Desconocido',
                                            })
                                        )

                                    this.nombreTipoEval =
                                        this.evaluacionEreTable[4].idTipoEvalId
                                    this.nombreNivelEval =
                                        this.evaluacionEreTable[4].iNivelEvalId
                                }
                            },
                        })
                    }
                },
                error: (error) => {
                    console.error('Error fetching:', error)
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }
}
