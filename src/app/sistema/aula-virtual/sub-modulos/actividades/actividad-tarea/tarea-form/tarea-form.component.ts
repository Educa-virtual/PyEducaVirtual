import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component'
import { CommonModule } from '@angular/common'
import { Component, EventEmitter, inject, Output, OnInit } from '@angular/core'
import { DropdownModule } from 'primeng/dropdown'
import {
    FormBuilder,
    ReactiveFormsModule,
    Validators,
    FormsModule,
} from '@angular/forms'
import { EditorModule } from 'primeng/editor'
import { DisponibilidadFormComponent } from '../../components/disponibilidad-form/disponibilidad-form.component'
import { CountryService } from '@/app/demo/service/country.service'
import { CalendarModule } from 'primeng/calendar'
import { DialogModule } from 'primeng/dialog'
import { TableModule } from 'primeng/table'
import { CheckboxModule } from 'primeng/checkbox'
import { FileUploadModule } from 'primeng/fileupload'
@Component({
    selector: 'app-tarea-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CommonInputComponent,
        FormsModule,
        EditorModule,
        DropdownModule,
        DisponibilidadFormComponent,
        CalendarModule,
        DialogModule,
        TableModule,
        CheckboxModule,
        FileUploadModule,
    ],
    templateUrl: './tarea-form.component.html',
    styleUrl: './tarea-form.component.scss',
})
export class TareaFormComponent implements OnInit {
    @Output() submitEvent = new EventEmitter<any>()
    @Output() cancelEvent = new EventEmitter<void>()

    private _formBuilder = inject(FormBuilder)
    selectedState: unknown = null
    cities: any[]
    countries: any[] = []
    value10: any
    constructor(private countryService: CountryService) {
        this.cities = [
            { name: 'New York', code: 'NY' },
            { name: 'Rome', code: 'RM' },
            { name: 'London', code: 'LDN' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Paris', code: 'PRS' },
        ]
    }

    estudiantes: any[] = [
        { nombre: 'Prueba', apellido: 'prueba name', selected: false },
    ]

    // nota
    puntajeArray: { name: string; code: string }[] = []

    ngOnInit() {
        this.countryService.getCountries().then((countries) => {
            this.countries = countries
        })

        for (let i = 1; i <= 20; i++) {
            this.puntajeArray.push({ name: `${i}`, code: `${i}` })
        }
    }

    public tareaForm = this._formBuilder.group({
        cTareaTitulo: ['', [Validators.required]],
        cTareaDescripcion: ['', [Validators.required]],
        cTareaIndicaciones: [''],
        dFechaEvaluacionPublicacion: [''],
        tHoraEvaluacionPublicacion: [''],
    })
    displayModal: boolean = false

    mostrarModal() {
        this.displayModal = true
    }

    onUpload(event: any) {
        console.log('subida de archivos', event.files)
    }

    onError(event: any) {
        console.log('error subida de archivos', event)
    }

    linkDialogVisible: boolean = false
    link: string = ''
    linkToShow: string = ''

    openLinkDialog() {
        this.linkDialogVisible = true
    }

    addLink() {
        console.log('Enlace agregado: ', this.link)
        this.linkToShow = this.link
        this.linkDialogVisible = false
        this.link = ''
    }

    cerrarModal() {
        this.displayModal = false
    }

    niveldelogrosDropdownItems = [
        { name: '01', code: 'A' },
        { name: '02', code: 'B' },
        { name: '02', code: 'C' },
        { name: '02', code: 'C' },
    ]

    submit() {
        const value = this.tareaForm.value
        console.log(value)

        if (this.tareaForm.invalid) {
            this.tareaForm.markAllAsTouched()
            return
        }
        this.submitEvent.emit(value)
    }

    cancel() {
        this.tareaForm.reset()
        this.cancelEvent.emit()
    }
}
