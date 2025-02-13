import { PrimengModule } from '@/app/primeng.module'
import { GeneralService } from '@/app/servicios/general.service'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { ApiEvaluacionesRService } from '@/app/sistema/evaluaciones/services/api-evaluaciones-r.service'
import { NgIf } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular'
import { MenuItem, MessageService } from 'primeng/api'
import { abecedario } from '@/app/sistema/aula-virtual/constants/aula-virtual'
import { HttpClient } from '@angular/common/http'
import { environment } from '@/environments/environment'
import { catchError, map, throwError } from 'rxjs'

@Component({
    selector: 'app-preguntas',
    standalone: true,
    imports: [PrimengModule, ContainerPageComponent, EditorComponent, NgIf],
    templateUrl: './preguntas.component.html',
    styleUrl: './preguntas.component.scss',
    providers: [
        { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
    ],
})
export class PreguntasComponent implements OnInit {
    private _GeneralService = inject(GeneralService)
    private _MessageService = inject(MessageService)
    private _apiEre = inject(ApiEvaluacionesRService)
    private _ConfirmationModalService = inject(ConfirmationModalService)
    private http = inject(HttpClient)

    private backendApi = environment.backendApi

    iEvaluacionId = '795'
    iCursoNivelGradId = '2'
    data
    matrizCompetencia = []
    matrizCapacidad = []

    init: EditorComponent['init'] = {
        base_url: '/tinymce', // Root for resources
        suffix: '.min', // Suffix to use when loading resources
        menubar: false,
        selector: 'textarea',
        placeholder: 'Escribe aqui...',
        plugins: 'lists image table',
        toolbar:
            'undo redo | forecolor backcolor | bold italic underline strikethrough | ' +
            'alignleft aligncenter alignright alignjustify | bullist numlist | ' +
            'image table',
        height: 400,
        language_url: 'assets/js/tinymce/es.js',
        language: 'es',
    }
    initEnunciado: EditorComponent['init'] = {
        base_url: '/tinymce', // Root for resources
        suffix: '.min', // Suffix to use when loading resources
        menubar: false,
        selector: 'textarea',
        placeholder: 'Escribe aqui...',
        height: 1000,
        plugins: 'lists image table',
        statusbar: false,
        toolbar:
            'undo redo | forecolor backcolor | bold italic underline strikethrough | ' +
            'alignleft aligncenter alignright alignjustify | bullist numlist | ' +
            'image table',
    }
    encabezado = ''
    preguntas = []
    alternativas = [
        {
            cBancoAltLetra: 'a',
            bBancoAltRptaCorrecta: '',
            bImage: '',
            cBancoAltDescripcion: '',
        },
        {
            cBancoAltLetra: 'b',
            bBancoAltRptaCorrecta: '',
            bImage: '',
            cBancoAltDescripcion: '',
        },
        {
            cBancoAltLetra: 'c',
            bBancoAltRptaCorrecta: '',
            bImage: '',
            cBancoAltDescripcion: '',
        },
    ]
    tiposAgregarPregunta: MenuItem[] = [
        {
            label: 'Nueva Pregunta sin Enunciado',
            icon: 'pi pi-plus',
            command: () => {
                this.handleNuevaPregunta(false)
            },
        },
        {
            label: 'Nueva Pregunta con Enunciado',
            icon: 'pi pi-plus',
            command: () => {
                this.handleNuevaPregunta(true)
            },
        },
        // {
        //   label: 'Agregar del banco de preguntas',
        //   icon: 'pi pi-plus',
        //   // command: () => {
        //   //   this.handleBancopregunta()
        //   // },
        // },
    ]

    handleNuevaPregunta(encabezado) {
        console.log(encabezado)
        // this.preguntas.push({
        //   title: encabezado ? 'Pregunta con enunciado' : 'Pregunta sin enunciado',
        //   bEncabezado: encabezado,
        //   cPregunta: ''
        // })
    }

    ngOnInit() {
        this.obtenerPreguntasxiEvaluacionIdxiCursoNivelGradId()
        this.obtenerMatrizCompetencias()
        this.obtenerMatrizCapacidad()
    }

    obtenerPreguntasxiEvaluacionIdxiCursoNivelGradId() {
        const params = {
            petition: 'post',
            group: 'ere',
            prefix: 'evaluacion',
            ruta: 'handleCrudOperation',
            data: {
                opcion: 'CONSULTARxiEvaluacionIdxiCursoNivelGradId',
                iEvaluacionId: this.iEvaluacionId,
                valorBusqueda: this.iCursoNivelGradId,
            },
        }
        this.getInformation(params, params.data.opcion)
    }

    obtenerMatrizCompetencias(): void {
        this._apiEre.obtenerMatrizCompetencias({}).subscribe({
            next: (resp: any) => {
                this.matrizCompetencia = resp.data.fullData
            },
            error: (err) => {
                console.error('Error al cargar datos:', err)
            },
        })
    }

    obtenerMatrizCapacidad() {
        this._apiEre.obtenerMatrizCapacidades({}).subscribe({
            next: (resp: any) => {
                this.matrizCapacidad = resp.data.fullData
            },
            error: (err) => {
                console.error('Error al cargar datos:', err)
            },
        })
    }

    confirmarEliminarPregunta(positicion, pregunta) {
        this._ConfirmationModalService.openConfirm({
            header:
                '¿Esta seguro de eliminar la pregunta #' + positicion + ' ?',
            accept: () => {
                this.eliminarPregunta(pregunta?.pregunta)
            },
        })
    }

    eliminarPregunta(pregunta) {
        const iPreguntaId = pregunta.length ? pregunta[0]['iPreguntaId'] : null
        if (!iPreguntaId) return

        const params = {
            petition: 'post',
            group: 'ere',
            prefix: 'preguntas',
            ruta: 'handleCrudOperation',
            data: {
                opcion: 'ACTUALIZARxiPreguntaIdxbPreguntaEstado',
                iPreguntaId: iPreguntaId,
            },
        }
        this.getInformation(params, params.data.opcion)
    }

    guardarPreguntaSinEncabezado(encabezado, pregunta) {
        const preguntas = pregunta.pregunta
        if (!encabezado) {
            const data = preguntas.length ? preguntas[0] : null
            let error = false
            data.opcion = 'ACTUALIZARxiDesempenoId'
            data.alternativas.forEach((alternativa) => {
                {
                    if (
                        alternativa.cAlternativaDescripcion == '' ||
                        alternativa.cAlternativaDescripcion == null
                    ) {
                        error = true
                    }
                }
            })
            if (error) {
                this._MessageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Todas las alternativas debe tener una descripción y/o contenido',
                })
                return
            }
            error = true
            data.alternativas.forEach((alternativa) => {
                {
                    if (alternativa.bAlternativaCorrecta) {
                        error = false
                    }
                }
            })
            if (error) {
                this._MessageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No indicó la alternativa correcta, revise por favor.',
                })
                return
            }
            data.json_alternativas = JSON.stringify(data.alternativas)

            const params = {
                petition: 'post',
                group: 'ere',
                prefix: 'desempenos',
                ruta: 'handleCrudOperation',
                data: data,
            }
            this.getInformation(params, params.data.opcion)
        }
    }

    cambiarEstadoCheckbox(iAlternativaId, alternativas) {
        alternativas.forEach((alternativa) => {
            {
                if (alternativa.iAlternativaId != iAlternativaId) {
                    alternativa.bAlternativaCorrecta = false
                    alternativa.cAlternativaExplicacion = null
                }
            }
        })
    }
    agregarAlternativa(alternativas) {
        alternativas.push({
            bAlternativaCorrecta: false,
            cAlternativaDescripcion: null,
            cAlternativaExplicacion: null,
            cAlternativaLetra: null,
            iAlternativaId: null,
        })
        this.ordenarAlternativaLetra(alternativas)
    }

    eliminarAlternativa(index: number, alternativas) {
        // Eliminar la alternativa en la posición indicada por index
        alternativas.splice(index, 1)
        this.ordenarAlternativaLetra(alternativas)
    }

    getInformation(params, accion) {
        this._GeneralService.getGralPrefix(params).subscribe({
            next: (response) => {
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

    ordenarAlternativaLetra(alternativas) {
        alternativas.forEach((alternativa, i) => {
            const letra = abecedario[i] // Obtiene la letra según el índice
            alternativa.cAlternativaLetra = letra ? letra.code : '' // Asigna la nueva letra
        })
    }

    accionBtnItem(elemento): void {
        const { accion } = elemento
        const { item } = elemento
        switch (accion) {
            case 'CONSULTARxiEvaluacionIdxiCursoNivelGradId':
                this.data = item.length ? item[0] : []
                this.preguntas = []
                const evaluaciones = item.length
                    ? JSON.parse(item[0]['evaluaciones'])
                    : []
                evaluaciones.forEach((evaluacion) => {
                    this.ordenarAlternativaLetra(evaluacion.alternativas)
                })

                console.log(evaluaciones)

                let total = 0
                for (const key in evaluaciones) {
                    evaluaciones[key]['iCompetenciaId'] =
                        evaluaciones[key]['iCompetenciaId'].toString()
                    evaluaciones[key]['iCapacidadId'] =
                        evaluaciones[key]['iCapacidadId'].toString()

                    if (total == 0) {
                        const itemSinEncabezado = evaluaciones.filter(
                            (i) =>
                                !i.iEncabPregId &&
                                i.iPreguntaId ===
                                    evaluaciones[key]['iPreguntaId']
                        )
                        if (itemSinEncabezado.length) {
                            this.preguntas.push({
                                pregunta: itemSinEncabezado,
                                title: 'Pregunta sin enunciado',
                            })
                            total = 0
                        }
                        const itemConEncabezado = evaluaciones.filter(
                            (i) =>
                                i.iEncabPregId &&
                                i.iEncabPregId ===
                                    evaluaciones[key]['iEncabPregId']
                        )
                        if (itemConEncabezado.length) {
                            this.preguntas.push({
                                pregunta: itemConEncabezado,
                                title: 'Pregunta con enunciado',
                            })
                            total = total + 1
                        }
                    }
                }
                break
            case 'ACTUALIZARxiPreguntaIdxbPreguntaEstado':
                this._MessageService.add({
                    severity: 'success',
                    summary: 'Eliminado',
                    detail: 'Se eliminó correctamente la pregunta',
                })
                this.obtenerPreguntasxiEvaluacionIdxiCursoNivelGradId()
                break
            case 'ACTUALIZARxiDesempenoId':
                this._MessageService.add({
                    severity: 'success',
                    summary: 'Actualizado',
                    detail: 'Se actualizó correctamente la pregunta',
                })
                break
            case 'GUARDAR':
                this._MessageService.add({
                    severity: 'success',
                    summary: 'Guardado',
                    detail: 'Se guardó correctamente la pregunta',
                })
                break
        }
    }

    async onUploadChange(evt: any, alternativa) {
        const file = evt.target.files[0]
        if (file) {
            const dataFile = await this.objectToFormData({
                file: file,
                nameFile: 'alternativas',
            })
            this.http
                .post(`${this.backendApi}/general/subir-archivo`, dataFile)
                .pipe(
                    map((event: any) => {
                        if (event.validated) {
                            alternativa.cAlternativaDescripcion = event.data
                            // this.cPortafolioItinerario = []
                            //                       this.cPortafolioItinerario.push({
                            //                           name: file.name,
                            //                           ruta: event.data,
                            //                       })
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
}
