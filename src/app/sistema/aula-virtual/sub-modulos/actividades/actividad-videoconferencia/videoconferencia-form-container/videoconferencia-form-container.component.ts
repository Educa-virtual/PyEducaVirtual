import { PrimengModule } from '@/app/primeng.module'
import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component'
import { Component, OnInit, Input, inject, OnChanges } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { Message } from 'primeng/api'
import { InputTextModule } from 'primeng/inputtext'
import { InputGroupModule } from 'primeng/inputgroup'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { ApiAulaService } from '@/app/sistema/aula-virtual/services/api-aula.service'
import { DatePipe } from '@angular/common'
import { ConstantesService } from '@/app/servicios/constantes.service'
import {
    IActividad,
    VIDEO_CONFERENCIA,
} from '@/app/sistema/aula-virtual/interfaces/actividad.interface'
import { GeneralService } from '@/app/servicios/general.service'

@Component({
    selector: 'app-videoconferencia-form-container',
    standalone: true,
    templateUrl: './videoconferencia-form-container.component.html',
    styleUrls: ['./videoconferencia-form-container.component.scss'],
    imports: [
        PrimengModule,
        CommonInputComponent,
        InputTextModule,
        InputGroupModule,
    ],
})
export class VideoconferenciaFormContainerComponent
    implements OnInit, OnChanges
{
    @Input() contenidoSemana
    actividad: IActividad | undefined
    action: string
    @Input() iProgActId: string
    @Input() ixActivadadId: string
    @Input() iActTopId: number
    pipe = new DatePipe('es-ES')

    private _formBuilder = inject(FormBuilder)
    private ref = inject(DynamicDialogRef)
    private ConstantesService = inject(ConstantesService)
    private GeneralService = inject(GeneralService)

    semana: Message[] = []

    public formConferencia = this._formBuilder.group({
        iRVirtualId: [''],
        cRVirtualTema: ['', [Validators.required, Validators.maxLength(250)]],
        dtRVirtualInicio: [new Date(), [Validators.required]],
        dtRVirtualFin: [new Date(), [Validators.required]],
        // cForoDescripcion: ['', [Validators.required]],
        cRVirtualUrlJoin: ['', [Validators.required]],
    })
    opcion: string = 'GUARDAR'
    constructor(
        private dialogConfig: DynamicDialogConfig,
        private apiAulaService: ApiAulaService,
        private _constantesService: ConstantesService
    ) {
        this.contenidoSemana = this.dialogConfig.data.contenidoSemana
        this.action = this.dialogConfig.data.action
        this.actividad = this.dialogConfig.data.actividad
        const data = this.dialogConfig.data

        if (this.actividad.ixActivadadId && data.action == 'ACTUALIZAR') {
            this.obtenerReunionVirtualPorId(this.actividad.ixActivadadId)
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

    ngOnInit() {
        console.log('')
    }

    ngOnChanges(changes) {
        console.log(changes)

        if (changes.ixActivadadId?.currentValue) {
            this.ixActivadadId = changes.ixActivadadId.currentValue
        }
        // if (this.formConferencia.value.cRVirtualTema) {
        //     const data = {
        //         petition: 'post',
        //         group: 'aula-virtual',
        //         prefix: 'reunion_virtuales',
        //         ruta: iRVirtualId.toString(),
        //         params: { iCredId: conta },
        //     }

        //             const data = {
        //     petition: 'get',
        //     group: 'aula-virtual',
        //     prefix: 'cuestionarios',
        //     ruta: iCuestionarioId.toString(),
        //     params: {
        //         iCredId: this._constantesService.iCredId, // Asignar el ID del crédito
        //     },
        //     // params: { skipSuccessMessage: true },
        // }

        //     this.getInformation(data)

        // } else {
        //     this.opcion = 'GUARDAR'
        // }
    }

    obtenerReunionVirtualPorId(ixActivadadId) {
        console.log('obtenerCuestionarioPorId', ixActivadadId)
        const data = {
            petition: 'get',
            group: 'aula-virtual',
            prefix: 'reunion-virtuales',
            ruta: ixActivadadId.toString(),
            params: {
                iCredId: this._constantesService.iCredId, // Asignar el ID del crédito
            },
            // params: { skipSuccessMessage: true },
        }
        this.getInformation(data)
    }

    getInformation(params) {
        this.GeneralService.getGralPrefixx(params).subscribe({
            next: (response) => {
                const [data] = response.data

                this.formConferencia.patchValue({
                    iRVirtualId: data.iRVirtualId,
                    cRVirtualTema: data.cRVirtualTema,
                    dtRVirtualInicio: new Date(data.dtRVirtualInicio),
                    dtRVirtualFin: new Date(data.dtRVirtualFin),
                    cRVirtualUrlJoin: data.cRVirtualUrlJoin,
                })
            },
            complete: () => {},
            error: (error) => {
                console.log(error)
            },
        })
    }
    // Cerrar el modal
    closeModal(data) {
        this.ref.close(data)
    }
    get nombreConferencia() {
        return this.formConferencia.get('nombreConferencia')
    }
    // Guardar el formulario
    guardar() {
        console.log('this.action')
        console.log(this.action)

        if (!this.formConferencia.invalid) {
            console.log('Formulario válido', this.formConferencia.value)
            this.ref.close(this.formConferencia.value)

            const data = {
                opcion: 'GUARDARxProgActxiRVirtualId',
                iContenidoSemId: this.contenidoSemana.iContenidoSemId,
                iActTipoId: VIDEO_CONFERENCIA,
                dtProgActPublicacion: this.pipe.transform(
                    this.formConferencia.value.dtRVirtualInicio,
                    'dd/MM/yyyy HH:mm:ss'
                ),
                cProgActTituloLeccion: this.formConferencia.value.cRVirtualTema,
                dtProgActInicio: this.pipe.transform(
                    this.formConferencia.value.dtRVirtualInicio,
                    'dd/MM/yyyy HH:mm:ss'
                ),
                dtProgActFin: this.pipe.transform(
                    this.formConferencia.value.dtRVirtualFin,
                    'dd/MM/yyyy HH:mm:ss'
                ),
                iEstado: 1,
                iCredId: this._constantesService.iCredId,
                cRVirtualTema: this.formConferencia.value.cRVirtualTema,
                dtRVirtualInicio: this.pipe.transform(
                    this.formConferencia.value.dtRVirtualInicio,
                    'yyyy-MM-ddTHH:mm:ss'
                ),
                dtRVirtualFin: this.pipe.transform(
                    this.formConferencia.value.dtRVirtualFin,
                    'yyyy-MM-ddTHH:mm:ss'
                ),
                cRVirtualUrlJoin: this.formConferencia.value.cRVirtualUrlJoin,
            }

            switch (this.action) {
                case 'ACTUALIZAR':
                    this.apiAulaService
                        .actualizarReunionVirtual(
                            data,
                            this.actividad.ixActivadadId
                        )
                        .subscribe({
                            next: (response) => {
                                console.log('response')
                                console.log(response)
                            },
                        })
                    break
                case 'GUARDAR':
                    this.apiAulaService.guardarReunionVirtual(data).subscribe({
                        next: (response) => {
                            console.log('response')
                            console.log(response)
                        },
                    })
                    break
            }
        } else {
            console.log('Formulario inválido')
        }
    }
}
