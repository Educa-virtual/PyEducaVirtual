import { PrimengModule } from '@/app/primeng.module'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { GeneralService } from '@/app/servicios/general.service'
import { TypesFilesUploadPrimengComponent } from '@/app/shared/types-files-upload-primeng/types-files-upload-primeng.component'
import { IActividad } from '@/app/sistema/aula-virtual/interfaces/actividad.interface'
import { ApiAulaService } from '@/app/sistema/aula-virtual/services/api-aula.service'
import { DatePipe } from '@angular/common'
import { Component, inject, Input, OnInit } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { Message } from 'primeng/api'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'

@Component({
    selector: 'app-cuestionario-form',
    standalone: true,
    templateUrl: './cuestionario-form.component.html',
    styleUrls: ['./cuestionario-form.component.scss'],
    imports: [PrimengModule, TypesFilesUploadPrimengComponent],
})
export class CuestionarioFormComponent implements OnInit {
    @Input() contenidoSemana

    private _formBuilder = inject(FormBuilder)
    private _constantesService = inject(ConstantesService)
    private _aulaService = inject(ApiAulaService)
    private GeneralService = inject(GeneralService)

    // Crea una instancia de la clase DatePipe para formatear fechas en español
    pipe = new DatePipe('es-ES')
    date = this.ajustarAHorarioDeMediaHora(new Date())
    private ref = inject(DynamicDialogRef)
    semana: Message[] = []

    typesFiles = {
        file: true,
        url: true,
        youtube: true,
        repository: false,
        image: false,
    }
    // Propiedad para almacenar la actividad actual (opcional).
    actividad: IActividad | undefined
    action: string
    opcion: string = 'GUARDAR'
    constructor(private dialogConfig: DynamicDialogConfig) {
        this.contenidoSemana = this.dialogConfig.data.contenidoSemana
        this.action = this.dialogConfig.data.action
        this.actividad = this.dialogConfig.data.actividad
        if (this.actividad?.ixActivadadId && this.action === 'ACTUALIZAR') {
            this.obtenerCuestionarioPorId(this.actividad.ixActivadadId)
        } else {
            this.opcion = 'GUARDAR'
        }

        this.semana = [
            {
                severity: 'info',
                detail:
                    this.contenidoSemana?.cContenidoSemNumero +
                    ' SEMANA - ' +
                    this.contenidoSemana?.cContenidoSemTitulo,
            },
        ]
    }

    public formCuestionario = this._formBuilder.group({
        cTitulo: ['', [Validators.required]],
        cDescripcion: ['', [Validators.required]],
        dtInicio: [this.date, Validators.required],
        dtFin: [
            new Date(
                this.ajustarAHorarioDeMediaHora(new Date()).setHours(
                    this.date.getHours() + 1
                )
            ),
            Validators.required,
        ],
    })

    ngOnInit() {
        console.log('hola')
    }
    // funcio  cancelar
    cancelar() {
        // this.tarea = null
        this.ref.close(null)
    }
    // funcion que cierra el  modal
    closeModal(resp: boolean) {
        // this.tarea = null
        this.ref.close(resp)
    }
    // metodo para guardar el cuestionario
    GUARDARxProgActxiCuestionarioId() {
        const formValue = this.formCuestionario.value
        this.filesUrl = (this.filesUrl?.length ?? 0) > 0 ? this.filesUrl : null
        const data = {
            ...formValue,
            dtInicio: this.pipe.transform(
                formValue.dtInicio,
                'yyyy-MM-ddTHH:mm:ss'
            ),
            dtFin: this.pipe.transform(formValue.dtFin, 'yyyy-MM-ddTHH:mm:ss'),
            cArchivoAdjunto: this.filesUrl,
            iDocenteId: this._constantesService.iDocenteId,
            iProgActId: '',
            opcion: 'GUARDARxProgActxiCuestionarioId',
            iContenidoSemId: this.contenidoSemana.iContenidoSemId,
            iActTipoId: 6, // Asignar el tipo de actividad correspondiente
            iEstado: 1, // Estado activo
            iSesionId: 1,
            iHorarioId: '',
            iCredId: this._constantesService.iCredId, // Asignar el ID del crédito
            valorBusqueda: '', // Valor de búsqueda, si es necesario
            iSilaboActAprendId: '', // ID del silabo de actividad de aprendizaje, si es necesario
            iInstrumentoId: '', // ID del instrumento, si es necesario
            dtProgActPublicacion: this.pipe.transform(
                formValue.dtInicio,
                'dd/MM/yyyy HH:mm:ss'
            ), // Fecha de publicación del programa de actividad
            nProgActConceptual: '', // Descripción conceptual del programa de actividad
            nProgActProcedimiental: '', // Descripción procedimental del programa de actividad
            nProgActActitudinal: '', // Descripción actitudinal del programa de actividad
            bProgActEsEvaluado: '', // Indica si el programa de actividad es evaluado
            cSubtitulo: '', // Subtítulo del programa de actividad
            cProgActComentarioDocente: '', // Comentario del docente sobre el programa de actividad
            nProgActNota: '', // Nota del programa de actividad, si es necesario
            bProgActEsRestringido: '',
            dtProgActInicio: this.pipe.transform(
                formValue.dtInicio,
                'dd/MM/yyyy HH:mm:ss'
            ),
            dtProgActFin: this.pipe.transform(
                formValue.dtFin,
                'dd/MM/yyyy HH:mm:ss'
            ),
            cProgActTituloLeccion: formValue.cTitulo, // Título de la lección del programa de actividad
            dtActualizado: '', // Fecha de actualización del programa de actividad
            dtCreado: '', // Fecha de creación del programa de actividad
        }
        this._aulaService.guardarCuestionario(data).subscribe({
            next: (response) => {
                console.log('Cuestionario guardado con éxito', response)
                this.ref.close(true)
            },
            error: (error) => {
                console.error('Error al guardar el cuestionario', error)
            },
        })
        console.log('datos del formulario', data)
    }
    obtenerCuestionarioPorId(iCuestionarioId) {
        console.log('obtenerCuestionarioPorId', iCuestionarioId)
        const data = {
            petition: 'get',
            group: 'aula-virtual',
            prefix: 'cuestionarios',
            ruta: iCuestionarioId.toString(),
            params: {
                iCredId: this._constantesService.iCredId, // Asignar el ID del crédito
            },
            // params: { skipSuccessMessage: true },
        }
        this.getInformation(data, data.ruta)
    }

