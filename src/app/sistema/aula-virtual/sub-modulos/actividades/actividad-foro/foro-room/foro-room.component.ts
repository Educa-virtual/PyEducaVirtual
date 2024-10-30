import { Component, inject, OnInit, Input } from '@angular/core'
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
import { ApiAulaService } from '@/app/sistema/aula-virtual/services/api-aula.service'
import { tipoActividadesKeys } from '@/app/sistema/aula-virtual/interfaces/actividad.interface'
import { Subject, takeUntil } from 'rxjs'
import { RemoveHTMLPipe } from '@/app/shared/pipes/remove-html.pipe'

@Component({
    selector: 'app-foro-room',
    standalone: true,
    templateUrl: './foro-room.component.html',
    styleUrls: ['./foro-room.component.scss'],
    imports: [
        IconComponent,
        RemoveHTMLPipe,
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
    @Input() ixActivadadId: string
    @Input() iActTopId: tipoActividadesKeys

    private GeneralService = inject(GeneralService)
    private _formBuilder = inject(FormBuilder)
    private _aulaService = inject(ApiAulaService)
    //private ref = inject(DynamicDialogRef)
    // variables
    estudiantes: any[] = []
    calificacion: any[] = []
    modalCalificacion: boolean = false
    estudianteSelect = null
    private unsbscribe$ = new Subject<boolean>()

    public foro

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
        console.log('HolaMit', this.ixActivadadId, this.iActTopId)
        this.getEstudiantesMatricula()
        this.mostrarCalificacion()
        this.obtenerForo()
        console.log('Obtener Datos', this.getEstudiantesMatricula())
    }
    // closeModal(data) {
    //     this.ref.close(data)
    // }
    openModal(estudiante) {
        this.modalCalificacion = true
        this.estudianteSelect = estudiante
    }
    submit() {
        const value = this.foroForm.value
        console.log('Guardar Calificacion', value)
    }
    mostrarCalificacion() {
        const userId = 1
        this._aulaService.obtenerCalificacion(userId).subscribe((Data) => {
            this.calificacion = Data['data']
            //console.log('Mostrar escala',this.calificacion)
        })
    }
    obtenerForo() {
        this._aulaService
            .obtenerForo({
                iActTipoId: this.iActTopId,
                ixActivadadId: this.ixActivadadId,
            })
            .pipe(takeUntil(this.unsbscribe$))
            .subscribe({
                next: (resp) => {
                    this.foro = resp
                },
            })
        //console.log('Obtener Foros',this._aulaService)
    }
    getEstudiantesMatricula() {
        const params = {
            petition: 'post',
            group: 'aula-virtual',
            prefix: 'matricula',
            ruta: 'list',
            //Undefined property: stdClass::$iSemAcadId
            //Undefined property: stdClass::$iYAcadId
            data: {
                opcion: 'CONSULTAR-ESTUDIANTESxiSemAcadIdxiYAcadIdxiCurrId',
                iSemAcadId:
                    '2jdp2ERVe0QYG8agql5J1ybONbOMzW93KvLNZ7okAmD4xXBrwe',
                iYAcadId: '2jdp2ERVe0QYG8agql5J1ybONbOMzW93KvLNZ7okAmD4xXBrwe',
                iCurrId: '2jdp2ERVe0QYG8agql5J1ybONbOMzW93KvLNZ7okAmD4xXBrwe',
            },
            params: { skipSuccessMessage: true },
        }
        console.log(this.getInformation)

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
        //console.log('Datos estudiante', this.GeneralService)
    }
    stripHTML(html) {
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = html
        return tempDiv.textContent || tempDiv.innerText || ''
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
