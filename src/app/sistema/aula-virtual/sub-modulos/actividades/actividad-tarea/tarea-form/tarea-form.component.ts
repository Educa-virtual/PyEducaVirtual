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
import { DynamicDialogRef } from 'primeng/dynamicdialog'
import { GeneralService } from '@/app/servicios/general.service'
import { FileUploadPrimengComponent } from '../../../../../../shared/file-upload-primeng/file-upload-primeng.component'
import { PickListModule } from 'primeng/picklist'

@Component({
    selector: 'app-tarea-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        PickListModule,
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
        FileUploadPrimengComponent,
    ],
    templateUrl: './tarea-form.component.html',
    styleUrl: './tarea-form.component.scss',
})
export class TareaFormComponent implements OnInit {
    @Output() submitEvent = new EventEmitter<any>()
    @Output() cancelEvent = new EventEmitter<void>()

    FilesTareas: any[] = []
    FilesInstrumentos: any[] = []

    private _formBuilder = inject(FormBuilder)
    private GeneralService = inject(GeneralService)

    private ref = inject(DynamicDialogRef)
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

    estudiantes: any[] = []

    // nota
    puntajeArray: { name: string; code: string }[] = []

    ngOnInit() {
        this.getEstudiantesMatricula()

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
        cTareaArchivoAdjunto: [],
        cTareaIndicaciones: [''],
        dFechaEvaluacionPublicacion: [''],
        tHoraEvaluacionPublicacion: [''],
        dFechaEvaluacionPublicacionInicio: [''],
        tHoraEvaluacionPublicacionInicio: [''],
        dFechaEvaluacionPublicacionFin: [''],
        tHoraEvaluacionPublicacionFin: [''],

        iActTipoId: [],
        iContenidoSemId: [],
    })
    displayModal: boolean = false

    mostrarModal() {
        this.displayModal = true
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
        { name: '03', code: 'C' },
        { name: '04', code: 'C' },
    ]

    submit() {
        this.tareaForm.controls.cTareaArchivoAdjunto.setValue(
            JSON.stringify(this.FilesTareas)
        )
        const value = this.tareaForm.value

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
    guardarDatos() {
        this.tareaForm.reset()
        this.cancelEvent.emit()
    }

    handleAction(elemento): void {
        const { accion } = elemento
        const { item } = elemento

        switch (accion) {
            case 'subir-archivo-tareas':
                this.FilesTareas.push({
                    name: item.file.name,
                    size: item.file.size,
                    ruta: item.name,
                })
                break
            case 'subir-archivo-instrumentos':
                this.FilesInstrumentos.push({
                    name: item.file.name,
                    size: item.file.size,
                    ruta: item.name,
                })
                break
        }
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
        console.log(this.getInformation)

        this.getInformation(params)
    }

    // obtenerEstudiantes(){
    //     const userId = 1;
    //     this.getEstudiantesMatricula(params).subscribe((Data) => this.estudiantes = Data['data'])
    // }

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
}