    // getInformation(params, condition) {
    //     this.GeneralService.getGralPrefixx(params).subscribe({
    //         next: (response) => {
    //             this.accionBtnItem({ accion: condition, item: response.data })
    //         },
    //         complete: () => {},
    //         error: (error) => {
    //             console.log(error)
    //         },
    //     })
    // }
    cuestionario: any
    getInformation(data, condition) {
        console.log('getInformation', data, condition)
        this.GeneralService.getGralPrefixx(data).subscribe({
            next: (response) => {
                this.cuestionario = response.data.length
                    ? response.data[0]
                    : this.closeModal(response.validated)

                //  const cuestionario = Array.isArray(response?.data) ? response.data[0] : null;
                // this.cuestionario = cuestionario;
                // console.log('Respuesta del cuestionario:', cuestionario);
                const cuestionario = this.cuestionario
                if (cuestionario) {
                    this.formCuestionario.patchValue({
                        cTitulo: cuestionario.cTitulo,
                        cDescripcion: cuestionario.cDescripcion?.replace(
                            /<[^>]*>?/gm,
                            ''
                        ), // opcional: limpiar etiquetas HTML

                        // otros campos si es necesario
                    })
                }
                // this.accionBtnItem({
                //     accion: condition,
                //     item: response?.data ?? null
                // });
            },
            error: (error) => {
                console.error('Error al obtener información:', error)
            },
        })
    }
    // metodo para ajustar la fecha a la hora más cercana de media hora
    ajustarAHorarioDeMediaHora(fecha) {
        const minutos = fecha.getMinutes() // Obtener los minutos actuales
        const minutosAjustados = minutos <= 30 ? 30 : 0 // Decidir si ajustar a 30 o 0 (hora siguiente)
        if (minutos > 30) {
            fecha.setHours(fecha.getHours() + 1) // Incrementar la hora si los minutos pasan de 30
        }
        fecha.setMinutes(minutosAjustados) // Ajustar los minutos
        fecha.setSeconds(0) // Opcional: Resetear los segundos a 0
        fecha.setMilliseconds(0) // Opcional: Resetear los milisegundos a 0
        return fecha
    }
    filesUrl = []
    accionBtnItem(elemento): void {
        const { accion } = elemento
        const { item } = elemento
        // let params
        switch (accion) {
            case 'close-modal':
                // this.showModal = false
                break
            case 'subir-file-tareas':
                this.filesUrl.push({
                    type: 1, //1->file
                    nameType: 'file',
                    name: item.file.name,
                    size: item.file.size,
                    ruta: item.name,
                })
                break
            case 'url-tareas':
                this.filesUrl.push({
                    type: 2, //2->url
                    nameType: 'url',
                    name: item.name,
                    size: '',
                    ruta: item.ruta,
                })
                break
            case 'youtube-tareas':
                this.filesUrl.push({
                    type: 3, //3->youtube
                    nameType: 'youtube',
                    name: item.name,
                    size: '',
                    ruta: item.ruta,
                })
                break
        }
    }
}
