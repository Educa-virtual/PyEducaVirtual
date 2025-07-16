import { TiemposDuracionService } from './../../services/tiempos-duracion.service'
import { Component, OnInit } from '@angular/core'
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'
import { InputGroupModule } from 'primeng/inputgroup'
import { InputGroupAddonModule } from 'primeng/inputgroupaddon'
import { CalendarModule } from 'primeng/calendar'
import { DropdownModule } from 'primeng/dropdown'
import { CheckboxModule } from 'primeng/checkbox'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { Router } from '@angular/router'
import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular'
import { SelectItem } from 'primeng/api'

@Component({
    selector: 'app-informacion-general',
    standalone: true,
    imports: [
        FormsModule,
        InputTextModule,
        InputGroupModule,
        InputGroupAddonModule,
        CalendarModule,
        DropdownModule,
        CheckboxModule,
        ButtonModule,
        ReactiveFormsModule,
        EditorComponent,
    ],
    templateUrl: './informacion-general.component.html',
    styleUrl: './informacion-general.component.scss',
    providers: [
        { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
    ],
})
export class InformacionGeneralComponent implements OnInit {
    form: FormGroup
    dataTiemposDuracion: SelectItem[] = []

    initConsideraciones: EditorComponent['init'] = {
        base_url: '/tinymce',
        suffix: '.min',
        menubar: false,
        selector: 'textarea',
        placeholder: 'Escriba aquí...',
        height: 200,
        toolbar: false,
        paste_as_text: true,
        branding: false,
        statusbar: false,
    }

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private tiemposDuracionService: TiemposDuracionService
    ) {
        this.form = this.fb.group({
            cConfEncNombre: ['', Validators.required],
            cConfEncSubNombre: [''],
            cConfEncDesc: [''],
            dConfEncInicio: ['', Validators.required],
            dConfEncFin: ['', Validators.required],
            iTiemDurId: ['', Validators.required],
            iCategoriaEncuestaId: ['', Validators.required],
        })
    }
    ngOnInit(): void {
        this.obtenerTIemposDuracion()
        /*this.tiempos = [
            { label: '1 mes', value: '1 mes' },
            { label: '2 meses', value: '2 meses' },
            { label: '3 meses', value: '3 meses' },
            { label: '4 meses', value: '4 meses' },
            { label: '5 meses', value: '5 meses' },
            { label: '6 meses', value: '6 meses' },
        ]*/
    }

    obtenerTIemposDuracion() {
        this.tiemposDuracionService.obtenerTiemposDuracion().subscribe({
            next: (resp: any) => {
                this.dataTiemposDuracion = resp.data.map((item: any) => ({
                    label: item.cTiemDurNombre,
                    value: item.iTiemDurId,
                }))
            },
            error: (error) => {
                console.error('Error al obtener los tiempos de duración', error)
            },
        })
    }

    nextRoute() {
        this.router.navigate([
            '/encuestas/configuracion-encuesta/poblacion-objetivo',
        ])
    }
}
