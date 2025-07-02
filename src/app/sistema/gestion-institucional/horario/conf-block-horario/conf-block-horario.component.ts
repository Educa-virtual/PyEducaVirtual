import { PrimengModule } from '@/app/primeng.module'
import { Component, OnInit } from '@angular/core'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { FormBuilder, FormGroup } from '@angular/forms'
import { InputNumberModule } from 'primeng/inputnumber'
import { configuracionBloques } from './config/table/configuracion-bloques.table'
import { ConfiguracionBloquesService } from './config/services/configuracion-bloque.service'
import { DatePipe } from '@angular/common'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { MessageService } from 'primeng/api'
import { bloques } from './config/table/bloques.table'
import { BloqueService } from './config/services/bloque.service'
import { ToastModule } from 'primeng/toast'

@Component({
    selector: 'app-conf-block-horario',
    standalone: true,
    imports: [
        PrimengModule,
        ToastModule,
        InputNumberModule,
        ContainerPageComponent,
        TablePrimengComponent,
    ],
    templateUrl: './conf-block-horario.component.html',
    styleUrl: './conf-block-horario.component.scss',
    providers: [DatePipe],
})
export class ConfBlockHorarioComponent implements OnInit {
    forms: {
        configuracionBloque: FormGroup
        bloque: FormGroup
    } = {
        configuracionBloque: new FormGroup({}),
        bloque: new FormGroup({}),
    }

    dialogs = {
        configuracionBloque: {
            title: '',
            visible: false,
        },
        distribucionBloques: {
            title: '',
            visible: false,
        },
        bloque: {
            title: '',
            visible: false,
        },
        asignacionConfiguracionBloque: {
            title: '',
            visible: false,
        },
    }

    configuracionBloques = {
        accionBtnItem: configuracionBloques.accionBtnItem.bind(this),
        table: configuracionBloques.table,
        container: configuracionBloques.container,
        saveData: configuracionBloques.saveData.bind(this),
    }

    bloques = {
        accionBtnItem: bloques.accionBtnItem.bind(this),
        table: bloques.table,
        saveData: bloques.saveData.bind(this),
    }

    constructor(
        private fb: FormBuilder,
        public datePipe: DatePipe,
        public dialogConfirm: ConfirmationModalService,
        public messageService: MessageService,
        public bloqueService: BloqueService,
        public configuracionBloquesService: ConfiguracionBloquesService
    ) {
        this.forms.configuracionBloque = this.fb.group({
            iConfBloqueId: [''],
            cDescripcion: [''],
            iNumBloque: [''],
            iBloqueInter: [''],
            dInicio: [''],
            dFin: [''],
        })

        this.forms.bloque = this.fb.group({
            iDetBloqueId: [''],
            iConfBloqueId: [''],
            iOrder: [''],
            tBloqueInicio: [''],
            tBloqueFin: [''],
            cDetalle: [''],
        })
    }

    ngOnInit() {
        console.log('d')

        this.configuracionBloquesService.getConfiguracionBloques().subscribe({
            next: (res: any) => {
                this.configuracionBloques.table.data = res.data.map((item) => ({
                    ...item,
                    dInicio: this.datePipe.transform(
                        (() => {
                            const [hours, minutes] = item.dInicio.split(':')
                            const date = new Date()
                            date.setHours(Number(hours), Number(minutes), 0, 0) // h, m, s, ms
                            return date
                        })(),
                        'HH:mm'
                    ),
                    dFin: this.datePipe.transform(
                        (() => {
                            const [hours, minutes] = item.dFin.split(':')
                            const date = new Date()
                            date.setHours(Number(hours), Number(minutes), 0, 0) // h, m, s, ms
                            return date
                        })(),
                        'HH:mm'
                    ),
                }))
            },
        })
    }
}
