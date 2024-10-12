import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component'
import { CommonModule } from '@angular/common'
import { Component, EventEmitter, inject, Output, OnInit } from '@angular/core'
import { DropdownModule } from 'primeng/dropdown'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { EditorModule } from 'primeng/editor'
import { DisponibilidadFormComponent } from '../../components/disponibilidad-form/disponibilidad-form.component'
import { CountryService } from '@/app/demo/service/country.service'
import { CalendarModule } from 'primeng/calendar'
@Component({
    selector: 'app-tarea-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CommonInputComponent,
        EditorModule,
        DropdownModule,
        DisponibilidadFormComponent,
        CalendarModule,
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

    ngOnInit() {
        this.countryService.getCountries().then((countries) => {
            this.countries = countries
        })
    }

    public tareaForm = this._formBuilder.group({
        cTareaTitulo: ['', [Validators.required]],
        cTareaDescripcion: ['', [Validators.required]],
        cTareaIndicaciones: [''],
        dFechaEvaluacionPublicacion: [''],
        tHoraEvaluacionPublicacion: [''],
    })

    dropdownItems = [
        { name: 'Todo el grupo', code: 'Option 1' },
        { name: 'Option 2', code: 'Option 2' },
        { name: 'Option 3', code: 'Option 3' },
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
