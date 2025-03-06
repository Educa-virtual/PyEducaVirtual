import { PrimengModule } from '@/app/primeng.module'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { GeneralService } from '@/app/servicios/general.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { environment } from '@/environments/environment'
import { HttpClient } from '@angular/common/http'
import { Component, inject, OnInit } from '@angular/core'
import { MessageService } from 'primeng/api'
import { catchError, map, throwError } from 'rxjs'
import { ApiEvaluacionesService } from '../../aula-virtual/services/api-evaluaciones.service'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { Router } from '@angular/router'

@Component({
    selector: 'app-portafolio',
    standalone: true,
    imports: [PrimengModule, TablePrimengComponent],
    templateUrl: './portafolio.component.html',
    styleUrl: './portafolio.component.scss',
})
export class PortafolioComponent implements OnInit {
    private _ConstantesService = inject(ConstantesService)
    private _GeneralService = inject(GeneralService)
    private _MessageService = inject(MessageService)
    private http = inject(HttpClient)
    private _LocalStoreService = inject(LocalStoreService)
    private _evaluacionApiService = inject(ApiEvaluacionesService)
    private router = inject(Router)

    backend = environment.backend
    private backendApi = environment.backendApi

    cPortafolioFichaPermanencia
    cPortafolioPerfilEgreso
    cPortafolioPlanEstudios
    cPortafolioItinerario = []
    cPortafolioProgramaCurricular
    cPortafolioFichasDidacticas
    cPortafolioSesionesAprendizaje

    reglamento = []
    rubricas = []
    cursos = []
    showModalRubricas: boolean = false

    public columnasTabla = [
        {
            type: 'text',
            width: '5rem',
            field: 'cInstrumentoNombre',
            header: 'Instrumento de Evaluación',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'cInstrumentoDescripcion',
            header: 'Descripcion',
            text_header: 'left',
            text: 'left',
        },
    ]

