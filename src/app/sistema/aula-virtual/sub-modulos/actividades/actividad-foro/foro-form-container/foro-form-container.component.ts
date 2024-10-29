import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component'
import { CommonModule } from '@angular/common'
import { Component, inject, OnInit, Input } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { DynamicDialogRef } from 'primeng/dynamicdialog'
import { DisponibilidadFormComponent } from '../../components/disponibilidad-form/disponibilidad-form.component'
import { DropdownModule } from 'primeng/dropdown'
import { ButtonModule } from 'primeng/button'
import { EditorModule } from 'primeng/editor'
import { ApiAulaService } from '@/app/sistema/aula-virtual/services/api-aula.service'
import { CalendarModule } from 'primeng/calendar'
import { BaseDatePickerDirective } from '@/app/shared/directives/base-date-picker.directive'
import { SelectButtonModule } from 'primeng/selectbutton'
import { PrimengModule } from '@/app/primeng.module'
import { Message } from 'primeng/api'
import { DatePipe } from '@angular/common'
@Component({
    selector: 'app-foro-form-container',
    standalone: true,
    imports: [
        CommonModule,
        PrimengModule,
        CommonInputComponent,
        ReactiveFormsModule,
        DisponibilidadFormComponent,
        DropdownModule,
        ButtonModule,
        EditorModule,
        CalendarModule,
        BaseDatePickerDirective,
        SelectButtonModule,
    ],
    templateUrl: './foro-form-container.component.html',
    styleUrl: './foro-form-container.component.scss',
})
export class ForoFormContainerComponent implements OnInit {
    // _aulaService obtener datos
    pipe = new DatePipe('es-ES')
    date = new Date()

    private _aulaService = inject(ApiAulaService)
    private _formBuilder = inject(FormBuilder)
    private ref = inject(DynamicDialogRef)

    @Input() contenidoSemana

    categorias: any[] = []
    semana: Message[] = []
    selectProgramaAct = 0
    titleFileTareas: string = ''

    estado: any[] = [
        { label: 'Activo', value: 1 },
        { label: 'Desactivo', value: 2 },
    ]

    selectCategorias: any = {}

    public foroForm = this._formBuilder.group({
        cForoTitulo: ['', [Validators.required]],
        cForoDescripcion: ['', [Validators.required]],
        iForoCatId: [0, [Validators.required]],
        dtForoInicio: [''],
        iEstado: [0, Validators.required],
        dtForoPublicacion: [''],
        dtForoFin: [],
        cForoCatDescripcion: [],

        //VARIABLES DE AYUDA QUE NO ESTÀN EN LA BD
        dtInicio: [this.date, Validators.required],
        dtFin: [this.date, Validators.required],
    })

    ngOnInit(): void {
        this.mostrarCategorias()
    }

    mostrarCategorias() {
        const userId = 1
        this._aulaService.obtenerCategorias(userId).subscribe((Data) => {
            this.categorias = Data['data']
            console.log('Datos mit', this.categorias)
        })
    }

    closeModal(data) {
        this.ref.close(data)
    }
    submit() {
        let horaInicio = this.foroForm.value.dtInicio.toLocaleString('en-GB', {
            timeZone: 'America/Lima',
        })
        horaInicio = horaInicio.replace(',', '')
        let horaFin = this.foroForm.value.dtFin.toLocaleString('en-GB', {
            timeZone: 'America/Lima',
        })
        horaFin = horaFin.replace(',', '')
        this.foroForm.controls.dtForoInicio.setValue(horaInicio)
        this.foroForm.controls.dtForoFin.setValue(horaFin)
        this.foroForm.controls.dtForoPublicacion.setValue(horaFin)

        const value = this.foroForm.value
        console.log('Guardar Foros', value)

        this._aulaService.guardarForo(value).subscribe(() => {})
        //     // this.categorias = Data['data']
        //     // console.log('Datos mit', this.categorias)
        // })
    }
    showModal: boolean = false
    typeUpload: string
}
