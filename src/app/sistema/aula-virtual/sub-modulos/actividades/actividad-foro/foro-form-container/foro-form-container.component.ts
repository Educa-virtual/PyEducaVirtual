import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component'
import { CommonModule } from '@angular/common'
import { Component, inject, OnInit, Input } from '@angular/core'
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'
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

    public foroForm: FormGroup = this._formBuilder.group({
        cForoTitulo: ['', [Validators.required]],
        cForoDescripcion: ['', [Validators.required]],
        iForoCatId: [0, [Validators.required]],
        dtForoInicio: [''],
        iEstado: [0, Validators.required],
        dtForoPublicacion: ['dtForoInicio'],
        dtForoFin: [],
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
        const value = this.foroForm.value
        console.log('Guardar Foros', value)

        //this._aulaService.guardarForo(value).subscribe((Data) => {})
        //     // this.categorias = Data['data']
        //     // console.log('Datos mit', this.categorias)
        // })
    }
    showModal: boolean = false
    typeUpload: string
    // openUpload(type) {
    //     this.showModal = true
    //     this.typeUpload = type
    //     this.titleFileTareas = ''
    //     switch (type) {
    //         case 'file':
    //             this.titleFileTareas = 'Añadir Archivo Local'
    //             break
    //         case 'url':
    //             this.titleFileTareas = 'Añadir Enlace URL'
    //             break
    //         default:
    //             this.showModal = false
    //             this.typeUpload = null
    //             break
    //     }
    // }
    // accionBtnItem(elemento): void {
    //     const { accion } = elemento
    //     const { item } = elemento
    //     // let params
    //     switch (accion) {
    //         case 'get_tareas_reutilizadas':
    //             this.tareas = item
    //             this.filteredTareas = item
    //             break
    //         case 'close-modal':
    //             this.showModal = false
    //             break
    //         case 'subir-archivo-tareas':
    //             this.FilesTareas.push({
    //                 type: 1, //1->file
    //                 nameType: 'file',
    //                 name: item.file.name,
    //                 size: item.file.size,
    //                 ruta: item.name,
    //             })
    //             this.showModal = false
    //             break
    //         case 'subir-url':
    //             if (item === '') return
    //             this.FilesTareas.push({
    //                 type: 2, //2->url
    //                 nameType: 'url',
    //                 name: item,
    //                 size: '',
    //                 ruta: item,
    //             })
    //             this.showModal = false
    //             this.nameEnlace = ''
    //             break
    //         case 'subir-youtube':
    //             if (item === '') return
    //             this.FilesTareas.push({
    //                 type: 3, //3->youtube
    //                 nameType: 'youtube',
    //                 name: item,
    //                 size: '',
    //                 ruta: item,
    //             })
    //             this.showModal = false
    //             this.nameEnlace = ''
    //             break
    //     }
    // }
}
