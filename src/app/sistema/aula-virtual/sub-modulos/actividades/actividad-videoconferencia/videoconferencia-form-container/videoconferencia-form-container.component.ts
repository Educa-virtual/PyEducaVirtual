import { PrimengModule } from '@/app/primeng.module'
import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component'
import { Component, OnInit, Input, inject } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { Message } from 'primeng/api'
import { InputTextModule } from 'primeng/inputtext'
import { InputGroupModule } from 'primeng/inputgroup'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'

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
export class VideoconferenciaFormContainerComponent implements OnInit {
    @Input() contenidoSemana
    @Input() iProgActId: string
    @Input() ixActivadadId: string
    @Input() iActTopId: number

    private _formBuilder = inject(FormBuilder)
    private ref = inject(DynamicDialogRef)

    semana: Message[] = []

    public formConferencia = this._formBuilder.group({
        nombreConferencia: [
            '',
            [Validators.required],
            Validators.maxLength(250),
        ],
        fecha: [new Date(), [Validators.required]],
        hora: ['', [Validators.required]],
        cForoDescripcion: ['', [Validators.required]],
        linkConferencia: ['', [Validators.required]],
    })
    opcion: string = 'GUARDAR'
    constructor(private dialogConfig: DynamicDialogConfig) {
        this.contenidoSemana = this.dialogConfig.data.contenidoSemana
        console.log('hola', this.contenidoSemana)
        const data = this.dialogConfig.data
        if (data.action == 'editar') {
            this.opcion = 'ACTUALIZAR'
            // this.obtenerForoxiForoId(data.actividad.ixActivadadId)
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
    // Cerrar el modal
    closeModal(data) {
        this.ref.close(data)
    }
    get nombreConferencia() {
        return this.formConferencia.get('nombreConferencia')
    }
    // Guardar el formulario
    guardar() {
        console.log('Guardar', this.formConferencia)
        if (this.formConferencia.valid) {
            console.log('Formulario válido', this.formConferencia.value)
            this.ref.close(this.formConferencia.value)
        } else {
            console.log('Formulario inválido')
        }
    }
}
