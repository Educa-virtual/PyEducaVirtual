import { Component, inject, OnInit } from '@angular/core'
import { IconComponent } from '@/app/shared/icon/icon.component'
import {
    matAccessTime,
    matCalendarMonth,
    matHideSource,
    matListAlt,
    matMessage,
    matRule,
    matStar,
} from '@ng-icons/material-icons/baseline'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { provideIcons } from '@ng-icons/core'
import { TabViewModule } from 'primeng/tabview'
import { OrderListModule } from 'primeng/orderlist'
import { PrimengModule } from '@/app/primeng.module'
import { GeneralService } from '@/app/servicios/general.service'
import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component'

@Component({
    selector: 'app-foro-room',
    standalone: true,
    templateUrl: './foro-room.component.html',
    styleUrls: ['./foro-room.component.scss'],
    imports: [
        IconComponent,
        CommonInputComponent,
        TablePrimengComponent,
        TabViewModule,
        OrderListModule,
        PrimengModule,
    ],
    providers: [
        provideIcons({
            matHideSource,
            matCalendarMonth,
            matMessage,
            matStar,
            matRule,
            matListAlt,
            matAccessTime,
        }),
    ],
})
export class ForoRoomComponent implements OnInit {
    private GeneralService = inject(GeneralService)
    private _formBuilder = inject(FormBuilder)
    //private ref = inject(DynamicDialogRef)
    // variables
    estudiantes: any[] = []
    calificacion: any[] = [
        { label: 'AD', value: 1 },
        { label: 'A', value: 2 },
        { label: 'B', value: 3 },
        { label: 'C', value: 4 },
    ]
    modalCalificacion: boolean = false

    public foroForm: FormGroup = this._formBuilder.group({
        cForoTitulo: ['', [Validators.required]],
        cForoDescripcion: ['', [Validators.required]],
        iForoCatId: [0, [Validators.required]],
        dtForoInicio: [''],
        iEstado: [0, Validators.required],
        dtForoPublicacion: ['dtForoInicio'],
        dtForoFin: [],
    })

    constructor() {}
    ngOnInit() {
        this.getEstudiantesMatricula()
    }
    // closeModal(data) {
    //     this.ref.close(data)
    // }
    openModal() {
        this.modalCalificacion = true
    }
    submit() {
        const value = this.foroForm.value
        console.log('Guardar Calificacion', value)
    }
    getEstudiantesMatricula() {
        const params = {
            petition: 'post',
            group: 'aula-virtual',
            prefix: 'matricula',
            ruta: 'list',
            data: {
                opcion: 'CONSULTAR-ESTUDIANTESxiSemAcadIdxiYAcadIdxiCurrId',
                iSemAcadId:
                    '2jdp2ERVe0QYG8agql5J1ybONbOMzW93KvLNZ7okAmD4xXBrwe',
                iYAcadId: '2jdp2ERVe0QYG8agql5J1ybONbOMzW93KvLNZ7okAmD4xXBrwe',
                iCurrId: '2jdp2ERVe0QYG8agql5J1ybONbOMzW93KvLNZ7okAmD4xXBrwe',
            },
            params: { skipSuccessMessage: true },
        }
        //console.log(this.getInformation)

        this.getInformation(params)
    }
    getInformation(params) {
        this.GeneralService.getGralPrefix(params).subscribe({
            next: (response) => {
                this.estudiantes = response.data
            },
            complete: () => {},
            error: (error) => {
                console.log(error)
            },
        })
    }
    // ngOnInit() { implements OnInit
    // }
    //   obtenerForo() {
    //     this._aulaService
    //         .obtenerActividad({
    //             iActTipoId: this.iActTopId,
    //             ixActivadadId: this.ixActivadadId,
    //         })
    //         .pipe(takeUntil(this.unsbscribe$))
    //         .subscribe({
    //             next: (resp) => {
    //                 this.evaluacion = resp
    //             },
    //         })
    //   }
    //   mostrarCategorias() {
    //     const userId = 1
    //     this._aulaService.guardarForo(userId).subscribe((Data) => {
    //         this.categorias = Data['data']
    //         console.log('Datos mit', this.categorias)
    //     })
    // }
}