    ngOnInit() {
        this.obtenerPortafolios()
        this.obtenerCuadernosCampo()
        this.obtenerRubricas()
    }
    getInformation(params, accion) {
        this._GeneralService.getGralPrefix(params).subscribe({
            next: (response) => {
                if (accion === 'docente-obtenerPortafolios') {
                    const data = response?.reglamento
                    this.reglamento = []
                    const reglamento = data.length
                        ? data[0]['cIieeUrlReglamentoInterno']
                            ? JSON.parse(data[0]['cIieeUrlReglamentoInterno'])
                            : []
                        : []
                    this.reglamento.push(reglamento)
                }
                this.accionBtnItem({ accion, item: response?.data })
            },
            complete: () => {},
            error: (error) => {
                this._MessageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error,
                })
            },
        })
    }

    accionBtnItem(elemento): void {
        const { accion } = elemento
        const { item } = elemento
        switch (accion) {
            case 'docente-obtenerPortafolios':
                item.length
                    ? (this.cPortafolioItinerario = item[0][
                          'cPortafolioItinerario'
                      ]
                          ? JSON.parse(item[0]['cPortafolioItinerario'])
                          : [])
                    : []

                break
            case 'docente-obtenerCuadernosCampo':
                this.cursos = item
                this.cursos.forEach(
                    (item) =>
                        (item.cCuadernoUrl = item.cCuadernoUrl
                            ? JSON.parse(item.cCuadernoUrl)
                            : item.cCuadernoUrl)
                )
                this.cursos.forEach((item) => {
                    const data = item.cCuadernoUrl

                    const fichas = data
                        ? data.find((fi) => fi.typePortafolio === 1)
                        : null
                    item.bFichas = fichas?.name ? true : false
                    const cuadernos = data
                        ? data.find((fi) => fi.typePortafolio === 2)
                        : null
                    item.bCuadernos = cuadernos?.name ? true : false
                })
                break
            case 'docente-guardarItinerario':
                this.obtenerPortafolios()
                break
            case 'docente-guardarFichasCuadernosCampo':
                this.obtenerCuadernosCampo()
                break
        }
    }
    obtenerPortafolios() {
        const params = {
            petition: 'post',
            group: 'docente',
            prefix: 'portafolios',
            ruta: 'obtenerPortafolios',
            data: {
                iDocenteId: this._ConstantesService.iDocenteId,
                iYAcadId: this._ConstantesService.iYAcadId,
                iCredId: this._ConstantesService.iCredId,
            },
            params: { skipSuccessMessage: true },
        }
        this.getInformation(params, params.group + '-' + params.ruta)
    }

    obtenerCuadernosCampo() {
        const year = this._LocalStoreService.getItem('dremoYear')
        const params = {
            petition: 'post',
            group: 'docente',
            prefix: 'cuadernos-campo',
            ruta: 'obtenerCuadernosCampo',
            data: {
                iPersId: this._ConstantesService.iPersId,
                iYearId: year,
                iSemAcadId: null,
                iIieeId: null,
            },
            params: { skipSuccessMessage: true },
        }
        this.getInformation(params, params.group + '-' + params.ruta)
    }

    guardarItinerario() {
        const params = {
            petition: 'post',
            group: 'docente',
            prefix: 'portafolios',
            ruta: 'guardarItinerario',
            data: {
                iDocenteId: this._ConstantesService.iDocenteId,
                iYAcadId: this._ConstantesService.iYAcadId,
                cPortafolioItinerario: JSON.stringify(
                    this.cPortafolioItinerario
                ),
            },
            params: { skipSuccessMessage: true },
        }
        this.getInformation(params, params.group + '-' + params.ruta)
    }

    guardarFichasCuadernosCampo(item) {
        const params = {
            petition: 'post',
            group: 'docente',
            prefix: 'cuadernos-campo',
            ruta: 'guardarFichasCuadernosCampo',
            data: {
                iSilaboId: item.iSilaboId,
                cCuadernoUrl: item.cCuadernoUrl.length
                    ? JSON.stringify(item.cCuadernoUrl)
                    : [],
            },
            params: { skipSuccessMessage: true },
        }
        this.getInformation(params, params.group + '-' + params.ruta)
    }

    obtenerRubricas() {
        const params = {
            iDocenteId: this._ConstantesService.iDocenteId,
        }
        this._evaluacionApiService.obtenerRubricas(params).subscribe({
            next: (data) => {
                data.forEach((element) => {
                    this.rubricas.push(element)
                })
            },
        })
    }

    rubricasCurso = []
    obtenerRubricasxiCursoId(item) {
        this.rubricasCurso = []
        this.rubricasCurso = this.rubricas.filter(
            (i) => i.iCursoId === item.iCursoId
        )
        this.showModalRubricas = true
    }

    getCursosDocente(item) {
        const year = this._LocalStoreService.getItem('dremoYear')
        const params = {
            petition: 'post',
            group: 'docente',
            prefix: 'docente-cursos',
            ruta: 'list', //'getDocentesCursos',
            data: {
                opcion: 'CONSULTARxiPersIdxiYearIdxiCursoId',
                iCredId: this._ConstantesService.iCredId,
                valorBusqueda: year, //iYearId
                iSemAcadId: null,
                iIieeId: null,
                idDocCursoId: item.iCursoId,
            },
            params: { skipSuccessMessage: true },
        }
        this._GeneralService.getGralPrefix(params).subscribe({
            next: (response) => {
                if (response.validated) {
                    const data = response.data
                    if (data.length) {
                        const curso = data[0]
                        this.router.navigate(
                            [
                                'aula-virtual/areas-curriculares/',
                                curso.iSilaboId,
                            ],
                            {
                                queryParams: {
                                    cCursoNombre: curso.cCursoNombre,
                                    cNivelTipoNombre: curso.cNivelTipoNombre,
                                    cGradoAbreviacion: curso.cGradoAbreviacion,
                                    cSeccion: curso.cSeccion,
                                    cCicloRomanos: curso.cCicloRomanos,
                                    cNivelNombreCursos:
                                        curso.cNivelNombreCursos,
                                    iCursoId: curso.iCursoId,
                                    idDocCursoId: curso.idDocCursoId,
                                    tab: 'resultados',
                                },
                            }
                        )
                    }
                }
                console.log(response)
            },
            complete: () => {},
            error: (error) => {
                console.log(error)
            },
        })
    }

    async onUploadChange(evt: any, tipo: any, item: any) {
        const file = evt.target.files[0]

        if (file) {
            const dataFile = await this.objectToFormData({
                file: file,
                nameFile: tipo,
            })
            this.http
                .post(
                    `${this.backendApi}/general/subir-archivo?` +
                        'skipSuccessMessage=true',
                    dataFile
                )
                .pipe(
                    map((event: any) => {
                        if (event.validated) {
                            switch (tipo) {
                                case 'itinerario':
                                    this.cPortafolioItinerario = []
                                    this.cPortafolioItinerario.push({
                                        name: file.name,
                                        ruta: event.data,
                                    })
                                    this.guardarItinerario()
                                    break
                                case 'fichas-aprendizaje':
                                    //1:fichas-aprendizaje
                                    //2:cuadernos-campo
                                    const cuadernos = item.cCuadernoUrl
                                        ? item.cCuadernoUrl.filter(
                                              (i) => i.typePortafolio === 2
                                          )
                                        : []
                                    item.cCuadernoUrl = []
                                    item.cCuadernoUrl.push({
                                        typePortafolio: 1,
                                        name: file.name,
                                        ruta: event.data,
                                    })
                                    if (cuadernos.length) {
                                        item.cCuadernoUrl.push(cuadernos[0])
                                    }
                                    this.guardarFichasCuadernosCampo(item)
                                    break
                                case 'cuadernos-campo':
                                    const fichas = item.cCuadernoUrl
                                        ? item.cCuadernoUrl.filter(
                                              (i) => i.typePortafolio === 1
                                          )
                                        : []

                                    item.cCuadernoUrl = []
                                    if (fichas.length) {
                                        item.cCuadernoUrl.push(fichas[0])
                                    }
                                    item.cCuadernoUrl.push({
                                        typePortafolio: 2,
                                        name: file.name,
                                        ruta: event.data,
                                    })
                                    this.guardarFichasCuadernosCampo(item)
                                    break
                            }
                        }
                    }),
                    catchError((err: any) => {
                        return throwError(err.message)
                    })
                )
                .toPromise()
        }
    }

    objectToFormData(obj: any) {
        const formData = new FormData()
        Object.keys(obj).forEach((key) => {
            if (obj[key] !== '') {
                formData.append(key, obj[key])
            }
        })

        return formData
    }

    openLink(item) {
        if (!item) return
        const ruta = environment.backend + '/' + item
        window.open(ruta, '_blank')
    }
}
